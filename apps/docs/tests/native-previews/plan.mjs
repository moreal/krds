// Pure planning for the native preview acceptance runner. No browser here, so the
// coverage rules are unit-testable. Filters narrow development runs only; an
// unfiltered run enforces the complete promised matrix and never passes empty.
export const frameworks = ['react', 'solid', 'svelte', 'vue', 'angular', 'lit', 'qwik', 'solid-next'];
export const stable = frameworks.filter(f => f !== 'solid-next');
export const pilots = ['button', 'tabs', 'native-select', 'modal', 'date-input', 'calendar'];
export const browsers = ['chromium', 'webkit'];
export const FORMS = ['text-input', 'textarea', 'native-select', 'radio-group', 'checkbox', 'switch', 'range-slider', 'quantity-toggle', 'date-input', 'calendar', 'tag', 'file-upload'];
export const OVERLAY = ['accordion', 'disclosure', 'tabs', 'modal', 'bottom-sheet', 'help-panel', 'tooltip', 'tutorial-panel', 'toast', 'snackbar'];
// First-interaction QRL categories: click, input, change, dialog/keyboard, draft+commit, File.
export const QWIK_QRL = ['button', 'text-input', 'native-select', 'modal', 'calendar', 'file-upload'];
// Final visual audit set (spec Task 7): Button, Accordion, Input, Select, Modal, Tabs,
// Calendar, FileUpload, one navigation and one static-media example.
export const VISUAL = ['button', 'accordion', 'text-input', 'native-select', 'modal', 'tabs', 'calendar', 'file-upload', 'pagination', 'image'];
export const STABLE_DEFAULTS = 378, PILOT_DEFAULTS = 6, UNAVAILABLE = 48, FAMILIES = 54;

const pair = d => `${d.framework}/${d.componentId}/${d.exampleId}`;

export function parseArgs(argv) {
  const out = { frameworks: [], slice: null, browser: 'chromium', filtered: false };
  for (let i = 0; i < argv.length; i++) {
    const [flag, inline] = argv[i].split(/=(.*)/s);
    const value = () => { const v = inline ?? argv[++i]; if (!v || v.startsWith('--')) throw new Error(`${flag} needs a value`); return v; };
    if (flag === '--framework') { for (const f of value().split(',')) { if (!frameworks.includes(f)) throw new Error(`Unknown framework ${f}`); out.frameworks.push(f); } }
    else if (flag === '--slice') out.slice = parseSlice(value());
    else if (flag === '--browser') { out.browser = value(); if (!browsers.includes(out.browser)) throw new Error(`Unknown browser ${out.browser}`); }
    else if (flag === '--') continue;
    else throw new Error(`Unknown argument ${argv[i]}`);
  }
  out.filtered = out.frameworks.length > 0 || out.slice !== null;
  return out;
}
/** `--slice 2/8` (1-based shard) or `--slice button,modal` (component IDs). */
export function parseSlice(text) {
  const shard = /^(\d+)\/(\d+)$/.exec(text);
  if (shard) { const index = Number(shard[1]), total = Number(shard[2]); if (index < 1 || index > total) throw new Error(`Invalid shard ${text}`); return { kind: 'shard', index, total }; }
  const components = text.split(',');
  if (components.some(c => !/^[a-z][a-z0-9-]*$/.test(c))) throw new Error(`Invalid slice ${text}`);
  return { kind: 'components', components };
}
function sliceKeep(slice, componentId, index) {
  if (!slice) return true;
  if (slice.kind === 'components') return slice.components.includes(componentId);
  return index % slice.total === slice.index - 1;
}

/**
 * Promised pairs come from the authoring definitions; the registry must hold every
 * one with the same status. Returns the coverage verdict and the selected rows.
 */
