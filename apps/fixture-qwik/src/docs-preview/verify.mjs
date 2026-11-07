// Owner-level native Qwik acceptance: serves the static artifact at its final prefix from loopback and drives every acceptance ID.
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';

const repo = fileURLToPath(new URL('../../../..', import.meta.url));
const artifact = resolve(repo, process.env.QWIK_PREVIEW_ARTIFACT || 'apps/fixture-qwik/dist/docs-preview');
const only = process.env.QWIK_PREVIEW_ONLY?.split(',').filter(Boolean);
// Subset runs never overwrite the full-run evidence: they write beneath qwik-browser/subset/.
const evidence = resolve(repo, '.superpowers/sdd/2026-11-01-native-live-previews/qwik-browser', only ? 'subset' : '');
const resultFile = resolve(evidence, only ? 'result-subset.json' : 'result.json');
mkdirSync(evidence, { recursive: true });
const prefix = '/krds/previews/qwik/';
const acceptance = JSON.parse(readFileSync(resolve(repo, 'apps/docs/demo-acceptance.json'), 'utf8')).items;
const definitions = JSON.parse(readFileSync(new URL('./definitions.json', import.meta.url), 'utf8')).demos.filter(d => d.exampleId === 'default');
const manifest = JSON.parse(readFileSync(resolve(artifact, 'q-manifest.json'), 'utf8'));
const symbolKinds = new Map(Object.entries(manifest.symbols).map(([name, s]) => [name, `${s.ctxKind}:${s.ctxName}`]));
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.wav': 'audio/wav' };

// Embedded proof parent: a tiny loopback page that owns the iframe like the docs shell (identity, token, init, return-focus target).
const parentPage = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Qwik owner parent</title></head><body>
<button id="before" type="button">예시 앞</button><div id="frame-slot"></div><div id="exit" tabindex="-1">예시 다음: 소스 코드</div>
<script type="module">
const params = new URLSearchParams(location.search); const entry = params.get('entry'); const componentId = params.get('component');
window.__messages = []; let identity; let frame;
window.__mount = () => {
  identity = { version: 1, framework: 'qwik', componentId, exampleId: 'default', token: crypto.randomUUID().replaceAll('-', '') };
  const url = new URL(entry, location.origin); for (const [k, v] of Object.entries(identity)) url.searchParams.set(k, String(v));
  frame?.remove(); frame = document.createElement('iframe'); frame.title = componentId + ' 네이티브 미리보기'; frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  frame.style.cssText = 'width:1000px;height:800px;border:0'; frame.src = url.href;
  frame.addEventListener('load', () => frame.contentWindow.postMessage({ ...identity, type: 'init', presentation: { colorMode: 'light', reducedMotion: true } }, location.origin));
  document.getElementById('frame-slot').append(frame); return identity.token;
};
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== frame?.contentWindow) return;
  const m = event.data; if (!m || ['version','framework','componentId','exampleId','token'].some(k => m[k] !== identity[k])) return;
  window.__messages.push({ type: m.type, height: m.height, token: m.token });
  if (m.type === 'return-focus') document.getElementById('exit').focus();
});
window.__mount();
</script></body></html>`;

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname === '/owner-parent.html') { res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(parentPage); return; }
  if (!url.pathname.startsWith(prefix) || url.pathname.includes('..')) { res.writeHead(404).end(); return; }
  let path = resolve(artifact, decodeURIComponent(url.pathname.slice(prefix.length)));
  if (existsSync(path) && statSync(path).isDirectory()) path = resolve(path, 'index.html');
  if (!path.startsWith(artifact + '/') || !existsSync(path)) { res.writeHead(404).end(); return; }
  res.setHeader('content-type', mime[extname(path)] || 'application/octet-stream'); res.end(readFileSync(path));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const entry = id => `${prefix}${id}/default/index.html`;
const missingImageUrl = `${origin}${prefix}local-assets/intentional-missing-image.svg`;
const clocked = new Set(['carousel', 'snackbar']);
const tick = page => page.clock.runFor(100);
// Image must expose its error state even when the SSR <img> fails before resumption (package fix in final round 2).
let record_imageState;

const part = (page, id, name) => page.locator(`[data-krds-component="${id}"][data-krds-part="${name}"]`);
const signature = page => page.locator('#preview-root').evaluate(root => ({
  text: root.innerText,
  inputs: [...root.querySelectorAll('input,select,textarea')].map(e => [e.name, e.type === 'file' ? e.files.length : e.value, e.checked]),
  aria: [...root.querySelectorAll('[aria-checked],[aria-selected],[aria-pressed],[aria-expanded],[aria-valuenow],[aria-current]')].map(e => ['aria-checked', 'aria-selected', 'aria-pressed', 'aria-expanded', 'aria-valuenow', 'aria-current'].map(a => e.getAttribute(a))),
  dialogs: [...document.querySelectorAll('dialog,[role=dialog]')].map(e => e.hasAttribute('open') || (e.getAttribute('role') === 'dialog' && e.checkVisibility())),
}));
/** Every document (top-level or sandboxed) must keep element ids unique, at baseline and after the scenario. */
const assertUniqueIds = async (page, when) => { const duplicates = await page.locator('html').evaluate(() => { const seen = new Map(); for (const e of document.querySelectorAll('[id]')) seen.set(e.id, (seen.get(e.id) ?? 0) + 1); return [...seen].filter(([, n]) => n > 1).map(([id, n]) => `${id}×${n}`); }); assert.deepEqual(duplicates, [], `duplicate element ids ${when}`); };
const routeShown = async (page, path) => { await expect(page.locator(`#route-${path.replace(/[^a-z0-9]+/g, '-')}`)).toBeVisible(); await expect(page.getByRole('heading', { name: '로컬 예제 목적지' }).filter({ visible: true })).toHaveCount(1); };
const status = page => page.locator('#preview-root .preview-status');
const reset = page => page.getByRole('button', { name: '입력 초기화' });
const submit = page => page.getByRole('button', { name: '입력 확인' });
const formResult = page => page.getByLabel('입력 결과');
/** Real IME composition through Chromium's input pipeline (compositionstart/update/end), then a committed insert. */
async function compose(page, partial, committed) { const cdp = await page.context().newCDPSession(page); for (const text of partial) await cdp.send('Input.imeSetComposition', { text, selectionStart: text.length, selectionEnd: text.length }); await cdp.send('Input.insertText', { text: committed }); await cdp.detach(); }

