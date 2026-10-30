import test from 'node:test';
import assert from 'node:assert/strict';
import { browserPath, serveProduction } from '../../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const { chromium, webkit } = await import('playwright');
for (const engine of ['chromium', 'webkit']) test(`Lit ${engine} full catalog strict boundaries`, async t => {
  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname);
  const browser = await ({ chromium, webkit })[engine].launch();
  async function harness(run, options = {}) { const page = await browser.newPage(options); try { await page.goto(`${server.origin}/harness.html`); await page.waitForFunction(() => customElements.get('krds-button')); await run(page); } finally { await page.close(); } }
  try {
    await t.test('radio retains actual grouping, every enabled Tab stop and controlled null/empty distinctions', () => harness(async page => {
      await page.evaluate(async () => { document.querySelector('main').innerHTML = '<button id="before">이전</button><form><krds-radio-group></krds-radio-group></form><button id="after">다음</button>'; const radio = document.querySelector('krds-radio-group'); Object.assign(radio, { label: '지역', name: 'region', required: true, value: null, options: [{ value: '', label: '빈 값' }, { value: 'a', label: '서울' }, { value: 'x', label: '중지', disabled: true }, { value: 'b', label: '부산' }] }); window.changes = []; radio.addEventListener('value-change', event => window.changes.push(event.detail)); await radio.updateComplete; });
      const radios = page.getByRole('radio'); await radios.nth(0).focus(); await page.keyboard.press('Tab'); assert.equal(await radios.nth(1).evaluate(input => input.getRootNode().activeElement === input), true); await page.keyboard.press('Tab'); assert.equal(await radios.nth(3).evaluate(input => input.getRootNode().activeElement === input), true); await page.keyboard.press('Shift+Tab'); assert.equal(await radios.nth(1).evaluate(input => input.getRootNode().activeElement === input), true);
      assert.deepEqual(await page.evaluate(() => window.changes), []);
      assert.deepEqual(await page.evaluate(() => [...new FormData(document.querySelector('form'))]), []);
      assert.equal(await page.locator('krds-radio-group').evaluate(host => host.formControl.internals.validity.valueMissing), true);
      await radios.nth(1).click(); assert.equal(await radios.nth(1).isChecked(), false); assert.deepEqual(await page.evaluate(() => window.changes), [{ value: 'a' }]);
      await page.locator('krds-radio-group').evaluate(async host => { host.value = ''; await host.updateComplete; }); assert.equal(await radios.nth(0).isChecked(), true); assert.deepEqual(await page.evaluate(() => [...new FormData(document.querySelector('form'))]), [['region', '']]);
      const names = await radios.evaluateAll(inputs => inputs.map(input => input.name)); assert.equal(new Set(names).size, 1); assert.ok(names[0]);
    }));
    await t.test('checkbox rejected controlled activation restores checked and mixed and canceled reset is inert', () => harness(async page => {
      await page.evaluate(async () => { document.querySelector('main').innerHTML = '<form><krds-checkbox></krds-checkbox></form>'; const checkbox = document.querySelector('krds-checkbox'); Object.assign(checkbox, { label: '전체 선택', name: 'all', checked: false, indeterminate: true }); window.changes = []; checkbox.addEventListener('checked-change', event => window.changes.push(event.detail)); await checkbox.updateComplete; });
      await page.getByRole('checkbox').click(); assert.deepEqual(await page.locator('krds-checkbox').evaluate(host => { const input = host.shadowRoot.querySelector('input'); return [input.checked, input.indeterminate]; }), [false, true]);
      await page.evaluate(() => { const form = document.querySelector('form'); form.addEventListener('reset', event => event.preventDefault(), { once: true }); form.reset(); }); assert.deepEqual(await page.locator('krds-checkbox').evaluate(host => { const input = host.shadowRoot.querySelector('input'); return [input.checked, input.indeterminate]; }), [false, true]); assert.deepEqual(await page.evaluate(() => window.changes), [{ checked: true }]);
    }));
    await t.test('native text IME defers one request and keeps the control and selection', () => harness(async page => {
      const result = await page.evaluate(async () => { const host = document.createElement('krds-text-input'); Object.assign(host, { label: '이름', name: 'person', defaultValue: '김' }); document.querySelector('main').append(host); await host.updateComplete; const input = host.shadowRoot.querySelector('input'); const changes = []; host.addEventListener('value-change', event => changes.push(event.detail)); input.focus(); input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true })); input.value = '김서'; input.setSelectionRange(2, 2); input.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true })); await host.updateComplete; const during = changes.length; input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true })); await host.updateComplete; return { during, changes, reused: host.shadowRoot.querySelector('input') === input, caret: input.selectionStart, value: input.value }; }); assert.deepEqual(result, { during: 0, changes: [{ value: '김서' }], reused: true, caret: 2, value: '김서' });
    }));
    await t.test('file picker, drop, accepted/rejected removal and reset keep actual committed Files', () => harness(async page => {
      await page.evaluate(async () => { document.querySelector('main').innerHTML = '<form><krds-file-upload></krds-file-upload></form>'; const host = document.querySelector('krds-file-upload'); Object.assign(host, { label: '서류', name: 'files', files: [], multiple: true, accept: '.txt', maxFiles: 3 }); window.fileRequests = []; window.acceptFiles = true; host.addEventListener('files-change', event => { window.fileRequests.push({ reason: event.detail.reason, names: event.detail.value.map(record => record.file.name) }); if (window.acceptFiles) host.files = event.detail.value; }); await host.updateComplete; });
      const picker = page.locator('krds-file-upload input[type="file"]'); await picker.setInputFiles({ name: 'A.txt', mimeType: 'text/plain', buffer: Buffer.from('A') });
      await page.locator('krds-file-upload').evaluate(async host => { const data = new DataTransfer(); data.items.add(new File(['B'], 'B.txt', { type: 'text/plain' })); host.shadowRoot.querySelector('[part="dropzone"]').dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: data })); await host.updateComplete; });
      const files = () => page.evaluate(async () => await Promise.all([...new FormData(document.querySelector('form'))].map(async ([name, file]) => [name, file instanceof File, file.name, await file.text()])));
      assert.deepEqual(await files(), [['files', true, 'A.txt', 'A'], ['files', true, 'B.txt', 'B']]);
      await page.getByRole('button', { name: 'A.txt 삭제' }).click(); assert.deepEqual(await files(), [['files', true, 'B.txt', 'B']]);
      await page.evaluate(() => { window.acceptFiles = false; }); await page.getByRole('button', { name: 'B.txt 삭제' }).click(); assert.deepEqual(await files(), [['files', true, 'B.txt', 'B']]);
      await page.evaluate(() => document.querySelector('form').reset()); assert.deepEqual(await files(), [['files', true, 'B.txt', 'B']]);
      await page.evaluate(() => { window.acceptFiles = true; }); await picker.setInputFiles({ name: 'A.txt', mimeType: 'text/plain', buffer: Buffer.from('A') }); assert.deepEqual((await files()).map(file => file[2]), ['B.txt', 'A.txt']); assert.equal(await picker.inputValue(), '');
      assert.equal(await page.evaluate(() => window.fileRequests.length), 5);
    }));
    await t.test('toast generations preserve persistent result and reject stale or repeated expiry', () => harness(async page => {
      await page.clock.install();
      await page.evaluate(async () => { document.querySelector('main').innerHTML = '<button id="work">작업</button><p id="history">저장 완료</p><krds-toast></krds-toast>'; const host = document.querySelector('krds-toast'); Object.assign(host, { durationMs: 1000, message: { id: 'a', text: '저장 완료', tone: 'information', persistentResultId: 'history' } }); window.dismissals = []; host.addEventListener('dismiss', event => window.dismissals.push(event.detail)); await host.updateComplete; });
      await page.clock.fastForward(700); await page.locator('krds-toast').evaluate(async host => { host.message = { ...host.message }; await host.updateComplete; }); await page.clock.fastForward(300); assert.equal(await page.evaluate(() => window.dismissals.length), 1); assert.equal(await page.getByText('저장 완료', { exact: true }).count(), 2); await page.clock.fastForward(5000); assert.equal(await page.evaluate(() => window.dismissals.length), 1);
      await page.locator('krds-toast').evaluate(async host => { document.getElementById('history').textContent = '저장 내용 갱신'; host.message = { ...host.message, text: '저장 내용 갱신' }; await host.updateComplete; }); await page.clock.fastForward(500); await page.locator('krds-toast').evaluate(async host => { host.message = null; await host.updateComplete; }); await page.clock.fastForward(1000); assert.equal(await page.evaluate(() => window.dismissals.length), 1); assert.equal(await page.locator('#history').textContent(), '저장 내용 갱신');
    }));
    await t.test('snackbar link stays native and focused button pauses optional lifetime', () => harness(async page => {
      await page.clock.install(); await page.evaluate(async () => { const host = document.createElement('krds-snackbar'); Object.assign(host, { message: { id: 'a', title: '완료', text: '저장 완료' }, action: { kind: 'link', id: 'view', label: '내역 보기', href: '#result' }, durationMs: 1000 }); document.querySelector('main').append(host); window.dismissals = []; host.addEventListener('dismiss', event => window.dismissals.push(event.detail)); await host.updateComplete; });
      assert.equal(await page.getByRole('link', { name: '내역 보기' }).getAttribute('href'), '#result'); await page.getByRole('link').focus(); await page.clock.fastForward(5000); assert.deepEqual(await page.evaluate(() => window.dismissals), []);
      await page.locator('krds-snackbar').evaluate(async host => { host.action = { kind: 'button', id: 'retry', label: '다시 시도' }; host.message = { ...host.message, error: '로컬 오류' }; await host.updateComplete; }); assert.equal(await page.getByRole('button', { name: '다시 시도' }).count(), 1); assert.equal(await page.getByRole('link').count(), 0);
      await page.getByRole('button', { name: '알림 닫기' }).click(); assert.equal(await page.evaluate(() => window.dismissals.length), 1); assert.equal(await page.getByRole('button', { name: '알림 닫기' }).isVisible(), true);
    }));
    await t.test('carousel controlled playing cannot override focus, hover or rejected Stop inhibits', () => harness(async page => {
      await page.clock.install(); await page.evaluate(async () => { const host = document.createElement('krds-carousel'); Object.assign(host, { label: '소식', items: [{ id: 'a', label: 'A', content: '첫 소식' }, { id: 'b', label: 'B', content: '다음 소식' }], playing: true, index: 0, intervalMs: 100 }); document.querySelector('main').append(host); window.requests = []; host.addEventListener('index-change', event => window.requests.push(event.detail)); host.addEventListener('playing-change', event => window.requests.push(event.detail)); await host.updateComplete; });
      await page.getByRole('button', { name: '다음 슬라이드' }).focus(); await page.clock.fastForward(500); assert.deepEqual(await page.evaluate(() => window.requests), []);
      await page.getByRole('button', { name: '재생', exact: true }).click(); await page.mouse.move(1200, 700); await page.locator('krds-carousel').evaluate(host => host.updateComplete); await page.clock.fastForward(134); assert.deepEqual(await page.evaluate(() => window.requests), [{ index: 1, reason: 'timer' }]);
      await page.getByRole('button', { name: '다음 슬라이드' }).focus(); await page.getByRole('button', { name: '자동 재생 중지' }).click(); await page.mouse.move(1200, 700); const count = await page.evaluate(() => window.requests.length); await page.clock.fastForward(1000); assert.equal(await page.evaluate(() => window.requests.length), count); assert.equal(await page.getByText('첫 소식', { exact: true }).isVisible(), true);
    }, { reducedMotion: 'no-preference' }));
    await t.test('tooltip hover Escape acceptance suppresses induced focus and names resolve same-root', () => harness(async page => {
      await page.evaluate(async () => { document.querySelector('main').innerHTML = '<button id="other">다른 작업</button><krds-tooltip></krds-tooltip>'; const host = document.querySelector('krds-tooltip'); Object.assign(host, { text: '보충 설명', triggerLabel: '정보', triggerId: 'trigger', textId: 'tip' }); await host.updateComplete; });
      await page.getByRole('button', { name: '다른 작업' }).focus(); await page.getByRole('button', { name: '정보', exact: true }).hover(); assert.equal(await page.getByRole('tooltip').isVisible(), true); assert.equal(await page.evaluate(() => document.activeElement.id), 'other'); await page.keyboard.press('Escape'); assert.equal(await page.getByRole('tooltip').isVisible(), false); assert.equal(await page.getByRole('button', { name: '정보', exact: true }).evaluate(button => button.getRootNode().activeElement === button), true); await page.keyboard.press('Tab'); await page.getByRole('button', { name: '情報', exact: true }).count();
      assert.equal(await page.locator('krds-tooltip').evaluate(host => { const button = host.shadowRoot.querySelector('button'); return host.shadowRoot.getElementById(button.getAttribute('aria-describedby'))?.textContent; }), '보충 설명');
    }));
    await t.test('coach inserts immediately after the unchanged native target and validates real target action', () => harness(async page => {
      await page.evaluate(async () => { document.querySelector('main').innerHTML = '<button id="start">시작</button><label for="target">성명</label><input id="target" value="원래 이름"><div id="after-target"></div><krds-coach-mark></krds-coach-mark>'; const input = document.getElementById('target'); input.focus(); input.setSelectionRange(2, 2); window.originalTarget = input; const host = document.querySelector('krds-coach-mark'); Object.assign(host, { defaultOpen: true, steps: [{ id: 'one', targetId: 'target', title: '입력', instruction: '입력하고 선택하세요', requiresAction: true }], boundaries: [{ targetId: 'target', insertionBoundaryId: 'after-target' }], startActionId: 'start', onTargetAction: () => input.value === '완료' }); window.stops = []; host.addEventListener('open-change', event => window.stops.push(event.detail)); await host.updateComplete; });
      assert.equal(await page.evaluate(() => document.getElementById('target') === window.originalTarget && document.getElementById('target').nextElementSibling.id === 'after-target'), true); assert.equal(await page.getByRole('region', { name: '입력' }).isVisible(), true); await page.getByRole('textbox', { name: '성명' }).click(); assert.equal(await page.evaluate(() => window.stops.length), 0); await page.getByRole('textbox', { name: '성명' }).fill('완료'); await page.getByRole('textbox', { name: '성명' }).click(); assert.equal(await page.getByRole('region', { name: '입력' }).count(), 0); assert.equal(await page.evaluate(() => window.stops.length), 1); assert.equal(await page.evaluate(() => document.activeElement?.id), 'start');
    }));
  } finally { await browser.close(); await server.close(); }
});

