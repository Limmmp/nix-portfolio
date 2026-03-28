// src/data/content.js

export const linksData = [
  {
    id: 1,
    name: 'Twitch',
    url: 'https://www.twitch.tv/nix',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>`,
    stat: '1.09M+ followers'
  },
  {
    id: 2,
    name: 'Telegram',
    url: 'https://t.me/nixtalk',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
    stat: 'nixtalk'
  },
  {
    id: 3,
    name: 'YouTube',
    url: 'https://www.youtube.com/@nix',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    stat: 'Highlights'
  },
  {
    id: 4,
    name: 'Kick',
    url: 'https://kick.com/nix',
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M4.167 0l3.292 16.083L11.667 0h3.792l4.208 16.083L22.917 0H24L17.083 20.25H13.5L9.75 5.667 6.083 20.25H2.583L0 0h4.167z"/></svg>`,
    stat: 'Alternative'
  }
];

export const aboutData = {
  name: 'Александр "NIX" Левин',
  description: `Профессиональный стример и контент-мейкер в сфере Dota 2. 
    Самый просматриваемый Dota 2 стример 2024 года с 24.33 млн часов просмотра [[18]]. 
    Более 1.09 млн подписчиков на Twitch [[20]]. 
    Официальный партнёр BetBoom. Открыт к сотрудничеству с брендами и рекламодателями.`,
  
  stats: [
    { value: '1.09M+', label: 'Twitch Followers' },
    { value: '24.33M', label: 'Hours Watched (2024)' },
    { value: '#1', label: 'Dota 2 Streamer 2024' },
    { value: '#1', label: 'Dota 2 Streamer 2025' },
    { value: '30+M', label: 'Hours Watched (2025)' },
  ]
};

export const siteConfig = {
  showMediaGallery: false,  
  showAboutStats: false,
  showGear: false,         
  showClips: false,        
  showStats: true,
  showPartners: false,      
  videoAutoPlay: true,
  showSkipButton: true
};