-- ============================================================
-- УВЕДОМЛЕНИЯ О ЗАЯВКАХ В TELEGRAM (применено 2026-08-15)
--
-- Доставку делает сама база: триггер на вставку в leads шлёт сообщение
-- через pg_net. Раньше это пытался делать браузер посетителя после
-- отправки формы — при обрыве связи или блокировщике заявка сохранялась,
-- а уведомление терялось.
--
-- Токен бота лежит в public.integrations — таблице с доступом только для
-- админов. В public.site_settings его класть нельзя: те настройки
-- читаются анонимно (это контент сайта).
--
-- Настраивается из админки: Настройки → Уведомления в Telegram.
-- ============================================================

create extension if not exists pg_net;

create table if not exists public.integrations (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.integrations enable row level security;

drop policy if exists "admin all" on public.integrations;
create policy "admin all" on public.integrations
  for all using (public.is_admin()) with check (public.is_admin());

-- Экранирование, чтобы текст заявки не ломал HTML-разметку сообщения
create or replace function public.tg_escape(t text)
returns text language sql immutable as $$
  select replace(replace(replace(coalesce(t, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;');
$$;

create or replace function public.notify_lead_telegram()
returns trigger
language plpgsql
security definer
set search_path = public, net
as $$
declare
  cfg jsonb;
  token text;
  chat text;
  msg text;
  type_label text;
begin
  select value into cfg from public.integrations where key = 'telegram';
  if cfg is null or coalesce((cfg->>'enabled')::boolean, false) is not true then
    return new;
  end if;

  token := cfg->>'bot_token';
  chat := cfg->>'chat_id';
  if coalesce(token, '') = '' or coalesce(chat, '') = '' then
    return new;
  end if;

  type_label := case new.type
    when 'partnership' then 'Партнёрство'
    when 'sponsorship' then 'Спонсорство'
    when 'integration' then 'Интеграция на стриме'
    when 'tournament' then 'Турнир / Ивент'
    when 'other' then 'Другое'
    else coalesce(new.type, '—')
  end;

  msg := '🔴 <b>Новая заявка с сайта NIX</b>' || E'\n\n'
      || '<b>Имя:</b> ' || public.tg_escape(new.name) || E'\n'
      || '<b>Компания:</b> ' || public.tg_escape(new.company) || E'\n'
      || '<b>Email:</b> ' || public.tg_escape(new.email) || E'\n'
      || '<b>Тип:</b> ' || public.tg_escape(type_label) || E'\n\n'
      || public.tg_escape(new.message);

  perform net.http_post(
    url := 'https://api.telegram.org/bot' || token || '/sendMessage',
    body := jsonb_build_object('chat_id', chat, 'text', msg, 'parse_mode', 'HTML'),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );

  return new;
exception when others then
  -- Сбой уведомления не должен мешать сохранению заявки
  return new;
end;
$$;

drop trigger if exists leads_notify_telegram on public.leads;
create trigger leads_notify_telegram
after insert on public.leads
for each row execute function public.notify_lead_telegram();

-- Кнопка «Отправить тест» в админке: шлёт сообщение, не создавая заявку
create or replace function public.tg_send_test()
returns jsonb
language plpgsql
security definer
set search_path = public, net
as $$
declare
  cfg jsonb;
  token text;
  chat text;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  select value into cfg from public.integrations where key = 'telegram';
  token := cfg->>'bot_token';
  chat := cfg->>'chat_id';

  if coalesce(token, '') = '' or coalesce(chat, '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'не заполнены токен или chat_id');
  end if;

  perform net.http_post(
    url := 'https://api.telegram.org/bot' || token || '/sendMessage',
    body := jsonb_build_object(
      'chat_id', chat,
      'text', '✅ <b>Проверка связи</b>' || E'\n' || 'Уведомления о заявках с сайта NIX подключены.',
      'parse_mode', 'HTML'
    ),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.tg_send_test() from public, anon;
grant execute on function public.tg_send_test() to authenticated;

-- Проверка доставки: net._http_response хранит ответы Telegram
-- select status_code, content::jsonb->>'ok' from net._http_response order by created desc limit 5;
