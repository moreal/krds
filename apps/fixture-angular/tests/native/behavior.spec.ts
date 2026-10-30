import { test, expect, type Page } from '@playwright/test';
const route = async (page: Page, component: string, caseId = 'extended') => { await page.goto(`/fixtures/${component}?case=${caseId}`); await expect(page.getByRole('status', { name: 'Fixture health' })).toHaveText('ready'); };
const patch = async (page: Page, state: Record<string, unknown>) => page.evaluate(state => window.__KRDS_FIXTURE__!.setState(state), state);
const events = async (page: Page) => page.evaluate(() => window.__KRDS_FIXTURE__!.readEvents());
test('button uses native activation once for pointer Enter Space and submitter FormData', async ({ page }) => {
    await route(page, 'button');
    const button = page.getByRole('button', { name: '저장' });
    await button.click();
    await button.press('Enter');
    await button.press('Space');
    expect(await events(page)).toHaveLength(3);
    await patch(page, { type: 'submit' });
    await button.click();
    expect((await events(page)).slice(-2)).toEqual([{ name: 'click', detail: {} }, { name: 'submit', detail: { action: 'save' } }]);
    await patch(page, { disabled: true });
    await expect(button).toBeDisabled();
});
test('controlled select rejection restores native DOM and reset emits zero', async ({ page }) => {
    await route(page, 'native-select', 'controlled');
    const select = page.getByRole('combobox', { name: '지역' });
    await patch(page, { reject: true });
    await select.selectOption('busan');
    await expect(select).toHaveValue('seoul');
    expect(await events(page)).toEqual([{ name: 'valueChange', detail: { value: 'busan' } }]);
    await page.getByRole('button', { name: '초기화' }).click();
    await expect(select).toHaveValue('seoul');
    expect(await events(page)).toHaveLength(1);
    await patch(page, { value: 'busan' });
    await expect(select).toHaveValue('busan');
    expect(await events(page)).toHaveLength(1);
});
test('manual tabs keep all enabled sequential stops and mounted local panels', async ({ page }) => {
    await route(page, 'tabs');
    const first = page.getByRole('tab', { name: '첫 번째' });
    const second = page.getByRole('tab', { name: '두 번째' });
    await first.focus();
    await page.keyboard.press('Tab');
    await expect(second).toBeFocused();
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(first).toBeFocused();
    await page.keyboard.press('End');
    await expect(second).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(second).toHaveAttribute('aria-selected', 'true');
    expect(await page.locator('[role="tabpanel"]').count()).toBe(3);
    expect(await events(page)).toEqual([{ name: 'valueChange', detail: { value: 'second' } }]);
});
test('automatic rejected tabs suppress paired focus click but allow a future deliberate click', async ({ page }) => {
    await route(page, 'tabs');
    await patch(page, { automatic: true, reject: true });
    const second = page.getByRole('tab', { name: '두 번째' });
    await second.focus();
    await expect(second).toBeFocused();
    expect(await events(page)).toHaveLength(1);
    await second.click();
    expect(await events(page)).toHaveLength(2);
    await page.getByRole('tab', { name: '첫 번째' }).click();
    await second.click();
    expect(await events(page)).toHaveLength(3);
    await expect(page.getByRole('tab', { name: '첫 번째' })).toHaveAttribute('aria-selected', 'true');
});
test('modal rejected Escape keeps isolation and IME Escape is ignored; unmount restores body', async ({ page }) => {
    await route(page, 'modal', 'focus-return');
    await page.getByRole('button', { name: '열기' }).click();
    const dialog = page.getByRole('dialog', { name: '확인' });
    await expect(dialog).toBeFocused();
    await patch(page, { reject: true });
    await page.keyboard.press('Escape');
    await expect(dialog).toBeVisible();
    expect(await page.locator('krds-fixture-app').evaluate(el => (el as HTMLElement).inert)).toBe(true);
    const count = (await events(page)).length;
    await dialog.dispatchEvent('keydown', { key: 'Escape', isComposing: true });
    expect(await events(page)).toHaveLength(count);
    await patch(page, { open: false });
    await expect(page.getByRole('button', { name: '열기' })).toBeFocused();
    expect(await page.locator('body').evaluate(el => el.style.overflow)).toBe('');
});
test('nested modal traps only top dialog and open unmount restores preexisting inert and scroll', async ({ page }) => {
    await route(page, 'nested');
    await page.evaluate(() => { document.body.style.overflow = 'clip'; });
    await page.getByRole('button', { name: '열기', exact: true }).click();
    await page.getByRole('button', { name: '중첩 열기' }).click();
    await expect(page.getByRole('dialog', { name: '자식' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: '중첩 열기' })).toBeFocused();
    await expect(page.getByRole('dialog', { name: '부모' })).toBeVisible();
    await patch(page, { mounted: false });
    await expect(page.getByRole('button', { name: '열기', exact: true })).toBeFocused();
    expect(await page.locator('body').evaluate(el => el.style.overflow)).toBe('clip');
    expect(await page.locator('krds-fixture-app').evaluate(el => (el as HTMLElement).inert)).toBe(false);
});
test('DateInput raw drafts commit once, IME is preserved, invalid drafts block native submission and reset is silent', async ({ page }) => {
    await route(page, 'date-input');
    const date = page.getByRole('textbox', { name: '날짜', exact: true });
    await date.fill('2024-02-29');
    expect(await events(page)).toEqual([]);
    await date.press('Enter');
    await date.blur();
    expect(await events(page)).toEqual([{ name: 'valueChange', detail: { value: '2024-02-29' } }]);
    await date.dispatchEvent('compositionstart');
    await date.fill('이월');
    await date.dispatchEvent('keydown', { key: 'Enter', isComposing: true });
    await expect(date).toHaveValue('이월');
    expect(await events(page)).toHaveLength(1);
    await date.dispatchEvent('compositionend', { data: '이월' });
    await date.press('Enter');
    await expect(date).toHaveAttribute('aria-invalid', 'true');
    await page.getByRole('button', { name: '제출' }).click();
    expect(await events(page)).toHaveLength(1);
    expect(await page.locator('input[type="hidden"][name="visit"]').inputValue()).toBe('2024-02-29');
    await page.getByRole('button', { name: '초기화' }).click();
    await expect(date).toHaveValue('');
    expect(await events(page)).toHaveLength(1);
});
test('DateInput controlled rejection restores prop and calendar Cancel preserves invalid draft while Confirm commits once', async ({ page }) => {
    await route(page, 'date-input', 'controlled');
    const date = page.getByRole('textbox', { name: '날짜', exact: true });
    await date.fill('2024-03-01');
    await date.press('Enter');
    await expect(date).toHaveValue('2024-02-29');
    expect(await events(page)).toHaveLength(1);
    await date.fill('unfinished');
    await date.press('Enter');
    await page.getByRole('button', { name: '달력 열기', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: '2024년 2월 29일 목요일, 선택됨', exact: true })).toBeFocused();
    await dialog.getByRole('button', { name: '취소', exact: true }).click();
    await expect(date).toHaveValue('unfinished');
    await expect(page.getByRole('button', { name: '달력 열기', exact: true })).toBeFocused();
    await patch(page, { reject: false });
    await page.getByRole('button', { name: '달력 열기', exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: '2024년 2월 28일 수요일', exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: '확인', exact: true }).click();
    await expect(date).toHaveValue('2024-02-28');
    expect(await events(page)).toHaveLength(2);
});
test('range text validates group blur and ordering; canonical names stay independent from raw text', async ({ page }) => {
    await route(page, 'date-input', 'range');
    const start = page.getByRole('textbox', { name: '시작일', exact: true });
    const end = page.getByRole('textbox', { name: '종료일', exact: true });
    await start.fill('2024-02-29');
    await end.focus();
    await expect(start).not.toHaveAttribute('aria-invalid', 'true');
    expect(await events(page)).toEqual([]);
    await end.fill('2024-02-28');
    await end.press('Enter');
    await expect(end).toHaveAttribute('aria-invalid', 'true');
    expect(await events(page)).toEqual([]);
    await end.fill('2024-03-01');
    await end.press('Enter');
    expect(await events(page)).toEqual([{ name: 'valueChange', detail: { value: { start: '2024-02-29', end: '2024-03-01' } } }]);
    expect(await page.locator('#date-form').evaluate(el => Object.fromEntries(new FormData(el as HTMLFormElement)))).toEqual({ 'visit.start': '2024-02-29', 'visit.end': '2024-03-01' });
});
test('calendar range is tentative, chronological, partial confirmation disabled, keyboard leaves selection alone', async ({ page }) => {
    await route(page, 'calendar', 'range');
    const table = page.getByRole('table');
    const day29 = table.getByRole('button', { name: '2024년 2월 29일 목요일', exact: true });
    await day29.click();
    await expect(page.getByRole('button', { name: '확인', exact: true })).toBeDisabled();
    await table.locator('[data-date="2024-02-29"]').press('ArrowLeft');
    await expect(table.getByRole('button', { name: '2024년 2월 28일 수요일', exact: true })).toBeFocused();
    expect(await events(page)).toEqual([]);
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: '확인', exact: true }).click();
    expect(await events(page)).toEqual([{ name: 'valueChange', detail: { value: { start: '2024-02-28', end: '2024-02-29' } } }]);
});
test('multiple select/date instances reset independently and repeated destroy remount leaves no stale listeners', async ({ page }) => {
    await route(page, 'instances');
    for (let cycle = 0; cycle < 3; cycle++) {
        await page.getByRole('combobox', { name: '첫 지역', exact: true }).selectOption('busan');
        const date = page.getByRole('textbox', { name: '첫 날짜', exact: true });
        await date.fill('2024-03-02');
        await date.press('Enter');
        await expect(page.getByRole('combobox', { name: '둘 지역', exact: true })).toHaveValue('busan');
        await expect(page.getByRole('textbox', { name: '둘 날짜', exact: true })).toHaveValue('2024-03-01');
        await page.getByRole('button', { name: '초기화', exact: true }).click();
        await expect(date).toHaveValue('2024-02-29');
        await expect(page.getByRole('combobox', { name: '첫 지역', exact: true })).toHaveValue('seoul');
        await patch(page, { mounted: false });
        await patch(page, { mounted: true });
    }
    expect(await events(page)).toHaveLength(6);
    const ids = await page.locator('[id]').evaluateAll(elements => elements.map(el => el.id));
    expect(new Set(ids).size).toBe(ids.length);
});
test('outside APF consumer hydrates existing SSR DOM and first native interaction changes state once without Zone', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.addInitScript(() => {
        const state = window as typeof window & {
            __SSR_BUTTON__?: Element;
            __CONSUMER_APPLICATION__?: unknown;
        };
        new MutationObserver(() => { const button = document.querySelector('button[krdsButton]'); if (button && !state.__SSR_BUTTON__)
            state.__SSR_BUTTON__ = button; }).observe(document, { childList: true, subtree: true });
    });
    await page.goto(process.env.KRDS_ANGULAR_CONSUMER_ORIGIN!);
    await page.waitForFunction(() => !!(window as typeof window & {
        __CONSUMER_APPLICATION__?: unknown;
    }).__CONSUMER_APPLICATION__);
    await expect(page.getByRole('status', { name: 'Consumer health' })).toHaveText('ready');
    expect(await page.evaluate(() => (window as typeof window & {
        __SSR_BUTTON__?: Element;
    }).__SSR_BUTTON__ === document.querySelector('button[krdsButton]'))).toBe(true);
    expect(await page.evaluate(() => 'Zone' in window)).toBe(false);
    const button = page.getByRole('button', { name: 'Increment 0' });
    await button.click();
    await expect(page.getByRole('button', { name: 'Increment 1' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Visit date', exact: true })).toHaveValue('2024-02-29');
    await page.getByRole('combobox', { name: 'Region', exact: true }).selectOption('busan');
    await expect(page.getByRole('combobox', { name: 'Region', exact: true })).toHaveValue('busan');
    expect(errors).toEqual([]);
});

test('portaled modal preserves locally inherited KRDS theme variables', async ({ page }) => {
  await route(page, 'modal', 'focus-return');
  await page.locator('krds-fixture-app').evaluate(element => (element as HTMLElement).style.setProperty('--krds-light-color-surface-white', 'rgb(240, 245, 250)'));
  await page.getByRole('button', { name: '열기', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '확인', exact: true })).toHaveCSS('background-color', 'rgb(240, 245, 250)');
});

test('destroying an ancestor while nested modal is open restores original background inert and overflow', async ({ page }) => {
  await route(page, 'nested');
  await page.evaluate(() => { document.body.style.overflow = 'clip'; });
  await page.getByRole('button', { name: '열기', exact: true }).click(); await page.getByRole('button', { name: '중첩 열기', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '자식', exact: true })).toBeVisible();
  await patch(page, { mounted: false });
  expect(await page.locator('krds-fixture-app').evaluate(element => (element as HTMLElement).inert)).toBe(false);
  expect(await page.locator('body').evaluate(element => element.style.overflow)).toBe('clip');
  await expect(page.getByRole('button', { name: '다음 작업', exact: true })).toBeVisible();
});

