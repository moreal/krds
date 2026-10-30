import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { serveProduction, root } from '../../../tools/testing/support.mjs';
import { presentationCases } from '@unofficial-krds/test-contracts/patterns';
const directory = join(root, '.superpowers/sdd/PLAN/t11-lit-logs', process.env.KRDS_PATTERN_RUN ?? 'stories');
await mkdir(directory, { recursive: true });
const server = await serveProduction(resolve(process.env.KRDS_PATTERN_STORY_DIST ?? join(root, 'apps/storybook-lit/dist')));
const browser = await chromium.launch();
const results = [];
assert.equal(presentationCases.length,16,'All sixteen presentation stories are required');
try {
    const index = await (await fetch(server.origin + '/index.json')).json();
    for (const entry of presentationCases) {
        const context = await browser.newContext({ viewport: entry.environment.viewport });
        const page = await context.newPage();
        const errors = [], external = [];
        page.on('pageerror', error => errors.push(String(error)));
        page.on('request', request => { if (!request.url().startsWith(server.origin))
            external.push(request.url()); });
        const result = { id: entry.id, errors, external, pass: false };
        try {
            assert.ok(index.entries[entry.id], `Missing exact story ${entry.id}`);
            await page.goto(`${server.origin}/iframe.html?id=${entry.id}&viewMode=story`);
            await page.waitForSelector('krds-pattern-presentation');
            await page.locator('krds-pattern-presentation').evaluate(element => element.settled());
            assert.equal(await page.evaluate(() => !!window.__KRDS_FIXTURE__), false);
            const actual = await page.locator('krds-pattern-presentation').evaluate(element => ({ patternId: element.state.patternId, phase: element.state.phase }));
            assert.deepEqual(actual, { patternId: entry.patternId, phase: entry.state.phase });
            if(entry.state.phase==='loading')assert.equal(await page.locator('krds-spinner').count(),1,'One actual pending operation must render one spinner');
            const axe = await new AxeBuilder({ page }).analyze();
            await writeFile(join(directory, `${entry.id}-axe.json`), JSON.stringify(axe, null, 2));
            result.violations = axe.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.length }));
            await page.screenshot({ path: join(directory, `${entry.id}.png`), fullPage: true });
            assert.deepEqual(errors, []);
            assert.deepEqual(external, []);
            assert.deepEqual(result.violations, []);
            result.pass = true;
        }
        catch (error) {
            result.error = String(error);
        }
        finally {
            results.push(result);
            console.log(result.id, result.pass, result.error ?? '');
            await context.close();
        }
    }
    await writeFile(join(directory, 'report.json'), JSON.stringify({ snapshot: server.snapshot, results }, null, 2));
    console.log(JSON.stringify({ snapshot: server.snapshot.sha256, passed: results.filter(item => item.pass).length, failures: results.filter(item => !item.pass) }, null, 2));
    if (results.some(item => !item.pass))
        process.exitCode = 1;
}
finally {
    await browser.close();
    await server.close();
}
