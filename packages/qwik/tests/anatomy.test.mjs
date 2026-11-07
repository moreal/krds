import '../../../tools/testing/browser-cache-preload.mjs';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { chromium, webkit } from 'playwright';

// Native Qwik SSR + qwikloader resume of FileUpload/TutorialPanel anatomy (KRDS component.css 2943-2953, component_09_04, component_08_02).
const config = resolve(import.meta.dirname, 'anatomy/vite.config.mjs');
let out, render, server, origin, browser;
before(async () => {
  out = await mkdtemp(join(tmpdir(), 'krds-qwik-anatomy-'));
  process.env.KRDS_QWIK_ANATOMY_OUT = out;
  await build({ configFile: config });
  await build({ configFile: config, build: { ssr: resolve(import.meta.dirname, 'anatomy/entry.ssr.tsx') } });
  ({ render } = await import(pathToFileURL(join(out, 'server/entry.ssr.js')).href));
  server = createServer(async (request, response) => {
    const path = new URL(request.url, 'http://127.0.0.1').pathname;
    try {
      if (path.endsWith('.html')) { response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end((await render(path.slice(1, -5))).html); return; }
      if (path.includes('..')) { response.writeHead(403).end(); return; }
      response.writeHead(200, { 'content-type': extname(path) === '.js' ? 'text/javascript' : 'application/octet-stream' }).end(await readFile(join(out, 'client', path)));
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
});
after(async () => { await browser?.close(); await new Promise(done => server ? server.close(done) : done()); if (out) await rm(out, { recursive: true, force: true }); });

async function open(id) {
  const context = await browser.newContext({ locale: 'ko-KR', viewport: { width: 1000, height: 800 } }), page = await context.newPage();
  await page.goto(`${origin}/${id}.html`); await page.waitForLoadState('networkidle');
  return { page, close: () => context.close() };
}

test('FileUpload keeps one keyboard/AT file control: the visible picker opens the hidden native input', async () => {
  const { page, close } = await open('file-upload');
  try {
    const root = page.locator('[data-krds-component="file-upload"][data-krds-part="root"]');
    const facts = await root.evaluate(node => {
      const input = node.querySelector('[data-krds-part="file-input"]'), picker = node.querySelector('[data-krds-part="picker"]');
      const tabbable = [...node.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')].filter(element => element.tabIndex >= 0 && !element.disabled && !element.closest('[hidden]'));
      return { type: input.type, tabIndex: input.tabIndex, hidden: input.getAttribute('aria-hidden'), onlyPicker: tabbable.length === 1 && tabbable[0] === picker, pickerText: picker.textContent, name: picker.getAttribute('aria-labelledby').split(' ').map(id => document.getElementById(id)?.textContent), described: picker.getAttribute('aria-describedby').split(' ').map(id => document.getElementById(id)?.textContent), help: node.querySelector('[data-krds-part="help"]').textContent };
    });
    assert.deepEqual(facts, { type: 'file', tabIndex: -1, hidden: 'true', onlyPicker: true, pickerText: '파일 선택', name: ['파일 선택', '첨부 서류'], described: [facts.help], help: facts.help });
    await page.getByRole('button', { name: 'Before', exact: true }).focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-krds-part')), 'picker');
    for (const key of ['Enter', ' ']) {
      const chooser = page.waitForEvent('filechooser', { timeout: 5000 });
      await page.keyboard.press(key === ' ' ? 'Space' : key);
      await chooser;
    }
  } finally { await close(); }
});

test('TutorialPanel inner controls carry shared tab/start/step parts', async () => {
  const { page, close } = await open('tutorial-panel');
  try {
    const parts = await page.evaluate(() => Object.fromEntries(['tab', 'start', 'step', 'task-toggle'].map(name => [name, [...document.querySelectorAll(`[data-krds-component="tutorial-panel"][data-krds-part="${name}"]`)].map(node => [node.tagName, node.getAttribute('role'), node.getAttribute('data-krds-state'), node.getAttribute('aria-current'), node.id || null])])));
    assert.deepEqual(parts.tab.map(([tag, role, state]) => [tag, role, state]), [['BUTTON', 'tab', ''], ['BUTTON', 'tab', 'selected']]);
    assert.deepEqual(parts.start.map(([tag, , , , id]) => [tag, id]), [['BUTTON', 'tutorial-start']]);
    assert.deepEqual(parts['task-toggle'].map(([tag]) => tag), ['SUMMARY']);
    assert.equal(await page.evaluate(() => document.querySelector('[data-krds-component="tutorial-panel"][data-krds-part="task-toggle"]').parentElement.open), true);
    assert.deepEqual(parts.step.map(([tag, , state, current]) => [tag, state, current]), [['BUTTON', '', null], ['BUTTON', 'current', 'step']]);
  } finally { await close(); }
});

const listedTasks = page => page.evaluate(() => [...document.querySelectorAll('[data-krds-component="tutorial-panel"][data-krds-part="task-list"] [data-krds-part="task-toggle"]')].map(node => node.textContent.trim()));
const backCount = page => page.locator('[data-krds-component="tutorial-panel"][data-krds-part="back"]').count();

test('TutorialPanel overview lists every task without back, including a selected task without a step', async () => {
  for (const id of ['tutorial-overview', 'tutorial-no-step']) {
    const { page, close } = await open(id);
    try {
      assert.deepEqual(await listedTasks(page), ['예제 신청하기', '신청 내역 확인'], id);
      assert.equal(await backCount(page), 0, id);
    } finally { await close(); }
  }
});

test('TutorialPanel task view lists only the active task; the first resumed back click requests the overview', async () => {
  const { page, close } = await open('tutorial-task-view');
  try {
    assert.deepEqual(await listedTasks(page), ['예제 신청하기']);
    assert.deepEqual(await page.locator('[data-krds-component="tutorial-panel"][data-krds-part="back"]').allTextContents(), ['작업 목록']);
    await page.locator('[data-krds-component="tutorial-panel"][data-krds-part="back"]').click();
    await page.waitForFunction(() => document.getElementById('task-changes')?.textContent === 'null');
    assert.deepEqual(await listedTasks(page), ['예제 신청하기', '신청 내역 확인']);
    assert.equal(await backCount(page), 0);
  } finally { await close(); }
});

test('BottomSheet is a bottom-anchored surface above the modal backdrop: hit-testing each sheet control returns that control (Chromium and WebKit)', async () => {
  const css = resolve(import.meta.dirname, '../../styles/dist/all.css');
  for (const engine of [chromium, webkit]) {
    const engineBrowser = engine === chromium ? browser : await webkit.launch();
    const context = await engineBrowser.newContext({ locale: 'ko-KR', viewport: { width: 390, height: 700 } }), page = await context.newPage();
    try {
      await page.goto(`${origin}/bottom-sheet-stacking.html`); await page.waitForLoadState('networkidle'); await page.addStyleTag({ path: css });
      const surface = await page.evaluate(() => { const box = document.querySelector('[role="dialog"][aria-modal="true"]').getBoundingClientRect(); return { bottom: Math.round(box.bottom), left: Math.round(box.left), width: Math.round(box.width) }; });
      assert.deepEqual(surface, { bottom: 700, left: 0, width: 390 }, `${engine.name()}: the sheet surface is anchored to the viewport bottom edge at full width`);
      const misses = await page.evaluate(() => {
        const controls = [...document.querySelectorAll('input[name="region"]'), ...[...document.querySelectorAll('input[name="region"]')].map(input => input.closest('label')), [...document.querySelectorAll('button')].find(node => node.textContent === '적용'), document.querySelector('[data-krds-component="bottom-sheet"][data-krds-part="close"]')];
        return controls.flatMap(control => { control.scrollIntoView({ block: 'nearest' }); const box = control.getBoundingClientRect(), hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2); return hit === control || control.contains(hit) ? [] : [`${control.outerHTML.slice(0, 50)} -> ${hit?.outerHTML.slice(0, 80)}`]; });
      });
      assert.deepEqual(misses, [], engine.name());
    } finally { await context.close(); if (engineBrowser !== browser) await engineBrowser.close(); }
  }
});

test('BottomSheet follows the shared sheet anatomy order: handle, then header (title, close), then body; the handle carries no text (Chromium and WebKit)', async () => {
  for (const engine of [chromium, webkit]) {
  const engineBrowser = engine === chromium ? browser : await webkit.launch();
  const context = await engineBrowser.newContext({ locale: 'ko-KR', viewport: { width: 390, height: 700 } }), page = await context.newPage();
  try {
    await page.goto(`${origin}/bottom-sheet-stacking.html`); await page.waitForLoadState('networkidle'); await page.addStyleTag({ path: resolve(import.meta.dirname, '../../styles/dist/all.css') });
    const facts = await page.evaluate(() => {
      const sheet = name => document.querySelector(`[data-krds-component="bottom-sheet"][data-krds-part="${name}"]`), dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      const handle = sheet('handle').getBoundingClientRect(), box = dialog.getBoundingClientRect();
      return {
        order: [...dialog.querySelectorAll('[data-krds-part="handle"],[data-krds-part="header"],[data-krds-part="title"],[data-krds-part="close"],[data-krds-part="body"][data-krds-component="bottom-sheet"]')].map(node => node.getAttribute('data-krds-part')),
        inHeader: [sheet('title').parentElement === sheet('header'), sheet('close').parentElement === sheet('header')],
        headings: dialog.querySelectorAll('h2').length,
        labelled: document.getElementById(dialog.getAttribute('aria-labelledby')) === sheet('title'),
        described: document.getElementById(dialog.getAttribute('aria-describedby'))?.textContent,
        handleText: sheet('handle').textContent, handleName: sheet('handle').getAttribute('aria-label'),
        centred: Math.abs((handle.left + handle.right) / 2 - (box.left + box.right) / 2) < 2,
      };
    });
    assert.deepEqual(facts, { order: ['handle', 'header', 'title', 'close', 'body'], inHeader: [true, true], headings: 1, labelled: true, described: '한 곳을 고르세요', handleText: '', handleName: '시트 닫기', centred: true }, engine.name());
  } finally { await context.close(); if (engineBrowser !== browser) await engineBrowser.close(); }
  }
});

test('a public Modal nested in the sheet body keeps its own title: the owned heading is keyed to the sheet title id only (Chromium and WebKit)', async () => {
  for (const engine of [chromium, webkit]) {
    const engineBrowser = engine === chromium ? browser : await webkit.launch();
    const context = await engineBrowser.newContext({ locale: 'ko-KR', viewport: { width: 390, height: 700 } }), page = await context.newPage();
    try {
      await page.goto(`${origin}/bottom-sheet-nested-modal.html`); await page.waitForLoadState('networkidle');
      const facts = await page.evaluate(() => { const inner = [...document.querySelectorAll('[role="dialog"][aria-modal="true"]')].find(dialog => dialog.getAttribute('aria-labelledby') === 'inner-title'); return [inner?.querySelectorAll('h2').length, document.getElementById('inner-title')?.textContent, document.getElementById('inner-description')?.textContent, document.getElementById('inner-title')?.getAttribute('data-krds-component')]; });
      assert.deepEqual(facts, [1, '정말 닫을까요?', '선택이 사라집니다', 'modal'], engine.name());
    } finally { await context.close(); if (engineBrowser !== browser) await engineBrowser.close(); }
  }
});

test('a public Modal nested in the sheet body dismisses without reporting its cause to the sheet (Chromium and WebKit)', async () => {
  for (const engine of [chromium, webkit]) {
    const engineBrowser = engine === chromium ? browser : await webkit.launch();
    const context = await engineBrowser.newContext({ locale: 'ko-KR', viewport: { width: 390, height: 700 } }), page = await context.newPage();
    try {
      await page.goto(`${origin}/bottom-sheet-nested-dismiss.html`); await page.waitForLoadState('networkidle'); await page.addStyleTag({ path: resolve(import.meta.dirname, '../../styles/dist/all.css') });
      const inner = page.locator('[role="dialog"][aria-labelledby="inner-title"]');
      await page.getByRole('button', { name: '내부 동작' }).focus();
      await page.mouse.click(4, 4);
      await inner.waitFor({ state: 'detached' });
      assert.equal(await page.locator('#sheet-requests').textContent(), '|0', `${engine.name()}: the nested outside dismissal never reaches the sheet`);
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.getElementById('sheet-requests')?.textContent !== '|0');
      assert.equal(await page.locator('#sheet-requests').textContent(), 'escape|1', `${engine.name()}: the sheet still reports its own Escape`);
    } finally { await context.close(); if (engineBrowser !== browser) await engineBrowser.close(); }
  }
});
