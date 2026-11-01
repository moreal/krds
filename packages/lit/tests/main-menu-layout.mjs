import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium, webkit } from 'playwright';

const workspace = resolve(import.meta.dirname, '..'), root = resolve(workspace, '../..');
const evidence = resolve(process.env.KRDS_LIT_MENU_EVIDENCE ?? resolve(root, 'test-results/unofficial-docs/header-fix/fix-round1/lit'));
await mkdir(evidence, { recursive: true });
const server = await createServer({ root: workspace, configFile: false, server: { host: '127.0.0.1', port: 0 }, plugins: [{ name: 'native-menu-regression-page', configureServer(server) {
 server.middlewares.use(async (req, res, next) => {
  if (req.url !== '/__main-menu.html') return next();
  const html = `<!doctype html><html><head><style>body{margin:0;font:16px sans-serif}#spacer{height:340px}</style></head><body><div id="spacer"></div><krds-review-menu></krds-review-menu><main style="height:1000px">Following content</main><script type="module">
   import { MainMenu } from './dist/components/main-menu/index.js';
   import '@unofficial-krds/tokens/tokens.css';
   customElements.define('krds-review-menu', MainMenu);
   const menu=document.querySelector('krds-review-menu');
   menu.items=[{id:'catalog',label:'Catalog',children:[{id:'nested',label:'Nested',children:[{id:'deep',label:'Deep link',href:'#deep'}]},...Array.from({length:55},(_,i)=>({id:'c'+i,label:'Component '+(i+1),href:'#c'+i}))]}];
   await menu.updateComplete;window.menuReady=true;
  </script></body></html>`;
  res.setHeader('Content-Type', 'text/html'); res.end(await server.transformIndexHtml(req.url, html));
 });
} }] });
await server.listen(); const origin = server.resolvedUrls.local[0], results = [];
try {
 for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch({ headless: true });
  try {
   const page = await browser.newPage({ viewport: { width: 1000, height: 800 } }), errors = [];
   page.on('pageerror', error => errors.push(error.message));
   await page.goto(origin + '__main-menu.html'); await page.waitForFunction(() => window.menuReady);
   const trigger = page.locator('krds-review-menu #trigger-catalog');
   const geometry = () => page.evaluate(() => { const menu=document.querySelector('krds-review-menu'), nav=menu.shadowRoot.querySelector('nav');return {nav:nav.getBoundingClientRect().height,main:document.querySelector('main').getBoundingClientRect().top}; });
   const closed = await geometry(); await trigger.click();
   const panel = page.locator('krds-review-menu #submenu-catalog');
   await page.waitForFunction(() => document.querySelector('krds-review-menu').shadowRoot.querySelector('#submenu-catalog').getBoundingClientRect().height > 0);
   const opened = await geometry(); assert.ok(Math.abs(opened.nav-closed.nav)<=1); assert.ok(Math.abs(opened.main-closed.main)<=1);
   assert.equal(await panel.evaluate(element => getComputedStyle(element).position), 'absolute');
   for (const [height, font] of [[800,16], [650,16], [650,32]]) {
    await page.setViewportSize({ width: 1000, height });
    await page.evaluate(font => document.body.style.fontSize = `${font}px`, font);
    await page.waitForFunction(() => { const panel=document.querySelector('krds-review-menu').shadowRoot.querySelector('#submenu-catalog');return panel.getBoundingClientRect().bottom<=innerHeight+1; });
    const before = await page.evaluate(() => scrollY);
    await panel.evaluate(element => element.scrollTop = element.scrollHeight);
    const last = await panel.locator('a').last().boundingBox(), box = await panel.boundingBox();
    assert.ok(last.y+last.height<=height+1); assert.ok(box.y+box.height<=height+1); assert.equal(await page.evaluate(() => scrollY),before);
   }
   await page.locator('krds-review-menu #trigger-nested').click();
   assert.equal(await page.locator('krds-review-menu #submenu-nested').evaluate(element => getComputedStyle(element).position), 'static');
   await page.screenshot({ path: resolve(evidence, name+'-desktop-open.png') });
   await page.setViewportSize({ width: 320, height: 800 });
   await page.waitForFunction(() => document.querySelector('krds-review-menu').shadowRoot.querySelector('nav').dataset.krdsLayout==='mobile');
   await page.locator('krds-review-menu [data-mobile-trigger]').click();
   const dialog = page.locator('krds-review-menu dialog'); assert.ok(await dialog.isVisible());
   assert.notEqual(await dialog.locator('#submenu-catalog').evaluate(element => getComputedStyle(element).position), 'absolute');
   await page.locator('krds-review-menu [data-krds-part="close"]').click();
   await page.setViewportSize({ width: 1000, height: 800 });
   await page.waitForFunction(() => document.querySelector('krds-review-menu').shadowRoot.querySelector('nav').dataset.krdsLayout==='desktop');
   await trigger.click();
   assert.equal(await page.locator('krds-review-menu nav').evaluate(element => element.style.getPropertyValue('--krds-main-menu-available-height')), '');
   await trigger.click();
   await page.evaluate(() => { const menu=document.querySelector('krds-review-menu'); window.removedNav=menu.shadowRoot.querySelector('nav');menu.remove();document.body.append(window.removedNav);window.removedNav.style.height='123px';dispatchEvent(new Event('resize'));visualViewport?.dispatchEvent(new Event('resize')); });
   await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
   assert.equal(await page.evaluate(() => window.removedNav.style.getPropertyValue('--krds-main-menu-available-height')), '');
   assert.deepEqual(errors, []); results.push({engine:name,closed,opened,status:'passed'});
  } finally { await browser.close(); }
 }
} finally { await server.close(); await writeFile(resolve(evidence,'results.json'),JSON.stringify(results,null,2)+'\n'); }
console.log('Actual public Lit MainMenu desktop overlay, viewport bounds, nested flow and mobile isolation passed in Chromium and WebKit.');
