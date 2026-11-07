import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium, webkit } from '@playwright/test';

// Built public-package consumption: no replacement nav, injected layout or KRDS JS.
const root = resolve(import.meta.dirname, '../../..'), site = resolve(root, 'apps/docs');
const evidence = resolve(process.env.KRDS_HEADER_EVIDENCE ?? resolve(root, 'test-results/unofficial-docs/header-fix/browser'));
await mkdir(evidence, { recursive: true });
const server = createServer(async (req, res) => {
 try {
  const pathname = new URL(req.url, 'http://local').pathname;
  assert.ok(pathname.startsWith('/krds/'));
  let file = resolve(site, 'dist', '.' + pathname.slice(5));
  if (pathname.endsWith('/')) file = resolve(file, 'index.html');
  assert.ok(file.startsWith(resolve(site, 'dist') + '/'));
  res.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' })[extname(file)] ?? 'application/octet-stream');
  res.end(await readFile(file));
 } catch { res.statusCode = 404; res.end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`, results = [];
const part = (component, name) => `[data-krds-component="${component}"][data-krds-part="${name}"]`;
const measurements = page => page.evaluate(() => {
 const rect = selector => { const element = document.querySelector(selector), r = element?.getBoundingClientRect(); return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null; };
 return { bodyFont: getComputedStyle(document.body).fontSize, width: innerWidth, scrollWidth: document.documentElement.scrollWidth, header: rect('.docs-header > header'), identity: rect('.docs-header [data-krds-part="identity"]'), actions: rect('.docs-header [data-krds-component="header"][data-krds-part="actions"]'), navigation: rect('.docs-header [data-krds-component="header"][data-krds-part="navigation"]'), main: rect('#docs-main') };
});
const settle = async page => { await page.waitForFunction(() => document.querySelector('[data-docs-ready="true"]') && !document.querySelector('astro-island[ssr]')); await page.evaluate(() => document.fonts.ready); };
const resize = async (page, width) => {
 await page.setViewportSize({ width, height: 1000 });
 await page.waitForFunction(() => document.querySelector('[data-krds-component="main-menu"][data-krds-part="root"]')?.getAttribute('data-krds-layout') === (innerWidth <= 767 ? 'mobile' : 'desktop'));
 await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
};
try {
 for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch({ headless: true });
  try {
   const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }), errors = [];
   page.on('pageerror', error => errors.push(error.message));
   await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
   for (const width of [1440, 1000, 320]) for (const doubled of [false, true]) {
    await page.goto(origin + '/krds/', { waitUntil: 'networkidle' }); await settle(page); await resize(page, width);
    if (doubled) await page.evaluate(() => document.documentElement.style.fontSize = '125%');
    const before = await measurements(page), tag = `${name}-${width}-${doubled ? 'text200' : 'text100'}`;
    assert.equal(before.bodyFont, doubled ? '32px' : '16px');
    assert.ok(before.scrollWidth <= width + 1, `${tag} horizontal page fit`);
    const logo = page.locator('.docs-header img');
    const ratio = await logo.evaluate(img => img.naturalWidth / img.naturalHeight); assert.ok(Math.abs(ratio - 338 / 40) < .01);
    const breadcrumb = page.locator(part('breadcrumb', 'root')); assert.equal((await breadcrumb.textContent()).trim(), '홈');
    const search = page.locator('#docs-search-trigger');
    assert.ok(await search.isVisible());
    assert.ok(await search.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `${tag} readable search`);
    if (width >= 768) {
     assert.ok(before.navigation.y >= before.identity.y + before.identity.height - 1, `${tag} full-width navigation below identity`);
     assert.ok(before.navigation.y >= before.actions.y + before.actions.height - 1, `${tag} navigation below actions`);
     assert.ok(before.navigation.width >= before.header.width - 1, `${tag} navigation has full header width`);
     const catalog = page.locator('.docs-header button[aria-label="컴포넌트"]'); await catalog.click();
     const panel = page.locator('#' + await catalog.getAttribute('aria-controls'));
     const opened = await measurements(page);
     for (const item of ['header', 'identity', 'main']) for (const key of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(opened[item][key] - before[item][key]) <= 1, `${tag} ${item}.${key} stable`);
     const panelState = await panel.evaluate(element => { const r = element.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, listStyle: getComputedStyle(element).listStyleType, position: getComputedStyle(element).position, scrollHeight: element.scrollHeight, clientHeight: element.clientHeight }; });
     assert.equal(await panel.locator('a').count(), 55); assert.equal(panelState.position, 'absolute'); assert.equal(panelState.listStyle, 'none');
     assert.ok(panelState.height <= 701); assert.ok(panelState.y + panelState.height <= 1001, `${tag} panel fits remaining viewport`); assert.ok(panelState.scrollHeight > panelState.clientHeight); assert.ok(panelState.x >= -1 && panelState.x + panelState.width <= width + 1);
     assert.ok(Math.abs(panelState.y - (opened.navigation.y + opened.navigation.height)) <= 1);
     await page.screenshot({ path: resolve(evidence, tag + '-components-open.png') });
     const beforeScroll = await page.evaluate(() => scrollY);
     await panel.evaluate(element => element.scrollTop = element.scrollHeight);
     const last = panel.locator('a').last();
     const lastBox = await last.boundingBox(), panelBox = await panel.boundingBox(); assert.ok(lastBox.y + lastBox.height <= panelBox.y + panelBox.height + 1); assert.ok(lastBox.y + lastBox.height <= 1001); assert.equal(await page.evaluate(() => scrollY), beforeScroll);
     await last.focus();
     await page.keyboard.press('Escape'); assert.equal(await catalog.getAttribute('aria-expanded'), 'false'); assert.ok(await catalog.evaluate(element => element === document.activeElement));
     await catalog.click(); await page.locator('#docs-main').click({ position: { x: 8, y: 800 > opened.main.height ? 8 : 800 } });
     assert.equal(await catalog.getAttribute('aria-expanded'), 'false');
     const legal = page.locator('.docs-header a[href="/krds/legal/index.html"]'); assert.equal(await legal.count(), 1); assert.ok(await legal.isVisible());
     await catalog.click(); await legal.focus(); assert.equal(await catalog.getAttribute('aria-expanded'), 'true'); await page.keyboard.press(name==='webkit'&&process.platform==='darwin'?'Alt+Tab':'Tab');
     assert.equal(await catalog.getAttribute('aria-expanded'), 'false');
     await page.screenshot({ path: resolve(evidence, tag + '-legal-leaf.png') });
     results.push({ engine: name, width, doubled, before, opened, panel: panelState });
    } else {
     await page.locator('#docs-header-mobile-trigger').click();
     const dialog = page.locator('[role="dialog"][aria-modal="true"]'); assert.equal(await dialog.count(), 1);
     await dialog.locator('button[aria-label="컴포넌트"]').click();
     assert.deepEqual(await dialog.locator('ul').evaluateAll(lists => [...new Set(lists.map(element => getComputedStyle(element).listStyleType))]), ['none']);
     assert.ok(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1));
     await page.screenshot({ path: resolve(evidence, tag + '-mobile-open.png') });
     await dialog.locator(part('main-menu', 'close')).click();
     assert.equal(await dialog.count(), 0); assert.equal(await page.locator('[inert]').count(), 0);
     assert.equal(await page.evaluate(() => document.body.style.overflow), '');
     results.push({ engine: name, width, doubled, before });
    }
   }
   // Real navigation IDs, landing destinations and semantic paths survive hydration.
   await resize(page, 1440); await page.goto(origin + '/krds/components/badge.html', { waitUntil: 'networkidle' }); await settle(page);
   const currentRoot = page.locator('.docs-header button[aria-label="컴포넌트"]'); assert.equal(await currentRoot.getAttribute('aria-current'), 'true'); await currentRoot.click();
   assert.equal(await page.locator('.docs-header a[aria-current="page"]').getAttribute('href'), '/krds/components/badge.html');
   assert.match(await page.locator(part('breadcrumb', 'root')).textContent(), /홈.*컴포넌트.*Badge/);
   await page.goto(origin + '/krds/getting-started/artifacts.html', { waitUntil: 'networkidle' }); await settle(page);
   assert.equal(await page.locator('.docs-sidebar a[href="/krds/getting-started/installation.html"]').count(), 1);
   await page.goto(origin + '/krds/compatibility/examples.html', { waitUntil: 'networkidle' }); await settle(page);
   assert.equal(await page.locator('.docs-header button[aria-label="네이티브 예시"]').getAttribute('aria-current'), 'true');
   await resize(page, 320); await page.evaluate(() => document.documentElement.style.fontSize = '125%');
   const crumb = page.locator(part('breadcrumb', 'root')); assert.match(await crumb.textContent(), /홈.*네이티브 예제/);
   assert.ok(await crumb.evaluate(element => element.scrollWidth <= element.clientWidth + 1));
   await page.screenshot({ path: resolve(evidence, name + '-nonhome-text200.png') });
   assert.deepEqual(errors, []); await page.close();
  } finally { await browser.close(); }
 }
} finally { await writeFile(resolve(evidence, 'measurements.json'), JSON.stringify({ node: process.version, results }, null, 2) + '\n'); await new Promise(done => server.close(done)); }
console.log(`Header regression passed ${results.length} viewport/text cases across Chromium and WebKit.`);
