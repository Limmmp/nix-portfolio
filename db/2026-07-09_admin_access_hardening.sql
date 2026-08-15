-- ============================================================
-- МОДЕЛЬ ДОСТУПА АДМИНКИ (применено в Supabase 2026-07-09)
--
-- Проблема, которую чинили:
-- политики были написаны как «любой авторизованный = админ»
-- (to authenticated), а публичная регистрация в проекте включена.
-- То есть посторонний мог зарегистрироваться и получить доступ
-- к заявкам с контактами клиентов и к правке всего контента.
--
-- Решение: права выдаются только пользователям из public.admins.
-- Регистрация сама по себе не даёт ничего.
--
-- ВАЖНО: чтобы добавить нового админа, мало создать пользователя
-- в auth — нужно внести его user_id в public.admins, иначе он
-- войдёт в панель, но не сможет ничего сохранить.
-- ============================================================

-- 1. Список админов
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  note text not null default ''
);
alter table public.admins enable row level security;

-- 2. Проверка «текущий пользователь — админ?»
--    SECURITY DEFINER, чтобы политики не уходили в рекурсию при чтении admins.
--    Фиксированный search_path — защита от подмены схемы.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- 3. Текущие администраторы
insert into public.admins (user_id, note)
select id, email from auth.users
where email in ('vesenniy.jakor@gmail.com', 'nix@nix.gg')
on conflict (user_id) do nothing;

drop policy if exists "admin read admins" on public.admins;
create policy "admin read admins" on public.admins
  for select using (public.is_admin());

-- 4. Контент: читают все, пишет только админ
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','hero_stats','about_slides',
    'platforms','brands','highlight_videos','awards'
  ] loop
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format(
      'create policy "admin write" on public.%I for all
         using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- 5. Заявки: оставить может кто угодно, читать/менять — только админ
drop policy if exists "admin read"   on public.leads;
drop policy if exists "admin update" on public.leads;
drop policy if exists "admin delete" on public.leads;
create policy "admin read"   on public.leads for select using (public.is_admin());
create policy "admin update" on public.leads for update using (public.is_admin()) with check (public.is_admin());
create policy "admin delete" on public.leads for delete using (public.is_admin());

-- 6. Посещения и история изменений
drop policy if exists "admin read" on public.visits;
create policy "admin read" on public.visits for select using (public.is_admin());

drop policy if exists "admin all" on public.content_backups;
create policy "admin all" on public.content_backups
  for all using (public.is_admin()) with check (public.is_admin());

-- 7. Хранилище media: загрузка/изменение/удаление и перечисление файлов —
--    только админ. Картинки на сайте продолжают открываться: бакет публичный,
--    прямые ссылки /storage/v1/object/public/media/... не проверяют RLS.
drop policy if exists "public read media" on storage.objects;
drop policy if exists "auth insert media" on storage.objects;
drop policy if exists "auth update media" on storage.objects;
drop policy if exists "auth delete media" on storage.objects;
create policy "admin list media"   on storage.objects for select using (bucket_id = 'media' and public.is_admin());
create policy "admin insert media" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
create policy "admin update media" on storage.objects for update using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
create policy "admin delete media" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

-- Проверка: должно вернуть двух админов
select u.email, a.user_id from public.admins a join auth.users u on u.id = a.user_id;