for (const engine of ['chromium', 'webkit']) test(`Lit ${engine} narrow help and tutorial focus ownership`, async () => {
  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname); const browser = await ({ chromium, webkit })[engine].launch();
  try { const page = await browser.newPage({ viewport: { width: 360, height: 800 } }); await page.goto(`${server.origin}/harness.html`); await page.waitForFunction(() => customElements.get('krds-help-panel'));
    await page.evaluate(async () => { document.querySelector('main').innerHTML = '<button id="context">기관 도움말</button><button id="fallback">다음 작업</button><krds-help-panel></krds-help-panel>'; const host = document.querySelector('krds-help-panel'); Object.assign(host, { open: false, topics: [{ id: 'a', title: '기관 선택', content: '기관 안내', relatedLinks: [] }], fallbackFocusId: 'fallback' }); window.focusReturns = []; document.addEventListener('focusin', event => { if (event.composedPath()[0].getRootNode() === document) window.focusReturns.push(event.composedPath()[0].textContent); }); host.shadowRoot?.addEventListener('focusin', event => window.focusReturns.push(event.target.textContent)); await host.updateComplete; document.getElementById('context').focus(); host.open = true; host.selectTopic('a'); await host.updateComplete; });
    const panel = page.locator('krds-help-panel'); assert.equal(await panel.getByRole('dialog').isVisible(), true);
    await panel.getByRole('button', { name: '도움말 닫기' }).click(); assert.equal(await panel.getByRole('dialog').isVisible(), true); assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
    await page.evaluate(() => { window.focusReturns = []; }); await panel.evaluate(async host => { host.open = false; await host.updateComplete; }); assert.equal(await panel.getByRole('button', { name: '도움말 열기' }).evaluate(button => button.getRootNode().activeElement === button), true); assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    const returns = await page.evaluate(() => window.focusReturns.filter(text => ['도움말 열기', '기관 도움말'].includes(text))); assert.deepEqual(returns, ['도움말 열기']);
    await page.evaluate(async () => { document.querySelector('krds-help-panel').remove(); const host = document.createElement('krds-tutorial-panel'); Object.assign(host, { open: true, running: true, activePanel: 'help', tasks: [{ id: 'a', title: '신청', steps: [{ id: 'one', title: '이름 입력', targetId: 'context', instruction: '입력하세요' }] }], activeTaskId: 'a', activeStepId: 'one', startActionId: 'tutorial-start', fallbackFocusId: 'fallback' }); host.addEventListener('stop', () => { host.running = false; }); document.querySelector('main').append(host); await host.updateComplete; });
    const tutorial = page.locator('krds-tutorial-panel'); await tutorial.getByRole('button', { name: '따라하기 중지', exact: true }).click(); assert.equal(await tutorial.getByRole('dialog').isVisible(), true); assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden'); assert.equal(await tutorial.evaluate(host => { const dialog = host.shadowRoot.querySelector('dialog'); let active = document.activeElement; while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement; return dialog === active || dialog.contains(active); }), true);
    await tutorial.evaluate(host => host.remove()); assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  } finally { await browser.close(); await server.close(); }
});

