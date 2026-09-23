import { readFileSync, writeFileSync } from 'node:fs';
import { renderApplication } from '@angular/platform-server';
import bootstrap from './main.server';

export async function renderFixture(): Promise<void> {
  const browser = new URL('../browser/', import.meta.url);
  const document = readFileSync(new URL('index.csr.html', browser), 'utf8');
  const html = await renderApplication(bootstrap, {
    document,
    url: 'http://localhost/',
    allowedHosts: ['localhost'],
  });

  for (const evidence of [
    'ngh=',
    'data-neural-icon="search"',
    'data-neural-icon="info"',
    'data-neural-icon="check-filled"',
    'data-neural-icon="save"',
    'aria-label="Information"',
  ]) {
    if (!html.includes(evidence))
      throw new Error(`Missing SSR evidence: ${evidence}`);
  }
  writeFileSync(new URL('index.html', browser), html);
  console.log('NeuralIcon SSR fixture rendered');
}
