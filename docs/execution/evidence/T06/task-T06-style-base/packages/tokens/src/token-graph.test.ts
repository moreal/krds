import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTokens } from './token-graph.mjs';
const token = (value: string, type = 'color') => ({ value, type });
test('rejects alias cycles with the complete reference chain', () => {
  assert.throws(() => normalizeTokens({ a: token('{b}'), b: token('{a}') }), /cycle: a -> b -> a/i);
});
test('rejects a missing alias target and identifies the referring key', () => {
  assert.throws(() => normalizeTokens({ a: token('{absent}') }), /a.*missing.*absent/i);
});
test('rejects conflicting alias types before CSS generation', () => {
  assert.throws(() => normalizeTokens({ a: token('{b}'), b: token('1rem', 'dimension') }), /a.*color.*b.*dimension/i);
});
test('preserves source values and aliases while resolving chained references', () => {
  const result = normalizeTokens({ primitive: { n: token('0.1rem', 'dimension') }, semantic: { gap: token('{primitive.n}', 'dimension'), next: token('{semantic.gap}', 'dimension') } });
  assert.equal(result['semantic.next'].value, '{semantic.gap}');
  assert.equal(result['semantic.next'].resolvedValue, '0.1rem');
  assert.deepEqual(result['semantic.next'].references, ['semantic.gap']);
});
test('rejects CSS output name collisions rather than overwriting tokens', () => {
  assert.throws(() => normalizeTokens({ primitive: { a: token('#fff') }, semantic: { a: token('#000') } }), /CSS name collision/i);
});