for (const engine of ['chromium', 'webkit']) for (const id of ['text-input', 'textarea']) test(`Lit ${engine} ${id} preserves active IME draft during authoritative parent update`, async () => {
  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname); const browser = await ({ chromium, webkit })[engine].launch();
  try { const page = await browser.newPage(); await page.goto(`${server.origin}/harness.html`); await page.waitForFunction(() => customElements.get('krds-text-input'));
    const result = await page.evaluate(async id => { const form = document.createElement('form'); const host = document.createElement(`krds-${id}`); Object.assign(host, { label: '이름', name: 'person', value: '원래' }); form.append(host); document.querySelector('main').append(form); await host.updateComplete; const input = host.shadowRoot.querySelector('input,textarea'); const changes = []; host.addEventListener('value-change', event => changes.push(event.detail)); input.focus(); input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true })); input.value = '입력 중'; input.setSelectionRange(4, 4); input.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true })); host.value = '부모 변경'; await host.updateComplete; const during = { value: input.value, caret: input.selectionStart, form: [...new FormData(form)], changes: [...changes] }; input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true })); await host.updateComplete; return { during, final: input.value, changes, reused: input === host.shadowRoot.querySelector('input,textarea') }; }, id);
    assert.deepEqual(result, { during: { value: '입력 중', caret: 4, form: [['person', '부모 변경']], changes: [] }, final: '부모 변경', changes: [{ value: '입력 중' }], reused: true });
  } finally { await browser.close(); await server.close(); }
});

