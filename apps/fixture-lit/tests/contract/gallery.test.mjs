import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { browserPath, serveProduction } from '../../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const { chromium } = await import('playwright');
test('Lit full native gallery has measurable 54-item narrow, zoom, forced colors and shadow theme states', async () => {
  const directory = new URL('../../../../.superpowers/sdd/PLAN/t10-lit-logs/visuals/', import.meta.url); await mkdir(directory, { recursive: true });
  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname); const browser = await chromium.launch();
  const metrics = [];
  try { const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' }); const errors = []; page.on('pageerror', error => errors.push(String(error)));
    await page.goto(`${server.origin}/gallery.html`); await page.waitForFunction(() => document.querySelectorAll('#gallery > section').length === 54); await page.evaluate(async () => { for (const host of document.querySelectorAll('#gallery section form > *')) await host.updateComplete; });
    for (const [name, width, zoom, forced] of [['desktop', 1440, false, 'none'], ['narrow', 320, false, 'none'], ['text-200', 640, true, 'none'], ['forced-colors', 640, false, 'active']]) {
      await page.setViewportSize({ width, height: 1000 }); await page.emulateMedia({ forcedColors: forced }); await page.evaluate(zoom => { document.body.style.fontSize = zoom ? '200%' : ''; }, zoom); await page.screenshot({ path: new URL(`${name}.png`, directory).pathname, fullPage: true, animations: 'disabled' });
      const measurement = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth, count: document.querySelectorAll('#gallery > section').length, font: getComputedStyle(document.querySelector('krds-text-input').shadowRoot.querySelector('input')).fontSize })); metrics.push({ name, ...measurement }); assert.equal(measurement.count, 54); assert.ok(measurement.width <= measurement.viewport + 1, `${name} page overflow: ${JSON.stringify(measurement)}`);
    }
    await page.emulateMedia({ forcedColors: 'none' }); await page.evaluate(() => { document.body.style.fontSize = ''; }); await page.getByRole('button', { name: '테마 확인 모달 열기' }).click(); await page.getByRole('dialog', { name: '신청 확인', exact: true }).waitFor(); await page.getByRole('button', { name: '본문 작업' }).focus(); await page.screenshot({ path: new URL('shadow-theme-focus.png', directory).pathname, fullPage: true, animations: 'disabled' });
    metrics.push({ name: 'shadow-theme-focus', ...(await page.locator('krds-modal').evaluate(host => ({ background: getComputedStyle(host.shadowRoot.querySelector('dialog')).backgroundColor, focus: host.shadowRoot.activeElement?.textContent }))) }); assert.deepEqual(errors, []);
  } finally { await browser.close(); await server.close(); }
  await writeFile(new URL('metrics.json', directory), JSON.stringify(metrics, null, 2));
});
