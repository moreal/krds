import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
const output = resolve('dist/docs-preview');
const evidence = resolve('../../.superpowers/sdd/2026-11-01-native-live-previews/solid-next-browser');
mkdirSync(evidence, { recursive: true });
const prefix = '/krds/previews/solid-next/';
const root = resolve('../..');
const definitions = JSON.parse(readFileSync(resolve('src/docs-preview/definitions.json'), 'utf8'));
const acceptance = JSON.parse(readFileSync(resolve(root, 'apps/docs/demo-acceptance.json'), 'utf8'));
const items = (Array.isArray(acceptance) ? acceptance : acceptance.items ?? Object.values(acceptance)).filter(i => i.componentId);
const pilots = ['button', 'native-select', 'modal', 'tabs', 'calendar', 'date-input'];
// Every playable definition must map to a verifier, and every pilot acceptance id must be defined and verified.
const defined = definitions.demos.map(d => d.acceptanceId).sort();
const wanted = items.filter(i => pilots.includes(i.componentId)).map(i => i.acceptanceId).sort();
assert.deepEqual(defined, wanted, 'definitions must cover exactly the six Solid 2 acceptance ids');

for (const d of definitions.demos) {
  assert.ok(Number.isFinite(d.minHeight) && d.minHeight >= 240 && d.minHeight <= 1200, `${d.componentId} minHeight within 240-1200`);
  assert.ok(['inline', 'overlay'].includes(d.layout), `${d.componentId} layout`);
  if (d.layout === 'overlay') assert.ok(d.minHeight >= 640, `${d.componentId} overlay minHeight >= 640`);
}
const harness = id => `<!doctype html><meta charset="utf-8"><body><iframe id="f" sandbox="allow-scripts allow-same-origin" style="width:900px;height:700px" src="${prefix}index.html?component=${id}&example=default&token=abcdefghijklmnop0123"></iframe><script>window.msgs=[];addEventListener('message',e=>{if(e.origin===location.origin&&e.source===document.getElementById('f').contentWindow)msgs.push(e.data)})</script>`;
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;
  if (!path.startsWith(prefix) || path.includes('..')) { res.writeHead(404).end(); return; }
  if (path === `${prefix}_harness.html`) { res.setHeader('Content-Type', 'text/html'); res.end(harness(url.searchParams.get('component'))); return; }
  try { const file = resolve(output, path.slice(prefix.length)); const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' }[extname(file)]; res.setHeader('Content-Type', type || 'application/octet-stream'); res.end(readFileSync(file)); }
  catch { res.writeHead(404).end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const context = await browser.newContext();
const errors = [], external = [], failed = [];
function watch(page) {
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) external.push(r.url()); });
  page.on('response', r => { if (r.status() >= 400) failed.push(r.url()); });
}
const page = await context.newPage();
watch(page);
const verified = new Set();
const status = (p, text) => p.getByRole('status').filter({ hasText: text });
// Exact docs sandbox: no allow-forms/popups/top-navigation/modals.
const view = page.frameLocator('#f');
const go = async id => { await page.goto(`${origin}${prefix}_harness.html?component=${id}&sandbox=1`); await page.waitForFunction(() => window.msgs.some(m => m.type === 'ready')); await page.waitForFunction(() => window.msgs.some(m => m.type === 'size')); };
const resetAfterResult = () => view.locator('body').evaluate(b => { const r = [...b.querySelectorAll('button')].find(x => x.textContent.trim() === '초기화'); const st = b.querySelector('[role=status]'); return !!r && !st.contains(r) && !r.closest('form') && !!(st.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_FOLLOWING) && r.hasAttribute('data-krds-variant'); });
const shot = name => page.screenshot({ path: resolve(evidence, name) });
const focused = (loc) => loc.evaluate(el => document.activeElement === el);
const cases = {
  'button-default': async () => {
    await go('button');
    await status(view, '아직 신청하지 않았습니다.').waitFor();
    const b = view.getByRole('button', { name: '신청하기', exact: true });
    assert.equal(await b.isEnabled(), true);
    await b.click();
    await status(view, '신청이 1회 완료되었습니다.').waitFor();
    await shot('button.png');
    await go('button'); await status(view, '아직 신청하지 않았습니다.').waitFor();
  },
  'native-select-default': async () => {
    await go('native-select'); assert.equal(await resetAfterResult(), true, 'reset Button follows result');
    const s = view.getByRole('combobox');
    assert.equal(await s.inputValue(), 'seoul');
    await status(view, '선택한 지역: 서울').waitFor();
    await s.selectOption('busan');
    assert.equal(await s.inputValue(), 'busan');
    await status(view, '선택한 지역: 부산').waitFor();
    await shot('native-select.png');
    await view.getByRole('button', { name: '초기화', exact: true }).click();
    assert.equal(await s.inputValue(), 'seoul');
    await s.selectOption('busan');
    await go('native-select');
    assert.equal(await view.getByRole('combobox').inputValue(), 'seoul');
  },
  'modal-default': async () => {
    await go('modal');
    assert.equal(await view.getByRole('dialog').count(), 0);
    const trigger = view.getByRole('button', { name: '모달 열기', exact: true });
    await trigger.click();
    const dialog = view.getByRole('dialog');
    await dialog.waitFor();
    assert.ok(await dialog.getAttribute('aria-labelledby') || await dialog.getAttribute('aria-label'), 'dialog is labeled');
    assert.ok(await view.getByRole('dialog', { name: '신청 확인' }).count(), 'dialog has name');
    await shot('modal-open.png');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await focused(trigger), true);
    await shot('modal-closed.png');
    await trigger.click();
    await dialog.waitFor();
    await view.getByRole('button', { name: '확인', exact: true }).click();
    await status(view, '신청을 확인했습니다.').waitFor();
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await focused(trigger), true);
    await shot('modal-confirm.png');
    await go('modal');
    assert.equal(await view.getByRole('dialog').count(), 0);
    await status(view, '확인을 기다리고 있습니다.').waitFor();
  },
  'tabs-default': async () => {
    await go('tabs');
    const first = view.getByRole('tab', { name: '안내', exact: true });
    assert.equal(await first.getAttribute('aria-selected'), 'true');
    await status(view, '안내를 보고 있습니다.').waitFor();
    const second = view.getByRole('tab', { name: '제출 서류', exact: true });
    await second.click();
    assert.equal(await second.getAttribute('aria-selected'), 'true');
    const panel = view.getByRole('tabpanel');
    await panel.filter({ hasText: '신분증과 신청서를 준비하세요.' }).waitFor();
    assert.equal(await panel.filter({ visible: true }).count(), 1);
    assert.equal(await view.getByRole('tab', { name: '사용 불가' }).isDisabled(), true);
    await shot('tabs.png');
    await go('tabs');
    assert.equal(await view.getByRole('tab', { name: '안내', exact: true }).getAttribute('aria-selected'), 'true');
  },
  'calendar-default': async () => {
    await go('calendar'); assert.equal(await resetAfterResult(), true, 'reset Button follows result');
    await status(view, '선택한 날짜: 없음').waitFor();
    assert.equal(await view.locator('[aria-selected="true"][data-date], [data-date][aria-pressed="true"]').count(), 0);
    await view.locator('[data-date="2024-02-29"]').click();
    await view.getByRole('button', { name: '확인', exact: true }).click();
    await status(view, '선택한 날짜: 2024-02-29').waitFor();
    const sel = view.locator('[data-date="2024-02-29"]');
    const semantic = await sel.evaluate(el => [el, ...el.querySelectorAll('*'), el.parentElement].some(n => n && (n.getAttribute('aria-selected') === 'true' || n.getAttribute('aria-pressed') === 'true' || n.getAttribute('aria-current') === 'date' || n.dataset.selected !== undefined || n.dataset.krdsSelected !== undefined)));
    assert.equal(semantic, true, 'selected day exposes selected semantics');
    await shot('calendar.png');
    await go('calendar'); await status(view, '선택한 날짜: 없음').waitFor();
  },
  'date-input-default': async () => {
    await go('date-input'); assert.equal(await resetAfterResult(), true, 'reset Button follows result');
    await status(view, '입력한 날짜: 없음').waitFor();
    const t = view.getByRole('textbox');
    assert.equal(await t.inputValue(), '');
    await t.fill('2024-02-29');
    await t.press('Enter');
    await status(view, '입력한 날짜: 2024-02-29').waitFor();
    assert.equal(await t.inputValue(), '2024-02-29');
    assert.notEqual(await t.getAttribute('aria-invalid'), 'true');
    await shot('date-input.png');
    await view.getByRole('button', { name: '초기화', exact: true }).click();
    await status(view, '입력한 날짜: 없음').waitFor();
    await go('date-input'); await status(view, '입력한 날짜: 없음').waitFor();
  },
};
const missing = wanted.filter(id => !cases[id]);
assert.deepEqual(missing, [], 'acceptance ids without a mapping');
const results = {};
try {
  for (const id of wanted) {
    try { await cases[id](); verified.add(id); results[id] = 'pass'; }
    catch (e) { results[id] = 'FAIL: ' + e.message.split('\n')[0]; }
  }
  // Embedded transport: ready, size, and return-focus with exact identity/token.
  const emb = await context.newPage(); watch(emb);
  for (const id of pilots) {
    await emb.goto(`${origin}${prefix}_harness.html?component=${id}`);
    await emb.waitForFunction(() => window.msgs.some(m => m.type === 'ready') && window.msgs.some(m => m.type === 'size'));
    const msgs = await emb.evaluate(() => window.msgs);
    for (const m of msgs) assert.deepEqual([m.version, m.framework, m.componentId, m.exampleId, m.token], [1, 'solid-next', id, 'default', 'abcdefghijklmnop0123']);
    const frame = emb.frameLocator('#f');
    await frame.getByRole('button', { name: '문서로 돌아가기' }).click();
    await emb.waitForFunction(() => window.msgs.some(m => m.type === 'return-focus'));
    assert.equal((await emb.evaluate(() => window.msgs)).some(m => m.type === 'error'), false);
    const need = definitions.demos.find(d => d.componentId === id).minHeight;
    const size = (await emb.evaluate(() => window.msgs)).filter(m => m.type === 'size').at(-1).height;
    assert.ok(size <= need, `${id} content ${size}px fits minHeight ${need}`);
    results[`embedded-${id}`] = 'pass';
    if (id === 'modal') await emb.screenshot({ path: resolve(evidence, 'embedded-modal.png') });
  }
  const bad = Object.entries(results).filter(([, v]) => v !== 'pass');
  assert.deepEqual({ bad, errors, external, failed }, { bad: [], errors: [], external: [], failed: [] });
  writeFileSync(resolve(evidence, 'results.json'), JSON.stringify({ passed: [...verified], results, errors, external, failed }, null, 2) + '\n');
  console.log(`Solid 2 native static final-prefix ${verified.size}/${wanted.length} acceptance passed; embedded transport 6/6`);
} catch (e) {
  console.error(JSON.stringify({ results, errors, external, failed }, null, 2));
  throw e;
} finally { await browser.close(); await new Promise(done => server.close(done)); }
