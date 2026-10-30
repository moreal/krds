import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { browserPath, serveProduction } from '../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const { chromium } = await import('playwright'); const { default: AxeBuilder } = await import('@axe-core/playwright');
const directory = resolve('../../.superpowers/sdd/PLAN/t10-lit-logs/step-contrast-regression-replay'); await mkdir(directory, { recursive: true });
const server = await serveProduction(resolve('dist')); const browser = await chromium.launch();
const results = [];
const context = await browser.newContext();
try { const page = await context.newPage(); await page.goto(`${server.origin}/iframe.html?id=krds-step-indicator--sequential&viewMode=story`, { waitUntil: 'networkidle' }); await page.waitForSelector('krds-step-indicator');
  await page.locator('krds-step-indicator').evaluate(async host => { await host.updateComplete; window.replayOriginalSheets = [...host.shadowRoot.adoptedStyleSheets]; const sheet = new CSSStyleSheet(); sheet.replaceSync( '[data-krds-component="step-indicator"][data-krds-part="item"][data-krds-state~="blocked"] { color: var(--krds-light-color-text-disabled); }'); host.shadowRoot.adoptedStyleSheets = [...window.replayOriginalSheets, sheet]; });
  for (const phase of ['reproduced-old-rule-red', 'current-without-override-green']) {
    if (phase.startsWith('current')) await page.locator('krds-step-indicator').evaluate(host => { host.shadowRoot.adoptedStyleSheets = window.replayOriginalSheets; });
    const computed = await page.locator('krds-step-indicator').evaluate(host => [...host.shadowRoot.querySelectorAll('[data-krds-state~="blocked"] span')].map(element => ({ text: element.textContent, color: getComputedStyle(element).color, opacity: getComputedStyle(element).opacity, fontSize: getComputedStyle(element).fontSize })));
    if (phase.startsWith('reproduced') && computed.some(item => item.color !== 'rgb(138, 148, 158)')) throw new Error('Exact old rule did not win the replay cascade');
    const axe = await new AxeBuilder({ page }).include('#storybook-root').analyze();
    await page.screenshot({ path: resolve(directory, `${phase}.png`), fullPage: true });
    results.push({ phase, computed, axe: { version: axe.testEngine.version, violations: axe.violations } });
  }
} finally { await browser.close(); await server.close(); }
const report = { kind: 'explicit-regression-replay', note: 'This replays only the exact old blocked text-disabled color rule on the current native story. It is not the overwritten original audit report.', storyId: 'krds-step-indicator--sequential', results };
await writeFile(resolve(directory, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(results.map(result => ({ phase: result.phase, computed: result.computed, violations: result.axe.violations.map(violation => violation.id) })), null, 2));
if (!results[0].axe.violations.some(violation => violation.id === 'color-contrast') || results[1].axe.violations.length) process.exitCode = 1;
