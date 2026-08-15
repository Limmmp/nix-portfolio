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
-- Получателей может быть несколько: value.recipients = [{chat_id, name,
-- enabled}]. Каждому шлётся отдельный запрос, поэтому недоступный адресат
-- (человек не нажал боту /start) не мешает остальным получить заявку.
-- Старый одиночный value.chat_id продолжает работать как запасной вариант.
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

-- Список получателей: новый формат recipients, с откатом на старый chat_id
create or replace function public.tg_recipients(cfg jsonb)
returns text[]
language sql
stable
as $$
  select coalesce(
    nullif(
      (select array_agg(r->>'chat_id')
       from jsonb_array_elements(coalesce(cfg->'recipients', '[]'::jsonb)) r
       where coalesce((r->>'enabled')::boolean, true)
         and coalesce(r->>'chat_id', '') <> ''),
      array[]::text[]
    ),
    case when coalesce(cfg->>'chat_id', '') <> '' then array[cfg->>'chat_id'] else array[]::text[] end
  );
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
  chats text[];
  chat text;
  msg text;
  type_label text;
begin
  select value into cfg from public.integrations where key = 'telegram';
  if cfg is null or coalesce((cfg->>'enabled')::boolean, false) is not true then
    return new;
  end if;

  token := cfg->>'bot_token';
  chats := public.tg_recipients(cfg);
  if coalesce(token, '') = '' or coalesce(array_length(chats, 1), 0) = 0 then
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

  -- Каждому получателю отдельно: недоступный адресат не мешает остальным
  foreach chat in array chats loop
    perform net.http_post(
      url := 'https://api.telegram.org/bot' || token || '/sendMessage',
      body := jsonb_build_object('chat_id', chat, 'text', msg, 'parse_mode', 'HTML'),
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  end loop;

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

-- Кнопка теста в админке: шлёт сообщение, не создавая заявку.
-- target пустой — отправить всем получателям, иначе только указанному.
create or replace function public.tg_send_test(target text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, net
as $$
declare
  cfg jsonb;
  token text;
  chats text[];
  chat text;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  select value into cfg from public.integrations where key = 'telegram';
  token := cfg->>'bot_token';
  chats := case when coalesce(target, '') <> '' then array[target] else public.tg_recipients(cfg) end;

  if coalesce(token, '') = '' then
    return jsonb_build_object('ok', false, 'reason', 'не заполнен токен бота');
  end if;
  if coalesce(array_length(chats, 1), 0) = 0 then
    return jsonb_build_object('ok', false, 'reason', 'не добавлен ни один получатель');
  end if;

  foreach chat in array chats loop
    perform net.http_post(
      url := 'https://api.telegram.org/bot' || token || '/sendMessage',
      body := jsonb_build_object(
        'chat_id', chat,
        'text', '✅ <b>Проверка связи</b>' || E'\n' || 'Уведомления о заявках с сайта NIX подключены.',
        'parse_mode', 'HTML'
      ),
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  end loop;

  return jsonb_build_object('ok', true, 'sent_to', array_length(chats, 1));
end;
$$;

revoke all on function public.tg_send_test(text) from public, anon;
grant execute on function public.tg_send_test(text) to authenticated;

-- Проверка доставки: net._http_response хранит ответы Telegram
-- select status_code, content::jsonb->>'ok' from net._http_response order by created desc limit 5;
