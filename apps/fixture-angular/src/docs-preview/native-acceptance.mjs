// Owner-level native acceptance for every Angular docs-preview default.
// Serves the built dist/docs-preview at the final /krds/previews/angular/ prefix from a loopback server
// and drives each acceptance item: initial state, listed actions, observable outcome and reload baseline.
// Every example runs inside an iframe with the docs shell's exact sandbox (allow-scripts allow-same-origin: no forms,
// popups, modals or top navigation) under a same-origin parent that speaks the real ready/size/return-focus protocol.
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../../../..', import.meta.url));
const artifact = resolve(root, process.env.ANGULAR_PREVIEW_ARTIFACT || 'apps/fixture-angular/dist/docs-preview');
const evidence = resolve(root, '.superpowers/sdd/2026-11-01-native-live-previews/angular-browser');
mkdirSync(evidence, { recursive: true });
const only = process.argv.slice(2).filter(value => !value.startsWith('-'));
const definitions = JSON.parse(readFileSync(new URL('./definitions.json', import.meta.url))).demos.filter(d => d.exampleId === 'default');
const acceptance = JSON.parse(readFileSync(resolve(root, 'apps/docs/demo-acceptance.json'))).items;
const base = '/krds/previews/angular/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wav': 'audio/wav', '.svg': 'image/svg+xml', '.map': 'application/json', '.json': 'application/json' };
const parentPath = '/krds/sandbox-parent.html';
const parentPage = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>sandbox parent</title></head><body style="margin:0">
<iframe id="frame" title="네이티브 미리보기" sandbox="allow-scripts allow-same-origin" style="display:block;width:100%;border:0;height:240px"></iframe>
<button id="exit-target" type="button">미리보기 다음</button>
<script>
const q = new URLSearchParams(location.search), frame = document.getElementById('frame');
const identity = { version: 1, framework: 'angular', componentId: q.get('component'), exampleId: q.get('example'), token: crypto.randomUUID().replaceAll('-', '') };
const minHeight = Number(q.get('minHeight') || 240);
window.__messages = []; window.__rejected = [];
window.addEventListener('message', event => {
  const m = event.data;
  if (event.origin !== location.origin || event.source !== frame.contentWindow || !m || ['version','framework','componentId','exampleId','token'].some(k => m[k] !== identity[k])) { window.__rejected.push(m); return; }
  window.__messages.push(m);
  if (m.type === 'size') frame.style.height = Math.min(1200, Math.max(minHeight, Math.ceil(m.height))) + 'px';
  if (m.type === 'return-focus') document.getElementById('exit-target').focus();
});
frame.addEventListener('load', () => frame.contentWindow.postMessage({ ...identity, type: 'init', presentation: { colorMode: 'light', reducedMotion: false } }, location.origin));
frame.src = '${base}index.html?component=' + identity.componentId + '&example=' + identity.exampleId + '&version=1&framework=angular&componentId=' + identity.componentId + '&exampleId=' + identity.exampleId + '&token=' + identity.token;
</script></body></html>`;
const server = createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path === parentPath) { res.setHeader('content-type', 'text/html'); res.end(parentPage); return; }
  if (!path.startsWith(base) || path.includes('..')) { res.writeHead(404).end(); return; }
  try { const bytes = readFileSync(resolve(artifact, path.slice(base.length) || 'index.html')); res.setHeader('content-type', types[extname(path)] || 'application/octet-stream'); res.end(bytes); }
  catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const url = `${origin}${base}index.html`;
const browser = await chromium.launch({ headless: true });
const results = [];
const part = (page, id, name) => page.locator(`[data-krds-component="${id}"][data-krds-part="${name}"]`);
const preview = page => page.locator('docs-preview');
const destination = page => page.getByRole('heading', { name: '로컬 예제 목적지', exact: true });
const signature = page => preview(page).evaluate(host => ({
  text: host.innerText,
  inputs: [...host.querySelectorAll('input,select,textarea')].filter(e => e.type !== 'file').map(e => [e.name, e.value, e.checked]),
  files: [...host.querySelectorAll('input[type=file]')].map(e => e.files?.length ?? 0),
  aria: [...host.querySelectorAll('[aria-checked],[aria-selected],[aria-pressed],[aria-expanded],[aria-valuenow],[aria-current]')].map(e => ['aria-checked', 'aria-selected', 'aria-pressed', 'aria-expanded', 'aria-valuenow', 'aria-current'].map(name => e.getAttribute(name))),
}));
const pageOnly = new Set(['keyboard', 'mouse', 'clock', 'context', 'screenshot', 'goBack', 'request']);
/** Loads one example in the sandboxed iframe; returns a view whose locators/evaluate target the frame and whose input targets the page. */
async function embed(page, id, example = 'default') {
  const minHeight = definitions.find(d => d.componentId === id)?.minHeight ?? 240;
  await page.goto(`${origin}${parentPath}?component=${id}&example=${example}&minHeight=${minHeight}`);
  const frame = await (await page.locator('#frame').elementHandle()).contentFrame();
  return new Proxy(frame, { get(target, key) {
    if (key === 'page') return page;
    const source = pageOnly.has(key) ? page : target;
    const value = source[key];
    return typeof value === 'function' ? value.bind(source) : value;
  } });
}
const shot = (page, name) => page.screenshot({ path: resolve(evidence, `${name}.png`), fullPage: true });
const linkToDestination = async (page, link) => {
  await expect(link).toHaveAttribute('href', /^\/krds\/previews\/angular\/index\.html\?.*route=/);
  // Modified click stays native: the component must not script it. (The sandbox has no allow-popups, so the browser's
  // new-window request is dropped; the in-frame document must stay put.)
  await page.evaluate(() => { window.__modified = null; window.addEventListener('click', event => { if (event.shiftKey) window.__modified = event.defaultPrevented; }, { once: true }); });
  await link.click({ modifiers: ['Shift'] });
  assert.equal(await page.evaluate(() => window.__modified), false, 'modified click is left to the browser');
  await expect(destination(page)).toHaveCount(0);
  await link.focus();
  await link.press('Enter');
  await expect(destination(page)).toBeVisible();
};

const scenarios = {
  async 'accessible-media'(page) {
    const media = page.locator('audio');
    await expect(media).toHaveAttribute('controls', '');
    await expect(media).toHaveAccessibleName('로컬 예제 미디어');
    await media.evaluate(e => e.readyState >= 3 || new Promise(done => e.addEventListener('canplay', done, { once: true })));
    assert.ok(await media.evaluate(e => e.readyState >= 3 && Number.isFinite(e.duration) && e.duration > 0), 'audio can play with positive duration');
    const advanced = await media.evaluate(async e => { e.muted = true; await e.play(); await new Promise(done => setTimeout(done, 400)); const time = e.currentTime; e.pause(); return time; });
    assert.ok(advanced > 0, 'native playback advances currentTime');
    await expect(part(page, 'accessible-media', 'root')).toHaveAttribute('data-krds-state', 'paused');
    const transcript = part(page, 'accessible-media', 'transcript');
    await expect(transcript).toHaveText('약 2초 동안 일정한 높이의 예제 신호음이 들립니다.');
    // Association: the media is described by the alternatives region that holds the transcript.
    const describedBy = await media.getAttribute('aria-describedby');
    assert.ok(describedBy && await page.locator('#' + describedBy).evaluate(e => e.contains(e.ownerDocument.querySelector('[data-krds-part=transcript]'))), 'media aria-describedby points at the transcript region');
    await expect(media).toHaveAccessibleDescription('약 2초 동안 일정한 높이의 예제 신호음이 들립니다.');
    assert.equal(await transcript.getAttribute('id'), describedBy, 'aria-describedby points directly at the transcript');
    const alternatives = page.getByRole('region', { name: '로컬 예제 미디어 대체 정보' });
    await expect(alternatives).toBeVisible();
    await expect(alternatives.locator('[data-krds-part=transcript]')).toHaveCount(1);
    assert.ok(await media.evaluate(e => { const figure = e.closest('figure'); return !!figure && figure.querySelector('[data-krds-part=alternatives]')?.contains(figure.querySelector('[data-krds-part=transcript]')) && figure.querySelector('figcaption').textContent === e.getAttribute('aria-label'); }), 'media and transcript share one captioned figure');
  },
  async accordion(page) {
    const triggers = part(page, 'accordion', 'trigger');
    await expect(triggers).toHaveCount(2);
    for (const trigger of await triggers.all()) {
      assert.equal(await trigger.evaluate(e => e.parentElement.tagName), 'H3');
      const panel = page.locator('#' + await trigger.getAttribute('aria-controls'));
      await expect(panel).toBeHidden();
    }
    const first = triggers.first();
    await first.focus();
    await page.keyboard.press('Tab');
    await expect(triggers.nth(1)).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(first).toBeFocused();
    await expect(first).toHaveAccessibleName(/신청 자격/);
    await page.keyboard.press('Enter');
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(part(page, 'accordion', 'panel').first()).toHaveText('예제 신청 자격 안내');
    await page.keyboard.press('Space');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  },
  async 'back-button'(page) {
    await expect(page.getByRole('status')).toHaveText('현재 화면: /local/current');
    await expect(destination(page)).toHaveCount(0);
    await page.getByRole('button', { name: '뒤로가기' }).click();
    await expect(destination(page)).toBeVisible();
    await expect(page.getByRole('status')).toHaveText('parent');
    assert.equal(new URL(page.url()).searchParams.get('route'), 'parent');
    assert.equal(new URL(page.url()).searchParams.get('component'), 'back-button');
    // Real in-frame history entry: traversing back returns to the example (page.goBack waits on the top document).
    await page.evaluate(() => history.back());
    await expect(page.getByRole('status')).toHaveText('현재 화면: /local/current');
  },
  async badge(page) {
    const badge = part(page, 'badge', 'root');
    await expect(badge).toHaveText('진행 중');
    assert.equal(await badge.getAttribute('tabindex'), null);
    assert.equal(await badge.getAttribute('role'), null);
    assert.equal(await page.locator('docs-preview button:not([data-preview-return]),docs-preview a,docs-preview [tabindex]').count(), 0);
  },
  async 'bottom-sheet'(page) {
    const dialog = page.getByRole('dialog', { name: '지역 선택' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription('예제 지역을 선택하세요');
    await page.keyboard.press('Tab');
    assert.ok(await dialog.evaluate(e => e.contains(document.activeElement)), 'focus stays inside the open sheet');
    await dialog.getByRole('radio', { name: '부산', exact: true }).click();
    await expect(dialog.getByRole('radio', { name: '부산', exact: true })).toBeChecked();
    await dialog.getByRole('button', { name: '닫기', exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('status')).toHaveText('선택 지역: 부산');
    await expect(page.getByRole('button', { name: '지역 선택 열기' })).toBeFocused();
    await page.getByRole('button', { name: '지역 선택 열기' }).click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  },
  async breadcrumb(page) {
    await expect(page.getByRole('navigation', { name: '브레드크럼' })).toBeVisible();
    await expect(page.getByRole('link', { name: '홈', exact: true })).toHaveAttribute('href', /route=home/);
    await expect(page.getByRole('link', { name: '신청', exact: true })).toHaveAttribute('href', /route=apply/);
  },
  async button(page) {
    await expect(page.getByRole('status')).toHaveText('아직 신청하지 않았습니다.');
    await page.getByRole('button', { name: '신청하기', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('신청이 1회 완료되었습니다.');
  },
  async calendar(page) {
    const day = page.getByRole('button', { name: /2024년 2월 20일/ });
    await expect(day).toHaveAttribute('aria-pressed', 'false');
    await day.click();
    await expect(day).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('status')).toHaveText('선택한 날짜: 없음');
    await part(page, 'calendar', 'confirm').click();
    await expect(page.getByRole('status')).toHaveText('선택한 날짜: 2024-02-20');
  },
  async carousel(page) {
    const position = part(page, 'carousel', 'position');
    const toggle = part(page, 'carousel', 'play-pause');
    await expect(position).toHaveText('1 / 3');
    await page.clock.fastForward(6100);
    await expect(position).toHaveText('2 / 3');
    await page.locator('#carousel-before').focus();
    await page.keyboard.press('Tab');
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveText('재생');
    await page.locator('#carousel-after').focus();
    await page.clock.fastForward(6500);
    await expect(position).toHaveText('2 / 3');
    await expect(page.getByRole('status')).toHaveText('자동 재생 요청 0회');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveText('정지');
    await expect(page.getByRole('status')).toHaveText('자동 재생 요청 0회');
    await page.clock.fastForward(6100);
    await expect(position).toHaveText('3 / 3');
  },
  async checkbox(page) {
    const box = page.getByRole('checkbox', { name: '이용약관 동의' });
    await page.getByText('이용약관 동의', { exact: true }).click();
    await expect(box).toBeChecked();
    await box.press('Space');
    await expect(box).not.toBeChecked();
    await box.press('Space');
    await page.getByRole('button', { name: '입력 확인' }).click();
    await expect(page.getByLabel('입력 결과')).toHaveText('{"consent":"agreed"}');
    await page.getByRole('button', { name: '입력 초기화' }).click();
    await expect(box).not.toBeChecked();
    await expect(page.getByLabel('입력 결과')).toHaveText('');
  },
  async 'coach-mark'(page) {
    await expect(part(page, 'coach-mark', 'popover')).toHaveCount(0);
    await page.getByRole('button', { name: '따라하기 시작' }).click();
    const popover = part(page, 'coach-mark', 'popover');
    await expect(popover).toBeVisible();
    await expect(popover).toContainText('신청인 이름을 입력하세요');
    assert.equal(await page.locator('#applicant-name').evaluate(e => e.nextElementSibling.id), 'applicant-name-after');
    assert.ok(await page.locator('#applicant-name-after').evaluate(e => e.firstElementChild?.matches('[data-krds-component=coach-mark][data-krds-part=root]') && e.firstElementChild.contains(e.querySelector('[data-krds-part=popover]'))), 'first popover is inserted at the boundary immediately after the target');
    await page.getByRole('button', { name: '그만보기' }).click();
    await expect(popover).toHaveCount(0);
    await expect(page.getByRole('button', { name: '따라하기 시작' })).toBeFocused();
  },
  async 'contextual-help'(page) {
    const trigger = page.getByRole('button', { name: '신청 자격 도움말', exact: true });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(part(page, 'contextual-help', 'popover')).toBeHidden();
    await trigger.click();
    await expect(part(page, 'contextual-help', 'popover')).toBeVisible();
    await expect(part(page, 'contextual-help', 'popover')).toContainText('신청 자격에 관한 예제 설명입니다.');
    await expect(page.getByRole('button', { name: '도움말 닫기' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(part(page, 'contextual-help', 'popover')).toBeHidden();
    await expect(trigger).toBeFocused();
  },
  async 'critical-alert'(page) {
    await expect(part(page, 'critical-alert', 'root')).toContainText('긴급 안내');
    await expect(part(page, 'critical-alert', 'root')).toContainText('예제 점검으로 신청이 잠시 중단됩니다.');
    assert.equal(await part(page, 'critical-alert', 'root').locator('button').count(), 0);
    assert.equal(await page.locator('docs-preview').evaluate(e => e.firstElementChild.querySelector('[data-krds-component=critical-alert]') !== null), true);
    await linkToDestination(page, page.getByRole('link', { name: '점검 상세 안내' }));
  },
  async 'date-input'(page) {
    const input = page.getByRole('textbox', { name: '방문일' });
    await input.fill('2024-02-20');
    await input.blur();
    await expect(input).toHaveValue('2024-02-20');
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#date-result')).toHaveText('입력한 날짜: 2024-02-20');
  },
  async disclosure(page) {
    const trigger = page.getByRole('button', { name: '신청 도움말' });
    await expect(page.locator('#application-help')).toBeHidden();
    await trigger.focus();
    await trigger.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#application-help')).toHaveText('신청서를 작성하는 방법입니다.');
    await trigger.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#application-help')).toBeHidden();
  },
  async fab(page) {
    await expect(page.getByRole('status')).toHaveText('새 신청 0건');
    await page.getByRole('button', { name: '새 신청', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('새 신청 1건');
  },
  async favicon(page) {
    const icons = page.locator('head link[rel=icon]');
    await expect(icons).toHaveCount(2);
    for (const href of await icons.evaluateAll(es => es.map(e => e.href))) {
      assert.ok(href.startsWith(origin + base + 'local-assets/'), href);
      assert.ok((await page.request.get(href)).ok());
    }
    assert.ok(await page.getByRole('img').evaluate(e => e.complete && e.naturalWidth > 0));
  },
  async 'file-upload'(page) {
    const input = page.locator('input[type=file]');
    const picker = page.getByRole('button', { name: '파일 선택 첨부 서류', exact: true });
    // Single Tab stop: the visible picker is the only focusable/announced control; the native input stays labelled in the form.
    await expect(input).toHaveAttribute('tabindex', '-1');
    await expect(input).toHaveAttribute('aria-hidden', 'true');
    await expect(input).toHaveAttribute('name', 'documents');
    await expect(picker).toHaveAccessibleDescription(/\.txt,\.pdf/);
    await page.keyboard.press('Tab');
    await expect(picker).toBeFocused();
    const chooser = page.page.waitForEvent('filechooser');
    await page.keyboard.press('Enter');
    await (await chooser).setFiles({ name: '신청서-A.txt', mimeType: 'text/plain', buffer: Buffer.from('local A') });
    await expect(part(page, 'file-upload', 'filename')).toHaveText(['신청서-A.txt']);
    await shot(page, 'file-upload-selected');
    await page.getByRole('button', { name: '제출' }).click();
    await expect(page.getByRole('status').last()).toHaveText('제출한 파일: 신청서-A.txt');
    await page.getByRole('button', { name: '신청서-A.txt 삭제' }).click();
    await expect(part(page, 'file-upload', 'item')).toHaveCount(0);
    await expect(input).toHaveValue('');
    await expect(preview(page)).not.toContainText('신청서-A.txt');
  },
  async footer(page) {
    const footer = page.getByRole('contentinfo');
    await expect(footer).toContainText('개인정보처리방침');
    await expect(footer).toContainText('로컬 예제 연락처');
    assert.ok(await footer.evaluate(e => e.lastElementChild.querySelector('[data-krds-component=identifier][data-krds-part=root]') !== null));
    assert.ok(await footer.locator('img').first().evaluate(e => e.complete && e.naturalWidth > 0));
  },
  async header(page) {
    await expect(page.getByRole('banner')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: '예제 서비스 홈' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: '이용약관' })).toBeFocused();
    await page.getByRole('button', { name: '신청', exact: true }).click();
    await expect(page.getByRole('link', { name: '신규 신청', exact: true })).toBeVisible();
    await page.mouse.wheel(0, 1200);
    await expect(page.getByRole('banner')).toBeAttached();
  },
  async 'help-panel'(page) {
    await expect(part(page, 'help-panel', 'root')).toBeVisible();
    await expect(part(page, 'help-panel', 'root')).toContainText('신청 자격');
    await page.getByRole('button', { name: '신청 자격', exact: true }).click();
    await expect(page.getByText('예제 신청 자격 도움말')).toBeVisible();
    await page.getByRole('button', { name: '도움말 닫기' }).click();
    await expect(part(page, 'help-panel', 'root')).toBeHidden();
    await expect(page.getByRole('button', { name: '도움말 패널 열기' })).toBeFocused();
  },
  async identifier(page) {
    const footer = page.getByRole('contentinfo');
    await expect(footer.locator('[data-krds-component=identifier][data-krds-part=root]')).toBeVisible();
    assert.ok(await footer.evaluate(e => e.lastElementChild.querySelector('[data-krds-component=identifier][data-krds-part=root]') !== null));
    assert.ok(await footer.locator('img').evaluate(e => e.complete && e.naturalWidth > 0));
  },
  async image(page) {
    const img = page.getByRole('img', { name: '산과 강이 있는 독립 예제 그림' });
    await expect(img).toHaveAttribute('alt', '산과 강이 있는 독립 예제 그림');
    await expect(img).toHaveAttribute('src', base + 'local-assets/example-landscape.svg');
    await expect.poll(() => img.evaluate(e => e.complete && e.naturalWidth > 0)).toBe(true);
    await expect(img).toBeVisible();
    const specimen = page.getByRole('img', { name: '불러올 수 없는 예제 그림' });
    await expect(specimen).toHaveAttribute('src', base + 'local-assets/intentional-missing-image.svg');
    await expect.poll(() => specimen.evaluate(e => e.complete)).toBe(true);
    assert.ok(await specimen.evaluate(e => e.naturalWidth === 0), 'specimen intentionally fails to load');
    await expect(specimen).toHaveAttribute('data-krds-state', 'error');
    const figures = part(page, 'image', 'figure');
    await expect(figures.first()).not.toHaveAttribute('data-krds-state', 'error');
    await expect(figures.nth(1)).toHaveAttribute('data-krds-state', 'error');
    await expect(part(page, 'image', 'description')).toHaveText('이미지를 불러올 수 없습니다.');
    await expect(part(page, 'image', 'description')).toBeVisible();
    const box = await specimen.boundingBox();
    assert.ok(box && box.width > 100 && box.height > 50, 'reserved box keeps the alternative visible');
    await expect(specimen).toBeVisible();
  },
  async 'in-page-navigation'(page) {
    assert.ok(await page.locator('.preview-outline').evaluate(e => e.firstElementChild.tagName === 'KRDS-IN-PAGE-NAVIGATION'), 'outline precedes body in DOM');
    const first = page.getByRole('link', { name: '신청 개요' });
    await expect(first).toHaveAttribute('aria-current', 'location');
    await first.focus();
    await first.press('Enter');
    await expect(page.locator('#overview')).toBeFocused();
    await page.locator('#requirements').evaluate(e => e.scrollIntoView({ block: 'start' }));
    await expect(page.getByRole('link', { name: '신청 조건' })).toHaveAttribute('aria-current', 'location');
  },
  async 'language-switcher'(page) {
    await expect(page.locator('p[lang]')).toHaveText('한국어 예제');
    const english = page.getByRole('link', { name: /English/ });
    await english.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('p[lang=en]')).toHaveText('English example');
    await expect(page.getByRole('link', { name: /한국어/ })).toBeVisible();
  },
  async link(page) {
    await linkToDestination(page, page.getByRole('link', { name: '신청 안내' }));
  },
  async 'main-menu'(page) {
    await expect(page.getByRole('link', { name: '홈', exact: true })).toHaveAttribute('href', /route=home/);
    await linkToDestination(page, page.getByRole('link', { name: '지원', exact: true }));
  },
  async masthead(page) {
    await expect(page.getByRole('note')).toContainText('실제 공식 정부서비스가 아닙니다');
    await expect(part(page, 'masthead', 'root')).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeFocused();
  },
  async modal(page) {
    const trigger = page.getByRole('button', { name: '모달 열기', exact: true });
    await trigger.click();
    await expect(page.getByRole('dialog', { name: '신청 확인', exact: true })).toBeVisible();
    await shot(page, 'modal-open');
    await page.getByRole('button', { name: '닫기', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(page.getByRole('dialog', { name: '신청 확인', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.getByRole('button', { name: '확인', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('확인했습니다.');
    await expect(trigger).toBeFocused();
  },
  async 'native-select'(page) {
    const select = page.getByLabel('지역', { exact: true });
    await expect(select).toHaveValue('seoul');
    await select.selectOption('busan');
    await expect(select).toHaveValue('busan');
    await expect(page.getByRole('status')).toHaveText('선택: 부산');
    await page.getByRole('button', { name: '초기화', exact: true }).click();
    await expect(select).toHaveValue('seoul');
  },
  async pagination(page) {
    const previous = part(page, 'pagination', 'previous'); const next = part(page, 'pagination', 'next');
    await expect(previous).toHaveAttribute('aria-disabled', 'true');
    await expect(page.locator('[aria-current=page]')).toHaveText('1');
    await part(page, 'pagination', 'link').filter({ hasText: /^12$/ }).click();
    await expect(page.locator('[aria-current=page]')).toHaveText('12');
    await expect(next).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByRole('status')).toHaveText('현재 12쪽 결과');
    await part(page, 'pagination', 'link').filter({ hasText: /^1$/ }).click();
    await expect(page.locator('[aria-current=page]')).toHaveText('1');
    await expect(destination(page)).toHaveCount(0);
  },
  async 'quantity-toggle'(page) {
    const output = part(page, 'quantity-toggle', 'output'); const increment = part(page, 'quantity-toggle', 'increment'); const decrement = part(page, 'quantity-toggle', 'decrement');
    const hidden = page.locator('input[type=hidden][name=quantity]');
    await expect(output).toHaveText('2개');
    await increment.click();
    await expect(output).toHaveText('3개');
    await decrement.click();
    await expect(output).toHaveText('2개');
    await decrement.click(); await decrement.click();
    await expect(output).toHaveText('0개');
    await expect(decrement).toHaveAttribute('aria-disabled', 'true');
    await decrement.click({ force: true });
    await expect(output).toHaveText('0개');
    await expect(hidden).toHaveValue('0');
    for (let n = 0; n < 12; n++) await increment.click({ force: true });
    await expect(output).toHaveText('10개');
    await expect(increment).toHaveAttribute('aria-disabled', 'true');
    await expect(hidden).toHaveValue('10');
    await page.getByRole('button', { name: '입력 확인' }).click();
    await expect(page.getByLabel('입력 결과')).toHaveText('{"quantity":"10"}');
    await page.getByRole('button', { name: '입력 초기화' }).click();
    await expect(output).toHaveText('2개');
    await expect(hidden).toHaveValue('2');
    await expect(page.getByLabel('입력 결과')).toHaveText('');
  },
  async 'radio-group'(page) {
    const seoul = page.getByRole('radio', { name: '서울', exact: true }); const busan = page.getByRole('radio', { name: '부산', exact: true });
    await expect(page.getByRole('radio', { name: '제주', exact: true })).toBeDisabled();
    await expect(page.locator('input[type=radio]:checked')).toHaveCount(0);
    await page.evaluate(() => { window.__changes = 0; document.querySelector('form').addEventListener('change', () => window.__changes++); });
    await page.keyboard.press('Tab');
    await expect(seoul).toBeFocused();
    await expect(page.locator('input[type=radio]:checked')).toHaveCount(0);
    await page.keyboard.press('ArrowDown');
    await expect(busan).toBeChecked();
    await expect(busan).toBeFocused();
    await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);
    assert.equal(await page.evaluate(() => window.__changes), 1, 'one change per choice');
    await page.keyboard.press('Space');
    assert.equal(await page.evaluate(() => window.__changes), 1, 'Space on the chosen radio adds no change');
    await page.keyboard.press('ArrowDown');
    await expect(seoul).toBeChecked();
    await page.keyboard.press('ArrowDown');
    await expect(busan).toBeChecked();
    assert.equal(await page.evaluate(() => window.__changes), 3);
    await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(page.locator('input[type=radio]:focus')).toHaveCount(1);
    await page.getByRole('button', { name: '입력 확인' }).click();
    await expect(page.getByLabel('입력 결과')).toHaveText('{"region":"busan"}');
    await page.getByRole('button', { name: '입력 초기화' }).click();
    await expect(page.locator('input[type=radio]:checked')).toHaveCount(0);
  },
  async 'range-slider'(page) {
    const slider = page.getByRole('slider', { name: '예제 비율' }); const output = part(page, 'range-slider', 'output');
    await expect(slider).toHaveValue('50');
    await page.evaluate(() => { window.__changes = 0; document.querySelector('form').addEventListener('change', () => window.__changes++); });
    const box = await slider.boundingBox();
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, { steps: 6 });
    await page.mouse.up();
    await expect(slider).toHaveValue('80');
    await expect(output).toContainText('80');
    await page.mouse.click(box.x + box.width * 0.2, box.y + box.height / 2);
    await expect(slider).toHaveValue('20');
    await expect(output).toContainText('20');
    await slider.focus();
    await slider.press('ArrowRight');
    await expect(slider).toHaveValue('30');
    await slider.press('End');
    await slider.press('ArrowRight');
    await expect(slider).toHaveValue('100');
    await slider.press('Home');
    await slider.press('ArrowLeft');
    await expect(slider).toHaveValue('0');
    await slider.press('ArrowRight');
    await slider.blur();
    assert.ok(await page.evaluate(() => window.__changes) >= 3, 'drag, track click and keyboard each commit a change');
    await page.getByRole('button', { name: '입력 확인' }).click();
    await expect(page.getByLabel('입력 결과')).toHaveText('{"ratio":"10"}');
    await page.getByRole('button', { name: '입력 초기화' }).click();
    await expect(slider).toHaveValue('50');
    await expect(output).toContainText('50');
  },
  async resize(page) {
    const trigger = part(page, 'resize', 'trigger');
    const scaled = page.locator('#resize-scope');
    const baseline = parseFloat(await scaled.evaluate(e => getComputedStyle(e).fontSize));
    await trigger.focus();
    await trigger.press('ArrowDown');
    await expect(trigger).toContainText('조금 크게');
    await expect.poll(async () => parseFloat(await scaled.evaluate(e => getComputedStyle(e).fontSize)) / baseline).toBeCloseTo(1.1, 2);
    await trigger.click();
    await page.getByRole('button', { name: '크게', exact: true }).click();
    await expect.poll(async () => parseFloat(await scaled.evaluate(e => getComputedStyle(e).fontSize)) / baseline).toBeCloseTo(1.2, 2);
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(scaled.getByRole('button', { name: '작업' })).toBeFocused();
  },
  async 'side-navigation'(page) {
    const toggle = part(page, 'side-navigation', 'trigger').first();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('[aria-current=page]')).toHaveText('신규 신청');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('link', { name: '신규 신청', exact: true }).click();
    await expect(destination(page)).toBeVisible();
    await expect(page.getByRole('status')).toHaveText('apply');
  },
  async 'skip-link'(page) {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  },
  async snackbar(page) {
    await expect(part(page, 'snackbar', 'root')).toHaveCount(1);
    await expect(part(page, 'snackbar', 'root')).toContainText('저장 완료');
    await page.getByRole('button', { name: '실행 취소', exact: true }).click();
    await expect(page.locator('#snackbar-result')).toHaveText('저장을 취소했습니다.');
    await expect(part(page, 'snackbar', 'root')).toHaveCount(0);
  },
  async spinner(page) {
    await expect(page.getByRole('progressbar', { name: '신청 내역 불러오는 중' })).toHaveAttribute('aria-valuenow', '40');
    await page.getByRole('button', { name: '작업 완료' }).click();
    await expect(page.getByRole('progressbar')).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText('신청 내역을 불러왔습니다.');
  },
  async 'step-indicator'(page) {
    await expect(page.locator('ol')).toBeVisible();
    await expect(page.getByRole('listitem')).toHaveCount(3);
    await expect(page.locator('[aria-current=step]')).toContainText('정보 입력');
    await expect(page.locator('[aria-current=step]')).toContainText('현재 단계');
    await expect(page.getByRole('listitem').first()).toContainText('완료');
  },
  async 'structured-list'(page) {
    await expect(page.getByRole('link', { name: '예제 신청 공고' })).toHaveAttribute('href', /route=notice/);
    await expect(preview(page)).toContainText('마감일');
    const item = part(page, 'structured-list', 'item').first();
    assert.ok(await item.evaluate(e => { const content = e.querySelector('[data-krds-part=content]'); const actions = e.querySelector('[data-krds-part=actions]'); return !!actions && !!(content.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING); }));
    await item.getByRole('button', { name: '예제 신청 공고 저장' }).click();
    await expect(page.getByRole('status')).toHaveText('저장한 공고: 예제 신청 공고');
  },
  async switch(page) {
    const control = page.getByRole('switch', { name: '예제 알림 받기' });
    await control.focus();
    await control.press('Space');
    await expect(control).toBeChecked();
    await expect(control).toHaveAccessibleName('예제 알림 받기');
    await page.getByRole('button', { name: '입력 확인' }).click();
    await expect(page.getByLabel('입력 결과')).toHaveText('{"notification":"on"}');
    await page.getByRole('button', { name: '입력 초기화' }).click();
    await expect(control).not.toBeChecked();
  },
  async 'tab-bar'(page) {
    await expect(page.getByRole('navigation', { name: '하단 탐색' })).toBeVisible();
    await expect(page.getByRole('tab')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /홈/ })).toHaveAttribute('aria-current', 'page');
    await linkToDestination(page, page.getByRole('link', { name: /신청/ }));
  },
  async table(page) {
    await expect(page.getByRole('table')).toHaveAccessibleName('예제 신청 내역');
    await expect(page.getByRole('columnheader', { name: '신청명' })).toBeVisible();
    await expect(page.getByRole('rowheader', { name: '신청 가' })).toBeVisible();
    const headers = await page.getByRole('cell', { name: '2' }).getAttribute('headers');
    const names = await Promise.all(headers.split(' ').map(id => page.locator('#' + id).innerText()));
    assert.deepEqual(names, ['수량', '신청 가']);
  },
  async tabs(page) {
    const second = page.getByRole('tab', { name: '상세', exact: true });
    await expect(second).toHaveAttribute('aria-selected', 'false');
    await second.click();
    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('상세 내용');
    await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', await second.getAttribute('id'));
  },
  async tag(page) {
    const seoul = page.getByRole('button', { name: '서울', exact: true });
    await expect(seoul).toHaveAttribute('aria-pressed', 'false');
    await seoul.click();
    await expect(seoul).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('status')).toHaveText('선택 지역: 서울');
    await seoul.press('ArrowRight');
    await expect(page.getByRole('button', { name: '부산', exact: true })).toBeFocused();
  },
  async 'text-input'(page) {
    const input = page.getByLabel('신청인 이름', { exact: true });
    const describedBy = 'name-error applicant-status';
    await expect(input).toHaveValue('');
    await expect(input).toHaveAttribute('aria-describedby', describedBy);
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await input.focus();
    const cdp = await page.context().newCDPSession(page.page);
    await cdp.send('Input.imeSetComposition', { text: '신청인', selectionStart: 3, selectionEnd: 3 });
    await expect(input).toHaveValue('신청인');
    await cdp.send('Input.insertText', { text: '신청인' });
    await expect(input).toHaveValue('신청인');
    await expect(page.getByRole('status')).toHaveText('입력: 신청인 / 제출: 없음');
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
    await page.evaluate(text => navigator.clipboard.writeText(text), ' 붙여넣기');
    await page.keyboard.press('End');
    await page.keyboard.press(`${process.platform === 'darwin' ? 'Meta' : 'Control'}+V`);
    await expect(input).toHaveValue('신청인 붙여넣기');
    await page.keyboard.press('Backspace');
    await page.keyboard.type('!');
    await expect(input).toHaveValue('신청인 붙여넣!');
    await expect(input).toHaveAccessibleName('신청인 이름');
    await expect(input).toHaveAttribute('aria-describedby', describedBy);
    await expect(input).toHaveAccessibleDescription(/신청인 이름을 입력하세요/);
    await page.getByRole('button', { name: '입력 지우기' }).click();
    await expect(input).toHaveValue('');
    await input.fill('홍길동');
    await page.getByRole('button', { name: '제출', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('입력: 홍길동 / 제출: 홍길동');
    await expect(input).toHaveAttribute('aria-describedby', describedBy);
    await page.getByRole('button', { name: '초기화', exact: true }).click();
    await expect(input).toHaveValue('');
    await expect(page.getByRole('status')).toHaveText('입력: 없음 / 제출: 없음');
  },
  async 'text-list'(page) {
    await expect(page.locator('docs-preview ol')).toHaveCount(1);
    await expect(page.locator('docs-preview ul')).toHaveCount(0);
    await expect(page.getByRole('listitem')).toHaveText(['신청 조건 확인', '제출 서류 준비']);
  },
  async textarea(page) {
    const input = page.getByRole('textbox', { name: '신청 사유' });
    await input.fill('신청 사유\n서류를 확인했습니다.');
    await expect(input).toHaveValue('신청 사유\n서류를 확인했습니다.');
    await expect(input).toHaveAccessibleName('신청 사유');
    await expect(input).toHaveAccessibleDescription('예제 신청 사유를 입력하세요');
    await page.getByRole('button', { name: '입력 초기화' }).click();
    await expect(input).toHaveValue('');
  },
  async toast(page) {
    const save = page.getByRole('button', { name: '신청 저장' });
    await expect(part(page, 'toast', 'root')).toHaveCount(0);
    await save.click();
    await expect(part(page, 'toast', 'root')).toBeVisible();
    await expect(part(page, 'toast', 'message')).toHaveText('신청이 저장되었습니다.');
    await expect(page.locator('#saved-result')).toHaveText('신청이 저장되었습니다.');
    await expect(save).toBeFocused();
  },
  async tooltip(page) {
    const trigger = page.getByRole('button', { name: '신청 도움말', exact: true });
    await expect(trigger).toHaveAccessibleDescription('신청 도움말을 엽니다');
    await page.locator('#tooltip-before').focus(); // keyboard events reach the sandboxed document only while it holds focus
    await trigger.hover();
    await expect(page.getByRole('tooltip')).toHaveText('신청 도움말을 엽니다');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await page.mouse.move(1050, 850);
    await page.keyboard.press('Tab');
    await expect(trigger).not.toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('tooltip')).toHaveText('신청 도움말을 엽니다');
  },
  async tts(page) {
    await expect(page.getByRole('note')).toContainText('시뮬레이션');
    await expect(page.locator('#tts-state')).toHaveText('상태: 준비');
    await page.getByRole('button', { name: '음성 안내 재생', exact: true }).click();
    await expect(page.locator('#tts-state')).toHaveText('상태: 읽는 중');
    await page.getByRole('button', { name: '음성 안내 일시정지' }).click();
    await expect(page.locator('#tts-state')).toHaveText('상태: 일시 정지됨');
    await page.getByRole('button', { name: '음성 안내 중지' }).click();
    await expect(page.locator('#tts-state')).toHaveText('상태: 준비');
    await expect(page.getByRole('note')).toContainText('시뮬레이션');
  },
  async 'tutorial-panel'(page) {
    const panel = part(page, 'tutorial-panel', 'root');
    const tasks = part(page, 'tutorial-panel', 'task'); const back = part(page, 'tutorial-panel', 'back');
    const step = title => part(page, 'tutorial-panel', 'step').filter({ hasText: title });
    await expect(page.getByRole('status')).toHaveText('현재 대상: 없음');
    await expect(part(page, 'tutorial-panel', 'title')).toHaveText('따라하기');
    await expect(panel).toHaveAccessibleName('따라하기');
    await expect(page.getByRole('tablist', { name: '안내 종류' })).toBeVisible();
    await expect(part(page, 'tutorial-panel', 'tab')).toHaveText(['도움말', '튜토리얼']);
    await expect(page.getByRole('tab', { name: '튜토리얼' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: '튜토리얼' })).toHaveAttribute('data-krds-state', 'selected');
    await expect(page.getByRole('tabpanel', { name: '튜토리얼' })).toBeVisible();
    // Overview: every task, no back control, step lists collapsed behind each task toggle.
    await expect(tasks).toHaveCount(2);
    await expect(tasks.locator('h3')).toHaveText(['예제 신청하기', '신청 내용 확인하기']);
    await expect(back).toHaveCount(0);
    await expect(part(page, 'tutorial-panel', 'task-toggle').first()).toHaveAttribute('aria-expanded', 'false');
    await expect(part(page, 'tutorial-panel', 'start').first()).toHaveAttribute('id', 'tutorial-start');
    await shot(page, 'tutorial-panel-overview');
    await part(page, 'tutorial-panel', 'start').first().click();
    await expect(page.getByRole('status')).toHaveText('현재 대상: 신청인 이름');
    await expect(page.locator('#applicant-name')).toHaveAttribute('data-active-target', 'true');
    // Task view: only the active task, with the labelled back control and the current step marked.
    await expect(tasks).toHaveCount(1);
    await expect(tasks.locator('h3')).toHaveText('예제 신청하기');
    await expect(back).toBeVisible();
    await expect(back).toHaveText('작업 목록');
    await expect(part(page, 'tutorial-panel', 'task-toggle')).toHaveAttribute('aria-expanded', 'true');
    await expect(step('이름 입력')).toHaveAttribute('aria-current', 'step');
    await step('신청 저장').click();
    await expect(page.getByRole('status')).toHaveText('현재 대상: 신청 저장');
    await expect(page.locator('#save-application')).toHaveAttribute('data-active-target', 'true');
    await expect(step('신청 저장')).toHaveAttribute('aria-current', 'step');
    await expect(step('이름 입력')).not.toHaveAttribute('aria-current', 'step');
    await shot(page, 'tutorial-panel-task-view');
    await back.click();
    await expect(tasks).toHaveCount(2);
    await expect(back).toHaveCount(0);
    await expect(part(page, 'tutorial-panel', 'task-toggle').first()).toBeFocused();
    await page.getByRole('button', { name: '따라하기 중지' }).click();
    await expect(page.getByRole('status')).toHaveText('현재 대상: 없음');
    await expect(page.locator('[data-active-target=true]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: '따라하기 시작' }).first()).toBeFocused();
  },
  async 'visually-hidden'(page) {
    await expect(page.getByRole('button', { name: '신청 제출' })).toHaveAccessibleDescription('신청 내용을 확인하세요');
    await expect(page.locator('#hidden-help')).toHaveCSS('position', 'absolute');
    assert.ok(await page.locator('#hidden-help').evaluate(e => e.getBoundingClientRect().width <= 1));
  },
};

try {
  assert.equal(definitions.length, 54, 'definitions must contain exactly 54 defaults');
  assert.deepEqual(definitions.map(d => d.acceptanceId).sort(), acceptance.map(a => a.acceptanceId).sort());
  const unmapped = acceptance.filter(item => typeof scenarios[item.componentId] !== 'function').map(item => item.acceptanceId);
  assert.deepEqual(unmapped, [], 'every acceptance ID needs a browser scenario');
  for (const item of acceptance) {
    const id = item.componentId;
    if (only.length && !only.includes(id)) continue;
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
    page.setDefaultTimeout(5000);
    const errors = []; const badRequests = [];
    page.on('pageerror', e => errors.push(String(e)));
    // Exactly one whitelisted failure: the Image acceptance item's intentionally missing local src (HTTP 404 and its console report).
    const allowedMissing = id === 'image' ? `${origin}${base}local-assets/intentional-missing-image.svg` : null;
    const allowed = { response: 0, console: 0 };
    page.on('console', message => { if (message.type() !== 'error') return; if (allowedMissing && message.location().url === allowedMissing && /404/.test(message.text())) { allowed.console++; return; } errors.push(message.text()); });
    page.on('response', r => { if (r.status() < 400) return; if (allowedMissing && r.url() === allowedMissing && r.status() === 404) { allowed.response++; return; } badRequests.push(`${r.status()} ${r.url()}`); });
    page.context().on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) badRequests.push('external ' + r.url()); });
    try {
      if (id === 'carousel') await page.clock.install();
      let view = await embed(page, id);
      await expect(view.locator('[data-preview-return]')).toBeVisible();
      await page.waitForFunction(() => window.__messages.some(m => m.type === 'ready') && window.__messages.some(m => m.type === 'size' && m.height > 0));
      // R2: every host control is the public Button; reset rows follow the result region.
      assert.deepEqual(await view.evaluate(() => [...document.querySelectorAll('docs-preview button')].filter(b => !b.hasAttribute('data-preview-return') && !b.closest('[data-krds-component]:not([data-krds-component=button])') && b.getAttribute('data-krds-component') !== 'button').map(b => b.textContent.trim())), [], 'no raw button in host area');
      assert.deepEqual(await view.evaluate(() => [...document.querySelectorAll('docs-preview button')].filter(b => /초기화/.test(b.textContent)).filter(b => { const result = b.closest('form,docs-preview')?.querySelector('output,[role=status]'); return !!result && (result.contains(b) || !(result.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)); }).map(b => b.textContent.trim())), [], 'reset row follows the result region');
      const before = await signature(view);
      await scenarios[id](view);
      await page.screenshot({ path: resolve(evidence, `${id}-outcome.png`), fullPage: true });
      view = await embed(page, id);
      await expect(view.locator('[data-preview-return]')).toBeVisible();
      assert.deepEqual(await signature(view), before, 'reload restores native baseline');
      await page.waitForFunction(() => window.__messages.some(m => m.type === 'ready'));
      // An open bottom sheet correctly traps focus, so the frame exit is reachable only after the sheet is dismissed.
      if (id === 'bottom-sheet') { await view.getByRole('button', { name: '닫기', exact: true }).click(); await expect(view.getByRole('dialog')).toBeHidden(); }
      await view.locator('[data-preview-return]').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#exit-target')).toBeFocused();
      assert.ok(await page.evaluate(() => window.__messages.some(m => m.type === 'return-focus') && window.__rejected.length === 0 && !window.__messages.some(m => m.type === 'error')), 'embedded transport: ready, size, return-focus; no error');
      assert.deepEqual(errors, []);
      assert.deepEqual(badRequests, []);
      if (allowedMissing) assert.ok(allowed.response >= 1 && allowed.console >= 1, 'intentional missing image really 404s');
      results.push({ componentId: id, acceptanceId: item.acceptanceId, status: 'passed' });
    } catch (error) {
      results.push({ componentId: id, acceptanceId: item.acceptanceId, status: 'failed', error: String(error).slice(0, 1200), errors, badRequests });
      console.log('FAIL', id, String(error).slice(0, 500), errors, badRequests);
    } finally { await page.close(); }
  }
  // Unknown identities must be rejected by the host rather than rendering a fallback example.
  const page = await browser.newPage();
  const rejectionErrors = [];
  page.on('pageerror', e => rejectionErrors.push(String(e)));
  page.on('console', message => { if (message.type() === 'error') rejectionErrors.push(message.text()); });
  page.on('response', r => { if (r.status() >= 400) rejectionErrors.push(`${r.status()} ${r.url()}`); });
  page.on('request', r => { if (!r.url().startsWith(origin)) rejectionErrors.push('external ' + r.url()); });
  for (const [id, example] of [['splash-screen', 'default'], ['button', 'secondary'], ['unknown', 'default']]) {
    const view = await embed(page, id, example);
    await expect(view.locator('docs-preview')).toHaveText('지원하지 않는 예제입니다.');
    assert.equal(await view.locator('docs-preview [data-krds-component]').count(), 0, `no native example renders for ${id}/${example}`);
    assert.ok(await page.evaluate(() => !window.__messages.some(m => m.type === 'ready')), 'rejected identity never reports ready');
  }
  assert.deepEqual(rejectionErrors, [], 'unknown identities are rejected without errors');
  await page.close();
} finally {
  await browser.close();
  await new Promise(done => server.close(done));
  let manifestSha256 = null;
  try { manifestSha256 = createHash('sha256').update(readFileSync(resolve(artifact, 'artifact-manifest.json'))).digest('hex'); } catch {}
  writeFileSync(resolve(evidence, 'results.json'), JSON.stringify({ artifact, manifestSha256, results }, null, 2) + '\n');
}
const passed = results.filter(r => r.status === 'passed').length;
console.log(`${passed}/${results.length} native Angular acceptance scenarios passed.`);
if (results.some(r => r.status === 'failed') || (!only.length && results.length !== 54)) process.exitCode = 1;
