import type { Locale } from './showcase-copy';
import type { View } from './showcase-model';

export function localeFromUrl(url: URL): Locale {
  if (url.pathname !== '/') return url.pathname.startsWith('/es/') || url.pathname === '/es' ? 'es' : 'en';
  return url.searchParams.get('lang') === 'es' ? 'es' : 'en';
}

export function iconFromUrl(url: URL): string | null {
  const match = url.pathname.match(/^\/(?:es\/)?icon\/([^/]+)\/?$/);
  if (match) {
    try { return decodeURIComponent(match[1]); } catch { return null; }
  }
  return url.searchParams.get('icon');
}

export function viewFromUrl(url: URL): View {
  if (iconFromUrl(url) !== null || /^\/(?:es\/)?icons\/?$/.test(url.pathname) ||
      url.searchParams.get('view') === 'catalog') return 'catalog';
  if (/^\/(?:es\/)?guide\/?$/.test(url.pathname) ||
      url.searchParams.get('view') === 'guide' ||
      ['#installation', '#usage', '#color'].includes(url.hash)) return 'guide';
  return 'home';
}

export function showcasePath(locale: Locale, name: string | null, view: View): string {
  const prefix = locale === 'es' ? '/es/' : '/';
  if (name) return `${prefix}icon/${encodeURIComponent(name)}/`;
  if (view === 'guide') return `${prefix}guide/`;
  if (view === 'catalog') return `${prefix}icons/`;
  return prefix;
}

export function writeShowcasePath(url: URL, locale: Locale, name: string | null, view: View): void {
  url.pathname = showcasePath(locale, name, view);
  for (const key of ['icon', 'lang', 'view']) url.searchParams.delete(key);
}