test('removed opener skips a visibility-hidden alternate and returns to its remaining focusable ancestor', async ({ page }) => {
  await route(page, 'modal', 'trigger-removed');
  await page.locator('krds-fixture-app').evaluate(element => { (element as HTMLElement).tabIndex = 0; (element as HTMLElement).style.display = 'block'; });
  await page.locator('#fallback').evaluate(element => { (element as HTMLElement).style.visibility = 'hidden'; });
  await page.getByRole('button', { name: '열기', exact: true }).click();
  await patch(page, { triggerVisible: false }); await page.keyboard.press('Escape');
  await expect(page.locator('krds-fixture-app')).toBeFocused();
});

test('vertical tabs use a vertical native layout and additive Up Down focus navigation', async ({ page }) => {
  await route(page, 'tabs'); await patch(page, { vertical: true });
  const list = page.getByRole('tablist', { name: '주제', exact: true }); await expect(list).toHaveAttribute('aria-orientation', 'vertical');
  const first = page.getByRole('tab', { name: '첫 번째', exact: true }); const second = page.getByRole('tab', { name: '두 번째', exact: true });
  const firstBounds = await first.boundingBox(); const secondBounds = await second.boundingBox();
  expect(secondBounds!.y).toBeGreaterThan(firstBounds!.y);
  await first.focus(); await page.keyboard.press('ArrowDown'); await expect(second).toBeFocused(); await expect(first).toHaveAttribute('aria-selected', 'true');
});

