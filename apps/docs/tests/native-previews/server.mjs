import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.webm': 'video/webm', '.vtt': 'text/vtt', '.woff2': 'font/woff2', '.woff': 'font/woff', '.webmanifest': 'application/manifest+json' };
/** Serves the final assembled tree at /krds/ only; anything else is a 404. Supports byte ranges for media. */
export async function serve(dist) {
  const root = resolve(dist);
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      assert.ok(pathname.startsWith('/krds/'));
      let path = resolve(root, '.' + pathname.slice(5));
      assert.ok(path === root || path.startsWith(root + '/'));
      if (pathname.endsWith('/')) path = resolve(path, 'index.html');
      const bytes = await readFile(path);
      res.setHeader('Content-Type', types[extname(path)] ?? 'application/octet-stream');
      res.setHeader('Accept-Ranges', 'bytes');
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
      if (range) {
        const start = range[1] ? Number(range[1]) : bytes.length - Number(range[2]);
        const end = range[1] && range[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1;
        res.statusCode = 206; res.setHeader('Content-Range', `bytes ${start}-${end}/${bytes.length}`);
        res.end(bytes.subarray(start, end + 1));
      } else res.end(bytes);
    } catch { res.statusCode = 404; res.end(); }
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(done => server.close(done)) };
}
