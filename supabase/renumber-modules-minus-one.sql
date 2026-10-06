-- BB6 Tracker — renumber modules C2..C10 → C1..C9 (one-off, 2026-10-06)
-- Run this ONCE in the Supabase SQL editor (Project → SQL Editor → New query),
-- at the same time as deploying the index.html that uses MODULES = C1..C9.
--
-- Moves, for every module Cn → C(n-1):
--   scores / log        module column, and the section prefix (2.1 → 1.1)
--   settings_baseline   the Cn keys inside module_start / video_sections /
--                       non_video_sections (so each module keeps its 小節數)
--
-- Everything runs in one transaction: if any step fails, nothing is changed.
-- Running it a second time fails at step 1 (the backup tables already exist),
-- so the data cannot be shifted twice by accident.

begin;

-- 1. Backups (RLS on with no policies, so they are not exposed to the anon key)
create table scores_backup_20261006            as select * from scores;
create table log_backup_20261006               as select * from log;
create table settings_baseline_backup_20261006 as select * from settings_baseline;
alter table scores_backup_20261006            enable row level security;
alter table log_backup_20261006               enable row level security;
alter table settings_baseline_backup_20261006 enable row level security;

-- 2. scores + log. Ascending order (C2 first) so the scores primary key
--    (module, section, task_id) never collides with a module not yet moved.
do $$
declare
  n integer;
begin
  if exists (select 1 from scores where module = 'C1')
     or exists (select 1 from log where module = 'C1') then
    raise exception 'C1 rows already exist — aborting, nothing changed';
  end if;

  for n in 2..10 loop
    update scores
       set module  = 'C' || (n - 1),
           section = regexp_replace(section, '^' || n || '\.', (n - 1) || '.')
     where module = 'C' || n;

    update log
       set module  = 'C' || (n - 1),
           section = regexp_replace(section, '^' || n || '\.', (n - 1) || '.')
     where module = 'C' || n;
  end loop;
end $$;

-- 3. settings_baseline: shift the Cn keys of each per-module JSON map down by one
create function pg_temp.shift_module_keys(j jsonb) returns jsonb
language sql as $$
  select coalesce(jsonb_object_agg(
           case when key ~ '^C[0-9]+$'
                then 'C' || (substring(key from 2)::int - 1)
                else key end,
           value), '{}'::jsonb)
    from jsonb_each(coalesce(j, '{}'::jsonb))
   where key <> 'C1'
$$;

update settings_baseline
   set module_start       = pg_temp.shift_module_keys(module_start),
       video_sections     = pg_temp.shift_module_keys(video_sections),
       non_video_sections = pg_temp.shift_module_keys(non_video_sections);

commit;

-- 4. Check the result: per-module row counts should match the backup shifted by one,
--    and video_sections should list C1..C9 with the old C2..C10 values.
select 'after'  as state, module, count(*) as score_rows from scores group by module
union all
select 'before' as state, module, count(*) from scores_backup_20261006 group by module
order by state desc, module;

select 'after' as state, video_sections, module_start from settings_baseline
union all
select 'before', video_sections, module_start from settings_baseline_backup_20261006;
