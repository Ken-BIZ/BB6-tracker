-- 新增管理員 Yumin、Luka（AI native 開發人員）
-- 網站內擁有最高權限：可填報任何任務、修改完工預測設定、編輯 OKR 與 KR 時程。
-- 他們不是任務負責人，所以不會出現在組員狀態或看板負責人。
-- 在 Supabase → SQL Editor 貼上整份 → Run。

-- 成員名單原本只允許 Daniel、Ken、Ellen，先放寬
alter table public.bb6_members drop constraint if exists bb6_members_name_check;
alter table public.bb6_members add constraint bb6_members_name_check
  check (name in ('Daniel', 'Ken', 'Ellen', 'Yumin', 'Luka'));

insert into public.bb6_members (email, name) values
  ('yumin@hcatwn.com', 'Yumin'),
  ('luka@hcatwn.com',  'Luka')
on conflict (email) do update set name = excluded.name;

-- 確認：應該看到五個人
select email, name from public.bb6_members order by name;
