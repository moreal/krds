import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import { browserPath, serveProduction } from '../../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const { chromium, webkit } = await import('playwright');
const directory = process.env.KRDS_LIT_HOST_PROOF_DIST ?? new URL('../../dist/', import.meta.url).pathname;

async function fixture(engine, component, caseId, run, beforeNavigation) {
 const server = await serveProduction(directory, {fixture: true});
 const browser = await ({chromium, webkit})[engine].launch();
 try {
  const page = await browser.newPage();
  page.setDefaultTimeout(2500);
  if (beforeNavigation) await page.addInitScript(beforeNavigation);
  await page.goto(`${server.origin}/fixtures/${component}?case=${caseId}`);
  await page.waitForFunction(() => window.__KRDS_FIXTURE__);
  await run(page);
 } finally { await browser.close(); await server.close(); }
}

for (const engine of ['chromium', 'webkit']) {
 test(`${engine} ContextualHelp host keeps the genuine outside action outside the open popup`, () => fixture(engine, 'contextual-help', 'outcome-04', async page => {
  const trigger = page.getByRole('button', {name: '신청 자격 도움말', exact: true});
  const popup = page.locator('krds-contextual-help [part="popover"]');
  await trigger.click();
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => {const host = document.querySelector('krds-contextual-help'); return host.shadowRoot.activeElement === host.shadowRoot.querySelector('[part="trigger"]');});
  assert.equal(await popup.isVisible(), false);
  await trigger.click();
  assert.equal(await popup.isVisible(), true);
  await page.locator('[data-krds-host="outside-action"]').click();
  await page.waitForFunction(() => {const host = document.querySelector('krds-contextual-help'); return host.shadowRoot.activeElement === host.shadowRoot.querySelector('[part="trigger"]');});
  assert.equal(await popup.isVisible(), false);
  assert.deepEqual(await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents()), [
   {name: 'openChange', detail: {open: true}}, {name: 'openChange', detail: {open: false}},
   {name: 'openChange', detail: {open: true}}, {name: 'openChange', detail: {open: false}},
  ]);
 }));

 test(`${engine} standalone Coach host declines Stop against explicit controlled open and preserves real focus`, () => fixture(engine, 'coach-mark', 'outcome-11', async page => {
  const stop = page.getByRole('button', {name: '그만보기', exact: true});
  await stop.focus();
  await page.keyboard.press('Enter');
  const root = page.locator('[data-krds-component="coach-mark"][part="root"]');
  assert.equal(await root.isVisible(), true);
  assert.equal(await stop.evaluate(node => document.activeElement === node), true);
  assert.deepEqual(await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents()), [{name: 'openChange', detail: {open: false}}]);
  await page.evaluate(() => window.__KRDS_FIXTURE__.setState({__host: {acceptStop: true, startActionPresent: false, routeChange: true}}));
  await page.waitForFunction(() => !document.querySelector('[data-krds-component="coach-mark"][part="root"]'));
  assert.equal(await page.evaluate(() => document.activeElement.isConnected && !document.activeElement.closest('[inert]')), true);
  assert.deepEqual(await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents()), [{name: 'openChange', detail: {open: false}}]);
 }));
}

for (const engine of ['chromium', 'webkit']) {
 test(`${engine} declared standalone Coach target starts genuinely offscreen and native scrolling preserves its identity`, () => fixture(engine, 'coach-mark', 'outcome-06', async page => {
  await page.waitForFunction(() => window.coachNativeScrollCalls.length > 0);
  const proof = await page.evaluate(() => {
   const fixture = document.querySelector('krds-coach-mark-fixture');
   const targetId = fixture.local.state.steps[0].targetId;
   const boundaryId = fixture.local.state.boundaries.find(item => item.targetId === targetId).insertionBoundaryId;
   const target = document.getElementById(targetId);
   const rect = target.getBoundingClientRect();
   return {configuredOffscreen: fixture.local.host.targetOffscreen, receipt: window.coachNativeScrollCalls.find(item => item.id === targetId), sameTarget: target === window.coachOriginalTarget, adjacentBoundary: target.nextElementSibling.id === boundaryId, actualVisible: rect.y >= 0 && rect.bottom <= innerHeight, tutorialCount: document.querySelectorAll('krds-tutorial-panel').length};
  });
  if (process.env.KRDS_LIT_HOST_EVIDENCE_DIR) {
   await mkdir(process.env.KRDS_LIT_HOST_EVIDENCE_DIR, {recursive: true});
   await writeFile(join(process.env.KRDS_LIT_HOST_EVIDENCE_DIR, `${engine}-offscreen.json`), JSON.stringify(proof, null, 2));
  }
  assert.equal(proof.configuredOffscreen, true);
  assert.ok(proof.receipt.before.top >= proof.receipt.before.viewportHeight);
  assert.equal(proof.receipt.originalNative, true);
  assert.equal(proof.receipt.after.visible, true);
  assert.equal(proof.sameTarget, true);
  assert.equal(proof.adjacentBoundary, true);
  assert.equal(proof.actualVisible, true);
  assert.equal(proof.tutorialCount, 0);
 }, () => {
  window.coachNativeScrollCalls = [];
  const original = Element.prototype.scrollIntoView;
  const originalNative = Function.prototype.toString.call(original).includes('[native code]');
  Element.prototype.scrollIntoView = function(...args) {
   const before = this.getBoundingClientRect();
   const receipt = {id: this.id, originalNative, before: {top: before.top, bottom: before.bottom, viewportHeight: innerHeight}, after: null};
   window.coachOriginalTarget = this;
   window.coachNativeScrollCalls.push(receipt);
   const result = original.apply(this, args);
   const after = this.getBoundingClientRect();
   receipt.after = {top: after.top, bottom: after.bottom, visible: after.top >= 0 && after.bottom <= innerHeight};
   return result;
  };
 }));
}
