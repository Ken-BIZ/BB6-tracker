-- BB6 Tracker — OKR page (objectives, key results, manual progress updates)
-- Run this once in the Supabase SQL editor BEFORE deploying the index.html
-- with the OKR tab; safe to run more than once.
--
-- okr_objectives   one row per Objective, grouped by a free-text quarter label
-- okr_key_results  KRs of an objective. metric decides how the current value is
--                  measured: 'project_completion' = 整體專案完成度 (computed by
--                  the app), 'manual' = current_value typed in by an updater
-- okr_updates      history of every manual update (who, when, value, note)
--
-- Seeds 2026 Q4 with the objective and two KRs once; later quarters are
-- added on the OKR page by Daniel.

create table if not exists okr_objectives (
  id          bigint generated always as identity primary key,
  quarter     text not null,
  title       text not null,
  start_date  date not null,
  end_date    date not null,
  created_at  timestamptz not null default now()
);

create table if not exists okr_key_results (
  id             bigint generated always as identity primary key,
  objective_id   bigint not null references okr_objectives(id) on delete cascade,
  title          text not null,
  metric         text not null default 'manual',
  target         numeric not null default 100,
  current_value  numeric not null default 0,
  updaters       jsonb not null default '[]',
  sort           integer not null default 0,
  updated_by     text,
  updated_at     timestamptz not null default now()
);

create table if not exists okr_updates (
  id          bigint generated always as identity primary key,
  kr_id       bigint not null references okr_key_results(id) on delete cascade,
  value       numeric not null,
  note        text,
  member      text,
  created_at  timestamptz not null default now()
);

-- Same open policies as the rest of the app (no login; anon key). Who may
-- edit is enforced on the page: Daniel edits O/KR, each KR lists its updaters.
alter table okr_objectives  enable row level security;
alter table okr_key_results enable row level security;
alter table okr_updates     enable row level security;

drop policy if exists "public all okr_objectives"  on okr_objectives;
drop policy if exists "public all okr_key_results" on okr_key_results;
drop policy if exists "public all okr_updates"     on okr_updates;
create policy "public all okr_objectives"  on okr_objectives  for all using (true) with check (true);
create policy "public all okr_key_results" on okr_key_results for all using (true) with check (true);
create policy "public all okr_updates"     on okr_updates     for all using (true) with check (true);

-- 2026 Q4 seed (skipped if that quarter already exists)
with o as (
  insert into okr_objectives (quarter, title, start_date, end_date)
  select '2026 Q4', '完成 BOP 6.0 Workshop 的上線準備作業，2027 年 3 月開始提供服務', '2026-10-01', '2026-12-31'
   where not exists (select 1 from okr_objectives where quarter = '2026 Q4')
  returning id
)
insert into okr_key_results (objective_id, title, metric, target, updaters, sort)
select id, '教材翻譯進度', 'project_completion', 80, '[]'::jsonb, 1 from o
union all
select id, 'WS 課綱與技術指示', 'manual', 50, '["Daniel","Ken"]'::jsonb, 2 from o;

select o.quarter, o.title, k.title as kr, k.metric, k.target, k.updaters
  from okr_objectives o left join okr_key_results k on k.objective_id = o.id
 order by o.start_date desc, k.sort;