test('Lit public options produce actual icon-only TTS, opt-out underline and conditional table overflow', async () => {
  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname); const browser = await chromium.launch();
  try { const page = await browser.newPage(); await page.goto(`${server.origin}/harness.html`); await page.waitForFunction(() => customElements.get('krds-tts'));
    const observed = await page.evaluate(async () => { const main = document.querySelector('main'); const speech = document.createElement('krds-tts'); Object.assign(speech, { label: '요약 음성 안내', summary: '로컬 요약', iconOnly: true, size: 'xsmall' }); const link = document.createElement('krds-link'); Object.assign(link, { label: '신청 안내', href: '#apply', underline: false }); const table = document.createElement('krds-table'); Object.assign(table, { caption: '단순 표', columns: [{ id: 'title', label: '제목', kind: 'text' }], rows: [{ id: 'a', cells: { title: '단순 항목' } }] }); main.append(speech, link, table); await Promise.all([speech.updateComplete, link.updateComplete, table.updateComplete]); const label = speech.shadowRoot.querySelector('[part="label"]'); const region = table.shadowRoot.querySelector('[part="scroll-region"]'); return { ttsName: speech.shadowRoot.querySelector('button').getAttribute('aria-label'), labelHidden: !!label && getComputedStyle(label).clipPath !== 'none', underline: getComputedStyle(link.shadowRoot.querySelector('a')).textDecorationLine, scrollButtons: table.shadowRoot.querySelectorAll('[part="scroll-next"],[part="scroll-previous"]').length, scrollTab: region.getAttribute('tabindex') }; });
    assert.deepEqual(observed, { ttsName: '요약 음성 안내 재생', labelHidden: true, underline: 'none', scrollButtons: 0, scrollTab: null });
  } finally { await browser.close(); await server.close(); }
});

