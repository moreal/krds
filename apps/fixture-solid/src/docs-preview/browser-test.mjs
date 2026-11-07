import { createServer } from 'node:http';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { expect } from '@playwright/test';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../../../..', import.meta.url));
const artifact = resolve(root, process.env.SOLID_PREVIEW_ARTIFACT || 'apps/fixture-solid/dist/docs-preview');
const evidence = resolve(root, '.superpowers/sdd/2026-11-01-native-live-previews/solid-browser');
mkdirSync(evidence, { recursive: true });
const definitions = JSON.parse(readFileSync(new URL('./definitions.json', import.meta.url))).demos.filter(d => d.exampleId === 'default');
const acceptance = JSON.parse(readFileSync(resolve(root, 'apps/docs/demo-acceptance.json'))).items;
assert.equal(definitions.length, 54);
// R3: example sources with ranges must resolve to their symbol.
for (const d of definitions) {
  const example = d.sources.find(x => x.role === 'example'), host = d.sources.find(x => x.path.endsWith('/examples.ts'));
  assert.ok(host && host.role === 'host' && host.ranges?.length === 1, `${d.componentId}: examples.ts selection binding`);
  const hostText = readFileSync(resolve(root, host.path)).subarray(host.ranges[0].start, host.ranges[0].end).toString();
  assert.ok(hostText.startsWith(`'${d.componentId}':`), `${d.componentId}: selection range`);
  if (example.path.endsWith('CatalogExamples.tsx')) {
    const bytes = readFileSync(resolve(root, example.path));
    const slices = example.ranges.map(r => bytes.subarray(r.start, r.end).toString());
    assert.ok(slices.some(t => new RegExp(`^(?:export )?function ${example.symbolOrBranch}\\b`).test(t)), `${d.componentId}: range names ${example.symbolOrBranch}`);
  }
}
assert.deepEqual(definitions.map(d => d.acceptanceId).sort(), acceptance.map(a => a.acceptanceId).sort());
const base = '/krds/previews/solid/';
const server = createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path === '/krds/__parent.html') {
    res.setHeader('content-type', 'text/html');
    res.end(`<!doctype html><meta charset="utf-8"><body style="margin:0"><iframe id="f" title="preview" sandbox="allow-scripts allow-same-origin" style="border:0;display:block;width:1100px;height:900px"></iframe><script>window.__msgs=[];const f=document.getElementById('f');addEventListener('message',e=>{if(e.source===f.contentWindow&&e.origin===location.origin)window.__msgs.push(e.data)});f.src=new URLSearchParams(location.search).get('src');</script>`);
    return;
  }
  if (!path.startsWith(base) || path.includes('..')) { res.writeHead(404).end(); return; }
  try {
    const bytes = readFileSync(resolve(artifact, path.slice(base.length) || 'index.html'));
    res.setHeader('content-type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wav': 'audio/wav', '.svg': 'image/svg+xml' })[extname(path)] || 'application/octet-stream');
    res.end(bytes);
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const results = [];
const url = `${origin}${base}index.html`;
const part = (page, id, name) => page.locator(`[data-krds-component="${id}"][data-krds-part="${name}"]`);
const signature = page => page.locator('#preview-root').evaluate(rootEl => ({ text: rootEl.innerText, inputs: [...rootEl.querySelectorAll('input,select,textarea')].map(e => [e.name, e.value, e.checked]), aria: [...rootEl.querySelectorAll('[aria-checked],[aria-selected],[aria-pressed],[aria-expanded],[aria-valuenow]')].map(e => [e.getAttribute('aria-checked'), e.getAttribute('aria-selected'), e.getAttribute('aria-pressed'), e.getAttribute('aria-expanded'), e.getAttribute('aria-valuenow')]) }));
const scenarios = {};
const modKey = process.platform === 'darwin' ? 'Meta' : 'Control';
// Sandbox has no allow-popups: assert the native modified-click default is not suppressed by the component.
const modifiedClickKeepsDefault = async (page, link) => {
  await page.evaluate(() => { window.__modDefaultPrevented = null; document.addEventListener('click', e => { window.__modDefaultPrevented = e.defaultPrevented; }, { once: true }); });
  await link.click({ modifiers: [modKey] });
  expect(await page.evaluate(() => window.__modDefaultPrevented)).toBe(false);
};
const status = page => page.locator('#preview-root p[role=status]');
const byName = (page, role, name) => page.getByRole(role, { name, exact: true });
const resetInForm = async page => { await page.getByRole('button', { name: '입력 초기화' }).click(); };
const formResult = page => page.getByLabel('입력 결과');
const nav = async (page, link, text) => { await link.focus(); await link.press('Enter'); await expect(page.locator('#preview-route')).toContainText(text); };

