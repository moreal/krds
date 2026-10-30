import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const root = new URL('../../../../', import.meta.url);
const { serveProduction } = await import(new URL('tools/testing/support.mjs', root));
process.env.PLAYWRIGHT_BROWSERS_PATH = '/private/tmp/krds-playwright-1.64.1';
const directory = new URL('./visual-focus-supplement/', import.meta.url);
await mkdir(directory, { recursive: true });
const server = await serveProduction(fileURLToPath(new URL('apps/fixture-solid/dist', root)), { fixture: true });
const browser = await chromium.launch(); const report = [];
try {
  for (const [component, role, name] of [['native-select', 'combobox', '지역'], ['date-input', 'textbox', '날짜']]) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' });
    try {
      const page = await context.newPage(); await page.goto(`${server.origin}/fixtures/${component}?case=default`);
      await page.getByRole('status', { name: 'Fixture health', exact: true }).waitFor();
      await page.evaluate(() => document.fonts.ready); await page.keyboard.press('Tab');
      const control = page.getByRole(role, { name, exact: true });
      const result = await control.evaluate(element => { const css = getComputedStyle(element); return { focused: element === document.activeElement, focusVisible: element.matches(':focus-visible'), outlineStyle: css.outlineStyle, outlineWidth: css.outlineWidth }; });
      assert.equal(result.focused, true); assert.equal(result.focusVisible, true); assert.equal(result.outlineStyle, 'solid');
      await page.screenshot({ path: fileURLToPath(new URL(`${component}-keyboard-focus.png`, directory)), fullPage: true, animations: 'disabled', caret: 'hide' });
      report.push({ component, ...result });
    } finally { await context.close(); }
  }
} finally { await browser.close(); await server.close(); await writeFile(new URL('report.json', directory), JSON.stringify(report, null, 2) + '\n'); }
console.log(JSON.stringify(report));
