import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { validateCss, build } from '../scripts/build.mjs';
import postcss from 'postcss';
const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
test('modal close is a sized themed control without a base reset dependency', () => {
  const css = read('./components/modal.css');
  const selector = '[data-krds-component="modal"][data-krds-part="close"]';
  const rules = postcss.parse(css);
  const control = rules.nodes.find(node => node.type === 'rule' && node.selector === selector);
  assert.ok(control && control.type === 'rule');
  const declarations = Object.fromEntries(control.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value]));
  assert.equal(declarations['min-inline-size'], 'var(--krds-size-height-7)');
  assert.equal(declarations['min-block-size'], 'var(--krds-size-height-7)');
  assert.equal(declarations.background, 'var(--krds-light-color-button-secondary-fill)');
  assert.equal(declarations.color, 'var(--krds-light-color-text-primary)');
  assert.equal(declarations.font, 'inherit');
  assert.ok(declarations.border && declarations.padding && declarations['border-radius']);
  // Frozen component.css 1818-1823 (.btn-close absolute at the modal-content top-right, gap-7 inset; mobile gap-6, 1934-1937): DOM order stays after actions.
  assert.equal(declarations.position, 'absolute');
  assert.equal(declarations['inset-block-start'], 'var(--krds-gap-7)');
  assert.equal(declarations['inset-inline-end'], 'var(--krds-gap-7)');
  assert.equal(declarations['margin-inline-start'], undefined);
  assert.equal(declarations['margin-block-start'], undefined);
  const content = rules.nodes.find(node => node.type === 'rule' && node.selector === '[data-krds-component="modal"][data-krds-part="content"]');
  assert.ok(content && content.type === 'rule');
  const contentDecls = Object.fromEntries(content.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value]));
  assert.match(contentDecls.position, /^(fixed|relative|absolute)$/u, 'content is the positioned containing block of the close');
  assert.match(contentDecls['padding-block-start'] ?? '', /var\(--krds-gap-7\).*var\(--krds-size-height-7\)/u, 'content reserves the close row so the title never underlaps it');
  const narrow = rules.nodes.find(node => node.type === 'atrule' && node.params === '(max-width: 30rem)');
  assert.ok(narrow && narrow.type === 'atrule');
  const narrowText = narrow.toString();
  assert.match(narrowText, /\[data-krds-part="close"\]\s*\{[^}]*inset-block-start: var\(--krds-gap-6\)[^}]*inset-inline-end: var\(--krds-gap-6\)/u);
  assert.match(narrowText, /\[data-krds-part="content"\]\s*\{[^}]*padding-block-start: calc\(var\(--krds-gap-6\)[^}]*size-height-7/u);
  // The Modal-hosted BottomSheet surface resets the whole padding (it renders no Modal close), so the close-row reservation never applies to the sheet.
  const sheet = postcss.parse(read('./components/bottom-sheet.css')).nodes.find(node => node.type === 'rule' && node.selector.startsWith('[data-krds-component="modal"][data-krds-part="content"]:has('));
  assert.ok(sheet && sheet.type === 'rule');
  assert.ok(sheet.nodes.some(node => node.type === 'decl' && node.prop === 'padding'));
  assert.doesNotMatch(css, /font-size:\s*0|text-indent|overflow:\s*hidden/u);
  assert.ok(rules.nodes.some(node => node.type === 'rule' && node.selector === `${selector}:not(:disabled):hover`));
  assert.ok(rules.nodes.some(node => node.type === 'rule' && node.selector === `${selector}:not(:disabled):active`));
  assert.match(read('./base.css'), /\[data-krds-component\]:focus-visible\s*\{[^}]*outline:/u);
  assert.match(read('./base.css'), /outline-color: Highlight/u);
  const forced = rules.nodes.find(node => node.type === 'atrule' && node.params === '(forced-colors: active)');
  assert.ok(forced?.toString().includes('ButtonText'));
});
test('calendar actions and date input trigger have themed native control states', () => {
  for (const name of ['calendar', 'date-input']) {
    const css = read(`./components/${name}.css`);
    const ast = postcss.parse(css);
    const part = name === 'calendar' ? '[data-krds-part="previous"]' : '[data-krds-part="trigger"]';
    const rule = ast.nodes.find(node => node.type === 'rule' && node.selector.includes(part) && !node.selector.includes(':not') && !node.selector.includes('~='));
    assert.ok(rule && rule.type === 'rule');
    const declarations = Object.fromEntries(rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value]));
    assert.equal(declarations.background, 'var(--krds-light-color-button-secondary-fill)', name);
    assert.equal(declarations.color, 'var(--krds-light-color-text-primary)', name);
    assert.ok(declarations.border && declarations['border-radius'] && declarations.font, name);
    assert.match(css, /:not\(:disabled\):hover/u);
    assert.match(css, /:not\(:disabled\):active/u);
    assert.match(css, /button-disabled-fill/u);
    assert.match(css, /ButtonText/u);
  }
  assert.match(read('./components/calendar.css'), /\[data-krds-part="confirm"\]\s*\{[^}]*background: var\(--krds-light-color-button-primary-fill\)/u);
});
test('tutorial panel close, back and stop share the themed secondary button look', () => {
  const css = read('./components/tutorial-panel.css');
  const rule = postcss.parse(css).nodes.find(node => node.type === 'rule' && ['close', 'back', 'stop'].every(part => node.selector.includes(`[data-krds-part="${part}"]`)));
  assert.ok(rule && rule.type === 'rule');
  const declarations = Object.fromEntries(rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value]));
  assert.equal(declarations.background, 'var(--krds-light-color-button-secondary-fill)');
  assert.equal(declarations.color, 'var(--krds-light-color-text-primary)');
  assert.equal(declarations['min-block-size'], 'var(--krds-size-height-6)');
  assert.ok(declarations.border && declarations['border-radius'] && declarations.font);
  // Each state rule must name all three parts itself; the tab/start/task-toggle rules already use these tokens, so a file-wide match would not prove the new rules.
  const ast = postcss.parse(css);
  const parts = ['close', 'back', 'stop'];
  const stateRule = suffix => ast.nodes.find(node => node.type === 'rule' && parts.every(part => node.selector.includes(`[data-krds-part="${part}"]${suffix}`)));
  const declarationsOf = node => Object.fromEntries(node.nodes.filter(child => child.type === 'decl').map(child => [child.prop, child.value]));
  assert.equal(declarationsOf(stateRule(':not(:disabled):hover')).background, 'var(--krds-light-color-button-secondary-fill-hover)');
  assert.equal(declarationsOf(stateRule(':not(:disabled):active')).background, 'var(--krds-light-color-button-secondary-fill-pressed)');
  assert.equal(declarationsOf(stateRule(':disabled')).background, 'var(--krds-light-color-button-disabled-fill)');
  const forced = ast.nodes.find(node => node.type === 'atrule' && node.params === '(forced-colors: active)' && node.nodes.some(child => child.type === 'rule' && parts.every(part => child.selector.includes(`[data-krds-part="${part}"]`)) && child.toString().includes('ButtonText')));
  assert.ok(forced, 'forced colors give close, back and stop a ButtonText border');
});
test('unknown token references fail the build with the file name', () => {
  assert.throws(() => validateCss('[data-krds-component="button"][data-krds-part="root"] { color: var(--krds-does-not-exist); }', 'button.css', new Set()), /button.css.*unknown.*--krds-does-not-exist/i);
});
test('invalid public parts are rejected', () => {
  assert.throws(() => validateCss('[data-krds-component="button"][data-krds-part="typo"] { color: red; }', 'button.css', new Set()), /button.*unknown.*part.*typo/i);
});
test('malformed CSS fails actual parsing', () => {
  assert.throws(() => validateCss('a { color: red;', 'broken.css', new Set()), /unclosed block/i);
});
test('each CSS string is byte-identical to its ordinary generated CSS', async () => {
  const result = await build();
  const strings = await import(`../dist/lit.js?test=${Date.now()}`);
  for (const [name, css] of Object.entries(result)) assert.equal(strings.styles[name], css, name);
  assert.equal(strings.styles.button, read('../dist/button.css'));
  assert.doesNotMatch(read('../dist/lit.js'), /from ['"]lit|@import/u);
});
test('exports exist and default CSS never opts into reset or fonts', () => {
  const pkg = JSON.parse(read('../package.json'));
  for (const value of Object.values(pkg.exports)) for (const path of typeof value === 'string' ? [value] : Object.values(value)) assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), String(path));
  const all = read('../dist/all.css');
  assert.doesNotMatch(all, /@font-face|font-family:.*Pretendard|62\.5%/u);
  assert.doesNotMatch(all, /https?:|url\(/u);
});
test('a valid state on the wrong part is rejected', () => {
  assert.throws(() => validateCss('[data-krds-component="tabs"][data-krds-part="panel"][data-krds-state~="selected"] { color: red; }', 'tabs.css', new Set()), /panel.*selected/i);
});
test('variant misspellings cannot silently ship an unstyled branch', () => {
  assert.throws(() => validateCss('[data-krds-component="button"][data-krds-variant="primray"] { color: red; }', 'button.css', new Set()), /unknown.*variant.*primray/i);
});
test('pilot parts and all 48 accepted shared contracts stay in sync', () => {
  const contract = JSON.parse(read('./parts.json'));
  const source = read('../../contracts/src/full-catalog.ts');
  const definitions = JSON.parse(source.match(/export const fullCatalogDefinitions = ([\s\S]*?) as const;/u)![1]);
  const presentation = JSON.parse(source.match(/export const fullCatalogPresentation = ([\s\S]*?) as const;/u)![1]);
  const states = JSON.parse(source.match(/export const fullCatalogPartStates = ([\s\S]*?) as const;/u)![1]);
  assert.equal(Object.keys(contract.components).length, 54);
  assert.equal(Object.keys(definitions).length, 48);
  for (const [name, spec] of Object.entries(contract.components) as [string, {parts: string[]; states: object; presentation?: object}][]) {
    if (definitions[name]) {
      assert.deepEqual(spec.parts, definitions[name].parts, name);
      assert.deepEqual(spec.states, states[name], name);
      assert.deepEqual(spec.presentation, presentation[name] ?? {}, name);
    } else {
      const text = read(`../../../specs/components/${name}.md`);
      // Specs are written in Korean (파트:) since 2026-11-07; the English label is kept for historical snapshots.
      const line = text.match(/(?:Parts|파트): ([^\n]+)/u)?.[1]?.split(/[.;]/u)[0];
      const expected = [...(line ?? '').matchAll(/`([^`]+)`/gu)].map((match) => match[1]);
      assert.deepEqual(spec.parts, expected, name);
    }
  }
});
test('shadow styles inherit token defaults without injecting host or root declarations', async () => {
  const strings = await import(`../dist/lit.js?shadow=${Date.now()}`);
  const parts = JSON.parse(read('./parts.json'));
  assert.deepEqual(Object.keys(strings.shadowStyles).sort(), ['all', 'base', ...Object.keys(parts.components)].sort());
  for (const [name, css] of Object.entries(strings.shadowStyles)) {
    assert.doesNotMatch(css as string, /:root|:host|@font-face|62\.5%|@import/u, name);
    assert.doesNotMatch(css as string, /--krds-light-color-button-primary-fill\s*:/u, name);
  }
  assert.equal(strings.shadowStyles.base, read('./base.css'));
  for (const name of Object.keys(parts.components)) assert.equal(strings.shadowStyles[name], read(`./components/${name}.css`), name);
  assert.match(strings.shadowStyles.button, /var\(--krds-light-color-button-primary-fill\)/u);
});

test('new part-state ownership cannot leak between controls and static text', () => {
  assert.throws(() => validateCss('[data-krds-component="checkbox"][data-krds-part="label"][data-krds-state~="mixed"] { color: red; }', 'checkbox.css', new Set()), /label.*mixed/u);
  assert.throws(() => validateCss('[data-krds-component="file-upload"][data-krds-part="filename"][data-krds-state~="uploading"] { color: red; }', 'file-upload.css', new Set()), /filename.*uploading/u);
  assert.doesNotThrow(() => validateCss('[data-krds-component="checkbox"][data-krds-part="root"][data-krds-state~="mixed"] [data-krds-component="checkbox"][data-krds-part="label"] { color: red; }', 'checkbox.css', new Set()));
});
test('orthogonal presentation axes reject invented official styles', () => {
  assert.throws(() => validateCss('[data-krds-component="badge"][data-krds-part="root"][data-krds-tone="primary"] { color: red; }', 'badge.css', new Set()), /unknown tone primary/u);
  assert.throws(() => validateCss('[data-krds-component="critical-alert"][data-krds-part="root"][data-krds-variant="safe"] { color: red; }', 'critical-alert.css', new Set()), /unknown presentation axis variant/u);
  assert.throws(() => validateCss('[data-krds-component="header"][data-krds-part="root"][data-krds-action-layout="vertcial"] { color: red; }', 'header.css', new Set()), /unknown action-layout vertcial/u);
});
test('54 standalone outputs embed exactly 768 frozen token declarations once', () => {
  const parts = JSON.parse(read('./parts.json'));
  const tokenCss = read('../../tokens/dist/tokens.css');
  const tokenDeclarations = [...tokenCss.matchAll(/(--[\w-]+): ([^;]+);/gu)];
  assert.equal(tokenDeclarations.length, 768);
  for (const name of ['all', ...Object.keys(parts.components)]) {
    const css = read(`../dist/${name}.css`);
    assert.ok(css.startsWith(tokenCss), name);
    assert.equal(css.indexOf(tokenCss, 1), -1, name);
  }
});
test('public strings, shadow strings and all.css preserve actual component output bytes', async () => {
  const strings = await import(`../dist/lit.js?catalog=${Date.now()}`);
  const parts = JSON.parse(read('./parts.json'));
  const all = read('../dist/all.css');
  for (const name of Object.keys(parts.components)) {
    const raw = read(`./components/${name}.css`);
    assert.equal(strings.styles[name], read(`../dist/${name}.css`), name);
    assert.equal(strings.shadowStyles[name], raw, name);
    assert.ok(all.includes(raw), name);
    assert.ok(strings.shadowStyles.all.includes(raw), name);
  }
});
test('remote assets and whole-state matches fail instead of silently shipping', () => {
  assert.throws(() => validateCss('a { background-image: url(example.svg); }', 'remote.css', new Set()), /assets require/u);
  assert.throws(() => validateCss('@import \"https://example.invalid/styles.css\";', 'import.css', new Set()), /imports require/u);
  assert.throws(() => validateCss('[data-krds-component="toast"][data-krds-part="root"][data-krds-state="open"] { color: red; }', 'toast.css', new Set()), /token membership/u);
});

test('Carousel stop-intent is an inhibited-intent control with bounded part states', () => {
  assert.doesNotThrow(() => validateCss('[data-krds-component="carousel"][data-krds-part="stop-intent"][data-krds-state~="paused"][data-krds-state~="disabled"] { color: red; }', 'carousel.css', new Set()));
  assert.throws(() => validateCss('[data-krds-component="carousel"][data-krds-part="stop-intent"][data-krds-state~="playing"] { color: red; }', 'carousel.css', new Set()), /stop-intent.*playing/u);
});
test('tutorial panel root is viewport-bounded with an inner scrolling region and a reachable stop control', () => {
  const css = read('./components/tutorial-panel.css');
  const ast = postcss.parse(css);
  const decls = (selector: string) => { const rule = ast.nodes.find(node => node.type === 'rule' && node.selector === selector); assert.ok(rule && rule.type === 'rule', selector); return Object.fromEntries(rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value])); };
  const rootSel = '[data-krds-component="tutorial-panel"][data-krds-part="root"]';
  const root = decls(rootSel);
  assert.equal(root.display, 'flex');
  assert.equal(root['flex-direction'], 'column');
  assert.equal(root['max-block-size'], '100dvh');
  assert.equal(decls(`dialog${rootSel}`)['max-block-size'], '100dvh', 'native dialog roots stay viewport-bounded');
  const region = decls(`${rootSel} > :not([data-krds-part="header"], [data-krds-part="tabs"], [data-krds-part="stop"])`);
  assert.equal(region['min-block-size'], '0');
  assert.equal(region['overflow-y'], 'auto');
  assert.equal(region['overscroll-behavior'], 'contain');
  assert.match(region.flex, /^1 1 /u);
  assert.match(region.background ?? '', /local/u, 'scroll shadows show that more content is available');
  const fixedRows = decls(`${rootSel} > :is([data-krds-part="header"], [data-krds-part="tabs"], [data-krds-part="stop"])`);
  assert.equal(fixedRows.flex, 'none');
  assert.match(css, /@media \(max-height: 36rem\)\s*\{[^@]*\[data-krds-part="stop"\]\s*\{[^}]*position: sticky; inset-block-end: 0/u, 'short viewports keep the stop control reachable');
  assert.match(css, /@media \(forced-colors: active\)\s*\{[^@]*:not\(\[data-krds-part="header"\][^}]*background: none/u);
});
test('tutorial panel provenance says the header reserves the top row and anchors the close', () => {
  const summary = (JSON.parse(read('../provenance.json')) as { changeSummary?: string }[]).map(entry => entry.changeSummary ?? '').join(' ');
  assert.doesNotMatch(summary, /close control sits absolutely in a reserved top row of the panel/u);
  assert.match(summary, /the header reserves the top row and the close is absolutely positioned within the header/u);
});