test('Lit BackButton fallback is a real guarded href and stale async confirmation cannot navigate after unmount', async () => {
  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname); const browser = await chromium.launch();
  try { const page = await browser.newPage(); await page.goto(`${server.origin}/harness.html`); await page.waitForFunction(() => customElements.get('krds-back-button'));
    await page.evaluate(async () => { const host = document.createElement('krds-back-button'); Object.assign(host, { label: '안전한 뒤로가기', canGoBack: false, fallbackHref: '#parent', dirty: true, requestConfirmation: () => new Promise(resolve => { window.resolveBack = resolve; }) }); window.backEvents = []; host.addEventListener('back-request', event => window.backEvents.push(event.detail)); document.querySelector('main').append(host); await host.updateComplete; });
    const link = page.getByRole('link', { name: '안전한 뒤로가기' }); assert.equal(await link.getAttribute('href'), '#parent'); await link.click(); await page.locator('krds-back-button').evaluate(host => { window.savedBack = host; host.remove(); }); await page.evaluate(() => window.resolveBack(true)); await page.evaluate(() => Promise.resolve()); assert.deepEqual(await page.evaluate(() => window.backEvents), []); assert.equal(new URL(page.url()).hash, ''); await page.evaluate(async () => { window.savedBack.requestConfirmation = () => false; document.querySelector('main').append(window.savedBack); await window.savedBack.updateComplete; }); assert.notEqual(await link.getAttribute('aria-disabled'), 'true'); await link.click(); assert.deepEqual(await page.evaluate(() => window.backEvents), []);
  } finally { await browser.close(); await server.close(); }
});

