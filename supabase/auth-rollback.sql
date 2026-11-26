-- 緊急恢復：把資料權限改回「不用登入就能讀寫」（auth-2-lock.sql 之前的狀態）
-- 同時把 Vercel 的 AUTH_DOMAIN 刪掉並重新部署，網站就回到選名字的舊模式。

do $$
declare r record;
begin
  for r in select tablename, policyname from pg_policies
           where schemaname = 'public'
             and tablename = any (array['scores','log','settings_baseline','okr_objectives','okr_key_results','okr_updates'])
  loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

create policy "public read scores"   on public.scores for select using (true);
create policy "public write scores"  on public.scores for insert with check (true);
create policy "public update scores" on public.scores for update using (true) with check (true);
create policy "public read log"      on public.log    for select using (true);
create policy "public write log"     on public.log    for insert with check (true);
create policy "public read baseline"   on public.settings_baseline for select using (true);
create policy "public write baseline"  on public.settings_baseline for insert with check (true);
create policy "public update baseline" on public.settings_baseline for update using (true) with check (true);
create policy "public delete baseline" on public.settings_baseline for delete using (true);
create policy "public all okr_objectives"  on public.okr_objectives  for all using (true) with check (true);
create policy "public all okr_key_results" on public.okr_key_results for all using (true) with check (true);
create policy "public all okr_updates"     on public.okr_updates     for all using (true) with check (true);
