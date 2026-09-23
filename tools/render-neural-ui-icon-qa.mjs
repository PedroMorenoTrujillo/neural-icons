import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import playwright from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs');
const specs = JSON.parse(
  await readFile(join(root, 'packages/core/icons/icons.json'), 'utf8'),
);
const byName = new Map(specs.map((icon) => [icon.name, icon]));
const required = [
  'circle-alert',
  'check',
  'circle-check',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'circle-x',
  'download',
  'external-link',
  'inbox',
  'info',
  'link',
  'list',
  'minus',
  'plus',
  'rotate-ccw',
  'rotate-cw',
  'save',
  'upload',
  'x',
  'zoom-in',
  'zoom-out',
  'warning',
  'edit',
  'trash',
  'bold',
  'dollar-sign',
  'eraser',
  'flip-horizontal',
  'flip-vertical',
  'image',
  'italic',
  'list-ordered',
  'trending-down',
  'trending-up',
  'underline',
];

const closedOutline = specs
  .filter(
    (icon) =>
      icon.variant !== 'filled' &&
      icon.paths.every((path) => path.trim().endsWith('z')),
  )
  .map((icon) => icon.name);

function svg(name, size) {
  const icon = byName.get(name);
  if (!icon) throw new Error(`Missing icon ${name}`);
  const filled = icon.variant === 'filled';
  const attributes = filled
    ? 'fill="currentColor" stroke="none"'
    : 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd" ${attributes} data-icon="${name}" data-size="${size}"><path d="${icon.paths.join(' ')}"/></svg>`;
}

function card(name, both = true) {
  const variants = both ? [name, `${name}-filled`] : [name];
  const sample = (variant, tone) =>
    `<div class="sample ${tone}"><span>${variant.endsWith('-filled') ? 'filled' : 'outline'}</span>${[16, 20, 24].map((size) => `<i>${svg(variant, size)}<small>${size}</small></i>`).join('')}</div>`;
  return `<article><h2>${name}</h2><div class="variants">${variants.map((variant) => `<div>${sample(variant, 'light')}${sample(variant, 'dark')}</div>`).join('')}</div></article>`;
}

function document(title, names, both) {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>${title}</title><style>
    *{box-sizing:border-box}body{margin:0;padding:20px;background:#e8edf5;font:13px system-ui,sans-serif;color:#172438}
    header{margin:0 0 16px}h1{font-size:20px;margin:0 0 4px}p{margin:0;color:#4d5d75}
    main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    article{background:white;border:1px solid #cbd4e3;border-radius:10px;overflow:hidden}
    h2{font:600 13px ui-monospace,monospace;margin:0;padding:8px 12px;border-bottom:1px solid #dfe5ef}
    .variants{display:grid;grid-template-columns:repeat(${both ? 2 : 1},1fr)}
    .variants>div+div{border-left:1px solid #dfe5ef}.sample{display:flex;align-items:center;justify-content:space-around;min-height:46px;padding:5px;color:#20355d}
    .sample.dark{background:#19263d;color:#f3f6ff}.sample span{min-width:45px;font-size:9px;color:#67788e}.sample.dark span{color:#aab8cb}
    i{min-width:31px;font-style:normal;display:flex;flex-direction:column;align-items:center;gap:2px}small{font-size:9px;color:#8290a2}
  </style><header><h1>${title}</h1><p>Outline and filled at 16, 20 and 24 px · light and dark surfaces · 24×24 viewBox</p></header><main>${names.map((name) => card(name, both)).join('')}</main></html>`;
}

await writeFile(
  join(docs, 'neural-ui-required-qa.html'),
  document('Neural UI required icon set', required, true),
);
await writeFile(
  join(docs, 'closed-outline-qa.html'),
  document('Closed outline candidates', closedOutline, false),
);

const browser = await playwright.chromium.launch({ headless: true });
try {
  for (const [prefix, names, both] of [
    ['neural-ui-required-qa', required, true],
    ['closed-outline-qa', closedOutline, false],
  ]) {
    for (let start = 0; start < names.length; start += 12) {
      const page = await browser.newPage({
        viewport: { width: 1320, height: 920 },
        deviceScaleFactor: 1,
      });
      await page.setContent(
        document(
          `${prefix} · ${start + 1}–${Math.min(start + 12, names.length)}`,
          names.slice(start, start + 12),
          both,
        ),
      );
      await page.screenshot({
        path: join(docs, `${prefix}-${Math.floor(start / 12) + 1}.png`),
        fullPage: true,
      });
      await page.close();
    }
  }
  const page = await browser.newPage();
  await page.setContent(document('Structural geometry check', required, true));
  const bounds = await page.locator('svg').evaluateAll((elements) =>
    elements.map((svg) => {
      const box = svg.querySelector('path').getBBox();
      const stroke = svg.getAttribute('stroke') === 'none' ? 0 : 0.875;
      return {
        name: svg.dataset.icon,
        size: Number(svg.dataset.size),
        left: box.x - stroke,
        top: box.y - stroke,
        right: box.x + box.width + stroke,
        bottom: box.y + box.height + stroke,
      };
    }),
  );
  await writeFile(
    join(docs, 'neural-ui-required-bounds.json'),
    `${JSON.stringify(bounds, null, 2)}\n`,
  );
  await page.close();
  const clipped = bounds.filter(
    (box) => box.left < 0 || box.top < 0 || box.right > 24 || box.bottom > 24,
  );
  console.log(
    JSON.stringify({
      required: required.length,
      candidates: closedOutline.length,
      clipped,
      screenshots: 6,
    }),
  );
  if (clipped.length) process.exitCode = 1;
} finally {
  await browser.close();
}
