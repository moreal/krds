// Native preview acceptance runner. Serves the final assembled tree under /krds/.
//   node tests/native-previews-browser.mjs                     # full gate (coverage enforced)
//   ... --framework react [--slice 1/4|button,modal] [--browser chromium|webkit]   # development filters
// Filters narrow development runs only; the unfiltered command enforces the complete matrix.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium, webkit } from '@playwright/test';
import { loadDefinitions } from '../../../tools/docs-previews/assemble.mjs';
import { parseArgs, coverage, planRows, verdict, VISUAL, pilots, pair } from './native-previews/plan.mjs';
import { serve } from './native-previews/server.mjs';
import { runRow, sha256 } from './native-previews/row.mjs';
import { shellProof } from './native-previews/shell.mjs';
import { captureVisual, captureText200 } from './native-previews/visual.mjs';

const site = resolve(import.meta.dirname, '..'), root = resolve(site, '../..'), dist = resolve(site, 'dist');
const evidence = resolve(site, 'test-results/native-previews');
await mkdir(evidence, { recursive: true });
const options = parseArgs(process.argv.slice(2));
const registryBytes = await readFile(resolve(dist, 'demo-registry.json'));
const registry = JSON.parse(registryBytes), registryHash = sha256(registryBytes);
const acceptanceDoc = JSON.parse(await readFile(resolve(site, 'demo-acceptance.json')));
const acceptance = new Map(acceptanceDoc.items.map(i => [i.acceptanceId, i]));
const definitions = loadDefinitions({ root });
const label = options.filtered ? `-${[options.frameworks.join('+') || 'all', options.slice ? (options.slice.kind === 'shard' ? `${options.slice.index}of${options.slice.total}` : options.slice.components.join('+')) : null].filter(Boolean).join('-')}` : '';
const resultPath = resolve(evidence, `results-${options.browser}${label}.json`);
const report = { schemaVersion: 1, browser: options.browser, filters: { frameworks: options.frameworks, slice: options.slice }, filtered: options.filtered, registrySha256: registryHash, startedAt: new Date().toISOString() };
const finish = async (status, extra) => { Object.assign(report, extra, { status, finishedAt: new Date().toISOString() }); await writeFile(resultPath, JSON.stringify(report, null, 2) + '\n'); };

const { problems: coverageProblems, selected } = coverage({ registry, definitions, acceptance: acceptanceDoc, options });
if (coverageProblems.length) {
  await finish('failed', { coverageProblems });
  console.error(`Coverage failed (${coverageProblems.length}):\n  ${coverageProblems.slice(0, 40).join('\n  ')}${coverageProblems.length > 40 ? '\n  …' : ''}`);
  process.exit(1);
}
const manifests = new Map();
for (const framework of [...new Set(registry.filter(r => r.status === 'playable').map(r => r.framework))]) {
  const bytes = await readFile(resolve(dist, 'previews', framework, 'artifact-manifest.json'));
  manifests.set(framework, { ...JSON.parse(bytes), sha256: sha256(bytes) });
}
const planned = planRows({ registry, options });
if (!planned.length) { await finish('failed', { coverageProblems: ['empty suite: no planned rows'] }); console.error('Empty suite: no planned rows'); process.exit(1); }

