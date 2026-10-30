import test from 'node:test';
import assert from 'node:assert/strict';
import { browserPath, serveProduction } from '../../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const { chromium, webkit } = await import('playwright');

async function run(engine, work) {
 const server = await serveProduction(new URL('../../dist/', import.meta.url).pathname);
 const browser = await ({ chromium, webkit })[engine].launch();
 try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  page.setDefaultTimeout(2500);
  await page.goto(`${server.origin}/harness.html`);
  await page.waitForFunction(() => customElements.get('krds-modal'));
  await work(page);
 } finally { await browser.close(); await server.close(); }
}

for (const engine of ['chromium', 'webkit']) {
 test(`N01 ${engine}: public controlled true-to-false releases the removed dialog identity and permits fresh lifetimes`, () => run(engine, async page => {
  const result = await page.evaluate(async () => {
   document.body.style.setProperty('overflow-x', 'scroll', 'important');
   document.body.style.setProperty('overflow-y', 'auto');
   const before = document.body.style.cssText;
   const modal = document.createElement('krds-modal');
   Object.assign(modal, {title: '제어 모달', open: true});
   let changes = 0;
   modal.addEventListener('open-change', () => changes++);
   document.querySelector('main').append(modal);
   await modal.updateComplete;
   const activated = modal.shadowRoot.querySelector('dialog');
   modal.open = false;
   await modal.updateComplete;
   const closed = {style: document.body.style.cssText, connected: activated.isConnected, open: activated.open};
   modal.open = true;
   await modal.updateComplete;
   const reopened = modal.shadowRoot.querySelector('dialog').matches(':modal');
   modal.open = false;
   await modal.updateComplete;
   const sheet = document.createElement('krds-bottom-sheet');
   Object.assign(sheet, {title: '새 시트', open: true});
   document.querySelector('main').append(sheet);
   await sheet.updateComplete;
   sheet.open = false;
   await sheet.updateComplete;
   return {before, closed, reopened, after: document.body.style.cssText, changes};
  });
  assert.equal(result.closed.style, result.before);
  assert.equal(result.closed.connected, false);
  assert.equal(result.closed.open, false);
  assert.equal(result.reopened, true);
  assert.equal(result.after, result.before);
  assert.equal(result.changes, 0);
 }));

 for (const mode of ['uncontrolled-close', 'controlled-escape']) {
  test(`N01 ${engine}: ${mode} accepts exactly one request and restores the real opener and original overflow`, () => run(engine, async page => {
   await page.evaluate(async mode => {
    document.body.style.overflow = 'scroll';
    document.querySelector('main').innerHTML = '<button id="opener">실제 열기 작업</button>';
    document.getElementById('opener').focus();
    const modal = document.createElement('krds-modal');
    Object.assign(modal, {title: '닫기 검증', ...(mode === 'uncontrolled-close' ? {defaultOpen: true} : {open: true})});
    window.closeRequests = [];
    modal.addEventListener('open-change', event => {
     window.closeRequests.push(event.detail);
     if (mode === 'controlled-escape') modal.open = event.detail.open;
    });
    document.querySelector('main').append(modal);
    await modal.updateComplete;
   }, mode);
   if (mode === 'uncontrolled-close') await page.getByRole('button', {name: '닫기', exact: true}).click();
   else await page.keyboard.press('Escape');
   await page.locator('krds-modal').evaluate(async host => await host.updateComplete);
   assert.equal(await page.locator('krds-modal dialog').count(), 0);
   assert.equal(await page.evaluate(() => document.body.style.overflow), 'scroll');
   assert.equal(await page.getByRole('button', {name: '실제 열기 작업', exact: true}).evaluate(node => document.activeElement === node), true);
   assert.deepEqual(await page.evaluate(() => window.closeRequests), [{open: false}]);
  }));
 }

 for (const first of ['public', 'surface']) {
  test(`N01 ${engine}: accepted ${first} close preserves the other interleaved shell and final overflow`, () => run(engine, async page => {
   const result = await page.evaluate(async first => {
    document.body.style.overflow = 'auto';
    const modal = document.createElement('krds-modal');
    Object.assign(modal, {title: '공개 모달', open: true});
    document.querySelector('main').append(modal);
    await modal.updateComplete;
    const sheet = document.createElement('krds-bottom-sheet');
    Object.assign(sheet, {title: '조합 시트', open: true});
    document.querySelector('main').append(sheet);
    await sheet.updateComplete;
    const leading = first === 'public' ? modal : sheet;
    const remaining = first === 'public' ? sheet : modal;
    leading.open = false;
    await leading.updateComplete;
    const midway = {overflow: document.body.style.overflow, modal: remaining.shadowRoot.querySelector('dialog').matches(':modal')};
    remaining.open = false;
    await remaining.updateComplete;
    return {midway, after: document.body.style.overflow};
   }, first);
   assert.deepEqual(result, {midway: {overflow: 'hidden', modal: true}, after: 'auto'});
  }));
 }

 test(`N02 ${engine}: Escape suppression survives pointer and non-Tab focus changes until actual Tab departure and reentry`, () => run(engine, async page => {
  await page.evaluate(async () => {
   document.querySelector('main').innerHTML = '<button id="before" tabindex="0">이전 작업</button><button id="after" tabindex="0">다음 작업</button>';
   const tip = document.createElement('krds-tooltip');
   Object.assign(tip, {text: '추가 안내', triggerLabel: '도움말', triggerId: 'help-trigger', textId: 'help-text'});
   window.tooltipRequests = [];
   tip.addEventListener('open-change', event => window.tooltipRequests.push(event.detail));
   document.getElementById('after').before(tip);
   await tip.updateComplete;
  });
  const trigger = page.getByRole('button', {name: '도움말', exact: true});
  const popup = page.getByRole('tooltip');
  await page.getByRole('button', {name: '이전 작업', exact: true}).focus();
  await trigger.hover();
  assert.equal(await popup.isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await popup.isVisible(), false);
  assert.equal(await trigger.evaluate(node => node.getRootNode().activeElement === node), true);
  await page.mouse.move(1000, 750);
  await trigger.hover();
  assert.equal(await popup.isVisible(), false, 'pointer movement cannot reset processed Escape');
  await page.locator('krds-tooltip').evaluate(async host => {host.text = '변경된 안내'; await host.updateComplete;});
  assert.equal(await popup.isVisible(), false);
  await page.getByRole('button', {name: '다음 작업', exact: true}).click();
  await trigger.focus();
  assert.equal(await popup.isVisible(), false, 'non-Tab blur/reentry cannot reset Escape');
  await page.keyboard.press('Tab');
  await page.waitForFunction(() => document.activeElement === document.getElementById('after')).catch(async error => { throw new Error(`${error} ${JSON.stringify(await page.locator('krds-tooltip').evaluate(host => ({active: document.activeElement?.outerHTML, inner: host.shadowRoot.activeElement?.outerHTML, pending: host.tabDeparturePending, departed: host.keyboardDeparture, suppressed: host.suppressed})))}`); });
  assert.equal(await page.getByRole('button', {name: '다음 작업', exact: true}).evaluate(node => document.activeElement === node), true, JSON.stringify(await page.locator('krds-tooltip').evaluate(host => ({active: document.activeElement?.outerHTML, inner: host.shadowRoot.activeElement?.outerHTML, pending: host.tabDeparturePending, departed: host.keyboardDeparture, suppressed: host.suppressed}))));
  await page.keyboard.press('Shift+Tab');
  await page.waitForFunction(() => {const host = document.querySelector('krds-tooltip'); return host.shadowRoot.activeElement === host.shadowRoot.querySelector('button');});
  await page.locator('krds-tooltip').evaluate(async host => await host.updateComplete);
  assert.equal(await trigger.evaluate(node => node.getRootNode().activeElement === node), true);
  assert.equal(await popup.isVisible(), true);
  assert.deepEqual(await page.evaluate(() => window.tooltipRequests), [{open: true}, {open: false}, {open: true}]);
 }));
}

for (const engine of ['chromium', 'webkit']) {
 test(`N01 ${engine}: synchronous removal during native activation cannot retain a lock or run later focus work`, () => run(engine, async page => {
  const result = await page.evaluate(async () => {
   document.body.style.overflow = 'scroll';
   const modal = document.createElement('krds-modal');
   Object.assign(modal, {title: '활성화 생명주기', open: true});
   modal.innerHTML = '<button>처음 작업</button>';
   let removed = false;
   const focusCalls = [];
   const original = HTMLElement.prototype.focus;
   HTMLElement.prototype.focus = function(...args) { focusCalls.push(this.isConnected); return original.apply(this, args); };
   modal.addEventListener('focusin', () => { removed = true; modal.remove(); }, {once: true});
   document.querySelector('main').append(modal);
   try { await modal.updateComplete; } finally { HTMLElement.prototype.focus = original; }
   return {removed, connected: modal.isConnected, overflow: document.body.style.overflow, focusCalls};
  });
  assert.equal(result.removed, true);
  assert.equal(result.connected, false);
  assert.equal(result.overflow, 'scroll');
  assert.equal(result.focusCalls.every(Boolean), true);
 }));
}
