import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const root = new URL('../../../../', import.meta.url);
const { serveProduction } = await import(new URL('tools/testing/support.mjs', root));
process.env.PLAYWRIGHT_BROWSERS_PATH = '/private/tmp/krds-playwright-1.64.1';
const directory = new URL('./visual-final/', import.meta.url);
await mkdir(directory, { recursive: true });
const server = await serveProduction(fileURLToPath(new URL('apps/fixture-solid/dist', root)), { fixture: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' });
const page = await context.newPage();
const report = { screenshots: [], checks: [], errors: [], externalRequests: [] };
page.on('pageerror', error => report.errors.push(String(error)));
page.on('request', request => { if (!request.url().startsWith(server.origin)) report.externalRequests.push(request.url()); });
async function open(component, caseId = 'default') {
  await page.emulateMedia({ forcedColors: 'none' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${server.origin}/fixtures/${component}?case=${caseId}`);
  await page.getByRole('status', { name: 'Fixture health', exact: true }).filter({ hasText: 'ready' }).waitFor();
  await page.evaluate(() => document.fonts.ready);
}
async function state(next) { await page.evaluate(patch => window.__KRDS_FIXTURE__.setState(patch), next); }
async function shot(name) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, directory)), fullPage: true, animations: 'disabled', caret: 'hide' });
  report.screenshots.push(name);
  report.checks.push({ name, ...await page.evaluate(() => {
    const popup = document.querySelector('dialog[open]');
    const calendar = document.querySelector('[data-krds-component="calendar"][data-krds-part="root"]');
    const error = document.querySelector('[data-krds-component="date-input"][data-krds-part="error"]');
    const rect = popup?.getBoundingClientRect();
    return {
      viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
      active: document.activeElement?.outerHTML.slice(0, 500),
      popup: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : undefined,
      calendar: calendar ? { clientWidth: calendar.clientWidth, scrollWidth: calendar.scrollWidth, scrollLeft: calendar.scrollLeft } : undefined,
      tableScroll: calendar?.querySelector('[data-krds-internal="table-scroll"]') ? (() => { const scroller = calendar.querySelector('[data-krds-internal="table-scroll"]'); return { clientWidth: scroller.clientWidth, scrollWidth: scroller.scrollWidth, scrollLeft: scroller.scrollLeft }; })() : undefined,
      error: error ? { text: error.textContent, before: getComputedStyle(error, '::before').content } : undefined,
    };
  }) });
}
async function axe(name) {
  const result = await new AxeBuilder({ page }).analyze();
  report.checks.push({ name, axeViolations: result.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map(node => node.target) })) });
}
try {
  // Trusted production input supplements the native suite's deterministic dispatched events.
  await open('modal'); await page.getByRole('button', { name: '열기', exact: true }).click();
  await state({ closeOnOutsideClick: true });
  const modal = page.getByRole('dialog', { name: '확인', exact: true });
  const bounds = await modal.boundingBox();
  const inside = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  await page.mouse.move(20, 20); await page.mouse.down(); await page.mouse.move(inside.x, inside.y); await page.mouse.up();
  await page.mouse.down(); await page.mouse.move(20, 20); await page.mouse.up();
  assert.equal(await modal.count(), 1, 'Two cross-boundary gestures must leave the modal open');
  assert.deepEqual(await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents()), [{ name: 'openChange', detail: { open: true } }]);
  await page.mouse.click(20, 20);
  assert.equal(await modal.count(), 0, 'A genuine backdrop-only gesture closes');
  assert.equal(await page.getByRole('button', { name: '열기', exact: true }).evaluate(element => element === document.activeElement), true);
  report.checks.push({ name: 'trusted-modal-consecutive-pointer-gestures', passed: true });
  await open('tabs', 'automatic'); await state({ rejectChanges: true });
  const first = page.getByRole('tab', { name: '첫 번째', exact: true });
  await first.focus(); const tabBounds = await first.boundingBox();
  await page.mouse.move(tabBounds.x + tabBounds.width / 2, tabBounds.y + tabBounds.height / 2); await page.mouse.down(); await page.mouse.move(20, 20); await page.mouse.up();
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter'); await page.keyboard.press('Space');
  assert.deepEqual(await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents()), Array.from({ length: 3 }, () => ({ name: 'valueChange', detail: { value: 'second' } })));
  assert.equal(await first.getAttribute('aria-selected'), 'true');
  report.checks.push({ name: 'trusted-tabs-abandoned-pointer-keyboard-retry', passed: true });
  await open('modal', 'nested-date'); await page.getByRole('button', { name: '열기', exact: true }).click();
  await page.getByRole('button', { name: '달력 열기', exact: true }).click();
  await page.getByRole('dialog', { name: '날짜 선택', exact: true }).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog', { name: '날짜 선택', exact: true }).count(), 0);
  assert.equal(await page.getByRole('dialog', { name: '확인', exact: true }).count(), 1);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog', { name: '확인', exact: true }).count(), 0);
  report.checks.push({ name: 'trusted-date-popup-topmost-escape', passed: true });
  await open('button'); await page.keyboard.press('Tab'); await shot('button-focus'); await axe('button');
  for (const size of ['xsmall', 'small', 'medium', 'large', 'xlarge']) { await state({ size }); await shot(`button-size-${size}`); }
  await state({ size: 'medium', disabled: true }); await shot('button-disabled');
  await open('native-select'); await shot('native-select-default');
  for (const size of ['small', 'medium', 'large']) { await state({ size }); await shot(`native-select-size-${size}`); }
  await state({ size: 'medium', disabled: true }); await shot('native-select-disabled');
  await state({ disabled: false, invalid: true }); await shot('native-select-invalid'); await axe('native-select');
  await page.setViewportSize({ width: 320, height: 640 }); await shot('native-select-narrow');
  await open('modal'); await page.getByRole('button', { name: '열기', exact: true }).click(); await shot('modal-open'); await axe('modal');
  await page.keyboard.press('Tab'); await page.getByRole('button', { name: '닫기', exact: true }).focus(); await shot('modal-close-focus');
  await page.setViewportSize({ width: 320, height: 640 }); await shot('modal-narrow');
  await open('tabs', 'manual-activation'); await page.getByRole('tab', { name: '첫 번째', exact: true }).focus(); await page.keyboard.press('ArrowRight'); await shot('tabs-manual-focus'); await axe('tabs');
  await page.keyboard.press('Enter'); await shot('tabs-selected');
  await page.setViewportSize({ width: 320, height: 640 }); await shot('tabs-narrow');
  await open('date-input'); await shot('date-input-default');
  const input = page.getByRole('textbox', { name: '날짜', exact: true });
  await input.fill('2023-02-29'); await page.getByRole('button', { name: '다음 작업', exact: true }).click();
  if (await input.getAttribute('aria-invalid') !== 'true') throw new Error('Invalid date draft was not validated on group blur');
  await shot('date-input-invalid'); await axe('date-input-invalid');
  await page.setViewportSize({ width: 320, height: 640 }); await shot('date-input-narrow');
  await open('date-input'); await state({ value: '2024-02-29' }); await page.getByRole('button', { name: '달력 열기', exact: true }).click();
  await page.getByRole('dialog', { name: '날짜 선택', exact: true }).waitFor(); await shot('date-input-calendar-popup'); await axe('date-input-popup');
  await page.setViewportSize({ width: 320, height: 640 }); await shot('date-input-popup-narrow');
  await page.evaluate(() => document.documentElement.style.fontSize = '125%'); await shot('date-input-popup-narrow-text-200');
  const popupLayout = await page.locator('[data-krds-component="calendar"][data-krds-part="root"]').evaluate(root => {
    const heading = root.querySelector('[data-krds-part="heading"]');
    const text = document.createRange(); text.selectNodeContents(heading); const title = text.getBoundingClientRect();
    const next = root.querySelector('[data-krds-part="next"]').getBoundingClientRect();
    return { title: { x: title.x, y: title.y, right: title.right, bottom: title.bottom }, next: { x: next.x, y: next.y, right: next.right, bottom: next.bottom }, noOverlap: title.right <= next.x || title.bottom <= next.y || title.x >= next.right || title.y >= next.bottom };
  });
  report.checks.push({ name: 'popup-narrow-200-heading-no-overlap', ...popupLayout });
  await page.keyboard.press('Tab');
  await page.getByRole('button', { name: '확인', exact: true }).focus(); await shot('date-input-popup-narrow-text-200-footer-focus');
  await page.keyboard.press('Tab');
  assert.equal(await page.getByRole('button', { name: '닫기', exact: true }).evaluate(element => element === document.activeElement), true, 'Tab reaches the independent popup close action');
  await shot('date-input-popup-narrow-text-200-close-focus');
  await open('calendar', 'selected-range'); await shot('calendar-range'); await axe('calendar');
  for (const [stateName, date] of [['in-range', '2024-02-15'], ['range-start', '2024-02-12'], ['range-end', '2024-02-18']]) {
    const target = page.locator(`[data-krds-component="calendar"][data-krds-part="day"][data-krds-state~="${stateName}"]`).filter({ hasText: String(Number(date.slice(-2))) }).first();
    await page.keyboard.press('Tab'); await target.focus(); await shot(`calendar-${stateName}-focus`);
    for (const forced of [false, true]) {
      await page.emulateMedia({ forcedColors: forced ? 'active' : 'none' });
      await target.focus();
      report.checks.push({ name: `calendar-${stateName}-${forced ? 'forced' : 'normal'}`, ...await target.evaluate(element => {
        const css = getComputedStyle(element);
        return { focusVisible: element.matches(':focus-visible'), outlineStyle: css.outlineStyle, outlineWidth: css.outlineWidth, borderStyle: css.borderStyle, borderWidth: css.borderWidth, color: css.color, background: css.backgroundColor, whiteSpace: css.whiteSpace, state: element.dataset.krdsState };
      }) });
      if (forced) await shot(`calendar-${stateName}-focus-forced`);
    }
    await page.emulateMedia({ forcedColors: 'none' });
  }
  await state({ value: { start: '2024-02-15', end: '2024-02-15' } });
  const both = page.locator('[data-krds-part="day"][data-krds-state~="range-start"][data-krds-state~="range-end"]');
  await both.focus(); await shot('calendar-both-endpoints-focus'); await page.emulateMedia({ forcedColors: 'active' }); await shot('calendar-both-endpoints-focus-forced');
  report.checks.push({ name: 'calendar-both-endpoints-forced', ...await both.evaluate(element => { const css = getComputedStyle(element); return { color: css.color, background: css.backgroundColor, outlineStyle: css.outlineStyle, outlineWidth: css.outlineWidth, borderStyle: css.borderStyle, borderWidth: css.borderWidth }; }) });
  await page.emulateMedia({ forcedColors: 'none' }); await state({ disabled: true }); await shot('calendar-disabled');
  await state({ disabled: false }); await page.setViewportSize({ width: 320, height: 640 }); await shot('calendar-narrow');
  await page.evaluate(() => document.documentElement.style.fontSize = '125%'); await shot('calendar-narrow-text-200');
  await both.focus(); await page.keyboard.press('End');
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-date')), '2024-02-17', 'End reaches the last column of the focused week');
  await shot('calendar-narrow-text-200-last-column');
  const calendarChrome = await page.locator('[data-krds-component="calendar"][data-krds-part="root"]').evaluate(root => {
    const box = root.getBoundingClientRect();
    return ['header', 'footer'].map(part => { const rect = root.querySelector(`[data-krds-part="${part}"]`).getBoundingClientRect(); return { part, left: rect.left, right: rect.right, rootLeft: box.left, rootRight: box.right, staysVisible: rect.left >= box.left && rect.right <= box.right }; });
  });
  report.checks.push({ name: 'calendar-narrow-200-static-context', chrome: calendarChrome });
  if (!popupLayout.noOverlap || calendarChrome.some(part => !part.staysVisible)) report.errors.push('Calendar heading/navigation/footer context overlaps or scrolls away');
} catch (error) { report.errors.push(String(error)); }
finally {
  await writeFile(new URL('report.json', directory), JSON.stringify(report, null, 2) + '\n');
  await context.close(); await browser.close(); await server.close();
}
console.log(JSON.stringify({ screenshots: report.screenshots.length, errors: report.errors, externalRequests: report.externalRequests, report: fileURLToPath(new URL('report.json', directory)) }));
if (report.errors.length || report.externalRequests.length) process.exitCode = 1;
