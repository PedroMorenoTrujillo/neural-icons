/** Canonical pages and their slash aliases; query-based legacy links remain valid at these paths. */
export function publicShowcasePaths(names: readonly string[]): Set<string> {
  const english = ['', '/guide', '/legal-notice', '/privacy', '/cookies', ...names.map(name => `/icon/${encodeURIComponent(name)}`)];
  return new Set(english.flatMap(path => [path || '/', `/es${path}`]));
}

export function isPublicShowcasePath(path: string, supported: Set<string>): boolean {
  return supported.has(path.replace(/\/+$/, '') || '/');
}

export function missingPage(spanish: boolean): string {
  const title = spanish ? 'Página no encontrada' : 'Page not found';
  const link = spanish ? 'Volver a Neural Icons' : 'Back to Neural Icons';
  return `<!doctype html><html lang="${spanish ? 'es' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, follow"><title>${title} · Neural Icons</title><style>body{font:1rem/1.6 system-ui,sans-serif;max-width:34rem;margin:10vh auto;padding:1.5rem;color:#172033}h1{line-height:1.2}a{color:#2554d6;text-underline-offset:.2em}</style></head><body><main><h1>${title}</h1><p><a href="${spanish ? '/es/' : '/'}">${link}</a></p></main></body></html>`;
}
