import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import { serveProduction, root } from '../../../tools/testing/support.mjs';
const server = await serveProduction(root + '/apps/fixture-lit/dist', { fixture: true });
const browser = await chromium.launch();
const directory = root + '/.superpowers/sdd/PLAN/t11-lit-logs/visual-diagnostics';
await mkdir(directory, { recursive: true });
const results = [];
try {
    for (const [pattern, id] of [['form-errors', 'error-summary-focus'], ['search-results', 'filter-resets-page'], ['consent-confirmation', 'optional-refusal-success'], ['service-layout', 'skip-main']]) {
        const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
        const page = await context.newPage();
        await page.goto(`${server.origin}/examples/${pattern}?case=${id}`);
        await page.locator('krds-pattern-presentation').evaluate(element => element.settled());
        const axe = await new AxeBuilder({ page }).analyze();
        await writeFile(`${directory}/${pattern}-axe.json`, JSON.stringify(axe, null, 2));
        results.push({ pattern, violations: axe.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.map(node => node.target) })) });
        await page.screenshot({ path: `${directory}/${pattern}.png`, fullPage: true });
        await context.close();
    }
    await writeFile(directory + '/report.json', JSON.stringify({ snapshot: server.snapshot, results }, null, 2));
    console.log(JSON.stringify(results, null, 2));
}
finally {
    await browser.close();
    await server.close();
}
