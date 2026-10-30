import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { chromium, webkit } from 'playwright';
import * as api from '@unofficial-krds/solid-next';
import { serveProduction } from '../../tools/testing/support.mjs';

const output = new URL('../../.superpowers/sdd/PLAN/t09-solid-next-logs/fix1/', import.meta.url);
await mkdir(output, { recursive: true });
const results = [];
async function record(browser, label, test) {
    try {
        await test();
        results.push({ browser, label, status: 'passed' });
        console.log(`PASS ${browser} ${label}`);
    } catch (error) {
        results.push({ browser, label, status: 'failed', error: String(error) });
        console.error(`FAIL ${browser} ${label}: ${error}`);
    }
}

const configurations = [
    ['NativeSelect', { label: '지역', options: [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }], value: 'seoul', defaultValue: 'busan' }, 'defaultValue'],
    ['Tabs', { label: '정보', items: [{ value: 'first', label: '첫 번째', content: '처음' }], value: 'first', defaultValue: 'first' }, 'defaultValue'],
    ['Modal', { title: '확인', open: false, defaultOpen: true }, 'defaultOpen'],
    ['Calendar', { label: '날짜', value: null, defaultValue: null }, 'defaultValue'],
    ['DateInput', { label: '날짜', value: null, defaultValue: null }, 'defaultValue'],
];
for (const [component, props, defaultKey] of configurations) {
    await record('node-ssr', `P2-2 ${component} rejects a defined controlled/default pair`, () => {
        assert.throws(() => renderToString(() => createComponent(api[component], props)), TypeError);
        const controlled = { ...props };
        delete controlled[defaultKey];
        assert.doesNotThrow(() => renderToString(() => createComponent(api[component], controlled)));
    });
}

