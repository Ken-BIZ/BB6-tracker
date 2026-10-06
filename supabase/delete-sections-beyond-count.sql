-- BB6 Tracker — delete data for sections beyond each module's 小節數 (one-off, 2026-10-06)
-- Run this in the Supabase SQL editor AFTER the 小節數 in 完工預測設定 are final.
--
-- A section like 1.17 is removed from scores and log when 17 is greater than
-- the module's current 小節數 in settings_baseline.video_sections (20 when unset,
-- same default as the app). Those sections are already hidden on every page.
--
-- Runs in one transaction, and keeps a copy of both tables first.

begin;

create table scores_backup_20261006_trim as select * from scores;
create table log_backup_20261006_trim    as select * from log;
alter table scores_backup_20261006_trim enable row level security;
alter table log_backup_20261006_trim    enable row level security;

delete from scores s
 using settings_baseline b
 where b.id = 1
   and s.section ~ '^[0-9]+\.[0-9]+$'
   and split_part(s.section, '.', 2)::int >
       coalesce(nullif(nullif(b.video_sections ->> s.module, '')::int, 0), 20);

delete from log l
 using settings_baseline b
 where b.id = 1
   and l.section ~ '^[0-9]+\.[0-9]+$'
   and split_part(l.section, '.', 2)::int >
       coalesce(nullif(nullif(b.video_sections ->> l.module, '')::int, 0), 20);

commit;

-- Result: rows removed per module (before − after)
select b.module,
       b.rows as scores_before,
       coalesce(a.rows, 0) as scores_after,
       b.rows - coalesce(a.rows, 0) as scores_deleted
  from (select module, count(*) as rows from scores_backup_20261006_trim group by module) b
  left join (select module, count(*) as rows from scores group by module) a using (module)
 order by b.module;
