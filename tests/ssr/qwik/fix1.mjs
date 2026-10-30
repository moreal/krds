import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { startProductionSsr } from '../../../apps/fixture-qwik/server.mjs';
const require = createRequire(new URL('../../../apps/fixture-qwik/package.json', import.meta.url));
const browserName = process.env.KRDS_BROWSER ?? 'chromium';
const playwright = require('playwright');
process.env.PLAYWRIGHT_BROWSERS_PATH = '/private/tmp/krds-playwright-1.64.1';
const server = await startProductionSsr();
const browser = await playwright[browserName].launch();
const context = await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const results = [], errors = [], external = [];
page.on('pageerror', error => errors.push(String(error)));
page.on('request', request => { if (!request.url().startsWith(server.origin)) external.push(request.url()); });
const poll = async (fn, expected, message) => {
    for (let index = 0; index < 150; index++) {
        if (JSON.stringify(await fn()) === JSON.stringify(expected)) return;
        await new Promise(resolve => setTimeout(resolve, 20));
    }
    assert.deepEqual(await fn(), expected, message);
};
const settle = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const status = name => page.getByRole('status', { name, exact: true });
const input = () => page.getByRole('textbox', { name: 'Delayed date', exact: true });
const canonical = () => page.locator('input[type="hidden"][name="visit"]');
const open = async accept => {
    await page.goto(`${server.origin}/fix1.html`, { waitUntil: 'networkidle' });
    // A native listener after the adapter observes real cancellation and prevents navigation.
    await page.evaluate(() => {
        window.__fix1Submissions = [];
        document.getElementById('delayed-date-form').addEventListener('submit', event => {
            if (!event.defaultPrevented) window.__fix1Submissions.push(Object.fromEntries(new FormData(event.currentTarget)));
            event.preventDefault();
        });
    });
    if (accept) {
        await page.getByRole('checkbox', { name: 'Accept date requests' }).check();
        await poll(() => status('Date policy').textContent(), 'accept');
    }
};
const run = async (name, test) => {
    if (process.env.KRDS_FIX1_FILTER && !new RegExp(process.env.KRDS_FIX1_FILTER).test(name)) return;
    try { await test(); results.push({ name, status: 'passed' }); }
    catch (error) { results.push({ name, status: 'failed', error: String(error) }); }
};
try {
    await run('CSS-hidden leading native control retains the active panel sequential stop', async () => {
        await open(false);
        const panel = page.getByRole('tabpanel', { name: 'Hidden first', exact: true });
        await poll(() => panel.getAttribute('tabindex'), '0');
        await page.getByRole('tab', { name: 'Second tab', exact: true }).focus();
        await page.keyboard.press('Tab');
        assert.equal(await panel.evaluate(node => node === document.activeElement), true);
        assert.equal(await status('Tab requests').textContent(), '0');
    });
    await run('leading-child visibility, layout and ancestor inert transitions update the panel stop', async () => {
        await open(false);
        const panel = page.getByRole('tabpanel', { name: 'Hidden first', exact: true });
        const leading = page.locator('#leading-tab-control');
        await leading.evaluate(node => node.style.display = 'inline-block');
        await poll(() => panel.getAttribute('tabindex'), null);
        await page.getByRole('tab', { name: 'Second tab', exact: true }).focus();
        await page.keyboard.press('Tab');
        assert.equal(await leading.evaluate(node => node === document.activeElement), true);
        await leading.evaluate(node => node.style.visibility = 'hidden');
        await poll(() => panel.getAttribute('tabindex'), '0');
        await leading.evaluate(node => node.style.visibility = 'visible');
        await poll(() => panel.getAttribute('tabindex'), null);
        await page.locator('#hidden-tabs-container').evaluate(node => node.inert = true);
        await poll(() => panel.getAttribute('tabindex'), '0');
        await page.locator('#hidden-tabs-container').evaluate(node => node.inert = false);
        await poll(() => panel.getAttribute('tabindex'), null);
        await leading.evaluate(node => Object.assign(node.style, { width: '0', height: '0', padding: '0', border: '0', fontSize: '0' }));
        await poll(() => panel.getAttribute('tabindex'), '0');
        assert.equal(await status('Tab requests').textContent(), '0');
    });
    await run('delayed controlled Enter, group blur and submit coalesce without stale submission', async () => {
        await open(true);
        await input().fill('2024-03-01');
        await input().press('Enter');
        await poll(() => status('Date requests').textContent(), '1');
        await page.locator('#date-outside').focus();
        await page.evaluate(() => document.getElementById('delayed-date-form').requestSubmit());
        await settle();
        assert.equal(await status('Date requests').textContent(), '1');
        assert.deepEqual(await page.evaluate(() => window.__fix1Submissions), []);
        await poll(() => status('Pending date requests').textContent(), '0');
        await poll(() => canonical().inputValue(), '2024-03-01');
        await settle();
        assert.equal(await status('Date requests').textContent(), '1');
        await page.evaluate(() => document.getElementById('delayed-date-form').requestSubmit());
        await poll(() => page.evaluate(() => window.__fix1Submissions), [{ visit: '2024-03-01' }]);
    });
    for (const accept of [false, true]) await run(`new raw edit survives an older ${accept ? 'accepted' : 'rejected'} delayed completion`, async () => {
        await open(accept);
        await input().fill('2024-03-01');
        await input().press('Enter');
        await poll(() => status('Date requests').textContent(), '1');
        await input().fill('2024-03-02');
        await poll(() => status('Pending date requests').textContent(), '0');
        await settle();
        assert.equal(await input().inputValue(), '2024-03-02');
        assert.equal(await canonical().inputValue(), accept ? '2024-03-01' : '2024-02-29');
        assert.equal(await status('Date requests').textContent(), '1');
        await input().press('Enter');
        await poll(() => status('Date requests').textContent(), '2');
        await poll(() => status('Pending date requests').textContent(), '0');
        await settle();
        assert.equal(await input().inputValue(), accept ? '2024-03-02' : '2024-02-29');
    });
    await run('settled rejected request permits a later explicit same-candidate retry', async () => {
        await open(false);
        for (const count of ['1', '2']) {
            await input().fill('2024-03-01');
            await input().press('Enter');
            await poll(() => status('Date requests').textContent(), count);
            await poll(() => status('Pending date requests').textContent(), '0');
            await poll(() => input().inputValue(), '2024-02-29');
        }
        await input().press('Enter');
        await input().blur();
        await settle();
        assert.equal(await status('Date requests').textContent(), '2');
        assert.deepEqual(await page.evaluate(() => window.__fix1Submissions), []);
    });
    await writeFile(`.superpowers/sdd/PLAN/t07q-qwik-logs/fix1-${browserName}.json`, JSON.stringify({ results, errors, external }, null, 2));
    console.log(JSON.stringify({ browser: browserName, passed: results.filter(result => result.status === 'passed').length, failed: results.filter(result => result.status === 'failed'), errors, external }));
    if (!results.length || results.some(result => result.status !== 'passed') || errors.length || external.length) process.exitCode = 1;
} finally { await context.close(); await browser.close(); await server.close(); }
