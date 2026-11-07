import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { exercise, observe, needsClock } from './scenarios.mjs';
import { ensureDeep } from './deep.mjs';
export const scenarioKey = entry => entry.exampleId === 'default' ? entry.componentId : `${entry.componentId}/${entry.exampleId}`;

export const READY = '미리보기가 준비되었습니다.';
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const RESET = '초기화 / 다시 시도';
// Acceptance outcomes that are invariants: critical-alert cannot be dismissed; header keeps its order while scrolling.
const invariant = new Set(['critical-alert', 'header']);
const benignFailure = text => /ERR_ABORTED|cancelled|Load request cancelled|interrupted/i.test(text ?? '');
// Stable renderer markers inside normalized module IDs; a preview carrying another family's renderer fails.
const renderers = { react: /node_modules\/\.store\/react-dom-/, svelte: /node_modules\/\.store\/svelte-(npm|virtual)-/, vue: /node_modules\/\.store\/@vue-runtime-dom-/, angular: /node_modules\/\.store\/@angular-core-/, lit: /node_modules\/\.store\/lit-html-/, qwik: /node_modules\/\.store\/(@qwik\.dev-core|@builder\.io-qwik)-/, solid: /node_modules\/\.store\/solid-js-npm-1\./, 'solid-next': /node_modules\/\.store\/solid-js-npm-2\./ };
const packageDirs = ['react', 'solid', 'svelte', 'vue', 'angular', 'lit', 'qwik', 'solid-next'];