// ---- pilots -------------------------------------------------------------
scenarios['button'] = async ({ page }) => {
  await expect(status(page)).toHaveText('아직 신청하지 않았습니다.');
  await byName(page, 'button', '신청하기').click();
  await expect(status(page)).toHaveText('신청이 1회 완료되었습니다.');
};
scenarios['native-select'] = async ({ page }) => {
  const select = page.getByLabel('지역', { exact: true });
  await expect(select).toHaveValue('seoul');
  expect(await select.evaluate(s => s.selectedOptions[0].textContent)).toBe('서울');
  await select.selectOption('busan');
  await expect(select).toHaveValue('busan');
  await expect(status(page)).toHaveText('선택한 지역: 부산');
  expect(await select.evaluate(s => s.selectedOptions[0].textContent)).toBe('부산');
  await page.getByRole('button', { name: '초기화' }).click();
  await expect(select).toHaveValue('seoul');
};
scenarios['modal'] = async ({ page, shot }) => {
  const open = byName(page, 'button', '모달 열기');
  await open.click();
  const dialog = page.getByRole('dialog', { name: '신청 확인' });
  await expect(dialog).toBeVisible();
  await shot('modal-open');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
  await shot('modal-closed-focus-restored');
  await open.click();
  await expect(dialog).toBeVisible();
  await byName(page, 'button', '확인').click();
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
  await expect(status(page)).toHaveText('신청을 확인했습니다.');
};
scenarios['tabs'] = async ({ page, shot }) => {
  await expect(byName(page, 'tab', '안내')).toHaveAttribute('aria-selected', 'true');
  const second = byName(page, 'tab', '제출 서류');
  await second.click();
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(byName(page, 'tab', '안내')).toHaveAttribute('aria-selected', 'false');
  await expect(page.getByRole('tabpanel')).toBeVisible();
  await expect(page.getByRole('tabpanel')).toContainText('신분증과 신청서를 준비하세요.');
  await shot('tabs-second-panel');
};
scenarios['calendar'] = async ({ page, shot }) => {
  const day = page.locator('[data-date="2024-02-29"]');
  await expect(day).toHaveAttribute('aria-pressed', 'false');
  await day.click();
  await expect(day).toHaveAttribute('aria-pressed', 'true');
  await byName(page, 'button', '확인').click();
  await expect(status(page)).toHaveText('선택한 날짜: 2024-02-29');
  await expect(day).toHaveAttribute('aria-pressed', 'true');
  await shot('calendar-selected');
};
scenarios['date-input'] = async ({ page }) => {
  const input = page.getByRole('textbox').first();
  await input.fill('2024-02-29');
  await input.press('Enter');
  await expect(status(page)).toHaveText('입력한 날짜: 2024-02-29');
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('button', { name: '초기화' }).click();
  await expect(status(page)).toHaveText('입력한 날짜: 없음');
};

