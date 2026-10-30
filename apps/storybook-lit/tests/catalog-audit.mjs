import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { browserPath, serveProduction } from '../../../tools/testing/support.mjs';
import { guardStoryNetwork } from '../../../tools/testing/network.mjs';
import { inspectStorySources } from '../../../tools/testing/stories.mjs';
import { fullCatalogStoryCases } from '@unofficial-krds/test-contracts';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const { chromium } = await import('playwright');
const { default: AxeBuilder } = await import('@axe-core/playwright');
const directory = resolve('../../.superpowers/sdd/PLAN/t10-lit-logs/stories', process.env.LIT_COMPONENT ?? 'full');
await mkdir(directory, { recursive: true });
await inspectStorySources(resolve('src/stories'));
const server = await serveProduction(resolve('dist'));
const browser = await chromium.launch();
const results = []; let next = 0;
const cases = fullCatalogStoryCases.filter(story => !process.env.LIT_COMPONENT || story.componentId === process.env.LIT_COMPONENT);
const index = JSON.parse(await readFile(resolve('dist/index.json')));
try {
  await Promise.all(Array.from({ length: 4 }, async () => {
    for (;;) {
      const story = cases[next++]; if (!story) return;
      const context = await browser.newContext({ viewport: story.environment.viewport, locale: story.environment.locale, colorScheme: story.environment.colorMode, reducedMotion: story.environment.reducedMotion, serviceWorkers: 'block' });
      const network = await guardStoryNetwork(context, server.origin, server.assets);
      const errors = []; const page = await context.newPage(); page.on('pageerror', error => errors.push(String(error)));
      const result = { id: story.id, componentId: story.componentId, caseId: story.caseId, coverageAwarded: false };
      try {
        if (!index.entries[story.id]) throw new Error('Exact native story ID is absent');
        await page.goto(`${server.origin}/iframe.html?id=${story.id}&viewMode=story`, { waitUntil: 'networkidle' });
        await page.waitForFunction(id => [...document.querySelectorAll(`krds-${id}`)].some(element => element.shadowRoot), story.componentId, { timeout: 5000 });
        await page.evaluate(async id => { for (const host of document.querySelectorAll(`krds-${id}`)) await host.updateComplete; }, story.componentId);
        result.native = await page.locator(`krds-${story.componentId}`).first().evaluate(host => ({ shadow: !!host.shadowRoot, parts: [...host.shadowRoot.querySelectorAll('[data-krds-component]')].map(element => ({ part: element.getAttribute('data-krds-part'), state: element.getAttribute('data-krds-state') })), text: host.shadowRoot.textContent, computed: [...host.shadowRoot.querySelectorAll('[part="label"], [part="item"] > span')].map(element => ({ text: element.textContent, color: getComputedStyle(element).color, opacity: getComputedStyle(element).opacity, fontSize: getComputedStyle(element).fontSize })) }));
        const accessibility = await new AxeBuilder({ page }).include('#storybook-root').analyze();
        result.axe = { version: accessibility.testEngine.version, violations: accessibility.violations };
        if (story === cases.find(item => item.componentId === story.componentId)) await page.screenshot({ path: resolve(directory, `${story.componentId}.png`), fullPage: true, animations: 'disabled' });
        network.assertClean();
        if (errors.length) throw new Error(`Runtime errors: ${errors.join('; ')}`);
        result.status = accessibility.violations.length ? 'axe-failed' : 'passed';
      } catch (error) { result.status = 'failed'; result.error = String(error); }
      finally { result.runtimeErrors = errors; result.requests = network.requests; result.requestViolations = network.violations; results.push(result); await context.close(); await writeFile(resolve(directory, 'report.json'), JSON.stringify({ status: 'running', total: cases.length, results }, null, 2)); }
    }
  }));
} finally { await browser.close(); await server.close(); }
const report = { status: results.every(result => result.status === 'passed') && results.length === cases.length ? 'passed' : 'failed', total: cases.length, results };
await writeFile(resolve(directory, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ total: report.total, passed: results.filter(result => result.status === 'passed').length, failures: results.filter(result => result.status !== 'passed').map(result => ({ id: result.id, error: result.error, axe: result.axe?.violations.map(violation => violation.id) })) }, null, 2));
if (report.status !== 'passed') process.exitCode = 1;
