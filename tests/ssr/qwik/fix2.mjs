import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { startProductionSsr } from '../../../apps/fixture-qwik/server.mjs';
const require = createRequire(new URL('../../../apps/fixture-qwik/package.json', import.meta.url));
const browserName = process.env.KRDS_BROWSER ?? 'chromium';
const playwright = require('playwright');
process.env.PLAYWRIGHT_BROWSERS_PATH = '/private/tmp/krds-playwright-1.64.1';
const server = await startProductionSsr(), browser = await playwright[browserName].launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } }), page = await context.newPage();
const results = [], errors = [], external = [];
page.on('pageerror', error => errors.push(String(error)));
page.on('request', request => { if (!request.url().startsWith(server.origin)) external.push(request.url()); });
const poll = async (fn, expected) => {
    for (let index = 0; index < 100; index++) {
        if (JSON.stringify(await fn()) === JSON.stringify(expected)) return;
        await new Promise(resolve => setTimeout(resolve, 20));
    }
    assert.deepEqual(await fn(), expected);
};
const run = async (name, test) => {
    try { await test(); results.push({ name, status: 'passed' }); }
    catch (error) { results.push({ name, status: 'failed', error: String(error) }); }
};
const prepare = async range => {
    await page.goto(`${server.origin}/fix1.html`, { waitUntil: 'networkidle' });
    const formId = range ? 'unchanged-range-form' : 'delayed-date-form';
    const field = page.locator(range ? '#unchanged-range-end' : '#delayed-date');
    await page.evaluate(formId => {
        window.__fix2Submissions = [];
        document.getElementById(formId).addEventListener('submit', event => {
            if (!event.defaultPrevented) window.__fix2Submissions.push(Object.fromEntries(new FormData(event.currentTarget)));
            event.preventDefault();
        });
    }, formId);
    // Warm the lazy commit handler with a genuine unchanged Enter, then let that
    // completed gesture settle before testing a distinct blur/submit overlap.
    await field.focus();
    await field.press('Enter');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))));
    assert.deepEqual(await page.evaluate(() => window.__fix2Submissions), []);
    return { field, formId, expected: range ? { 'period.start': '2024-02-12', 'period.end': '2024-02-18' } : { visit: '2024-02-29' } };
};
try {
    for (const range of [false, true]) {
        await run(`${range ? 'range' : 'single'} unchanged group blur permits its first pointer Submit with zero requests`, async () => {
            const { field, expected } = await prepare(range);
            await field.focus();
            await page.getByRole('button', { name: range ? 'Submit unchanged range' : 'Submit date', exact: true }).click();
            await poll(() => page.evaluate(() => window.__fix2Submissions), [expected]);
            assert.equal(await page.getByRole('status', { name: range ? 'Range requests' : 'Date requests', exact: true }).textContent(), '0');
        });
        await run(`${range ? 'range' : 'single'} unchanged Enter permits overlapping native requestSubmit`, async () => {
            const { field, formId, expected } = await prepare(range);
            await field.press('Enter');
            await page.evaluate(formId => document.getElementById(formId).requestSubmit(), formId);
            await poll(() => page.evaluate(() => window.__fix2Submissions), [expected]);
            assert.equal(await page.getByRole('status', { name: range ? 'Range requests' : 'Date requests', exact: true }).textContent(), '0');
        });
    }
    await run('correction back to the authoritative value reconciles errors without blocking submission', async () => {
        const { field, formId, expected } = await prepare(false);
        await field.fill('invalid');
        await field.press('Enter');
        await poll(() => field.getAttribute('aria-invalid'), 'true');
        await field.fill('2024-02-29');
        await field.press('Enter');
        await page.evaluate(formId => document.getElementById(formId).requestSubmit(), formId);
        await poll(() => page.evaluate(() => window.__fix2Submissions), [expected]);
        await poll(() => field.getAttribute('aria-invalid'), null);
        await poll(() => page.locator('#delayed-date-error').textContent(), '');
        assert.equal(await page.getByRole('status', { name: 'Date requests', exact: true }).textContent(), '0');
    });
    await writeFile(`.superpowers/sdd/PLAN/t07q-qwik-logs/fix2-${browserName}.json`, JSON.stringify({ results, errors, external }, null, 2));
    console.log(JSON.stringify({ browser: browserName, passed: results.filter(result => result.status === 'passed').length, failed: results.filter(result => result.status === 'failed'), errors, external }));
    if (!results.length || results.some(result => result.status !== 'passed') || errors.length || external.length) process.exitCode = 1;
} finally { await context.close(); await browser.close(); await server.close(); }
