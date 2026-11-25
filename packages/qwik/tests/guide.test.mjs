import '../../../tools/testing/browser-cache-preload.mjs';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';

// Native Qwik SSR + qwikloader resume of Pagination, Resize and StepIndicator against the official KRDS guide (component_03_06, component_10_02, component_07_01).
const config = resolve(import.meta.dirname, 'guide/vite.config.mjs');
const styles = fileURLToPath(import.meta.resolve('@unofficial-krds/styles/all.css'));
let out, render, server, origin, browser;
before(async () => {
  out = await mkdtemp(join(tmpdir(), 'krds-qwik-guide-'));
  process.env.KRDS_QWIK_GUIDE_OUT = out;
  await build({ configFile: config });
  await build({ configFile: config, build: { ssr: resolve(import.meta.dirname, 'guide/entry.ssr.tsx') } });
  ({ render } = await import(pathToFileURL(join(out, 'server/entry.ssr.js')).href));
  server = createServer(async (request, response) => {
    const path = new URL(request.url, 'http://127.0.0.1').pathname;
    try {
      if (path.endsWith('.html')) { response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end((await render(path.slice(1, -5))).html); return; }
      if (path.includes('..')) { response.writeHead(403).end(); return; }
      response.writeHead(200, { 'content-type': extname(path) === '.js' ? 'text/javascript' : 'application/octet-stream' }).end(await readFile(join(out, 'client', path)));
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
});
after(async () => { await browser?.close(); await new Promise(done => server ? server.close(done) : done()); if (out) await rm(out, { recursive: true, force: true }); });

async function open(id, width) {
  const context = await browser.newContext({ locale: 'ko-KR', viewport: { width, height: 800 } }), page = await context.newPage();
  await page.goto(`${origin}/${id}.html`); await page.waitForLoadState('networkidle'); await page.addStyleTag({ path: styles });
  return { page, close: () => context.close() };
}

test('Pagination names page links and lists at most 11 items on a wide screen and 7 on a narrow one (KRDS component_03_06 L1077, L1108, L1290-1291)', async () => {
  const wide = ['1', '…', '12', '13', '14', '15', '16', '17', '18', '…', '30'], narrow = ['1', '…', '14', '15', '16', '…', '30'];
  for (const [width, items] of [[360, narrow], [1280, wide]]) {
    const { page, close } = await open('pagination', width);
    try {
      const read = () => page.evaluate(() => [...document.querySelectorAll('[data-krds-component="pagination"][data-krds-part="item"]')].map(item => item.textContent));
      await page.waitForFunction(expected => [...document.querySelectorAll('[data-krds-component="pagination"][data-krds-part="item"]')].map(item => item.textContent).join() === expected, items.join(), { timeout: 5000 }).catch(() => {});
      assert.deepEqual(await read(), items, `${width}px list`);
      const names = await page.evaluate(() => [...document.querySelectorAll('[data-krds-component="pagination"][data-krds-part="link"][href]')].map(link => [link.textContent, link.getAttribute('aria-label')]));
      assert.deepEqual(names, items.filter(item => item !== '…' && item !== '15').map(item => [item, item === '30' ? '마지막 페이지, 30' : `페이지 ${item}`]), `${width}px names`);
    } finally { await close(); }
  }
});

test('Resize defaults to the five official labelled scales (KRDS component_10_02 L896-905, L918)', async () => {
  const { page, close } = await open('resize', 1280);
  try {
    const facts = await page.evaluate(() => ({ options: [...document.querySelectorAll('[data-krds-component="resize"][data-krds-part="option"]')].map(node => node.textContent.trim()), trigger: document.querySelector('[data-krds-component="resize"][data-krds-part="trigger"]').textContent.trim() }));
    assert.deepEqual(facts, { options: ['작게 90%', '보통 100%', '조금 크게 110%', '크게 130%', '가장 크게 150%'], trigger: '화면 크기 보통 100%' });
  } finally { await close(); }
});

test('StepIndicator shows the step count and no hidden focusable step on a narrow screen (KRDS component_07_01 L889)', async () => {
  const controls = [['약관 확인', true], ['신청 완료', true]];
  for (const [width, summary] of [[360, true], [1280, false]]) {
    const { page, close } = await open('step-indicator', width);
    try {
      const facts = await page.evaluate(() => {
        const root = document.querySelector('[data-krds-component="step-indicator"][data-krds-part="root"]');
        const shown = node => { const box = node.getBoundingClientRect(); return node.checkVisibility() && box.width >= 8 && box.height >= 8; };
        const summary = [...root.querySelectorAll('*')].find(node => !node.childElementCount && node.textContent === '3단계 중 2단계');
        return { summary: !!summary && shown(summary), controls: [...root.querySelectorAll('a[href], button')].map(node => [node.textContent, shown(node)]) };
      });
      assert.deepEqual(facts, { summary, controls }, `${width}px`);
    } finally { await close(); }
  }
});
