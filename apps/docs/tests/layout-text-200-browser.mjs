// Docs shell layout at enlarged text: the reading column, the native demo
// selector and long code samples stay usable without page-level horizontal
// overflow. Root text 200 % matches the Task 7 visual gate (rem = 32 px).
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium, webkit } from '@playwright/test';

const site = resolve(import.meta.dirname, '..'), dist = resolve(site, 'dist');
const evidence = resolve(site, 'test-results/layout-text-200', process.env.LAYOUT_EVIDENCE_LABEL ?? 'current');
const engines = (process.env.LAYOUT_BROWSERS ?? 'chromium,webkit').split(',');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname; if (!path.startsWith('/krds/')) throw Error('base');
    let file = resolve(dist, '.' + path.slice(5)); if (path.endsWith('/')) file = resolve(file, 'index.html');
    if (!file.startsWith(dist + '/')) throw Error('path');
    res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream'); res.end(await readFile(file));
  } catch { res.statusCode = 404; res.end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
await mkdir(evidence, { recursive: true });

// Pages with a native demo, a long reference table and long source lines.
const pages = ['components/button.html?framework=react', 'components/accordion.html?framework=react'];
const widths = [1280, 1024, 768, 390, 320];
// 150 % exercises the container thresholds between default and 200 % text.
const texts = ['100', '150', '200'];
const failures = [];
const check = (label, fn) => { try { fn(); } catch (error) { failures.push(`${label}: ${error.message.split('\n')[0]}`); } };

async function measure(page) {
  return page.evaluate(() => {
    const box = selector => { const node = document.querySelector(selector); return node ? node.getBoundingClientRect() : null; };
    const code = document.querySelector('.native-demo-source .docs-code pre');
    const codeStyle = code && getComputedStyle(code);
    const select = document.querySelector('.native-demo-toolbar select');
    const frame = box('.native-demo-frame');
    const offenders = [...document.querySelectorAll('body *')].filter(node => node.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(node).position !== 'fixed');
    return {
      innerWidth, scrollWidth: document.documentElement.scrollWidth, root: getComputedStyle(document.documentElement).fontSize,
      main: box('#docs-main')?.width ?? 0, selector: select?.getBoundingClientRect().width ?? 0,
      code: code && { scrollWidth: code.scrollWidth, clientWidth: code.clientWidth, overflowX: codeStyle.overflowX, tabIndex: code.tabIndex, label: code.getAttribute('aria-label') ?? '', backgroundImage: codeStyle.backgroundImage, backgroundAttachment: codeStyle.backgroundAttachment, top: code.getBoundingClientRect().top },
      frameBottom: frame?.bottom ?? null,
      // Lines spanned by the widest word of "코드 복사": 1 means no word is broken.
      copyLines: (() => { const button = [...document.querySelectorAll('.native-demo-source .docs-code-actions button')].find(node => node.textContent.trim() === '코드 복사'); if (!button) return -1; const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT); let node, worst = 0; while ((node = walker.nextNode())) for (const match of node.textContent.matchAll(/\S+/g)) { const lines = new Set(); for (let i = match.index; i < match.index + match[0].length; i++) { const range = document.createRange(); range.setStart(node, i); range.setEnd(node, i + 1); const rect = range.getBoundingClientRect(); if (rect.width) lines.add(Math.round(rect.top)); } worst = Math.max(worst, lines.size); } return worst; })(),
      source: (() => { const section = document.querySelector('.native-demo-source'), sourceSelect = section?.querySelector('select'), path = section?.querySelector('.native-demo-path'); return section && { section: section.getBoundingClientRect().width, select: sourceSelect?.getBoundingClientRect().width ?? 0, firstLabel: sourceSelect?.selectedOptions[0]?.textContent ?? '', value: sourceSelect?.value ?? '', pathText: path?.textContent ?? '', pathClipped: path ? path.scrollWidth > path.clientWidth + 1 : true }; })(),
      offenders: offenders.filter(node => !offenders.includes(node.parentElement)).slice(0, 6).map(node => `${node.tagName.toLowerCase()}.${String(node.className).split(' ')[0]}[${node.getAttribute('data-krds-part') ?? ''}]`),
    };
  });
}