// ---- remaining 48 -------------------------------------------------------
scenarios['accessible-media'] = async ({ page }) => {
  const media = page.locator('audio');
  await expect(media).toHaveAttribute('controls', '');
  await expect(media).toHaveAccessibleDescription('약 2초 동안 일정한 높이의 예제 신호음이 들립니다.');
  await expect(media).toHaveAttribute('aria-describedby', /transcript/);
  await expect(media.locator('source')).toHaveAttribute('src', /\.wav$/);
  await expect.poll(() => media.evaluate(e => e.readyState)).toBeGreaterThan(0);
  await expect(page.locator('#preview-root')).toContainText('약 2초 동안 일정한 높이의 예제 신호음이 들립니다.');
  expect(await media.evaluate(e => e.paused)).toBe(true);
};
scenarios['accordion'] = async ({ page }) => {
  const t = part(page, 'accordion', 'trigger');
  expect(await t.count()).toBe(2);
  await page.keyboard.press('Tab');
  await expect(t.first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(t.nth(1)).toBeFocused();
  await expect(t.first()).toHaveAttribute('aria-expanded', 'false');
  await t.first().focus();
  await page.keyboard.press('Enter');
  await expect(t.first()).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('예제 신청 자격 안내')).toBeVisible();
  const labelled = await t.first().evaluate(e => !!document.getElementById(e.getAttribute('aria-controls'))?.getAttribute('aria-labelledby') || e.closest('h1,h2,h3,h4,h5,h6') !== null);
  expect(labelled).toBe(true);
  await page.keyboard.press('Space');
  await expect(t.first()).toHaveAttribute('aria-expanded', 'false');
};
scenarios['back-button'] = async ({ page }) => {
  await expect(page.locator('#preview-root')).toContainText('local-current');
  await byName(page, 'button', '뒤로가기').click();
  await expect(page.locator('#preview-root')).toContainText('local-parent');
};
scenarios['badge'] = async ({ page }) => {
  const b = part(page, 'badge', 'root');
  await expect(b).toHaveText('진행 중');
  expect(await b.getAttribute('tabindex')).toBe(null);
  expect(await b.getAttribute('role')).toBe(null);
  expect(await b.locator('a,button,input,[tabindex]').count()).toBe(0);
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.closest('[data-krds-component="badge"]') !== null)).toBe(false);
};
scenarios['bottom-sheet'] = async ({ page, shot }) => {
  const dialog = page.getByRole('dialog', { name: '지역 선택' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('예제 지역을 선택하세요');
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate(d => d.contains(document.activeElement))).toBe(true);
  await dialog.getByRole('radio', { name: '부산', exact: true }).check();
  await expect(dialog.getByRole('radio', { name: '부산', exact: true })).toBeChecked();
  await shot('bottom-sheet-open');
  await part(page, 'bottom-sheet', 'close').click();
  await expect(dialog).toBeHidden();
  await expect(byName(page, 'button', '지역 선택 열기')).toBeFocused();
  await expect(status(page)).toHaveText('선택 지역: 부산');
  await byName(page, 'button', '지역 선택 열기').click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
};
scenarios['breadcrumb'] = async ({ page }) => {
  await expect(page.getByRole('navigation')).toBeVisible();
  const home = page.getByRole('link', { name: '홈', exact: true });
  await expect(home).toHaveAttribute('href', /#local-home$/);
  await expect(page.getByRole('link', { name: '신청', exact: true })).toBeVisible();
  expect(await page.locator('[aria-current="page"]').count()).toBe(0);
  await nav(page, home, 'local-home');
};
scenarios['carousel'] = async ({ page }) => {
  await page.clock.fastForward(6100);
  await expect(part(page, 'carousel', 'position')).toHaveText('2 / 3');
  const pp = part(page, 'carousel', 'play-pause');
  await page.keyboard.press('Tab');
  await expect(pp).toBeFocused();
  await expect(pp).toHaveText('재생');
  await page.keyboard.press('Tab');
  await page.clock.fastForward(6500);
  await expect(part(page, 'carousel', 'position')).toHaveText('2 / 3');
  await expect(status(page)).toHaveText('자동 재생 요청 0회');
  await page.keyboard.press('Shift+Tab');
  await expect(pp).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(pp).toHaveText('정지');
  await expect(status(page)).toHaveText(/^자동 재생 요청 [01]회$/);
  await page.clock.fastForward(6100);
  await expect(part(page, 'carousel', 'position')).toHaveText('3 / 3');
};
scenarios['checkbox'] = async ({ page }) => {
  const c = page.getByRole('checkbox');
  await page.getByText('이용약관 동의', { exact: true }).click();
  await expect(c).toBeChecked();
  await c.press('Space');
  await expect(c).not.toBeChecked();
  await c.press('Space');
  await expect(c).toBeChecked();
  await page.getByRole('button', { name: '입력 확인' }).click();
  await expect(formResult(page)).toContainText('"consent":"agreed"');
  await resetInForm(page);
  await expect(c).not.toBeChecked();
  await expect(formResult(page)).toHaveText('');
};
scenarios['coach-mark'] = async ({ page }) => {
  await expect(part(page, 'coach-mark', 'popover')).toBeHidden();
  await byName(page, 'button', '따라하기 시작').click();
  await expect(part(page, 'coach-mark', 'popover')).toBeVisible();
  await expect(part(page, 'coach-mark', 'popover')).toContainText('신청인 이름을 입력하세요');
  expect(await page.locator('#applicant-name').evaluate(e => e.nextElementSibling.id)).toBe('applicant-name-after');
  expect(await page.locator('#applicant-name-after').evaluate(e => e.nextElementSibling?.contains(document.querySelector('[data-krds-component="coach-mark"][data-krds-part="popover"]')) || e.contains(document.querySelector('[data-krds-component="coach-mark"][data-krds-part="popover"]')))).toBe(true);
};
scenarios['contextual-help'] = async ({ page }) => {
  const content = part(page, 'contextual-help', 'popover');
  await expect(content).toBeHidden();
  const trigger = byName(page, 'button', '신청 자격 도움말');
  await trigger.click();
  await expect(content).toBeVisible();
  await expect(content).toContainText('신청 자격에 관한 예제 설명입니다.');
  expect(await content.evaluate(c => c.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(content).toBeHidden();
};
scenarios['critical-alert'] = async ({ page }) => {
  const root = part(page, 'critical-alert', 'root');
  await expect(root).toContainText('긴급 안내');
  await expect(root).toContainText('예제 점검으로 신청이 잠시 중단됩니다.');
  expect(await root.locator('button').count()).toBe(0);
  const link = root.getByRole('link', { name: /점검 상세 안내/ });
  await expect(link).toHaveAttribute('href', /#local-maintenance$/);
  await page.keyboard.press('Escape');
  await expect(root).toBeVisible();
};
scenarios['disclosure'] = async ({ page }) => {
  const c = byName(page, 'button', '신청 도움말');
  await expect(c).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('신청서를 작성하는 방법입니다.')).toBeHidden();
  await c.focus();
  await c.press('Enter');
  await expect(c).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('신청서를 작성하는 방법입니다.')).toBeVisible();
  await c.press('Space');
  await expect(c).toHaveAttribute('aria-expanded', 'false');
};
scenarios['fab'] = async ({ page }) => {
  const f = byName(page, 'button', '새 신청');
  await expect(status(page)).toHaveText('새 신청 0건');
  await f.focus();
  await page.keyboard.press('Enter');
  await expect(status(page)).toHaveText('새 신청 1건');
};
scenarios['favicon'] = async ({ page }) => {
  const icons = page.locator('head link[rel~=icon]');
  expect(await icons.count()).toBe(2);
  for (const href of await icons.evaluateAll(es => es.map(e => e.href))) {
    assert.ok(href.startsWith(origin) || href.startsWith('data:'), href);
    if (!href.startsWith('data:')) assert.ok((await page.request.get(href)).ok(), href);
  }
  expect(await icons.evaluateAll(es => es.map(e => e.media).join('|'))).toMatch(/prefers-color-scheme/);
};
scenarios['file-upload'] = async ({ page, shot }) => {
  const input = page.locator('input[type=file]');
  const picker = part(page, 'file-upload', 'picker');
  await expect(picker).toHaveAccessibleName('파일 선택 첨부 서류');
  await expect(picker).toHaveAccessibleDescription(/\.txt,\.pdf/);
  await expect(input).toHaveAttribute('tabindex', '-1');
  await expect(input).toHaveAttribute('aria-hidden', 'true');
  await page.keyboard.press('Tab');
  await expect(picker).toBeFocused();
  await input.setInputFiles({ name: '신청서-A.txt', mimeType: 'text/plain', buffer: Buffer.from('local A') });
  await expect(page.locator('#preview-root')).toContainText('신청서-A.txt');
  await shot('file-upload-selected');
  await page.getByRole('button', { name: /삭제|제거/ }).click();
  await expect(page.locator('#preview-root')).not.toContainText('신청서-A.txt');
  await expect(input).toHaveValue('');
  await shot('file-upload-removed');
  await input.setInputFiles({ name: 'bad.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from('x') });
  await expect(page.locator('#preview-root')).toContainText('bad.exe: 허용하지 않는 파일 형식입니다.');
  await expect(page.locator('#preview-root')).toContainText('0 / 3개');
};
scenarios['footer'] = async ({ page }) => {
  const f = page.getByRole('contentinfo');
  await expect(f).toContainText('개인정보처리방침');
  await expect(f).toContainText('이용약관');
  await expect(f).toContainText('로컬 예제 연락처');
  await expect(f).toContainText('Independent local specimen');
  expect(await f.evaluate(e => e.lastElementChild.dataset.krdsComponent)).toBe('identifier');
  expect(await f.locator('img').evaluateAll(is => is.every(i => i.complete && i.naturalWidth > 0))).toBe(true);
};
scenarios['header'] = async ({ page }) => {
  await expect(page.getByRole('banner')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeFocused();
  const order = await page.locator('[data-krds-component="skip-link"], [data-krds-component="header"] *').evaluateAll(es => es.slice(0, 1).length);
  expect(order).toBe(1);
  await page.mouse.wheel(0, 600);
  await byName(page, 'button', '신청').click();
  await expect(page.getByRole('link', { name: '신규 신청', exact: true })).toBeVisible();
  await nav(page, page.getByRole('link', { name: '신규 신청', exact: true }), 'local-apply');
};
scenarios['help-panel'] = async ({ page }) => {
  await expect(part(page, 'help-panel', 'root')).toBeVisible();
  await byName(page, 'button', '신청 자격 도움말').click();
  await expect(part(page, 'help-panel', 'body')).toContainText('예제 신청 자격 도움말');
  await byName(page, 'button', '도움말 닫기').click();
  await expect(part(page, 'help-panel', 'root')).toBeHidden();
};
scenarios['identifier'] = async ({ page }) => {
  const id = page.getByRole('contentinfo').locator('[data-krds-component=identifier][data-krds-part=root]');
  await expect(id).toBeVisible();
  await expect(id).toContainText('독립 예제 운영기관이 운영하는 예제 서비스입니다.');
  expect(await page.getByRole('contentinfo').evaluate(e => e.lastElementChild.dataset.krdsComponent)).toBe('identifier');
  expect(await id.locator('img').evaluate(i => i.complete && i.naturalWidth > 0)).toBe(true);
};
scenarios['image'] = async ({ page, shot, expected404, landscape }) => {
  const img = page.getByRole('img', { name: '산과 강이 있는 독립 예제 그림' });
  await expect(img).toBeVisible();
  await expect(img).toHaveAttribute('src', `${base}local-assets/example-landscape.svg`);
  await expect.poll(() => img.evaluate(e => e.complete && e.naturalWidth > 0)).toBe(true);
  expect(landscape.filter(s => s === 200).length).toBeGreaterThanOrEqual(1);
  expect(await img.evaluate(e => [e.getAttribute('alt'), e.getAttribute('width'), e.getAttribute('height'), e.getAttribute('loading')])).toEqual(['산과 강이 있는 독립 예제 그림', '640', '360', 'eager']);
  const failed = page.locator('#preview-root img[data-krds-state~="error"]');
  await expect(failed).toHaveCount(1);
  await expect(failed).toHaveAttribute('src', `${base}local-assets/intentional-missing-image.svg`);
  await expect.poll(() => failed.evaluate(e => e.complete && e.naturalWidth === 0)).toBe(true);
  await expect(failed).toHaveAttribute('alt', '불러올 수 없는 예제 그림');
  await expect(failed).toBeVisible();
  await expect(page.locator('#preview-root figure:has(img[data-krds-state~="error"]) [data-krds-component="image"][data-krds-part="description"]')).toHaveText('이미지를 불러올 수 없습니다.');
  await expect(page.locator('#preview-root figure:has(img[data-krds-state~="loaded"]) [data-krds-part="description"]')).toHaveCount(0);
  expect(expected404.http).toBe(1);
  await shot('image-loaded-and-failure-alt');
};
scenarios['in-page-navigation'] = async ({ page }) => {
  const outline = page.locator('.preview-outline');
  const nav1 = outline.getByRole('navigation');
  const body = outline.locator('article');
  expect(await nav1.evaluate((n, b) => !!(n.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING), await body.elementHandle())).toBe(true);
  const navBox = await nav1.boundingBox(), bodyBox = await body.boundingBox();
  expect(navBox.x).toBeGreaterThan(bodyBox.x);
  const first = page.getByRole('link', { name: /신청 개요/ });
  await first.focus();
  await first.press('Enter');
  await expect(page.locator('#overview')).toBeFocused();
  await expect(first).toHaveAttribute('aria-current', /location|true/);
  await page.locator('#requirements').scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 400);
  await expect(page.getByRole('link', { name: /신청 조건/ })).toHaveAttribute('aria-current', /location|true/);
};
scenarios['language-switcher'] = async ({ page }) => {
  await expect(page.locator('p[lang=ko]')).toHaveText('한국어 예제');
  const en = page.getByRole('link', { name: /English/ });
  await en.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('p[lang=en]')).toHaveText('English example');
};
scenarios['link'] = async ({ page }) => {
  const link = page.getByRole('link', { name: '신청 안내', exact: true });
  await expect(link).toHaveAttribute('href', /#local-application$/);
  await nav(page, link, 'local-application');
  await modifiedClickKeepsDefault(page, link);
};
scenarios['main-menu'] = async ({ page }) => {
  const home = page.getByRole('link', { name: '홈', exact: true });
  const support = page.getByRole('link', { name: '지원', exact: true });
  await expect(home).toHaveAttribute('href', /#local-home$/);
  await expect(support).toHaveAttribute('href', /#local-support$/);
  await modifiedClickKeepsDefault(page, support);
  await nav(page, support, 'local-support');
};
scenarios['masthead'] = async ({ page }) => {
  await expect(page.getByRole('note')).toContainText('실제 공식 정부서비스가 아닙니다');
  await expect(part(page, 'masthead', 'root')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeFocused();
};
scenarios['pagination'] = async ({ page }) => {
  const links = part(page, 'pagination', 'link');
  await expect(page.locator('[aria-current=page]')).toHaveText('1');
  expect(await part(page, 'pagination', 'previous').count()).toBe(0);
  await expect(part(page, 'pagination', 'next')).toBeVisible();
  await expect(links.filter({ hasText: /^12$/ })).toHaveAttribute('href', /results\?page=12$/);
  await links.filter({ hasText: /^12$/ }).click();
  await expect(page.locator('[aria-current=page]')).toHaveText('12');
  expect(await part(page, 'pagination', 'next').count()).toBe(0);
  await expect(part(page, 'pagination', 'prev').or(part(page, 'pagination', 'previous'))).toBeVisible();
  await links.filter({ hasText: /^1$/ }).click();
  await expect(page.locator('[aria-current=page]')).toHaveText('1');
};
scenarios['quantity-toggle'] = async ({ page }) => {
  const input = page.locator('input[name=quantity]');
  const out = part(page, 'quantity-toggle', 'output');
  await expect(out).toContainText('2개');
  await part(page, 'quantity-toggle', 'increment').click();
  await expect(input).toHaveValue('3');
  await expect(out).toContainText('3개');
  await part(page, 'quantity-toggle', 'decrement').click();
  await part(page, 'quantity-toggle', 'decrement').click();
  await expect(input).toHaveValue('1');
  for (let i = 0; i < 12; i++) await part(page, 'quantity-toggle', 'increment').click({ force: true });
  await expect(input).toHaveValue('10');
  await resetInForm(page);
  await expect(input).toHaveValue('2');
};
scenarios['radio-group'] = async ({ page }) => {
  const seoul = page.getByRole('radio', { name: '서울', exact: true });
  const busan = page.getByRole('radio', { name: '부산', exact: true });
  await expect(page.getByRole('radio', { name: '제주', exact: true })).toBeDisabled();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await seoul.focus();
  await page.keyboard.press('ArrowDown');
  await expect(busan).toBeChecked();
  expect(await page.getByRole('radio', { checked: true }).count()).toBe(1);
  await page.getByRole('button', { name: '입력 확인' }).click();
  await expect(formResult(page)).toContainText('"region":"busan"');
  await resetInForm(page);
  expect(await page.getByRole('radio', { checked: true }).count()).toBe(0);
};
scenarios['range-slider'] = async ({ page }) => {
  const s = page.getByRole('slider');
  await expect(s).toHaveValue('50');
  await s.focus();
  await s.press('ArrowRight');
  await expect(s).toHaveValue('60');
  await expect(part(page, 'range-slider', 'output')).toHaveText('60');
  const box = await s.boundingBox();
  await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
  expect(Number(await s.inputValue())).toBeGreaterThan(60);
  await resetInForm(page);
  await expect(s).toHaveValue('50');
};
scenarios['resize'] = async ({ page }) => {
  const c = part(page, 'resize', 'trigger');
  const section = page.locator('#preview-root section').first();
  const base = parseFloat(await section.evaluate(e => getComputedStyle(e).fontSize)) / 1;
  await c.focus();
  await c.press('ArrowDown');
  await expect(c).toContainText('조금 크게');
  await expect.poll(async () => Math.round(parseFloat(await section.evaluate(e => getComputedStyle(e).fontSize)) / base * 100)).toBe(110);
  await c.click();
  await page.getByRole('button', { name: '아주 크게', exact: true }).click();
  await expect.poll(async () => Math.round(parseFloat(await section.evaluate(e => getComputedStyle(e).fontSize)) / base * 100)).toBe(130);
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement !== document.body)).toBe(true);
};
scenarios['side-navigation'] = async ({ page }) => {
  const t = part(page, 'side-navigation', 'trigger').first();
  await expect(t).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[aria-current=page]')).toContainText('신규 신청');
  await t.click();
  await expect(t).toHaveAttribute('aria-expanded', 'false');
  await t.click();
  await expect(t).toHaveAttribute('aria-expanded', 'true');
  await nav(page, page.getByRole('link', { name: '신청 내역', exact: true }), 'local-history');
};
scenarios['skip-link'] = async ({ page }) => {
  await page.keyboard.press('Tab');
  const link = page.getByRole('link', { name: '본문 바로가기' });
  await expect(link).toBeFocused();
  await expect(link).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
};
scenarios['snackbar'] = async ({ page }) => {
  const root = part(page, 'snackbar', 'root');
  await expect(root).toHaveCount(1);
  await expect(root).toContainText('저장 완료');
  expect(await page.locator('[data-krds-component=snackbar][data-krds-part=root]').count()).toBe(1);
  await root.hover();
  await page.clock.fastForward(60000);
  await expect(root).toHaveCount(1);
  await page.mouse.move(1000, 800);
  await root.getByRole('button').first().focus();
  await page.clock.fastForward(60000);
  await expect(root).toHaveCount(1);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.clock.fastForward(60000);
  await expect(root).toHaveCount(1);
  await page.evaluate(() => { delete document.hidden; delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); });
  await byName(page, 'button', '실행 취소').click();
  await expect(status(page).filter({ hasText: '저장을 취소했습니다.' })).toHaveCount(1);
  await expect(root).toHaveCount(0);
  await byName(page, 'button', '신청 저장').click();
  await expect(root).toHaveCount(1);
  await expect(page.locator('[data-krds-component=snackbar][data-krds-part=root]')).toHaveCount(1);
  await part(page, 'snackbar', 'close').click();
  await expect(root).toHaveCount(0);
  await expect(byName(page, 'button', '신청 저장')).toBeFocused();
};
scenarios['spinner'] = async ({ page }) => {
  const bar = page.getByRole('progressbar');
  await expect(bar).toHaveAttribute('aria-valuenow', '40');
  await byName(page, 'button', '작업 완료').click();
  await expect(page.locator('#preview-root [role=status]').filter({ hasText: '신청 내역을 불러왔습니다.' })).toHaveCount(1);
};
scenarios['step-indicator'] = async ({ page }) => {
  await expect(page.locator('ol')).toBeVisible();
  await expect(page.locator('[aria-current=step]')).toContainText('정보 입력');
  await expect(page.locator('ol li')).toHaveCount(3);
  expect(await page.locator('ol').innerText()).toMatch(/약관 확인[\s\S]*정보 입력[\s\S]*신청 완료/);
  expect(await page.locator('ol').evaluate(o => /완료|현재|진행/.test(o.textContent) || o.querySelector('[data-krds-status]') !== null)).toBe(true);
};
scenarios['structured-list'] = async ({ page }) => {
  await expect(page.getByRole('link', { name: /예제 신청 공고/ })).toHaveAttribute('href', /#local-notice\/a$/);
  await expect(page.locator('#preview-root')).toContainText('마감일');
  await expect(page.locator('#preview-root')).toContainText('2026-11-30');
  await expect(page.locator('#preview-root')).toContainText('담당 부서');
  await expect(page.locator('#preview-root')).toContainText('다음 신청 공고');
};
scenarios['switch'] = async ({ page }) => {
  const c = page.getByRole('switch');
  await c.focus();
  await page.keyboard.press('Space');
  await expect(c).toBeChecked();
  await expect(page.getByText('예제 알림 받기', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '입력 확인' }).click();
  await expect(formResult(page)).toContainText('notification');
  await resetInForm(page);
  await expect(c).not.toBeChecked();
};
scenarios['tab-bar'] = async ({ page }) => {
  await expect(page.getByRole('navigation')).toBeVisible();
  expect(await page.getByRole('tab').count()).toBe(0);
  const current = page.locator('[aria-current=page]');
  await expect(current).toContainText('홈');
  const apply = page.getByRole('link', { name: /신청/ }).first();
  await expect(apply).toHaveAttribute('href', /#local-apply$/);
  await nav(page, apply, 'local-apply');
};
scenarios['table'] = async ({ page }) => {
  const t = page.getByRole('table', { name: '예제 신청 내역' });
  await expect(t).toBeVisible();
  await expect(t.getByRole('columnheader', { name: '신청명' })).toBeVisible();
  await expect(t.getByRole('columnheader', { name: '수량' })).toBeVisible();
  await expect(t.getByRole('cell', { name: '신청 가' })).toBeVisible();
  await expect(t.getByRole('cell', { name: '2' })).toBeVisible();
  expect(await t.locator('th[scope=col]').count()).toBe(2);
  expect(await t.locator('td').evaluateAll(cells => cells.every(c => c.getAttribute('headers').split(' ').every(id => document.getElementById(id)?.tagName === 'TH')))).toBe(true);
};
scenarios['tag'] = async ({ page }) => {
  const seoul = byName(page, 'button', '서울');
  await seoul.click();
  await expect(seoul).toHaveAttribute('aria-pressed', 'true');
  await expect(status(page)).toHaveText('선택 지역: 서울');
  await seoul.press('ArrowRight');
  await expect(byName(page, 'button', '부산')).toBeFocused();
  await seoul.click();
  await expect(seoul).toHaveAttribute('aria-pressed', 'false');
};
scenarios['text-input'] = async ({ page, real }) => {
  const input = page.getByRole('textbox').first();
  await expect(input).toHaveAccessibleName('신청인 이름');
  await expect(page.locator('#name-error')).toBeVisible();
  const describedBy = await input.getAttribute('aria-describedby');
  expect(describedBy).toContain('name-error');
  await expect(input).toHaveAccessibleDescription(/신청인 이름을 입력하세요/);
  const cdp = await page.context().newCDPSession(real);
  await input.focus();
  await cdp.send('Input.imeSetComposition', { text: '신', selectionStart: 1, selectionEnd: 1 });
  await cdp.send('Input.imeSetComposition', { text: '신청', selectionStart: 2, selectionEnd: 2 });
  await cdp.send('Input.insertText', { text: '신청인' });
  await expect(input).toHaveValue('신청인');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
  await page.evaluate(() => navigator.clipboard.writeText(' 붙여넣기'));
  await input.press('End');
  await page.keyboard.press(`${process.platform === 'darwin' ? 'Meta' : 'Control'}+v`);
  await expect(input).toHaveValue('신청인 붙여넣기');
  await input.press('Backspace');
  await expect(input).toHaveValue('신청인 붙여넣기'.slice(0, -1));
  await expect(input).toHaveAccessibleName('신청인 이름');
  await expect(input).toHaveAccessibleDescription(/신청인 이름을 입력하세요/);
  expect(await input.getAttribute('aria-describedby')).toBe(describedBy);
  await byName(page, 'button', '입력 도움말 열기').click();
  await expect(status(page)).toHaveText('아이콘 동작 1회');
  await resetInForm(page);
  await expect(input).toHaveValue('');
  await expect(status(page)).toHaveText('아이콘 동작 1회');
};
scenarios['text-list'] = async ({ page }) => {
  await expect(page.locator('ol')).toHaveCount(1);
  await expect(page.getByRole('listitem')).toHaveCount(2);
  await expect(page.getByRole('listitem').first()).toHaveText('신청 조건 확인');
};
scenarios['textarea'] = async ({ page }) => {
  const t = page.getByRole('textbox').first();
  await expect(t).toHaveAccessibleName('신청 사유');
  await t.fill('신청 사유\n서류를 확인했습니다.');
  await expect(t).toHaveValue('신청 사유\n서류를 확인했습니다.');
  await expect(t).toHaveAccessibleName('신청 사유');
  await resetInForm(page);
  await expect(t).toHaveValue('');
};
scenarios['toast'] = async ({ page }) => {
  const save = byName(page, 'button', '신청 저장');
  await expect(part(page, 'toast', 'root')).toHaveCount(0);
  await save.focus();
  await save.click();
  await expect(part(page, 'toast', 'root')).toBeVisible();
  await expect(page.locator('#example-saved-result')).toHaveText('신청이 저장되었습니다.');
  await expect(page.locator('#preview-root [role=status]').filter({ hasText: '신청이 저장되었습니다.' }).first()).toBeAttached();
  await expect(save).toBeFocused();
  await page.clock.fastForward(2500);
  await expect(part(page, 'toast', 'root')).toBeVisible();
  await page.clock.fastForward(600);
  await expect(part(page, 'toast', 'root')).toHaveCount(0);
  await expect(page.locator('#example-saved-result')).toHaveText('신청이 저장되었습니다.');
  await expect(save).toBeFocused();
};
scenarios['tooltip'] = async ({ page }) => {
  const c = byName(page, 'button', '신청 도움말');
  await c.hover();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await expect(page.getByRole('tooltip')).toHaveText('신청 도움말을 엽니다');
  await c.focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toBeHidden();
  await page.mouse.move(1050, 850);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(c).toBeFocused();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await expect(page.getByRole('tooltip')).toHaveText('신청 도움말을 엽니다');
};
scenarios['tts'] = async ({ page }) => {
  await expect(page.getByRole('note')).toContainText('시뮬레이션');
  await expect(part(page, 'tts', 'status')).toHaveText('');
  await byName(page, 'button', '음성 안내 재생').click();
  await expect(part(page, 'tts', 'status')).toHaveText('읽는 중');
  await byName(page, 'button', '음성 안내 일시정지').click();
  await expect(part(page, 'tts', 'status')).toHaveText('일시정지');
  await byName(page, 'button', '음성 안내 중지').click();
  await expect(part(page, 'tts', 'status')).toHaveText('');
  await expect(byName(page, 'button', '음성 안내 재생')).toBeEnabled();
};
scenarios['tutorial-panel'] = async ({ page, shot }) => {
  const panel = page.locator('aside[data-krds-component="tutorial-panel"]');
  await expect(panel).toBeVisible();
  await expect(status(page)).toHaveText('현재 대상: 없음');
  await expect(part(page, 'tutorial-panel', 'tab')).toHaveCount(2);
  await expect(part(page, 'tutorial-panel', 'tab').filter({ hasText: '튜토리얼' })).toHaveAttribute('aria-selected', 'true');
  await expect(part(page, 'tutorial-panel', 'step')).toHaveCount(2);
  await expect(part(page, 'tutorial-panel', 'back')).toHaveCount(0);
  await panel.locator('[data-krds-part="start"]').click();
  await expect(part(page, 'tutorial-panel', 'back')).toHaveText('작업 목록');
  await expect(part(page, 'tutorial-panel', 'task')).toHaveCount(1);
  await expect(part(page, 'tutorial-panel', 'task-toggle')).toHaveText('예제 신청하기');
  await shot('tutorial-panel-task-view');
  await expect(part(page, 'tutorial-panel', 'step').first()).toHaveAttribute('aria-current', 'step');
  await expect(status(page)).toHaveText('현재 대상: 신청인 이름');
  await expect(page.locator('#applicant-name')).toBeFocused();
  await expect(page.locator('#applicant-name')).toHaveAttribute('data-active-target');
  await part(page, 'tutorial-panel', 'step').nth(1).click();
  await expect(part(page, 'tutorial-panel', 'step').nth(1)).toHaveAttribute('aria-current', 'step');
  await expect(status(page)).toHaveText('현재 대상: 신청 저장');
  await expect(page.locator('#save-application')).toHaveAttribute('data-active-target');
  await expect(page.locator('#applicant-name')).not.toHaveAttribute('data-active-target');
  await part(page, 'tutorial-panel', 'back').click();
  await expect(part(page, 'tutorial-panel', 'back')).toHaveCount(0);
  await expect(status(page)).toHaveText('현재 대상: 없음');
  await shot('tutorial-panel-overview');
  await panel.locator('[data-krds-part="start"]').click();
  await expect(status(page)).toHaveText('현재 대상: 신청인 이름');
  await panel.getByRole('button', { name: /중지/ }).click();
  await expect(status(page)).toHaveText('현재 대상: 없음');
  await expect(page.locator('#save-application')).not.toHaveAttribute('data-active-target');
  await expect(panel.getByRole('button', { name: '따라하기 시작', exact: true })).toBeFocused();
};
scenarios['visually-hidden'] = async ({ page }) => {
  await expect(page.getByRole('button', { name: '신청 확인' })).toHaveAccessibleDescription('신청 내용을 확인하세요');
  const hidden = page.locator('#hidden-help');
  await expect(hidden).toHaveCSS('position', 'absolute');
  const box = await hidden.boundingBox();
  expect(box.width <= 1 && box.height <= 1).toBe(true);
  await expect(hidden).toHaveText('신청 내용을 확인하세요');
};

const run = async () => {
  try {
    for (const d of definitions) {
      const id = d.componentId;
      const real = await browser.newPage({ viewport: { width: 1100, height: 900 } });
      real.setDefaultTimeout(5000);
      let frame;
      const frameMethods = new Set(['locator', 'getByRole', 'getByText', 'getByLabel', 'evaluate']);
      const page = new Proxy({}, { get: (_, k) => frameMethods.has(k) ? frame[k].bind(frame) : typeof real[k] === 'function' ? real[k].bind(real) : real[k] });
      const token = `tok${Math.random().toString(36).slice(2)}abcdefghijklmnop`;
      const embeddedUrl = `${url}?component=${id}&example=default&version=1&framework=solid&componentId=${id}&exampleId=default&token=${token}`;
      const load = async () => {
        await real.goto(`${origin}/krds/__parent.html?src=${encodeURIComponent(embeddedUrl)}`);
        const handle = await real.locator('#f').elementHandle();
        frame = await handle.contentFrame();
        assert.equal(await real.locator('#f').getAttribute('sandbox'), 'allow-scripts allow-same-origin');
        await expect(frame.locator('[data-preview-return]')).toBeVisible();
      };
      const errors = [], badRequests = [];
      const expected404 = { http: 0 };
      const landscape = [];
      real.on('response', r => { if (r.url() === `${origin}${base}local-assets/example-landscape.svg`) landscape.push(r.status()); });
      const missing = `${origin}${base}local-assets/intentional-missing-image.svg`;
      real.on('pageerror', e => errors.push(String(e)));
      real.on('console', m => { if (m.type() === 'error') { if (id === 'image' && m.location().url === missing && /404/.test(m.text())) return; errors.push(`console: ${m.text()}`); } });
      real.on('response', r => { if (r.status() >= 400) { if (id === 'image' && r.status() === 404 && r.url() === missing) { expected404.http++; return; } badRequests.push(r.url()); } });
      real.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:') && !r.url().startsWith('blob:') && !r.url().startsWith('about:')) badRequests.push(r.url()); });
      const shot = async name => { await real.screenshot({ path: resolve(evidence, `${name}.png`), fullPage: true }); };
      try {
        if (typeof scenarios[id] !== 'function') throw new Error(`Missing acceptance scenario for ${d.acceptanceId}`);
        if (['carousel', 'snackbar', 'toast'].includes(id)) await real.clock.install();
        await load();
        const msgs = () => real.evaluate(() => window.__msgs);
        await expect.poll(async () => (await msgs()).some(m => m.type === 'ready' && m.componentId === id && m.token === token)).toBe(true);
        await expect.poll(async () => (await msgs()).some(m => m.type === 'size' && m.height > 0)).toBe(true);
        const before = await signature(page);
        // Host controls use the public Button; no raw <button> may exist outside a krds component root.
        assert.deepEqual(await frame.evaluate(() => [...document.querySelectorAll('#preview-root button, #preview-root input[type=button], #preview-root input[type=reset], #preview-root input[type=submit]')].filter(b => !b.closest('[data-krds-component]') && !b.matches('[data-krds-component]')).map(b => b.textContent.trim())), [], 'raw host buttons');
        assert.deepEqual(await frame.evaluate(() => [...document.querySelectorAll('output, [role=status]')].flatMap(r => [...r.querySelectorAll('button')].map(b => b.textContent.trim()))), [], 'controls inside result regions');
        await scenarios[id]({ page, shot, expected404, real, landscape });
        await shot(`${id}-outcome`);
        await frame.locator('[data-preview-return]').click();
        await expect.poll(async () => (await msgs()).some(m => m.type === 'return-focus' && m.componentId === id && m.token === token)).toBe(true);
        assert.ok((await msgs()).every(m => m.framework === 'solid' && m.exampleId === 'default'), 'all transport messages carry the preview identity');
        await load();
        assert.deepEqual(await signature(page), before, 'reload restores native baseline');
        assert.deepEqual(errors, [], 'page/console errors');
        assert.deepEqual(badRequests, [], 'bad or external requests');
        results.push({ componentId: id, acceptanceId: d.acceptanceId, status: 'passed' });
        console.log('PASS', id);
      } catch (error) {
        results.push({ componentId: id, acceptanceId: d.acceptanceId, status: 'failed', error: String(error).slice(0, 600), errors, badRequests });
        console.log('FAIL', id, String(error).slice(0, 400).replace(/\n/g, ' '));
      } finally { await real.close(); }
    }
  } finally {
    await browser.close();
    await new Promise(r => server.close(r));
    const manifest = readFileSync(resolve(artifact, 'artifact-manifest.json'));
    writeFileSync(resolve(evidence, 'results.json'), JSON.stringify({ artifact, manifestSha256: createHash('sha256').update(manifest).digest('hex'), results }, null, 2) + '\n');
  }
  const passed = results.filter(r => r.status === 'passed').length;
  console.log(`${passed}/${results.length} native Solid acceptance scenarios passed.`);
  if (passed !== 54 || results.length !== 54) process.exitCode = 1;
};
await run();
