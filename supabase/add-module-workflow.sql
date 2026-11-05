-- BB6 Tracker — per-module workflow (舊流程 / AI 協作流程, set in 完工預測設定)
-- Run this once in the Supabase SQL editor BEFORE deploying the index.html
-- that saves module_workflow; safe to run more than once.
--
-- Values are 'legacy' or 'ai'. Modules missing from the map fall back to the
-- app default: C1–C5, TA1, TA4 use 舊流程, every other module uses AI 協作流程.

alter table settings_baseline
  add column if not exists module_workflow jsonb not null default '{}';

select id, module_workflow from settings_baseline;
