import { describe, expect, it } from 'vitest';
import { isPublicShowcasePath, publicShowcasePaths, missingPage } from './public-routes';

describe('Public showcase route boundary', () => {
  const paths = publicShowcasePaths(['arrow-left', 'check']);
  it('preserves every bilingual page, icon and supported slash alias', () => {
    for (const path of ['/', '/es', '/es/', '/icons/', '/es/icons', '/guide/', '/es/guide', '/privacy/', '/es/cookies/', '/icon/arrow-left/', '/es/icon/check']) expect(isPublicShowcasePath(path, paths)).toBe(true);
  });
  it('rejects missing icons and arbitrary paths instead of serving the catalog', () => {
    for (const path of ['/missing', '/es/missing', '/icon/not-real/', '/guide/extra', '/admin', '/icon/%ZZ']) expect(isPublicShowcasePath(path, paths)).toBe(false);
  });
  it('does not interpolate the requested address into the public error document', () => {
    expect(missingPage(true)).toContain('lang="es"');
    expect(missingPage(false)).toContain('noindex, follow');
  });
});
