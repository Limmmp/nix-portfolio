-- ============================================================
-- ЮРИДИЧЕСКАЯ ЧАСТЬ: СОГЛАСИЕ НА ОБРАБОТКУ ПД (применено 2026-08-15)
--
-- Сайт собирает персональные данные через форму обратной связи
-- (имя, компания, email, текст обращения), поэтому по 152-ФЗ нужны
-- политика обработки ПД и подтверждаемое согласие.
--
-- consent_at / policy_version пишутся вместе с заявкой: оператор должен
-- уметь доказать, что согласие было получено и с какой редакцией
-- политики человек согласился.
--
-- Реквизиты оператора лежат в site_settings.legal — это публичные данные,
-- они и так печатаются в политике на сайте (в отличие от токена бота,
-- который живёт в admin-only таблице integrations).
--
-- ВНИМАНИЕ: тексты подготовлены как рабочая основа, не как юридическое
-- заключение. Перед публикацией показать юристу.
-- ============================================================

alter table public.leads
  add column if not exists consent_at timestamptz,
  add column if not exists policy_version text;

insert into public.site_settings (key, value)
values ('legal', jsonb_build_object(
  'operator_name', '',
  'operator_type', '',
  'inn', '',
  'ogrn', '',
  'address', '',
  'email', 'nixoffers@gmail.com',
  'policy_version', to_char(now(), 'YYYY-MM-DD')
))
on conflict (key) do nothing;
