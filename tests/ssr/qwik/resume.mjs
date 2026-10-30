import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import {prepareProductionEvidence} from './production-evidence.mjs';
const require = createRequire(new URL('../../../apps/fixture-qwik/package.json', import.meta.url));
const { chromium } = require('playwright');
const { default: AxeBuilder } = await import(require.resolve('@axe-core/playwright'));
const behaviorOnly = process.env.KRDS_RESUME_MODE === 'behavior';
const reportName = behaviorOnly ? 'production-resume-fix1' : 'production-resume';
const directory = resolve(process.env.KRDS_SSR_OUTPUT ?? '.superpowers/sdd/PLAN/t07q-qwik-logs');
await mkdir(directory, { recursive: true });
if (process.platform === 'darwin') process.env.PLAYWRIGHT_BROWSERS_PATH ??= '/private/tmp/krds-playwright-1.64.1';
const productionEvidence=await prepareProductionEvidence(directory,'precise');
const {startProductionSsr}=productionEvidence;
const html = await readFile(resolve(productionEvidence.production,'dist/resume.html'), 'utf8');
assert.match(html, /q:container="paused"/);
assert.match(html, /q:render="ssr"/);
assert.match(html, /첫 클릭/);
assert.match(html, /role="tab"/);
assert.match(html, /<select/);
assert.match(html, /<table/);
const server = await startProductionSsr(), browser = await chromium.launch();
const errors = [], external = [], checks = [], snapshots = [];
const check = async (name, fn) => { await fn(); checks.push(name); };
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const expectText = async (locator, value) => {
    for (let i = 0; i < 60; i++) {
        if (await locator.textContent() === value)
            return;
        await new Promise(resolve => setTimeout(resolve, 30));
    }
    assert.equal(await locator.textContent(), value);
};
const expectValue = async (locator, value) => {
    for (let i = 0; i < 60; i++) {
        if (await locator.inputValue() === value)
            return;
        await new Promise(resolve => setTimeout(resolve, 30));
    }
    assert.equal(await locator.inputValue(), value);
};
const expectFocused = async locator => {
    for (let index = 0; index < 60; index++) {
        if (await locator.evaluate(node => node === document.activeElement)) return;
        await new Promise(resolve => setTimeout(resolve, 30));
    }
    assert.equal(await locator.evaluate(node => node === document.activeElement), true);
};
const context = await browser.newContext({ locale: 'ko-KR', viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
context.on('request', request => {
    if (!request.url().startsWith(server.origin) && !request.url().startsWith('data:'))
        external.push(request.url());
});
try {
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(String(error)));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Profiler.enable');
    await cdp.send('Profiler.startPreciseCoverage', { callCount: true, detailed: true });
    const response = await page.goto(`${server.origin}/resume.html`, { waitUntil: 'networkidle' });
    assert.equal(response.headers()['x-krds-render'], 'production-qwik-ssr');
    const actualHtml=await response.text();await productionEvidence.retainDocument('first-response',actualHtml);assert.match(actualHtml, /q:container="paused"/);
    const measure = async (label) => { const coverage = await cdp.send('Profiler.takePreciseCoverage'); const data = await page.evaluate(() => ({ container: document.documentElement.getAttribute('q:container'), syncFunctionBytes: [...document.querySelectorAll('script[q\\:func]')].reduce((sum, node) => sum + new TextEncoder().encode(node.textContent ?? '').length, 0), serializationBytes: [...document.querySelectorAll('script[type="qwik/json"]')].reduce((sum, node) => sum + new TextEncoder().encode(node.textContent ?? '').length, 0), downloads: performance.getEntriesByType('resource').filter(entry => /\.js(?:$|\?)/.test(entry.name)).map(entry => ({ url: entry.name, initiatorType: entry.initiatorType, transferSize: entry.transferSize, decodedBodySize: entry.decodedBodySize })) })); snapshots.push({ label, ...data, execution: coverage.result.filter(entry => entry.url.startsWith(server.origin)).map(entry => ({ url: entry.url, functions: entry.functions.map(fn => ({ name: fn.functionName, ranges: fn.ranges })) })) }); };
    await measure('before-first-interaction');
    await check('cold first click resumes exactly once', async () => { await page.getByRole('button', { name: '첫 클릭', exact: true }).click(); await expectText(page.getByRole('status', { name: '클릭 수' }), '1'); });
    await measure('after-first-click');
    const manifest = JSON.parse(await readFile(resolve(productionEvidence.production,'dist/q-manifest.json'), 'utf8'));
    const resumeSymbol = Object.entries(manifest.symbols).find(([, value]) => value.displayName === 'resume.tsx_resume_component')[0], resumeChunk = manifest.mapping[resumeSymbol];
    assert.equal(snapshots[0].downloads.some(item => item.url.endsWith(resumeChunk)), false, 'Application render/action chunk must stay cold until first user interaction');
    const code = await readFile(resolve(productionEvidence.production,`dist/build/${resumeChunk}`), 'utf8'), localName = new RegExp(`([\\w$]+) as ${resumeSymbol}(?:,|})`).exec(code)?.[1];
    const renderFunction = snapshots[1].execution.flatMap(item => item.url.endsWith(resumeChunk) ? item.functions : []).find(fn => fn.name === localName);
    assert.equal(renderFunction?.ranges[0].count, 0, 'First button action resumes without rerendering the entire app');
    await check('first select change survives resume and is canonical', async () => { await page.getByRole('combobox', { name: '지역', exact: true }).selectOption('busan'); await expectValue(page.getByRole('combobox', { name: '지역', exact: true }), 'busan'); await expectText(page.getByRole('status', { name: '이벤트 수' }), '1'); });
    await check('first supported tab key prevents default and moves focus only', async () => { const first = page.getByRole('tab', { name: '첫 번째', exact: true }), second = page.getByRole('tab', { name: '두 번째', exact: true }); await first.focus(); await page.keyboard.press('ArrowRight'); await settle(page); assert.equal(await second.evaluate(node => node === document.activeElement), true); assert.equal(await first.getAttribute('aria-selected'), 'true'); await page.keyboard.press('Enter'); await settle(page); assert.equal(await second.getAttribute('aria-selected'), 'true'); });
    await check('first text commit submits strict leap date once', async () => { const input = page.getByRole('textbox', { name: '날짜', exact: true }); await input.fill('2024-03-01'); await input.press('Enter'); await expectValue(input, '2024-03-01'); await settle(page); assert.equal(await page.locator('input[type="hidden"][name="visit"]').inputValue(), '2024-03-01'); });
    await check('Modal reconstructs noSerialize isolation and restores the opener', async () => { const trigger = page.getByRole('button', { name: '열기', exact: true }); await trigger.click(); const dialog = page.getByRole('dialog', { name: '확인', exact: true }); await dialog.waitFor(); await settle(page); assert.equal(await dialog.evaluate(node => node === document.activeElement), true); assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden'); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab'); assert.equal(await dialog.locator('[data-krds-part="close"]').evaluate(node => node === document.activeElement), true); await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' }); await settle(page); assert.equal(await trigger.evaluate(node => node === document.activeElement), true); assert.equal(await page.evaluate(() => document.querySelectorAll('[inert]:not([data-krds-component="modal"][data-krds-part="root"][data-krds-state="closed"][hidden])').length), 0); });
    await check('controlled rejected select restores the authoritative prop', async () => { await page.getByRole('checkbox', { name: '변경 거절', exact: true }).check(); await expectText(page.getByRole('status', { name: '요청 정책' }), 'reject'); await page.getByRole('combobox', { name: '지역', exact: true }).selectOption('seoul'); await expectValue(page.getByRole('combobox', { name: '지역', exact: true }), 'busan'); });
    await check('invalid direct draft remains visible and blocks form validity', async () => { const input = page.getByRole('textbox', { name: '날짜', exact: true }); await input.fill('2023-02-29'); await input.press('Enter'); await settle(page); assert.equal(await input.getAttribute('aria-invalid'), 'true'); await expectText(page.locator('#resume-date-error'), 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요'); assert.equal(await input.inputValue(), '2023-02-29'); assert.equal(await input.evaluate(node => node.checkValidity()), false); if (!behaviorOnly) await page.screenshot({ path: `${directory}/invalid.png`, fullPage: true }); assert.equal(await page.locator('input[type="hidden"][name="visit"]').inputValue(), '2024-03-01'); });
    await check('external props replace the draft without extra user notifications', async () => { const before = await page.getByRole('status', { name: '이벤트 수' }).textContent(); await page.getByRole('button', { name: '외부 갱신', exact: true }).click(); await expectValue(page.getByRole('textbox', { name: '날짜', exact: true }), '2024-03-02'); assert.equal(await page.getByRole('status', { name: '이벤트 수' }).textContent(), before); });
    await check('unmount of an open modal releases background inert and scroll state', async () => { await page.getByRole('checkbox', { name: '변경 거절', exact: true }).uncheck(); await page.getByRole('button', { name: '열기', exact: true }).click(); await page.getByRole('dialog', { name: '확인', exact: true }).waitFor(); await settle(page); await page.getByRole('button', { name: '마운트 전환', exact: true }).evaluate(node => node.click()); await settle(page); assert.equal(await page.evaluate(() => document.querySelectorAll('[inert]:not([data-krds-component="modal"][data-krds-part="root"][data-krds-state="closed"][hidden])').length), 0); assert.equal(await page.evaluate(() => document.body.style.overflow), ''); });
    await measure('after-native-interactions');
    await page.getByRole('button', { name: '마운트 전환', exact: true }).click();
    await page.getByRole('dialog', { name: '확인', exact: true }).waitFor();
    await settle(page);
    await page.keyboard.press('Escape');
    await page.getByRole('dialog', { name: '확인', exact: true }).waitFor({ state: 'detached' });
    await settle(page);
    await page.getByRole('button', { name: '외부 갱신', exact: true }).click();
    await settle(page);
    if (!behaviorOnly) {
    const axe = await new AxeBuilder({ page }).analyze();
    await writeFile(`${directory}/production-axe.json`, JSON.stringify(axe, null, 2));
    assert.equal(axe.violations.length, 0, JSON.stringify(axe.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))));
    for (const [label, options] of [['normal', { width: 1280, height: 900 }], ['narrow', { width: 360, height: 800 }], ['zoom200', { width: 640, height: 900 }], ['forced-colors', { width: 1280, height: 900 }]]) {
        await page.setViewportSize(options);
        if (label === 'forced-colors')
            await page.emulateMedia({ forcedColors: 'active' });
        if (label === 'zoom200')
            await page.evaluate(() => document.documentElement.style.zoom = '2');
        await page.keyboard.press('Tab');
        await page.getByRole('button', { name: '첫 클릭', exact: true }).focus();
        assert.equal(await page.getByRole('button', { name: '첫 클릭', exact: true }).evaluate(node => node.matches(':focus-visible')), true);
        await page.screenshot({ path: `${directory}/${label}.png`, fullPage: true, animations: 'disabled' });
        await page.evaluate(() => document.documentElement.style.zoom = '');
    }
    }
    for (const family of ['select', 'text', 'tabs', 'calendar', 'modal']) {
        const cold = await context.newPage();
        cold.on('pageerror', error => errors.push(String(error)));
        const coldResponse=await cold.goto(`${server.origin}/resume.html`, { waitUntil: 'networkidle' });await productionEvidence.retainDocument(`cold-${family}`,await coldResponse.text());
        if (family === 'select') {
            await cold.getByRole('combobox', { name: '지역', exact: true }).selectOption('busan');
            await expectValue(cold.getByRole('combobox', { name: '지역', exact: true }), 'busan');
            await expectText(cold.getByRole('status', { name: '이벤트 수' }), '1');
        }
        if (family === 'text') {
            const input = cold.getByRole('textbox', { name: '날짜', exact: true });
            await input.fill('2024-03-01');
            await input.press('Enter');
            await expectValue(input, '2024-03-01');
            await expectText(cold.getByRole('status', { name: '이벤트 수' }), '1');
        }
        if (family === 'tabs') {
            const first = cold.getByRole('tab', { name: '첫 번째', exact: true });
            await first.focus();
            assert.equal(await first.evaluate(node => node.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))), false);
            await settle(cold);
            await expectFocused(cold.getByRole('tab', { name: '두 번째', exact: true }));
            assert.equal(await first.evaluate(node => node.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))), true);
            assert.equal(await first.evaluate(node => node.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true, bubbles: true, cancelable: true }))), true);
            await cold.keyboard.press('Enter');
            await settle(cold);
            assert.equal(await cold.getByRole('tab', { name: '두 번째', exact: true }).getAttribute('aria-selected'), 'true');
        }
        if (family === 'calendar') {
            const date = cold.locator('#resume-calendar [data-date="2024-02-29"]');
            await date.focus();
            assert.equal(await date.evaluate(node => node.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true, cancelable: true }))), false);
            await settle(cold);
            await expectFocused(cold.locator('#resume-calendar [data-date="2024-03-29"]'));
            assert.equal(await cold.getByRole('status', { name: '이벤트 수' }).textContent(), '0');
        }
        if (family === 'modal') {
            await cold.getByRole('button', { name: '열기', exact: true }).click();
            await cold.getByRole('dialog', { name: '확인', exact: true }).waitFor();
            await settle(cold);
            await cold.keyboard.press('Escape');
            await cold.getByRole('dialog', { name: '확인', exact: true }).waitFor({ state: 'detached' });
            assert.equal(await cold.getByRole('button', { name: '열기', exact: true }).evaluate(node => node === document.activeElement), true);
        }
        checks.push(`independent cold first ${family} event`);
        await cold.close();
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    await writeFile(`${directory}/${reportName}.json`, JSON.stringify({ checks, errors, external, snapshots, htmlBytes: Buffer.byteLength(html), requestTimeSsr: server.renders, note: 'q:json bytes after resume measure retained server snapshot, not automatic reserialization; downloaded resources and executed coverage are recorded separately.' }, null, 2));
    console.log(JSON.stringify({ passed: checks.length, external: external.length, errors: errors.length, initialSerializationBytes: snapshots[0].serializationBytes, report: `${directory}/${reportName}.json` }));
}
catch (error) {
    await writeFile(`${directory}/${reportName}-failure.json`, JSON.stringify({ error: String(error), checks, errors, external, snapshots }, null, 2));
    throw error;
}
finally {
    await context.close();
    await browser.close();
    await server.close();
    await productionEvidence.finish();
}