/** Attach collectors to a page: console/page errors and every request with its final state. */
export function instrument(page) {
  const log = { console: [], pageErrors: [], requests: [] };
  page.on('console', m => { if (m.type() === 'error') log.console.push({ text: m.text(), url: m.location()?.url ?? '' }); });
  page.on('pageerror', e => log.pageErrors.push(e.message));
  page.on('request', r => log.requests.push({ url: r.url(), type: r.resourceType(), frame: (() => { try { return r.frame().url(); } catch { return null; } })(), at: Date.now(), status: null, failure: null, request: r }));
  page.on('response', r => { const x = log.requests.findLast(q => q.request === r.request()); if (x) x.status = r.status(); });
  page.on('requestfailed', r => { const x = log.requests.findLast(q => q.request === r); if (x) x.failure = r.failure()?.errorText ?? 'failed'; });
  return log;
}
/** Unexpected network: anything leaving /krds/ on the test origin, HTTP errors, failures, foreign previews, undeclared preview files. */
/** The frame never sits below the registry minimum or the layout floor. */
export const frameFloor = entry => Math.max(entry.minHeight ?? 0, entry.layout === 'overlay' ? 640 : 240);
/** Expected source panel blocks: one per excerpt (exact range bytes, labelled) or the full file. */
export function expectedSourceDisplay(source, bytes) {
  if (!source.excerpts?.length) return [{ text: bytes.toString() }];
  return source.excerpts.map((excerpt, index) => ({ label: `발췌 · 줄 ${excerpt.startLine}–${excerpt.endLine} · ${source.symbolOrBranch}`, text: bytes.subarray(source.ranges[index].start, source.ranges[index].end).toString() }));
}
export function unexpectedNetwork(log, { origin, framework, files, absent = [] }) {
  const bad = [];
  for (const r of log.requests) {
    if (/^(data|blob|about):/.test(r.url)) continue;
    const u = new URL(r.url);
    if (u.origin !== origin || !u.pathname.startsWith('/krds/')) { bad.push(`external ${r.url}`); continue; }
    // Registry-declared intentional absences (e.g. Qwik image's error-state specimen) may 404, and only those.
    if (absent.includes(u.pathname)) { if (r.status !== null && r.status !== 404) bad.push(`absent reference served ${r.status} ${r.url}`); continue; }
    if (r.status !== null && r.status >= 400) bad.push(`HTTP ${r.status} ${r.url}`);
    if (r.failure && !benignFailure(r.failure)) bad.push(`failed ${r.failure} ${r.url}`);
    const m = /^\/krds\/previews\/([^/]+)\/(.*)$/.exec(u.pathname);
    if (m && m[1] !== framework) bad.push(`foreign preview ${r.url}`);
    else if (m && files && !files.has(m[2])) bad.push(`undeclared artifact file ${r.url}`);
  }
  return bad;
}
/** Duplicate IDs per ID scope: the document and each open shadow root (IDs are scoped per tree). */
export async function duplicateIds(target) {
  await ensureDeep(target);
  return target.evaluate(() => { const dup = new Set(); for (const root of window.__krdsDeep.roots()) { const seen = new Set(); for (const n of root.querySelectorAll('[id]')) { if (seen.has(n.id)) dup.add(n.id); seen.add(n.id); } } return [...dup]; });
}
/** Exact native identity: package/version agree with the manifest; the package and component modules are compiled in; no foreign renderer. */
export function moduleIdentity(entry, manifest, families) {
  assert.equal(manifest.framework, entry.framework, 'manifest framework');
  assert.equal(manifest.identity.package, entry.package, 'native package');
  assert.equal(manifest.identity.version, entry.packageVersion, 'native package version');
  const dir = entry.package.replace(/^@unofficial-krds\//, '');
  assert.equal(dir, entry.framework, 'package belongs to the selected framework');
  const ids = manifest.modules.map(m => m.id);
  // Normalized native graph IDs differ per builder (Angular `main.js#../../packages/...`, Qwik QRL segments).
  const inPackage = id => new RegExp(`(^|[#/])(\\.\\./)*packages/${dir}/`).test(id);
  const own = ids.filter(inPackage);
  assert.ok(own.length, `no ${entry.package} module compiled into ${entry.framework} artifact`);
  // A module belongs to the family whose kebab/Pascal name is the longest bounded match in its path
  // (so `back-button.js` is not Button). Single-bundle packages (Qwik index, static parts) fall back to the bundle.
  const pascal = id => id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  const bounded = (name, flags = '') => new RegExp(`(^|[/#_-])${name}([./_-]|$)`, flags);
  const familyOf = id => (families ?? [entry.componentId]).filter(f => bounded(f).test(id) || bounded(pascal(f), 'i').test(id)).sort((a, b) => b.length - a.length)[0];
  const perComponent = own.filter(id => familyOf(id) === entry.componentId);
  const bundle = own.filter(id => /(^|\/)(index(\.qwik)?\.m?js|fesm2022\/unofficial-krds-[a-z-]+\.mjs)$/.test(id) && !familyOf(id));
  assert.ok(perComponent.length || bundle.length, `no ${entry.package} module for ${entry.componentId}`);
  for (const other of packageDirs.filter(d => d !== dir)) assert.ok(!ids.some(id => new RegExp(`(^|[#/])(\\.\\./)*packages/${other}/`).test(id)), `foreign adapter packages/${other} in ${entry.framework}`);
  for (const [fw, pattern] of Object.entries(renderers)) if (fw !== entry.framework) assert.ok(!ids.some(id => pattern.test(id)), `foreign renderer ${fw} in ${entry.framework}`);
  assert.ok(manifest.identity.renderer && manifest.identity.compiler, 'renderer/compiler identity');
  return { package: manifest.identity.package, version: manifest.identity.version, renderer: manifest.identity.renderer, compiler: manifest.identity.compiler, componentModules: perComponent.length ? perComponent.slice(0, 8) : bundle.map(id => `${id} (bundle)`) };
}
async function frameOf(page) {
  const handle = await page.locator('.native-demo iframe').elementHandle();
  const frame = await handle.contentFrame();
  await frame.waitForLoadState('load');
  return frame;
}
async function waitReady(page, timeout = 20000) {
  await page.locator('.native-demo-status').filter({ hasText: READY }).waitFor({ timeout });
}
const stable = obs => JSON.stringify(obs);

/**
 * One result row. Every assertion failure becomes a failed row with its error; a passing row
 * carries its observations, hashes, identity and screenshot paths.
 */
export async function runRow({ browser, browserName, origin, entry, manifest, registryHash, acceptance, evidence, site, reasons, clipboard }) {
  const row = { framework: entry.framework, componentId: entry.componentId, exampleId: entry.exampleId, status: 'failed', browser: browserName, reasons, registrySha256: registryHash, entryStatus: entry.status };
  const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, ...(clipboard ? { permissions: ['clipboard-read', 'clipboard-write'] } : {}) });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  if (needsClock.has(entry.componentId)) await page.clock.install();
  const log = instrument(page);
  const shots = {};
  const shot = async (phase, locator) => {
    const path = resolve(evidence, 'matrix', browserName, entry.framework, `${entry.componentId}--${entry.exampleId}-${phase}.png`);
    await mkdir(dirname(path), { recursive: true });
    await (locator ?? page.locator('.native-demo-frame')).screenshot({ path });
    shots[phase] = relative(site, path);
  };
  const started = Date.now();
  try {
    await page.goto(`${origin}/krds/components/${entry.componentId}.html?framework=${entry.framework}&example=${entry.exampleId}`);
    await page.waitForFunction(() => document.querySelector('[data-docs-ready]')?.dataset.docsReady === 'true');
    const demo = page.locator('.native-demo');
    assert.equal(await demo.count(), 1, 'exactly one native demo section');
    await demo.scrollIntoViewIfNeeded();
    assert.equal(await page.getByLabel('프레임워크 패키지', { exact: true }).inputValue(), entry.framework, 'framework selector binding');
    assert.equal((await page.locator('.native-demo-package').textContent()).replace(/\s+/g, ' ').trim(), `${entry.package} ${entry.packageVersion}`, 'displayed package identity');
    if (entry.status === 'unavailable') {
      await page.waitForTimeout(400);
      assert.equal(await demo.locator('iframe').count(), 0, 'unavailable row loads no frame');
      assert.equal(await demo.getByRole('button', { name: RESET }).count(), 0, 'unavailable row has no Reset');
      assert.equal((await demo.getByRole('status').first().textContent()).trim(), entry.reason, 'unavailable reason shown');
      assert.deepEqual(log.requests.filter(r => r.url.includes('/krds/previews/')).map(r => r.url), [], 'unavailable row requests no runtime');
      row.unavailable = { reason: entry.reason };
      await shot('unavailable', demo);
    } else {
      const item = acceptance.get(entry.acceptanceId);
      assert.ok(item && item.componentId === entry.componentId && item.classification === entry.classification, `acceptance ${entry.acceptanceId}`);
      Object.assign(row, { acceptanceId: entry.acceptanceId, classification: entry.classification, artifactSha256: entry.artifactSha256, observableOutcome: item.observableOutcome });
      assert.equal(manifest.sha256, entry.artifactSha256, 'registry artifact hash equals deployed manifest bytes');
      row.identity = moduleIdentity(entry, manifest, [...acceptance.values()].map(i => i.componentId));
      await waitReady(page);
      row.readyMs = Date.now() - started;
      const iframe = demo.locator('iframe');
      assert.equal(await iframe.count(), 1, 'one native frame');
      assert.equal(await iframe.getAttribute('sandbox'), 'allow-scripts allow-same-origin', 'sandbox');
      const src = new URL(await iframe.getAttribute('src'));
      const expected = new URL(entry.entryUrl, origin);
      assert.equal(src.pathname, expected.pathname, 'entry document');
      for (const [k, v] of expected.searchParams) assert.equal(src.searchParams.get(k), v, `entry query ${k}`);
      assert.equal(src.searchParams.get('framework'), entry.framework); assert.equal(src.searchParams.get('componentId'), entry.componentId); assert.equal(src.searchParams.get('exampleId'), entry.exampleId);
      const token = src.searchParams.get('token');
      assert.match(token ?? '', /^[0-9a-f]{32}$/, 'runtime token');
      const height = parseFloat(await iframe.evaluate(n => n.style.height));
      assert.ok(height >= frameFloor(entry) && height <= 1200, `frame height ${height} (registry minHeight ${entry.minHeight})`);
      // Selected source binding: registry ↔ manifest binding ↔ displayed bytes ↔ downloadable bytes.
      const example = entry.sources.find(s => s.role === 'example') ?? entry.sources[0];
      const bindings = manifest.bindings.filter(b => b.componentId === entry.componentId && b.exampleId === entry.exampleId);
      for (const s of entry.sources) {
        const b = bindings.find(x => x.sourcePath === s.path);
        assert.ok(b && b.sha256 === s.sha256 && b.symbolOrBranch === s.symbolOrBranch, `manifest binding for ${s.path}`);
        const bytes = await (await page.request.get(origin + s.downloadUrl)).body();
        assert.equal(sha256(bytes), s.sha256, `download bytes for ${s.path}`);
        for (const excerpt of s.excerpts ?? []) {
          const extract = await (await page.request.get(origin + excerpt.downloadUrl)).body();
          assert.equal(sha256(extract), excerpt.sha256, `excerpt bytes for ${s.path}`);
        }
        if (s === example) row.sourceBytes = bytes;
      }
      assert.equal(await demo.locator('.native-demo-source select').inputValue(), example.path, 'selected source file');
      // Ranged example: excerpts (exact range bytes) by default, full file only behind "전체 파일 보기".
      const display = expectedSourceDisplay(example, row.sourceBytes);
      const source = demo.locator('.native-demo-source');
      assert.deepEqual(await source.locator('pre code').allTextContents(), display.map(d => d.text), 'displayed source equals selected bytes/excerpts');
      assert.deepEqual(await source.locator('.native-demo-excerpt > figcaption').allTextContents(), display.flatMap(d => d.label ? [d.label] : []), 'excerpt labels');
      row.source = { path: example.path, symbolOrBranch: example.symbolOrBranch, sha256: example.sha256, entryUrl: entry.entryUrl };
      const fullBytes = row.sourceBytes; delete row.sourceBytes;
      let frame = await frameOf(page);
      await frame.waitForSelector('[data-preview-return]');
      row.initial = await observe(frame);
      await shot('initial');
      const frameDup = await duplicateIds(frame), shellDup = await duplicateIds(page);
      assert.deepEqual(frameDup, [], 'duplicate IDs in preview'); assert.deepEqual(shellDup, [], 'duplicate IDs in shell');
      const media = await frame.evaluate(absent => window.__krdsDeep.all('img').filter(i => !absent.includes(new URL(i.src, location.href).pathname)).filter(i => !/error/.test(i.dataset.krdsState ?? '')).filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src), entry.absentReferences ?? []);
      // Images the native component itself marks as its error state (Image's load-failure specimen) are exempt; their requests still face the network rules.
      assert.deepEqual(media, [], 'every preview image resolved');
      const beforeAction = Date.now();
      let changed = null;
      await exercise(frame, scenarioKey(entry), { note: n => Object.assign(row.notes ??= {}, n), acceptance: acceptance.get(entry.acceptanceId), changed: async () => { changed = await observe(frame); await shot('changed'); } });
      if (!changed) { changed = await observe(frame); if (entry.classification === 'interactive') await shot('changed'); }
      row.action = changed;
      row.actionChanged = stable(changed) !== stable(row.initial);
      // critical-alert's acceptance outcome is that the notice cannot be dismissed: its action proves invariance.
      if (entry.classification === 'interactive' && !invariant.has(entry.componentId)) assert.ok(row.actionChanged, 'interactive action must change observable state');
      if (entry.framework === 'qwik') row.qrlRequestsAfterAction = log.requests.filter(r => r.at >= beforeAction && r.url.includes('/krds/previews/qwik/')).map(r => new URL(r.url).pathname);
      // Escape inside a native overlay is not hijacked by the shell.
      if (['modal', 'bottom-sheet'].includes(entry.componentId)) assert.equal(new URL(page.url()).searchParams.get('framework'), entry.framework);
      // Reset: fresh token, same deterministic baseline.
      await demo.getByRole('button', { name: RESET }).click();
      await page.waitForFunction(old => { const f = document.querySelector('.native-demo iframe'); return f && f.getAttribute('src') !== old; }, src.href);
      await waitReady(page);
      const resetSrc = new URL(await iframe.getAttribute('src'));
      assert.notEqual(resetSrc.searchParams.get('token'), token, 'reset uses a fresh token');
      frame = await frameOf(page);
      await frame.waitForSelector('[data-preview-return]');
      row.reset = await observe(frame);
      await shot('reset');
      assert.equal(stable(row.reset), stable(row.initial), 'reset returns to initial baseline');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no page overflow');
      // The on-demand full file is checked last: activating a shell control moves page focus (and
      // scroll) out of the frame, which must not precede the initial/reset baselines or scenarios.
      if (example.excerpts?.length) {
        await source.getByRole('button', { name: '전체 파일 보기' }).click();
        await expect.poll(() => source.locator('pre code').count(), { message: 'full file opens on demand' }).toBe(display.length + 1);
        assert.equal(await source.locator('pre code').last().textContent(), fullBytes.toString(), 'full file equals downloaded bytes');
      }
      row.screenshots = shots;
    }
    const files = manifest ? new Set(manifest.files.map(f => f.path)) : null;
    const absent = entry.absentReferences ?? [];
    const network = unexpectedNetwork(log, { origin, framework: entry.framework, files, absent });
    if (absent.length) row.absentReferences = absent;
    assert.deepEqual(network, [], 'unexpected network');
    const consoleErrors = log.console.filter(c => !(absent.length && /Failed to load resource/.test(c.text) && absent.some(a => c.url.endsWith(a)))).map(c => `${c.text} @ ${c.url}`);
    assert.deepEqual(consoleErrors, [], 'console errors');
    assert.deepEqual(log.pageErrors, [], 'page errors');
    row.requests = log.requests.filter(r => r.url.includes('/krds/previews/')).length;
    row.screenshots = shots;
    row.status = 'passed';
  } catch (error) {
    row.error = String(error?.message ?? error).split('\n').slice(0, 6).join(' | ');
    row.console = log.console; row.pageErrors = log.pageErrors; row.screenshots = shots;
    try { const path = resolve(evidence, 'matrix', browserName, entry.framework, `${entry.componentId}--${entry.exampleId}-failure.png`); await mkdir(dirname(path), { recursive: true }); await page.screenshot({ path }); row.screenshots.failure = relative(site, path); } catch {}
  } finally {
    delete row.sourceBytes;
    row.durationMs = Date.now() - started;
    await context.close();
  }
  return row;
}
