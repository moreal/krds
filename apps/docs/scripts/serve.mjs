import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Serves exactly the final static tree that Pages publishes, beneath /krds/.
// Native previews are the assembled same-origin files in dist/previews; no
// fixture, Storybook or other-origin redirect is mapped here.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const host = '127.0.0.1';
const base = '/krds/';
const types = { '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.map': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.webm': 'video/webm', '.mp4': 'video/mp4', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.vtt': 'text/vtt', '.wasm': 'application/wasm' };

export async function createDocsServer({ directory = resolve(root, 'apps/docs/dist'), port = Number(process.env.KRDS_DOCS_PORT ?? 49100) } = {}) {
  directory = resolve(directory);
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${host}`);
      if (url.pathname === '/krds' || url.pathname === '/') { response.writeHead(302, { Location: base }); response.end(); return; }
      if (!url.pathname.startsWith(base)) { response.writeHead(404, { 'Content-Type': 'text/plain' }); response.end('Documentation is served beneath /krds/'); return; }
      const path = resolve(directory, `.${decodeURIComponent(url.pathname.slice(base.length - 1))}`);
      if (path !== directory && !path.startsWith(`${directory}${sep}`)) { response.writeHead(403); response.end(); return; }
      let found;
      for (const candidate of [path, `${path}.html`, resolve(path, 'index.html')]) if (existsSync(candidate) && (await stat(candidate)).isFile()) { found = candidate; break; }
      if (!found) { response.writeHead(404, { 'Content-Type': 'text/plain' }); response.end('Not found in the assembled documentation output. Run the docs build first.'); return; }
      response.writeHead(200, { 'Content-Type': types[extname(found)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(await readFile(found));
    } catch { response.writeHead(400); response.end('Invalid local request'); }
  });
  await new Promise((accept, reject) => { server.once('error', reject); server.listen(port, host, accept); });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = resolve(root, 'apps/docs/dist');
  if (!existsSync(resolve(directory, 'previews'))) console.warn('Warning: apps/docs/dist/previews is missing; build the docs with assembled native previews first.');
  const server = await createDocsServer({ directory });
  console.log(`http://${host}:${server.address().port}${base} → ${directory}`);
}