export function coverage({ registry, definitions, acceptance, options }) {
  const problems = [];
  const families = acceptance.items.map(i => i.componentId);
  const accept = new Map(acceptance.items.map(i => [i.acceptanceId, i]));
  if (families.length !== FAMILIES || new Set(families).size !== FAMILIES) problems.push(`acceptance inventory must hold ${FAMILIES} families, found ${families.length}`);
  const selected = options.frameworks.length ? options.frameworks : frameworks;
  const promised = definitions.demos.filter(d => selected.includes(d.framework));
  const byPair = new Map(registry.map(r => [pair(r), r]));
  for (const d of promised) {
    const r = byPair.get(pair(d));
    if (!r) problems.push(`missing promised pair ${pair(d)}`);
    else if (r.status !== d.status) problems.push(`status differs for ${pair(d)}: ${r.status} != ${d.status}`);
  }
  for (const r of registry) {
    if (!selected.includes(r.framework)) continue;
    if (!promised.some(d => pair(d) === pair(r))) problems.push(`registry row is not promised: ${pair(r)}`);
    if (r.status === 'playable') {
      const item = accept.get(r.acceptanceId);
      if (!item || item.componentId !== r.componentId || item.classification !== r.classification) problems.push(`acceptance mismatch ${pair(r)} -> ${r.acceptanceId}`);
    }
  }
  // Each selected framework must promise its full family set: stable 54 defaults, Solid 2 six pilots + 48 unavailable.
  for (const framework of selected) {
    const defaults = registry.filter(r => r.framework === framework && r.exampleId === 'default');
    const playable = defaults.filter(r => r.status === 'playable').map(r => r.componentId);
    const unavailable = defaults.filter(r => r.status === 'unavailable').map(r => r.componentId);
    const wantPlayable = framework === 'solid-next' ? pilots : families;
    for (const id of wantPlayable) if (!playable.includes(id)) problems.push(`missing playable default ${framework}/${id}`);
    if (framework === 'solid-next') for (const id of families.filter(f => !pilots.includes(f))) if (!unavailable.includes(id)) problems.push(`missing unavailable Solid 2 row ${id}`);
  }
  if (!options.frameworks.length) {
    const playableDefaults = registry.filter(r => r.status === 'playable' && r.exampleId === 'default');
    const stableCount = playableDefaults.filter(r => r.framework !== 'solid-next').length;
    const pilotCount = playableDefaults.filter(r => r.framework === 'solid-next').length;
    const unavailableCount = registry.filter(r => r.status === 'unavailable').length;
    if (stableCount !== STABLE_DEFAULTS) problems.push(`expected ${STABLE_DEFAULTS} stable playable defaults, found ${stableCount}`);
    if (pilotCount !== PILOT_DEFAULTS) problems.push(`expected ${PILOT_DEFAULTS} Solid 2 playable pilots, found ${pilotCount}`);
    if (unavailableCount !== UNAVAILABLE) problems.push(`expected ${UNAVAILABLE} unavailable Solid 2 rows, found ${unavailableCount}`);
  }
  return { problems, selected };
}

/** Rows for one browser. Chromium: every playable + unavailable row. WebKit: rotation + breadth. */
export function planRows({ registry, options }) {
  const selected = options.frameworks.length ? options.frameworks : frameworks;
  const inScope = registry.filter(r => selected.includes(r.framework));
  const families = [...new Set(registry.map(r => r.componentId))].sort();
  const familyIndex = id => families.indexOf(id);
  let rows;
  if (options.browser === 'chromium') rows = inScope.map(r => ({ entry: r, reasons: ['chromium-matrix'] }));
  else {
    const reasons = new Map();
    const add = (r, why) => { if (!r) return; const k = pair(r); if (!reasons.has(k)) reasons.set(k, { entry: r, reasons: [] }); reasons.get(k).reasons.push(why); };
    const stableSelected = stable.filter(f => selected.includes(f));
    // Rotate stable frameworks across the families; fall back to the next one that has a playable row.
    families.forEach((id, i) => {
      for (let k = 0; k < stableSelected.length; k++) {
        const fw = stableSelected[(i + k) % stableSelected.length];
        const r = inScope.find(x => x.framework === fw && x.componentId === id && x.exampleId === 'default' && x.status === 'playable');
        if (r) { add(r, 'webkit-rotation'); break; }
      }
    });
    for (const fw of selected) {
      const want = fw === 'solid-next' ? pilots : [...FORMS, ...OVERLAY, ...(fw === 'qwik' ? QWIK_QRL : [])];
      for (const id of want) add(inScope.find(x => x.framework === fw && x.componentId === id && x.exampleId === 'default' && x.status === 'playable'), fw === 'solid-next' ? 'solid2-pilot' : FORMS.includes(id) ? 'forms' : OVERLAY.includes(id) ? 'overlay' : 'qwik-qrl');
      // One unavailable Solid 2 row proves no frame/runtime is loaded in WebKit too.
      if (fw === 'solid-next') add(inScope.find(x => x.framework === fw && x.status === 'unavailable'), 'solid2-unavailable');
    }
    rows = [...reasons.values()];
  }
  rows = rows.filter(row => sliceKeep(options.slice, row.entry.componentId, familyIndex(row.entry.componentId)));
  rows.sort((a, b) => pair(a.entry).localeCompare(pair(b.entry)));
  return rows;
}

/** After running: every planned row has exactly one passing result; nothing empty. */
export function verdict(planned, results) {
  const problems = [];
  if (!planned.length) problems.push('empty suite: no planned rows');
  const seen = new Map();
  for (const r of results) { const k = `${r.framework}/${r.componentId}/${r.exampleId}`; if (seen.has(k)) problems.push(`duplicate result ${k}`); seen.set(k, r); }
  for (const row of planned) {
    const k = pair(row.entry), r = seen.get(k);
    if (!r) problems.push(`no result for planned row ${k}`);
    else if (r.status !== 'passed') problems.push(`failed ${k}: ${r.error}`);
  }
  for (const k of seen.keys()) if (!planned.some(row => pair(row.entry) === k)) problems.push(`unplanned result ${k}`);
  return problems;
}
export { pair };
