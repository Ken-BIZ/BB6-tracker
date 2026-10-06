-- BB6 Tracker — automatically delete data of sections beyond each module's 小節數
-- Run this once in the Supabase SQL editor; safe to run more than once.
--
-- Whenever settings_baseline is saved with a changed video_sections (完工預測設定
-- → 儲存設定) or the row is deleted (重設), scores and log rows whose section
-- number is greater than the module's 小節數 are PERMANENTLY deleted. A module
-- with no 小節數 set counts as 20, the same default the app uses.
--
-- security definer: the app's anon key has no delete policy on scores / log,
-- so the function deletes with the owner's rights instead.

create or replace function trim_sections_beyond_count() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  counts jsonb;
begin
  if tg_op = 'DELETE' then
    counts := '{}'::jsonb;
  else
    counts := coalesce(new.video_sections, '{}'::jsonb);
    if tg_op = 'UPDATE' and new.video_sections is not distinct from old.video_sections then
      return null;
    end if;
  end if;

  delete from scores s
   where substring(s.section from '^[0-9]+\.([0-9]+)$')::int >
         coalesce(nullif(nullif(counts ->> s.module, '')::int, 0), 20);

  delete from log l
   where substring(l.section from '^[0-9]+\.([0-9]+)$')::int >
         coalesce(nullif(nullif(counts ->> l.module, '')::int, 0), 20);

  return null;
end $$;

drop trigger if exists settings_baseline_trim_sections on settings_baseline;
create trigger settings_baseline_trim_sections
  after insert or update or delete on settings_baseline
  for each row execute function trim_sections_beyond_count();