async function interact(page, label, name) {
  // Collapsed sidebar is reachable through the section control, which opens and closes.
  const trigger = page.locator('#docs-section-trigger');
  await page.evaluate(() => scrollTo(0, 0));
  if (!(await trigger.isVisible())) { failures.push(`${label}: 문서 메뉴 control not visible`); return; }
  await trigger.click();
  try { await page.locator('#docs-section-dialog').waitFor({ state: 'visible', timeout: 5000 }); } catch { failures.push(`${label}: 문서 메뉴 dialog did not open`); return; }
  if (!(await page.locator('#docs-section-dialog a[aria-current="page"]').count())) failures.push(`${label}: section dialog lacks current page link`);
  await page.keyboard.press('Escape');
  try { await page.locator('#docs-section-dialog').waitFor({ state: 'hidden', timeout: 5000 }); } catch { failures.push(`${label}: 문서 메뉴 dialog did not close`); return; }
  const returned = await page.evaluate(() => document.activeElement?.id);
  check(`${label} focus returns to 문서 메뉴 (${returned})`, () => assert.equal(returned, 'docs-section-trigger'));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  check(`${label} no overflow after section dialog ${overflow}px`, () => assert.ok(overflow <= 1));
  // Real keyboard: Tab from the copy button reaches the scrollable code region with a visible outline.
  const copy = page.locator('.native-demo-source .docs-code-actions button').first();
  await copy.focus(); await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => { const node = document.activeElement; return { tag: node?.tagName, inSource: !!node?.closest('.native-demo-source'), outline: node ? getComputedStyle(node).outlineStyle : 'none' }; });
  check(`${label} Tab reaches code region ${JSON.stringify(focus)}`, () => { assert.equal(focus.tag, 'PRE'); assert.ok(focus.inSource); assert.notEqual(focus.outline, 'none'); });
  // Forced colors: system Canvas background and a CanvasText edge on the clipped side.
  await page.emulateMedia({ forcedColors: 'active' });
  const forced = await page.evaluate(async () => { const pre = document.querySelector('.native-demo-source .docs-code pre'); pre.scrollLeft = 0; await new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))); const style = getComputedStyle(pre); return { timeline: CSS.supports('animation-timeline: scroll()'), active: matchMedia('(forced-colors: active)').matches, overflow: pre.scrollWidth > pre.clientWidth, image: style.backgroundImage, start: parseFloat(style.borderInlineStartWidth), end: parseFloat(style.borderInlineEndWidth), endColor: style.borderInlineEndColor, endStyle: style.borderInlineEndStyle }; });
  if (forced.active && forced.overflow) check(`${label} forced-colors edge cue ${JSON.stringify(forced)}`, () => { assert.match(forced.image, /^none(, none)*$/); assert.ok(forced.end > 0); assert.equal(forced.endStyle, 'solid'); if (forced.timeline) assert.equal(forced.start, 0, 'unclipped start edge has no cue'); });
  if (forced.active) await page.locator('.native-demo-source .docs-code').evaluate(node => node.scrollIntoView({ block: 'center' }));
  if (forced.active) await page.screenshot({ path: resolve(evidence, `${name}-${label.includes('button') ? 'button' : 'accordion'}-${label.split(' ').slice(-2).join('-')}-forced-colors-source.png`) });
  await page.emulateMedia({ forcedColors: 'none' });
}

try {
  for (const name of engines) {
    const browser = await ({ chromium, webkit })[name].launch({ headless: true });
    try {
      for (const path of pages) for (const text of texts) for (const width of widths) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
        await page.goto(`${origin}/krds/${path}`, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => document.querySelector('[data-docs-ready]')?.dataset.docsReady === 'true');
        if (text !== '100') await page.addStyleTag({ content: `html{font-size:${text}% !important}` });
        await page.waitForTimeout(100);
        const state = await measure(page), label = `${name} ${path} text-${text} ${width}`;
        check(`${label} page overflow ${state.scrollWidth - state.innerWidth}px ${JSON.stringify(state.offenders)}`, () => assert.ok(state.scrollWidth <= state.innerWidth + 1));
        if (text === '200' && width === 1280) {
          check(`${label} main column ${Math.round(state.main)}px`, () => assert.ok(state.main >= 480));
          check(`${label} framework selector ${Math.round(state.selector)}px`, () => assert.ok(state.selector >= 200));
        }
        check(`${label} code sample present`, () => assert.ok(state.code));
        if (state.code) {
          const { code } = state;
          check(`${label} code keyboard scroll container`, () => { assert.equal(code.tabIndex, 0); assert.ok(code.label.length > 0); });
          if (code.scrollWidth > code.clientWidth) {
            check(`${label} overflowing code scrolls itself (${code.overflowX})`, () => assert.ok(['auto', 'scroll'].includes(code.overflowX)));
            check(`${label} overflowing code shows a scroll cue`, () => { assert.match(code.backgroundImage, /gradient/); assert.match(code.backgroundAttachment, /local/); });
          }
          check(`${label} copy label word broken across ${state.copyLines} lines`, () => assert.equal(state.copyLines, 1));
          check(`${label} source path readable`, () => { const source = state.source; assert.ok(source); assert.ok(source.select >= source.section - 1); assert.ok(source.firstLabel.startsWith(source.value.split('/').at(-1))); assert.equal(source.pathText, source.value); assert.equal(source.pathClipped, false); });
          if (width <= 390) check(`${label} preview frame stays above the code`, () => assert.ok(state.frameBottom !== null && state.frameBottom <= code.top));
        }
        if (text === '200' && (width === 1280 || width === 320)) await interact(page, label, name);
        if (path === pages[0] && (width === 1280 || width === 320) && text !== '150') {
          await page.screenshot({ path: resolve(evidence, `${name}-button-text-${text}-${width}.png`) });
          await page.locator('.native-demo').evaluate(node => node.scrollIntoView({ block: 'start' }));
          await page.screenshot({ path: resolve(evidence, `${name}-button-text-${text}-${width}-demo.png`) });
          await page.locator('.native-demo-source').evaluate(node => node.scrollIntoView({ block: 'start' }));
          await page.screenshot({ path: resolve(evidence, `${name}-button-text-${text}-${width}-source.png`) });
        }
        await context.close();
      }
    } finally { await browser.close(); }
  }
} finally { server.close(); }

if (failures.length) { console.error(failures.join('\n')); console.error(`layout-text-200: ${failures.length} failing assertion(s)`); process.exit(1); }
console.log(`layout-text-200: ${engines.join('+')} ${pages.length} pages x ${texts.length} text sizes x ${widths.length} widths passed; evidence ${evidence}`);
