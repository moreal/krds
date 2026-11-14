// Sandbox parity: every scenario runs inside an <iframe sandbox="allow-scripts allow-same-origin"> exactly as the docs shell embeds it
// (no allow-forms/popups/modals/top-navigation), with ready/size/return-focus transport messages checked from the parent.
// Owner-level native Vue acceptance proof for the docs live previews.
// Serves dist/docs-preview at /krds/previews/vue/ from a loopback server, then for every acceptance item in
// apps/docs/demo-acceptance.json: verifies initial state, performs the listed actions, asserts the observable outcome
// and confirms that a reload restores the baseline. Fails on page errors, console errors, non-loopback requests,
// HTTP errors and any acceptance id lacking a definition or a scenario.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';

const root = fileURLToPath(new URL('../../../..', import.meta.url));
const artifact = resolve(root, process.env.VUE_PREVIEW_ARTIFACT || 'apps/fixture-vue/dist/docs-preview');
const evidence = resolve(root, '.superpowers/sdd/2026-11-01-native-live-previews/vue-browser');
mkdirSync(evidence, { recursive: true });
const only = process.env.VUE_PREVIEW_ONLY ? process.env.VUE_PREVIEW_ONLY.split(',') : null;
const definitions = JSON.parse(readFileSync(new URL('./definitions.json', import.meta.url))).demos.filter(d => d.exampleId === 'default');
const acceptance = JSON.parse(readFileSync(resolve(root, 'apps/docs/demo-acceptance.json'))).items;
assert.equal(acceptance.length, 54, 'acceptance inventory has 54 items');
assert.equal(definitions.length, 54, 'definitions bind 54 defaults');
assert.deepEqual(definitions.map(d => d.acceptanceId).sort(), acceptance.map(a => a.acceptanceId).sort(), 'every acceptance id has a definition');

