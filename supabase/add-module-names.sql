-- BB6 Tracker — add per-module display names (shown on 進度填報)
-- Run this once in the Supabase SQL editor BEFORE deploying the index.html
-- that saves module_names; safe to run more than once.

alter table settings_baseline
  add column if not exists module_names jsonb not null default '{}';
