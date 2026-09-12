import { readFile, writeFile } from 'node:fs/promises';

const manifestPath = new URL(
  '../packages/core/icons/icons.json',
  import.meta.url,
);
const existing = JSON.parse(await readFile(manifestPath, 'utf8'));

const groups = {
  navigation: [
    'dashboard',
    'grid',
    'list',
    'sidebar',
    'panel-left',
    'panel-right',
    'maximize',
    'minimize',
    'expand',
    'collapse',
    'arrow-up-right',
    'arrow-up-left',
    'arrow-down-right',
    'arrow-down-left',
    'corner-up-left',
    'corner-up-right',
    'corner-down-left',
    'corner-down-right',
    'compass',
    'map',
    'pin',
    'location',
    'route',
    'navigation',
    'link',
    'unlink',
    'globe',
  ],
  action: [
    'save',
    'share',
    'send',
    'play',
    'pause',
    'skip-back',
    'skip-forward',
    'rewind',
    'fast-forward',
    'rotate-cw',
    'rotate-ccw',
    'undo',
    'redo',
    'zoom-in',
    'zoom-out',
    'select',
    'cursor',
    'drag',
    'wand',
    'sparkles',
    'command',
    'keyboard',
    'scan',
    'qr-code',
    'print',
    'archive',
    'bookmark',
    'flag',
    'tag',
    'paperclip',
    'attach',
    'clipboard',
    'paste',
    'crop',
    'align-left',
    'align-center',
    'align-right',
  ],
  communication: [
    'message',
    'messages',
    'chat',
    'phone',
    'video',
    'mic',
    'mic-off',
    'camera',
    'camera-off',
    'inbox',
    'mention',
    'bell-off',
    'volume',
    'volume-off',
    'rss',
    'wifi',
    'wifi-off',
  ],
  system: [
    'circle-check',
    'circle-x',
    'circle-info',
    'circle-alert',
    'shield',
    'shield-check',
    'shield-off',
    'key',
    'password',
    'login',
    'user-plus',
    'user-minus',
    'user-check',
    'user-x',
    'group',
    'database',
    'server',
    'cloud',
    'cloud-upload',
    'cloud-download',
    'hard-drive',
    'cpu',
    'terminal',
    'code',
    'bug',
    'zap',
    'activity',
    'chart',
    'analytics',
  ],
  file: [
    'file-plus',
    'file-minus',
    'file-check',
    'file-x',
    'file-text',
    'file-code',
    'file-image',
    'file-video',
    'file-audio',
    'file-archive',
    'file-spreadsheet',
    'files',
    'folder-plus',
    'folder-minus',
    'folder-check',
    'folder-x',
    'folder-open',
    'folder-tree',
    'table',
    'list-check',
    'list-plus',
    'list-minus',
    'sort-descending',
    'funnel',
    'calendar-plus',
    'calendar-minus',
    'calendar-check',
    'calendar-x',
    'clock-plus',
    'clock-x',
  ],
};

const filled = [
  ['home-filled', 'navigation'],
  ['heart-filled', 'status'],
  ['star-filled', 'status'],
  ['bell-filled', 'communication'],
  ['user-filled', 'system'],
  ['check-filled', 'action'],
  ['warning-filled', 'status'],
  ['error-filled', 'status'],
  ['info-filled', 'status'],
  ['folder-filled', 'file'],
  ['file-filled', 'file'],
  ['bookmark-filled', 'action'],
];