const fixture = await serveProduction(new URL('../../apps/fixture-solid-next/dist/', import.meta.url).pathname, { fixture: true });
for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await engine.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, locale: 'ko-KR' });
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    const open = async (component, caseId = 'default') => {
        await page.goto(`${fixture.origin}/fixtures/${component}?case=${caseId}`);
        await page.getByRole('status', { name: 'Fixture health' }).waitFor();
    };
    const state = patch => page.evaluate(value => window.__KRDS_FIXTURE__.setState(value), patch);
    const events = () => page.evaluate(() => window.__KRDS_FIXTURE__.readEvents());
    const review = (method, value) => page.evaluate(({ method, value }) => window.__KRDS_REVIEW__[method](value), { method, value });
    const baseline = async () => page.evaluate(() => document.body.style.setProperty('overflow', 'auto'));
    const overflow = async () => page.evaluate(() => ({ value: document.body.style.getPropertyValue('overflow'), priority: document.body.style.getPropertyPriority('overflow') }));
    const assertBaseline = async () => assert.deepEqual(await overflow(), { value: 'auto', priority: '' });

    await record(name, 'P2-1 uncontrolled callback observes the new canonical FormData once', async () => {
        await open('review', 'uncontrolled');
        const input = page.getByRole('textbox', { name: '날짜', exact: true });
        await input.fill('2024-03-01');
        await page.keyboard.press('Enter');
        const snapshot = page.getByRole('status', { name: 'Callback snapshot' });
        await page.waitForFunction(() => !!document.querySelector('[aria-label="Callback snapshot"]').textContent);
        assert.deepEqual(JSON.parse(await snapshot.textContent()), { count: 1, detail: { value: '2024-03-01' }, form: { date: '2024-03-01' } });
        await input.blur();
        assert.deepEqual(JSON.parse(await snapshot.textContent()), { count: 1, detail: { value: '2024-03-01' }, form: { date: '2024-03-01' } });
    });

    await record(name, 'P2-3 activation and child focusability refresh panel entry focus', async () => {
        await open('tabs');
        await page.getByRole('tab', { name: '두 번째', exact: true }).click();
        const panel = page.locator('#pilot-tabs-tab-second-panel');
        const input = page.getByRole('textbox', { name: '패널 입력' });
        assert.equal(await panel.getAttribute('tabindex'), '-1');
        await page.getByRole('tab', { name: '세 번째', exact: true }).focus();
        await page.keyboard.press('Tab');
        assert.equal(await input.evaluate(element => element === document.activeElement), true);
        await input.evaluate(element => { element.disabled = true; });
        await page.waitForFunction(() => document.querySelector('#pilot-tabs-tab-second-panel').tabIndex === 0);
        await input.evaluate(element => { element.disabled = false; });
        await page.waitForFunction(() => document.querySelector('#pilot-tabs-tab-second-panel').tabIndex === -1);
        await page.getByRole('tab', { name: '첫 번째', exact: true }).click();
        assert.equal(await page.locator('#pilot-tabs-tab-first-panel').getAttribute('tabindex'), '0');
        await open('review', 'panel-entry');
        await page.getByRole('button', { name: '바깥 열기' }).click();
        assert.equal(await page.locator('#review-nested-tabs-tab-input-panel').getAttribute('tabindex'), '-1', 'an initially active input panel must be correct when its containing Modal opens');
        await page.getByRole('tab', { name: '입력', exact: true }).focus();
        await page.keyboard.press('Tab');
        assert.equal(await page.getByRole('textbox', { name: '중첩 패널 입력' }).evaluate(element => element === document.activeElement), true);
    });

    await record(name, 'P2-4 month/year boundary navigation never becomes a day movement', async () => {
        await open('calendar', 'year-one');
        for (const [date, keys] of [['0001-01-02', ['PageUp', 'Shift+PageUp']], ['9999-12-30', ['PageDown', 'Shift+PageDown']]]) {
            if (date.startsWith('9999')) await state({ value: date });
            const day = page.locator(`[data-date="${date}"]`);
            await day.focus();
            const heading = await page.locator('[data-krds-part="heading"]').textContent();
            const pressed = await page.locator('[data-krds-part="day"][aria-pressed="true"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-date')));
            for (const key of keys) {
                await page.keyboard.press(key);
                assert.equal(await day.evaluate(element => element === document.activeElement), true, `${date} ${key}`);
                assert.equal(await page.locator('[data-krds-part="heading"]').textContent(), heading);
                assert.deepEqual(await page.locator('[data-krds-part="day"][aria-pressed="true"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-date'))), pressed);
                assert.deepEqual(await events(), []);
            }
        }
    });

    await record(name, 'P2-5 document scroll lock survives non-LIFO Modal and DateInput cleanup', async () => {
        await open('review', 'scroll');
        await baseline();
        await page.getByRole('button', { name: '바깥 열기' }).click();
        await page.getByRole('button', { name: '안쪽 열기' }).click();
        await review('setInner', false);
        assert.equal((await overflow()).value, 'hidden');
        await review('setOuter', false);
        await assertBaseline();

        await page.getByRole('button', { name: '바깥 열기' }).click();
        await page.getByRole('button', { name: '안쪽 열기' }).click();
        await review('setOuter', false);
        assert.equal((await overflow()).value, 'hidden');
        await review('setInner', false);
        await assertBaseline();

        await page.getByRole('button', { name: '바깥 열기' }).click();
        await page.getByRole('button', { name: '안쪽 열기' }).click();
        await review('mountOuter', false);
        assert.equal((await overflow()).value, 'hidden');
        await review('setInner', false);
        await assertBaseline();
        await review('setOuter', false);
        await review('mountOuter', true);

        await page.getByRole('button', { name: '바깥 열기' }).click();
        await page.getByRole('button', { name: '달력 열기' }).click();
        await page.getByRole('dialog', { name: '날짜 선택', exact: true }).waitFor();
        await page.keyboard.press('Escape');
        assert.equal((await overflow()).value, 'hidden');
        await review('setOuter', false);
        await assertBaseline();

        await page.getByRole('button', { name: '바깥 열기' }).click();
        await page.getByRole('button', { name: '달력 열기' }).click();
        const popup = page.getByRole('dialog', { name: '날짜 선택', exact: true });
        await popup.waitFor();
        await review('setOuter', false);
        await popup.waitFor({ state: 'hidden' });
        await assertBaseline();
        assert.equal(await page.getByRole('button', { name: '바깥 열기' }).evaluate(element => element === document.activeElement), true);

        await page.getByRole('button', { name: '바깥 열기' }).click();
        await page.getByRole('button', { name: '달력 열기' }).click();
        await page.getByRole('dialog', { name: '날짜 선택', exact: true }).waitFor();
        await review('mountOuter', false);
        await assertBaseline();
        assert.deepEqual(await events(), []);
        await review('setOuter', false);
        await review('mountOuter', true);
        await page.evaluate(() => document.body.style.setProperty('overflow', 'auto', 'important'));
        await page.getByRole('button', { name: '바깥 열기' }).click();
        await review('setOuter', false);
        assert.deepEqual(await overflow(), { value: 'auto', priority: 'important' });
    });
    await record(name, 'P2-5 actions-slot popup closes with actual parent close and unmount', async () => {
        await open('review', 'actions-slot');
        await page.evaluate(() => document.body.style.setProperty('overflow', 'auto', 'important'));
        const opener = page.getByRole('button', { name: '바깥 열기', exact: true });
        const parent = page.getByRole('dialog', { name: '바깥', exact: true });
        const popup = page.getByRole('dialog', { name: '날짜 선택', exact: true });
        const originalStyle = { value: 'auto', priority: 'important' };
        for (const transition of ['close', 'unmount']) {
            await opener.click();
            assert.equal(await parent.locator(':scope > [data-krds-part="body"]').evaluate(element => element.lastElementChild.getAttribute('data-krds-part')), 'close');
            const actions = parent.locator('[data-krds-component="modal"][data-krds-part="actions"]');
            assert.equal(await actions.getByRole('textbox', { name: '작업 날짜', exact: true }).inputValue(), '2024-02-29');
            await actions.getByRole('button', { name: '달력 열기', exact: true }).click();
            await popup.waitFor();
            assert.equal((await overflow()).value, 'hidden');
            if (transition === 'close') await review('setOuter', false);
            else await review('mountOuter', false);
            await popup.waitFor({ state: 'hidden' });
            assert.deepEqual(await overflow(), originalStyle, transition);
            assert.equal(await opener.evaluate(element => element === document.activeElement), true, transition);
            assert.deepEqual(await events(), []);
        }
    });
    results.push({ browser: name, label: 'uncaught browser errors', status: errors.length ? 'failed' : 'passed', errors });
    await browser.close();
}
await fixture.close();
await writeFile(new URL(process.env.KRDS_FIX1_RESULT ?? 'results.json', output), JSON.stringify(results, null, 2));
if (results.some(result => result.status !== 'passed')) process.exitCode = 1;
