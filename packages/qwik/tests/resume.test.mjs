import '../../../tools/testing/browser-cache-preload.mjs';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { build } from 'vite';
import { pathToFileURL } from 'node:url';
import { chromium, webkit } from 'playwright';

// Resumed-SSR behaviour of package sources: production optimizer client + SSR builds, paused HTML, qwikloader resume.
const config = resolve(import.meta.dirname, 'resume/vite.config.mjs');
let out, server, origin, browser;
before(async () => {
  out = await mkdtemp(join(tmpdir(), 'krds-qwik-resume-'));
  process.env.KRDS_QWIK_RESUME_OUT = out;
  await build({ configFile: config, mode: process.env.KRDS_DEV_BUILD ? 'development' : undefined });
  await build({ configFile: config, mode: process.env.KRDS_DEV_BUILD ? 'development' : undefined, build: { ssr: resolve(import.meta.dirname, 'resume/entry.ssr.tsx') } });
  const { render } = await import(pathToFileURL(join(out, 'server/entry.ssr.js')).href);
  server = createServer(async (request, response) => {
    const path = new URL(request.url, 'http://127.0.0.1').pathname;
    try {
      if (path.endsWith('.html')) {
        const html = (await render(path.slice(1, -5))).html, split = new URL(request.url, 'http://127.0.0.1').searchParams.has('stall') ? html.indexOf('</figure>') + 9 : -1;
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        // `?stall` holds the rest of the document (including qwikloader) so resources above it settle while the container is still paused.
        if (split > 8) { response.write(html.slice(0, split)); await new Promise(done => setTimeout(done, 700)); }
        response.end(split > 8 ? html.slice(split) : html); return;
      }
      if (path.includes('..')) { response.writeHead(403).end(); return; }
      response.writeHead(200, { 'content-type': extname(path) === '.js' ? 'text/javascript' : 'application/octet-stream' }).end(await readFile(join(out, 'client', path)));
    } catch { if (!response.headersSent) response.writeHead(404); response.end(); }
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
});
after(async () => { await browser?.close(); await new Promise(done => server ? server.close(done) : done()); if (out) await rm(out, { recursive: true, force: true }); });

async function open(id, { clock = false, reducedMotion = 'reduce' } = {}) {
  const context = await browser.newContext({ locale: 'ko-KR', reducedMotion, viewport: { width: 1000, height: 800 } }), page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(String(error))); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  if (clock) await page.clock.install();
  const response = await page.goto(`${origin}/${id}.html`);
  assert.match(await response.text(), /q:container="paused"/);
  await page.waitForLoadState('networkidle');
  return { page, errors, close: () => context.close() };
}
const poll = async (read, expected, label) => { let value; for (let i = 0; i < 150; i++) { value = await read(); if (value === expected) return; await new Promise(done => setTimeout(done, 20)); } assert.equal(value, expected, label); };

test('Carousel: after a timer advance, focus entry pauses with a 재생 label, leaving keeps it paused, keyboard Play resumes without a duplicate callback', async () => {
  const { page, errors, close } = await open('carousel', { clock: true, reducedMotion: 'no-preference' });
  try {
    const part = name => page.locator(`[data-krds-component="carousel"][data-krds-part="${name}"]`), play = part('play-pause'), root = part('root');
    const position = () => part('position').textContent().then(text => text.replace(/\s+/g, ' ').trim()), requests = () => page.locator('#requests').textContent();
    await poll(() => play.textContent(), '정지', 'resumed autoplay label');
    await page.clock.fastForward(6100);
    await poll(position, '2 / 3', 'timer advance');
    await page.keyboard.press('Tab');
    assert.equal(await play.evaluate(node => node === document.activeElement), true, 'Tab enters the play/pause control');
    await page.clock.runFor(100);
    await poll(() => root.getAttribute('data-krds-state'), 'paused', 'focus entry pauses');
    await poll(() => play.textContent(), '재생', 'play/pause label after focus pause');
    for (let i = 0; i < 6 && await root.evaluate(node => node.contains(document.activeElement)); i++) await page.keyboard.press('Tab');
    assert.equal(await root.evaluate(node => node.contains(document.activeElement)), false, 'focus left the carousel');
    await page.clock.fastForward(6500);
    assert.equal(await position(), '2 / 3', 'leaving does not restart');
    assert.equal(await requests(), '0', 'no passive playback callbacks');
    await play.focus(); await page.keyboard.press('Enter'); await page.clock.runFor(100);
    await poll(() => play.textContent(), '정지', 'keyboard Play resumes');
    assert.equal(await requests(), '0', 'no same-intent duplicate callback');
    await page.clock.fastForward(6100);
    await poll(position, '3 / 3', 'position keeps updating after resumed advance');
    await new Promise(done => setTimeout(done, 100));
    assert.equal(await requests(), '0', 'still no same-intent callback after resumed advancement');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('TutorialPanel: the stop action stays available after the running tutorial moves to the next step', async () => {
  const { page, errors, close } = await open('tutorial-panel');
  try {
    const stop = page.getByRole('button', { name: '따라하기 중지', exact: true }), status = () => page.locator('#tutorial-status').textContent();
    assert.equal(await stop.count(), 0, 'no stop action before start');
    await page.getByRole('button', { name: '따라하기 시작', exact: true }).click();
    await poll(status, '진행 중: name', 'start commits the first step');
    await poll(() => stop.count(), 1, 'stop action presented after start');
    await page.locator('[data-krds-component="tutorial-panel"][data-krds-part="step-list"]').getByRole('button', { name: '신청 저장', exact: true }).click();
    await poll(status, '진행 중: save', 'step change');
    await poll(() => stop.count(), 1, 'stop action still presented on the next step');
    await stop.click();
    await poll(status, '중지됨', 'stop');
    await poll(() => page.evaluate(() => document.activeElement?.id), 'tutorial-start', 'focus returns to the start action');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

/** Paused page whose QRL chunks arrive late: interaction starts before any lazily imported handler can run. */
async function openDelayed(id, delay = 300) {
  const context = await browser.newContext({ locale: 'ko-KR', reducedMotion: 'reduce', viewport: { width: 1000, height: 800 } }), page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(String(error))); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.route(url => new URL(url).pathname.startsWith('/build/'), async route => { await new Promise(done => setTimeout(done, delay)); await route.fallback(); });
  await page.goto(`${origin}/${id}.html`, { waitUntil: 'domcontentloaded' });
  return { page, errors, close: () => context.close() };
}
const settled = async page => { await page.waitForLoadState('networkidle'); await page.evaluate(() => new Promise(done => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(done)), 150))); };
const control = (page, name) => page.locator(`[data-krds-component="${name}"][data-krds-part="control"]`);
const root = (page, name) => page.locator(`[data-krds-component="${name}"][data-krds-part="root"]`);
const runs = 4;

test('Image: an error that fires before resumption is still recorded, keeping alt and the reserved box', async () => {
  const context = await browser.newContext({ locale: 'ko-KR' }), page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  try {
    await page.addInitScript(() => addEventListener('error', event => { if (event.target instanceof HTMLImageElement) window.__krdsImageErrorBeforeLoader ??= !window.qwikevents?.events?.has?.('error'); }, true));
    await page.goto(`${origin}/image.html?stall`, { waitUntil: 'load' });
    assert.equal(await page.evaluate(() => window.__krdsImageErrorBeforeLoader), true, 'the native error preceded qwikloader\'s error listener');
    const image = page.locator('img[data-krds-component="image"]').first(), figure = page.locator('figure[data-krds-component="image"]').first();
    await poll(() => image.getAttribute('data-krds-state'), 'error', 'image records the early error');
    await poll(() => figure.getAttribute('data-krds-state'), 'error', 'figure records the early error');
    assert.equal(await image.getAttribute('alt'), '불러오지 못한 안내 이미지');
    assert.deepEqual([await image.getAttribute('width'), await image.getAttribute('height')], ['320', '180']);
    // KRDS error alternative (same description part and text as the React, Vue and Angular adapters); a loaded image has none.
    await poll(() => figure.locator('[data-krds-component="image"][data-krds-part="description"]').textContent(), '이미지를 불러올 수 없습니다.', 'error alternative shown');
    const loaded = page.locator('figure[data-krds-component="image"]').nth(1);
    await poll(() => loaded.locator('img').getAttribute('data-krds-state'), 'loaded', 'second image loaded');
    assert.equal(await loaded.locator('[data-krds-part="description"]').count(), 0, 'no error alternative for a loaded image');
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});

for (const [name, text] of [['text-input', '홍길동abcdef'], ['textarea', '안녕하세요 abcdef']]) {
  test(`${name}: text typed immediately after load is kept while handlers are still loading`, async () => {
    for (let run = 0; run < runs; run++) {
      const { page, errors, close } = await openDelayed('fields');
      try {
        await control(page, name).focus();
        await page.keyboard.type(text, { delay: 35 });
        await settled(page);
        assert.equal(await control(page, name).inputValue(), text, `run ${run}: native text survives late handlers`);
        await page.keyboard.type('!');
        await settled(page);
        assert.equal(await control(page, name).inputValue(), `${text}!`, `run ${run}: later typing commits`);
        assert.deepEqual(errors, []);
      } finally { await close(); }
    }
  });
}

test('range-slider: arrow steps taken immediately after load are not rolled back', async () => {
  for (let run = 0; run < runs; run++) {
    const { page, errors, close } = await openDelayed('fields');
    try {
      await control(page, 'range-slider').focus();
      for (let i = 0; i < 6; i++) { await page.keyboard.press('ArrowRight'); await new Promise(done => setTimeout(done, 40)); }
      await settled(page);
      assert.equal(await control(page, 'range-slider').inputValue(), '60', `run ${run}: native steps survive`);
      assert.equal(await page.locator('[data-krds-component="range-slider"][data-krds-part="output"]').textContent(), '60', `run ${run}: committed value`);
      assert.deepEqual(errors, []);
    } finally { await close(); }
  }
});

for (const name of ['checkbox', 'switch']) {
  test(`${name}: rapid toggles immediately after load do not flip back`, async () => {
    for (let run = 0; run < runs; run++) {
      const { page, errors, close } = await openDelayed('fields');
      try {
        for (let i = 0; i < 5; i++) { await control(page, name).click(); await new Promise(done => setTimeout(done, 45)); }
        await settled(page);
        assert.equal(await control(page, name).isChecked(), true, `run ${run}: five toggles end checked`);
        assert.match(await root(page, name).getAttribute('data-krds-state'), /\bchecked\b/, `run ${run}: committed checked state`);
        assert.deepEqual(errors, []);
      } finally { await close(); }
    }
  });
}

test('controlled fields: rejected requests still restore the committed value, also when made before handlers load', async () => {
  const resumed = await open('controlled-fields');
  try {
    const { page } = resumed, input = control(page, 'text-input');
    await input.focus(); await page.keyboard.press('End'); await page.keyboard.type('ab', { delay: 30 });
    await poll(() => page.locator('#controlled-text').textContent(), '가ab', 'accepted edits');
    await page.keyboard.type('1');
    await poll(() => input.inputValue(), '가ab', 'rejected digit restores the committed value');
    await control(page, 'checkbox').click(); await control(page, 'switch').click();
    await poll(() => control(page, 'checkbox').isChecked(), false, 'rejected checkbox restores');
    await poll(() => control(page, 'switch').isChecked(), false, 'rejected switch restores');
    assert.deepEqual(resumed.errors, []);
  } finally { await resumed.close(); }
  const { page, errors, close } = await openDelayed('controlled-fields');
  try {
    await control(page, 'text-input').focus(); await page.keyboard.press('End'); await page.keyboard.type('a1', { delay: 30 });
    await control(page, 'checkbox').click(); await control(page, 'switch').click();
    await settled(page);
    assert.equal(await control(page, 'text-input').inputValue(), '가a', 'early rejected digit restores the committed value');
    assert.equal(await page.locator('#controlled-text').textContent(), '가a');
    assert.equal(await control(page, 'checkbox').isChecked(), false, 'early rejected checkbox restores');
    assert.equal(await control(page, 'switch').isChecked(), false, 'early rejected switch restores');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('fields: form reset still forces the default back after resumed and early edits', async () => {
  const { page, errors, close } = await openDelayed('fields');
  try {
    await control(page, 'text-input').focus(); await page.keyboard.type('초기 입력', { delay: 30 });
    await control(page, 'checkbox').click(); await control(page, 'switch').click();
    await settled(page);
    assert.equal(await control(page, 'text-input').inputValue(), '초기 입력');
    await control(page, 'range-slider').focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
    await control(page, 'textarea').fill('내용 입력');
    await settled(page);
    await page.locator('#fields-reset').click();
    await settled(page);
    for (const name of ['text-input', 'textarea']) assert.equal(await control(page, name).inputValue(), '', `${name} reset`);
    assert.equal(await control(page, 'range-slider').inputValue(), '0', 'range reset');
    assert.equal(await control(page, 'checkbox').isChecked(), false, 'checkbox reset');
    assert.equal(await control(page, 'switch').isChecked(), false, 'switch reset');
    await control(page, 'text-input').focus(); await page.keyboard.type('다시');
    await control(page, 'checkbox').click();
    await settled(page);
    assert.equal(await control(page, 'text-input').inputValue(), '다시', 'edits after reset are not blocked');
    assert.equal(await control(page, 'checkbox').isChecked(), true, 'toggles after reset are not blocked');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('text-input: IME composition started before handlers load commits the composed text', async () => {
  for (let run = 0; run < 2; run++) {
    const { page, errors, close } = await openDelayed('fields');
    try {
      const cdp = await page.context().newCDPSession(page);
      await control(page, 'text-input').focus();
      await page.keyboard.type('ab');
      for (const text of ['ㅎ', '하', '한']) await cdp.send('Input.imeSetComposition', { text, selectionStart: text.length, selectionEnd: text.length });
      await cdp.send('Input.insertText', { text: '한' });
      await page.keyboard.type('c', { delay: 30 });
      await settled(page);
      assert.equal(await control(page, 'text-input').inputValue(), 'ab한c', `run ${run}: composed text survives`);
      await page.keyboard.type('d');
      await settled(page);
      assert.equal(await control(page, 'text-input').inputValue(), 'ab한cd', `run ${run}: later typing commits`);
      assert.deepEqual(errors, []);
    } finally { await close(); }
  }
});

// Latent signal-text freeze check: each scenario forces at least two host re-renders after resume before and while asserting.
const part = (page, component, name) => page.locator(`[data-krds-component="${component}"][data-krds-part="${name}"]`);
test('latent: Disclosure icon follows every toggle after resume', async () => {
  const { page, errors, close } = await open('latent-text');
  try {
    const trigger = part(page, 'disclosure', 'trigger'), icon = part(page, 'disclosure', 'icon');
    for (let i = 1; i <= 5; i++) {
      await trigger.click();
      const expanded = i % 2 === 1;
      await poll(() => trigger.getAttribute('aria-expanded'), String(expanded), `toggle ${i} expanded`);
      await poll(() => icon.textContent(), expanded ? '−' : '+', `toggle ${i} icon`);
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
test('latent: Textarea character count follows typing after resume', async () => {
  const { page, errors, close } = await open('latent-text');
  try {
    const count = () => page.locator('[data-krds-component="textarea"][data-krds-part="count"]').textContent().then(text => text.replace(/\s+/g, ' ').trim());
    await control(page, 'textarea').focus();
    for (const [i, char] of [...'가나다라마'].entries()) { await page.keyboard.type(char); await poll(count, `${i + 1} / 100`, `count after ${i + 1} characters`); }
    await page.keyboard.press('Backspace'); await poll(count, '4 / 100', 'count after delete');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
test('latent: RangeSlider value text follows every step after resume (with and without a host-rendered value text)', async () => {
  const { page, errors, close } = await open('latent-text');
  try {
    for (const [index, suffix] of [[0, ''], [1, '퍼센트']]) {
      const slider = page.locator('[data-krds-component="range-slider"][data-krds-part="root"]').nth(index), input = slider.locator('[data-krds-part="control"]'), output = slider.locator('[data-krds-part="output"]');
      await input.focus();
      for (let i = 1; i <= 4; i++) { await page.keyboard.press('ArrowRight'); await poll(() => output.textContent(), `${i * 10}${suffix}`, `slider ${index}: output after step ${i}`); }
      await page.keyboard.press('ArrowLeft'); await poll(() => output.textContent(), `30${suffix}`, `slider ${index}: output after step back`);
      if (suffix) assert.equal(await input.getAttribute('aria-valuetext'), '30퍼센트');
      assert.deepEqual(await input.evaluate(node => [node[Symbol.for('unofficial-krds.native-field-order')]?.length ?? 0, node[Symbol.for('unofficial-krds.native-field-input-order')]?.length ?? 0]), [0, 0], `slider ${index}: no retained native events`);
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
test('latent: Toast content follows every message update after resume', async () => {
  const { page, errors, close } = await open('latent-text');
  try {
    const message = part(page, 'toast', 'message');
    await poll(() => message.textContent(), '첫 번째 알림', 'initial toast');
    for (const [i, text] of ['두 번째 알림', '세 번째 알림', '네 번째 알림', '첫 번째 알림', '두 번째 알림'].entries()) { await page.locator('#toast-next').click(); await poll(() => message.textContent(), text, `toast update ${i + 1}`); }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
test('latent: CoachMark title, position and next label follow every step after resume', async () => {
  const { page, errors, close } = await open('latent-text');
  try {
    const title = part(page, 'coach-mark', 'title'), position = () => part(page, 'coach-mark', 'position').textContent().then(text => text.replace(/\s+/g, ' ').trim()), next = part(page, 'coach-mark', 'next'), previous = part(page, 'coach-mark', 'previous');
    const expect = async (t, p, n, label) => { await poll(() => title.textContent(), t, `${label} title`); await poll(position, p, `${label} position`); await poll(() => next.textContent(), n, `${label} next label`); };
    await expect('첫 단계', '1 / 3', '다음', 'initial');
    await next.click(); await expect('둘째 단계', '2 / 3', '다음', 'step 2');
    await next.click(); await expect('셋째 단계', '3 / 3', '마치기', 'step 3');
    await previous.click(); await expect('둘째 단계', '2 / 3', '다음', 'back to 2');
    await previous.click(); await expect('첫 단계', '1 / 3', '다음', 'back to 1');
    await next.click(); await expect('둘째 단계', '2 / 3', '다음', 'forward again');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
async function openNarrow(id) {
  const context = await browser.newContext({ locale: 'ko-KR', reducedMotion: 'reduce', viewport: { width: 375, height: 800 } }), page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(String(error))); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`${origin}/${id}.html`); await page.waitForLoadState('networkidle');
  return { page, errors, close: () => context.close() };
}
test('latent: InPageNavigation disclosure toggle label follows every toggle after resume', async () => {
  const { page, errors, close } = await openNarrow('latent-nav');
  try {
    const toggle = part(page, 'in-page-navigation', 'disclosure-trigger');
    await poll(() => toggle.count(), 1, 'narrow disclosure trigger');
    for (let i = 1; i <= 5; i++) {
      const before = await toggle.getAttribute('aria-expanded');
      await toggle.click();
      const expanded = before !== 'true';
      await poll(() => toggle.getAttribute('aria-expanded'), String(expanded), `toggle ${i} expanded`);
      await poll(() => toggle.textContent(), expanded ? '구성 접기' : '구성 펼치기', `toggle ${i} label`);
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});
test('latent: MainMenu drill title follows every drill after resume', async () => {
  const { page, errors, close } = await openNarrow('latent-menu');
  try {
    const menu = page.locator('[data-krds-component="main-menu"][data-krds-part="mobile-content"]'), title = part(page, 'main-menu', 'submenu-title');
    // Each drill round trip = four host re-renders with a changing title; afterwards the menu must be quiescent (no re-render loop).
    const mutations = () => page.evaluate(() => new Promise(done => { let count = 0; const observer = new MutationObserver(records => count += records.length); observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true }); setTimeout(() => { observer.disconnect(); done(count); }, 1000); }));
    const top = menu.locator('[data-krds-part="trigger"]').filter({ hasText: /^신청/ });
    for (let round = 1; round <= 2; round++) {
      // A drill round trip leaves the top-level branch expanded (drill state is separate from the expanded branch).
      if (await top.getAttribute('aria-expanded') !== 'true') await top.click();
      await poll(() => top.getAttribute('aria-expanded'), 'true', `round ${round}: top level expanded`);
      await poll(() => menu.getByRole('button', { name: /^새 신청/ }).count(), 1, `round ${round}: first level expanded`);
      assert.equal(await mutations(), 0, `round ${round}: no DOM churn after expanding`);
      await menu.getByRole('button', { name: /^새 신청/ }).click();
      await menu.getByRole('button', { name: new RegExp(`^${round === 1 ? '서류' : '문의'} 안내`) }).click();
      await poll(() => title.textContent(), round === 1 ? '서류 안내' : '문의 안내', `round ${round}: drilled title`);
      for (const label of ['새 신청', '신청']) { await menu.getByRole('button', { name: '상위 메뉴', exact: true }).click(); await poll(() => title.textContent(), label, `round ${round}: title after back to ${label}`); }
      await menu.getByRole('button', { name: '상위 메뉴', exact: true }).click();
      await poll(() => title.count(), 0, `round ${round}: drill cleared`);
      assert.equal(await mutations(), 0, `round ${round}: no DOM churn after the drill round trip`);
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

const field = (page, name, label) => page.locator(`[data-krds-component="${name}"][data-krds-part="root"]`).filter({ hasText: label }).locator('[data-krds-part="control"]');
const hostState = page => page.locator('#host-state').textContent();
test('controlled fields: host-driven value/checked changes after resume reach the DOM, and a locked host restores every field', async () => {
  const { page, errors, close } = await open('host-driven');
  try {
    const text = field(page, 'text-input', '호스트 이름'), note = field(page, 'textarea', '호스트 내용'), level = field(page, 'range-slider', '호스트 수준'), agreed = field(page, 'checkbox', '호스트 동의'), notify = field(page, 'switch', '호스트 알림');
    const dom = async () => [await text.inputValue(), await note.inputValue(), await level.inputValue(), await agreed.isChecked(), await notify.isChecked()].join('|');
    await page.locator('#host-set').click();
    await poll(dom, '외부 값|외부 내용|70|true|true', 'host set reaches the DOM');
    await text.focus(); await page.keyboard.press('End'); await page.keyboard.type('!');
    await poll(() => hostState(page), '외부 값!|외부 내용|70|true|true', 'edit after host set commits');
    await page.locator('#host-clear').click();
    await poll(dom, '||0|false|false', 'host clear reaches the DOM');
    await page.locator('#host-lock').click(); await poll(() => page.locator('#host-lock').textContent(), '잠김');
    await text.focus(); await page.keyboard.type('a'); await note.focus(); await page.keyboard.type('b');
    await level.focus(); await page.keyboard.press('ArrowRight'); await agreed.click(); await notify.click();
    await poll(dom, '||0|false|false', 'locked host restores every field');
    await page.locator('#host-lock').click(); await poll(() => page.locator('#host-lock').textContent(), '열림');
    await page.locator('#host-set').click();
    await poll(dom, '외부 값|외부 내용|70|true|true', 'host set after rejections reaches the DOM');
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('controlled fields: a host change made while early native edits are still pending leaves DOM and host consistent and unblocked', async () => {
  for (let run = 0; run < 3; run++) {
    const { page, errors, close } = await openDelayed('host-driven');
    try {
      const text = field(page, 'text-input', '호스트 이름'), agreed = field(page, 'checkbox', '호스트 동의'), level = field(page, 'range-slider', '호스트 수준');
      await text.focus(); await page.keyboard.press('End'); await page.keyboard.type('xy', { delay: 20 }); await agreed.click();
      assert.equal(await text.evaluate(node => node[Symbol.for('unofficial-krds.native-field-processed')] ?? 0), 0, `run ${run}: native edits still pending`);
      await page.locator('#host-set').click();
      assert.equal(await text.evaluate(node => node[Symbol.for('unofficial-krds.native-field-processed')] ?? 0), 0, `run ${run}: host change issued while edits are pending`);
      await settled(page);
      // Lazy dispatch may deliver the host click before or after the pending edits; either way DOM and host state must agree.
      const [hostText, , hostLevel, hostAgreed] = (await hostState(page)).split('|');
      assert.ok(['외부 값', '처음xy'].includes(hostText), `run ${run}: host text ${hostText}`);
      assert.equal(await text.inputValue(), hostText, `run ${run}: text DOM matches host`);
      assert.equal(String(await agreed.isChecked()), hostAgreed, `run ${run}: checkbox DOM matches host`);
      assert.equal(await level.inputValue(), hostLevel, `run ${run}: range DOM matches host`);
      await page.locator('#host-clear').click();
      await poll(() => text.inputValue(), '', `run ${run}: later host clear reaches text`);
      await poll(() => agreed.isChecked(), false, `run ${run}: later host clear reaches checkbox`);
      assert.deepEqual(errors, []);
    } finally { await close(); }
  }
});

test('controlled fields: a throwing host handler (text, textarea, range, checkbox, switch) restores the field, does not strand later toggles, and leaves host updates unblocked', async () => {
  const { page, errors, close } = await open('throwing');
  try {
    const agreed = field(page, 'checkbox', '던지는 동의'), notify = field(page, 'switch', '던지는 알림'), level = field(page, 'range-slider', '던지는 수준');
    for (let i = 0; i < 3; i++) { await agreed.click(); await notify.click(); }
    await level.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
    const name = field(page, 'text-input', '던지는 이름'), memo = field(page, 'textarea', '던지는 메모');
    await name.focus(); await page.keyboard.press('End'); await page.keyboard.type('ab');
    await memo.focus(); await page.keyboard.press('End'); await page.keyboard.type('cd');
    await poll(() => name.inputValue(), '원래', 'throwing text restored');
    await poll(() => memo.inputValue(), '원래 메모', 'throwing textarea restored');
    await poll(() => agreed.isChecked(), false, 'throwing checkbox restored');
    await poll(() => notify.isChecked(), false, 'throwing switch restored');
    await poll(() => level.inputValue(), '0', 'throwing range restored');
    await page.locator('#throw-set').click();
    await poll(() => agreed.isChecked(), true, 'host update reaches checkbox after throws');
    await poll(() => notify.isChecked(), true, 'host update reaches switch after throws');
    await poll(() => level.inputValue(), '50', 'host update reaches range after throws');
    await poll(() => name.inputValue(), '외부 이름', 'host update reaches text after throws');
    await poll(() => memo.inputValue(), '외부 메모', 'host update reaches textarea after throws');
    for (const kind of ['range', 'checkbox', 'switch', 'text', 'textarea']) assert.ok(errors.some(error => error.includes(`host refused ${kind}`)), `${kind} host error reported`);
    assert.ok(errors.every(error => /host refused (range|checkbox|switch|text|textarea)/.test(error)), `only the host errors are reported: ${errors.join(' / ')}`);
  } finally { await close(); }
});

for (const canceled of [false, true]) {
  test(`fields: a ${canceled ? 'canceled' : 'native'} reset issued while early edits are still pending ${canceled ? 'keeps' : 'discards'} them`, async () => {
    for (let run = 0; run < 2; run++) {
      const { page, errors, close } = await openDelayed('fields');
      try {
        if (canceled) await page.evaluate(() => document.getElementById('fields-form').addEventListener('reset', event => event.preventDefault()));
        await control(page, 'text-input').focus(); await page.keyboard.type('지울 내용', { delay: 20 });
        await control(page, 'checkbox').click(); await control(page, 'range-slider').focus(); await page.keyboard.press('ArrowRight');
        assert.equal(await page.evaluate(() => document.querySelector('[data-krds-component="text-input"][data-krds-part="control"]')[Symbol.for('unofficial-krds.native-field-processed')] ?? 0), 0, `run ${run}: edits still pending at reset`);
        await page.locator('#fields-reset').click();
        await settled(page);
        assert.equal(await control(page, 'text-input').inputValue(), canceled ? '지울 내용' : '', `run ${run}: text`);
        assert.equal(await control(page, 'checkbox').isChecked(), canceled, `run ${run}: checkbox`);
        assert.equal(await control(page, 'range-slider').inputValue(), canceled ? '10' : '0', `run ${run}: range`);
        await control(page, 'text-input').focus(); await page.keyboard.press('End'); await page.keyboard.type('!');
        await settled(page);
        assert.equal(await control(page, 'text-input').inputValue(), canceled ? '지울 내용!' : '!', `run ${run}: later edit`);
        assert.deepEqual(errors, []);
      } finally { await close(); }
    }
  });
}

test('Toast: an inline object literal message updates without errors', async () => {
  const { page, errors, close } = await open('toast-inline');
  try {
    const message = part(page, 'toast', 'message'), root = part(page, 'toast', 'root');
    await poll(() => message.textContent(), '첫 번째 안내', 'initial');
    for (const [i, text] of ['두 번째 안내', '세 번째 안내', '첫 번째 안내', '두 번째 안내'].entries()) {
      await page.locator('#inline-next').click();
      await poll(() => message.textContent(), text, `update ${i + 1}`);
      await poll(() => root.getAttribute('data-krds-tone'), i % 2 ? 'information' : 'warning', `tone ${i + 1}`);
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

test('field boundary: unmounting a field removes its window listeners and a remounted field is guarded again', async () => {
  const context = await browser.newContext({ locale: 'ko-KR' }), page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(String(error))); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  try {
    await page.addInitScript(() => {
      const live = window.__krdsWindowListeners = new Set(), add = EventTarget.prototype.addEventListener, remove = EventTarget.prototype.removeEventListener, fields = ['input', 'change', 'compositionstart', 'compositionend'];
      const capture = options => options === true || options?.capture === true;
      EventTarget.prototype.addEventListener = function (type, listener, options) { if (this === window && fields.includes(type) && capture(options) && String(listener).includes('contains')) live.add(`${type}:${[...live].length}:${listener.name}`) && (listener.__krds = (listener.__krds ?? []).concat(type)); return add.call(this, type, listener, options); };
      EventTarget.prototype.removeEventListener = function (type, listener, options) { if (this === window && listener?.__krds?.includes(type)) { const entry = [...live].find(item => item.startsWith(`${type}:`)); if (entry) live.delete(entry); } return remove.call(this, type, listener, options); };
    });
    await page.goto(`${origin}/mounted-field.html`); await page.waitForLoadState('networkidle');
    const count = () => page.evaluate(() => window.__krdsWindowListeners.size), input = page.locator('[data-krds-component="text-input"][data-krds-part="control"]');
    await poll(count, 4, 'resumed field installs its four window listeners once');
    await input.fill('가'); await poll(() => input.evaluate(node => node[Symbol.for('unofficial-krds.native-field-sequence')] ?? 0), 1, 'resumed field is guarded');
    await page.locator('#mount-toggle').click(); await poll(() => input.count(), 0, 'field unmounted');
    await poll(count, 0, 'unmount removes the window listeners');
    await page.locator('#mount-toggle').click(); await poll(() => input.count(), 1, 'field remounted');
    await poll(count, 4, 'remounted field installs its listeners again');
    await input.fill('나'); await poll(() => input.evaluate(node => node[Symbol.for('unofficial-krds.native-field-sequence')] ?? 0), 1, 'remounted field is guarded');
    await page.locator('#mount-toggle').click(); await poll(count, 0, 'second unmount removes them again');
    assert.deepEqual(errors, []);
  } finally { await context.close(); }
});

test('Snackbar: an inline object literal message updates without errors', async () => {
  const { page, errors, close } = await open('snackbar-inline');
  try {
    const root = page.locator('[data-krds-component="snackbar"][data-krds-part="root"]');
    await poll(() => root.count(), 1, 'snackbar shown');
    for (const [i, title] of ['두 번째 안내', '세 번째 안내', '첫 번째 안내', '두 번째 안내'].entries()) {
      await page.locator('#snackbar-next').click();
      await poll(() => root.textContent().then(text => text.includes(title) && text.includes(`본문 ${(i + 1) % 3}`)), true, `update ${i + 1}`);
    }
    assert.deepEqual(errors, []);
  } finally { await close(); }
});

for (const [engine, launcher, tab, back] of [['chromium', null, 'Tab', 'Shift+Tab'], ['webkit', webkit, 'Alt+Tab', 'Alt+Shift+Tab']]) {
  test(`Tooltip (${engine}): after an Escape dismissal, keyboard departure and re-entry reopen it`, async () => {
    const own = launcher ? await launcher.launch() : null, context = await (own ?? browser).newContext({ locale: 'ko-KR', reducedMotion: 'reduce', viewport: { width: 1000, height: 800 } }), page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(String(error))); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    try {
      await page.goto(`${origin}/tooltip.html`); await page.waitForLoadState('networkidle');
      const root = page.locator('[data-krds-component="tooltip"][data-krds-part="root"]'), trigger = page.locator('#help-trigger'), active = () => page.evaluate(() => document.activeElement?.id);
      // Pointer path (the docs matrix scenario): hover opens, Escape dismisses and suppresses pointer reopen, pointer leaves.
      await trigger.hover(); await poll(() => root.getAttribute('data-krds-state'), 'open', 'hover opens');
      await trigger.focus(); await page.keyboard.press('Escape');
      await poll(() => root.getAttribute('data-krds-state'), 'suppressed', 'Escape suppresses');
      await page.mouse.move(5, 790);
      await trigger.hover(); await new Promise(done => setTimeout(done, 200));
      assert.notEqual(await root.getAttribute('data-krds-state'), 'open', 'pointer re-entry stays suppressed');
      await page.mouse.move(5, 790);
      await page.keyboard.press(tab); await poll(active, 'tooltip-after', 'keyboard departure');
      await page.keyboard.press(back); await poll(active, 'help-trigger', 'keyboard re-entry');
      await poll(() => root.getAttribute('data-krds-state'), 'open', 'keyboard re-entry reopens');
      // Keyboard-only repetition.
      await page.keyboard.press('Escape'); await poll(() => root.getAttribute('data-krds-state'), 'suppressed', 'second Escape suppresses');
      await page.keyboard.press(back); await poll(active, 'tooltip-before', 'departure backwards');
      await page.keyboard.press(tab); await poll(active, 'help-trigger', 're-entry forwards');
      await poll(() => root.getAttribute('data-krds-state'), 'open', 'second keyboard re-entry reopens');
      assert.deepEqual(errors, []);
    } finally { await context.close(); await own?.close(); }
  });
}