const base = '/krds/previews/vue/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wav': 'audio/wav', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
const token = 'sandboxparitytoken1234';
const parentHtml = (id) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;height:100%}iframe{display:block;width:100%;height:100vh;border:0}</style></head><body>
<iframe id="preview" title="preview" sandbox="allow-scripts allow-same-origin" src="${base}index.html?component=${id}&amp;example=default&amp;version=1&amp;framework=vue&amp;componentId=${id}&amp;exampleId=default&amp;token=${token}"></iframe>
<script>window.__msgs=[];addEventListener('message',e=>{if(e.origin===location.origin&&e.source===document.getElementById('preview').contentWindow)window.__msgs.push(e.data)});</script></body></html>`;
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;
  if (path === `${base}__parent.html`) { res.setHeader('content-type', 'text/html'); res.end(parentHtml(url.searchParams.get('component'))); return; }
  if (!path.startsWith(base) || path.includes('..')) { res.writeHead(404).end(); return; }
  try {
    const bytes = readFileSync(resolve(artifact, path.slice(base.length) || 'index.html'));
    res.setHeader('content-type', mime[extname(path)] || 'application/octet-stream');
    res.end(bytes);
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const entry = id => `${origin}${base}__parent.html?component=${id}`;
const framed = ['accessible-media'];
const browser = await chromium.launch({ headless: true });

const signature = page => page.evaluate(() => ({
  text: document.body.innerText,
  fields: [...document.querySelectorAll('input,select,textarea')].map(e => [e.name, e.value, e.checked]),
  aria: [...document.querySelectorAll('[aria-checked],[aria-selected],[aria-pressed],[aria-expanded],[aria-valuenow],[aria-current]')]
    .map(e => [e.getAttribute('aria-checked'), e.getAttribute('aria-selected'), e.getAttribute('aria-pressed'), e.getAttribute('aria-expanded'), e.getAttribute('aria-valuenow'), e.getAttribute('aria-current')]),
  hash: location.hash,
}));
const inside = (page, selector) => page.evaluate(sel => { const el = document.querySelector(sel); return !!el && el.contains(document.activeElement); }, selector);

// Load the sandboxed iframe from the local parent page and return a page-like view bound to the frame.
async function open(page, id) {
  await page.goto(entry(id));
  const handle = await page.locator('iframe#preview').elementHandle();
  assert.equal(await handle.getAttribute('sandbox'), 'allow-scripts allow-same-origin');
  const frame = await handle.contentFrame();
  const delegated = new Set(['locator', 'getByRole', 'getByText', 'getByLabel', 'getByTitle', 'getByPlaceholder', 'evaluate', 'url', 'waitForLoadState']);
  const view = new Proxy(page, { get(target, key) { if (key === '__real') return target; if (delegated.has(key)) return frame[key].bind(frame); const v = target[key]; return typeof v === 'function' ? v.bind(target) : v; } });
  await expect(view.locator('[data-preview-return]')).toBeVisible();
  return view;
}
// Transport checks from the parent: identity-bound ready and size messages.
async function transport(page) {
  await expect.poll(() => page.evaluate(() => window.__msgs.map(m => m.type))).toEqual(expect.arrayContaining(['ready', 'size']));
  const msgs = await page.evaluate(() => window.__msgs);
  for (const m of msgs) assert.ok(m.version === 1 && m.framework === 'vue' && m.token === token, 'message identity');
  assert.ok(msgs.filter(m => m.type === 'size').every(m => m.height > 0), 'positive size');
  assert.ok(!msgs.some(m => m.type === 'error'), 'no host error message');
}
// One scenario per acceptance id. Each receives helpers and performs the listed actions then asserts the observable outcome.
const scenarios = {
  'accessible-media': async ({ page, shot }) => {
    const media = page.locator('audio');
    await expect(media).toHaveAttribute('controls', '');
    await expect.poll(() => media.evaluate(e => e.readyState)).toBeGreaterThan(0);
    await expect(page.locator('audio source')).toHaveAttribute('src', /specimen-audio\.wav$/);
    assert.equal((await page.request.get(await page.locator('audio source').evaluate(e => e.src))).status(), 200);
    await media.evaluate(async e => { e.muted = true; await e.play(); });
    await expect.poll(() => media.evaluate(e => !e.paused)).toBe(true);
    await media.evaluate(e => e.pause());
    await expect.poll(() => media.evaluate(e => e.paused)).toBe(true);
    await expect(page.getByText('약 2초 동안 일정한 높이의 예제 신호음이 들립니다.', { exact: true })).toBeVisible();
    await expect(media).toHaveAccessibleDescription('약 2초 동안 일정한 높이의 예제 신호음이 들립니다.');
    await expect(page.locator('[data-krds-component="accessible-media"][data-krds-part="transcript"]')).toContainText("약 2초");
    await shot('static-media');
  },
  accordion: async ({ page, part }) => {
    const triggers = part('trigger');
    assert.equal(await triggers.count(), 2);
    await page.keyboard.press('Tab');
    await expect(triggers.nth(0)).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(triggers.nth(1)).toBeFocused();
    const trigger = page.getByRole('button', { name: '신청 자격', exact: true });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panelId = await trigger.getAttribute('aria-controls');
    await expect(page.locator(`#${panelId}`)).toBeVisible();
    assert.equal(await page.locator(`#${panelId}`).getAttribute('aria-labelledby'), null, 'panel is a plain region-less container named only through aria-controls');
    assert.equal(await page.locator(`#${panelId}`).getAttribute('role'), null);
    assert.equal(await trigger.evaluate(e => e.parentElement.tagName), 'H3', 'trigger sits inside a heading');
  },
  'back-button': async ({ page }) => {
    await expect(page.locator('p[role=status]')).toHaveText('현재 화면: 신청 상세');
    await page.getByRole('button', { name: '이전 화면', exact: true }).click();
    await expect(page.locator('p[role=status]')).toHaveText('현재 화면: 신청 안내');
  },
  badge: async ({ page, part }) => {
    await expect(part('root')).toHaveText('접수 중');
    assert.equal(await part('root').getAttribute('tabindex'), null);
    assert.equal(await part('root').getAttribute('role'), null);
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-preview-return]')).toBeFocused();
  },
  'bottom-sheet': async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: '지역 선택' });
    await expect(dialog).toBeVisible();
    await expect.poll(() => dialog.evaluate(e => e.contains(document.activeElement))).toBe(true);
    for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); assert.ok(await dialog.evaluate(e => e.contains(document.activeElement)), 'focus trapped while open'); }
    await dialog.getByRole('radio', { name: '부산', exact: true }).check();
    await expect(page.locator('p[role=status]')).toHaveText('선택 지역: 부산');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.getByRole('button', { name: '지역 선택 열기' }).focus();
    await page.keyboard.press('Tab');
    assert.ok(!(await page.evaluate(() => !!document.querySelector('[role=dialog]'))), 'trap released after close');
    await page.getByRole('button', { name: '지역 선택 열기' }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /닫기/ }).first().click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  },
  breadcrumb: async ({ page }) => {
    const nav = page.getByRole('navigation', { name: '브레드크럼' });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: '홈', exact: true })).toHaveAttribute('href', '#local-home');
    await expect(nav.getByRole('listitem')).toHaveCount(3);
    await expect(nav.locator('[aria-current=page]')).toContainText('신청 상세');
    await nav.getByRole('link', { name: '홈', exact: true }).click();
    await expect(page.getByRole('region', { name: '로컬 목적지' })).toContainText('home');
  },
  button: async ({ page, shot }) => {
    await expect(page.locator('p[role=status]')).toHaveText('아직 신청하지 않았습니다.');
    await page.getByRole('button', { name: '신청하기', exact: true }).click();
    await expect(page.locator('p[role=status]')).toHaveText('신청이 1회 완료되었습니다.');
    await shot('button-clicked');
  },
  calendar: async ({ page, part, shot }) => {
    const day = part('day').filter({ hasText: /^20일$/ });
    await expect(part('heading')).toHaveText('2024년 2월');
    await day.click();
    await expect(day).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-krds-component=calendar][aria-pressed=true]')).toHaveCount(1);
    await part('confirm').click();
    await expect(page.locator('p[role=status]')).toHaveText('2024-02-20');
    await shot('calendar-selected');
  },
  carousel: async ({ page, part }) => {
    const active = () => part('slide').and(page.locator('[data-krds-state=active]')).getAttribute('data-slide-id');
    const toggle = part('play-pause');
    await expect(toggle).toHaveText('정지');
    assert.equal(await active(), 'one');
    await page.clock.runFor(6100);
    await expect.poll(active).toBe('two');
    await page.keyboard.press('Tab');
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveText('재생');
    await page.clock.runFor(6500);
    assert.equal(await active(), 'two', 'focus entry stops advancement');
    await page.locator('[data-preview-return]').focus();
    await page.clock.runFor(6500);
    assert.equal(await active(), 'two', 'leaving does not resume');
    await expect(toggle).toHaveText('재생');
    await expect(page.locator('p[role=status]')).toHaveText('자동 재생 요청 0회');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveText('정지');
    await expect(page.locator('p[role=status]')).toHaveText('자동 재생 요청 0회'); // already playing: no same-intent duplicate callback
    await page.clock.runFor(6100);
    await expect.poll(active).toBe('three');
  },
  checkbox: async ({ page }) => {
    const box = page.getByRole('checkbox', { name: '이용약관 동의' });
    await page.getByText('이용약관 동의', { exact: true }).click();
    await expect(box).toBeChecked();
    await box.press('Space');
    await expect(box).not.toBeChecked();
    await box.press('Space');
    await expect(box).toBeChecked();
    await expect(page.locator('p[role=status]')).toHaveText('현재 값: true');
    await page.getByRole('button', { name: '입력 확인' }).click();
    await expect(page.getByLabel('입력 결과')).toHaveText('{"consent":"agreed"}');
    await page.getByRole('button', { name: '초기화' }).click();
    await expect(box).not.toBeChecked();
    await expect(page.getByLabel('입력 결과')).toHaveText('');
  },
  'coach-mark': async ({ page, part }) => {
    const popover = part('popover');
    await expect(popover).toHaveCount(0);
    await page.getByRole('button', { name: '따라하기 시작' }).click();
    await expect(popover).toBeVisible();
    assert.equal(await page.locator('#example-target').evaluate(e => e.nextElementSibling.id), 'example-target-after');
    assert.equal(await popover.evaluate(e => e.previousElementSibling === document.getElementById('example-target-after') || e.parentElement === document.getElementById('example-target-after') || document.getElementById('example-target-after').contains(e)), true, 'popover follows target at the boundary');
  },
  'contextual-help': async ({ page, part }) => {
    const trigger = page.getByRole('button', { name: '신청 자격 도움말', exact: true });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(part('popover')).toHaveCount(0);
    await trigger.click();
    await expect(part('popover')).toBeVisible();
    await expect(part('popover')).toContainText('신청 자격에 관한 예제 설명입니다.');
    await expect(part('popover').getByRole('link', { name: '상세 요건' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(part('close')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Escape');
    await expect(part('popover')).toHaveCount(0);
    await expect(trigger).toBeFocused();
  },
  'critical-alert': async ({ page, part }) => {
    await expect(part('root')).toContainText('서비스 안내');
    await expect(part('root')).toContainText('이 페이지는 독립 로컬 예제입니다.');
    assert.equal(await part('root').locator('button, [aria-expanded]').count(), 0, 'cannot be dismissed or collapsed');
    await expect(part('link')).toHaveAttribute('href', '#local-details');
  },
  'date-input': async ({ page }) => {
    const input = page.getByRole('textbox', { name: '방문일' });
    await input.fill('2024-03-15');
    await input.blur();
    await expect(input).toHaveValue('2024-03-15');
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('p[role=status]').filter({ hasText: '2024-03-15' })).toHaveCount(1);
  },
  disclosure: async ({ page }) => {
    const trigger = page.getByRole('button', { name: '신청 도움말' });
    const content = page.getByText('제출 전에 내용을 확인하세요.');
    await expect(content).toBeHidden();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(content).toBeVisible();
    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(content).toBeHidden();
  },
  fab: async ({ page }) => {
    await page.getByRole('button', { name: '새 신청', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('p[role=status]')).toHaveText('새 신청 1건');
    await page.keyboard.press('Space');
    await expect(page.locator('p[role=status]')).toHaveText('새 신청 2건');
  },
  favicon: async ({ page }) => {
    const icons = page.locator('head link[rel~=icon]');
    assert.equal(await icons.count(), 2);
    const found = await icons.evaluateAll(els => els.map(e => ({ href: e.href, media: e.media, type: e.type })));
    assert.ok(found.some(i => /light/.test(i.href)) && found.some(i => /dark/.test(i.href)), 'light and dark icons');
    assert.ok(found.some(i => /dark/.test(i.media)) || found.some(i => i.media), 'alternate icon is conditional');
    for (const icon of found) { assert.ok(icon.href.startsWith(origin)); assert.equal((await page.request.get(icon.href)).status(), 200); }
  },
  'file-upload': async ({ page, part, shot }) => {
    const input = page.locator('input[type=file]');
    const picker = part('picker');
    await page.keyboard.press('Tab');
    await expect(picker).toBeFocused();
    await expect(picker).toHaveAccessibleName('파일 선택');
    await expect(input).toHaveAttribute('tabindex', '-1');
    await expect(input).toHaveAttribute('aria-hidden', 'true');
    await input.setInputFiles({ name: 'proof.txt', mimeType: 'text/plain', buffer: Buffer.from('independent local example') });
    await expect(page.locator('[data-krds-part=list]')).toContainText('proof.txt');
    await expect(page.locator('p[role=status]')).toHaveText('선택한 파일: proof.txt');
    await shot('file-upload-selected');
    await page.locator('[data-krds-part=list]').getByRole('button').first().click();
    await expect(page.locator('[data-krds-part=list]')).not.toContainText('proof.txt');
    await expect(input).toHaveValue('');
    await expect(page.locator('p[role=status]')).toHaveText('선택한 파일: 없음');
    await shot('file-upload-removed');
  },
  footer: async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer).toHaveCount(1);
    await expect(footer).toContainText('example@example.test');
    await expect(footer).toContainText('개인정보 처리방침');
    await expect(footer).toContainText('독립 로컬 예제 콘텐츠');
    assert.equal(await footer.evaluate(e => e.lastElementChild.querySelector('[data-krds-part=text]') !== null), true, 'Identifier is last');
  },
  header: async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeFocused();
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    const order = await page.evaluate(() => {
      const at = s => document.querySelector(s);
      const nodes = [at('header [data-krds-part=identity]'), at('header [data-krds-part=utilities]'), at('header [data-krds-part=search]'), at('header nav')];
      return nodes.map((n, i) => i === 0 ? true : !!(nodes[i - 1].compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING));
    });
    assert.deepEqual(order, [true, true, true, true], 'identity, utilities, search, navigation DOM order');
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole('link', { name: '독립 예제 홈' })).toBeAttached();
    await page.getByRole('button', { name: '검색', exact: true }).click();
    await expect(page.locator('p[role=status]')).toHaveText('검색 요청 1회');
    await page.getByRole('button', { name: '신청', exact: true }).click();
    await page.getByRole('link', { name: '신규 신청', exact: true }).click();
    await expect(page.getByRole('region', { name: '로컬 목적지' })).toContainText('apply');
  },
  'help-panel': async ({ page, part }) => {
    const panel = page.getByRole('complementary', { name: '도움말' });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('button', { name: '신청 자격', exact: true })).toBeVisible();
    await page.getByRole('button', { name: '신청 자격 도움말' }).click();
    await expect(panel).toContainText('예제 신청 자격을 확인하세요.');
    await expect(panel.getByRole('link', { name: '상세 요건' })).toHaveAttribute('href', '#local-eligibility');
    await page.getByRole('button', { name: '도움말 닫기' }).click();
    await expect(page.getByRole('complementary', { name: '도움말' })).toBeHidden();
  },
  identifier: async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer).toHaveCount(1);
    assert.equal(await footer.evaluate(e => e.lastElementChild.querySelector('[data-krds-part=text]') !== null), true, 'Identifier is final section of footer');
    await expect(footer).toContainText('독립 예제 운영기관');
  },
  image: async ({ page, part, allow }) => {
    // Loaded local landscape + a failure specimen whose intentionally absent src yields one whitelisted 404.
    const ok = page.getByRole('img', { name: '산과 강이 있는 독립 예제 그림' });
    await expect(ok).toHaveAttribute('src', `${base}local-assets/example-landscape.svg`);
    await expect.poll(() => ok.evaluate(e => e.complete && e.naturalWidth > 0)).toBe(true);
    const bad = page.getByRole('img', { name: '불러올 수 없는 예제 그림' });
    await expect(bad).toHaveAttribute('src', `${base}local-assets/intentional-missing-image.svg`);
    await expect(bad).toHaveAttribute('alt', '불러올 수 없는 예제 그림');
    assert.equal(await bad.evaluate(e => e.complete && e.naturalWidth === 0), true, 'specimen failed to load');
    await expect(bad).toHaveAttribute('data-krds-state', 'error');
    await expect(ok).toHaveAttribute('data-krds-state', 'loaded');
    await expect(part('description')).toHaveCount(1);
    await expect(part('description')).toHaveText('이미지를 불러올 수 없습니다.');
    await expect(page.getByText('직접 작성한 로컬 예제')).toBeVisible();
    assert.equal(allow.http.length, 1, 'exactly one whitelisted 404 response');
    assert.equal(allow.console.length, 1, 'exactly one whitelisted console error');
  },
  'in-page-navigation': async ({ page }) => {
    const first = page.getByRole('link', { name: '신청 개요' });
    await first.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#overview')).toBeFocused();
    const boxes = await page.evaluate(() => ({ nav: document.querySelector('nav').getBoundingClientRect().x, body: document.querySelector('article').getBoundingClientRect().x, domFirst: !!(document.querySelector('nav').compareDocumentPosition(document.querySelector('article')) & Node.DOCUMENT_POSITION_FOLLOWING) }));
    assert.ok(boxes.domFirst, 'outline precedes body in DOM');
    assert.ok(boxes.nav > boxes.body, 'outline is visually right of body on desktop');
    await page.locator('#requirements').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelector('#requirements').scrollIntoView());
    await expect(page.getByRole('link', { name: '신청 조건' })).toHaveAttribute('aria-current', 'location');
  },
  'language-switcher': async ({ page }) => {
    await expect(page.locator('p[lang=ko]')).toHaveText('한국어 예제');
    const english = page.getByRole('link', { name: /English/ });
    await english.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('p[lang=en]')).toHaveText('English example');
    await expect(page.getByRole('link', { name: /English/ })).toHaveAttribute('aria-current', 'true');
    const korean = page.getByRole('link', { name: '한국어', exact: true });
    await korean.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('p[lang=ko]')).toHaveText('한국어 예제');
  },
  link: async ({ page, context }) => {
    const link = page.getByRole('link', { name: '도움말', exact: true });
    await expect(link).toHaveAttribute('href', '#local-help');
    // The docs sandbox has no allow-popups: the real href stays inspectable and a modified click must not navigate the frame.
    assert.ok((await link.evaluate(e => e.href)).endsWith('#local-help'), 'real destination href');
    await link.click({ modifiers: ['ControlOrMeta'] });
    assert.equal(new URL(page.url()).hash, '', 'modified click leaves the frame in place');
    await link.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('region', { name: '로컬 목적지' })).toContainText('help');
  },
  'main-menu': async ({ page, context }) => {
    const nav = page.getByRole('navigation', { name: '메인 메뉴' });
    await expect(nav.getByRole('link', { name: '홈', exact: true })).toHaveAttribute('href', '#local-home');
    const support = nav.getByRole('link', { name: '지원', exact: true });
    await expect(support).toHaveAttribute('href', '#local-support');
    assert.ok((await support.evaluate(e => e.href)).endsWith('#local-support'), 'real leaf href');
    await support.click({ modifiers: ['ControlOrMeta'] });
    assert.equal(new URL(page.url()).hash, '', 'modified click does not navigate the frame (popups sandboxed)');
    await expect(nav.getByRole('button', { name: '신청', exact: true })).toHaveAttribute('aria-expanded', 'false');
    await support.click();
    await expect(page.getByRole('region', { name: '로컬 목적지' })).toContainText('support');
  },
  masthead: async ({ page }) => {
    await expect(page.getByRole('note')).toContainText('실제 정부 서비스가 아닌 디자인 시뮬레이션입니다.');
    const adjacent = await page.getByRole('note').evaluate(e => e.nextElementSibling?.querySelector('[data-krds-part=text]') !== null || e.nextElementSibling?.matches('[data-krds-part=root]'));
    assert.ok(adjacent, 'simulation notice adjacent to Masthead');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: '본문 바로가기' })).toBeFocused();
    await expect(page.locator('[data-krds-component=masthead][data-krds-part=root]')).toContainText('공식 전자정부 누리집');
  },
  modal: async ({ page, shot }) => {
    const open = page.getByRole('button', { name: '확인 창 열기', exact: true });
    await open.click();
    const dialog = page.getByRole('dialog', { name: '신청 확인' });
    await expect(dialog).toBeVisible();
    await expect.poll(() => dialog.evaluate(e => e.contains(document.activeElement))).toBe(true);
    await shot('modal-open');
    await dialog.getByRole('button', { name: '취소' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(open).toBeFocused();
    await shot('modal-closed');
    await open.click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(open).toBeFocused();
    await open.click();
    await dialog.getByRole('button', { name: '확인', exact: true }).click();
    await expect(page.locator('p[role=status]')).toHaveText('저장 1회');
    await expect(open).toBeFocused();
  },
  'native-select': async ({ page }) => {
    const select = page.getByLabel('지역', { exact: true });
    await expect(select).toHaveValue('seoul');
    await select.selectOption('busan');
    await expect(select).toHaveValue('busan');
    await expect(page.locator('p[role=status]')).toHaveText('busan');
  },
  pagination: async ({ page, part }) => {
    const nav = page.getByRole('navigation', { name: '페이지 이동' });
    await expect(nav.locator('[aria-current=page]')).toHaveText('1');
    assert.equal(await part('previous').count(), 0, 'no previous link on the first page');
    await expect(part('next')).toHaveAttribute('rel', 'next');
    await part('link').filter({ hasText: /^12$/ }).click();
    await expect(nav.locator('[aria-current=page]')).toHaveText('12');
    await expect(page.locator('p[role=status]')).toHaveText('현재 12쪽');
    assert.equal(await part('next').count(), 0, 'no next link on the last page');
    await expect(part('previous')).toHaveAttribute('rel', 'prev');
    await part('link').filter({ hasText: /^1$/ }).click();
    await expect(nav.locator('[aria-current=page]')).toHaveText('1');
    assert.equal(await part('previous').count(), 0);
    await shot_nav(page, 'pagination');
  },
  'quantity-toggle': async ({ page, part }) => {
    await expect(part('output')).toHaveText('2개');
    await part('increment').click();
    await expect(part('output')).toHaveText('3개');
    assert.equal(await part('increment').getAttribute('aria-disabled'), 'true', 'bounded at max');
    await part('increment').evaluate(e => e.click());
    await expect(part('output')).toHaveText('3개');
    await part('decrement').click();
    await expect(part('output')).toHaveText('2개');
    await page.getByRole('button', { name: '입력 확인' }).click();
    await expect(page.getByLabel('입력 결과')).toHaveText('{"quantity":"2"}');
    await part('increment').click();
    await page.getByRole('button', { name: '초기화' }).click();
    await expect(part('output')).toHaveText('2개');
    await expect(page.locator('p[role=status]')).toHaveText('현재 값: 2');
  },
  'radio-group': async ({ page }) => {
    const seoul = page.getByRole('radio', { name: '서울', exact: true });
    const busan = page.getByRole('radio', { name: '부산', exact: true });
    await page.keyboard.press('Tab');
    await expect(seoul).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(busan).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: '입력 확인' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(busan).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(seoul).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(busan).toBeChecked();
    await expect(page.locator('p[role=status]')).toHaveText('현재 값: busan (변경 1회)');
    assert.equal(await page.locator('input[type=radio]:checked').count(), 1);
    await seoul.focus();
    await seoul.press('Space');
    await expect(seoul).toBeChecked();
    await busan.focus();
    await busan.press('Space');
    await expect(busan).toBeChecked();
    await expect(page.getByRole('radio', { name: '제주' })).toBeDisabled();
    await page.getByRole('button', { name: '입력 확인' }).click();
    await expect(page.getByLabel('입력 결과')).toHaveText('{"region":"busan"}');
    await page.getByRole('button', { name: '초기화' }).click();
    assert.equal(await page.locator('input[type=radio]:checked').count(), 0);
  },
  'range-slider': async ({ page, part }) => {
    const slider = page.getByRole('slider', { name: '알림 음량' });
    await expect(slider).toHaveValue('50');
    const box = await slider.boundingBox();
    const y = box.y + box.height / 2;
    await page.mouse.click(box.x + box.width * 0.9, y);
    await expect.poll(async () => Number(await slider.inputValue())).toBeGreaterThan(70);
    await page.mouse.move(box.x + box.width * 0.9, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.3, y, { steps: 6 });
    await page.mouse.up();
    await expect.poll(async () => Number(await slider.inputValue())).toBeLessThan(40);
    await slider.fill('50');
    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await expect(slider).toHaveValue('60');
    await expect(part('output')).toHaveText('60');
    await slider.evaluate(e => { e.dispatchEvent(new Event('change', { bubbles: true })); e.blur(); });
    await expect(slider).toHaveValue('60');
    await expect(page.locator('p[role=status]')).toHaveText('현재 값: 60');
    await page.getByRole('button', { name: '초기화' }).click();
    await expect(slider).toHaveValue('50');
    await expect(part('output')).toHaveText('50');
  },
  resize: async ({ page, part }) => {
    const trigger = part('trigger');
    const content = page.locator('.resized');
    await expect(trigger).toHaveText('화면 크기 100%');
    await expect(content).toHaveCSS('font-size', '16px');
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(trigger).toHaveText('화면 크기 110%');
    await expect(content).toHaveCSS('font-size', '17.6px');
    await trigger.click();
    await expect(part('list')).toBeVisible();
    // Every option of the expanded control must lie within the frame height last reported to the parent.
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const reported = (await page.__real.evaluate(() => window.__msgs)).filter(m => m.type === 'size').at(-1).height;
    const bottoms = await part('option').evaluateAll(els => els.map(e => Math.ceil(e.getBoundingClientRect().bottom + scrollY)));
    assert.ok(bottoms.length === 5 && bottoms.every(b => b <= reported), `all options within reported frame height ${reported}: ${bottoms}`);
    await part('option').filter({ hasText: '150%' }).click();
    await expect(trigger).toHaveText('화면 크기 150%');
    await expect(content).toHaveCSS('font-size', '24px');
    await page.keyboard.press('Tab');
    await expect(content.getByRole('button', { name: '작업' })).toBeFocused();
  },
  'side-navigation': async ({ page, part }) => {
    const current = page.getByRole('link', { name: '신규 신청', exact: true });
    await expect(current).toBeVisible();
    await expect(current).toHaveAttribute('aria-current', 'page');
    const branch = part('trigger').first();
    await expect(branch).toHaveAttribute('aria-expanded', 'true');
    await branch.click();
    await expect(branch).toHaveAttribute('aria-expanded', 'false');
    await branch.click();
    await expect(branch).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('link', { name: '신청 내역', exact: true }).click();
    await expect(page.getByRole('region', { name: '로컬 목적지' })).toContainText('history');
  },
  'skip-link': async ({ page }) => {
    await page.keyboard.press('Tab');
    const link = page.getByRole('link', { name: '본문 바로가기' });
    await expect(link).toBeFocused();
    await expect(link).toBeVisible();
    const before = await page.evaluate(() => !!(document.querySelector('[data-krds-component=skip-link]').compareDocumentPosition(document.querySelector('[role=banner]')) & Node.DOCUMENT_POSITION_FOLLOWING));
    assert.ok(before, 'link precedes banner');
    await page.keyboard.press('Enter');
    await expect(page.locator('#example-main')).toBeFocused();
  },
  snackbar: async ({ page, part }) => {
    const save = page.getByRole('button', { name: '저장', exact: true });
    await expect(part('root')).toHaveCount(0);
    await save.click();
    await expect(part('root')).toHaveCount(1);
    await save.click();
    await expect(part('root')).toHaveCount(1);
    await expect(part('root')).toContainText('신청이 저장되었습니다.');
    // hover pauses
    await part('root').hover();
    await page.clock.runFor(6000);
    await expect(part('root')).toHaveCount(1);
    await page.mouse.move(2, 2);
    await page.clock.runFor(5100);
    await expect(part('root')).toHaveCount(0);
    // hidden document pauses
    await save.click();
    await expect(part('root')).toHaveCount(1);
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.clock.runFor(6000);
    await expect(part('root')).toHaveCount(1);
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: false, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.clock.runFor(5100);
    await expect(part('root')).toHaveCount(0);
    // focus pauses, close focused notification restores focus
    await save.click();
    await part('close').focus();
    await page.clock.runFor(6000);
    await expect(part('root')).toHaveCount(1);
    await page.keyboard.press('Enter');
    await expect(part('root')).toHaveCount(0);
    await expect(save).toBeFocused();
    // configured action
    await save.click();
    await expect(part('action')).toHaveAttribute('href', '#local-history');
    await part('action').click();
    assert.equal(new URL(page.url()).hash, '#local-history', 'configured action link activated');
    await expect(page.getByRole('region', { name: '로컬 목적지' })).toContainText('history');
    await part('close').focus();
    await page.keyboard.press('Enter');
    await expect(part('root')).toHaveCount(0);
    await expect(save).toBeFocused();
  },
  spinner: async ({ page }) => {
    const bar = page.getByRole('progressbar');
    await expect(bar).toHaveAttribute('aria-valuenow', '40');
    await page.getByRole('button', { name: '작업 완료' }).click();
    await expect(page.locator('[role=status]').filter({ hasText: '신청 내역을 불러왔습니다.' })).toHaveCount(1);
    const remaining = await bar.count();
    if (remaining) await expect(bar).toHaveAttribute('aria-valuenow', '100');
  },
  'step-indicator': async ({ page, part }) => {
    const list = page.locator('ol');
    await expect(list).toBeVisible();
    await expect(list.locator('[aria-current=step]')).toContainText('정보 입력');
    await expect(list.locator('[aria-current=step]')).toContainText('현재 단계');
    await expect(part('complete-indicator')).toHaveText('완료');
    assert.equal(await part('item').count(), 3);
  },
  'structured-list': async ({ page, part }) => {
    await expect(page.getByRole('link', { name: '예제 신청 공고' })).toBeVisible();
    await expect(page.locator('#preview-root')).toContainText('마감일');
    const order = await part('item').first().evaluate(e => { const c = e.querySelector('[data-krds-part=content]'), a = e.querySelector('[data-krds-part=actions]'); return !!(c.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING); });
    assert.ok(order, 'actions after readable content');
    await part('actions').first().getByRole('button', { name: '저장' }).click();
    await expect(page.locator('p[role=status]')).toHaveText('저장한 공고 1건');
  },
  switch: async ({ page }) => {
    const sw = page.getByRole('switch', { name: '알림 사용' });
    await sw.focus();
    await page.keyboard.press('Space');
    await expect(sw).toBeChecked();
    await expect(page.getByRole('switch', { name: '알림 사용' })).toBeVisible();
    await page.getByRole('button', { name: '입력 확인' }).click();
    await expect(page.getByLabel('입력 결과')).toHaveText('{"notifications":"on"}');
    await page.getByRole('button', { name: '초기화' }).click();
    await expect(sw).not.toBeChecked();
    await expect(page.getByLabel('입력 결과')).toHaveText('');
  },
  'tab-bar': async ({ page }) => {
    const nav = page.getByRole('navigation', { name: '하단 탐색' });
    await expect(nav).toBeVisible();
    assert.equal(await page.locator('[role=tab], [role=tablist]').count(), 0);
    await expect(nav.getByRole('link', { name: '홈' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: '신청' })).toHaveAttribute('href', '#local-apply');
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await nav.getByRole('link', { name: '신청' }).click();
    await expect(page.getByRole('region', { name: '로컬 목적지' })).toContainText('apply');
  },
  table: async ({ page }) => {
    const table = page.getByRole('table', { name: '예제 신청 내역' });
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader', { name: '신청명' })).toHaveAttribute('scope', 'col');
    await expect(table.getByRole('rowheader', { name: '신청 가' })).toHaveAttribute('scope', 'row');
    const headers = await table.locator('td').first().getAttribute('headers');
    assert.ok(headers && headers.split(' ').length === 2, 'cell headers reference column and row header');
  },
  tabs: async ({ page, shot }) => {
    const second = page.getByRole('tab', { name: '상세', exact: true });
    await expect(page.getByRole('tab', { name: '요약', exact: true })).toHaveAttribute('aria-selected', 'true');
    await second.click();
    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toHaveText('신청 상세 내용입니다.');
    await expect(page.getByRole('tabpanel')).toHaveAccessibleName('상세');
    await shot('tabs-changed');
  },
  tag: async ({ page }) => {
    const seoul = page.getByRole('button', { name: '서울', exact: true });
    await seoul.click();
    await expect(seoul).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('p[role=status]')).toHaveText('선택 지역: 서울');
    await seoul.press('ArrowRight');
    await expect(page.getByRole('button', { name: '부산', exact: true })).toBeFocused();
  },
  'text-input': async ({ page }) => ime('text-input')({ page }),
  'text-list': async ({ page }) => {
    assert.equal(await page.locator('ol[data-krds-part=root]').count(), 1);
    assert.equal(await page.locator('ul[data-krds-part=root]').count(), 1);
    await expect(page.locator('ol[data-krds-part=root] > li')).toHaveCount(2);
    await expect(page.locator('ul[data-krds-part=root] > li')).toHaveCount(2);
    const styles = await page.evaluate(() => [...document.querySelectorAll('ol[data-krds-part=root],ul[data-krds-part=root]')].map(e => getComputedStyle(e.querySelector('li')).listStyleType + '|' + getComputedStyle(e).listStyleType));
    assert.ok(styles.length === 2 && styles.every(Boolean));
  },
  textarea: async ({ page }) => ime('textarea')({ page }),
  toast: async ({ page, part }) => {
    const save = page.getByRole('button', { name: '신청 저장' });
    await expect(page.locator('#example-saved-result')).toHaveText('저장 전입니다.');
    await save.focus();
    await save.click();
    await expect(part('root')).toBeVisible();
    await expect(part('root')).toContainText('신청이 저장되었습니다.');
    const announced = part('message');
    await expect(announced).toHaveAttribute('role', 'status');
    await expect(announced).toHaveAttribute('aria-live', 'polite');
    await expect(announced).toHaveText('신청이 저장되었습니다.');
    await expect(page.locator('#example-saved-result')).toHaveText('신청이 저장되었습니다.');
    await expect(save).toBeFocused();
    await page.clock.runFor(3100);
    await expect(part('root')).toHaveCount(0);
    await expect(page.locator('#example-saved-result')).toHaveText('신청이 저장되었습니다.');
  },
  tooltip: async ({ page }) => {
    const trigger = page.getByRole('button', { name: '신청 도움말', exact: true });
    await trigger.hover();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await expect(page.getByRole('tooltip')).toHaveText('신청 도움말을 엽니다');
    await page.evaluate(() => window.focus()); // hover alone does not move keyboard focus into the sandboxed frame
    await page.keyboard.press('Escape');
    await expect(page.getByRole('tooltip')).toBeHidden();
    await expect(trigger).toBeFocused();
    await page.mouse.move(1050, 850);
    await page.keyboard.press('Tab');
    await expect(trigger).not.toBeFocused();
    await expect(page.getByRole('tooltip')).toBeHidden();
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await expect(page.getByRole('tooltip')).toHaveText('신청 도움말을 엽니다');
  },
  tts: async ({ page, part }) => {
    await expect(page.getByRole('note')).toContainText('시뮬레이션');
    await part('play').click();
    await expect(page.locator('p[role=status]')).toHaveText('요청 상태: playing');
    await expect(part('status')).toHaveText('읽는 중');
    await part('pause').click();
    await expect(page.locator('p[role=status]')).toHaveText('요청 상태: paused');
    await part('stop').click();
    await expect(page.locator('p[role=status]')).toHaveText('요청 상태: idle');
    await expect(part('status')).toHaveText('');
    await expect(part('pause')).toHaveCount(0);
    await expect(page.getByRole('note')).toContainText('시뮬레이션');
  },
  'tutorial-panel': async ({ page, part, shot }) => {
    const panel = page.locator('[data-krds-component=tutorial-panel][data-krds-part=root]');
    await expect(panel).toBeVisible();
    await expect(page.locator('p[role=status]')).toHaveText('현재 대상: 없음');
    await shot('tutorial-panel-overview');
    // overview: all tasks listed, no back control until a task is active
    await expect(part('back')).toHaveCount(0);
    await expect(part('title')).toHaveText('따라하기');
    await expect(part('task-list')).toBeVisible();
    await expect(part('tab')).toHaveCount(2);
    await expect(part('tab').and(page.locator('[aria-selected=true]'))).toHaveCount(1);
    await expect(part('start')).toHaveCount(1);
    await expect(part('step')).toHaveCount(2);
    await page.getByRole('button', { name: /따라하기 시작|시작/ }).first().click();
    await expect(page.locator('p[role=status]')).toHaveText('현재 대상: 신청인 이름');
    await expect(page.locator('#applicant-name')).toHaveAttribute('data-active-target', 'true');
    // task view: only the active task, back control labelled 작업 목록
    await expect(part('back')).toHaveAccessibleName('작업 목록');
    await expect(part('task-list').locator('> li')).toHaveCount(1);
    await shot('tutorial-panel-task-view');
    await panel.getByRole('button', { name: '신청 저장', exact: true }).click();
    await expect(page.locator('p[role=status]')).toHaveText('현재 대상: 신청 저장');
    await expect(page.locator('#save-application')).toHaveAttribute('data-active-target', 'true');
    await page.getByRole('button', { name: '따라하기 중지' }).click();
    await expect(page.locator('p[role=status]')).toHaveText('현재 대상: 없음');
    await expect(page.locator('[data-active-target=true]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: /따라하기 시작|시작/ }).first()).toBeFocused();
  },
  'visually-hidden': async ({ page }) => {
    const button = page.getByRole('button', { name: '신청 확인' });
    await expect(button).toHaveAccessibleDescription('신청 내용을 확인하세요');
    const hidden = page.locator('#hidden-help');
    await expect(hidden).toHaveText('신청 내용을 확인하세요');
    const box = await hidden.boundingBox();
    assert.ok(!box || (box.width <= 1 && box.height <= 1), 'visually absent');
    await expect(hidden).toHaveCSS('position', 'absolute');
  },
};
async function shot_nav(page, name) { await page.screenshot({ path: resolve(evidence, `${name}-navigation.png`), fullPage: true }); }

// IME composition, paste and editing for text-input and textarea.
function ime(id) {
  return async ({ page }) => {
    const label = id === 'textarea' ? '신청 사유' : '신청인 이름';
    const input = page.getByRole('textbox', { name: label });
    const cdp = await page.context().newCDPSession(page.__real);
    await expect(input).toBeVisible();
    await input.focus();
    await cdp.send('Input.imeSetComposition', { text: '신청', selectionStart: 2, selectionEnd: 2 });
    await cdp.send('Input.insertText', { text: '신청인' });
    await expect(input).toHaveValue('신청인');
    await expect(page.locator('p[role=status]')).toContainText('현재 값: 신청인');
    await page.keyboard.insertText(id === 'textarea' ? '\n붙여넣은 줄' : ' 붙여넣기');
    await expect(input).toHaveValue(id === 'textarea' ? '신청인\n붙여넣은 줄' : '신청인 붙여넣기');
    await page.keyboard.press('Backspace');
    await expect(input).toHaveValue(id === 'textarea' ? '신청인\n붙여넣은 ' : '신청인 붙여넣');
    await expect(input).toHaveAccessibleName(label);
    if (id === 'text-input') {
      await expect(input).toHaveAccessibleDescription('주민등록상 이름을 입력하세요.');
      await page.getByRole('button', { name: '입력 지우기' }).click();
      await expect(input).toHaveValue('');
      await expect(page.locator('p[role=status]')).toContainText('지우기 1회');
      await input.fill('신청인');
    }
    await page.getByRole('button', { name: '입력 확인' }).click();
    await expect(page.getByLabel('입력 결과')).toContainText(id === 'textarea' ? '신청 사유' === label ? '"reason"' : '' : '"applicant"');
    await expect(input).toHaveAccessibleName(label);
    await page.getByRole('button', { name: '초기화' }).click();
    await expect(input).toHaveValue('');
    await expect(page.getByLabel('입력 결과')).toHaveText('');
    await expect(input).toHaveAccessibleName(label);
  };
}

// ----- runner -----
const results = [];
const missing = definitions.filter(d => !scenarios[d.componentId]).map(d => d.componentId);
for (const d of definitions) {
  const id = d.componentId;
  if (only && !only.includes(id)) continue;
  const context = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  const errors = [], bad = [];
  page.on('pageerror', e => errors.push(String(e)));
  const allow = { url: null, http: [], console: [] };
  const allowed = u => allow.url && u === allow.url;
  page.on('console', m => { if (m.type() !== 'error') return; if (allowed(m.location().url)) allow.console.push(m.text()); else errors.push(m.text()); });
  context.on('request', r => { const u = r.url(); if (!u.startsWith(origin) && !u.startsWith('data:') && !u.startsWith('blob:') && u !== 'about:blank') bad.push(u); });
  context.on('response', r => { if (r.status() < 400) return; if (allowed(r.url()) && r.status() === 404) allow.http.push(r.url()); else bad.push(`${r.status()} ${r.url()}`); });
  const shot = name => page.screenshot({ path: resolve(evidence, `${name}.png`), fullPage: true });
    try {
    if (!scenarios[id]) throw new Error(`Missing acceptance scenario for ${d.acceptanceId}`);
    if (id === 'image') allow.url = `${origin}${base}local-assets/intentional-missing-image.svg`;
    if (['carousel', 'snackbar', 'toast'].includes(id)) await page.clock.install();
    const view = await open(page, id);
    await transport(page);
    if (!['coach-mark', 'favicon', 'modal', 'snackbar', 'toast'].includes(id)) await expect(view.locator(`[data-krds-component="${id}"]`).first()).toBeAttached();
    const before = await signature(view);
    await scenarios[id]({ page: view, part: p => view.locator(`[data-krds-component="${id}"][data-krds-part="${p}"]`), shot, context, allow, browser: context.browser(), id });
    await shot(`${id}-outcome`);
    assert.deepEqual(await view.locator('button').evaluateAll(els => els.filter(e => !e.closest('[data-krds-component]') && !e.hasAttribute('data-preview-return')).map(e => e.outerHTML)), [], 'no raw button: host controls use the public Button');
    assert.deepEqual(errors, [], 'no page or console errors');
    assert.deepEqual(bad, [], 'no external or failed requests');
    await view.locator('[data-preview-return]').evaluate(e => e.click());
    await expect.poll(() => page.evaluate(() => window.__msgs.some(m => m.type === 'return-focus'))).toBe(true);
    const view2 = await open(page, id);
    assert.deepEqual(await signature(view2), before, 'reload restores baseline');
    results.push({ componentId: id, acceptanceId: d.acceptanceId, classification: d.classification, status: 'passed' });
  } catch (error) {
    results.push({ componentId: id, acceptanceId: d.acceptanceId, status: 'failed', error: String(error).slice(0, 600), errors, bad });
    console.log('FAIL', id, String(error).split('\n').slice(0, 6).join('\n'));
    try { await page.screenshot({ path: resolve(evidence, `${id}-failure.png`), fullPage: true }); } catch {}
  } finally { await context.close(); }
}
await browser.close();
await new Promise(r => server.close(r));
for (const id of missing) if (!results.some(r => r.componentId === id)) results.push({ componentId: id, status: 'failed', error: 'missing scenario' });
const passed = results.filter(r => r.status === 'passed').length;
writeFileSync(resolve(evidence, 'results.json'), JSON.stringify({ artifact: artifact.replace(root, ''), manifestSha256: createHash('sha256').update(readFileSync(resolve(artifact, 'artifact-manifest.json'))).digest('hex'), passed, total: 54, results }, null, 2) + '\n');
console.log(`${passed}/54 native Vue acceptance scenarios passed.`);
if (only ? results.some(r => r.status === 'failed') : passed !== 54 || missing.length) process.exitCode = 1;
