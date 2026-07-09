// src/content/defaults.js
// Резервный контент: показывается, если база недоступна.
// Зеркалит сид Supabase — при изменении контента через админку эти данные
// используются только как fallback.

export const DEFAULT_CONTENT = {
  hero: {
    subtitle: 'АЛЕКСАНДР ЛЕВИН • DOTA 2 STREAMER • CONTENT CREATOR'
  },
  heroStats: [
    { value: '1.5M+', label: 'FOLLOWERS', sublabel: 'ALL PLATFORMS' },
    { value: '100M+', label: 'VIEWS', sublabel: 'PER YEAR' },
    { value: '35K+', label: 'AVG VIEWERS', sublabel: 'TWITCH' },
    { value: '7+', label: 'YEARS', sublabel: 'ACTIVE' }
  ],
  aboutSlides: [
    {
      id: 'intro', title: 'NIX', subtitle: 'Alexander Levin',
      description: 'Профессиональный киберспортсмен,\nстример и контент-мейкер.\n"Создаю контент, который вдохновляет."',
      image: '/images/about/about-main.jpg', align: 'left'
    },
    {
      id: 'pro-career', title: 'PRO CAREER', subtitle: 'Ex-pro Dota 2 player',
      description: 'HellRaisers | 2016-2021\nУчастник The International\nПризер и победитель множества турниров',
      image: '/images/about/about-pro.jpg', align: 'right'
    },
    {
      id: 'expertise', title: 'EXPERT', subtitle: 'In MOBA games',
      description: 'Агрессивный playstyle\nЗнаток carry позиции\nХороший стратег',
      image: '/images/about/about-expertise.jpg', align: 'left'
    },
    {
      id: 'now', title: 'NOW', subtitle: 'Streamer & Creator',
      description: 'Forbes 30 до 30\n1M+ community\nЕжедневный контент на Twitch & YouTube',
      image: '/images/about/about-now.jpg', align: 'right'
    }
  ],
  platforms: [
    {
      id: 'twitch', slug: 'twitch', name: 'Twitch', url: 'https://www.twitch.tv/nix', color: '#9146FF', logoUrl: '',
      featured: [
        { label: 'Followers', value: '1.09M' },
        { label: 'Avg Viewers', value: '35K' }
      ],
      metrics: [
        { label: 'Avg Viewers', value: '35K' }, { label: 'Peak Viewers', value: '400K' },
        { label: 'Unique Viewers', value: '5.98M' }, { label: 'Total Views', value: '100M+' }
      ],
      description: '#1 Dota 2 Streamer 2024. Самый просматриваемый стример в СНГ.'
    },
    {
      id: 'youtube', slug: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/@Nixtwitch', color: '#FF0000', logoUrl: '',
      featured: [
        { label: 'Total Views', value: '60M' },
        { label: 'Followers', value: '250K' }
      ],
      metrics: [
        { label: 'Total Views', value: '60M+' }, { label: 'Watch Hours', value: '8.5M' },
        { label: 'New Subs in month', value: '20K+' }, { label: 'Followers', value: '250K+' }
      ],
      description: 'Highlights, клипы и эксклюзивный контент. Быстрорастущий канал.'
    },
    {
      id: 'telegram', slug: 'telegram', name: 'Telegram', url: 'https://t.me/nixtalk', color: '#0088CC', logoUrl: '',
      featured: [
        { label: 'Subscribers', value: '220K' },
        { label: 'Views / Post', value: '70K' }
      ],
      metrics: [
        { label: 'Subscribers', value: '220K+' }, { label: 'Views / Post', value: '70K+' },
        { label: 'Shares / Post', value: '200+' }, { label: 'Reactions / Post', value: '900+' }
      ],
      description: '@nixtalk — новости, анонсы стримов и общение с комьюнити.'
    },
    {
      id: 'tiktok', slug: 'tiktok', name: 'TikTok', url: 'https://www.tiktok.com/@nix', color: '#00f2ea', logoUrl: '',
      featured: [
        { label: 'Pub Views', value: '2M' },
        { label: 'Likes on post', value: '100K' }
      ],
      metrics: [
        { label: 'Pub Views', value: '2M+' }, { label: 'Profile Views', value: '20K+' },
        { label: 'Likes on post', value: '100K+' }, { label: 'Reposts', value: '25K' }
      ],
      description: 'Клипы и моменты со стримов. Быстрорастущая аудитория.'
    }
  ],
  brands: [
    { id: 1, name: 'HAVAL', year: '2024', description: 'Нативная интеграция автомобиля во время стрима. Тест-драйв, обзор функций.' },
    { id: 2, name: 'YANDEX', year: '2024', description: 'Брендирование канала в стиле Yandex Plus. Интеграция в оверлеи.' },
    { id: 3, name: 'KITFORT', year: '2023', description: 'Серия видео с использованием техники. Приготовление еды во время стрима.' },
    { id: 4, name: 'MTS', year: '2024', description: 'Долгосрочное партнёрство. Спонсорство турниров, эксклюзивные тарифы.' },
    { id: 5, name: 'YOTA', year: '2024', description: 'Посты в Telegram и VK о безлимитном интернете для геймеров.' },
    { id: 6, name: 'NUW STORE', year: '2024', description: 'Использование образа в рекламной кампании магазина электроники.' },
    { id: 7, name: 'ТОЧКА БАНК', year: '2023', description: 'Обзор бизнес-карты для стримеров. Интеграция в контент о монетизации.' },
    { id: 8, name: 'САМОКАТ', year: '2024', description: 'Стримы с доставкой еды. Промокоды для зрителей, спонсорские челленджи.' },
    { id: 9, name: 'MAJESTIC', year: '2024', description: 'Амбассадорство сервера в GTA 5 RP. Эксклюзивный контент, турниры.' },
    { id: 10, name: 'GENSHIN', year: '2024', description: 'Стримы по новому обновлению. Ранний доступ, промокоды для зрителей.' },
    { id: 11, name: 'MLBB', year: '2023', description: 'Организация турнира по Mobile Legends. Призовой фонд, трансляция.' },
    { id: 12, name: 'PLAYEROK', year: '2026', description: 'Партнерство с игровым маркетплейсом. Промокод на пополнение Steam без комиссии.' },
    { id: 13, name: 'BETBOOM', year: '2024', description: 'Спонсорство турниров и эксклюзивные бонусы для зрителей.' }
  ],
  partnersAudience: [
    { label: 'Тематика', value: 'Киберспорт, игры' },
    { label: 'Аудитория', value: 'Мужчины 18-34' },
    { label: 'Регионы', value: 'RU / CIS / EU' }
  ],
  partnersFormats: [
    'Нативные интеграции', 'Брендирование канала', 'Авторские интеграции',
    'Посты в соцсетях', 'Права на медиа', 'Амбассадорство'
  ],
  highlights: [
    { id: 1, title: 'The International 2024 Moment', views: '2.5M', platform: 'Twitch', thumbnail: '/images/highlights/highlight-1.jpg', videoUrl: '', featured: true },
    { id: 2, title: 'Epic Comeback Game', views: '1.8M', platform: 'YouTube', thumbnail: '/images/highlights/highlight-2.jpg', videoUrl: '' },
    { id: 3, title: 'Funny Rage Moment', views: '900K', platform: 'TikTok', thumbnail: '/images/highlights/highlight-3.jpg', videoUrl: '' },
    { id: 4, title: 'Best Plays Compilation', views: '750K', platform: 'YouTube', thumbnail: '/images/highlights/highlight-4.jpg', videoUrl: '' },
    { id: 5, title: 'Stream Highlights #47', views: '620K', platform: 'Twitch', thumbnail: '/images/highlights/highlight-5.jpg', videoUrl: '' },
    { id: 6, title: 'Insane Outplay', views: '580K', platform: 'TikTok', thumbnail: '/images/highlights/highlight-6.jpg', videoUrl: '' }
  ],
  awards: [
    { id: 1, icon: '/images/icons/streamers.jpg', title: 'Streamers Awards 2025', subtitle: 'Best MOBA Streamer', description: 'Nominee in international category', year: '2025' },
    { id: 2, icon: '/images/icons/forbes.png', title: 'Forbes 30 under 30', subtitle: 'Winner', description: 'Media & Entertainment category', year: '2024' },
    { id: 3, icon: '/images/icons/aegis.png', title: 'The International', subtitle: 'Participant', description: 'Dota 2 World Championship', year: '2019' },
    { id: 4, icon: '/images/icons/twitch.png', title: '1M+ Subscribers', subtitle: 'Twitch Partner', description: 'Biggest Dota 2 streamer in CIS', year: '2024' }
  ]
};
