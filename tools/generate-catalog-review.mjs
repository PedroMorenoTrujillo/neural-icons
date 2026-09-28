import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Internal QA artifacts. This is deliberately not the public showcase.
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const specs = JSON.parse(
  await readFile(join(root, 'packages/core/icons/icons.json'), 'utf8'),
);
// NI-02 is a historical certification of the original 197 pairs. New NI-06
// pairs have their own contact sheets and must not rewrite this evidence.
if (specs[393]?.name !== 'underline-filled') {
  throw new Error('The frozen NI-02 manifest prefix has changed.');
}
const ni02Specs = specs.slice(0, 394);
const byName = new Map(ni02Specs.map((icon) => [icon.name, icon]));
const families = ni02Specs.filter((icon) => icon.variant !== 'filled');
const output = join(root, 'docs/qa/contact-sheets');
const check = process.argv.includes('--check');
const ledgersOnly = process.argv.includes('--ledgers-only');
if (!check && !ledgersOnly) await mkdir(output, { recursive: true });
async function emit(path, content) {
  if (ledgersOnly && path.startsWith(`${output}/`)) return;
  if (check) {
    const current = await readFile(path, 'utf8').catch(() => null);
    if (current !== content) {
      throw new Error(`Out-of-date QA artifact: ${path}`);
    }
  } else {
    await writeFile(path, content);
  }
}

const semanticDecisions = {
  'file-text': ['KEEP', 'Nombre correcto para un documento de texto; Proposal E diferencia su dibujo de file.'],
  'sort-descending': ['KEEP', 'Nombre correcto para ordenar en sentido descendente; se conserva la categoría actual porque no se aprobó reclasificación.'],
  'calendar-plus': ['KEEP', 'Calendario con signo más = añadir evento; nombre y categoría actuales conservados.'],
  'calendar-minus': ['KEEP', 'Calendario con signo menos = quitar evento; nombre y categoría actuales conservados.'],
  'calendar-check': ['KEEP', 'Calendario con check = evento confirmado; nombre y categoría actuales conservados.'],
  'calendar-x': ['KEEP', 'Calendario con equis = evento cancelado; nombre y categoría actuales conservados.'],
  'clock-plus': ['KEEP', 'Reloj con más = añadir tiempo; nombre y categoría actuales conservados.'],
  'clock-x': ['KEEP', 'Reloj con equis = cancelar hora/tiempo; nombre y categoría actuales conservados.'],
  image: ['KEEP', 'Marco con paisaje = recurso de imagen; nombre y categoría actuales conservados.'],
  'list-ordered': ['KEEP', 'Numerales junto a líneas = lista ordenada; nombre y categoría actuales conservados.'],
};
const geometric =
  /^(?:arrow-(?:left|right|up|down|up-right|up-left|down-right|down-left)|chevron-(?:left|right|up|down)|corner-(?:up-left|up-right|down-left|down-right)|x|plus|minus|more-horizontal|more-vertical|grid|list)$/;
const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const svgCache = new Map();
for (const icon of ni02Specs) {
  svgCache.set(
    icon.name,
    await readFile(join(root, 'packages/core/svg', `${icon.name}.svg`), 'utf8'),
  );
}

const ledger = [
  `# NI-02 — ${families.length}-family naming ledger`,
  '',
  'Generated from the final canonical manifest. All listed families have a final naming decision; categories are those actually present in the manifest. No unapproved category reclassification was applied. Public attach and funnel families were merged away; paperclip and filter remain canonical.',
  '',
  '| Family | Outline definition | Filled definition | Current name | Semantic category | Geometry-only | Naming status | Reason |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ...families.map((icon) => {
    const filled = byName.get(`${icon.name}-filled`);
    const decision = semanticDecisions[icon.name];
    const isGeometric = geometric.test(icon.name);
    const reason = decision
      ? decision[1]
      : isGeometric
        ? 'La etiqueta describe la dirección o forma representada; la intención de uso depende del contexto.'
        : 'La etiqueta nombra el objeto, acción o estado; sin conflicto nominal concreto detectado.';
    return `| \`${icon.name}\` | \`${icon.name}\` | \`${filled?.name ?? 'MISSING'}\` | \`${icon.name}\` | ${icon.category} | ${isGeometric ? 'yes' : 'no'} | ${decision?.[0] ?? 'KEEP'} | ${reason} |`;
  }),
  '',
];
await emit(join(root, 'docs/qa/NI-02-NAMING-LEDGER.md'), ledger.join('\n'));

