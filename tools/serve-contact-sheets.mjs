import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(
  dirname(fileURLToPath(import.meta.url)),
  '../docs/qa/contact-sheets',
);
const port = Number(process.env.NEURAL_QA_PORT ?? 4312);
createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const filename = pathname === '/' ? 'page-01.html' : pathname.slice(1);
  if (!/^page-\d{2}\.html$/.test(filename)) {
    response.writeHead(404).end('Not found');
    return;
  }
  try {
    const html = await readFile(join(root, filename));
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(html);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Internal contact sheets: http://127.0.0.1:${port}/`);
});
