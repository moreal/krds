import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import solid from 'vite-plugin-solid';
import { chromium } from 'playwright';

const directory = resolve(process.argv.find(value => value.startsWith('--output='))?.slice(9) ?? '.superpowers/sdd/PLAN/t10-solid-logs/remaining-review-fix2/hydration');
const workspace = resolve(import.meta.dirname, '../..');
const bindings = [];
await mkdir(directory, { recursive: true });
for (const target of ['client', 'server']) {
  const binding = { name: 'record-actual-public-entry', enforce: 'pre', async resolveId(source, importer, options) {
    if (source !== '@unofficial-krds/solid') return;
    const result = await this.resolve(source, importer, { ...options, skipSelf: true });
    bindings.push({ target, source, resolved: result.id, sha256: createHash('sha256').update(await readFile(result.id)).digest('hex') });
    return result;
  } };
  await build({ root: workspace, publicDir: false, configFile: false, plugins: [binding, solid({ ssr: true })], ssr: { noExternal: true }, build: { outDir: join(directory, target), emptyOutDir: true, ssr: target === 'server', minify: false, lib: { entry: join(import.meta.dirname, `${target}.tsx`), formats: ['es'], fileName: () => `${target}.js` } } });
}
assert.equal(typeof document, 'undefined');
const { render } = await import(pathToFileURL(join(directory, 'server/server.js')));
const output = render();
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" href="data:,">${output.head}</head><body><div id="app">${output.body}</div><script>window.__beforeRemaining={menu:document.querySelector('#hydration-menu nav'),opener:document.querySelector('#hydration-menu [data-krds-part="mobile-trigger"]'),search:document.querySelector('#hydration-menu input'),outline:document.querySelector('#hydration-outline a'),current:document.querySelector('#hydration-pages [aria-current="page"]'),help:document.querySelector('#hydration-help button'),tutorial:document.querySelector('#hydration-tutorial button')};</script><script type="module" src="/client.js"></script></body></html>`;
await writeFile(join(directory, 'server.html'), html);
const bytes = new Map();
for (const file of await readdir(join(directory, 'client'))) bytes.set(`/${file}`, await readFile(join(directory, 'client', file)));
const server = createServer((request, response) => { const path = request.url.split('?')[0]; response.setHeader('Content-Type', path === '/' ? 'text/html' : 'text/javascript'); if (path === '/') response.end(html); else if (bytes.has(path)) response.end(bytes.get(path)); else { response.statusCode = 404; response.end(); } });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const report = { coverageAwarded: false, publicPackageConsumption: true, sourceAliases: [], bindings, results: [], errors: [], forbidden: [] };
try {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 }, reducedMotion: 'reduce' });
  const page = await context.newPage(); page.on('pageerror', error => report.errors.push(String(error)));
  await page.route('**/*', route => { if (new URL(route.request().url()).origin !== origin) { report.forbidden.push(route.request().url()); return route.abort(); } return route.continue(); });
  await page.goto(origin);
  await page.waitForFunction(() => window.__remainingHydrationReady, undefined, { timeout: 5000 });
  const retained = await page.evaluate(() => ({ menu: window.__beforeRemaining.menu === document.querySelector('#hydration-menu nav'), opener: window.__beforeRemaining.opener === document.querySelector('#hydration-menu [data-krds-part="mobile-trigger"]'), outline: window.__beforeRemaining.outline === document.querySelector('#hydration-outline a'), current: window.__beforeRemaining.current === document.querySelector('#hydration-pages [aria-current="page"]'), help: window.__beforeRemaining.help === document.querySelector('#hydration-help button'), tutorial: window.__beforeRemaining.tutorial === document.querySelector('#hydration-tutorial button'), events: document.getElementById('hydration-events').textContent, dialogs: document.querySelectorAll('[role="dialog"]').length }));
  report.retained = retained;
  assert.ok(Object.entries(retained).filter(([key]) => !['events', 'dialogs'].includes(key)).every(([, value]) => value), 'Actual native SSR nodes must survive narrow hydration');
  assert.equal(retained.events, '[]'); assert.equal(retained.dialogs, 0);
  report.viewport = await page.evaluate(() => ({ width: innerWidth, narrow: matchMedia('(max-width: 767px)').matches, openerHidden: document.querySelector('#hydration-menu [data-krds-part="mobile-trigger"]').hidden }));
  assert.equal(report.viewport.openerHidden, false, 'Hydrated narrow native mobile opener must become operable');
  await page.locator('#hydration-menu [data-krds-part="mobile-trigger"]').click();
  await page.getByRole('dialog').waitFor();
  assert.equal(await page.evaluate(() => window.__beforeRemaining.search === document.querySelector('[role="dialog"] input')), true, 'The actual native server search input must survive media adaptation');
  await page.getByRole('searchbox').fill('first query');
  await page.getByRole('button', { name: '메뉴 닫기' }).click();
  await page.locator('#hydration-outline [data-krds-part="disclosure-trigger"]').click();
  await page.getByRole('link', { name: 'Requirements', exact: true }).click();
  await page.locator('#hydration-pages').getByText('9', { exact: true }).click();
  const events = JSON.parse(await page.locator('#hydration-events').textContent());
  for (const name of ['query', 'outline', 'page']) assert.equal(events.filter(value => value === name).length, 1, `One first ${name} request`);
  assert.equal(await page.locator('#hydration-pages [aria-current="page"]').textContent(), '9');
  await page.locator('#hydration-help button').click(); await page.getByRole('dialog', { name: '도움말' }).waitFor();
  await page.getByRole('button', { name: '도움말 닫기' }).click();
  assert.equal(JSON.parse(await page.locator('#hydration-events').textContent()).filter(value => value === 'help').length, 2);
  assert.deepEqual(report.errors, []); assert.deepEqual(report.forbidden, []);
  await page.screenshot({ path: join(directory, 'narrow-after.png') });
  report.results.push({ status: 'passed', viewport: 360, checks: ['actual public native server render', 'same initial hydration tree', 'native DOM/search state retention', 'narrow omitted panel defaults without callbacks', 'one first query/outline/page request', 'narrow modal opener/close', 'no runtime errors or forbidden requests'] });
  await context.close();
} catch (error) { report.results.push({ status: 'failed', error: String(error) }); process.exitCode = 1; }
finally { await browser.close(); await new Promise(resolve => server.close(resolve)); await writeFile(join(directory, 'report.json'), JSON.stringify(report, null, 2) + '\n'); }
console.log(JSON.stringify(report.results));
