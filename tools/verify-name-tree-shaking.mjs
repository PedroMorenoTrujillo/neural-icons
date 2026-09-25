import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { gzipSync } from 'node:zlib';
import { resolve } from 'node:path';

// Angular's build tool already depends on esbuild; resolve its own copy so
// this gate does not add another dependency to the published workspace.
const angularBuildRequire = createRequire(
  new URL('../node_modules/@angular/build/package.json', import.meta.url),
);
const { build } = angularBuildRequire('esbuild');

const consumerRoot = resolve(process.argv[2] ?? '');
if (!process.argv[2]) {
  throw new Error('Pass the clean consumer directory as the first argument.');
}

const save = "import { iconSave } from '@neural-icons/core/icons/save';";
const download =
  "import { iconDownload } from '@neural-icons/core/icons/download';";
const cases = {
  A: `import { NeuralIcon } from '@neural-icons/angular';
      ${save} console.log(NeuralIcon, iconSave);`,
  B: `import { NeuralIcon, provideNeuralIcons } from '@neural-icons/angular';
      ${save} console.log(NeuralIcon, provideNeuralIcons(iconSave));`,
  C: `import { NeuralIcon, provideNeuralIcons } from '@neural-icons/angular';
      ${save} ${download}
      console.log(NeuralIcon, provideNeuralIcons(iconSave, iconDownload));`,
  D: `import { NeuralIcon, provideNeuralIcons } from '@neural-icons/angular';
      ${save} ${download}
      console.log(NeuralIcon, provideNeuralIcons(iconSave), provideNeuralIcons(iconDownload));`,
  E: `import { NeuralIcon } from '@neural-icons/angular'; console.log(NeuralIcon);`,
  F: `import { NeuralIcon, provideAllNeuralIcons } from '@neural-icons/angular';
      console.log(NeuralIcon, provideAllNeuralIcons());`,
};

const expectedModules = { A: 1, B: 1, C: 2, D: 2, E: 0, F: 394 };
const results = [];
for (const [name, contents] of Object.entries(cases)) {
  const result = await build({
    absWorkingDir: consumerRoot,
    stdin: { contents, resolveDir: consumerRoot, sourcefile: `${name}.mjs` },
    bundle: true,
    platform: 'browser',
    format: 'esm',
    minify: true,
    write: false,
    metafile: true,
    external: ['@angular/*'],
  });
  const code = result.outputFiles[0].text;
  const output = Object.values(result.metafile.outputs)[0];
  const retainedIconModules = Object.entries(output.inputs).filter(
    ([path, input]) =>
      input.bytesInOutput > 0 &&
      /@neural-icons\/core\/src\/icons\/[^/]+\.js$/.test(path) &&
      !path.endsWith('/index.js'),
  ).length;
  const unrelatedGeometryRetained = code.includes('eye-off');
  assert.equal(
    retainedIconModules,
    expectedModules[name],
    `${name}: wrong number of retained icon modules`,
  );
  assert.equal(
    unrelatedGeometryRetained,
    name === 'F',
    `${name}: unexpected catalog retention`,
  );
  results.push({
    case: name,
    rawBytes: Buffer.byteLength(code),
    gzipBytes: gzipSync(code).length,
    retainedIconModules,
    unrelatedGeometryRetained,
  });
}

console.log(JSON.stringify(results, null, 2));
