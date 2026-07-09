// src/content/ContentContext.jsx
// Загружает весь контент сайта из Supabase одним заходом.
// Если база недоступна — сайт работает на DEFAULT_CONTENT.
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_CONTENT } from './defaults';

const ContentContext = createContext({ content: DEFAULT_CONTENT, ready: false });

function settingsToMap(rows) {
  const map = {};
  (rows || []).forEach((r) => { map[r.key] = r.value; });
  return map;
}

async function fetchContent() {
  const [settings, heroStats, aboutSlides, platforms, brands, videos, awards] = await Promise.all([
    supabase.from('site_settings').select('*'),
    supabase.from('hero_stats').select('*').order('sort'),
    supabase.from('about_slides').select('*').order('sort'),
    supabase.from('platforms').select('*').order('sort'),
    supabase.from('brands').select('*').order('sort'),
    supabase.from('highlight_videos').select('*').order('sort'),
    supabase.from('awards').select('*').order('sort')
  ]);

  const failed = [settings, heroStats, aboutSlides, platforms, brands, videos, awards].some((r) => r.error);
  if (failed) throw new Error('content fetch failed');

  const s = settingsToMap(settings.data);

  return {
    hero: {
      subtitle: s.hero?.subtitle ?? DEFAULT_CONTENT.hero.subtitle
    },
    heroStats: heroStats.data.length
      ? heroStats.data.map((r) => ({ value: r.value, label: r.label, sublabel: r.sublabel }))
      : DEFAULT_CONTENT.heroStats,
    aboutSlides: aboutSlides.data.length
      ? aboutSlides.data.map((r) => ({
          id: r.id, title: r.title, subtitle: r.subtitle,
          description: r.description, image: r.image_url, align: r.align
        }))
      : DEFAULT_CONTENT.aboutSlides,
    platforms: platforms.data.length
      ? platforms.data.map((r) => ({
          id: r.id, slug: r.slug, name: r.name, url: r.url, color: r.color,
          logoUrl: r.logo_url, featured: r.featured, metrics: r.metrics, description: r.description
        }))
      : DEFAULT_CONTENT.platforms,
    brands: brands.data.length
      ? brands.data.map((r) => ({
          id: r.id, name: r.name, year: r.year, description: r.description,
          colorFrom: r.color_from, colorTo: r.color_to
        }))
      : DEFAULT_CONTENT.brands,
    partnersAudience: s.partners_audience ?? DEFAULT_CONTENT.partnersAudience,
    partnersFormats: s.partners_formats ?? DEFAULT_CONTENT.partnersFormats,
    highlights: videos.data.length
      ? videos.data.map((r) => ({
          id: r.id, title: r.title, views: r.views, platform: r.platform,
          thumbnail: r.thumb_url, videoUrl: r.video_url, featured: r.featured
        }))
      : DEFAULT_CONTENT.highlights,
    awards: awards.data.length
      ? awards.data.map((r) => ({
          id: r.id, icon: r.icon_url, title: r.title, subtitle: r.subtitle,
          description: r.description, year: r.year
        }))
      : DEFAULT_CONTENT.awards
  };
}

export function ContentProvider({ children }) {
  const [state, setState] = useState({ content: DEFAULT_CONTENT, ready: false });

  useEffect(() => {
    let cancelled = false;
    fetchContent()
      .then((content) => { if (!cancelled) setState({ content, ready: true }); })
      .catch(() => { if (!cancelled) setState({ content: DEFAULT_CONTENT, ready: true }); });
    return () => { cancelled = true; };
  }, []);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