for (const engine of ['chromium', 'webkit']) test(`Lit ${engine} barred required FACE controls clear validity and reset without errors`, async () => {
  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname);
  const browser = await ({ chromium, webkit })[engine].launch();
  try {
    const page = await browser.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(error.stack));
    await page.goto(`${server.origin}/harness.html`);
    await page.waitForFunction(() => customElements.get('krds-native-select'));
    const result = await page.evaluate(async () => {
      const form = document.createElement('form'); const fieldset = document.createElement('fieldset');
      const select = document.createElement('krds-native-select'); Object.assign(select, { label: '지역', name: 'region', required: true, value: '', options: [{ value: '', label: '선택하세요' }, { value: 'seoul', label: '서울' }] });
      const text = document.createElement('krds-text-input'); Object.assign(text, { label: '이름', name: 'person', required: true, value: '' });
      fieldset.append(select, text); form.append(fieldset); document.querySelector('main').append(form);
      await Promise.all([select.updateComplete, text.updateComplete]);
      const missing = [select, text].map(host => host.formControl.internals.validity.valueMissing);
      fieldset.disabled = true;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      form.reset(); await Promise.all([select.updateComplete, text.updateComplete]);
      const disabled = [select, text].map(host => host.formControl.internals.validity.valid);
      const entries = [...new FormData(form)];
      fieldset.disabled = false;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return { missing, disabled, entries, restored: [select, text].map(host => host.formControl.internals.validity.valueMissing) };
    });
    assert.deepEqual(result, { missing: [true, true], disabled: [true, true], entries: [], restored: [true, true] }); assert.deepEqual(errors, []);
  } finally { await browser.close(); await server.close(); }
});

