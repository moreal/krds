import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const root = new URL('../../../../', import.meta.url);
const { serveProduction } = await import(new URL('tools/testing/support.mjs', root));
const { guardStoryNetwork } = await import(new URL('tools/testing/network.mjs', root));
process.env.PLAYWRIGHT_BROWSERS_PATH = '/private/tmp/krds-playwright-1.64.1';
const output = new URL('./story-all-states/', import.meta.url);
await mkdir(output, { recursive: true });
const server = await serveProduction(fileURLToPath(new URL('apps/storybook-solid/dist', root)));
const browser = await chromium.launch();
const index = JSON.parse(await readFile(new URL('apps/storybook-solid/dist/index.json', root), 'utf8'));
const stories = Object.values(index.entries).filter(entry => entry.type === 'story' && entry.id.startsWith('krds-'));
const report = { kind: 'supplemental-native-story-rendering', coverageAwarded: false, stories: [] };
try {
  for (const story of stories) {
    const component = ['native-select', 'date-input', 'calendar', 'button', 'modal', 'tabs'].find(id => story.id.startsWith(`krds-${id}--`));
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce', serviceWorkers: 'block' });
    const network = await guardStoryNetwork(context, server.origin, server.assets);
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    const result = { id: story.id, componentId: component, name: story.name };
    try {
      await page.goto(`${server.origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`, { waitUntil: 'networkidle' });
      const selector = `[data-krds-component="${component}"][data-krds-part="root"]`;
      const closedModal = story.id === 'krds-modal--default';
      if (closedModal) {
        await page.getByRole('button', { name: '열기', exact: true }).waitFor({ state: 'visible' });
        if (await page.getByRole('dialog').count()) throw new Error('Closed Modal story unexpectedly contains an open dialog');
      } else await page.locator(selector).first().waitFor({ state: 'visible' });
      await page.evaluate(() => document.fonts.ready);
      result.parts = await page.locator(`[data-krds-component="${component}"]`).evaluateAll(elements => elements.map(element => ({
        tag: element.tagName.toLowerCase(), part: element.getAttribute('data-krds-part'),
        state: element.getAttribute('data-krds-state'), size: element.getAttribute('data-krds-size'),
        variant: element.getAttribute('data-krds-variant'), disabled: element.matches(':disabled'),
        invalid: element.getAttribute('aria-invalid'), selected: element.getAttribute('aria-selected'),
      })));
      await page.screenshot({ path: fileURLToPath(new URL(`${story.id}.png`, output)), fullPage: true, animations: 'disabled', caret: 'hide' });
      const axe = await new AxeBuilder({ page }).include(closedModal ? '#storybook-root' : selector).analyze();
      result.axeViolations = axe.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map(node => node.target) }));
      network.assertClean();
      if (errors.length) throw new Error(errors.join('; '));
      result.status = result.axeViolations.length ? 'axe-findings' : 'passed';
    } catch (error) { result.status = 'failed'; result.error = String(error); }
    finally { result.runtimeErrors = errors; result.requests = network.requests; result.forbiddenRequests = network.violations; await context.close(); }
    report.stories.push(result);
  }
} finally { await browser.close(); await server.close(); await writeFile(new URL('report.json', output), JSON.stringify(report, null, 2) + '\n'); }
console.log(JSON.stringify({ stories: report.stories.length, passed: report.stories.filter(story => story.status === 'passed').length, findings: report.stories.filter(story => story.status !== 'passed').map(({ id, status, error, axeViolations }) => ({ id, status, error, axeViolations })), report: fileURLToPath(new URL('report.json', output)) }));
if (!report.stories.length || report.stories.some(story => story.status !== 'passed')) process.exitCode = 1;
