import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { validateCss, build } from '../scripts/build.mjs';
const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
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
      const line = text.match(/Parts: ([^\n]+)/u)?.[1]?.split(/[.;]/u)[0];
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
