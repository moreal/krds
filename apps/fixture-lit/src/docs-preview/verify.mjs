// Owner-level browser proof: every acceptance item is mounted from the built dist/docs-preview artifact,
// its initial state is checked, the listed actions are performed, the observable outcome is asserted and the
// reload / reset baseline is confirmed. Any page error, console error, non-loopback request, failed same-origin
// request or acceptance ID without a scenario fails the run.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';
import {expect} from '@playwright/test';

const root = resolve(import.meta.dirname, '../../dist/docs-preview');
const repo = resolve(import.meta.dirname, '../../../..');
const evidence = resolve(repo, '.superpowers/sdd/2026-11-01-native-live-previews/lit-browser');
await mkdir(evidence, {recursive: true});
const definitions = JSON.parse(await readFile(new URL('./definitions.json', import.meta.url))).demos.filter(d => d.exampleId === 'default');
const acceptance = JSON.parse(await readFile(resolve(repo, 'apps/docs/demo-acceptance.json'))).items;
assert.equal(definitions.length, 54);
assert.deepEqual(definitions.map(d => d.acceptanceId).sort(), acceptance.map(a => a.acceptanceId).sort(), 'definitions cover every acceptance ID');

// R3: every example source range resolves (offsets, hashes, lines) to its own symbol; data ranges cover only that component.
{
  const {validateRanges} = await import('../../../../tools/docs-previews/contract.mjs');
  for (const demo of definitions) {
    for (const source of demo.sources.filter(x => ['example', 'data'].includes(x.role))) {
      const bytes = await readFile(resolve(repo, source.path));
      assert.ok(source.ranges?.length, `${demo.componentId}: ${source.role} source has ranges`);
      validateRanges(bytes, source.ranges, demo.componentId);
      const text = source.ranges.map(r => bytes.subarray(r.start, r.end).toString()).join('\n');
      if (source.role === 'data') { assert.equal(source.ranges.length, 1); assert.equal(JSON.parse(text).componentId, demo.componentId); assert.ok(bytes.length > 4 * source.ranges[0].end - source.ranges[0].start || source.ranges[0].end - source.ranges[0].start < bytes.length / 10, 'data range is a small slice'); }
      else assert.match(text.trimStart(), new RegExp(`^(?:${demo.componentId.includes('-') ? `'${demo.componentId}'` : demo.componentId}[(:]|function )`), `${demo.componentId}: range starts at its own symbol`);
    }
  }
}
const base = '/krds/previews/lit/';
const types = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.wav': 'audio/wav', '.json': 'application/json', '.woff2': 'font/woff2'};
// Minimal docs-shell stand-in: the exact sandbox of the docs iframe, plus a transport message log.
const parentHtml = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>sandbox parent</title></head><body style="margin:0"><iframe id="f" name="f" title="preview" sandbox="allow-scripts allow-same-origin" style="border:0;display:block;width:1100px;height:900px"></iframe><script>
const f=document.getElementById('f');window.__msgs=[];
addEventListener('message',e=>{window.__msgs.push({origin:e.origin,fromFrame:e.source===f.contentWindow,data:e.data});
  // Same reply the docs shell sends once the frame reports ready.
  if(e.source===f.contentWindow&&e.data&&e.data.type==='ready'){const {version,framework,componentId,exampleId,token}=e.data;f.contentWindow.postMessage({version,framework,componentId,exampleId,token,type:'init',presentation:{colorMode:'forced-colors',reducedMotion:true}},location.origin);}
});
f.src=new URLSearchParams(location.search).get('src');
</script></body></html>`;
const token = 'litverifytoken0123456789';
const makeView = real => {
  const frame = () => real.frames().find(f => f.name() === 'f');
  const own = new Set(['keyboard', 'mouse', 'clock', 'request', 'screenshot', 'waitForTimeout', 'setDefaultTimeout', 'context']);
  return new Proxy({}, {get: (_, key) => {
    if (key === 'url') return () => frame().url();
    if (key === 'real') return real;
    const target = own.has(key) ? real : frame();
    const value = target[key];
    return typeof value === 'function' ? value.bind(target) : value;
  }});
};
const server = createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://local').pathname;
    if (path === '/parent.html') { res.setHeader('content-type', 'text/html'); res.end(parentHtml); return; }
    if (!path.startsWith(base) || path.includes('..')) { res.statusCode = 404; res.end(); return; }
    const file = resolve(root, path.slice(base.length) || 'index.html');
    if (!file.startsWith(root)) { res.statusCode = 404; res.end(); return; }
    res.setHeader('content-type', types[extname(file)] ?? 'application/octet-stream');
    const bytes = await readFile(file);
    res.setHeader('accept-ranges', 'bytes');
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
    if (range) {
      const start = range[1] ? Number(range[1]) : 0; const end = range[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1;
      res.statusCode = 206; res.setHeader('content-range', `bytes ${start}-${end}/${bytes.length}`); res.end(bytes.subarray(start, end + 1)); return;
    }
    res.end(bytes);
  } catch { res.statusCode = 404; res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const url = `${origin}${base}index.html`;
const browser = await chromium.launch({headless: true});

const part = (page, id, name) => page.locator(`[data-krds-component="${id}"][data-krds-part="${name}"]`);
const result = page => page.locator('[data-demo-result]');
const hostEl = (page, id) => page.locator(`form krds-${id}`).first();
const focusedTag = page => page.evaluate(() => document.activeElement?.tagName);
const signature = page => page.locator('#preview-root > form').evaluate(rootElement => {
  const out = [];
  const walk = node => {
    if (node.nodeType === 3) { const t = node.textContent.trim(); if (t) out.push(t); return; }
    if (node.nodeType !== 1 || ['STYLE', 'SCRIPT'].includes(node.tagName)) return;
    if (node.matches('input,select,textarea')) out.push(['v', node.name, node.value, node.checked ?? null]);
    for (const a of ['aria-checked', 'aria-selected', 'aria-pressed', 'aria-expanded', 'aria-valuenow', 'aria-current', 'hidden', 'open']) if (node.hasAttribute(a)) out.push([a, node.getAttribute(a)]);
    if (node.shadowRoot) for (const c of node.shadowRoot.childNodes) walk(c);
    for (const c of node.childNodes) walk(c);
  };
  walk(rootElement);
  return out;
});
// The sandbox has no allow-popups, so a real new-tab open is blocked by design; the native modified-click path is proven by
// checking the anchor is a real href and the component never cancels a modified click.
const modifiedClickIsNative = async (page, locator) => {
  const href = await locator.getAttribute('href'); assert.ok(href && !href.startsWith('#'), 'real destination href');
  const before = page.url();
  const accepted = await locator.evaluate(el => { let canceledByComponent = null; const probe = event => { canceledByComponent = event.defaultPrevented; event.preventDefault(); }; window.addEventListener('click', probe, {once: true}); el.dispatchEvent(new MouseEvent('click', {ctrlKey: true, metaKey: true, bubbles: true, cancelable: true, composed: true, button: 0})); window.removeEventListener('click', probe); return canceledByComponent === false; });
  assert.equal(accepted, true, 'modified click is not canceled by the component');
  assert.equal(page.url(), before);
};
const assertIdentityQuery = (page, id) => {
  const q = new URL(page.url()).searchParams;
  assert.deepEqual([q.get('version'), q.get('framework'), q.get('componentId'), q.get('exampleId'), q.get('token')], ['1', 'lit', id, 'default', token], `frame URL keeps the host identity: ${page.url()}`);
};
const frameMessages = page => page.real.evaluate(() => window.__msgs);
const need = (cond, message) => assert.ok(cond, message);

/** Scenario table: one entry per acceptance ID. Each performs the listed actions and asserts the observable outcome. */
const scenarios = {
  async 'accessible-media'(page, id) {
    const media = page.locator('audio');
    await expect(media).toHaveAttribute('controls', '');
    await expect.poll(() => media.evaluate(e => e.readyState)).toBeGreaterThan(0);
    await expect.poll(() => media.evaluate(e => e.duration)).toBeGreaterThan(0.5);
    await media.evaluate(e => { e.currentTime = 0.4; });
    await expect.poll(() => media.evaluate(e => Math.round(e.currentTime * 10))).toBe(4);
    assert.equal(await media.evaluate(e => e.paused), true);
    await expect(media).toHaveAccessibleName('로컬 예제 미디어');
    await expect(part(page, id, 'transcript')).toContainText('약 2초 동안 일정한 높이의 예제 신호음이 들립니다.');
    // The media's computed description is the (unlabelled) transcript text.
    await expect(media).toHaveAccessibleDescription('약 2초 동안 일정한 높이의 예제 신호음이 들립니다.');
    const describedBy = await media.getAttribute('aria-describedby');
    assert.ok(describedBy);
    assert.deepEqual(await media.evaluate((e, id) => { const t = e.getRootNode().getElementById(id); return [t.getAttribute('aria-label'), t.getAttribute('aria-labelledby')]; }, describedBy), [null, null]);
    await expect(part(page, id, 'alternatives')).toBeVisible();
  },
  async accordion(page, id) {
    const triggers = part(page, id, 'trigger');
    await expect(triggers).toHaveCount(2);
    for (let i = 0; i < 2; i++) await expect(triggers.nth(i)).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Tab'); await expect(triggers.nth(0)).toBeFocused();
    await page.keyboard.press('Tab'); await expect(triggers.nth(1)).toBeFocused();
    await page.keyboard.press('Shift+Tab'); await expect(triggers.nth(0)).toBeFocused();
    await expect(triggers.nth(0)).toContainText('신청 자격');
    assert.equal(await triggers.nth(0).evaluate(e => e.parentElement.tagName), 'H3', 'trigger is inside a heading');
    const panelId = await triggers.nth(0).getAttribute('aria-controls');
    await page.keyboard.press('Enter');
    await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(`[id="${panelId}"]`)).toBeVisible();
    await page.keyboard.press('Space');
    await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator(`[id="${panelId}"]`)).toBeHidden();
  },
  async 'back-button'(page) {
    await expect(page.locator('[data-route-view]')).toHaveText('현재 화면: current');
    await page.getByRole('button', {name: '뒤로가기'}).click();
    await expect(page.locator('[data-route-view]')).toHaveText('현재 화면: parent');
    await expect(result(page)).toHaveText('이전 화면: parent');
  },
  async badge(page, id) {
    const root = part(page, id, 'root');
    await expect(root).toHaveText('진행 중');
    assert.equal(await root.getAttribute('tabindex'), null);
    assert.equal(await root.getAttribute('role'), null);
    await page.keyboard.press('Tab');
    assert.notEqual(await focusedTag(page), 'KRDS-BADGE');
  },
  async 'bottom-sheet'(page, id) {
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName('지역 선택');
    // Focus is trapped while the sheet is open.
    for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); assert.equal(await focusedTag(page), 'KRDS-BOTTOM-SHEET'); }
    await page.getByRole('radio', {name: '부산', exact: true}).check();
    await expect(page.getByRole('radio', {name: '부산', exact: true})).toBeChecked();
    await expect(result(page)).toHaveText('선택한 지역: 부산');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.locator('#sheet-opener')).toBeFocused();
    await page.keyboard.press('Tab'); assert.notEqual(await focusedTag(page), 'KRDS-BOTTOM-SHEET', 'focus is no longer trapped when closed');
    await page.locator('#sheet-opener').click();
    await expect(dialog).toBeVisible();
    await part(page, id, 'close').click();
    await expect(dialog).toBeHidden();
    await expect(result(page)).toContainText('부산');
  },
  async breadcrumb(page, id) {
    await expect(page.getByRole('navigation', {name: '브레드크럼'})).toBeVisible();
    await expect(page.getByRole('link', {name: '홈', exact: true})).toHaveAttribute('href', /route=home/);
    await expect(page.getByRole('link', {name: '신청', exact: true})).toHaveAttribute('href', /route=apply/);
    await expect(page.locator('#preview-root > form')).not.toContainText('신청 상세');
    await expect(page.getByRole('navigation', {name: '브레드크럼'}).getByRole('listitem')).toHaveCount(2);
    await page.getByRole('link', {name: '신청', exact: true}).click();
    await expect(page.locator('[data-route-view]')).toContainText('apply');
    assertIdentityQuery(page, id);
    await page.getByRole('link', {name: '예제로 돌아가기'}).click();
    assertIdentityQuery(page, id);
    await page.getByRole('link', {name: '홈', exact: true}).click();
    await expect(page.locator('[data-route-view]')).toContainText('home');
  },
  async button(page) {
    await expect(result(page)).toBeHidden();
    await page.getByRole('button', {name: '신청하기', exact: true}).click();
    await expect(result(page)).toHaveText('신청이 1회 완료되었습니다.');
  },
  async calendar(page, id) {
    await expect(page.getByRole('heading', {name: '2024년 2월'})).toBeVisible();
    const day = page.getByRole('button', {name: /2024년 2월 20일/});
    await expect(day).toHaveAttribute('aria-pressed', 'false');
    await day.click();
    await expect(day).toHaveAttribute('aria-pressed', 'true');
    await part(page, id, 'confirm').click();
    await expect(result(page)).toContainText('2024-02-20');
    await expect(day).toHaveAttribute('aria-pressed', 'true');
  },
  async carousel(page, id) {
    const current = () => part(page, id, 'slide').and(page.locator('[data-krds-state~="active"]'));
    await expect(current()).toHaveAttribute('aria-label', /^1 \/ 3/);
    await page.clock.fastForward(6100);
    await expect(current()).toHaveAttribute('aria-label', /^2 \/ 3/);
    await page.keyboard.press('Tab');
    await expect(part(page, id, 'play-pause')).toBeFocused();
    await expect(part(page, id, 'play-pause')).toHaveText('재생');
    await page.clock.fastForward(6500);
    await expect(current()).toHaveAttribute('aria-label', /^2 \/ 3/);
    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
    assert.notEqual(await focusedTag(page), 'KRDS-CAROUSEL');
    await page.clock.fastForward(6500);
    await expect(current()).toHaveAttribute('aria-label', /^2 \/ 3/);
    await expect(page.locator('[data-carousel-requests]')).toHaveText('자동 재생 요청 0회');
    await part(page, id, 'play-pause').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-carousel-requests]')).toHaveText('자동 재생 요청 0회');
    await page.clock.fastForward(6100);
    await expect(current()).toHaveAttribute('aria-label', /^3 \/ 3/);
  },
  async checkbox(page) {
    const box = page.getByRole('checkbox');
    await expect(box).not.toBeChecked();
    await page.getByText('이용약관 동의', {exact: true}).click();
    await expect(box).toBeChecked();
    await expect(result(page)).toContainText('checked-change 1회');
    await box.press('Space');
    await expect(box).not.toBeChecked();
    await expect(result(page)).toContainText('checked-change 2회');
    await box.check();
    await page.getByRole('button', {name: '입력 확인'}).click();
    await expect(page.getByLabel('입력 결과')).toContainText('consent');
    await expect(page.getByLabel('입력 결과')).toContainText('agreed');
    await page.getByRole('button', {name: '입력 초기화'}).click();
    await expect(box).not.toBeChecked();
    await expect(page.getByLabel('입력 결과')).toHaveText('');
  },
  async 'coach-mark'(page) {
    const popover = page.locator('[data-krds-component="coach-mark"][data-krds-part="popover"]');
    await expect(popover).toHaveCount(0);
    await expect(page.locator('[data-tutorial-status]')).toHaveText('현재 대상: 없음');
    await page.getByRole('button', {name: '따라하기 시작'}).click();
    await expect(popover).toBeVisible();
    assert.equal(await page.locator('#applicant-name').evaluate(e => e.nextElementSibling.id), 'applicant-name-after');
    assert.equal(await page.locator('#applicant-name-after [data-krds-part="popover"]').count(), 1, 'popover rendered in the boundary directly after the target');
    await expect(page.locator('[data-tutorial-status]')).toHaveText('현재 대상: 신청인 이름');
    await page.keyboard.press('Escape');
    await expect(popover).toHaveCount(0);
    await expect(page.locator('[data-tutorial-status]')).toHaveText('현재 대상: 없음');
  },
  async 'contextual-help'(page, id) {
    const content = part(page, id, 'popover');
    await expect(content).toBeHidden();
    const trigger = page.getByRole('button', {name: '신청 자격 도움말', exact: true});
    await trigger.click();
    await expect(content).toBeVisible();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement.closest('krds-contextual-help')), true);
    await page.keyboard.press('Escape');
    await expect(content).toBeHidden();
  },
  async 'critical-alert'(page, id) {
    await expect(part(page, id, 'root')).toContainText('긴급 안내');
    await expect(part(page, id, 'root')).toContainText('예제 점검으로 신청이 잠시 중단됩니다.');
    assert.equal(await part(page, id, 'root').locator('button').count(), 0, 'no dismiss/collapse control');
    assert.equal(await part(page, id, 'root').locator('[aria-expanded]').count(), 0);
  },
  async 'date-input'(page) {
    const input = page.getByRole('textbox').first();
    await expect(input).toHaveValue('');
    await input.fill('2024-02-20');
    await input.blur();
    await expect(input).toHaveValue('2024-02-20');
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await expect(result(page)).toContainText('2024-02-20');
  },
  async disclosure(page, id) {
    const trigger = page.getByRole('button', {name: '신청 도움말'});
    const content = part(page, id, 'content');
    await expect(content).toBeHidden();
    await trigger.focus(); await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true'); await expect(content).toBeVisible();
    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false'); await expect(content).toBeHidden();
  },
  async fab(page) {
    const fab = page.getByRole('button', {name: '새 신청', exact: true});
    await fab.focus(); await page.keyboard.press('Enter');
    await expect(result(page)).toHaveText('새 신청 1건');
  },
  async favicon(page) {
    const links = page.locator('head link[rel~="icon"]');
    await expect(links).toHaveCount(2);
    const entries = await links.evaluateAll(es => es.map(e => ({href: e.href, media: e.media, type: e.type})));
    assert.deepEqual(entries.map(e => e.media).sort(), ['(prefers-color-scheme: dark)', '(prefers-color-scheme: light)']);
    for (const {href, type} of entries) {
      assert.equal(type, 'image/svg+xml');
      if (href.startsWith('data:')) { assert.ok(href.length > 40, 'inline icon has content'); continue; }
      const response = await page.request.get(href);
      assert.ok(response.ok(), `favicon resolves: ${href.slice(0, 60)}`);
    }
  },
  async 'file-upload'(page, id) {
    const input = page.locator('input[type=file]');
    await expect(part(page, id, 'count')).toContainText('0개 파일');
    // Single Tab stop: the visible picker button; the native input is tabindex=-1 and aria-hidden but stays in the form.
    await page.keyboard.press('Tab');
    await expect(part(page, id, 'picker')).toBeFocused();
    await expect(part(page, id, 'picker')).toHaveAccessibleName('파일 선택');
    await expect(input).toHaveAttribute('tabindex', '-1');
    await expect(input).toHaveAttribute('aria-hidden', 'true');
    await page.keyboard.press('Tab');
    assert.notEqual(await page.evaluate(() => document.activeElement?.shadowRoot?.activeElement?.getAttribute('data-krds-part')), 'file-input', 'the native input is never a tab stop');
    await part(page, id, 'picker').focus();
    const [chooser] = await Promise.all([page.real.waitForEvent('filechooser'), page.keyboard.press('Enter')]);
    await chooser.setFiles({name: 'proof.txt', mimeType: 'text/plain', buffer: Buffer.from('independent local example')});
    await expect(part(page, id, 'list')).toContainText('proof.txt');
    await expect(result(page)).toContainText('proof.txt');
    await page.screenshot({path: resolve(evidence, 'file-upload-selected.png'), fullPage: true});
    await page.getByRole('button', {name: /삭제|제거/}).click();
    await expect(part(page, id, 'list')).not.toContainText('proof.txt');
    await expect(part(page, id, 'count')).toContainText('0개 파일');
    await expect(input).toHaveValue('');
    await page.screenshot({path: resolve(evidence, 'file-upload-removed.png'), fullPage: true});
  },
  async footer(page, id) {
    const footer = page.locator('footer[data-krds-component="footer"]');
    await expect(footer).toContainText('개인정보처리방침');
    await expect(footer).toContainText('예제 문의');
    await expect(footer).toContainText('Independent local specimen');
    assert.equal(await footer.evaluate(e => e.lastElementChild.tagName), 'KRDS-IDENTIFIER');
    await expect(footer.getByRole('link', {name: '개인정보처리방침'})).toHaveAttribute('href', /route=privacy/);
    await footer.getByRole('link', {name: '개인정보처리방침'}).click();
    await expect(page.locator('[data-route-view]')).toContainText('privacy');
    assertIdentityQuery(page, id);
    await expect(page.getByRole('heading', {name: '로컬 예제 목적지'})).toBeVisible();
  },
  async header(page, id) {
    await expect(page.locator('header[data-krds-component="header"]')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', {name: '본문 바로가기'})).toBeFocused();
    await page.evaluate(() => window.scrollTo(0, 1200));
    assert.ok(await page.evaluate(() => scrollY) > 0, 'page scrolls');
    const order = await page.locator('header[data-krds-component="header"]').evaluate(h => ['identity', 'utilities', 'search', 'navigation'].map(name => { const el = name === 'search' ? h.querySelector('[data-krds-part="search"]') : h.querySelector(`[data-krds-part="${name}"]`); return Array.from(h.querySelectorAll('*')).indexOf(el); }));
    assert.ok(order.every(i => i >= 0) && order.every((v, i) => !i || v > order[i - 1]), `identity→utilities→search→navigation: ${order}`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole('button', {name: '신청', exact: true}).click();
    await expect(page.getByRole('link', {name: '신규 신청', exact: true})).toBeVisible();
  },
  async 'help-panel'(page, id) {
    const opener = part(page, id, 'opener');
    await expect(opener).toHaveAttribute('aria-expanded', 'true');
    await expect(part(page, id, 'body')).toBeVisible();
    await expect(part(page, id, 'body').getByRole('button', {name: '신청 자격', exact: true})).toBeVisible();
    await page.getByRole('button', {name: '신청 자격', exact: true}).click();
    await expect(part(page, id, 'body')).toContainText('예제 신청 자격 도움말');
    await expect(part(page, id, 'body').getByRole('link', {name: '이용약관'})).toHaveAttribute('href', /route=policy/);
    await page.getByRole('button', {name: '도움말 닫기'}).click();
    await expect(opener).toHaveAttribute('aria-expanded', 'false');
    await expect(part(page, id, 'body')).toBeHidden();
  },
  async identifier(page, id) {
    const footer = page.locator('footer[role=contentinfo]');
    assert.equal(await footer.evaluate(e => e.lastElementChild.tagName), 'KRDS-IDENTIFIER');
    await expect(part(page, id, 'root')).toBeVisible();
    await expect(part(page, id, 'text')).toContainText('독립 예제 운영기관');
  },
  async image(page) {
    const images = page.getByRole('img');
    await expect(images).toHaveCount(2);
    const loaded = images.nth(0); const specimen = images.nth(1);
    await expect(loaded).toHaveAttribute('alt', '산과 강이 있는 독립 예제 그림');
    await expect.poll(() => loaded.evaluate(e => e.complete && e.naturalWidth > 0)).toBe(true);
    assert.deepEqual(await loaded.evaluate(e => [e.naturalWidth, e.naturalHeight]), [640, 360]);
    await expect(loaded).toHaveAccessibleName('산과 강이 있는 독립 예제 그림');
    const loadedSrc = await loaded.evaluate(e => e.currentSrc || e.src);
    assert.equal(new URL(loadedSrc).pathname, `${base}local-assets/example-landscape.svg`);
    assert.equal(new URL(loadedSrc).origin, origin);
    assert.equal(await page.evaluate(async src => (await fetch(src)).status, loadedSrc), 200);
    await expect(specimen).toHaveAttribute('alt', '불러올 수 없는 예제 그림');
    await expect.poll(() => specimen.evaluate(e => e.complete)).toBe(true);
    assert.equal(await specimen.evaluate(e => e.naturalWidth), 0, 'the intentionally missing image fails to load');
    await expect(specimen).toHaveAccessibleName('불러올 수 없는 예제 그림');
    assert.equal(new URL(await specimen.evaluate(e => e.currentSrc || e.src)).pathname, `${base}local-assets/intentional-missing-image.svg`);
    await expect(page.locator('figure:has(img[alt="불러올 수 없는 예제 그림"]) [data-krds-part="description"]')).toHaveText('이미지를 불러올 수 없습니다.');
    await expect(page.locator('figure:has(img[alt="산과 강이 있는 독립 예제 그림"]) [data-krds-part="description"]')).toHaveCount(0);
  },
  async 'in-page-navigation'(page) {
    const first = page.getByRole('link', {name: /신청 개요/});
    await first.focus(); await first.press('Enter');
    await expect(page.locator('#overview')).toBeFocused();
    const order = await page.evaluate(() => document.querySelector('krds-in-page-navigation').compareDocumentPosition(document.querySelector('#overview')));
    assert.ok(order & 4, 'outline precedes body in DOM');
    const boxes = await page.evaluate(() => ({nav: document.querySelector('krds-in-page-navigation').getBoundingClientRect().left, body: document.querySelector('#overview').getBoundingClientRect().left}));
    assert.ok(boxes.nav > boxes.body, `outline is visually right on desktop: ${JSON.stringify(boxes)}`);
    await page.locator('#requirements').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 300));
    await expect(page.getByRole('link', {name: /신청 조건/})).toHaveAttribute('aria-current', 'location');
  },
  async 'language-switcher'(page) {
    await expect(page.locator('#language-page')).toHaveText('한국어 예제');
    const english = page.getByRole('link', {name: /English/});
    await english.focus(); await page.keyboard.press('Enter');
    await expect(page.locator('p[lang=en]')).toHaveText('English example');
    const korean = page.getByRole('link', {name: /한국어/});
    await korean.focus(); await page.keyboard.press('Enter');
    await expect(page.locator('p[lang=ko]')).toHaveText('한국어 예제');
  },
  async link(page, id, ctx) {
    const link = part(page, id, 'root');
    await expect(link).toHaveAttribute('href', /route=application/);
    await expect(link).toHaveCSS('text-decoration-line', 'underline');
    await modifiedClickIsNative(page, link);
    await expect(page.locator('form')).toBeVisible();
    await link.focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', {name: '로컬 예제 목적지'})).toBeVisible();
    await expect(page.locator('[data-route-view]')).toContainText('application');
    assertIdentityQuery(page, id);
    await expect.poll(async () => (await frameMessages(page)).filter(m => m.data.type === 'ready').length).toBeGreaterThanOrEqual(2);
    await page.getByRole('link', {name: '예제로 돌아가기'}).click();
    await expect(page.locator('[data-demo-result]')).toBeAttached();
    assertIdentityQuery(page, id);
    assert.equal(new URL(page.url()).searchParams.get('route'), null);
  },
  async 'main-menu'(page, id, ctx) {
    const home = page.getByRole('link', {name: '홈', exact: true});
    const support = page.getByRole('link', {name: '지원', exact: true});
    await expect(home).toHaveAttribute('href', /route=home/);
    await expect(support).toHaveAttribute('href', /route=support/);
    await modifiedClickIsNative(page, support);
    await expect(page.locator('[aria-expanded="true"]')).toHaveCount(0);
    await home.focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', {name: '로컬 예제 목적지'})).toBeVisible();
    assertIdentityQuery(page, id);
  },
  async masthead(page, id) {
    await expect(page.locator('[data-specimen-label]')).toContainText('실제 공식 정부서비스가 아닙니다');
    await expect(part(page, id, 'text')).toContainText('대한민국 공식 전자정부 누리집');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', {name: '본문 바로가기'})).toBeFocused();
    const order = await page.evaluate(() => document.querySelector('krds-skip-link').compareDocumentPosition(document.querySelector('krds-masthead')));
    assert.ok(order & 4, 'skip link precedes masthead');
  },
  async modal(page) {
    const opener = page.getByRole('button', {name: '열기', exact: true});
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveCount(0);
    await opener.click();
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName('신청 확인');
    // The confirm control is the public krds-button; no raw <button> is authored in the actions region.
    assert.equal(await page.locator('krds-modal').evaluate(e => [e.shadowRoot.querySelectorAll('[data-krds-part="actions"] button').length, e.shadowRoot.querySelectorAll('[data-krds-part="actions"] krds-button[data-krds-close]').length]).then(String), '0,1');
    await page.screenshot({path: resolve(evidence, 'modal-open.png'), fullPage: true});
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
    await page.screenshot({path: resolve(evidence, 'modal-closed-focus-restored.png'), fullPage: true});
    await opener.click();
    await expect(dialog).toBeVisible();
    await page.getByRole('button', {name: '확인', exact: true}).click();
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
  },
  async 'native-select'(page) {
    const select = page.getByRole('combobox');
    await expect(select).toHaveValue('seoul');
    await select.selectOption('busan');
    await expect(select).toHaveValue('busan');
    await expect(result(page)).toHaveText('선택한 지역: busan');
  },
  async pagination(page, id) {
    const prev = part(page, id, 'previous'); const next = part(page, id, 'next');
    const currentPage = part(page, id, 'link').and(page.locator('[aria-current="page"]'));
    await expect(currentPage).toHaveText('1');
    await expect(prev, 'the first page has no previous link').toHaveCount(0);
    assert.equal(await currentPage.getAttribute('href'), null);
    const links = part(page, id, 'link');
    await expect(links.filter({hasText: /^12$/})).toHaveAttribute('href', /route=results-page-12/);
    await links.filter({hasText: /^12$/}).click();
    await expect(currentPage).toHaveText('12');
    await expect(next, 'the last page has no next link').toHaveCount(0);
    await expect(prev).toHaveAttribute('href', /route=results-page-11/);
    await links.filter({hasText: /^1$/}).click();
    await expect(currentPage).toHaveText('1');
    await expect(prev).toHaveCount(0);
    await expect(result(page)).toHaveText('현재 페이지: 1');
  },
  async 'quantity-toggle'(page, id) {
    const out = part(page, id, 'output'); const inc = part(page, id, 'increment'); const dec = part(page, id, 'decrement');
    await expect(out).toContainText('2');
    await inc.click(); await expect(out).toContainText('3');
    await dec.click(); await expect(out).toContainText('2');
    await dec.click(); await dec.click(); await expect(out).toContainText('0');
    await expect(dec).toHaveAttribute('aria-disabled', 'true');
    await dec.click({force: true}); await expect(out).toContainText('0');
    await page.getByRole('button', {name: '입력 확인'}).click();
    await expect(page.getByLabel('입력 결과')).toContainText('quantity');
    await page.getByRole('button', {name: '입력 초기화'}).click();
    await expect(out).toContainText('2');
  },
  async 'radio-group'(page) {
    const busan = page.getByRole('radio', {name: '부산', exact: true});
    await expect(page.getByRole('radio', {checked: true})).toHaveCount(0);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('radio', {name: '서울', exact: true})).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(busan).toBeFocused();
    await page.keyboard.press('Tab'); assert.notEqual(await focusedTag(page), 'KRDS-RADIO-GROUP', 'disabled 제주 is skipped');
    await page.keyboard.press('Shift+Tab'); await expect(busan).toBeFocused();
    await page.keyboard.press('Shift+Tab'); await expect(page.getByRole('radio', {name: '서울', exact: true})).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(busan).toBeChecked();
    await expect(page.getByRole('radio', {checked: true})).toHaveCount(1);
    await expect(result(page)).toContainText('value-change 1회');
    await page.keyboard.press('Space');
    await expect(result(page)).toContainText('value-change 1회');
    await page.getByRole('button', {name: '입력 확인'}).click();
    await expect(page.getByLabel('입력 결과')).toContainText('busan');
    await page.getByRole('button', {name: '입력 초기화'}).click();
    await expect(page.getByRole('radio', {checked: true})).toHaveCount(0);
  },
  async 'range-slider'(page, id) {
    const slider = page.getByRole('slider');
    await expect(slider).toHaveValue('50');
    await slider.focus(); await slider.press('ArrowRight');
    await expect(slider).toHaveValue('60');
    await expect(part(page, id, 'output')).toHaveText('60');
    const box = await slider.boundingBox();
    await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
    await expect.poll(async () => Number(await slider.inputValue())).toBeGreaterThanOrEqual(80);
    await page.mouse.move(box.x + 4, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2, {steps: 4}); await page.mouse.up();
    await expect.poll(async () => Number(await slider.inputValue())).toBeLessThanOrEqual(30);
    await slider.blur();
    const value = Number(await slider.inputValue());
    assert.ok(value >= 0 && value <= 100);
    await page.getByRole('button', {name: '입력 초기화'}).click();
    await expect(slider).toHaveValue('50');
  },
  async resize(page, id) {
    const trigger = part(page, id, 'trigger');
    const content = page.locator('#resize-content');
    const size = () => content.evaluate(e => parseFloat(getComputedStyle(e).fontSize) / parseFloat(getComputedStyle(e.parentElement).fontSize));
    await expect.poll(size).toBeCloseTo(1, 2);
    await trigger.focus(); await trigger.press('ArrowDown');
    await expect(trigger).toContainText('조금 크게');
    await expect.poll(size).toBeCloseTo(1.1, 1);
    await trigger.click();
    await part(page, id, 'option').filter({hasText: '아주 크게'}).click();
    await expect.poll(size).toBeCloseTo(1.3, 1);
    await page.getByRole('button', {name: '예제 확인'}).focus();
    await page.keyboard.press('Enter');
    await expect(result(page)).toContainText('확대된 예제 영역');
  },
  async 'side-navigation'(page, id) {
    const toggle = part(page, id, 'trigger').first();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('[aria-current=page]')).toContainText('신규 신청');
    await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click(); await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('link', {name: '신청 내역', exact: true}).click();
    await expect(page.locator('[aria-current=page]')).toContainText('신청 내역');
    await page.getByRole('link', {name: '신규 신청', exact: true}).click();
    await expect(result(page)).toHaveText('apply');
    await expect(page.locator('[aria-current=page]')).toContainText('신규 신청');
  },
  async 'skip-link'(page) {
    const link = page.getByRole('link', {name: '본문 바로가기'});
    await page.keyboard.press('Tab');
    await expect(link).toBeFocused();
    await expect(link).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  },
  async snackbar(page, id, ctx, run) {
    const visible = () => page.locator('krds-snackbar').evaluateAll(es => es.filter(e => { const r = e.shadowRoot.querySelector('[data-krds-part="root"]'); return r && !r.hidden; }).length);
    assert.equal(await visible(), 1);
    await expect(part(page, id, 'title')).toHaveText('저장 완료');
    // Hover keeps the notification; hiding the document pauses exposure; time resumes afterwards.
    await part(page, id, 'root').hover();
    await page.clock.fastForward(6000);
    assert.equal(await visible(), 1);
    await page.mouse.move(1, 700);
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', {configurable: true, get: () => true}); document.dispatchEvent(new Event('visibilitychange')); });
    await page.clock.fastForward(6000);
    assert.equal(await visible(), 1, 'hidden document does not consume exposure');
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await page.clock.fastForward(5100);
    await expect.poll(visible).toBe(0);
    // Fresh load: close focused notification, then activate the configured action.
    await run.reload();
    await part(page, id, 'close').focus();
    await page.keyboard.press('Enter');
    await expect.poll(visible).toBe(0);
    await expect(page.locator('#after-notification')).toBeFocused();
    await run.reload();
    await page.getByRole('button', {name: '실행 취소', exact: true}).click();
    await expect(result(page)).toHaveText('신청 저장을 취소했습니다.');
    assert.equal(await visible(), 0);
  },
  async spinner(page, id) {
    const bar = page.getByRole('progressbar');
    await expect(bar).toHaveAttribute('aria-valuenow', '40');
    await expect(bar).toHaveAccessibleName('신청 내역 불러오는 중');
    await page.getByRole('button', {name: '작업 완료'}).click();
    await expect(result(page)).toHaveText('신청 내역을 불러왔습니다.');
    await expect(part(page, id, 'status')).toContainText('신청 내역을 불러왔습니다.');
  },
  async 'step-indicator'(page) {
    await expect(page.locator('ol')).toBeVisible();
    await expect(page.locator('[aria-current=step]')).toContainText('정보 입력');
    await expect(page.locator('[aria-current=step]')).toContainText('현재 단계');
    await expect(page.locator('ol')).toContainText('완료');
    await expect(page.locator('ol')).toContainText('진행 전');
    const items = await part(page, 'step-indicator', 'item').allTextContents();
    assert.equal(items.length, 3);
    assert.match(items[0], /약관 확인.*완료/); assert.match(items[1], /정보 입력.*현재 단계/); assert.match(items[2], /신청 완료.*진행 전/);
    await expect(page.locator('[aria-current=step]')).toHaveCount(1);
    await expect(page.locator('ol[aria-label="진행 단계"]')).toBeVisible();
  },
  async 'structured-list'(page, id) {
    await expect(page.getByRole('link', {name: /예제 신청 공고/}).first()).toHaveAttribute('href', /route=notice-a/);
    await expect(page.locator('#preview-root')).toContainText('마감일');
    const item = part(page, id, 'item').first();
    const order = await item.evaluate(li => li.querySelector('[data-krds-part="content"]').compareDocumentPosition(li.querySelector('[data-krds-part="actions"]')));
    assert.ok(order & 4, 'actions follow readable content');
    assert.equal(await page.locator('krds-structured-list > krds-button[slot="actions-a"]').count(), 2);
    await page.getByRole('button', {name: '예제 신청 공고 공유'}).click();
    await expect(result(page)).toHaveText('예제 신청 공고을(를) 공유했습니다.');
  },
  async switch(page) {
    const toggle = page.getByRole('switch');
    await expect(toggle).not.toBeChecked();
    await expect(page.getByText('예제 알림 받기')).toBeVisible();
    await toggle.focus(); await toggle.press('Space');
    await expect(toggle).toBeChecked();
    await expect(page.getByText('예제 알림 받기')).toBeVisible();
    await page.getByRole('button', {name: '입력 확인'}).click();
    await expect(page.getByLabel('입력 결과')).toContainText('notification');
    await page.getByRole('button', {name: '입력 초기화'}).click();
    await expect(toggle).not.toBeChecked();
  },
  async 'tab-bar'(page, id, ctx) {
    const nav = page.getByRole('navigation', {name: '주요 페이지'});
    await expect(nav).toBeVisible();
    assert.equal(await page.getByRole('tab').count(), 0);
    await expect(nav.getByRole('link')).toHaveCount(3);
    await expect(nav.getByRole('link', {name: '홈'})).toHaveAttribute('aria-current', 'page');
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    await page.evaluate(() => window.scrollTo(0, 1500));
    await expect(nav).toBeInViewport();
    const link = nav.getByRole('link', {name: '신청'});
    await expect(link).toHaveAttribute('href', /route=apply/);
    await modifiedClickIsNative(page, link);
    await link.focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', {name: '로컬 예제 목적지'})).toBeVisible();
    await expect(page.locator('[data-route-view]')).toContainText('apply');
    assertIdentityQuery(page, id);
  },
  async table(page) {
    await expect(page.getByRole('table')).toHaveAccessibleName('예제 신청 내역');
    await expect(page.getByRole('columnheader', {name: '신청명'})).toBeVisible();
    const cell = page.getByRole('cell', {name: '신청 가'});
    await expect(cell).toBeVisible();
    const headers = await cell.getAttribute('headers');
    assert.equal(await page.locator(`[id="${headers}"]`).textContent(), '신청명');
  },
  async tabs(page) {
    const second = page.getByRole('tab', {name: '상세', exact: true});
    await expect(page.getByRole('tab', {name: '기본', exact: true})).toHaveAttribute('aria-selected', 'true');
    await second.click();
    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('상세 내용');
    assert.equal(await second.getAttribute('aria-controls'), await page.getByRole('tabpanel').getAttribute('id'));
  },
  async tag(page) {
    const seoul = page.getByRole('button', {name: '서울', exact: true});
    await expect(seoul).toHaveAttribute('aria-pressed', 'false');
    await seoul.click();
    await expect(seoul).toHaveAttribute('aria-pressed', 'true');
    await expect(result(page)).toContainText('서울');
    await seoul.press('ArrowRight');
    const busan = page.getByRole('button', {name: '부산', exact: true});
    await expect(busan).toBeFocused();
    await busan.press('Space');
    await expect(busan).toHaveAttribute('aria-pressed', 'true');
    await expect(result(page)).toContainText('서울, 부산');
    await seoul.click();
    await expect(seoul).toHaveAttribute('aria-pressed', 'false');
    await expect(result(page)).toHaveText('선택한 필터: 부산');
  },
  async 'text-input'(page) {
    const input = page.getByRole('textbox');
    await expect(input).toHaveAccessibleName('신청인 이름');
    const described = () => input.evaluate(e => e.ariaDescribedByElements?.map(x => x.textContent));
    assert.deepEqual(await described(), ['신청인 이름을 입력하세요']);
    await expect(page.locator('#name-error')).toBeVisible();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await input.focus();
    await page.keyboard.insertText('신청인');
    await expect(input).toHaveValue('신청인');
    await page.keyboard.insertText(' 홍길동');
    await page.keyboard.press('Backspace');
    await expect(input).toHaveValue('신청인 홍길');
    await expect(input).toHaveAccessibleName('신청인 이름');
    assert.deepEqual(await described(), ['신청인 이름을 입력하세요']);
    await page.getByRole('button', {name: '입력 지우기'}).click();
    await expect(result(page)).toContainText('아이콘 동작을 실행했습니다.');
    await page.getByRole('button', {name: '입력 확인'}).click();
    await expect(page.getByLabel('입력 결과')).toContainText('applicant');
    await page.getByRole('button', {name: '입력 초기화'}).click();
    await expect(input).toHaveValue('');
  },
  async 'text-list'(page, id) {
    const ordered = await hostEl(page, id).evaluate(e => e.ordered);
    await expect(page.getByRole('listitem')).toHaveCount(2);
    assert.equal(await part(page, id, 'root').evaluate(e => e.tagName), ordered ? 'OL' : 'UL');
    // The shared sheet numbers ordered items either natively or with a list-item counter marker.
    const numbered = await part(page, id, 'item').first().evaluate(e => getComputedStyle(e).listStyleType === 'decimal' || /counter\(list-item/.test(getComputedStyle(e, '::before').content));
    assert.equal(numbered, !!ordered);
  },
  async textarea(page) {
    const area = page.getByRole('textbox');
    await expect(area).toHaveAccessibleName('신청 사유');
    await area.focus();
    await page.keyboard.insertText('신청 사유');
    await page.keyboard.press('Enter');
    await page.keyboard.insertText('서류를 확인했습니다.');
    await expect(area).toHaveValue('신청 사유\n서류를 확인했습니다.');
    await expect(area).toHaveAccessibleName('신청 사유');
    await page.getByRole('button', {name: '입력 초기화'}).click();
    await expect(area).toHaveValue('');
  },
  async toast(page, id) {
    const save = page.getByRole('button', {name: '신청 저장'});
    await expect(part(page, id, 'root')).toBeHidden();
    await save.focus(); await save.click();
    await expect(part(page, id, 'root')).toBeVisible();
    await expect(part(page, id, 'message')).toHaveText('신청이 저장되었습니다.');
    assert.equal(await part(page, id, 'message').getAttribute('role'), 'status');
    await expect(page.locator('#saved-result')).toHaveText('신청이 저장되었습니다.');
    await expect(save).toBeFocused();
    await page.clock.fastForward(3100);
    await expect(part(page, id, 'root')).toBeHidden();
    await expect(page.locator('#saved-result')).toHaveText('신청이 저장되었습니다.');
  },
  async tooltip(page, id) {
    const trigger = page.getByRole('button', {name: '신청 도움말', exact: true});
    const tip = page.getByRole('tooltip');
    await expect(tip).toBeHidden();
    await trigger.hover();
    await expect(tip).toBeVisible(); await expect(tip).toHaveText('신청 도움말을 엽니다');
    await trigger.focus(); // keyboard events must target the sandboxed frame
    await page.keyboard.press('Escape');
    await expect(tip).toBeHidden();
    await page.mouse.move(1050, 850);
    await trigger.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).toBeFocused();
    await expect(tip).toBeVisible(); await expect(tip).toHaveText('신청 도움말을 엽니다');
    await expect(trigger).toHaveAccessibleDescription('신청 도움말을 엽니다');
  },
  async tts(page, id) {
    await expect(page.getByRole('note')).toContainText('시뮬레이션');
    await expect(page.locator('[data-tts-state]')).toHaveText('시뮬레이션 상태: 준비');
    await page.getByRole('button', {name: '음성 안내 재생'}).click();
    await expect(page.locator('[data-tts-state]')).toHaveText('시뮬레이션 상태: 읽는 중');
    await page.getByRole('button', {name: '음성 안내 일시정지'}).click();
    await expect(page.locator('[data-tts-state]')).toHaveText('시뮬레이션 상태: 일시 정지됨');
    await page.getByRole('button', {name: '음성 안내 중지'}).click();
    await expect(page.locator('[data-tts-state]')).toHaveText('시뮬레이션 상태: 준비');
    await expect(page.getByRole('note')).toContainText('시뮬레이션');
  },
  async 'tutorial-panel'(page, id) {
    const status = page.locator('[data-tutorial-status]');
    await expect(status).toHaveText('현재 대상: 없음');
    const start = part(page, id, 'start').first();
    await expect(part(page, id, 'tab')).toHaveCount(2);
    await expect(part(page, id, 'tab').and(page.locator('[aria-selected="true"]'))).toHaveText('튜토리얼');
    // Overview: every task is listed and there is no back control.
    await expect(part(page, id, 'title')).toHaveText('따라하기');
    await expect(part(page, id, 'task')).toHaveCount(2);
    await expect(part(page, id, 'back')).toHaveCount(0);
    await expect(part(page, id, 'step').and(page.locator('[aria-current="step"]'))).toHaveCount(0);
    await expect(page.locator('krds-tutorial-panel #tutorial-start')).toHaveCount(1);
    // Mounted baseline (controller ruling): panel open, tutorial tab, NOT running, start action present and enabled.
    assert.equal(await hostEl(page, id).evaluate(e => e.shadowRoot.querySelector('[part="root"]').dataset.krdsState), 'open idle');
    await expect(start).toBeVisible(); await expect(start).toBeEnabled();
    await expect(page.getByRole('button', {name: '따라하기 중지'})).toHaveCount(0);
    await expect(page.getByRole('tab', {name: '튜토리얼'})).toHaveAttribute('aria-selected', 'true');
    await start.click();
    await expect(status).toHaveText('현재 대상: 신청인 이름');
    await expect(page.locator('#applicant-name')).toHaveAttribute('data-tour-active', '');
    // Task view: only the active task is listed and the back control is labelled 작업 목록.
    await expect(part(page, id, 'task')).toHaveCount(1);
    await expect(part(page, id, 'task')).toContainText('예제 신청하기');
    await expect(part(page, id, 'back')).toHaveAccessibleName('작업 목록');
    await expect(part(page, id, 'step')).toHaveCount(2);
    await expect(part(page, id, 'step').and(page.locator('[aria-current="step"]'))).toContainText('이름 입력');
    await part(page, id, 'step').filter({hasText: '신청 저장'}).click();
    await expect(part(page, id, 'step').and(page.locator('[aria-current="step"]'))).toContainText('신청 저장');
    await expect(status).toHaveText('현재 대상: 신청 저장');
    await expect(page.locator('#save-application')).toHaveAttribute('data-tour-active', '');
    await expect(page.locator('#applicant-name')).not.toHaveAttribute('data-tour-active', '');
    await page.screenshot({path: resolve(evidence, 'tutorial-panel-task-view.png')});
    await part(page, id, 'back').click();
    await expect(part(page, id, 'task')).toHaveCount(2);
    await expect(part(page, id, 'back')).toHaveCount(0);
    await page.screenshot({path: resolve(evidence, 'tutorial-panel-overview.png')});
    await page.getByRole('button', {name: '따라하기 중지'}).click();
    await expect(status).toHaveText('현재 대상: 없음');
    await expect(page.locator('#save-application')).not.toHaveAttribute('data-tour-active', '');
    await expect(start).toBeFocused();
  },
  async 'visually-hidden'(page) {
    // The reference is an element reflection set on krds-button's rendered button (Playwright's own description
    // computation only reads aria-describedby ids), so read the browser's real accessibility tree.
    const cdp = await page.real.context().newCDPSession(page.real);
    await cdp.send('DOM.enable');
    const {root: document} = await cdp.send('DOM.getDocument', {depth: -1, pierce: true});
    const frameDocument = (node) => node.contentDocument ?? (node.children ?? []).map(frameDocument).find(Boolean);
    const {nodes} = await cdp.send('Accessibility.queryAXTree', {backendNodeId: frameDocument(document).backendNodeId, role: 'button', accessibleName: '신청 확인'});
    assert.deepEqual(nodes.map(n => n.description?.value), ['신청 내용을 확인하세요']);
    await cdp.detach();
    await expect(page.getByRole('button', {name: '신청 확인'})).toBeVisible();
    const box = await page.locator('krds-visually-hidden').evaluate(e => { const r = e.shadowRoot.querySelector('[data-krds-part="root"]'); const s = getComputedStyle(r); const b = r.getBoundingClientRect(); return {position: s.position, w: b.width, h: b.height}; });
    assert.equal(box.position, 'absolute');
    assert.ok(box.w <= 1 && box.h <= 1, `visually absent: ${JSON.stringify(box)}`);
    const semantics = await page.locator('krds-visually-hidden').evaluate(e => { const r = e.shadowRoot.querySelector('[data-krds-part="root"]'); const s = getComputedStyle(r); return {text: r.textContent.trim(), display: s.display, visibility: s.visibility, ariaHidden: !!e.closest('[aria-hidden="true"]') || r.getAttribute('aria-hidden') === 'true', clipped: s.overflow === 'hidden' || s.clipPath !== 'none' || s.clip !== 'auto'}; });
    assert.deepEqual(semantics, {text: '신청 내용을 확인하세요', display: semantics.display, visibility: 'visible', ariaHidden: false, clipped: true});
    assert.notEqual(semantics.display, 'none');
    assert.equal(await page.locator('#hidden-help').getAttribute('id'), 'hidden-help');
  },
};
// Components with the same shell behaviour but a distinct acceptance entry keep their own scenario keys.

const replayEvents = ['click', 'value-change', 'checked-change', 'open-change', 'selection-change', 'files-change', 'page-change', 'action', 'request', 'back-request', 'locale-request', 'playing-change', 'dismiss', 'step-change', 'start', 'stop', 'topic-change', 'active-change', 'expanded-change', 'icon-action', 'menu-request'];
// Examples whose handlers announce into the output: replaying events on the live element must visibly change it.
const visibleReaction = new Set(['button', 'accordion', 'back-button', 'bottom-sheet', 'calendar', 'checkbox', 'contextual-help', 'date-input', 'disclosure', 'fab', 'file-upload', 'help-panel', 'language-switcher', 'in-page-navigation', 'native-select', 'pagination', 'quantity-toggle', 'radio-group', 'range-slider', 'resize', 'side-navigation', 'snackbar', 'switch', 'tabs', 'tag', 'text-input', 'textarea', 'tooltip', 'tts']);
const disposal = [];
// Verifier-only page hook: tracks live document/window listeners (no production bridge).
const trackListeners = () => {
  const live = new Map(); const ids = new WeakMap(); let next = 0;
  const key = (target, type, listener, options) => `${target === window ? 'w' : 'd'}|${type}|${(typeof options === 'object' ? options.capture : options) ? 1 : 0}|${ids.get(listener) ?? ids.set(listener, ++next).get(listener)}`;
  for (const target of [window, document]) {
    const add = target.addEventListener.bind(target); const remove = target.removeEventListener.bind(target);
    target.addEventListener = (type, listener, options) => { if (listener) { live.set(key(target, type, listener, options), 1); if (options?.signal) options.signal.addEventListener('abort', () => live.delete(key(target, type, listener, options))); if (options?.once) { const k = key(target, type, listener, options); add(type, function wrap() { live.delete(k); }, {...options, once: true}); } } return add(type, listener, options); };
    target.removeEventListener = (type, listener, options) => { if (listener) live.delete(key(target, type, listener, options)); return remove(type, listener, options); };
  }
  // Verifier-only instrumentation: count listeners registered with an AbortSignal (the examples' own) and their invocations.
  const infos = new WeakMap(); const order = [];
  const proto = EventTarget.prototype; const protoAdd = proto.addEventListener;
  proto.addEventListener = function (type, listener, options) {
    const signal = typeof options === 'object' ? options?.signal : undefined;
    if (!signal || !listener) return protoAdd.call(this, type, listener, options);
    let info = infos.get(signal);
    if (!info) { info = {registered: 0, calls: 0, aborted: false, targets: new Set()}; infos.set(signal, info); order.push(info); signal.addEventListener('abort', () => { info.aborted = true; }); }
    info.registered++; info.targets.add(this);
    const counted = function (event) { info.calls++; return typeof listener === 'function' ? listener.call(this, event) : listener.handleEvent(event); };
    return protoAdd.call(this, type, counted, options);
  };
  window.__krdsSignalInfo = element => { const form = element.closest('form'); const found = order.filter(i => i.targets.has(element) || (form && i.targets.has(form))); return {registered: found.reduce((n, i) => n + i.registered, 0), calls: found.reduce((n, i) => n + i.calls, 0), live: found.filter(i => !i.aborted).reduce((n, i) => n + i.registered, 0)}; };
  window.__krdsVerifyListeners = () => [...live.keys()].filter(k => !k.includes('|krds-example-disposed|')).length;
};
const clockIds = new Set(['carousel', 'snackbar', 'toast']);
const results = [];
const only = process.env.LIT_ONLY ? new Set(process.env.LIT_ONLY.split(',')) : null;
try {
  for (const demo of definitions) {
    const id = demo.componentId;
    if (only && !only.has(id)) continue;
    const context = await browser.newContext({viewport: {width: 1100, height: 900}});
    const errors = []; const bad = [];
    const wire = page => {
      page.setDefaultTimeout(5000);
      page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
      page.on('console', m => { if (m.type() === 'error' && !(id === 'image' && /status of 404/.test(m.text()) && m.location().url === `${origin}${base}local-assets/intentional-missing-image.svg`)) errors.push(`console: ${m.text()}`); });
    };
    context.on('page', wire);
    await context.addInitScript(trackListeners);
    context.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) bad.push(`outside loopback: ${r.url()}`); });
    context.on('response', r => { if (r.status() >= 400 && !(id === 'image' && r.status() === 404 && r.url() === `${origin}${base}local-assets/intentional-missing-image.svg`)) bad.push(`HTTP ${r.status()}: ${r.url()}`); });
    const real = await context.newPage();
    const page = makeView(real);
    try {
      const scenario = scenarios[id];
      assert.ok(scenario, `acceptance ${demo.acceptanceId} has no scenario`);
      if (clockIds.has(id)) await page.clock.install();
      const preview = `${base}index.html?component=${id}&example=default&version=1&framework=lit&componentId=${id}&exampleId=default&token=${token}`;
      const entry = `${origin}/parent.html?src=${encodeURIComponent(preview)}`;
      const load = async () => {
        await real.goto(entry);
        await expect.poll(() => real.frames().some(f => f.name() === 'f' && f.url().includes('/index.html'))).toBe(true); await expect(page.locator('[data-preview-return]')).toBeVisible(); 
        // Embedded transport: ready and size arrive from the sandboxed frame with the exact identity.
        await expect.poll(async () => (await frameMessages(page)).map(m => m.data.type)).toEqual(expect.arrayContaining(['ready', 'size']));
        for (const m of await frameMessages(page)) { assert.equal(m.origin, origin); assert.equal(m.fromFrame, true); assert.deepEqual([m.data.version, m.data.framework, m.data.componentId, m.data.exampleId, m.data.token], [1, 'lit', id, 'default', token]); }
        assert.ok((await frameMessages(page)).some(m => m.data.type === 'size' && m.data.height > 0));
        // The host's init handler applies the presentation to the frame document (its re-measure coalesces with the ready measure).
        await expect.poll(() => page.evaluate(() => [document.documentElement.dataset.previewColorMode, document.documentElement.dataset.previewReducedMotion])).toEqual(['forced-colors', 'true']);
      };
      await load();
            await expect(hostEl(page, id)).toHaveCount(1);
      assert.equal(await hostEl(page, id).evaluate(e => !!e.shadowRoot || e.constructor.name === 'Favicon'), true, 'actual Lit custom element');
      await page.waitForTimeout(80);
      // R2: every host control is the public krds-button; the example authors no raw <button>, and reset rows follow the result.
      assert.equal(await page.evaluate(() => document.querySelectorAll('#preview-root button:not([data-preview-return])').length), 0, 'no raw <button> in the example host');
      assert.equal(await page.evaluate(() => [...document.querySelectorAll('#preview-root form > krds-button, #preview-root [data-demo-actions] krds-button')].every(e => e.shadowRoot?.querySelector('button[data-krds-component="button"]'))), true, 'host controls are actual krds-button elements');
      assert.equal(await page.evaluate(() => { const result = document.querySelector('[data-demo-result]'); const row = document.querySelector('[data-demo-actions]'); return row ? !result.contains(row) && !!(result.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING) : true; }), true, 'reset row follows the result region');
      // The host root is flush with the page padding at any width (rem is 10px under KRDS base; no max-width centring).
      assert.ok(await page.evaluate(() => document.querySelector('#preview-root > form').getBoundingClientRect().left <= 24), 'host content is not indented');
      const before = await signature(page);
      const listenersAtLoad = await page.evaluate(() => window.__krdsVerifyListeners());
      assert.equal(await page.evaluate(() => (document.querySelector('[data-krds-component="button"][data-preview-return]') ?? document.querySelector('[data-preview-return]')) !== null), true);
      await scenario(page, id, context, {reload: load});
      await page.screenshot({path: resolve(evidence, `${id}.png`), fullPage: true});
      {
        // The reset control replaces the native instance and restores the baseline.
        if (['breadcrumb', 'footer', 'link', 'main-menu', 'tab-bar', 'snackbar'].includes(id)) { await load(); await page.waitForTimeout(80); }
        const old = await hostEl(page, id).evaluateHandle(e => e);
        const oldHandles = await old.evaluateHandle(el => ({element: el, output: document.querySelector('[data-demo-result]')}));
        const replay = () => oldHandles.evaluate(({element, output}, names) => {
          output.textContent = '탐침'; const text = output.textContent; let threw = null;
          const sink = e => { threw = e.message; };
          addEventListener('error', sink);
          const form = element.closest('form');
          const start = window.__krdsSignalInfo(element);
          for (const name of names) element.dispatchEvent(new CustomEvent(name, {detail: {value: [], ids: ['a'], id: 'a', open: false, page: 2, checked: true, action: 'play', playing: true, taskId: 'apply', stepId: 'one', locale: 'en', rejected: [], expanded: true}, bubbles: true}));
          form.dispatchEvent(new Event('submit', {cancelable: true}));
          removeEventListener('error', sink);
          const end = window.__krdsSignalInfo(element);
          return {before: text, after: output.textContent, threw, registered: end.registered, live: end.live, calls: end.calls - start.calls};
        }, replayEvents);
        // (a) positive control: the live listeners react to the replayed events.
        const live = await replay();
        assert.equal(live.threw, null);
        assert.ok(live.registered > 0 && live.live === live.registered && live.calls > 0, `listeners are registered, live and invoked before dispose: ${JSON.stringify(live)}`);
        if (visibleReaction.has(id)) assert.notEqual(live.after, live.before, 'live listener visibly changes the output');
        // The shell recreates the frame; the production pagehide path disposes the example and the host.
        await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
        await expect.poll(() => old.evaluate(e => e.isConnected)).toBe(false);
        await old.dispose();
        // (b) after dispose the same interaction no longer changes the output; the replay itself invokes no example listener.
        const dead = await replay();
        assert.equal(dead.after, dead.before, 'disposed listeners are removed');
        assert.equal(dead.calls, 0, 'no example listener is invoked after dispose');
        assert.equal(dead.live, 0, 'every signal-bound listener is aborted');
        assert.equal(dead.registered, live.registered);
        const stats = {registered: live.registered, calls: live.calls};
        await oldHandles.dispose();
        // (c) after dispose nothing of the example remains and document/window listeners did not accumulate.
        await expect(hostEl(page, id)).toHaveCount(0);
        const live2 = await page.evaluate(() => window.__krdsVerifyListeners?.() ?? null);
        assert.ok(live2 <= listenersAtLoad, `document/window listeners released on dispose: ${live2} <= ${listenersAtLoad}`);
        disposal.push({id, registered: stats.registered, liveAfterAbort: dead.live, replayCallsLive: stats.calls, replayCallsAfterDispose: dead.calls, visibleReaction: visibleReaction.has(id)});
      }
      await load();
      await page.waitForTimeout(80);
      await page.locator('[data-preview-return]').evaluate(el => el.click());
      await expect.poll(async () => (await frameMessages(page)).some(m => m.data.type === 'return-focus' && m.fromFrame && m.data.token === token)).toBe(true);
      assert.deepEqual(await signature(page), before, 'reload restores the baseline');
      assert.deepEqual(errors, [], 'no page/console errors');
      assert.deepEqual(bad, [], 'no external or failed requests');
      results.push({componentId: id, acceptanceId: demo.acceptanceId, status: 'passed'});
      console.log('PASS', id);
    } catch (error) {
      results.push({componentId: id, acceptanceId: demo.acceptanceId, status: 'failed', error: String(error).slice(0, 700), errors, bad});
      console.log('FAIL', id, String(error).split('\n').slice(0, 6).join(' | ').slice(0, 500), errors.length ? JSON.stringify(errors) : '', bad.length ? JSON.stringify(bad) : '');
    } finally { await context.close(); }
  }
} finally {
  await browser.close();
  await new Promise(r => server.close(r));
  const manifest = await readFile(resolve(root, 'artifact-manifest.json')).catch(() => Buffer.alloc(0));
  await writeFile(resolve(evidence, 'results.json'), JSON.stringify({artifact: root, manifestSha256: createHash('sha256').update(manifest).digest('hex'), results, disposal}, null, 2) + '\n');
}
const passed = results.filter(r => r.status === 'passed').length;
console.log(`${passed}/${only ? results.length : 54} native Lit acceptance scenarios passed.`);
if (!only) assert.equal(results.length, 54);
const failed = results.filter(r => r.status === 'failed');
if (failed.length) { console.log('FAILED: ' + failed.map(f => f.componentId).join(', ')); process.exitCode = 1; }
