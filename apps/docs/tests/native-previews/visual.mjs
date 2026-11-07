import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { exercise } from './scenarios.mjs';
import { READY, scenarioKey } from './row.mjs';

/**
 * Audit captures at 1440×1000 and 390×1000: page top, preview area (initial) and preview
 * area at the changed state. Automated assertions here only guard against obviously broken
 * captures; the screenshots still require human/agent visual inspection.
 */
export async function captureVisual({ browser, browserName, origin, entry, evidence, site, acceptance }) {
  const out = { framework: entry.framework, componentId: entry.componentId, exampleId: entry.exampleId, browser: browserName, screenshots: {}, status: 'failed' };
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const shot = async (name, fn) => {
      const path = resolve(evidence, 'visual', browserName, entry.framework, `${entry.componentId}-${width}-${name}.png`);
      await mkdir(dirname(path), { recursive: true });
      await fn(path);
      out.screenshots[`${width}-${name}`] = relative(site, path);
    };
    try {
      await page.goto(`${origin}/krds/components/${entry.componentId}.html?framework=${entry.framework}&example=${entry.exampleId}`);
      await page.waitForFunction(() => document.querySelector('[data-docs-ready]')?.dataset.docsReady === 'true');
      await page.locator('.native-demo').scrollIntoViewIfNeeded();
      await page.locator('.native-demo-status').filter({ hasText: READY }).waitFor({ timeout: 20000 });
      const frame = await (await page.locator('.native-demo iframe').elementHandle()).contentFrame();
      await frame.waitForSelector('[data-preview-return]');
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(100);
      await shot('top', path => page.screenshot({ path }));
      const preview = async () => { await page.locator('.native-demo').evaluate(n => n.scrollIntoView({ block: 'start' })); await page.waitForTimeout(100); };
      await preview();
      await shot('preview', path => page.screenshot({ path }));
      // Result first, source below it.
      const [frameBox, sourceBox] = await Promise.all([page.locator('.native-demo-frame').boundingBox(), page.locator('.native-demo-source').boundingBox()]);
      assert.ok(frameBox && sourceBox && frameBox.y < sourceBox.y, 'result precedes source');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `no horizontal overflow at ${width}`);
      let captured = false;
      // Same acceptance hooks as the matrix row: inventory-driven scenarios (Image) need the item.
      await exercise(frame, scenarioKey(entry), { acceptance: acceptance?.get(entry.acceptanceId), shot: async name => { await preview(); await shot(`preview-${name}`, path => page.screenshot({ path })); }, changed: async () => { await preview(); await shot('preview-changed', path => page.screenshot({ path })); captured = true; } });
      if (!captured) { await preview(); await shot('preview-changed', path => page.screenshot({ path })); }
      // End state of the scenario (Modal closed with focus returned, FileUpload removed, …).
      await preview(); await shot('preview-after', path => page.screenshot({ path }));
      assert.deepEqual(errors, [], 'page errors');
    } catch (error) {
      out.error = `${width}: ${String(error?.message ?? error).split('\n')[0]}`;
      await context.close();
      return out;
    }
    await context.close();
  }
  out.status = 'passed';
  return out;
}

/** Docs page at 200 % text and 1280×1000: top and preview area (the earlier page-overflow finding). */
export async function captureText200({ browser, browserName, origin, framework, componentId, evidence, site }) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
  const page = await context.newPage();
  const out = { framework, componentId, browser: browserName, screenshots: {} };
  try {
    await page.goto(`${origin}/krds/components/${componentId}.html?framework=${framework}`);
    await page.waitForFunction(() => document.querySelector('[data-docs-ready]')?.dataset.docsReady === 'true');
    await page.locator('.native-demo').scrollIntoViewIfNeeded();
    await page.locator('.native-demo-status').filter({ hasText: READY }).waitFor({ timeout: 20000 });
    await page.addStyleTag({ content: 'html {font-size:200% !important}' });
    for (const [name, scroll] of [['top', () => page.evaluate(() => scrollTo(0, 0))], ['preview', () => page.locator('.native-demo').evaluate(n => n.scrollIntoView({ block: 'start' }))]]) {
      await scroll(); await page.waitForTimeout(150);
      const path = resolve(evidence, 'visual', browserName, framework, `${componentId}-1280-text-200-${name}.png`); await mkdir(dirname(path), { recursive: true });
      await page.screenshot({ path }); out.screenshots[name] = relative(site, path);
    }
    out.pageOverflowPx = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    out.overflowing = await page.evaluate(() => { const all = [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1); return all.filter(e => !all.includes(e.parentElement)).slice(0, 6).map(e => `${e.tagName.toLowerCase()}${e.className ? '.' + String(e.className).split(' ')[0] : ''}`); });
    out.status = 'captured';
  } catch (error) { out.status = 'failed'; out.error = String(error?.message ?? error).split('\n')[0]; }
  await context.close();
  return out;
}
