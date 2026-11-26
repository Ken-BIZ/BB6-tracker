-- Google 登入 第 3 步：鎖住資料（Google 登入確認可以用之後才跑）
-- 讀：只限用 Google 登入的 @hcatwn.com 帳號；寫：只限 bb6_members 裡的成員。
-- 跑完之後，沒登入的人（包括知道網址的外部人士）讀不到也改不了任何資料。
-- 要恢復原狀：跑 auth-rollback.sql。

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

-- 讀
create policy "company read" on public.scores            for select to authenticated using (public.bb6_is_company());
create policy "company read" on public.log               for select to authenticated using (public.bb6_is_company());
create policy "company read" on public.settings_baseline for select to authenticated using (public.bb6_is_company());
create policy "company read" on public.okr_objectives    for select to authenticated using (public.bb6_is_company());
create policy "company read" on public.okr_key_results   for select to authenticated using (public.bb6_is_company());
create policy "company read" on public.okr_updates       for select to authenticated using (public.bb6_is_company());

-- 寫（和原本一樣的動作範圍：scores 新增／更新，log 只新增，設定與 OKR 可新增／更新／刪除）
create policy "member insert" on public.scores for insert to authenticated with check (public.bb6_member() is not null);
create policy "member update" on public.scores for update to authenticated using (public.bb6_member() is not null) with check (public.bb6_member() is not null);
create policy "member insert" on public.log    for insert to authenticated with check (public.bb6_member() is not null);

create policy "member insert" on public.settings_baseline for insert to authenticated with check (public.bb6_member() is not null);
create policy "member update" on public.settings_baseline for update to authenticated using (public.bb6_member() is not null) with check (public.bb6_member() is not null);
create policy "member delete" on public.settings_baseline for delete to authenticated using (public.bb6_member() is not null);

create policy "member write" on public.okr_objectives  for all to authenticated using (public.bb6_member() is not null) with check (public.bb6_member() is not null);
create policy "member write" on public.okr_key_results for all to authenticated using (public.bb6_member() is not null) with check (public.bb6_member() is not null);
create policy "member write" on public.okr_updates     for all to authenticated using (public.bb6_member() is not null) with check (public.bb6_member() is not null);