test('leading panel context has its own Tab stop and native TemplateRef content remains mounted', async ({ page }) => {
  await route(page, 'tabs', 'content');
  const first = page.getByRole('tab', { name: '첫 번째', exact: true }); const second = page.getByRole('tab', { name: '두 번째', exact: true });
  const panel = page.getByRole('tabpanel', { name: '첫 번째', exact: true });
  await second.focus(); await page.keyboard.press('Tab'); await expect(panel).toBeFocused();
  await page.keyboard.press('Tab'); const memo = page.getByRole('textbox', { name: '패널 메모', exact: true }); await expect(memo).toBeFocused(); await memo.fill('보존할 메모');
  await second.click(); await expect(page.getByRole('tabpanel', { name: '두 번째', exact: true })).toHaveAttribute('tabindex', '-1');
  await first.click(); await expect(memo).toHaveValue('보존할 메모');
});

test('sequential focus fully reveals a tab label at a narrow viewport and 200 percent text size', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 }); await route(page, 'tabs');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const first = page.getByRole('tab', { name: '첫 번째', exact: true }); const second = page.getByRole('tab', { name: '두 번째', exact: true });
  await first.focus(); await page.keyboard.press('Tab'); await expect(second).toBeFocused(); await expect(second).toBeInViewport({ ratio: 1 });
});