// These are intentionally compact, authored primitives on the Neural 24px
// grid. Names select a visual grammar; no third-party path data is involved.
const paths = {
  square: ['M5 5h14v14H5z'],
  roundSquare: [
    'M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z',
  ],
  circle: ['M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16'],
  dot: ['M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z'],
  diamond: ['M12 3.5 20.5 12 12 20.5 3.5 12z'],
  triangle: ['M12 4 20 19H4z'],
  cross: ['M5.5 5.5 18.5 18.5M18.5 5.5 5.5 18.5'],
  plus: ['M12 4v16M4 12h16'],
  arrowUpRight: ['M5 19 19 5M9 5h10v10'],
  arrowUpLeft: ['M19 19 5 5M5 15V5h10'],
  arrowDownRight: ['M5 5 19 19M19 9v10H9'],
  arrowDownLeft: ['M19 5 5 19M15 19H5V9'],
  cornerUpLeft: ['M19 19V8H5M5 8l5-5M5 8l5 5'],
  cornerUpRight: ['M5 19V8h14M19 8l-5-5M19 8l-5 5'],
  cornerDownLeft: ['M19 5v11H5M5 16l5-5M5 16l5 5'],
  cornerDownRight: ['M5 5v11h14M19 16l-5-5M19 16l-5 5'],
  bars: ['M4 6.5h16M4 12h16M4 17.5h16'],
  list: ['M8 6.5h12M8 12h12M8 17.5h12M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01'],
  grid: ['M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z'],
  dashboard: ['M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  sidebar: ['M4 4h16v16H4zM9 4v16'],
  panelLeft: ['M4 4h16v16H4zM10 4v16M7 8h.01M7 12h.01M7 16h.01'],
  panelRight: ['M4 4h16v16H4zM14 4v16M17 8h.01M17 12h.01M17 16h.01'],
  maximize: ['M8 4H4v4M16 4h4v4M20 16v4h-4M4 16v4h4'],
  minimize: ['M4 9h7V4M20 9h-7V4M4 15h7v5M20 15h-7v5'],
  expand: ['M9 4H4v5M15 4h5v5M20 15v5h-5M4 15v5h5'],
  collapse: ['M9 9H4V4M15 9h5V4M20 15h-5v5M4 15h5v5'],
  compass: [
    'M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM15.5 8.5l-2 5-5 2 2-5z',
  ],
  map: ['M4 6.5 9 4l6 2.5L20 4v13.5l-5 2.5-6-2.5-5 2.5zM9 4v13.5M15 6.5V20'],
  pin: [
    'M12 21s6-5.25 6-10a6 6 0 1 0-12 0c0 4.75 6 10 6 10zM12 13a2 2 0 1 0 0-4a2 2 0 1 0 0 4',
  ],
  location: [
    'M12 4v4M12 16v4M4 12h4M16 12h4M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z',
  ],
  route: ['M5 19c0-5 4-5 4-8s-4-3-4-6M9 5h10M16 2l3 3-3 3'],
  navigation: [
    'M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM15.5 8.5l-2 5-5 2 2-5z',
  ],
  link: ['M9 15l6-6M7 17H6a4 4 0 0 1 0-8h4M17 7h1a4 4 0 0 1 0 8h-4'],
  unlink: [
    'm8 8-2-2a4 4 0 0 0-5.5 5.5l2 2M16 16l2 2a4 4 0 0 0 5.5-5.5l-2-2M9 15l6-6',
  ],
  anchor: ['M12 4v12M8 7a4 4 0 1 0 8 0M4 13a8 8 0 0 0 16 0M5 13h14'],
  globe: [
    'M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM3.8 12h16.4M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5s-1.1 6.2-3.3 8.5c-2.2-2.3-3.3-5.1-3.3-8.5s1.1-6.2 3.3-8.5z',
  ],
  layers: ['M12 4 20 8l-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4'],
  save: ['M5 4h14v16H5zM8 4v5h8V4M8 15h8'],
  share: [
    'M17 8a2.5 2.5 0 1 0 0-5a2.5 2.5 0 1 0 0 5zM7 14.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 1 0 0 5zM17 21a2.5 2.5 0 1 0 0-5a2.5 2.5 0 1 0 0 5zM9.2 10.7l5.6-3.4M9.2 12.8l5.6 3.4',
  ],
  send: ['M20 4 4 10.5l6.5 2.5L13 20zM10.5 13 20 4'],
  play: ['M7 4.5 19 12 7 19.5z'],
  pause: ['M7 5v14M17 5v14'],
  stop: ['M6 6h12v12H6z'],
  skip: ['M6 5v14M9 12l9-7v14z'],
  rewind: ['M18 5 9 12l9 7zM9 5 4 12l5 7z'],
  fastForward: ['M5 5l9 7-9 7zM14 5l6 7-6 7z'],
  rotate: ['M19 8a8 8 0 1 0 1 6M19 4v4h-4'],
  undo: ['M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6'],
  redo: ['M15 7l5 5-5 5M19 12h-8a6 6 0 0 0-6 6'],
  zoom: ['M10.5 3.5a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM16 16l5 5'],
  zoomPlus: [
    'M10.5 3.5a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM16 16l5 5M10.5 7v7M7 10.5h7',
  ],
  zoomMinus: ['M10.5 3.5a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM16 16l5 5M7 10.5h7'],
  select: ['M5 5h14v14H5zM9 12l2 2 4-4'],
  cursor: ['M6 4l3 16 3-6 6 3z'],
  hand: [
    'M7 11V7a1.5 1.5 0 0 1 3 0v4M10 10V5a1.5 1.5 0 0 1 3 0v5M13 10V7a1.5 1.5 0 0 1 3 0v5M16 12v-1a1.5 1.5 0 0 1 3 0v4c0 3.3-2.7 5.5-6 5.5h-1c-2 0-3.6-.9-4.5-2.5L5 14a1.5 1.5 0 0 1 2-2z',
  ],
  drag: ['M8 5v14M16 5v14M5 8l3-3 3 3M13 8l3-3 3 3M5 16l3 3 3-3M13 16l3 3 3-3'],
  wand: [
    'M5 19 17 7M14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM19 14l.75 1.5L21 16l-1.25.5L19 18l-.75-1.5L17 16l1.25-.5z',
  ],
  sparkles: [
    'M8 3.5l1.2 4.3L13.5 9l-4.3 1.2L8 14.5l-1.2-4.3L2.5 9l4.3-1.2zM17 12l.8 2.2L20 15l-2.2.8L17 18l-.8-2.2L14 15l2.2-.8z',
  ],
  command: [
    'M8 4a3 3 0 1 0 0 6h2V8a3 3 0 1 0-2-4zM16 4a3 3 0 1 1 0 6h-2V8a3 3 0 1 1 2-4zM8 20a3 3 0 1 1 0-6h2v2a3 3 0 1 1-2 4zM16 20a3 3 0 1 0 0-6h-2v2a3 3 0 1 0 2 4zM10 10h4v4h-4z',
  ],
  keyboard: ['M4 6h16v12H4zM7 10h.01M10 10h.01M13 10h.01M16 10h.01M7 14h10'],
  scan: ['M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5'],
  qr: [
    'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM15 15h2v2h-2zM18 18h2v2h-2zM18 14h2v2h-2z',
  ],
  print: [
    'M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v6H7z',
  ],
  archive: ['M4 7h16v13H4zM3 4h18v3H3zM9 12h6'],
  bookmark: ['M6 4h12v16l-6-3-6 3z'],
  flag: ['M6 20V4M6 5h11l-2.5 3L17 11H6'],
  tag: ['m4 5 7-1 9 9-6 6-9-9zM8 8h.01'],
  paperclip: ['m8 12 6.5-6.5a3.5 3.5 0 0 1 5 5L11 19a5 5 0 0 1-7-7l8-8'],
  attach: ['m8 12 6.5-6.5a3.5 3.5 0 0 1 5 5L11 19a5 5 0 0 1-7-7l8-8'],
  clipboard: ['M8 5h8v3H8zM6 6H5v14h14V6h-1M9 12h6M9 16h4'],
  paste: ['M8 5h8v3H8zM6 6H4v14h12v-2M10 10h10v10H10z'],
  crop: ['M7 4v13h13M4 7h13v13'],
  alignLeft: ['M4 6h16M4 10h11M4 14h16M4 18h11'],
  alignCenter: ['M4 6h16M7 10h10M4 14h16M7 18h10'],
  alignRight: ['M4 6h16M9 10h11M4 14h16M9 18h11'],
  alignJustify: ['M4 6h16M4 10h16M4 14h16M4 18h16'],
  message: ['M4 5h16v11H9l-5 4zM8 9h8M8 12h5'],
  messages: ['M4 5h14v10H9l-5 3zM8 9h7M8 12h4M8 20h11l2-3V7'],
  chat: ['M5 5h14v10H9l-4 4zM8 9h8M8 12h5'],
  phone: [
    'M7 4h3l1.5 4-2 1.5a13 13 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2C10 19 5 14 5 6a2 2 0 0 1 2-2z',
  ],
  video: ['M4 7h11v10H4zM15 10l5-3v10l-5-3'],
  mic: [
    'M8 5a4 4 0 0 1 8 0v6a4 4 0 0 1-8 0zM5 10v1a7 7 0 0 0 14 0M12 18v3M8 21h8',
  ],
  micOff: [
    'M8 5a4 4 0 0 1 7.2-2.4M16 8v3a4 4 0 0 1-6.8 2.8M5 10v1a7 7 0 0 0 10.8 5.9M12 18v3M8 21h8M4 4l16 16',
  ],
  camera: ['M4 8h4l2-3h4l2 3h4v11H4zM12 10a3 3 0 1 0 0 6a3 3 0 1 0 0-6z'],
  cameraOff: ['M4 8h4l2-3h4l2 3h4v11H4zM9.5 9.5l5 5M14.5 9.5l-5 5M4 4l16 16'],
  inbox: ['M4 5h16v14H4zM4 14h5l2 2h2l2-2h5'],
  at: ['M16 12a4 4 0 1 1-1.2-2.8M16 12v3a2 2 0 1 0 4 0v-3a8 8 0 1 0-2.3 5.7'],
  mention: [
    'M12 5a7 7 0 1 0 7 7v3a2 2 0 1 0 4 0v-3a11 11 0 1 0-3.2 7.8M16 12a4 4 0 1 1-8 0a4 4 0 1 1 8 0z',
  ],
  hash: ['M9 4 7 20M17 4l-2 16M4 9h16M3 15h16'],
  bellOff: [
    'M18 9a6 6 0 0 0-10.5-3.9M6 9v4l-2 3h11M14 19a3 3 0 0 1-5 0M4 4l16 16',
  ],
  volume: ['M4 10h4l5-4v12l-5-4H4zM16 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11'],
  volumeOff: ['M4 10h4l5-4v12l-5-4H4zM16 9l4 6M20 9l-4 6'],
  rss: ['M5 19h.01M5 14a5 5 0 0 1 5 5M5 9a10 10 0 0 1 10 10'],
  wifi: [
    'M3 8a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0M9 16a4 4 0 0 1 6 0M12 20h.01',
  ],
  wifiOff: [
    'M3 8a14 14 0 0 1 7-3M14 5a14 14 0 0 1 7 3M6 12a9 9 0 0 1 3-1M15 11a9 9 0 0 1 3 1M9 16a4 4 0 0 1 3-1M15 16a4 4 0 0 1 0 0M12 20h.01M4 4l16 16',
  ],
  broadcast: [
    'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14',
  ],
  checkCircle: [
    'M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM7.5 12.2l3 3 6-6',
  ],
  circleX: ['M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM9 9l6 6M15 9l-6 6'],
  circleInfo: [
    'M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM12 10v6M12 7.5h.01',
  ],
  circleAlert: [
    'M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM12 8v5M12 16.5h.01',
  ],
  shield: ['M12 3.5 19 6v5.5c0 4.3-2.8 7.6-7 9-4.2-1.4-7-4.7-7-9V6z'],
  shieldCheck: [
    'M12 3.5 19 6v5.5c0 4.3-2.8 7.6-7 9-4.2-1.4-7-4.7-7-9V6zM8.5 12l2.2 2.2 4.8-4.8',
  ],
  shieldOff: [
    'M5 5.5 12 3.5 19 6v5.5c0 1.8-.5 3.4-1.3 4.8M5 5.5v6c0 4.3 2.8 7.6 7 9 .8-.3 1.5-.6 2.2-1M4 4l16 16',
  ],
  key: ['M14 10a4 4 0 1 0-3 3l6 6 2-2-2-2 2-2-3-3'],
  password: ['M5 7h14v10H5zM8 12h.01M12 12h.01M16 12h.01'],
  login: ['M14 8l4 4-4 4M18 12H5M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5'],
  userPlus: [
    'M15 20v-1a5 5 0 0 0-10 0v1M10 11a4 4 0 1 0 0-8a4 4 0 1 0 0 8zM19 9v6M16 12h6',
  ],
  userMinus: [
    'M15 20v-1a5 5 0 0 0-10 0v1M10 11a4 4 0 1 0 0-8a4 4 0 1 0 0 8zM16 12h6',
  ],
  userCheck: [
    'M15 20v-1a5 5 0 0 0-10 0v1M10 11a4 4 0 1 0 0-8a4 4 0 1 0 0 8zM16 13l2 2 4-4',
  ],
  userX: [
    'M15 20v-1a5 5 0 0 0-10 0v1M10 11a4 4 0 1 0 0-8a4 4 0 1 0 0 8zM17 13l5 5M22 13l-5 5',
  ],
  group: [
    'M8 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7zM3 20v-1a5 5 0 0 1 10 0v1M16 11a3 3 0 1 0 0-6M17 15a4 4 0 0 1 4 4v1',
  ],
  database: [
    'M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3-3.6-3-8-3-8 1.3-8 3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
  ],
  server: ['M4 5h16v5H4zM4 14h16v5H4zM7 7.5h.01M7 16.5h.01'],
  cloud: ['M6 18h11a4 4 0 0 0 .5-8A6 6 0 0 0 6 8a5 5 0 0 0 0 10z'],
  cloudUpload: [
    'M6 18h11a4 4 0 0 0 .5-8A6 6 0 0 0 6 8a5 5 0 0 0 0 10zM12 16V9M9.5 11.5 12 9l2.5 2.5',
  ],
  cloudDownload: [
    'M6 18h11a4 4 0 0 0 .5-8A6 6 0 0 0 6 8a5 5 0 0 0 0 10zM12 9v7M9.5 13.5 12 16l2.5-2.5',
  ],
  hardDrive: ['M4 7h16l2 10H2zM5 14h.01M9 14h.01M13 14h.01'],
  cpu: [
    'M7 7h10v10H7zM4 9v2M4 15v2M20 9v2M20 15v2M9 4v2M15 4v2M9 18v2M15 18v2',
  ],
  terminal: ['M5 7l5 5-5 5M12 17h7'],
  code: ['m9 7-5 5 5 5M15 7l5 5-5 5'],
  bug: [
    'M9 8a3 3 0 0 1 6 0v1a5 5 0 0 1 2 4v2a5 5 0 0 1-10 0v-2a5 5 0 0 1 2-4zM5 12h14M4 9h3M17 9h3M4 16h3M17 16h3',
  ],
  zap: ['m13 3-8 10h6l-1 8 8-10h-6z'],
  activity: ['M3 12h4l2-6 4 12 2-6h6'],
  chart: ['M5 19V9M12 19V5M19 19v-8M3 19h18'],
  analytics: ['M4 18V6M4 18h16M8 15l3-4 3 2 5-6'],
  pulse: ['M3 12h4l2-5 4 10 3-7 2 2h3'],
  file: ['M6 3.5h8l4 4v13H6zM14 3.5v4h4'],
  filePlus: ['M6 3.5h8l4 4v13H6zM14 3.5v4h4M12 12v6M9 15h6'],
  fileMinus: ['M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 15h6'],
  fileCheck: ['M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 15l2 2 4-4'],
  fileX: ['M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 14l6 6M15 14l-6 6'],
  fileText: ['M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 12h6M9 16h6'],
  fileCode: ['M6 3.5h8l4 4v13H6zM14 3.5v4h4M10 12l-2 2 2 2M14 12l2 2-2 2'],
  fileImage: ['M6 3.5h8l4 4v13H6zM14 3.5v4h4M8 17l3-3 2 2 2-2 2 3M10 10h.01'],
  fileVideo: ['M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 12h4v4H9zM13 13l2-1v4l-2-1'],
  fileAudio: [
    'M6 3.5h8l4 4v13H6zM14 3.5v4h4M10 16v-5l5-1v5M10 16a2 2 0 1 0 0 1M15 15a2 2 0 1 0 0 1',
  ],
  fileArchive: ['M6 3.5h8l4 4v13H6zM14 3.5v4h4M10 9h4M10 12h4M10 15h4'],
  fileSpreadsheet: ['M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 11h6M9 15h6M12 9v8'],
  files: ['M7 5h12v15H7zM4 16V4h12'],
  folder: ['M3.5 6h6l2 2h9v11h-17z'],
  folderPlus: ['M3.5 6h6l2 2h9v11h-17zM12 11v5M9.5 13.5h5'],
  folderMinus: ['M3.5 6h6l2 2h9v11h-17zM9.5 13.5h5'],
  folderCheck: ['M3.5 6h6l2 2h9v11h-17zM8 14l2 2 5-5'],
  folderX: ['M3.5 6h6l2 2h9v11h-17zM9 12l5 5M14 12l-5 5'],
  folderOpen: ['M3.5 6h6l2 2h9l-2 11h-15z'],
  folderTree: ['M5 5h6v5H5zM13 14h6v5h-6zM8 10v3h8v1M8 10h8v4'],
  table: ['M4 5h16v14H4zM4 10h16M4 15h16M10 5v14M16 5v14'],
  columns: ['M4 5h6v14H4zM14 5h6v14h-6z'],
  rows: ['M4 5h16v5H4zM4 14h16v5H4z'],
  listCheck: ['M8 6h12M8 12h12M8 18h12M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2'],
  listPlus: ['M8 6h12M8 12h12M8 18h12M4 6v4M2 8h4'],
  listMinus: ['M8 6h12M8 12h12M8 18h12M2 8h4'],
  sortDown: ['M7 5v14M4 16l3 3 3-3M14 7h6M14 12h4M14 17h2'],
  funnel: ['M4 5h16l-6 7v6l-4 2v-8z'],
  calendar: ['M5 5h14v15H5zM5 9h14M9 3v4M15 3v4M8 13h3M13 13h3M8 17h3'],
  calendarPlus: ['M5 5h14v15H5zM5 9h14M9 3v4M15 3v4M12 13v6M9 16h6'],
  calendarMinus: ['M5 5h14v15H5zM5 9h14M9 3v4M15 3v4M9 16h6'],
  calendarCheck: ['M5 5h14v15H5zM5 9h14M9 3v4M15 3v4M8 16l2 2 5-5'],
  calendarX: ['M5 5h14v15H5zM5 9h14M9 3v4M15 3v4M9 14l6 6M15 14l-6 6'],
  clockPlus: [
    'M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM12 8v4l3 2M18 16v5M15.5 18.5h5',
  ],
  clockX: [
    'M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM12 8v4l3 2M16 16l4 4M20 16l-4 4',
  ],
  person: [
    'M12 11a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7zM5 20v-1a7 7 0 0 1 14 0v1',
  ],
  home: [
    'M3.25 10.25 12 3.5l8.75 6.75M5 9.25v10.5c0 .55.45 1 1 1h4v-6.25h4v6.25h4c.55 0 1-.45 1-1V9.25',
  ],
  heart: [
    'M12 20S4 15.5 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 20 12 20z',
  ],
  star: [
    'm12 4 2.5 5.2 5.75.8-4.15 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.15-4 5.75-.8z',
  ],
  bell: ['M6 17h12l-1.5-2.5V10a4.5 4.5 0 0 0-9 0v4.5zM10 20h4'],
  info: ['M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM12 10v6M12 7.5h.01'],
  warning: ['M12 4 21 20H3zM12 10v4M12 17h.01'],
  error: ['M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM9 9l6 6M15 9l-6 6'],
  check: ['m4.25 12.5 4.75 4.75 10.75-10.5'],
  bookmarkFilled: ['M6 4h12v16l-6-3-6 3z'],
  homeFilled: ['M3 10 12 3l9 7v10H4V10zM10 20v-7h4v7z'],
  heartFilled: [
    'M12 20S4 15.5 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 20 12 20z',
  ],
  starFilled: [
    'm12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.4-5.6-3-5.6 3 1.1-6.4-4.5-4.4 6.2-.9z',
  ],
  bellFilled: ['M5 17h14l-2-3v-4a5 5 0 0 0-10 0v4zM10 20a2 2 0 0 0 4 0z'],
  personFilled: ['M12 12a4 4 0 1 0 0-8a4 4 0 1 0 0 8zM4 21a8 8 0 0 1 16 0z'],
  checkFilled: ['M4 12.5 9 18l11-12-3-2-8 8-3-3z'],
  warningFilled: ['M12 3 22 21H2zM11 9h2v5h-2zM11 17h2v2h-2z'],
  errorFilled: [
    'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM9.2 8.2 15.8 14.8 14.8 15.8 8.2 9.2zM14.8 8.2 15.8 9.2 9.2 15.8 8.2 14.8z',
  ],
  infoFilled: [
    'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM11 9h2v7h-2zM11 6h2v2h-2z',
  ],
  folderFilled: ['M3 6h7l2 2h9v12H3z'],
  fileFilled: ['M6 3h8l4 4v14H6zM14 3v5h5z'],
};

const camel = (name) =>
  name
    .split('-')
    .map((part, index) =>
      index === 0 ? part : part[0].toUpperCase() + part.slice(1),
    )
    .join('');

const kindFor = (name) => {
  const root = name.replace(/-filled$/, '');
  const direct = camel(root);
  if (paths[`${direct}Filled`]) return `${direct}Filled`;
  if (root === 'user') return 'person';
  if (root === 'circle-check') return 'checkCircle';
  if (root === 'circle-x') return 'circleX';
  if (root === 'circle-info') return 'circleInfo';
  if (root === 'circle-alert') return 'circleAlert';
  if (root === 'zoom-in') return 'zoomPlus';
  if (root === 'zoom-out') return 'zoomMinus';
  if (root === 'skip-back' || root === 'skip-forward') return 'skip';
  if (root === 'rotate-cw' || root === 'rotate-ccw') return 'rotate';
  if (root === 'sort-descending') return 'sortDown';
  if (root === 'qr-code') return 'qr';
  if (root === 'more-horizontal' || root === 'more-vertical') return 'dot';
  if (paths[direct]) return direct;
  if (root === 'plus') return 'plus';
  if (root === 'minus') return 'line';
  if (root === 'x') return 'cross';
  return 'roundSquare';
};

const synonym = {
  dashboard: 'overview',
  grid: 'layout',
  sidebar: 'drawer',
  pin: 'marker',
  location: 'target',
  route: 'path',
  navigation: 'compass',
  link: 'connect',
  save: 'store',
  share: 'export',
  send: 'deliver',
  scan: 'detect',
  bookmark: 'favorite',
  archive: 'storage',
  message: 'comment',
  chat: 'conversation',
  inbox: 'mailbox',
  broadcast: 'live',
  shield: 'security',
  key: 'access',
  password: 'credential',
  database: 'storage',
  cloud: 'remote',
  file: 'document',
  folder: 'directory',
  table: 'data',
  funnel: 'filter',
  calendar: 'date',
};

const make = (name, category, variant = 'outline') => {
  const root = name.replace(/-filled$/, '');
  const tags = [root, category, synonym[root] ?? root.split('-').at(-1)];
  return {
    name,
    category,
    tags: [...new Set(tags)],
    ...(variant === 'filled'
      ? {
          variant,
          ...(['warning', 'error', 'info'].includes(root)
            ? { stroke: 'none' }
            : {}),
        }
      : {}),
    paths: paths[kindFor(name)] ?? paths.roundSquare,
  };
};

const names = [
  ...Object.entries(groups).flatMap(([category, values]) =>
    values.map((name) => make(name, category)),
  ),
  ...filled.map(([name, category]) => make(name, category, 'filled')),
];

const byName = new Map(existing.map((icon) => [icon.name, icon]));
for (const icon of names) {
  if (byName.has(icon.name)) {
    const existingIndex = existing.findIndex(({ name }) => name === icon.name);
    if (existingIndex >= 0 && existingIndex < 48)
      throw new Error(`Icon already exists in the baseline: ${icon.name}`);
  }
  byName.set(icon.name, icon);
}
if (names.length !== 152)
  throw new Error(`Expected 152 new icons, got ${names.length}`);

const newNames = new Set(names.map(({ name }) => name));
const baseline = existing.filter(({ name }) => !newNames.has(name));
await writeFile(
  manifestPath,
  `${JSON.stringify([...baseline, ...names], null, 2)}\n`,
);
console.log(
  `Added ${names.length} original specs; catalog now contains ${byName.size} icons.`,
);