/** Each scenario performs the acceptance actions and asserts its observable outcome. `native` marks outcomes owned by browser anchors (no QRL). */
const scenarios = {
  async button(page) { await page.getByRole('button', { name: '신청하기', exact: true }).click(); await expect(status(page)).toHaveText('신청 버튼을 1회 눌렀습니다.'); },
  async 'text-input'(page) {
    const input = page.getByRole('textbox', { name: '신청인 이름' }); await expect(input).toHaveAccessibleDescription(/신청인 이름을 입력하세요/);
    await input.focus(); await compose(page, ['ㅅ', '시', '신', '신청', '신청이', '신청인'], '신청인'); await expect(input).toHaveValue('신청인');
    await page.keyboard.insertText(' 홍길동'); await expect(input).toHaveValue('신청인 홍길동'); await input.press('End'); await page.keyboard.press('Backspace'); await expect(input).toHaveValue('신청인 홍길'); await page.keyboard.type('동');
    await expect(input).toHaveValue('신청인 홍길동'); await expect(input).toHaveAccessibleName('신청인 이름'); await expect(input).toHaveAccessibleDescription(/신청인 이름을 입력하세요/);
    await submit(page).click(); await expect(formResult(page)).toContainText('"applicant":"신청인 홍길동"'); await reset(page).click(); await expect(input).toHaveValue(''); await expect(formResult(page)).toHaveText('');
  },
  async textarea(page) {
    const input = page.getByRole('textbox', { name: '신청 사유' }); await input.focus(); await compose(page, ['ㅅ', '신', '신청'], '신청 사유'); await expect(input).toHaveValue('신청 사유'); await page.keyboard.insertText('\n서류를 확인했습니다.');
    await expect(input).toHaveValue('신청 사유\n서류를 확인했습니다.'); await expect(input).toHaveAccessibleName('신청 사유');
    await submit(page).click(); await expect(formResult(page)).toContainText('서류를 확인했습니다'); await reset(page).click(); await expect(input).toHaveValue('');
  },
  async 'native-select'(page) { const s = page.getByLabel('지역', { exact: true }); await s.selectOption('busan'); await expect(s).toHaveValue('busan'); await submit(page).click(); await expect(formResult(page)).toContainText('"region":"busan"'); },
  async checkbox(page) {
    const c = page.getByRole('checkbox', { name: '이용약관 동의' }), root = part(page, 'checkbox', 'root'), committed = state => expect(root).toHaveAttribute('data-krds-state', new RegExp(`(^|\\s)${state}(\\s|$)`));
    // Each toggle is asserted on both the native control and the adapter's committed state before the next user action.
    await page.getByText('이용약관 동의', { exact: true }).click(); await expect(c).toBeChecked(); await committed('checked');
    await c.press('Space'); await expect(c).not.toBeChecked(); await committed('unchecked'); await c.press('Space'); await expect(c).toBeChecked(); await committed('checked'); await submit(page).click(); await expect(formResult(page)).toContainText('"consent":"agreed"');
    await reset(page).click(); await expect(c).not.toBeChecked();
  },
  async 'radio-group'(page) {
    const seoul = page.getByRole('radio', { name: '서울', exact: true }), busan = page.getByRole('radio', { name: '부산', exact: true });
    await expect(page.getByRole('radio', { name: '제주' })).toBeDisabled(); await seoul.focus(); await page.keyboard.press('ArrowDown'); await expect(busan).toBeFocused(); await expect(busan).toBeChecked();
    await submit(page).click(); await expect(formResult(page)).toContainText('"region":"busan"'); await expect(page.getByRole('radio', { checked: true })).toHaveCount(1);
    await reset(page).click(); await expect(busan).not.toBeChecked();
  },
  async switch(page) { const c = page.getByRole('switch', { name: '예제 알림 받기' }); await c.focus(); await c.press('Space'); await expect(c).toBeChecked(); await expect(c).toHaveAccessibleName('예제 알림 받기'); await reset(page).click(); await expect(c).not.toBeChecked(); },
  async 'range-slider'(page) { const c = page.getByRole('slider', { name: '예제 비율' }); await c.focus(); await c.press('ArrowRight'); await expect(c).toHaveValue('60'); await submit(page).click(); await expect(formResult(page)).toContainText('"ratio":"60"'); await reset(page).click(); await expect(c).toHaveValue('50'); },
  async 'quantity-toggle'(page) {
    const output = part(page, 'quantity-toggle', 'output'), hidden = part(page, 'quantity-toggle', 'hidden-input'), inc = part(page, 'quantity-toggle', 'increment'), dec = part(page, 'quantity-toggle', 'decrement');
    await inc.click(); await expect(output).toHaveText('3개'); await expect(hidden).toHaveValue('3'); await dec.click(); await expect(output).toHaveText('2개'); await inc.click(); await expect(output).toHaveText('3개');
    await submit(page).click(); await expect(formResult(page)).toContainText('"quantity":"3"'); await reset(page).click(); await expect(output).toHaveText('2개'); await expect(hidden).toHaveValue('2');
  },
  async 'date-input'(page) { const input = page.getByRole('textbox', { name: /방문일/ }).first(); await input.fill('2024-02-20'); await input.blur(); await expect(input).toHaveValue('2024-02-20'); await expect(input).not.toHaveAttribute('aria-invalid', 'true'); await expect(status(page)).toHaveText('입력한 방문일: 2024-02-20'); },
  async calendar(page) { const day = page.getByRole('button', { name: /2024년 2월 20일/ }); await day.click(); await expect(day).toHaveAttribute('aria-pressed', 'true'); await page.getByRole('button', { name: '확인', exact: true }).click(); await expect(status(page)).toHaveText('선택한 날짜: 2024-02-20'); },
  async modal(page, shot) {
    const open = page.getByRole('button', { name: '열기', exact: true }); await open.click(); const dialog = page.getByRole('dialog', { name: '신청 확인' }); await expect(dialog).toBeVisible(); await shot('modal-open');
    await page.keyboard.press('Escape'); await expect(dialog).toBeHidden(); await expect(open).toBeFocused(); await expect(status(page)).toHaveText('대화상자: 닫힘');
    await open.click(); await expect(dialog).toBeVisible(); await dialog.getByRole('button', { name: '확인', exact: true }).click(); await expect(dialog).toBeHidden(); await expect(open).toBeFocused(); await shot('modal-closed-focus');
  },
  async tabs(page) { const tab = page.getByRole('tab', { name: '상세', exact: true }); await tab.click(); await expect(tab).toHaveAttribute('aria-selected', 'true'); await expect(page.getByRole('tabpanel')).toContainText('상세 내용'); },
  async 'file-upload'(page, shot) {
    const input = page.locator('input[type=file]'); await input.setInputFiles({ name: '신청서-A.txt', mimeType: 'text/plain', buffer: Buffer.from('local A') });
    await expect(status(page)).toHaveText('선택한 파일: 신청서-A.txt'); await shot('file-upload-selected');
    await page.getByRole('button', { name: '제출' }).click(); await expect(page.getByLabel('제출 결과')).toHaveText('신청서-A.txt');
    await page.getByRole('button', { name: /삭제|제거/ }).click(); await expect(status(page)).toHaveText('선택한 파일: 없음'); await expect(input).toHaveValue(''); await expect(page.locator('#preview-root')).not.toContainText('신청서-A.txt', { timeout: 1000 }).catch(async () => { await expect(page.getByRole('listitem').filter({ hasText: '신청서-A.txt' })).toHaveCount(0); }); await shot('file-upload-removed');
  },
  async accordion(page) {
    const triggers = part(page, 'accordion', 'trigger'); await expect(triggers).toHaveCount(2); await triggers.first().focus(); await page.keyboard.press('Tab'); await expect(triggers.nth(1)).toBeFocused();
    const t = triggers.first(); await t.focus(); await page.keyboard.press('Enter'); await expect(t).toHaveAttribute('aria-expanded', 'true'); await expect(part(page, 'accordion', 'panel').first()).toBeVisible(); await expect(part(page, 'accordion', 'panel').first()).toContainText('예제 신청 자격 안내');
    await page.keyboard.press('Space'); await expect(t).toHaveAttribute('aria-expanded', 'false');
  },
  async disclosure(page) { const c = page.getByRole('button', { name: '신청 도움말' }); await expect(page.locator('#application-help')).toBeHidden(); await c.focus(); await c.press('Enter'); await expect(c).toHaveAttribute('aria-expanded', 'true'); await expect(page.locator('#application-help')).toBeVisible(); await c.press('Space'); await expect(c).toHaveAttribute('aria-expanded', 'false'); },
  async fab(page) { await page.getByRole('button', { name: '새 신청', exact: true }).focus(); await page.keyboard.press('Enter'); await expect(status(page)).toHaveText('새 신청 1건'); },
  async tag(page) { const c = page.getByRole('button', { name: '서울', exact: true }); await c.click(); await expect(c).toHaveAttribute('aria-pressed', 'true'); await expect(status(page)).toHaveText('선택 지역: 서울'); await c.press('ArrowRight'); await expect(page.getByRole('button', { name: '부산', exact: true })).toBeFocused(); },
  async resize(page) {
    const c = part(page, 'resize', 'trigger'), scaled = page.locator('section.preview-scaled'); const base = await scaled.evaluate(e => parseFloat(getComputedStyle(e).fontSize));
    await c.focus(); await c.press('ArrowDown'); await expect(part(page, 'resize', 'current')).toHaveText('110%'); await expect.poll(() => scaled.evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBeCloseTo(base * 1.1, 0);
    await c.click(); await expect(part(page, 'resize', 'list')).toBeVisible(); await part(page, 'resize', 'list').getByRole('button', { name: '130%' }).click(); await expect(part(page, 'resize', 'current')).toHaveText('130%');
    await expect.poll(() => scaled.evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBeCloseTo(base * 1.3, 0); await scaled.getByRole('button', { name: '작업' }).focus(); await expect(scaled.getByRole('button', { name: '작업' })).toBeFocused();
  },
  async tts(page) {
    await expect(page.getByRole('note')).toContainText('시뮬레이션'); const state = part(page, 'tts', 'root');
    await page.getByRole('button', { name: '음성 안내 재생' }).click(); await expect(state).toHaveAttribute('data-krds-state', /playing/);
    await part(page, 'tts', 'pause').click(); await expect(state).toHaveAttribute('data-krds-state', /paused/); await part(page, 'tts', 'stop').click(); await expect(state).not.toHaveAttribute('data-krds-state', /playing|paused/);
    await expect(page.getByRole('note')).toContainText('시뮬레이션'); await expect(page.getByRole('button', { name: '음성 안내 재생' })).toBeVisible();
  },
  async tooltip(page) { const c = page.locator('#help-trigger'); await c.hover(); await expect(page.locator('#help-tooltip')).toBeVisible(); await page.keyboard.press('Escape'); await expect(page.locator('#help-tooltip')).toBeHidden(); await page.mouse.move(990, 790); await page.keyboard.press('Shift+Tab'); await expect(c).not.toBeFocused(); await c.focus(); await expect(page.locator('#help-tooltip')).toBeVisible(); await expect(c).toHaveAccessibleDescription('신청 도움말을 엽니다'); },
  async 'contextual-help'(page) { const content = part(page, 'contextual-help', 'popover'); await expect(content).toBeHidden(); await page.getByRole('button', { name: '신청 자격 도움말', exact: true }).click(); await expect(content).toBeVisible(); await expect(content).toContainText('신청 자격에 관한 예제 설명입니다.'); await expect(part(page, 'contextual-help', 'close')).toBeFocused(); assert.ok(await content.evaluate(e => e.contains(document.activeElement)), 'focus is inside content'); await page.keyboard.press('Escape'); await expect(content).toBeHidden(); await expect(page.getByRole('button', { name: '신청 자격 도움말', exact: true })).toBeFocused(); },
  async 'bottom-sheet'(page) {
    const dialog = page.getByRole('dialog', { name: '지역 선택' }), inside = () => dialog.evaluate(d => d.contains(document.activeElement)); await expect(dialog).toBeVisible(); await expect(dialog).toHaveAccessibleName('지역 선택');
    await expect.poll(inside).toBe(true); // open focuses the named dialog
    for (const key of ['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab']) { await page.keyboard.press(key); assert.equal(await inside(), true, `focus trapped after ${key}`); }
    const busan = dialog.getByRole('radio', { name: '부산', exact: true }); await busan.check(); await expect(busan).toBeChecked();
    await dialog.getByRole('button', { name: '닫기' }).first().click(); await expect(dialog).toBeHidden(); await expect(status(page)).toHaveText('선택 지역: 부산');
    const opener = page.getByRole('button', { name: '지역 선택 열기' }); await expect(opener).toBeFocused(); await page.keyboard.press('Tab'); await expect(opener).not.toBeFocused(); assert.equal(await page.locator('#preview-root').evaluate(r => r.contains(document.activeElement)), true, 'focus moves on through the page after release');
    await opener.click(); await expect(dialog).toBeVisible(); await expect.poll(inside).toBe(true); await page.keyboard.press('Escape'); await expect(dialog).toBeHidden(); await expect(opener).toBeFocused();
  },
  async 'help-panel'(page) {
    const root = part(page, 'help-panel', 'root'); await expect(root).toBeVisible(); await expect(root).toContainText('신청 자격'); await root.getByRole('button', { name: '신청 자격', exact: true }).click(); await expect(root).toContainText('예제 신청 자격 도움말');
    await part(page, 'help-panel', 'close').click(); await expect(root).toBeHidden();
  },
  async 'coach-mark'(page) {
    const popover = part(page, 'coach-mark', 'popover'); await expect(popover).toBeHidden(); await page.getByRole('button', { name: '따라하기 시작' }).click(); await expect(popover).toBeVisible(); await expect(popover).toContainText('신청인 이름을 입력하세요');
    assert.equal(await page.locator('#applicant-name').evaluate(e => e.nextElementSibling?.id), 'applicant-name-after'); assert.ok(await page.locator('#applicant-name-after').evaluate(e => !!e.querySelector('[data-krds-component="coach-mark"][data-krds-part="popover"]')));
  },
  async 'tutorial-panel'(page, shot) {
    const panel = part(page, 'tutorial-panel', 'root'), tasks = part(page, 'tutorial-panel', 'task'), back = part(page, 'tutorial-panel', 'back');
    // Overview: every task listed, no back control, titled 따라하기.
    await expect(part(page, 'tutorial-panel', 'title')).toHaveText('따라하기'); await expect(tasks).toHaveCount(2); await expect(back).toHaveCount(0); await expect(part(page, 'tutorial-panel', 'stop')).toHaveCount(0); await shot('tutorial-panel-overview');
    await page.getByRole('button', { name: '따라하기 시작' }).click(); await expect(status(page)).toHaveText('현재 대상: 신청인 이름'); await expect(page.locator('#applicant-name')).toHaveAttribute('data-active-target', 'true');
    // Task view: only the active task, visible back control "작업 목록", current step marked.
    await expect(back).toBeVisible(); await expect(back).toHaveText('작업 목록'); await expect(tasks).toHaveCount(1); await expect(tasks).toContainText('예제 신청하기'); await expect(panel).not.toContainText('제출 내용 확인하기'); await shot('tutorial-panel-task-view');
    await expect(part(page, 'tutorial-panel', 'step').filter({ hasText: '이름 입력' })).toHaveAttribute('data-krds-state', /current/);
    await part(page, 'tutorial-panel', 'step').filter({ hasText: '신청 저장' }).click(); await expect(status(page)).toHaveText('현재 대상: 신청 저장'); await expect(page.locator('#save-application')).toHaveAttribute('data-active-target', 'true');
    await page.getByRole('button', { name: '따라하기 중지' }).click(); await expect(status(page)).toHaveText('현재 대상: 없음'); await expect(page.getByRole('button', { name: '따라하기 시작' })).toBeFocused();
    // Back from a task view returns to the overview (null task change).
    await page.getByRole('button', { name: '따라하기 시작' }).click(); await expect(back).toBeVisible(); await back.click(); await expect(back).toHaveCount(0); await expect(tasks).toHaveCount(2);
  },
  async toast(page) { const save = page.getByRole('button', { name: '신청 저장' }); await save.click(); await expect(part(page, 'toast', 'root')).toBeVisible(); await expect(part(page, 'toast', 'root')).toContainText('신청이 저장되었습니다.'); await expect(page.locator('#saved-result')).toHaveText('신청이 저장되었습니다.'); await expect(save).toBeFocused(); },
  async snackbar(page) {
    const root = part(page, 'snackbar', 'root'), origin = page.locator('#after-notification'); await expect(root).toHaveCount(1); await expect(root).toContainText('예제 신청을 저장했습니다.');
    // Focus/hover, hidden document and a deterministic clock never dismiss the persistent (durationMs null) message.
    await root.hover(); await part(page, 'snackbar', 'close').focus(); await page.locator('html').evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.clock.fastForward(20000); await tick(page); await expect(root).toHaveCount(1);
    await page.locator('html').evaluate(() => { delete document.visibilityState; delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); }); await page.clock.fastForward(20000); await tick(page); await expect(root).toHaveCount(1);
    // Close the focused notification: it disappears and focus goes to the configured fallback.
    await expect(part(page, 'snackbar', 'close')).toBeFocused(); await page.keyboard.press('Enter'); await tick(page); await expect(root).toHaveCount(0); await expect(origin).toBeFocused();
    // Re-show twice: still only one snackbar; then the configured action.
    await origin.click(); await tick(page); await origin.click(); await tick(page); await expect(root).toHaveCount(1);
    await page.getByRole('button', { name: '실행 취소', exact: true }).click(); await tick(page); await expect(status(page)).toHaveText('저장을 취소했습니다.'); await expect(root).toHaveCount(0);
  },
  async spinner(page) { await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40'); await page.getByRole('button', { name: '작업 완료' }).click(); await expect(part(page, 'spinner', 'status')).toHaveText('신청 내역을 불러왔습니다.'); await expect(part(page, 'spinner', 'root')).toHaveAttribute('aria-busy', 'false'); await expect(page.getByRole('progressbar')).toHaveCount(0); },
  async 'back-button'(page) { await page.getByRole('button', { name: '뒤로가기' }).click(); await expect(status(page)).toHaveText('현재 경로: /local/parent'); },
  async pagination(page) {
    const current = page.locator('[aria-current=page]'), prior = page.getByRole('link', { name: '이전', exact: true }), next = page.getByRole('link', { name: '다음', exact: true }), links = part(page, 'pagination', 'link');
    await expect(current).toHaveText('1'); await expect(prior).toHaveCount(0); await expect(next).toHaveAttribute('href', '#route-results-page-2'); // first page: prior unavailable
    await links.filter({ hasText: /^12$/ }).click(); await expect(current).toHaveText('12'); await expect(status(page)).toHaveText('현재 페이지: 12');
    await expect(next).toHaveCount(0); await expect(prior).toHaveAttribute('href', '#route-results-page-11'); // last page: next unavailable
    await prior.click(); await expect(current).toHaveText('11'); await expect(next).toHaveAttribute('href', '#route-results-page-12');
    await links.filter({ hasText: /^1$/ }).click(); await expect(current).toHaveText('1'); await expect(status(page)).toHaveText('현재 페이지: 1'); await expect(prior).toHaveCount(0);
  },
  async 'language-switcher'(page) {
    const ko = page.getByRole('link', { name: '한국어' }), en = page.getByRole('link', { name: 'English' }); await expect(ko).toHaveAttribute('aria-current', 'true');
    await en.focus(); await en.press('Enter'); await expect(page.locator('p[lang=en]')).toHaveText('English example'); await expect(en).toHaveAttribute('aria-current', 'true');
    await ko.focus(); await ko.press('Enter'); await expect(page.locator('p[lang=ko]')).toHaveText('한국어 예제'); await expect(ko).toHaveAttribute('aria-current', 'true'); // reverse page shows 한국어
  },
  async carousel(page) {
    const position = part(page, 'carousel', 'position'); await page.clock.fastForward(6100); await expect(position).toHaveText(/2\s*\/\s*3/);
    const play = part(page, 'carousel', 'play-pause'), root = part(page, 'carousel', 'root'); await expect(play).toHaveText('정지'); await page.keyboard.press('Tab'); await expect(play).toBeFocused(); await page.clock.runFor(100); await expect(play).toHaveText(/재생/);
    for (let i = 0; i < 6 && await root.evaluate(e => e.contains(document.activeElement)); i++) await page.keyboard.press('Tab'); assert.equal(await root.evaluate(e => e.contains(document.activeElement)), false, 'focus left the carousel');
    await page.clock.fastForward(6500); await expect(position).toHaveText(/2\s*\/\s*3/); await expect(status(page)).toHaveText('자동 재생 요청 0회');
    // Ruling: keyboard Play yields 0 or 1 onPlayingChange (never a duplicate) and advancement resumes.
    await play.focus(); await page.keyboard.press('Enter'); await page.clock.runFor(100); await expect(status(page)).toHaveText(/자동 재생 요청 [01]회/); await page.clock.fastForward(6100); await expect(position).toHaveText(/3\s*\/\s*3/); await expect(status(page)).toHaveText(/자동 재생 요청 [01]회/);
  },
  async 'skip-link'(page) { await page.keyboard.press('Tab'); const link = page.getByRole('link', { name: '본문 바로가기' }); await expect(link).toBeFocused(); await expect(link).toBeVisible(); await page.keyboard.press('Enter'); await expect(page.locator('#main-content')).toBeFocused(); },
  async 'in-page-navigation'(page) {
    const nav = part(page, 'in-page-navigation', 'root'); assert.ok(await nav.evaluate(n => !!(n.compareDocumentPosition(document.getElementById('overview')) & Node.DOCUMENT_POSITION_FOLLOWING)), 'outline precedes body in DOM');
    const first = page.getByRole('link', { name: /신청 개요/ }); await first.focus(); await first.press('Enter'); await expect(page.locator('#overview')).toBeFocused();
    await page.locator('#requirements').scrollIntoViewIfNeeded(); await page.mouse.wheel(0, 400); await expect(page.getByRole('link', { name: /신청 조건/ })).toHaveAttribute('aria-current', /location|true/);
  },
  async header(page) {
    await expect(page.getByRole('banner')).toBeVisible(); await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeFocused();
    assert.ok(await page.getByRole('link', { name: '본문 바로가기' }).evaluate(link => !!(link.compareDocumentPosition(document.querySelector('header')) & Node.DOCUMENT_POSITION_FOLLOWING)), 'SkipLink precedes the banner');
    const order = await page.getByRole('banner').evaluate(h => [...h.querySelectorAll('a[href],button,input')].map(e => e.dataset.krdsPart || e.textContent.trim())); const home = order.indexOf('identity'), utility = order.indexOf('이용약관'), nav = order.indexOf('trigger'); assert.ok(home === 0 && utility > home && nav > utility, `identity precedes navigation: ${order.join(',')}`);
    await page.getByRole('button', { name: '신청', exact: true }).click(); await expect(page.getByRole('link', { name: '신규 신청', exact: true })).toBeVisible(); await page.mouse.wheel(0, 1200);
  },
  async 'side-navigation'(page) {
    await expect(page.locator('[aria-current=page]')).toContainText('신규 신청'); const t = part(page, 'side-navigation', 'trigger').first(); await expect(t).toHaveAttribute('aria-expanded', 'true');
    await t.click(); await expect(t).toHaveAttribute('aria-expanded', 'false'); await t.click(); await expect(t).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('link', { name: '신청 내역', exact: true }).click(); await expect(status(page)).toHaveText('이동한 메뉴: 신청 내역'); await routeShown(page, 'history');
  },
  async link(page) { const link = page.getByRole('link', { name: '신청 안내' }); await expect(link).toHaveAttribute('href', '#route-application'); if (!page.framed) { const popup = page.context().waitForEvent('page'); await link.click({ modifiers: ['ControlOrMeta'] }); const opened = await popup; assert.match(opened.url(), /\/krds\/previews\/qwik\/link\/default\/index\.html#route-application$/); await opened.close(); } await link.focus(); await link.press('Enter'); await routeShown(page, 'application'); },
  async 'main-menu'(page) {
    await expect(page.getByRole('link', { name: '홈', exact: true })).toHaveAttribute('href', '#route-home'); const support = page.getByRole('link', { name: '지원', exact: true }); await expect(support).toHaveAttribute('href', '#route-support');
    if (!page.framed) { const popup = page.context().waitForEvent('page'); await support.click({ modifiers: ['ControlOrMeta'] }); const opened = await popup; assert.match(opened.url(), /#route-support$/); await opened.close(); }
    await support.focus(); await support.press('Enter'); await routeShown(page, 'support');
  },
  async 'tab-bar'(page) { await expect(page.getByRole('navigation')).toBeVisible(); await expect(page.getByRole('tab')).toHaveCount(0); await page.mouse.wheel(0, 1200); const link = page.getByRole('link', { name: '신청', exact: true }); await expect(link).toHaveAttribute('href', '#route-apply'); await link.focus(); await link.press('Enter'); await routeShown(page, 'apply'); },
  async 'critical-alert'(page) { const root = part(page, 'critical-alert', 'root'); await expect(root).toContainText('긴급 안내'); await expect(root).toContainText('예제 점검으로 신청이 잠시 중단됩니다.'); assert.equal(await root.locator('button').count(), 0); await root.getByRole('link', { name: /점검 상세 안내/ }).click(); await routeShown(page, 'maintenance'); },
  async 'accessible-media'(page) {
    const media = part(page, 'accessible-media', 'media'), root = part(page, 'accessible-media', 'root'), transcript = part(page, 'accessible-media', 'transcript');
    await expect(media).toHaveAttribute('controls', ''); await expect(media).not.toHaveAttribute('autoplay', /.*/); await expect(media).toHaveAccessibleName('로컬 예제 미디어');
    await expect.poll(() => media.evaluate(e => e.duration)).toBeGreaterThan(0.5); assert.ok(await media.evaluate(e => e.duration <= 2.5), 'short local specimen');
    // Operate the native element's playback (the same play/pause the native controls dispatch), observed via its canplay/play/timeupdate events.
    await media.evaluate(e => new Promise((resolve, reject) => { if (e.readyState >= 3) resolve(); else { e.addEventListener('canplay', () => resolve(), { once: true }); e.addEventListener('error', () => reject(new Error('media error')), { once: true }); e.load(); } }));
    await media.evaluate(e => e.play()); await expect(media).toHaveAttribute('data-krds-state', 'playing'); await expect.poll(() => media.evaluate(e => e.currentTime)).toBeGreaterThan(0.05);
    await media.evaluate(e => e.pause()); await expect(media).toHaveAttribute('data-krds-state', 'paused');
    await expect(transcript).toHaveText('약 2초 동안 일정한 높이의 예제 신호음이 들립니다.'); await expect(media).toHaveAccessibleDescription('약 2초 동안 일정한 높이의 예제 신호음이 들립니다.');
    assert.equal(await media.evaluate(m => document.getElementById(m.getAttribute('aria-describedby'))?.dataset.krdsPart), 'transcript', 'media is described by the transcript'); assert.equal(await transcript.getAttribute('aria-label'), null, 'transcript is unlabelled');
    await expect(part(page, 'accessible-media', 'alternatives')).toHaveAccessibleName('로컬 예제 미디어 대체 정보');
  },
  async favicon(page) { const icons = page.locator('head link[rel=icon]'); await expect(icons).toHaveCount(2); for (const href of await icons.evaluateAll(es => es.map(e => e.href))) { assert.ok(href.startsWith(origin + prefix), href); assert.ok((await page.request.get(href)).ok(), href); } },
  async image(page) {
    const ok = page.getByRole('img', { name: '산과 강이 있는 독립 예제 그림' });
    await expect(ok).toHaveAttribute('src', /\/krds\/previews\/qwik\/assets\/[^/]*example-landscape[^/]*\.svg$/);
    await expect.poll(() => ok.evaluate(e => e.complete && e.naturalWidth > 0)).toBe(true); // resolved local image
    await expect(ok).toHaveAttribute('alt', '산과 강이 있는 독립 예제 그림'); await expect(ok).not.toHaveAttribute('data-krds-state', 'error');
    const img = page.getByRole('img', { name: '불러올 수 없는 예제 그림' }); await expect(img).toHaveAttribute('src', '/krds/previews/qwik/local-assets/intentional-missing-image.svg');
    await expect.poll(() => img.evaluate(e => e.complete && e.naturalWidth === 0)).toBe(true); // real load failure
    await expect(img).toHaveAttribute('data-krds-state', 'error'); record_imageState = 'error'; await expect(img).toBeVisible(); await expect(img).toHaveAttribute('alt', '불러올 수 없는 예제 그림'); const box = await img.boundingBox(); assert.ok(box && box.width > 0 && box.height > 0, 'alternative keeps its reserved box');
  },
  async identifier(page) { const info = page.getByRole('contentinfo'); await expect(info.locator('[data-krds-component=identifier][data-krds-part=root]')).toBeVisible(); assert.equal(await info.evaluate(e => e.lastElementChild?.dataset.krdsComponent), 'identifier'); },
  async footer(page) { const info = page.getByRole('contentinfo'); await expect(info).toContainText('개인정보처리방침'); await expect(info).toContainText('로컬 예제 연락처'); assert.equal(await info.evaluate(e => e.lastElementChild?.dataset.krdsComponent), 'identifier'); },
  async badge(page) { const root = part(page, 'badge', 'root'); await expect(root).toHaveText('진행 중'); assert.equal(await root.getAttribute('tabindex'), null); assert.equal(await root.getAttribute('role'), null); await page.keyboard.press('Tab'); await expect(root).not.toBeFocused(); },
  async breadcrumb(page) { await expect(page.getByRole('navigation')).toBeVisible(); await expect(page.getByRole('link', { name: '홈', exact: true })).toHaveAttribute('href', '#route-home'); },
  async masthead(page) { await expect(page.getByRole('note')).toContainText('실제 공식 정부서비스가 아닙니다'); await expect(part(page, 'masthead', 'root')).toBeVisible(); await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeFocused(); },
  async 'step-indicator'(page) { await expect(page.locator('ol')).toBeVisible(); await expect(page.locator('[aria-current=step]')).toContainText('정보 입력'); await expect(page.locator('ol > li')).toHaveCount(3); },
  async 'structured-list'(page) {
    const link = page.getByRole('link', { name: '예제 신청 공고', exact: true }); await expect(link).toBeVisible(); await expect(link).toHaveAttribute('href', '#route-notice-a'); await expect(page.locator('#preview-root')).toContainText('마감일');
    for (const item of await part(page, 'structured-list', 'item').all()) assert.ok(await item.evaluate(i => { const content = i.querySelector('[data-krds-part="content"]'), actions = i.querySelector('[data-krds-part="actions"]'); return !!content && !!actions && !!(content.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING) && actions.querySelectorAll('button').length === 2; }), 'share/save follow readable content');
    await page.getByRole('button', { name: '예제 신청 공고 저장' }).click(); await expect(status(page)).toHaveText('항목 작업: 예제 신청 공고을(를) 저장했습니다.');
  },
  async table(page) { await expect(page.getByRole('table')).toHaveAccessibleName('예제 신청 내역'); await expect(page.getByRole('columnheader', { name: '신청명' })).toBeVisible(); await expect(page.getByRole('cell', { name: '2' }).first()).toBeVisible(); await expect(page.getByRole('rowheader', { name: '신청 가' }).or(page.getByRole('cell', { name: '신청 가' }))).toBeVisible(); },
  async 'text-list'(page) { await expect(page.locator('#preview-root ol')).toHaveCount(1); await expect(page.getByRole('listitem')).toHaveCount(2); },
  async 'visually-hidden'(page) { await expect(page.getByRole('button', { name: '신청 확인' })).toHaveAccessibleDescription('신청 내용을 확인하세요'); await expect(page.locator('#hidden-help')).toHaveCSS('position', 'absolute'); },
};
// Outcomes owned by native anchors/focus rather than adapter QRLs (still recorded, not required).
const nativeOutcome = new Set(['skip-link', 'link', 'main-menu', 'tab-bar', 'breadcrumb', 'masthead', 'badge', 'image', 'identifier', 'footer', 'step-indicator', 'table', 'text-list', 'visually-hidden', 'accessible-media', 'favicon', 'critical-alert']);
/** Docs-shell view: frame-scoped queries, parent-owned input devices/clock, exactly as a reader drives the sandboxed iframe. */
const framedView = (parent, frame) => new Proxy(parent, { get(target, key) { if (key === 'framed') return true; if (['getByRole', 'getByText', 'getByLabel', 'locator'].includes(key)) return frame[key].bind(frame); const value = target[key]; return typeof value === 'function' ? value.bind(target) : value; } });
const sandbox = 'allow-scripts allow-same-origin';

// Lets the verifier operate native media playback without a separate user gesture.
const browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
const results = [];
const executed = new Map();
let categories;
try {
  // Mapping completeness is a gate: every acceptance ID needs a definition and a scenario.
  const mappingErrors = [];
  for (const a of acceptance) { if (!definitions.some(d => d.acceptanceId === a.acceptanceId)) mappingErrors.push(`${a.acceptanceId}: no definition`); if (!scenarios[a.componentId]) mappingErrors.push(`${a.acceptanceId}: no scenario`); }
  // R3: every definition binds its example symbol to exact byte ranges, and entry.ssr.tsx (symbol render) as a host source.
  for (const d of definitions) {
    const tag = `${d.acceptanceId}`; const example = d.sources.find(x => x.role === 'example');
    if (!example?.ranges?.length) { mappingErrors.push(`${tag}: example has no ranges`); continue; }
    const bytes = readFileSync(resolve(repo, example.path));
    for (const r of example.ranges) {
      const text = bytes.subarray(r.start, r.end).toString('utf8');
      if (createHash('sha256').update(bytes.subarray(r.start, r.end)).digest('hex') !== r.sha256) mappingErrors.push(`${tag}: range hash`);
      if (example.ranges[0] === r && !new RegExp(`\\b${example.symbolOrBranch}\\b`).test(text.split('\n')[0])) mappingErrors.push(`${tag}: first range does not start at ${example.symbolOrBranch}`);
    }
    if (!d.sources.some(x => x.role === 'host' && x.path.endsWith('entry.ssr.tsx') && x.symbolOrBranch === 'render')) mappingErrors.push(`${tag}: no entry.ssr.tsx render host binding`);
  }
  for (const a of acceptance) if (!existsSync(resolve(artifact, a.componentId, 'default/index.html'))) mappingErrors.push(`${a.acceptanceId}: no static entry`);
  for (const a of acceptance.filter(a => !only || only.includes(a.componentId))) {
    const id = a.componentId; const context = await browser.newContext({ viewport: { width: 1000, height: 800 }, locale: 'ko-KR', reducedMotion: id === 'carousel' ? 'no-preference' : 'reduce' });
    const page = await context.newPage(); page.setDefaultTimeout(5000); const errors = []; const outside = []; const symbols = [];
    context.on('page', p => p.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) outside.push(r.url()); }));
    page.on('pageerror', e => errors.push(`pageerror ${e.message}`)); page.on('console', m => { if (m.type() === 'error') errors.push(`console ${m.text()} @ ${m.location()?.url ?? ''}`); });
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); }); page.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) outside.push(r.url()); });
    await page.exposeFunction('__qwikSymbol', s => symbols.push(s)); await context.addInitScript(() => document.addEventListener('qsymbol', e => window.__qwikSymbol?.(e.detail.symbol)));
    const shot = name => page.screenshot({ path: resolve(evidence, `${name}.png`), fullPage: true });
    const record = { componentId: id, acceptanceId: a.acceptanceId, classification: a.classification };
    try {
      if (mappingErrors.some(e => e.startsWith(a.acceptanceId))) throw new Error(mappingErrors.filter(e => e.startsWith(a.acceptanceId)).join('; '));
      if (clocked.has(id)) await page.clock.install();
      const response = await page.goto(origin + entry(id)); const html = await response.text();
      assert.match(html, /q:container="paused"/); assert.match(html, /q:render="ssr"/); assert.ok(!/<script[^>]+src=/.test(html), 'no CSR entry script');
      await expect(page.locator('[data-preview-return]')).toBeVisible(); await page.waitForLoadState('networkidle');
      const staticHandlers = await page.locator('#preview-root').evaluate(root => [...root.querySelectorAll('*')].flatMap(e => [...e.attributes].filter(a => a.name.startsWith('on:') || a.name.startsWith('on-document:') || a.name.startsWith('on-window:')).map(a => a.value)));
      // R2: no raw host <button> (every button belongs to a KRDS component, incl. the public Button); reset row follows the result region.
      const hostLayout = await page.locator('#preview-root').evaluate(root => ({
        raw: [...root.querySelectorAll('button')].filter(b => !b.closest('[data-krds-component]')).length,
        resetBeforeResult: [...root.querySelectorAll('output')].some(o => { const reset = [...root.querySelectorAll('button')].find(b => /초기화/.test(b.textContent ?? '')); return !!reset && !!(o.compareDocumentPosition(reset) & Node.DOCUMENT_POSITION_PRECEDING); }),
      }));
      assert.equal(hostLayout.raw, 0, 'no raw host <button>'); assert.equal(hostLayout.resetBeforeResult, false, 'reset row follows the result region');
      await assertUniqueIds(page, 'at baseline');
      const before = await signature(page); const startSymbols = symbols.length;
      await scenarios[id](page, shot);
      await assertUniqueIds(page, 'after scenario');
      await page.waitForTimeout(50);
      const actionSymbols = symbols.slice(startSymbols); const kinds = [...new Set(actionSymbols.map(s => symbolKinds.get(s) ?? `unknown:${s}`))];
      for (const s of actionSymbols) executed.set(symbolKinds.get(s) ?? 'unknown', (executed.get(symbolKinds.get(s) ?? 'unknown') ?? 0) + 1);
      const handlerQrl = kinds.some(k => k.startsWith('eventHandler:') || k.startsWith('jSXProp:') );
      if (a.classification === 'interactive' && !nativeOutcome.has(id)) assert.ok(handlerQrl, `first interaction executed no lazy handler QRL (${kinds.join(', ')})`);
      // Empty on:* values are Qwik's own runtime bookkeeping (no handler); every non-empty value must reference a build chunk QRL.
      assert.ok(staticHandlers.every(v => v === '' || /(^|\s|\n)(q-[\w-]+\.js#|#)/.test(v) || v.includes('q-')), 'static on:* attributes reference build chunks');
      await shot(`${id}-outcome`);
      await page.goto(origin + entry(id)); await expect(page.locator('[data-preview-return]')).toBeVisible(); await page.waitForLoadState('networkidle');
      assert.deepEqual(await signature(page), before, 'reload restores native baseline');
      // Embedded session: real iframe identity, ready/size, host return-control focus transfer, and recreate-to-reset.
      // Sandbox parity: the same scenario inside the docs iframe sandbox (no allow-forms/popups/modals/top-navigation).
      const parent = await context.newPage(); parent.setDefaultTimeout(5000); parent.on('pageerror', e => errors.push(`parent pageerror ${e.message}`)); parent.on('console', m => { if (m.type() === 'error') errors.push(`parent console ${m.text()} @ ${m.location()?.url ?? ''}`); });
      parent.on('response', r => { if (r.status() >= 400) errors.push(`parent ${r.status()} ${r.url()}`); }); parent.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) outside.push(r.url()); });
      const frameSymbols = []; await parent.exposeFunction('__qwikSymbol', s => frameSymbols.push(s));
      if (clocked.has(id)) await parent.clock.install();
      await parent.goto(`${origin}/owner-parent.html?component=${id}&entry=${encodeURIComponent(entry(id))}`);
      assert.equal(await parent.locator('iframe').getAttribute('sandbox'), sandbox);
      const frame = parent.frameLocator('iframe');
      await expect.poll(() => parent.evaluate(() => window.__messages.map(m => m.type))).toContain('ready'); await expect.poll(() => parent.evaluate(() => window.__messages.filter(m => m.type === 'size').length)).toBeGreaterThan(0);
      const heights = await parent.evaluate(() => window.__messages.filter(m => m.type === 'size').map(m => m.height)); assert.ok(heights.every(h => h > 0 && Number.isFinite(h))); const definition = definitions.find(d => d.componentId === id); const applied = heights.map(h => Math.max(definition.layout === 'overlay' ? 640 : 240, Math.min(1200, h))); assert.ok(applied.every(h => h >= 240 && h <= 1200 && (definition.layout !== 'overlay' || h >= 640))); record.sizes = { raw: heights, applied };
      await expect(frame.locator('[data-preview-return]')).toBeVisible(); await parent.waitForLoadState('networkidle');
      const view = framedView(parent, frame); await assertUniqueIds(view, 'sandboxed baseline'); const framedBefore = await signature(view); assert.deepEqual(framedBefore, before, 'sandboxed frame starts at the same baseline');
      // Keyboard entry starts at the frame document, as after the shell's 예시 focus order.
      await frame.locator('body').evaluate(body => { body.tabIndex = -1; body.focus(); body.removeAttribute('tabindex'); });
      const frameStart = frameSymbols.length; await scenarios[id](view, name => parent.screenshot({ path: resolve(evidence, `${name}-sandboxed.png`), fullPage: true })); await parent.waitForTimeout(50); await assertUniqueIds(view, 'sandboxed after scenario');
      const frameKinds = [...new Set(frameSymbols.slice(frameStart).map(s => symbolKinds.get(s) ?? `unknown:${s}`))];
      if (a.classification === 'interactive' && !nativeOutcome.has(id)) assert.ok(frameKinds.some(k => k.startsWith('eventHandler:') || k.startsWith('jSXProp:')), `sandboxed first interaction executed no lazy handler QRL (${frameKinds.join(', ')})`);
      await parent.screenshot({ path: resolve(evidence, `${id}-sandboxed-outcome.png`), fullPage: true });
      // Recreate the iframe (shell 초기화) and require the exact native baseline.
      await parent.evaluate(() => window.__mount()); await expect(frame.locator('[data-preview-return]')).toBeVisible(); await parent.waitForLoadState('networkidle');
      await expect.poll(() => signature(view)).toEqual(before); record.embeddedReset = true;
      if (id === 'bottom-sheet') { await frame.getByRole('dialog').getByRole('button', { name: '닫기' }).first().click(); await expect(frame.getByRole('dialog')).toBeHidden(); }
      await frame.locator('[data-preview-return]').click(); await expect(parent.locator('#exit')).toBeFocused();
      record.sandboxed = { sandbox, scenario: 'passed', actionQrlKinds: frameKinds };
      record.embedded = { ready: true, sizes: heights.length, returnFocus: true };
      await parent.close();
      if (id === 'image') {
        // Controller ruling: exactly the acceptance's intentionally missing src may 404 — once per document load (2 top-level + 2 sandboxed mounts).
        const allowed = errors.filter(e => e.includes(missingImageUrl)); errors.splice(0, errors.length, ...errors.filter(e => !e.includes(missingImageUrl)));
        const counts = { top404: allowed.filter(e => e.startsWith('404 ')).length, topConsole: allowed.filter(e => e.startsWith('console ')).length, frame404: allowed.filter(e => e.startsWith('parent 404 ')).length, frameConsole: allowed.filter(e => e.startsWith('parent console ')).length };
        record.whitelisted = counts; record.imageState = record_imageState;
        // Each of the 2 top-level and 2 sandboxed document loads requests the missing src once at parse time; Chromium may re-request it
        // once when the resumed Image re-renders into its error state. Every 404 must be paired with exactly one console error.
        assert.ok(counts.top404 >= 2 && counts.top404 <= 4 && counts.frame404 >= 2 && counts.frame404 <= 4 && counts.topConsole === counts.top404 && counts.frameConsole === counts.frame404, `whitelisted counts ${JSON.stringify(counts)}`);
      }
      assert.deepEqual(errors, []); assert.deepEqual(outside, []);
      Object.assign(record, { status: 'passed', actionQrlKinds: kinds, staticHandlerCount: staticHandlers.length, reset: true });
    } catch (error) {
      Object.assign(record, { status: 'failed', error: String(error).slice(0, 1200), errors, outside }); console.log('FAIL', id, String(error).split('\n').slice(0, 4).join(' | '));
    } finally { results.push(record); await context.close(); }
  }
  if (mappingErrors.length) console.log('MAPPING', mappingErrors.join('\n'));
} finally {
  await browser.close(); await new Promise(r => server.close(r));
  const manifestBytes = existsSync(resolve(artifact, 'artifact-manifest.json')) ? readFileSync(resolve(artifact, 'artifact-manifest.json')) : Buffer.from('');
  categories = { eventHandler: [...executed].filter(([k]) => k.startsWith('eventHandler:') || k.startsWith('jSXProp:')).reduce((n, [, v]) => n + v, 0), lazyComponent: executed.get('function:component$') ?? 0, task: [...executed].filter(([k]) => /useTask|useVisibleTask|useComputed/.test(k)).reduce((n, [, v]) => n + v, 0), resource: Object.values(manifest.symbols).filter(s => /useResource/.test(s.ctxName)).length };
  writeFileSync(resultFile, JSON.stringify({ artifact, manifestSha256: createHash('sha256').update(manifestBytes).digest('hex'), passed: results.filter(r => r.status === 'passed').length, total: acceptance.length, qrlCategories: categories, executedSymbolKinds: Object.fromEntries(executed), results }, null, 2) + '\n');
  console.log(`QRL categories executed during actions: ${JSON.stringify(categories)}`);
}
const passed = results.filter(r => r.status === 'passed').length;
console.log(`${passed}/${acceptance.length} native Qwik acceptance scenarios passed.`);
const categoriesOk = only || (categories.eventHandler > 0 && categories.lazyComponent > 0 && categories.resource === 0);
if (passed !== (only ? results.length : acceptance.length) || !categoriesOk) process.exitCode = 1;
