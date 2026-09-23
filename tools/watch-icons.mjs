import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'packages/core/icons');
let timer;
let running = false;
let pending = false;

function generate() {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  const child = spawn(process.execPath, ['tools/icons.mjs'], {
    cwd: root,
    stdio: 'inherit',
  });
  child.on('error', (error) => {
    console.error('Icon generation failed:', error);
  });
  child.on('close', (code) => {
    running = false;
    if (code !== 0) console.error(`Icon generation exited with ${code}.`);
    if (pending) {
      pending = false;
      generate();
    }
  });
}

watch(source, (_event, filename) => {
  if (filename !== 'icons.json') return;
  clearTimeout(timer);
  timer = setTimeout(generate, 150);
});

console.log('Watching packages/core/icons/icons.json for changes...');
generate();