test('automatic rejected tabs accept a new keyboard gesture after a canceled pointer gesture', async ({ page }) => {
  await route(page, 'tabs'); await patch(page, { automatic: true, reject: true });
  const second = page.getByRole('tab', { name: '두 번째', exact: true });
  await second.dispatchEvent('pointerdown', { pointerId: 1, button: 0 }); await second.focus(); await second.dispatchEvent('pointercancel', { pointerId: 1 });
  expect(await events(page)).toHaveLength(1); await second.press('Enter'); expect(await events(page)).toHaveLength(2);
  await expect(page.getByRole('tab', { name: '첫 번째', exact: true })).toHaveAttribute('aria-selected', 'true');
});

test('range submission focuses the invalid end field without marking the valid start invalid', async ({ page }) => {
  await route(page, 'date-input', 'range');
  const start = page.getByRole('textbox', { name: '시작일', exact: true }); const end = page.getByRole('textbox', { name: '종료일', exact: true });
  await start.fill('2024-02-28'); await end.fill('2023-02-29'); await end.press('Enter');
  await expect(end).toHaveAttribute('aria-invalid', 'true'); await expect(start).not.toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('button', { name: '제출', exact: true }).click(); await expect(end).toBeFocused(); expect(await events(page)).toEqual([]);
});

test('Reactive Forms validation is buffered through IME composition and compositionend until an explicit commit', async ({ page }) => {
  await route(page, 'forms', 'reactive'); const date = page.getByRole('textbox', { name: '폼 날짜', exact: true });
  await date.dispatchEvent('compositionstart'); await date.fill('이월');
  await expect(page.getByLabel('폼 상태', { exact: true })).toHaveText('valid untouched');
  await date.dispatchEvent('compositionend', { data: '이월' }); await expect(date).toHaveValue('이월');
  await expect(page.getByLabel('폼 상태', { exact: true })).toHaveText('valid untouched');
  await date.press('Enter'); await expect(date).toHaveAttribute('aria-invalid', 'true'); await expect(page.getByLabel('폼 상태', { exact: true })).toHaveText(/invalid/);
  expect(await events(page)).toEqual([]);
});

