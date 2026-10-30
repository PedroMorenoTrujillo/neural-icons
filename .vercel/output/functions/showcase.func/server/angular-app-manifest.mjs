
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
    'index.csr.html': {size: 1052, hash: 'c682b10cbdca4c6b86043c081d4d2ce11197a2e538f8bf9474a9c12f25b2ba55', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1262, hash: '70c0242c8e9a1122cfa9e663b4bc4eb6c958b825cdade87afa54ce60612f391a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-PY34VJ2C.css': {size: 226, hash: 'cTzXof68Tgs', text: () => import('./assets-chunks/styles-PY34VJ2C_css.mjs').then(m => m.default)}
  },
};
