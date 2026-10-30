import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { serveProduction } from '../../../tools/testing/support.mjs';

const output = resolve('.superpowers/sdd/PLAN/t10-solid-logs/panel-intrinsics-after');
await mkdir(output, { recursive: true });
const server = await serveProduction(resolve('.superpowers/sdd/PLAN/t10-solid-logs/runtime-frozen-solid-20261030-1623/fixture-dist'), { fixture: true });
const browser = await chromium.launch();
const report = { artifactSnapshot: server.artifactSnapshot, coverageAwarded: false, results: [] };
try {
  for (const component of ['help-panel', 'tutorial-panel']) {
    const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
    const page = await context.newPage();
    await page.goto(`${server.origin}/fixtures/${component}?case=outcome-08`);
    await page.waitForFunction(() => window.__KRDS_FIXTURE__?.protocol === 1);
    const selector = `[data-krds-component="${component}"][data-krds-part="root"]`;
    await page.locator(selector).waitFor({ state: 'visible' });
    const initial = await page.locator(selector).evaluate(node => {
      window.__panelRetainedControl = node.querySelector('button');
      return { tag: node.tagName, role: node.getAttribute('role'), modal: node.getAttribute('aria-modal') };
    });
    const narrowAxe = (await new AxeBuilder({ page }).include(selector).analyze()).violations;
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForFunction(selector => document.querySelector(selector)?.tagName === 'ASIDE', selector);
    const desktop = await page.locator(selector).evaluate(node => ({ tag: node.tagName, role: node.getAttribute('role'), modal: node.getAttribute('aria-modal'), retainedControl: node.contains(window.__panelRetainedControl) }));
    await page.setViewportSize({ width: 360, height: 800 });
    await page.waitForFunction(selector => document.querySelector(selector)?.tagName === 'DIV', selector);
    const restored = await page.locator(selector).evaluate(node => ({ tag: node.tagName, role: node.getAttribute('role'), retainedControl: node.contains(window.__panelRetainedControl), focusContained: node.contains(document.activeElement) }));
    await page.screenshot({ path: join(output, `${component}.png`) });
    const passed = initial.tag === 'DIV' && initial.role === 'dialog' && desktop.role === 'complementary' && desktop.retainedControl && restored.retainedControl && restored.focusContained && narrowAxe.length === 0;
    report.results.push({ component, initial, desktop, restored, narrowAxe, passed });
    await context.close();
  }
  await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report.results.map(({ component, passed }) => ({ component, passed }))));
  if (report.results.some(result => !result.passed)) process.exitCode = 1;
} finally {
  await browser.close();
  await server.close();
}