test('Lit FAB showLabel controls visible text while retaining native name and expansion', async () => {
  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname); const browser = await chromium.launch();
  try {
    const page = await browser.newPage(); await page.goto(`${server.origin}/harness.html`); await page.waitForFunction(() => customElements.get('krds-fab'));
    await page.evaluate(async () => { const host = document.createElement('krds-fab'); Object.assign(host, { label: '빠른 신청', showLabel: false, actions: [{ id: 'save', label: '저장' }] }); window.fabEvents = []; host.addEventListener('expanded-change', event => window.fabEvents.push(event.detail)); document.querySelector('main').append(host); await host.updateComplete; });
    const trigger = page.getByRole('button', { name: '빠른 신청', exact: true }); assert.equal((await trigger.textContent()).trim(), '+'); await trigger.focus();
    await page.locator('krds-fab').evaluate(async host => { host.showLabel = true; await host.updateComplete; }); assert.equal((await trigger.textContent()).trim(), '+빠른 신청'); await trigger.evaluate(node => { if (node.getRootNode().activeElement !== node) throw new Error('Visibility update lost native focus'); }); assert.deepEqual(await page.evaluate(() => window.fabEvents), []);
    await trigger.click(); assert.equal(await trigger.getAttribute('aria-expanded'), 'true'); assert.deepEqual(await page.evaluate(() => window.fabEvents), [{ expanded: true }]);
  } finally { await browser.close(); await server.close(); }
});

test('Lit FAB rejected Escape has one request and accepted close retains a real nonmodal overlay/focus owner', async () => {
  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname); const browser = await chromium.launch();
  try {
    const page = await browser.newPage(); await page.goto(`${server.origin}/harness.html`); await page.waitForFunction(() => customElements.get('krds-fab'));
    await page.evaluate(async () => { const host = document.createElement('krds-fab'); Object.assign(host, { label: '빠른 신청', expanded: true, actions: [{ id: 'save', label: '저장' }] }); window.fabEvents = []; host.addEventListener('expanded-change', event => window.fabEvents.push(event.detail)); document.querySelector('main').append(host); await host.updateComplete; });
    const save = page.getByRole('button', { name: '저장', exact: true }); await save.focus(); await page.screenshot({ path: new URL('../../../../.superpowers/sdd/PLAN/t10-lit-logs/visual-inspection/fab-expanded-overlay.png', import.meta.url).pathname }); await page.keyboard.press('Escape'); assert.deepEqual(await page.evaluate(() => window.fabEvents), [{ expanded: false }]); await save.evaluate(node => { if (node.getRootNode().activeElement !== node) throw new Error('Rejected close lost focus'); });
    const overlay = page.locator('krds-fab [data-krds-part="overlay"]'); assert.equal(await overlay.isVisible(), true); assert.equal(await overlay.getAttribute('aria-hidden'), 'true'); assert.equal(await page.getByRole('dialog').count(), 0);
    await page.locator('krds-fab').evaluate(async host => { host.expanded = false; await host.updateComplete; });
    assert.equal(await save.isVisible(), false); await page.getByRole('button', { name: '빠른 신청', exact: true }).evaluate(node => { if (node.getRootNode().activeElement !== node) throw new Error('Accepted close did not return focus'); });
  } finally { await browser.close(); await server.close(); }
});
