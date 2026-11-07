import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const fixture = fileURLToPath(new URL('../..', import.meta.url));
const base = '/krds/previews/react/';
const server = createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (!path.startsWith(base) || path.includes('..')) { res.writeHead(404).end(); return; }
  try {
    const bytes = readFileSync(resolve(fixture, 'dist/docs-preview', path.slice(base.length) || 'index.html'));
    res.setHeader('content-type', ({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[extname(path)] || 'application/octet-stream');
    res.end(bytes);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const url = `http://127.0.0.1:${server.address().port}${base}index.html`;
  await page.goto(`${url}?component=button&example=default`);
  assert.match(await page.getByRole('status').innerText(), /아직/);
  await page.getByRole('button', {name:'신청하기',exact:true}).click();
  assert.match(await page.getByRole('status').innerText(), /1회/);
  await page.reload();
  assert.match(await page.getByRole('status').innerText(), /아직/);
  await page.goto(`${url}?component=accordion&example=default`);
  const trigger = page.getByRole('button', {name:'신청 방법',exact:false});
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
  await trigger.click();
  assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.getByRole('region', {name:'신청 방법'}).innerText(), '온라인 신청서를 작성한 후 제출해 주세요.');
  await trigger.click();
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
  assert.deepEqual(errors, []);
  console.log('PASS: native Button callback + reload reset; Accordion real content expansion + collapse; zero page errors.');
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
