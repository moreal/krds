import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { serveProduction, root } from '../../../../tools/testing/support.mjs';
const directory = join(root, '.superpowers/sdd/PLAN/t11-lit-logs', process.env.KRDS_PATTERN_RUN ?? 'browser');
await mkdir(directory, { recursive: true });
const server = await serveProduction(resolve(process.env.KRDS_PATTERN_DIST ?? join(root, 'apps/fixture-lit/dist')), { fixture: true });
const browser = await chromium.launch();
const results = [];
let sequence = 0;
const requests = page => page.evaluate(() => window.__KRDS_FIXTURE__.readEvents().filter(event => event.name === 'pattern:request'));
const settle = (page, ok) => page.evaluate(async (command) => window.__KRDS_FIXTURE__.setState({ __patternCommand: command }), { sequence: ++sequence, command: 'settle', ...(ok === undefined ? {} : { ok }) });
const control = (page, id, tag = 'input') => page.locator(`#${id}`).locator(tag);
const button = (page, id) => page.locator(`#${id}`).locator('button');
const activeId = page => page.evaluate(() => { let element = document.activeElement; while (element?.shadowRoot?.activeElement)
    element = element.shadowRoot.activeElement; return element?.id; });
const cases = [['form-errors', 'error-summary-focus'], ['form-errors', 'retry-success'], ['form-errors', 'reset-cancels-pending'], ['search-results', 'filter-resets-page'], ['search-results', 'empty-results'], ['search-results', 'retry-success'], ['search-results', 'query-during-loading'], ['consent-confirmation', 'required-refusal'], ['consent-confirmation', 'optional-refusal-success'], ['consent-confirmation', 'modal-focus-return'], ['consent-confirmation', 'retry-in-dialog'], ['service-layout', 'skip-main'], ['service-layout', 'navigate-current'], ['service-layout', 'narrow-navigation'], ['service-layout', 'footer-policy']];
assert.equal(cases.length,15,'Native behavior matrix must contain all fifteen scenarios');
try {
    for (const [pattern, id] of cases) {
        const context = await browser.newContext({ viewport: id === 'narrow-navigation' ? { width: 360, height: 800 } : id === 'modal-focus-return' ? { width: 1000, height: 500 } : { width: 1280, height: 900 }, locale: 'ko-KR', reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [], external = [];
        page.on('pageerror', error => errors.push(error.stack ?? String(error)));
        page.on('request', request => { if (!request.url().startsWith(server.origin))
            external.push(request.url()); });
        const result = { pattern, id, pass: false, errors, external };
        try {
            await page.goto(`${server.origin}/examples/${pattern}?case=${id}`);
            await page.waitForFunction(() => window.__KRDS_FIXTURE__?.framework === 'lit');
            await page.locator('krds-pattern-presentation').evaluate(element => element.settled());
            result.initialRequestCount=(await requests(page)).length;
            assert.equal(result.initialRequestCount,0);
            if (pattern === 'form-errors') {
                if (id === 'error-summary-focus') {
                    await button(page, 'example-form-submit').click();
                    await expect(control(page, 'example-form-title')).toBeFocused();
                    await expect(page.locator('#example-form-errors li')).toHaveCount(2);
                    await page.locator('#example-form-errors a[href="#example-form-category"]').click();
                    await expect(control(page, 'example-form-category', 'select')).toBeFocused();
                    assert.equal((await requests(page)).length, 0);
                    assert.equal(await control(page, 'example-form-title').getAttribute('aria-invalid'), 'true');
                    assert.ok(await control(page, 'example-form-title').evaluate(input => input.ariaDescribedByElements?.some(element => element.id === 'example-form-title-error') || input.getAttribute('aria-describedby')?.includes('example-form-title-error')));
                    await page.locator('#example-form-title label').click();
                    await expect(control(page, 'example-form-title')).toBeFocused();
                    await control(page, 'example-form-title').fill('  예제 제목 😀  ');
                    await control(page, 'example-form-category', 'select').selectOption('practice');
                    assert.deepEqual(await page.locator('form').evaluate(form => Object.fromEntries(new FormData(form))), { title: '  예제 제목 😀  ', category: 'practice', detail: '' });
                    await control(page, 'example-form-title').evaluate(input => { input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, composed: true })); input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true, composed: true, cancelable: true })); input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, composed: true })); });
                    assert.equal((await requests(page)).length, 0);
                    await control(page, 'example-form-title').press('Enter');
                    await expect.poll(async () => (await requests(page)).length).toBe(1);
                    assert.equal((await requests(page))[0].detail.payload.title, '예제 제목 😀');
                    const submit = await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents().filter(item => item.name === 'pattern:form-submit').at(-1));
                    result.formSubmit=submit.detail;
                    assert.equal(submit.detail.submitter, 'intent');
                    assert.ok(submit.detail.entries.some(([key,value])=>key==='title'&&value==='  예제 제목 😀  '));
                    assert.ok(submit.detail.entries.some(([key,value])=>key==='category'&&value==='practice'));
                    assert.ok(submit.detail.entries.some(([key, value]) => key === 'intent' && value === 'save'));
                    await settle(page);
                    await expect(page.getByRole('status').filter({ hasText: 'DEMO-FORM-001' })).toBeVisible();
                }
                else {
                    await button(page, 'example-form-submit').click();
                    assert.equal((await requests(page)).length, 1);
                    await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true');
                    await page.locator('form').evaluate(form => form.requestSubmit());
                    assert.equal((await requests(page)).length, 1);
                    if (id === 'reset-cancels-pending') {
                        await page.locator('form').evaluate(form=>{window.resetValueChanges=[];form.addEventListener('value-change',event=>window.resetValueChanges.push(event.detail));});
                        await page.locator('form').evaluate(form => form.addEventListener('reset', event => event.preventDefault(), { once: true }));
                        await button(page, 'example-form-reset').click();
                        await expect(control(page, 'example-form-title')).toHaveValue('예제 입력폼 연습');
                        await expect(page.locator('form')).toHaveAttribute('aria-busy', 'true');
                        await button(page, 'example-form-reset').click();
                        await expect(control(page, 'example-form-title')).toHaveValue('');
                        await expect(control(page, 'example-form-category', 'select')).toHaveValue('');
                        result.resetValueChanges=await page.evaluate(()=>window.resetValueChanges);
                        assert.deepEqual(result.resetValueChanges,[]);
                        result.resetFormData=await page.locator('form').evaluate(form=>Object.fromEntries(new FormData(form)));
                        assert.deepEqual(result.resetFormData,{title:'',category:'',detail:''});
                        await settle(page, true);
                        await expect(page.getByText('DEMO-FORM-001', { exact: false })).toHaveCount(0);
                        assert.equal((await requests(page)).length, 1);
                    }
                    else {
                        await settle(page);
                        await button(page, 'example-form-retry').click();
                        assert.equal((await requests(page)).length, 2);
                        await settle(page);
                        await expect(page.getByRole('status').filter({ hasText: 'DEMO-FORM-001' })).toBeVisible();
                    }
                }
            }
            else if (pattern === 'search-results') {
                const query = control(page, 'example-search-query');
                if (id === 'filter-resets-page') {
                    await expect(page.locator('krds-pagination [aria-current]')).toHaveText('3');
                    const select = control(page, 'example-search-category', 'select');
                    await select.focus();
                    await select.selectOption('example');
                    await expect(select).toBeFocused();
                    await expect(page.locator('#example-search-count')).toHaveCount(0);
                    assert.equal((await requests(page))[0].detail.payload.page, 1);
                    await settle(page);
                    await expect(page.locator('#example-search-count')).toContainText('4건');
                    await expect(page.locator('krds-structured-list [data-krds-part="item"]')).toHaveCount(3);
                    assert.deepEqual(await page.locator('krds-structured-list [data-krds-part="item"]').evaluateAll(items => items.map(item => item.id)), ['resource-02', 'resource-05', 'resource-08']);
                    await expect(page.locator('krds-pagination [aria-current]')).not.toHaveAttribute('href');
                    const second = page.locator('krds-pagination a').filter({ hasText: /^2$/ });
                    assert.match(await second.getAttribute('href'), /page=2/);
                    await second.click();
                    await settle(page);
                    await expect(page.locator('krds-structured-list h3')).toHaveText('화면 탐색 예제');
                    await expect(page.locator('krds-pagination [aria-current]')).toBeFocused();
                    assert.match(page.url(), /page=2/);
                    assert.equal((await requests(page)).length,2);
                    result.requestHistory=await requests(page);
                    await page.goBack();
                    await expect(page.locator('krds-structured-list [data-krds-part="item"]')).toHaveCount(3);
                    assert.equal((await requests(page)).length, 0);
                    await page.goForward();
                    await expect(page.locator('krds-structured-list h3')).toHaveText('화면 탐색 예제');
                    await page.reload();
                    await expect(page.locator('krds-structured-list h3')).toHaveText('화면 탐색 예제');
                    assert.equal((await requests(page)).length, 0);
                }
                else {
                    if (id === 'empty-results')
                        await query.fill('존재하지않는예제');
                    if (id === 'query-during-loading')
                        await query.fill('접근성');
                    await button(page, 'example-search-submit').click();
                    if (id === 'query-during-loading')
                        await query.fill('대화상자');
                    await settle(page);
                    if (id === 'retry-success') {
                        await button(page, 'example-search-retry').click();
                        await page.evaluate(command=>window.__KRDS_FIXTURE__.setState({__patternCommand:command}),{sequence,command:'settle'});
                        await expect(page.getByRole('status').filter({hasText:'로컬 예제 처리 중'})).toBeVisible();
                        await settle(page);
                        assert.equal((await requests(page)).length, 2);
                        await expect(page.locator('#example-search-count')).toContainText('12건');
                    }
                    else if (id === 'empty-results') {
                        await expect(page.getByText('검색 결과가 없습니다. 검색어나 자료 유형을 바꿔 보세요.')).toBeVisible();
                        await expect(page.locator('krds-pagination')).toHaveCount(0);
                    }
                    else {
                        await expect(query).toHaveValue('대화상자');
                        await expect(page.locator('#example-search-count')).toContainText('접근성');
                        await expect(page.locator('#example-search-count')).toContainText('4건');
                    }
                }
            }
            else if (pattern === 'consent-confirmation') {
                const review = button(page, 'example-consent-review');
                if (id === 'required-refusal') {
                    await page.locator('krds-radio-group[name="requiredChoice"] input[value="decline"]').check();
                    await review.click();
                    await expect(page.getByRole('dialog')).toHaveCount(0);
                    assert.equal(await activeId(page), 'example-consent-required-agree');
                    assert.equal((await requests(page)).length, 0);
                }
                else {
                    await review.scrollIntoViewIfNeeded();
                    await review.focus();
                    const scroll = await page.evaluate(() => scrollY);
                    await review.click();
                    const dialog = page.getByRole('dialog', { name: '예제 선택 확인' });
                    await expect(dialog).toBeVisible();
                    await expect(dialog).toBeFocused();
                    await expect(dialog).toContainText('동의하지 않음');
                    if (id === 'modal-focus-return') {
                        await page.keyboard.press('Tab');
                        assert.equal(await page.evaluate(() => { let active = document.activeElement; while (active?.shadowRoot?.activeElement)
                            active = active.shadowRoot.activeElement; const root = active?.getRootNode(); return !!(active?.closest('dialog') || root?.host?.closest('dialog')); }), true);
                        await page.keyboard.press('Shift+Tab');
                        await page.keyboard.press('Escape');
                        await expect(dialog).toHaveCount(0);
                        await expect(review).toBeFocused();
                        assert.ok(Math.abs((await page.evaluate(() => scrollY)) - scroll) <= 3);
                        await review.click();
                        await button(page, 'example-consent-cancel').click();
                        await expect(review).toBeFocused();
                        await review.click();
                        await button(page,'example-consent-confirm').click();
                        await button(page,'example-consent-cancel').click();
                        await settle(page,true);
                        await expect(dialog).toHaveCount(0);
                        await expect(page.getByText('DEMO-CONSENT-001',{exact:false})).toHaveCount(0);
                        await expect(review).toBeFocused();
                    }
                    else {
                        await button(page, 'example-consent-confirm').click();
                        await expect(page.locator('krds-spinner')).toHaveCount(1);
                        assert.equal((await requests(page)).length, 1);
                        await settle(page);
                        if (id === 'retry-in-dialog') {
                            await expect(dialog).toBeVisible();
                            await button(page, 'example-consent-retry').click();
                            assert.equal((await requests(page)).length, 2);
                            await settle(page);
                        }
                        await expect(dialog).toHaveCount(0);
                        await expect(review).toBeFocused();
                        await expect(page.getByRole('status').filter({ hasText: 'DEMO-CONSENT-001' })).toContainText('동의하지 않음');
                        assert.ok(Math.abs((await page.evaluate(() => scrollY)) - scroll) <= 3);
                    }
                }
            }
            else {
                const heading = page.locator('#example-main-heading');
                const sidebar = page.locator('krds-side-navigation');
                if (id === 'skip-main') {
                    await page.keyboard.press('Tab');
                    await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeFocused();
                    await page.keyboard.press('Enter');
                    await expect(heading).toBeFocused();
                }
                else if (id === 'navigate-current') {
                    await sidebar.getByRole('button', { name: /도움말/ }).click();
                    await expect(sidebar.getByRole('button', { name: /예제 둘러보기/ })).toHaveAttribute('aria-expanded', 'true');
                    await sidebar.getByRole('link', { name: '검색 연습', exact: true }).click();
                    await expect(heading).toHaveText('검색 연습');
                    await expect(heading).toBeFocused();
                    assert.match(page.url(), /section=search/);
                    await page.goBack();
                    await expect(heading).toHaveText('예제 소개');
                    await page.goForward();
                    await expect(heading).toHaveText('검색 연습');
                }
                else if (id === 'narrow-navigation') {
                    const opener = page.locator('krds-header #example-layout-mobile-open');
                    for (let i = 0; i < 2; i++) {
                        await opener.click();
                        const dialog = page.locator('krds-header dialog');
                        await expect(dialog).toBeVisible();
                        const branch = dialog.getByRole('button', { name: '예제 둘러보기', exact: true });
                        if (await branch.getAttribute('aria-expanded') !== 'true')
                            await branch.click();
                        await dialog.getByRole('link', { name: '검색 연습', exact: true }).click();
                        await expect(dialog).not.toBeVisible();
                        await expect(heading).toHaveText('검색 연습');
                        await expect(heading).toBeFocused();
                    }
                    assert.equal((await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents())).filter(item => item.name === 'pattern:route-change').length, 1);
                    await opener.click();
                    await page.keyboard.press('Escape');
                    await expect(opener).toBeFocused();
                }
                else {
                    await page.locator('krds-footer').getByRole('link', { name: '개인정보 처리방침', exact: true }).click();
                    await expect(heading).toHaveText('개인정보 처리방침');
                    await expect(heading).toBeFocused();
                    await expect(sidebar.getByRole('link', { name: '개인정보 처리방침', exact: true })).toHaveAttribute('aria-current', 'page');
                    await expect(page.locator('main')).toContainText('영구 저장하지 않습니다');
                }
            }
            await page.screenshot({ path: join(directory, `${pattern}-${id}.png`), fullPage: true });
            assert.deepEqual(errors, []);
            assert.deepEqual(external, []);
            result.requests = await requests(page);
            result.pass = true;
        }
        catch (error) {
            result.error = String(error);
            await page.screenshot({ path: join(directory, `${pattern}-${id}-failure.png`), fullPage: true }).catch(() => { });
        }
        finally {
            results.push(result);
            await writeFile(join(directory, 'checkpoint.json'), JSON.stringify(results, null, 2));
            console.log(result.id, result.pass, result.error ?? '');
            await context.close();
        }
    }
    const visual = [];
    for (const [pattern, id] of [cases[0], cases[3], cases[8], cases[11]]) {
        const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
        const page = await context.newPage();
        await page.goto(`${server.origin}/examples/${pattern}?case=${id}`);
        await page.locator('krds-pattern-presentation').evaluate(element => element.settled());
        for (const mode of ['narrow', 'text200', 'forced-colors']) {
            await page.emulateMedia({ forcedColors: mode === 'forced-colors' ? 'active' : 'none' });
            await page.evaluate(mode => { document.documentElement.style.fontSize = mode === 'text200' ? '200%' : ''; }, mode);
            await page.screenshot({ path: join(directory, `${pattern}-${mode}.png`), fullPage: true });
            const axe = await new AxeBuilder({ page }).analyze();
            await writeFile(join(directory, `${pattern}-${mode}-axe.json`), JSON.stringify(axe, null, 2));
            const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
            const radioLayout = pattern === 'consent-confirmation' ? await page.locator('krds-radio-group label').evaluateAll(labels => labels.map(label => { const input = label.querySelector('input').getBoundingClientRect(); const text = label.lastElementChild.getBoundingClientRect(); return { input: { x: input.x, y: input.y, width: input.width, height: input.height }, text: { x: text.x, y: text.y, width: text.width, height: text.height }, aligned: text.y < input.bottom && input.y < text.bottom && text.x >= input.x }; })) : [];
            visual.push({ pattern, mode, overflow, radioLayout, violations: axe.violations.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.length })) });
        }
        await context.close();
    }
    const lifecyclePage = await browser.newPage();
    await lifecyclePage.goto(server.origin + '/examples/consent-confirmation?case=optional-refusal-success');
    await button(lifecyclePage, 'example-consent-review').click();
    await button(lifecyclePage, 'example-consent-confirm').click();
    const lifecycle = await lifecyclePage.evaluate(async () => { const bridge = window.__KRDS_FIXTURE__; const dialog=document.querySelector('krds-modal').shadowRoot.querySelector('dialog'); document.querySelector('krds-pattern-host').remove(); let disposed = false; try {
        await bridge.setState({ __patternCommand: { sequence: 99, command: 'settle' } });
    }
    catch {
        disposed = true;
    } return { disposed, bridgeRemoved: !window.__KRDS_FIXTURE__, dialogs: document.querySelectorAll('dialog[open]').length, dialogOpen:dialog.open, overflow: document.body.style.overflow }; });
    await lifecyclePage.close();
    assert.deepEqual(lifecycle, { disposed: true, bridgeRemoved: true, dialogs: 0, dialogOpen:false, overflow: '' });
    await writeFile(join(directory, 'report.json'), JSON.stringify({ snapshot: server.snapshot, results, visual, lifecycle }, null, 2));
    console.log(JSON.stringify({ snapshot: server.snapshot.sha256, passed: results.filter(item => item.pass).length, failed: results.filter(item => !item.pass).map(item => ({ id: item.id, error: item.error })), visual, lifecycle }, null, 2));
    if (results.some(item => !item.pass) || visual.some(item => item.overflow || item.violations.length || item.radioLayout.some(radio => !radio.aligned)))
        process.exitCode = 1;
}
finally {
    await browser.close();
    await server.close();
}
