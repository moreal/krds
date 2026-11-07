import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import { ensureDeep } from './deep.mjs';
// Shared semantic acceptance scenarios, one per acceptance ID (`<component>-default`), run inside the
// mounted native frame (a Playwright Frame). They rely on roles, accessible names/states, shared
// `data-krds-*` anatomy and observable state changes, never on renderer-specific hooks or one owner's
// exact copy (owners word labels/results differently). Every interactive branch calls `changed()` at
// the moment its real outcome is visible, so the runner records the changed state even when the
// scenario then restores baseline. Unknown components fail closed.
export const needsClock = new Set(['carousel']);
// All reads below are shadow-inclusive (window.__krdsDeep): Lit renders into open shadow roots.
const LOADING = '__krds_loading__';
// Retry reads across a same-frame navigation: the context may be destroyed, the new document may
// not have the helper yet, or its body may not exist. Every read function returns LOADING then.
const settledRead = async (p, read) => {
  for (let attempt = 0; attempt < 8; attempt++) {
    try { await ensureDeep(p); const value = await read(); if (value !== LOADING) return value; }
    catch (error) { if (!/context was destroyed|navigat|__krdsDeep|Cannot read properties of (undefined|null)|undefined is not an object/i.test(String(error))) throw error; }
    await p.waitForLoadState('load').catch(() => {}); await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('frame document did not settle for a shadow-inclusive read');
};
const snapshotOnce = p => settledRead(p, () => p.evaluate(() => {
  if (!window.__krdsDeep || !document.body) return '__krds_loading__';
  const D = window.__krdsDeep;
  const live = D.all('[role=status],[role=alert],output,[aria-live]').map(n => D.text(n)).join(' | ');
  const state = D.all('input,select,textarea,[aria-expanded],[aria-selected],[aria-pressed],[aria-checked],[aria-current],[aria-valuenow],[data-krds-state]').map(n => [n.value, n.checked, n.getAttribute('aria-expanded'), n.getAttribute('aria-selected'), n.getAttribute('aria-pressed'), n.getAttribute('aria-current'), n.getAttribute('aria-valuenow'), n.dataset.krdsState].join(','));
  const a = D.active(); return JSON.stringify({ text: D.text(document.body), live, state, focus: a && a !== document.body ? a.outerHTML.slice(0, 80) : null, url: location.href });
}));
/** Shadow-inclusive rendered text of the whole frame document or of one element. */
export const deepText = (p, locator) => settledRead(p, () => locator ? locator.evaluate(n => window.__krdsDeep ? window.__krdsDeep.text(n) : '__krds_loading__') : p.evaluate(() => window.__krdsDeep && document.body ? window.__krdsDeep.text(document.body) : '__krds_loading__'));
// A same-frame navigation (local link destinations) destroys the context mid-read: wait for the new document and read again.
const snapshot = p => snapshotOnce(p);
// Deep focus (shadow roots included) and focus within the element.
const isFocused = locator => locator.evaluate(n => { let a = document.activeElement; while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement; return n === a || n.contains(a) || !!n.shadowRoot?.activeElement || (a && n.shadowRoot?.contains(a)); });
export async function exercise(p, id, hooks = {}) {
  const page = p.page?.() ?? p;
  const keyboard = page.keyboard;
  const changed = async () => { await hooks.changed?.(); };
  const body = p.locator('body');
  const example = sel => p.locator(sel).and(p.locator(':not([data-preview-return])'));
  const button = (name, exact = false) => p.getByRole('button', { name, exact }).and(p.locator(':not([data-preview-return])')).first();
  const part = (component, name) => p.locator(`[data-krds-component="${component}"][data-krds-part="${name}"]`);
  const tabKey = page.context().browser()?.browserType().name() === 'webkit' ? 'Alt+Tab' : 'Tab';
  // Move keyboard focus into the frame document so Tab starts at its first stop.
  const focusFrame = async () => { if (p.frameElement) await (await p.frameElement()).focus(); await p.evaluate(() => { document.activeElement?.blur?.(); document.body.tabIndex = -1; document.body.focus(); document.body.removeAttribute('tabindex'); }); };
  // Responsive navigation collapses inside a narrow frame; open its own mobile trigger first.
  const openMobile = async () => {
    const t = p.locator('[data-krds-part="mobile-trigger"], [data-krds-part="menu-trigger"]').or(p.getByRole('button', { name: /^(전체 메뉴|메뉴)$/ })).first();
    if (await t.isVisible().catch(() => false) && (await t.getAttribute('aria-expanded')) !== 'true') await t.click();
  };
  // Resolve a state-dependent selector once, then keep addressing the same element by index.
  const pin = async (selector, candidates) => { const all = p.locator(candidates); const i = await all.evaluateAll((ns, sel) => ns.findIndex(n => n.matches(sel)), selector); assert.ok(i >= 0, `${id}: no element matching ${selector}`); return all.nth(i); };
  /** Perform an action and require the observable frame state to change. */
  const expectChange = async (action, label) => { const before = await snapshot(p); await action(); await expect.poll(() => snapshot(p), { message: `${id}: ${label} changes observable state` }).not.toBe(before); };
  const visibleText = async (text, root = body) => expect(root.getByText(text).first()).toBeVisible();
  // Optional owner-local form result/reset: submit proves the value reached the local result;
  // reset proves the form returns to its baseline. Missing buttons are not invented.
  const formResult = async expected => {
    const submit = button('입력 확인', true);
    if (await submit.count()) { await submit.click(); await expect(p.getByLabel('입력 결과').first(), `${id}: local form result`).toContainText(expected); }
  };
  const formReset = async check => { const reset = button(/^(입력 초기화|예제 초기화)$/); if (await reset.count()) { await reset.click(); await check(); } };
  switch (id) {
    case 'button': case 'button/secondary': {
      const b = example('[data-krds-component="button"][data-krds-part="root"]').first();
      await expectChange(() => b.click(), 'button activation'); await changed(); break;
    }
    case 'accordion': {
      const t = part(id, 'trigger').first(); await t.focus(); await keyboard.press('Enter');
      await expect(t).toHaveAttribute('aria-expanded', 'true'); await expect(part(id, 'panel').first()).toBeVisible(); await changed();
      await keyboard.press('Space'); await expect(t).toHaveAttribute('aria-expanded', 'false'); await t.click(); await expect(t).toHaveAttribute('aria-expanded', 'true'); await hooks.shot?.('expanded'); break;
    }
    case 'native-select': {
      const s = p.locator('select').first(); const current = await s.inputValue();
      const values = await s.locator('option:not([disabled])').evaluateAll(o => o.map(x => x.value).filter(Boolean));
      const next = values.includes('busan') && current !== 'busan' ? 'busan' : values.find(v => v !== current);
      assert.ok(next, 'native-select has a second enabled option'); await s.selectOption(next); await expect(s).toHaveValue(next); await changed(); break;
    }
    case 'modal': {
      const open = button(/열기/); await open.click(); const dialog = p.getByRole('dialog').first(); await expect(dialog).toBeVisible(); await changed();
      await keyboard.press('Escape'); await expect(dialog).toBeHidden(); await expect.poll(() => isFocused(open), { message: 'focus returns to the modal opener' }).toBe(true); break;
    }
    case 'tabs': {
      const t = await pin('[aria-selected="false"]:not([aria-disabled="true"]):not([disabled])', '[role=tab]');
      const name = (await t.textContent()).trim(); const panelBefore = await deepText(p, p.locator('[role=tabpanel]:visible').first());
      await t.click(); await expect(t).toHaveAttribute('aria-selected', 'true');
      await expect.poll(() => deepText(p, p.locator('[role=tabpanel]:visible').first()), { message: `tab ${name} shows its panel` }).not.toBe(panelBefore); await changed(); break;
    }
    case 'calendar': {
      const day = button(/2024년 2월 20일/); await day.click();
      await expect.poll(() => day.evaluate(n => n.getAttribute('aria-pressed') === 'true' || n.getAttribute('aria-selected') === 'true' || /selected/.test(n.dataset.krdsState ?? '') || /selected/.test(n.closest('[data-krds-state]')?.dataset.krdsState ?? '')), { message: 'calendar day selected' }).toBe(true);
      await changed(); break;
    }
    case 'date-input': {
      const input = p.getByRole('textbox').first(); await input.fill('2024-02-20'); await input.press('Tab');
      await expect(input).not.toHaveAttribute('aria-invalid', 'true'); await expect.poll(() => input.inputValue()).toMatch(/2024\D?0?2\D?20/); await changed(); break;
    }
    case 'checkbox': case 'switch': {
      const c = p.getByRole(id).first(); await c.check({ force: false }); await expect(c).toBeChecked(); await changed();
      await formResult(id === 'checkbox' ? /agreed|동의|true|on/ : /on|true|켜|사용/); await formReset(() => expect(c).not.toBeChecked()); break;
    }
    case 'radio-group': {
      const r = await pin(':not(:checked):not([disabled])', 'input[type=radio]'); await r.check(); await expect(r).toBeChecked(); await changed();
      await formResult(/./); await formReset(() => expect(r).not.toBeChecked()); break;
    }
    case 'text-input': case 'textarea': {
      const value = id === 'textarea' ? '신청 사유\n서류를 확인했습니다.' : '신청인';
      const input = p.getByRole('textbox').first(); await input.fill(value); await expect(input).toHaveValue(value);
      assert.ok((await input.evaluate(n => n.labels?.[0]?.textContent ?? n.getAttribute('aria-label') ?? '')).trim() || await input.getAttribute('aria-labelledby'), 'field has an accessible label'); await changed();
      await formResult(id === 'textarea' ? '서류를 확인했습니다' : value); await formReset(() => expect(input).toHaveValue('')); break;
    }
    case 'range-slider': { const c = p.getByRole('slider').first(); const before = await c.inputValue(); await c.focus(); await c.press('ArrowRight'); await expect(c).not.toHaveValue(before); await changed(); await formReset(() => expect(c).toHaveValue(before)); break; }
    case 'quantity-toggle': {
      const inc = part(id, 'increment').or(button(/늘리기|증가|\+/)).first();
      await expectChange(() => inc.click(), 'increment'); await changed(); break;
    }
    case 'disclosure': { const c = await pin('[aria-expanded="false"]:not([data-preview-return])', 'button'); await c.focus(); await keyboard.press('Enter'); await expect(c).toHaveAttribute('aria-expanded', 'true'); await changed(); break; }
    case 'fab': { const b = p.locator('[data-krds-component="fab"]').getByRole('button').or(p.locator('button[data-krds-component="fab"]')).or(button(/새 신청/)).first(); await b.focus(); await expect(b).toBeFocused(); await expectChange(() => keyboard.press('Enter'), 'FAB keyboard activation'); await changed(); break; }
    case 'tag': {
      const t = p.locator('[data-krds-component="tag"] button[aria-pressed], [data-krds-component="tag"] button').first();
      await expectChange(() => t.click(), 'tag toggle'); await changed(); break;
    }
    case 'resize': {
      const size = async () => { await ensureDeep(p); return p.evaluate(() => window.__krdsDeep.all('body *:not(script):not(style), :host *').filter(n => n.tagName !== 'SCRIPT' && n.tagName !== 'STYLE').reduce((sum, n) => sum + (parseFloat(getComputedStyle(n).fontSize) || 0), 0)); };
      const before = await size(); const t = part(id, 'trigger').or(button(/화면 크기/)).first(); await t.click(); await expect(t).toHaveAttribute('aria-expanded', 'true'); await hooks.shot?.('expanded');
      // Pick the largest offered size: the last option of the expanded list.
      const controls = await t.getAttribute('aria-controls');
      const options = controls ? p.locator(`[id="${controls}"]`).locator('button, [role=menuitemradio], [role=option]') : p.getByRole('listitem').getByRole('button');
      await options.last().click();
      await expect.poll(size, { message: 'resize enlarges example text' }).toBeGreaterThan(before); await changed(); break;
    }
    case 'tts': {
      await expect(p.getByRole('note').first()).toContainText('시뮬레이션');
      await expectChange(() => button(/재생/).click(), 'TTS play'); await changed();
      const pause = button(/일시\s?정지/); if (await pause.count()) await expectChange(() => pause.click(), 'TTS pause'); break;
    }
    case 'tooltip': {
      const c = part(id, 'trigger').or(example('button')).first(); const popup = p.locator('[role=tooltip], [data-krds-component="tooltip"][data-krds-part="popup"]').first();
      // Open state: the native state attribute when present, otherwise visibility.
      const open = () => popup.evaluate(n => n.dataset.krdsState !== undefined ? /\bopen\b/.test(n.dataset.krdsState) : n.checkVisibility());
      const tip = { toBe: async v => expect.poll(open, { message: `tooltip ${v ? 'open' : 'closed'}` }).toBe(v) };
      await c.hover(); await tip.toBe(true);
      await focusFrame(); await keyboard.press('Escape'); await tip.toBe(false); await page.mouse.move(1, 1); await tip.toBe(false);
      // "Leave and re-enter by keyboard": reach the trigger by Tab, leave with Tab, re-enter with Shift+Tab.
      const focused = () => c.evaluate(n => { let a = document.activeElement; while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement; return n === a || n.contains(a) || !!n.shadowRoot?.activeElement; });
      if (!(await focused())) { await focusFrame(); for (let i = 0; i < 5 && !(await focused()); i++) await keyboard.press(tabKey); }
      await keyboard.press(tabKey); await keyboard.press(`Shift+${tabKey}`);
      await expect.poll(focused, { message: 'tooltip trigger re-entered by keyboard' }).toBe(true); await tip.toBe(true); await changed(); break;
    }
    case 'contextual-help': {
      const t = button(/도움말/); await t.click(); const pop = part(id, 'popover').or(p.getByRole('dialog')).first(); await expect(pop).toBeVisible(); await changed();
      await keyboard.press('Escape'); await expect(pop).toBeHidden(); break;
    }
    case 'bottom-sheet': {
      const dialog = p.getByRole('dialog').first();
      if (!(await dialog.isVisible())) { await button(/열기|선택/).click(); await expect(dialog).toBeVisible(); }
      const radios = dialog.locator('input[type=radio]'); const ri = await radios.evaluateAll(ns => ns.findIndex(n => !n.checked)); const r = radios.nth(ri); const label = (await r.evaluate(n => n.labels?.[0]?.textContent ?? n.getAttribute('aria-label') ?? n.value)).trim();
      // Native radio click first; owners whose visual radio is driven through its label get the label click (recorded).
      try { await r.check({ timeout: 3000 }); } catch { hooks.note?.({ radioInputClickIgnored: true }); await dialog.getByText(label, { exact: true }).first().click(); }
      await expect(r).toBeChecked(); await changed();
      await dialog.getByRole('button', { name: '닫기', exact: true }).click(); await expect(dialog).toBeHidden();
      await expect(p.locator('[role=status], output').filter({ hasText: label }).first()).toBeVisible(); break;
    }
    case 'help-panel': {
      // Starts open (wide: side panel; narrow frame: modal). Activate a topic inside it, then close it.
      const root = part(id, 'root').first();
      if (!(await root.isVisible())) await part(id, 'opener').or(button(/도움말.*열기/)).first().click();
      await expect(root).toBeVisible();
      const topic = root.getByRole('button').filter({ hasNotText: /닫기/ }).first();
      await expectChange(() => topic.click(), 'help topic'); await changed();
      await root.getByRole('button', { name: /도움말 닫기|닫기/ }).first().click(); await expect(root).toBeHidden(); break;
    }
    case 'coach-mark': await expect(part(id, 'popover')).toBeHidden(); await button(/따라하기 시작|시작/).click(); await expect(part(id, 'popover').first()).toBeVisible(); await changed(); break;
    case 'tutorial-panel': {
      const target = p.getByText(/현재 대상/).first(); const before = await target.textContent();
      const start = button('따라하기 시작', true); if (!(await start.isVisible().catch(() => false))) await button(/튜토리얼 열기/).click();
      await start.click(); await expect.poll(() => target.textContent(), { message: 'tutorial starts on a named target' }).not.toBe(before); await changed();
      const stop = button(/따라하기 중지/); if (await stop.count()) { await stop.click(); await expect(target).toHaveText(before); } break;
    }
    case 'toast': { await expectChange(() => button(/저장|알림/).click(), 'toast trigger'); await expect(part(id, 'root').first()).toBeVisible(); await changed(); break; }
    case 'snackbar': {
      if (!(await part(id, 'root').first().isVisible().catch(() => false))) await expectChange(() => button(/저장/).click(), 'snackbar opens');
      const action = p.getByRole('button', { name: /실행 취소|닫기/ }).filter({ visible: true }).first();
      await expectChange(() => action.click(), 'snackbar action'); await changed(); break;
    }
    case 'spinner': await expect(p.getByRole('progressbar').first()).toBeVisible(); await expectChange(() => button(/완료/).click(), 'spinner completion'); await changed(); break;
    case 'file-upload': {
      // Local File only; the runner separately fails any network request.
      await p.locator('input[type=file]').first().setInputFiles({ name: 'proof.txt', mimeType: 'text/plain', buffer: Buffer.from('independent local example') });
      await visibleText('proof.txt'); await changed();
      await p.getByRole('button', { name: /삭제|제거/ }).first().click(); await expect(p.getByText('proof.txt')).toHaveCount(0); break;
    }
    case 'back-button': { const b = p.locator('[data-krds-component="back-button"]').getByRole('button').or(p.locator('button[data-krds-component="back-button"]')).or(button(/뒤로|이전/)).first(); await expectChange(() => b.click(), 'back request'); await changed(); break; }
    case 'pagination': {
      const nav = p.getByRole('navigation').first(); const current = () => nav.locator('[aria-current]').first().textContent();
      const before = await current(); await nav.getByRole('link', { name: /^2$|2 페이지|페이지 2/ }).first().click();
      await expect.poll(current, { message: 'pagination current page moves' }).not.toBe(before); await changed(); break;
    }
    case 'language-switcher': { const en = p.getByRole('link', { name: /English/ }).first(); await en.focus(); await expectChange(() => keyboard.press('Enter'), 'locale request'); await expect(p.locator('[lang=en]').first()).toBeVisible(); await changed(); break; }
    case 'carousel': {
      // Position: the current slide's accessible label (shadow-inclusive), falling back to the "n / 3" indicator text.
      const position = async () => { await ensureDeep(p); return p.evaluate(() => { const D = window.__krdsDeep; const slide = D.all('[data-krds-part="slide"][aria-current="true"], [data-krds-part="slide"][aria-current="page"]')[0]; return slide?.getAttribute('aria-label') ?? /(\d+) \/ \d+/.exec(D.text(document.body))?.[1] ?? null; }); };
      assert.ok(await position(), 'carousel exposes a current position');
      const before = await position(); await page.clock.fastForward(6100); if ((await position()) === before) await page.clock.fastForward(6100); await expect.poll(position, { message: 'carousel advances' }).not.toBe(before); await changed(); break;
    }
    case 'skip-link': {
      await focusFrame(); await keyboard.press(tabKey); const link = p.getByRole('link', { name: /본문/ }).first(); await expect(link).toBeFocused();
      const hash = new URL(await link.getAttribute('href'), 'http://x/').hash.slice(1); await keyboard.press('Enter');
      await ensureDeep(p); await expect.poll(() => p.evaluate(h => { const a = window.__krdsDeep.active(); return a?.id === h || a?.closest(`#${CSS.escape(h)}`) !== null; }, hash), { message: 'skip target focused' }).toBe(true); await changed(); break;
    }
    case 'in-page-navigation': {
      const first = p.getByRole('navigation').first().getByRole('link').first();
      await expectChange(async () => { await first.focus(); await first.press('Enter'); }, 'section navigation'); await changed(); break;
    }
    case 'header': {
      // Outcome: DOM/read/focus order identity → utilities → navigation, after the SkipLink; scrolling changes nothing.
      const header = p.locator('header, [role=banner]').first(); await expect(header).toBeVisible();
      await ensureDeep(p);
      const order = await header.evaluate(h => {
        const D = window.__krdsDeep;
        const skip = D.all('a[href]').find(a => /본문/.test(D.text(a)));
        const links = D.all('a[href], button', h).filter(n => !n.closest('[data-preview-return]'));
        const nav = D.all('nav', h)[0]; const identity = links[0];
        // Flat-tree (composed) order: compareDocumentPosition is undefined across shadow trees, so index a walk that enters shadow roots in place.
        const order = new Map(); let i = 0; const walk = n => { order.set(n, i++); if (n.shadowRoot) n.shadowRoot.childNodes.forEach(walk); n.childNodes.forEach(walk); }; walk(document.documentElement);
        const before = (a, b) => order.get(a) < order.get(b);
        return { skipBefore: !skip || before(skip, h), identityFirst: !!identity && (!nav || before(identity, nav)), hasNav: !!nav || links.length > 1 };
      });
      assert.deepEqual(order, { skipBefore: true, identityFirst: true, hasNav: true }, 'header order');
      await p.evaluate(() => scrollBy(0, 200)); await expect(header).toBeAttached(); break;
    }
    case 'side-navigation': {
      await expect(p.locator('[aria-current]').first()).toBeVisible();
      const link = p.getByRole('navigation').first().getByRole('link').last(); await expectChange(() => link.click(), 'side navigation link'); await changed(); break;
    }
    case 'link': case 'main-menu': case 'tab-bar': {
      await openMobile(); const link = p.getByRole('link').first();
      const href = new URL(await link.getAttribute('href'), p.url()); assert.equal(href.origin, new URL(p.url()).origin, 'local destination'); assert.match(href.pathname, /^\/krds\/previews\/[a-z-]+\//);
      await link.focus(); await expectChange(() => link.press('Enter'), 'link activation'); await changed(); break;
    }
    // Static semantics: meaningful content/relationships/assets, no artificial handlers.
    case 'critical-alert': assert.ok((await deepText(p, part(id, 'root').first())).length > 5, 'critical alert has content'); assert.equal(await part(id, 'root').first().locator('button').count(), 0, 'critical alert cannot be dismissed'); break;
    case 'accessible-media': {
      const media = p.locator('audio, video').first(); await expect(media).toHaveAttribute('controls', '');
      await expect.poll(() => media.evaluate(e => e.readyState > 0 && e.duration > 0 && !e.error)).toBe(true);
      // Assert against the actual local asset, not the inventory's "약 1초" wording (asset is ~2.0 s; mismatch is reported).
      const duration = await media.evaluate(e => e.duration); assert.ok(duration > 0.5 && duration < 10, `local audio duration ${duration}`);
      hooks.note?.({ audioDurationSeconds: duration });
      // Transcript: the inventory's text when supplied (shadow-inclusive), else a non-empty alternative.
      const transcript = hooks.acceptance?.initialState?.transcript?.content;
      if (transcript) await expect.poll(() => deepText(p), { message: 'transcript matches the acceptance inventory' }).toContain(transcript); else await expect(body).toContainText('신호음');
      break;
    }
    case 'favicon': {
      const icons = p.locator('head link[rel=icon]'); assert.equal(await icons.count(), 2);
      for (const href of await icons.evaluateAll(es => es.map(e => e.href))) assert.ok(href.startsWith('data:') || (await page.request.get(href)).ok(), `favicon ${href}`);
      assert.ok((await deepText(p)).replace('문서로 돌아가기', '').trim().length > 10, 'favicon visible explanation'); break;
    }
    case 'image': {
      // Inventory outcome: the local image renders (complete, naturalWidth > 0) with its alt, and the
      // failure specimen (intentionally absent, registry absentReferences) keeps its informative alternative.
      const state = hooks.acceptance?.initialState ?? {};
      assert.ok(state.alt && state.failureSpecimen?.alt, 'image acceptance names both the loaded image and the failure specimen');
      await ensureDeep(p);
      const img = p.getByRole('img', { name: state.alt, exact: true }).first(); await expect(img).toBeAttached();
      await expect.poll(() => img.evaluate(e => e.complete && e.naturalWidth > 0), { message: 'local image loaded' }).toBe(true);
      assert.equal(await img.getAttribute('alt'), state.alt, 'loaded image alt');
      // Any same-origin file the native artifact serves (bundlers may hash/rename it), never a fixed path or data: URL.
      const loadedUrl = new URL(await img.evaluate(e => e.currentSrc || e.src)), frameUrl = new URL(p.url());
      assert.equal(loadedUrl.origin, frameUrl.origin, 'loaded image is a same-origin served file');
      const framework = /^\/krds\/previews\/([^/]+)\//.exec(frameUrl.pathname)?.[1];
      assert.ok(framework && loadedUrl.pathname.startsWith(`/krds/previews/${framework}/`), `loaded image is served by this framework's artifact: ${loadedUrl.pathname}`);
      assert.equal((await p.page().request.get(loadedUrl.href)).status(), 200, 'loaded image file responds 200');
      const specimen = p.locator(`img[alt="${state.failureSpecimen.alt}"]`).first(); await expect(specimen).toBeAttached();
      await expect.poll(() => specimen.evaluate(e => e.complete), { message: 'failure specimen settled' }).toBe(true);
      const failure = await specimen.evaluate(e => ({ naturalWidth: e.naturalWidth, path: new URL(e.currentSrc || e.src).pathname, alt: e.getAttribute('alt') }));
      assert.equal(failure.naturalWidth, 0, 'failure specimen does not load');
      assert.ok(failure.path.endsWith(state.failureSpecimen.src), 'failure specimen uses the intentional absent reference');
      assert.equal(failure.alt, state.failureSpecimen.alt, 'failure specimen keeps its informative alternative');
      await expect(p.getByRole('img', { name: state.failureSpecimen.alt, exact: true }).first()).toBeAttached();
      hooks.note?.({ imageLoaded: true, specimenAlternative: failure.alt });
      break;
    }
    case 'identifier': await expect(part(id, 'root').first()).toBeVisible(); await expect(part(id, 'root').first()).toContainText(/운영|기관/); break;
    case 'footer': { const footer = p.locator('footer, [role=contentinfo]').first(); await expect(footer).toContainText(/개인정보\s?처리방침/); assert.ok(await footer.getByRole('link', { name: /개인정보\s?처리방침/ }).first().getAttribute('href')); break; }
    case 'badge': { const b = part(id, 'root').first(); assert.ok((await b.textContent()).trim(), 'badge has text'); assert.equal(await b.getAttribute('tabindex'), null); assert.ok(!['button', 'link'].includes(await b.getAttribute('role')), 'badge is not interactive'); break; }
    case 'breadcrumb': await expect(p.getByRole('navigation').first()).toBeVisible(); assert.ok(await p.getByRole('link', { name: '홈', exact: true }).first().getAttribute('href')); break;
    case 'masthead': await expect(part(id, 'root').first()).toContainText(/공식|정부/); break;
    case 'step-indicator': await expect(p.locator('ol').first()).toBeVisible(); await expect(p.locator('[aria-current=step]').first()).toBeVisible(); break;
    case 'structured-list': await expect(p.getByRole('link', { name: /공고/ }).first()).toBeVisible(); await expect(body).toContainText('마감일'); break;
    case 'table': { const t = p.getByRole('table').first(); assert.ok((await t.evaluate(n => n.caption?.textContent ?? n.getAttribute('aria-label') ?? '')).trim(), 'table caption/name'); assert.ok(await t.getByRole('columnheader').count() >= 2); assert.ok(await t.getByRole('cell').count() >= 1); break; }
    case 'text-list': assert.ok(await p.getByRole('listitem').count() >= 2); break;
    case 'visually-hidden': {
      await ensureDeep(p);
      assert.ok(await p.evaluate(() => window.__krdsDeep.all('[aria-describedby]').some(n => { const d = window.__krdsDeep.byId(n, n.getAttribute('aria-describedby')); if (!d || !window.__krdsDeep.text(d) && !(d.textContent + (d.shadowRoot?.textContent ?? '')).trim()) return false; if (d.shadowRoot) return true; const r = d.getBoundingClientRect(), s = getComputedStyle(d); return r.width <= 1 || r.height <= 1 || s.clip === 'rect(0px, 0px, 0px, 0px)' || s.clipPath.includes('inset'); })), 'visually hidden accessible description');
      break;
    }
    default: throw new Error(`No semantic acceptance scenario for ${id}`);
  }
}
/** Observable state: visible text plus control values/ARIA state inside the native frame. */
export async function observe(p) {
  return settledRead(p, () => p.evaluate(() => {
    if (!window.__krdsDeep || !document.body) return '__krds_loading__';
    const D = window.__krdsDeep, a = D.active();
    return {
      // Runtime tokens/identity echoed into local routes are normalized; they differ per session by design.
      text: D.text(document.body).replace(/token=[0-9a-f]{32}/g, 'token=<runtime>'),
      focus: a && a !== document.body ? `${a.tagName}#${a.id}|${(a.getAttribute('aria-label') ?? a.textContent ?? '').trim().slice(0, 40)}` : null,
      controls: D.all('input,textarea,select,[aria-expanded],[aria-selected],[aria-pressed],[aria-checked],[aria-current],[aria-valuenow]').map(n => ({ tag: n.tagName, value: n.value, checked: n.checked, expanded: n.getAttribute('aria-expanded'), selected: n.getAttribute('aria-selected'), pressed: n.getAttribute('aria-pressed'), ariaChecked: n.getAttribute('aria-checked'), current: n.getAttribute('aria-current'), valuenow: n.getAttribute('aria-valuenow'), label: n.matches('input,textarea,select') ? null : D.text(n).slice(0, 30) })),
    };
  }));
}
