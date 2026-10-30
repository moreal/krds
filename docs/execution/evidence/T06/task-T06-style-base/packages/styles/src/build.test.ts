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
test('all six part inventories match the pilot documents', () => {
  const contract = JSON.parse(read('./parts.json'));
  for (const [name, spec] of Object.entries(contract.components)) {
    const text = read(`../../../specs/components/${name}.md`);
    const line = text.match(/Parts: ([^\n]+)/u)?.[1]?.split(/[.;]/u)[0];
    const expected = [...(line ?? '').matchAll(/`([^`]+)`/gu)].map((match) => match[1]);
    assert.deepEqual(spec.parts, expected, name);
  }
});
