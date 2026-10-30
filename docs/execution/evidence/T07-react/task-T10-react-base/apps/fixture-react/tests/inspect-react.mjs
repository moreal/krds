import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { serveProduction } from '../../../tools/testing/support.mjs';
const directory = resolve('.superpowers/sdd/PLAN/t07-react-logs/visual');
await mkdir(directory, { recursive: true });
const server = await serveProduction(resolve('apps/storybook-react/dist'));
const browser = await chromium.launch();
const results = [];
try {
  let page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: 'ko-KR', reducedMotion: 'reduce' });
  const entries = ['krds-button--default', 'krds-button--small', 'krds-button--large', 'krds-button--disabled', 'krds-native-select--invalid', 'krds-tabs--manual', 'krds-date-input--invalid', 'krds-modal--open', 'krds-calendar--selected-range'];
  for (const id of entries) {
    await page.goto(`${server.origin}/iframe.html?id=${id}&viewMode=story`);
    await page.waitForSelector('[data-krds-component]');
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${directory}/${id}.png`, fullPage: true });
    results.push({ id, width: 1280, image: `${id}.png` });
  }
  for (const mode of ['narrow200', 'zoom200', 'forced']) {
    await page.close();
    page = await browser.newPage({ viewport: { width: mode === 'narrow200' ? 320 : mode === 'zoom200' ? 640 : 1280, height: mode === 'zoom200' ? 450 : 900 }, deviceScaleFactor: mode === 'zoom200' ? 2 : 1, locale: 'ko-KR', reducedMotion: 'reduce' });
    await page.emulateMedia({ forcedColors: mode === 'forced' ? 'active' : 'none' });
    for (const id of ['krds-button--default', 'krds-native-select--invalid', 'krds-tabs--manual', 'krds-calendar--selected-range', 'krds-date-input--invalid', 'krds-modal--open']) {
      await page.goto(`${server.origin}/iframe.html?id=${id}&viewMode=story`);
      await page.waitForSelector('[data-krds-component]');
      if (mode === 'narrow200') await page.evaluate(() => { document.documentElement.style.fontSize = `${parseFloat(getComputedStyle(document.documentElement).fontSize) * 2}px`; });
      const target = page.locator('[data-krds-part="day"]:not(:disabled),[data-krds-part="control"]:not(:disabled),[data-krds-part="close"],[data-krds-part="trigger"]:not(:disabled),button[data-krds-part="root"]:not(:disabled)').first();
      if (await target.count()) await target.focus();
      await page.screenshot({ path: `${directory}/${id}-${mode}.png`, fullPage: true });
      results.push({ id, mode, image: `${id}-${mode}.png`, metrics: await page.evaluate(() => ({ viewport: innerWidth, viewportHeight: innerHeight, devicePixelRatio, rootFontSize: getComputedStyle(document.documentElement).fontSize, zoom: getComputedStyle(document.documentElement).zoom, bodyScroll: document.documentElement.scrollWidth, focus: document.activeElement?.outerHTML, tableScroll: [...document.querySelectorAll('[data-krds-internal="table-scroll"]')].map(element => ({ width: element.clientWidth, scroll: element.scrollWidth })) })) });
      if (id === 'krds-date-input--invalid') {
        await page.getByRole('button', { name: '달력 열기', exact: true }).click();
        await page.getByRole('dialog').waitFor({ state: 'visible' });
        await page.screenshot({ path: `${directory}/date-popup-${mode}.png`, fullPage: true });
        results.push({ id: 'date-popup', mode, image: `date-popup-${mode}.png`, focus: await page.evaluate(() => document.activeElement?.outerHTML), popupPart: await page.getByRole('dialog').getAttribute('data-krds-part') });
        const close = page.getByRole('button', { name: '닫기', exact: true });
        await close.scrollIntoViewIfNeeded(); await close.focus();
        await page.screenshot({ path: `${directory}/date-popup-footer-${mode}.png`, fullPage: true });
        results.push({ id: 'date-popup-footer', mode, image: `date-popup-footer-${mode}.png`, metrics: await page.getByRole('dialog').evaluate(element => ({ scrollHeight: element.scrollHeight, clientHeight: element.clientHeight, scrollTop: element.scrollTop })) });
      }
    }
  }
  await writeFile(`${directory}/observations.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); await server.close(); }
