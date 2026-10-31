import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const host = '127.0.0.1';
const docsPort = Number(process.env.KRDS_DOCS_PORT ?? 49100);
const types = { '.html': 'text/html; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.webm': 'video/webm', '.vtt': 'text/vtt' };
const profiles = ['solid', 'react', 'svelte', 'vue', 'lit', 'qwik', 'angular', 'solid-next'];
const native = new Map();
const base = '/krds/';
const serve = async (directory, port, isDocs = false) => {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${host}:${port}`);
      if (isDocs) {
        if (url.pathname === '/krds' || url.pathname === '/') { response.writeHead(302, { Location: base }); response.end(); return; }
        if (!url.pathname.startsWith(base)) { response.writeHead(404); response.end('Documentation is served beneath /krds/'); return; }
        url.pathname = url.pathname.slice(base.length - 1);
      }
      if (isDocs && url.pathname.startsWith('/native/')) {
        const key = url.pathname.split('/')[2];
        if (!native.has(key)) { response.writeHead(404, { 'Content-Type': 'text/plain' }); response.end(`No static native output registered for ${key}. Build the native workspace; Qwik production resume requires its real server and is not served as a static fixture.`); return; }
        response.writeHead(302, { Location: `http://${host}:${native.get(key)}/${url.pathname.split('/').slice(3).join('/')}${url.search}` }); response.end(); return;
      }
      const path = resolve(directory, `.${decodeURIComponent(url.pathname)}`);
      if (path !== directory && !path.startsWith(`${directory}${sep}`)) { response.writeHead(403); response.end(); return; }
      const candidates = [path, `${path}.html`, resolve(path, 'index.html')];
      let found;
      for (const candidate of candidates) if (existsSync(candidate) && (await stat(candidate)).isFile()) { found = candidate; break; }
      if (!found) { response.writeHead(404, { 'Content-Type': 'text/plain' }); response.end('Output not found. Build this workspace first.'); return; }
      response.writeHead(200, { 'Content-Type': types[extname(found)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(await readFile(found));
    } catch { response.writeHead(400); response.end('Invalid local request'); }
  });
  await new Promise((accept, reject) => { server.once('error', reject); server.listen(port, host, accept); });
  const boundPort = server.address().port;
  console.log(`http://${host}:${boundPort} → ${directory}`);
  return boundPort;
};
for (const framework of profiles) for (const kind of ['fixture', 'storybook']) {
  if (framework === 'qwik' && kind === 'fixture') continue;
  const key = `${kind}-${framework}`;
  const output = resolve(root, `apps/${key}/dist`);
  const directory = existsSync(resolve(output, 'browser/index.html')) ? resolve(output, 'browser') : output;
  if (existsSync(resolve(directory, 'index.html'))) native.set(key, await serve(directory, 0));
}
await serve(resolve(root, 'apps/docs/dist'), docsPort, true);