const visualDecisions = {
  file: ['FIXED', 'file-filled: pliegue corregido con h5 → h4; el contorno exterior y file outline permanecen intactos.'],
  'file-text': ['FIXED', 'Proposal E aplicada: T geométrica, reconocible frente a file a 16 px; outline y filled comparten significado. A/C/D rechazadas.'],
  login: ['FIXED', 'Flecha de ambas variantes orientada hacia la puerta: entrar; logout conserva su dirección de salida.'],
  filter: ['MERGED', 'Familia canónica del filtrado; funnel quedó como keyword de búsqueda, sin definición ni export públicos duplicados.'],
  paperclip: ['MERGED', 'Familia canónica del clip; attach, attachment y file attachment son keywords, no iconos públicos.'],
  group: ['KEEP', 'Composición de grupo conservada separada de users; no se aprobó merge ni cambio geométrico.'],
  users: ['KEEP', 'Pluralidad de usuarios conservada separada de group; no se aprobó merge ni cambio geométrico.'],
  'more-horizontal': ['KEEP', 'Los tres puntos horizontales siguen separados y legibles a 16 px en claro y oscuro.'],
  'more-vertical': ['KEEP', 'Los tres puntos verticales siguen separados y legibles a 16 px en claro y oscuro.'],
  'folder-tree': ['KEEP', 'La jerarquía de carpetas se distingue de folder simple a 16 px; no se confirmó clipping.'],
  'corner-down-right': ['KEEP', 'El codo y la punta conservan la dirección abajo-derecha; el offset geométrico no causa desequilibrio óptico material.'],
  minimize: ['KEEP', 'Rectángulo con reducción central legible; no se exige que comparta silueta con maximize porque son acciones opuestas, no variantes.'],
  maximize: ['KEEP', 'Las cuatro esquinas exteriores comunican ampliación a 16/20/24/32 px.'],
  dashboard: ['KEEP', 'Retícula de cuatro paneles como vista de dashboard; comparte geometría con grid pero los identificadores conservan usos semánticos distintos.'],
  grid: ['KEEP', 'Primitiva de cuatro celdas; comparte geometría con dashboard, pero nombra el layout, no la vista de producto.'],
  success: ['KEEP', 'Círculo con check como estado de éxito; circle-check conserva lectura geométrica reutilizable.'],
  error: ['KEEP', 'Círculo con equis como estado de error; circle-x conserva lectura geométrica reutilizable.'],
  info: ['KEEP', 'Círculo con i como estado informativo; circle-info conserva lectura geométrica reutilizable.'],
};
const visualLedger = [
  `# NI-02 — ${families.length}-family visual dispositions`,
  '',
  'Final disposition based on the prior complete-catalog review and the regenerated final-manifest sheets at 16/20/24/32 px on light/dark backgrounds. KEEP means no concrete defect was confirmed, not mathematical pixel perfection. FIXED and MERGED record the approved and applied decisions; no REVIEW state remains.',
  '',
  '| Family | Disposition | Evidence / pending decision |',
  '| --- | --- | --- |',
  ...families.map((icon) => {
    const [status, reason] = visualDecisions[icon.name] ??
      ['KEEP', 'Pareja inspeccionada a 16/20/24/32 px en claro y oscuro; semántica, orientación, escala y lectura coherentes sin defecto concreto confirmado.'];
    const sheet = String(Math.floor(families.indexOf(icon) / 10) + 1).padStart(2, '0');
    return `| \`${icon.name}\` | ${status} | ${reason} Lámina ${sheet}. |`;
  }),
  '',
];
await emit(
  join(root, 'docs/qa/NI-02-VISUAL-DISPOSITIONS.md'),
  visualLedger.join('\n'),
);