test('Calendar confirmation rejects a tentative date made unavailable by a bounds update', async ({ page }) => {
  await route(page, 'calendar', 'selection-confirm'); await page.locator('[data-date="2024-02-15"]').click();
  await patch(page, { min: '2024-02-20' }); await expect(page.locator('[data-date="2024-02-15"]')).toBeDisabled();
  await expect(page.getByRole('button', { name: '확인', exact: true })).toBeDisabled(); expect(await events(page)).toEqual([]);
  await page.locator('[data-date="2024-02-21"]').click(); await page.getByRole('button', { name: '확인', exact: true }).click();
  expect(await events(page)).toEqual([{ name: 'valueChange', detail: { value: '2024-02-21' } }]);
});

// Review S2: an initial open mount has no invocation, even when an unrelated control was focused.
for (const alternate of [true, false]) {
    test(`initially open modal returns to ${alternate ? 'alternate' : 'body'} without inventing an opener`, async ({ page }) => {
        await route(page, 'initial-modal');
        await page.locator('#unrelated').focus();
        await patch(page, { mounted: true, noAlternate: !alternate });
        await expect(page.getByRole('dialog', { name: '초기 대화상자' })).toBeFocused();
        expect(await events(page)).toEqual([]);
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toBeHidden();
        await expect(page.locator(alternate ? '#initial-fallback' : 'body')).toBeFocused();
        expect(await events(page)).toEqual([{ name: 'openChange', detail: { open: false } }]);
    });
}

test('later programmatic modal opening still captures the focused invocation context', async ({ page }) => {
    await route(page, 'modal');
    await page.locator('#opener').focus(); await patch(page, { open: true });
    await expect(page.getByRole('dialog')).toBeFocused(); expect(await events(page)).toEqual([]);
    await patch(page, { open: false }); await expect(page.locator('#opener')).toBeFocused();
    expect(await events(page)).toEqual([]);
});

// Review S3: added body roots must inherit isolation and recover their own prior inert states.
for (const unmount of [false, true]) {
    test(`late background roots are isolated and restored on ${unmount ? 'unmount' : 'close'}`, async ({ page }) => {
        await route(page, 'nested'); await page.getByRole('button', { name: '열기', exact: true }).click();
        await expect(page.getByRole('dialog', { name: '부모' })).toBeFocused();
        await page.evaluate(() => {
            for (const [id, inert] of [['late-active', false], ['late-inert', true]] as const) {
                const root = document.createElement('div'); root.id = id; root.inert = inert;
                root.innerHTML = '<button>배경 작업</button>'; document.body.appendChild(root);
            }
        });
        await expect.poll(() => page.locator('#late-active').evaluate(element => (element as HTMLElement).inert)).toBe(true);
        expect(await page.locator('#late-inert').evaluate(element => (element as HTMLElement).inert)).toBe(true);
        if (unmount) await patch(page, { mounted: false }); else await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toBeHidden();
        expect(await page.locator('#late-active').evaluate(element => (element as HTMLElement).inert)).toBe(false);
        expect(await page.locator('#late-inert').evaluate(element => (element as HTMLElement).inert)).toBe(true);
        await page.evaluate(() => { const root = document.createElement('div'); root.id = 'after-close'; document.body.appendChild(root); });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
        expect(await page.locator('#after-close').evaluate(element => (element as HTMLElement).inert)).toBe(false);
    });
}

test('late background isolation survives nested close and ancestor destruction with exact original states', async ({ page }) => {
    await route(page, 'nested'); await page.getByRole('button', { name: '열기', exact: true }).click();
    await page.getByRole('button', { name: '중첩 열기', exact: true }).click();
    await expect(page.getByRole('dialog', { name: '자식' })).toBeFocused();
    await page.evaluate(() => { const root = document.createElement('div'); root.id = 'nested-late'; document.body.appendChild(root); });
    await expect.poll(() => page.locator('#nested-late').evaluate(element => (element as HTMLElement).inert)).toBe(true);
    await page.keyboard.press('Escape'); await expect(page.getByRole('dialog', { name: '부모' })).toBeVisible();
    expect(await page.locator('#nested-late').evaluate(element => (element as HTMLElement).inert)).toBe(true);
    await page.getByRole('button', { name: '중첩 열기', exact: true }).click();
    await patch(page, { mounted: false });
    await expect(page.getByRole('dialog')).toBeHidden();
    expect(await page.locator('#nested-late').evaluate(element => (element as HTMLElement).inert)).toBe(false);
});