const server = await serve(dist);
const browserName = options.browser;
const browser = await (browserName === 'webkit' ? webkit : chromium).launch({ headless: true });
const results = [], shell = [], visual = [], text200 = [];
try {
  // Shell/frame-boundary proof (incl. 320 px and 200 % text) for every selected framework with a playable Button/Accordion.
  for (const framework of selected) {
    if (options.slice) break;
    if (!['button', 'accordion'].every(id => registry.some(r => r.framework === framework && r.componentId === id && r.status === 'playable'))) continue;
    const proof = await shellProof({ browser, browserName, origin: server.origin, framework, registry, evidence });
    shell.push(proof);
    console.log(`[shell ${browserName}/${framework}] ${proof.status}${proof.error ? ': ' + proof.error : ''}`);
    for (const line of proof.lines) console.log(`  ${line}`);
  }
  // Matrix rows, bounded parallelism; each row has its own context.
  const workers = Math.max(1, Number(process.env.NATIVE_PREVIEWS_WORKERS ?? 4));
  let next = 0;
  await Promise.all(Array.from({ length: workers }, async () => {
    while (next < planned.length) {
      const { entry, reasons } = planned[next++];
      const row = await runRow({ browser, browserName, origin: server.origin, entry, manifest: manifests.get(entry.framework), registryHash, acceptance, evidence, site, reasons, clipboard: browserName === 'chromium' });
      results.push(row);
      console.log(`${row.status === 'passed' ? 'ok  ' : 'FAIL'} ${pair(entry)} (${reasons.join(',')}) ${row.status === 'passed' ? '' : row.error}`);
    }
  }));
  // Visual audit captures: every framework at least once (Chromium: all selected; WebKit: Solid 2 pilots + React set).
  if (!options.slice) for (const framework of selected) {
    const ids = framework === 'solid-next' ? VISUAL.filter(id => pilots.includes(id)) : VISUAL;
    for (const id of ids) {
      const entry = registry.find(r => r.framework === framework && r.componentId === id && r.exampleId === 'default' && r.status === 'playable');
      if (!entry) continue;
      const v = await captureVisual({ browser, browserName, origin: server.origin, entry, evidence, site, acceptance });
      visual.push(v);
      if (v.status !== 'passed') console.log(`FAIL visual ${pair(entry)}: ${v.error}`);
    }
  }
  // Extra audit captures: TutorialPanel overview/task view in one framework, and the docs page at 200 % text / 1280 px.
  if (!options.slice) {
    const first = selected.find(f => f !== 'solid-next' && registry.some(r => r.framework === f && r.componentId === 'tutorial-panel' && r.status === 'playable'));
    // TutorialPanel overview/task view (React, Solid) and Vue Resize expanded, in addition to the audit set.
    for (const [fw, id] of [['react', 'tutorial-panel'], ['solid', 'tutorial-panel'], ['vue', 'resize']].filter(([f]) => selected.includes(f))) {
      const e = registry.find(r => r.framework === fw && r.componentId === id && r.exampleId === 'default' && r.status === 'playable'); if (!e) continue;
      const v = await captureVisual({ browser, browserName, origin: server.origin, entry: e, evidence, site, acceptance }); visual.push(v); if (v.status !== 'passed') console.log(`FAIL visual ${pair(v)}: ${v.error}`);
    }
    // BottomSheet open state (run-1 backdrop stacking finding) in Solid, Qwik and Svelte.
    for (const fw of ['solid', 'qwik', 'svelte'].filter(f => selected.includes(f))) { const e = registry.find(r => r.framework === fw && r.componentId === 'bottom-sheet' && r.exampleId === 'default' && r.status === 'playable'); if (!e) continue; const v = await captureVisual({ browser, browserName, origin: server.origin, entry: e, evidence, site, acceptance }); visual.push(v); if (v.status !== 'passed') console.log(`FAIL visual ${pair(v)}: ${v.error}`); }
    for (const id of ['button', 'accordion']) if (first) { const t = await captureText200({ browser, browserName, origin: server.origin, framework: first, componentId: id, evidence, site }); text200.push(t); console.log(`[text-200 ${first}/${id}] page overflow ${t.pageOverflowPx}px ${JSON.stringify(t.overflowing ?? [])}`); }
  }
} finally { await browser.close(); await server.close(); }

results.sort((a, b) => pair(a).localeCompare(pair(b)));
const problems = [...verdict(planned, results), ...shell.filter(s => s.status !== 'passed').map(s => `shell ${s.framework}: ${s.error}`), ...visual.filter(v => v.status !== 'passed').map(v => `visual ${pair(v)}: ${v.error}`)];
if (!options.slice && !shell.length) problems.push('no shell proof ran');
const passed = results.filter(r => r.status === 'passed').length;
const summary = { planned: planned.length, passed, failed: results.length - passed, playable: results.filter(r => r.entryStatus === 'playable').length, unavailable: results.filter(r => r.entryStatus === 'unavailable').length, interactive: results.filter(r => r.classification === 'interactive' && r.status === 'passed').length, static: results.filter(r => r.classification === 'static' && r.status === 'passed').length, shellPassed: shell.filter(s => s.status === 'passed').length, shell: shell.length, visualPassed: visual.filter(v => v.status === 'passed').length, visual: visual.length };
await finish(problems.length ? 'failed' : 'passed', { summary, problems, shell, visual, text200, results });
console.log(`\n${browserName}${label}: ${passed}/${planned.length} rows passed (${summary.interactive} interactive, ${summary.static} static, ${summary.unavailable} unavailable); shell ${summary.shellPassed}/${summary.shell}; visual ${summary.visualPassed}/${summary.visual}. Results: ${resultPath}`);
if (problems.length) { console.error(`\n${problems.length} problem(s):\n  ${problems.join('\n  ')}`); process.exit(1); }
