import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'docs/qa/ni-06-contact-sheets');
const check = process.argv.includes('--check');
const specs = JSON.parse(
  await readFile(join(root, 'packages/core/icons/icons.json'), 'utf8'),
);
const additions = specs.slice(394, 500);
const outlines = additions.filter((icon) => icon.variant !== 'filled');
const byName = new Map(additions.map((icon) => [icon.name, icon]));
if (
  outlines.length !== 53 ||
  additions.length !== 106 ||
  outlines.some((icon) => !byName.has(`${icon.name}-filled`))
) {
  throw new Error('NI-06 contact sheets require exactly 53 complete new pairs.');
}

if (!check) await mkdir(output, { recursive: true });
async function emit(filename, value) {
  const path = join(output, filename);
  if (check) {
    if ((await readFile(path, 'utf8').catch(() => null)) !== value) {
      throw new Error(`Out-of-date NI-06 QA artifact: ${path}`);
    }
  } else {
    await writeFile(path, value);
  }
}
const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const sizes = [16, 20, 24, 32];
const svgs = new Map();
for (const icon of additions) {
  svgs.set(
    icon.name,
    await readFile(join(root, 'packages/core/svg', `${icon.name}.svg`), 'utf8'),
  );
}
function sample(icon, size, theme) {
  const svg = svgs
    .get(icon.name)
    .replace('<svg ', `<svg style="width:${size}px;height:${size}px" `);
  return `<div class="sample ${theme}" title="${escape(icon.name)} ${size}px ${theme}">${svg}</div>`;
}
const pages = [];
for (let start = 0; start < outlines.length; start += 9) {
  const page = String(pages.length + 1).padStart(2, '0');
  const rows = outlines
    .slice(start, start + 9)
    .map((outline) => {
      const filled = byName.get(`${outline.name}-filled`);
      const cells = [
        ['outline', outline, 'light'],
        ['filled', filled, 'light'],
        ['outline', outline, 'dark'],
        ['filled', filled, 'dark'],
      ]
        .map(
          ([variant, icon, theme]) =>
            `<b>${variant} · ${theme}</b>${sizes.map((size) => sample(icon, size, theme)).join('')}`,
        )
        .join('');
      return `<section class="family"><h2>${escape(outline.name)} <small>${escape(outline.category)}</small></h2><div class="variants"><span></span>${sizes.map((size) => `<strong>${size}px</strong>`).join('')}${cells}</div></section>`;
    })
    .join('\n');
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>NI-06 QA ${page}</title><style>*{box-sizing:border-box}body{font:14px system-ui,sans-serif;margin:20px;color:#182433;background:#fff}h1{font-size:20px;margin:0 0 10px}.note{font-size:12px;margin:0 0 16px}.family{border-top:1px solid #a8b4c4;padding:8px 0 11px}h2{font-size:14px;margin:0 0 6px}small{font-weight:400;color:#526479;margin-left:8px}.variants{display:grid;grid-template-columns:120px repeat(4,92px);gap:3px;align-items:center}.variants>strong{text-align:center;font-size:12px}.variants>b{font-size:11px}.sample{height:38px;display:flex;align-items:center;justify-content:center;border:1px solid #c9d3df}.light{color:#2567c8;background:#fff}.dark{color:#a8caff;background:#111b2a}.sample svg{display:block;flex:none}</style><h1>Neural Icons · NI-06 internal QA · sheet ${page}/${String(Math.ceil(outlines.length / 9)).padStart(2, '0')}</h1><p class="note">New families ${start + 1}–${Math.min(start + 9, outlines.length)} of 53. Compare both variants at 16/20/24/32 px, light and dark. Not a public showcase.</p>${rows}</html>`;
  const filename = `page-${page}.html`;
  await emit(filename, html);
  pages.push(filename);
}
await emit(
  'README.md',
  `# NI-06 internal contact sheets\n\nGenerated from the 53 new families in \`packages/core/icons/icons.json\` by \`node tools/generate-ni06-review.mjs\`. These ${pages.length} pages compare 106 new glyphs at 16/20/24/32 px in light/dark. NI-02's 20 historical sheets are not changed. This is QA tooling, not a public showcase.\n\n${pages.map((name, index) => `- [Sheet ${String(index + 1).padStart(2, '0')}](${name})`).join('\n')}\n`,
);
console.log(`${check ? 'Verified' : 'Generated'} ${pages.length} NI-06 contact sheets for 53 new families.`);
