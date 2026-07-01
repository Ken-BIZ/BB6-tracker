-- BB6 Tracker — Supabase schema (replaces Firebase Realtime Database)
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists scores (
  module   text not null,
  section  text not null,
  task_id  text not null,
  score    integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (module, section, task_id)
);

create table if not exists log (
  id        bigint generated always as identity primary key,
  module    text not null,
  section   text not null,
  task_id   text not null,
  score     integer not null,
  member    text,
  ts        text not null,
  created_at timestamptz not null default now()
);

create table if not exists settings_baseline (
  id                  integer primary key default 1,
  task_hours          jsonb not null default '{}',
  module_start        jsonb not null default '{}',
  video_sections      jsonb not null default '{}',
  non_video_sections  jsonb not null default '{}',
  hours_per_week      integer not null default 30,
  constraint settings_baseline_singleton check (id = 1)
);

-- The app has no login/auth (same as the old Firebase setup), so it talks to
-- Postgres with the public anon key. RLS is enabled but left open — mirrors
-- the previous Firebase rules (public read/write).
alter table scores enable row level security;
alter table log enable row level security;
alter table settings_baseline enable row level security;

create policy "public read scores"   on scores   for select using (true);
create policy "public write scores"  on scores   for insert with check (true);
create policy "public update scores" on scores   for update using (true) with check (true);

create policy "public read log"      on log      for select using (true);
create policy "public write log"     on log      for insert with check (true);

create policy "public read baseline"   on settings_baseline for select using (true);
create policy "public write baseline"  on settings_baseline for insert with check (true);
create policy "public update baseline" on settings_baseline for update using (true) with check (true);
create policy "public delete baseline" on settings_baseline for delete using (true);

-- Enable realtime (live score updates across clients)
alter publication supabase_realtime add table scores;
