// src/content/defaults.js
// Резервный контент: показывается, если база недоступна.
// Зеркалит сид Supabase — при изменении контента через админку эти данные
// используются только как fallback.

export const DEFAULT_CONTENT = {
  hero: {
    subtitle: 'АЛЕКСАНДР ЛЕВИН • DOTA 2 STREAMER • CONTENT CREATOR'
  },
  // Реквизиты оператора персональных данных (заполняются в админке)
  legal: {
    operator_name: '', operator_type: '', inn: '', ogrn: '',
    address: '', email: 'nixoffers@gmail.com', policy_version: ''
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
      image: '/images/about/about-main.jpg', align: 'left', textScale: 1, photoScale: 1
    },
    {
      id: 'pro-career', title: 'PRO CAREER', subtitle: 'Ex-pro Dota 2 player',
      description: 'HellRaisers | 2016-2021\nУчастник The International\nПризер и победитель множества турниров',
      image: '/images/about/about-pro.jpg', align: 'right', textScale: 1, photoScale: 1
    },
    {
      id: 'expertise', title: 'EXPERT', subtitle: 'In MOBA games',
      description: 'Агрессивный playstyle\nЗнаток carry позиции\nХороший стратег',
      image: '/images/about/about-expertise.jpg', align: 'left', textScale: 1, photoScale: 1
    },
    {
      id: 'now', title: 'NOW', subtitle: 'Streamer & Creator',
      description: 'Forbes 30 до 30\n1M+ community\nЕжедневный контент на Twitch & YouTube',
      image: '/images/about/about-now.jpg', align: 'right', textScale: 1, photoScale: 1
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
    { id: 1, name: 'HAVAL', year: '2024', description: 'Интеграции с автомобильным брендом и обзор актуальных моделей HAVAL. Формат сочетал знакомство аудитории с продуктом и нативную интеграцию в контент Александра.' },
    { id: 2, name: 'Яндекс', year: '2022–2026', description: 'Долгосрочное партнёрство по разным продуктам экосистемы Яндекса: Такси, Лавка, Маркет, AI-сервисы и другие. Интеграции строятся вокруг сервисов, которыми Александр регулярно пользуется сам.' },
    { id: 3, name: 'Kitfort', year: '2023–2024', description: 'Нативные интеграции бытовой техники, которой Александр пользуется в повседневной жизни. Продукт органично вписывался в контент и показывался аудитории в реальном сценарии использования. Высокая конверсия интеграций и значительный объём продаж.' },
    { id: 4, name: 'МТС', year: '2025', description: 'Интеграции сервиса MTS Pay — удобного способа пополнения Steam. В рамках кампании акцент сделали на выгодных предложениях для аудитории и удобстве использования сервиса.' },
    { id: 5, name: 'Yota', year: '2024', description: 'Интеграции услуг мобильного оператора с акцентом на выгодные условия тарифа и практическую ценность предложения для аудитории.' },
    { id: 6, name: 'Nuw', year: '2023–2025', description: 'Долгосрочное сотрудничество в формате амбассадорства бренда одежды. Александр регулярно носит продукцию Nuw в повседневной жизни и на стримах, что сформировало устойчивый интерес аудитории к бренду и продукту.' },
    { id: 7, name: 'Точка Банк', year: '2026', description: 'Нативная интеграция сервиса для открытия ИП. Александр поделился собственным опытом работы с легальным оформлением деятельности и показал процесс на практике, выступив в роли инфлюенсера с релевантным опытом.' },
    { id: 8, name: 'Самокат', year: '2024', description: 'Нативные интеграции сервиса доставки продуктов с акцентом на удобство заказа и быструю доставку. Продукт органично интегрировался в повседневный контент стримера.' },
    { id: 9, name: 'Majestic', year: '2023–2025', description: 'Долгосрочное сотрудничество с одним из крупнейших GTA RP-проектов в русскоязычном сегменте. Несколько крупных кампаний во время турниров, нативные интеграции и размещения в социальных сетях.' },
    { id: 10, name: 'Genshin Impact', year: '2023', description: 'Сотрудничество с издателем Genshin Impact — одной из крупнейших action/RPG с открытым миром. Интеграции получили высокий интерес и вовлечённость аудитории благодаря релевантности продукта аудитории Александра.' },
    { id: 11, name: 'MLBB', year: '2024–2025', description: 'Сотрудничество с популярной мобильной MOBA. Игровые интеграции, совместные активности в студии освещения и продвижение киберспортивного турнира.' },
    { id: 12, name: 'Playerok', year: '2026–настоящее время', description: 'Долгосрочное партнёрство с маркетплейсом цифровых товаров и услуг. Регулярные нативные интеграции в стримах и публикации на социальных платформах Nix.', colorFrom: '#0721e9' },
    { id: 13, name: 'BetBoom', year: 'с 2021', description: 'Титульное партнёрство и амбассадорство. Долгосрочное сотрудничество включает постоянное присутствие бренда в контенте и комплексную работу с аудиторией.', colorFrom: '#972121', colorTo: '#d4bc1c' }
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
    { id: 1, title: 'TI 2026 Group', views: '', platform: '', thumbnail: '/images/highlights/ti-2026-group.jpg', videoUrl: '/video/highlights/ti-2026-group.mp4', featured: true },
    { id: 2, title: 'BB Tundra 2023', views: '', platform: '', thumbnail: '/images/highlights/bb-tundra-2023.jpg', videoUrl: '/video/highlights/bb-tundra-2023.mp4' },
    { id: 3, title: 'BetBoom Falcons', views: '', platform: '', thumbnail: '/images/highlights/betboom-falcons.jpg', videoUrl: '/video/highlights/betboom-falcons.mp4' },
    { id: 4, title: 'Falcons BetBoom', views: '', platform: '', thumbnail: '/images/highlights/falcons-betboom.jpg', videoUrl: '/video/highlights/falcons-betboom.mp4' },
    { id: 5, title: 'Pl Dota Highlight', views: '', platform: '', thumbnail: '/images/highlights/pl-dota-highlight.jpg', videoUrl: '/video/highlights/pl-dota-highlight.mp4' },
    { id: 6, title: 'Комментирование на дорожке', views: '', platform: '', thumbnail: '/images/highlights/kommentirovanie-na-dorozhke.jpg', videoUrl: '/video/highlights/kommentirovanie-na-dorozhke.mp4' },
    { id: 7, title: 'CS Highlight', views: '', platform: '', thumbnail: '/images/highlights/cs-highlight-4.jpg', videoUrl: '/video/highlights/cs-highlight-4.mp4' }
  ],
  awards: [
    { id: 1, icon: '/images/icons/streamers.jpg', title: 'Streamers Awards 2025', subtitle: 'Best MOBA Streamer', description: 'Nominee in international category', year: '2025' },
    { id: 2, icon: '/images/icons/forbes.png', title: 'Forbes 30 under 30', subtitle: 'Winner', description: 'Media & Entertainment category', year: '2024' },
    { id: 3, icon: '/images/icons/aegis.png', title: 'The International', subtitle: 'Participant', description: 'Dota 2 World Championship', year: '2019' },
    { id: 4, icon: '/images/icons/twitch.png', title: '1M+ Subscribers', subtitle: 'Twitch Partner', description: 'Biggest Dota 2 streamer in CIS', year: '2024' }
  ]
};
