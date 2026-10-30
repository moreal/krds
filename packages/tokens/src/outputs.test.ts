import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { flattenTokens, normalizeTokens, tokensCss } from './token-graph.mjs';
const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const tokens = normalizeTokens(JSON.parse(read('../../../upstream/krds/raw/kit/tokens/transformed_tokens.json')));
test('all 768 source leaves retain exact raw values, aliases and types', () => {
  const source = flattenTokens(JSON.parse(read('../../../upstream/krds/raw/kit/tokens/transformed_tokens.json')));
  const outputs = JSON.parse(read('../dist/tokens.json'));
  assert.equal(Object.keys(source).length, 768);
  for (const [key, value] of Object.entries(source)) {
    assert.equal(outputs[key].value, value.value, key);
    assert.equal(outputs[key].type, value.type, key);
  }
  assert.deepEqual(outputs, tokens);
});
test('each original Figma key and transformed key has a reversible output mapping', () => {
  const figma = flattenTokens(JSON.parse(read('../../../upstream/krds/raw/kit/tokens/figma_token.json')));
  const map = JSON.parse(read('./source-map.json')).mappings;
  assert.equal(map.length, 768);
  assert.equal(new Set(map.map((x) => x.cssName)).size, 768);
  for (const entry of map) {
    assert.equal(figma[entry.figmaKey].value, entry.figmaValue);
    assert.equal(tokens[entry.sourceKey].value, entry.sourceValue);
  }
});
test('CSS matches every frozen official declaration including alias targets', () => {
  const declarations = (css: string) => Object.fromEntries([...css.matchAll(/(--krds-[\w-]+):\s*([^;]+);/gu)].map((m) => [m[1], m[2]]));
  const official = declarations(read('../../../upstream/krds/raw/kit/resources/css/token/krds_tokens.css'));
  assert.deepEqual(declarations(read('../dist/tokens.css')), official);
  assert.equal(read('../dist/tokens.css'), tokensCss(tokens));
});
test('every package export points to an existing output', () => {
  const pkg = JSON.parse(read('../package.json'));
  for (const value of Object.values(pkg.exports)) for (const path of typeof value === 'string' ? [value] : Object.values(value)) assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), String(path));
});
test('distributed derivatives retain preserved originals and explicit provenance paths', async () => {
  const { createHash } = await import('node:crypto');
  const entries = JSON.parse(read('../../../compliance/provenance.json'));
  for (const id of ['krds-resource-tokens-figma_token.json', 'krds-resource-tokens-transformed_tokens.json', 'krds-resource-resources-css-token-krds_tokens.css']) {
    const entry = entries.find((item) => item.id === id);
    assert.equal(entry.modified, true, id);
    assert.ok(entry.localPaths[0].startsWith('upstream/krds/raw/kit/'));
    assert.equal(createHash('sha256').update(read(`../../../${entry.localPaths[0]}`)).digest('hex'), entry.sha256);
    assert.ok(entry.distributedIn.includes('@unofficial-krds/tokens'), id);
    assert.ok(entry.localPaths.includes('packages/tokens/dist/tokens.css') || entry.localPaths.includes('packages/tokens/dist/source-map.json'), id);
    assert.ok(entry.localPaths.every((path) => !/[?*]/u.test(path)), id);
  }
});