const sizes = [16, 20, 24, 32];
const cell = (icon, size, theme) => {
  const svg = svgCache
    .get(icon.name)
    .replace('<svg ', `<svg style="width:${size}px;height:${size}px" `);
  return `<div class="sample ${theme}" title="${escape(icon.name)} ${size}px ${theme}">${svg}</div>`;
};
const pages = [];
for (let start = 0; start < families.length; start += 10) {
  const slice = families.slice(start, start + 10);
  const page = String(pages.length + 1).padStart(2, '0');
  const rows = slice
    .map((outline) => {
      const filled = byName.get(`${outline.name}-filled`);
      return `<section class="family"><h2>${escape(outline.name)} <small>${escape(outline.category)}</small></h2><div class="variants"><span></span>${sizes.map((size) => `<strong>${size}px</strong>`).join('')}<b>outline · light</b>${sizes.map((size) => cell(outline, size, 'light')).join('')}<b>filled · light</b>${sizes.map((size) => cell(filled, size, 'light')).join('')}<b>outline · dark</b>${sizes.map((size) => cell(outline, size, 'dark')).join('')}<b>filled · dark</b>${sizes.map((size) => cell(filled, size, 'dark')).join('')}</div></section>`;
    })
    .join('\n');
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>NI-02 QA sheet ${page}</title><style>*{box-sizing:border-box}body{font:14px system-ui,sans-serif;margin:20px;color:#182433;background:#fff}h1{font-size:20px;margin:0 0 10px}.note{font-size:12px;margin:0 0 16px}.family{border-top:1px solid #a8b4c4;padding:8px 0 11px}h2{font-size:14px;margin:0 0 6px}small{font-weight:400;color:#526479;margin-left:8px}.variants{display:grid;grid-template-columns:120px repeat(4,92px);gap:3px;align-items:center}.variants>strong{text-align:center;font-size:12px}.variants>b{font-size:11px}.sample{height:38px;display:flex;align-items:center;justify-content:center;border:1px solid #c9d3df}.light{color:#2567c8;background:#fff}.dark{color:#a8caff;background:#111b2a}.sample svg{display:block;flex:none}</style><h1>Neural Icons · internal QA · sheet ${page}/${String(Math.ceil(families.length / 10)).padStart(2, '0')}</h1><p class="note">Families ${start + 1}–${Math.min(start + 10, families.length)} of ${families.length}. Compare both variants at 16/20/24/32 px, light and dark. Not a public showcase.</p>${rows}</html>`;
  const filename = `page-${page}.html`;
  await emit(join(output, filename), html);
  pages.push(filename);
}
await emit(
  join(output, 'README.md'),
  `# Internal NI-02 contact sheets\n\nGenerated from \`packages/core/icons/icons.json\` and generated SVG assets by \`node tools/generate-catalog-review.mjs\`. Do not edit sheets manually. These ${pages.length} pages cover ${families.length} outline/filled families at 16/20/24/32 px on light/dark backgrounds. They are QA material, not the public showcase.\n\n${pages.map((name, i) => `- [Sheet ${String(i + 1).padStart(2, '0')}](${name})`).join('\n')}\n`,
);
console.log(
  ledgersOnly
    ? `${check ? 'Verified' : 'Generated'} ${families.length} naming and visual dispositions; contact sheets untouched.`
    : `${check ? 'Verified' : 'Generated'} ${families.length} naming rows and ${pages.length} internal contact sheets.`,
);
