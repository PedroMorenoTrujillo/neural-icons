import assert from 'node:assert/strict';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const browser = join(root, 'dist/apps/showcase/browser');
const server = join(root, 'dist/apps/showcase/server');
const output = join(root, '.vercel/output');
const functionDirectory = join(output, 'functions/showcase.func');

assert((await readFile(join(browser, 'index.csr.html'), 'utf8')).includes('<html'));
assert((await readFile(join(server, 'server.mjs'), 'utf8')).includes('reqHandler'));

await rm(output, { recursive: true, force: true });
await mkdir(functionDirectory, { recursive: true });
await cp(browser, join(output, 'static'), {
  recursive: true,
  filter: (source) => source === browser || !source.endsWith('/index.csr.html'),
});
await cp(server, join(functionDirectory, 'server'), { recursive: true });
await cp(browser, join(functionDirectory, 'browser'), { recursive: true });
await writeFile(
  join(functionDirectory, 'index.mjs'),
  "export { reqHandler as default } from './server/server.mjs';\n",
);
await writeFile(
  join(functionDirectory, '.vc-config.json'),
  JSON.stringify({ runtime: 'nodejs22.x', handler: 'index.mjs', launcherType: 'Nodejs' }),
);
await writeFile(
  join(output, 'config.json'),
  JSON.stringify({
    version: 3,
    routes: [{ handle: 'filesystem' }, { src: '/(.*)', dest: '/showcase' }],
  }),
);

console.log('Vercel output: static assets + Angular SSR function');
