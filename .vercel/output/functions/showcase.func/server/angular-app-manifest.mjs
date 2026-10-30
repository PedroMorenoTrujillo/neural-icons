
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1052, hash: 'fdd31f5c44f0ef29c6f0eeea3185324b7e16303b5c1a4741f19c6a4d4923eadb', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1262, hash: 'a5ef611fcd1feb4053123385ef4af147066c313ab8f619724fa9e4ebee868884', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PY34VJ2C.css': {size: 226, hash: 'cTzXof68Tgs', text: () => import('./assets-chunks/styles-PY34VJ2C_css.mjs').then(m => m.default)}
  },
};
