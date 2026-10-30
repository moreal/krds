import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { serveProduction } from '../../tools/testing/support.mjs';

const output = resolve('.superpowers/sdd/PLAN/t10-solid-logs/final-fab-overlay');
await mkdir(output, { recursive: true });
const server = await serveProduction(resolve('.superpowers/sdd/PLAN/t10-solid-logs/runtime-frozen-solid-20261030-1653/storybook-dist'));
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${server.origin}/iframe.html?id=krds-fab--expandable&viewMode=story`, { waitUntil: 'networkidle' });
  const root = page.locator('[data-krds-component="fab"][data-krds-part="root"]');
  const trigger = root.locator('[data-krds-part="trigger"]');
  await trigger.click();
  const expanded = await root.evaluate(node => {
    const overlay = node.querySelector('[data-krds-part="overlay"]');
    const box = overlay.getBoundingClientRect();
    const actions = [...node.querySelectorAll('[data-krds-part="action"]')].map(action => {
      const rect = action.getBoundingClientRect();
      return { text: action.textContent, hit: action.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)), top: rect.top, bottom: rect.bottom };
    });
    return { overlay: { left: box.left, top: box.top, right: box.right, bottom: box.bottom, background: getComputedStyle(overlay).backgroundColor }, actions };
  });
  await root.locator('[data-krds-part="action"]').last().click();
  const result = await page.locator('[data-krds-host="result"]').textContent();
  const axe = (await new AxeBuilder({ page }).include('[data-krds-component="fab"][data-krds-part="root"]').analyze()).violations;
  await page.screenshot({ path: join(output, 'expanded.png') });
  await page.mouse.click(20, 250);
  const collapsed = await trigger.getAttribute('aria-expanded') === 'false';
  const restored = await trigger.evaluate(node => document.activeElement === node);
  const overlayRemoved = await root.locator('[data-krds-part="overlay"]').count() === 0;
  const passed = expanded.overlay.left === 0 && expanded.overlay.top === 0 && expanded.overlay.right === 360 && expanded.overlay.bottom === 800 && expanded.actions.every(action => action.hit) && result === expanded.actions.at(-1).text && collapsed && restored && overlayRemoved && !axe.length;
  await writeFile(join(output, 'report.json'), JSON.stringify({ coverageAwarded: false, artifactSnapshot: server.artifactSnapshot, expanded, result, axe, collapsed, restored, overlayRemoved, passed }, null, 2) + '\n');
  console.log(JSON.stringify({ passed, collapsed, restored, result }));
  if (!passed) process.exitCode = 1;
  await context.close();
} finally { await browser.close(); await server.close(); }
