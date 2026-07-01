#!/usr/bin/env node
/*
 One-off migration: copy existing data from the Firebase Realtime Database
 into the new Supabase tables (see schema.sql).

 Requires Node 18+ (uses the built-in fetch, no npm install needed).
 Reads SUPABASE_URL / SUPABASE_ANON_KEY from .env — run with:
   node --env-file=.env supabase/migrate-firebase-to-supabase.mjs

 Also needs FIREBASE_DB_URL (the Realtime Database URL, not secret):
   node --env-file=.env supabase/migrate-firebase-to-supabase.mjs \
     FIREBASE_DB_URL=https://bb6-tracker-96eed-default-rtdb.asia-southeast1.firebasedatabase.app
*/

const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL || 'https://bb6-tracker-96eed-default-rtdb.asia-southeast1.firebasedatabase.app';
const SUPABASE_URL    = process.env.SUPABASE_URL;
const SUPABASE_KEY    = process.env.SUPABASE_ANON_KEY;

if (!FIREBASE_DB_URL || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars. Need FIREBASE_DB_URL, SUPABASE_URL, SUPABASE_ANON_KEY (set in .env).');
  process.exit(1);
}

async function fbGet(path) {
  const res = await fetch(`${FIREBASE_DB_URL}/${path}.json`);
  if (!res.ok) throw new Error(`Firebase read failed for ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function supaInsert(table, rows, onConflict) {
  if (!rows.length) return;
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  if (onConflict) url.searchParams.set('on_conflict', onConflict);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: onConflict ? 'resolution=merge-duplicates,return=minimal' : 'return=minimal'
    },
    body: JSON.stringify(rows)
  });
  if (!res.ok) throw new Error(`Supabase write failed for ${table}: ${res.status} ${await res.text()}`);
}

async function migrateScores() {
  const data = await fbGet('scores');
  if (!data) { console.log('No scores data in Firebase.'); return; }
  const rows = [];
  Object.keys(data).forEach(mod => {
    Object.keys(data[mod] || {}).forEach(fbSec => {
      const sec = fbSec.replace(/_/g, '.');
      Object.keys(data[mod][fbSec] || {}).forEach(taskId => {
        rows.push({ module: mod, section: sec, task_id: taskId, score: parseInt(data[mod][fbSec][taskId]) || 0 });
      });
    });
  });
  console.log(`Migrating ${rows.length} score rows...`);
  for (const batch of chunk(rows, 500)) await supaInsert('scores', batch, 'module,section,task_id');
}

async function migrateLog() {
  const data = await fbGet('log');
  if (!data) { console.log('No log data in Firebase.'); return; }
  const rows = Object.values(data).map(e => ({
    module: e.mod, section: e.sec, task_id: e.taskId,
    score: parseInt(e.score) || 0, member: e.member || null, ts: e.ts
  }));
  console.log(`Migrating ${rows.length} log rows...`);
  for (const batch of chunk(rows, 500)) await supaInsert('log', batch);
}

async function migrateBaseline() {
  const data = await fbGet('settings/baseline');
  if (!data) { console.log('No baseline settings in Firebase.'); return; }
  const row = {
    id: 1,
    task_hours: data.taskHours || {},
    module_start: data.moduleStart || {},
    video_sections: data.videoSections || {},
    non_video_sections: data.nonVideoSections || {},
    hours_per_week: data.hoursPerWeek || 30
  };
  console.log('Migrating baseline settings...');
  await supaInsert('settings_baseline', [row], 'id');
}

(async () => {
  await migrateScores();
  await migrateLog();
  await migrateBaseline();
  console.log('Migration complete.');
})().catch(err => { console.error(err); process.exit(1); });
