-- BB6 Tracker — modules counted in 年底目標完成度 (ticked in 完工預測設定)
-- Run this once in the Supabase SQL editor BEFORE deploying the index.html
-- that saves year_end_targets; safe to run more than once.
--
-- Starts with C1–C6 ticked: the modules currently forecast to finish by 12/31,
-- so the 年底目標完成度 number stays the same until someone changes the ticks.

alter table settings_baseline
  add column if not exists year_end_targets jsonb not null default '[]';

update settings_baseline
   set year_end_targets = '["C1","C2","C3","C4","C5","C6"]'
 where id = 1 and year_end_targets = '[]'::jsonb;

select id, year_end_targets from settings_baseline;
