-- BB6 Tracker — KR deadline and milestones (OKR page「時程」)
-- Run once in the Supabase SQL editor; safe to run more than once.
--
-- due_date    the KR's own deadline; NULL = the objective's end_date
-- milestones  [{ "date": "2026-11-30", "value": 50, "note": "..." }, ...]
--             「依時程應達」 runs from the value at the objective start through
--             each milestone to the target on the deadline
-- Who may edit (Daniel, Ken) is enforced on the page, like the rest of OKR.

alter table okr_key_results add column if not exists due_date   date;
alter table okr_key_results add column if not exists milestones jsonb not null default '[]';

select id, title, target, due_date, milestones from okr_key_results order by objective_id, sort;
