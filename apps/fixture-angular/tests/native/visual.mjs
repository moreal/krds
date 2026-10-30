import { serveProduction, root, browserPath } from '../../../../tools/testing/support.mjs';
import { guardStoryNetwork } from '../../../../tools/testing/network.mjs';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const directory = join(root, '.superpowers/sdd/PLAN/t07a-angular-logs/visual');
await mkdir(directory, { recursive: true });
const server = await serveProduction(join(root, 'apps/storybook-angular/dist'));
const browser = await chromium.launch();
const report = [];
try {
  const cases = [
    ['button-sizes', 'krds-button--sizes', 'button'],
    ['button-disabled', 'krds-button--disabled', null],
    ['select-invalid', 'krds-native-select--invalid', 'select'],
    ['select-disabled', 'krds-native-select--disabled', null],
    ['tabs-manual', 'krds-tabs--manual', '[role=tab]'],
    ['calendar-range', 'krds-calendar--selected-range', '[data-date="2024-02-15"]'],
    ['date-invalid', 'krds-date-input--invalid', 'input[type=text]'],
    ['date-range', 'krds-date-input--range', 'input[type=text]'],
    ['date-disabled', 'krds-date-input--disabled', null],
    ['date-popup', 'krds-date-input--single', '[data-date="2024-02-29"]', true],
    ['modal-open', 'krds-modal--open', '[role=dialog]'],
  ];
  for (const [name, id, focus, openPopup] of cases) for (const mode of ['normal', 'narrow-200', 'forced-colors']) {
    const context = await browser.newContext({ viewport: mode === 'narrow-200' ? { width: 320, height: 900 } : { width: 1280, height: 900 }, locale: 'ko-KR', reducedMotion: 'reduce', colorScheme: 'light', forcedColors: mode === 'forced-colors' ? 'active' : 'none', serviceWorkers: 'block' });
    const network = await guardStoryNetwork(context, server.origin, server.assets);
    const page = await context.newPage(); const errors = []; page.on('pageerror', error => errors.push(String(error)));
    await page.goto(`${server.origin}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
    await page.locator('[data-krds-component]:visible').first().waitFor({ state: 'visible' });
    if (mode === 'narrow-200') await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    if (openPopup) await page.getByRole('button', { name: '달력 열기', exact: true }).click();
    if (focus) { await page.keyboard.press('Tab'); await page.locator(focus).first().focus(); }
    await page.evaluate(() => document.fonts.ready);
    const screenshot = join(directory, `${name}-${mode}.png`); await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled', caret: 'hide' });
    const accessibility = await new AxeBuilder({ page }).include('body').analyze();
    const metrics = await page.evaluate(() => ({ viewport: innerWidth, body: document.body.scrollWidth, document: document.documentElement.scrollWidth, focusedPart: document.activeElement?.getAttribute('data-krds-part'), focusOutline: document.activeElement ? { style: getComputedStyle(document.activeElement).outlineStyle, width: getComputedStyle(document.activeElement).outlineWidth, color: getComputedStyle(document.activeElement).outlineColor } : null }));
    network.assertClean();
    report.push({ name, id, mode, screenshot, errors, metrics, requests: network.requests, networkViolations: network.violations, axe: accessibility });
    await writeFile(join(directory, 'report.json'), JSON.stringify(report, null, 2));
    await context.close();
  }
} finally { await browser.close(); await server.close(); }
await writeFile(join(directory, 'report.json'), JSON.stringify(report, null, 2));
const violations = report.flatMap(result => result.axe.violations.map(violation => ({ name: result.name, mode: result.mode, id: violation.id, nodes: violation.nodes.map(node => node.target) })));
console.log(JSON.stringify({ screenshots: report.length, errors: report.flatMap(result => result.errors), violations, overflow: report.filter(result => result.metrics.document > result.metrics.viewport).map(result => ({ name: result.name, mode: result.mode, metrics: result.metrics })) }, null, 2));
if (violations.length || report.some(result => result.errors.length)) process.exitCode = 1;
