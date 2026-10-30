/** Normalize the frozen transformed KRDS graph without changing its keys or raw values. */
export function cssName(key) {
  return `--krds-${key.replace(/^(primitive|semantic)\./u, '').replace(/^(mode|responsive)-/u, '').replaceAll('.', '-')}`;
}
export function flattenTokens(source, path = [], result = {}) {
  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith('$')) continue;
    const next = [...path, key];
    if (value && typeof value === 'object' && 'value' in value) result[next.join('.')] = value;
    else if (value && typeof value === 'object') flattenTokens(value, next, result);
  }
  return result;
}
export function normalizeTokens(source) {
  const leaves = flattenTokens(source);
  const result = {};
  const names = new Map();
  function resolve(key, chain = []) {
    if (chain.includes(key)) throw new Error(`Token alias cycle: ${[...chain, key].join(' -> ')}`);
    if (result[key]) return result[key];
    const leaf = leaves[key];
    if (!leaf) throw new Error(`${chain.at(-1)}: missing token ${key}`);
    if (!['color', 'dimension', 'text'].includes(leaf.type) || typeof leaf.value !== 'string') throw new Error(`${key}: unsupported token type/value`);
    const references = [...leaf.value.matchAll(/\{([^{}]+)\}/gu)].map((match) => match[1]);
    if (/[{}]/u.test(leaf.value.replace(/\{[^{}]+\}/gu, ''))) throw new Error(`${key}: malformed alias`);
    const resolvedValue = leaf.value.replace(/\{([^{}]+)\}/gu, (_, ref) => {
      const target = resolve(ref, [...chain, key]);
      if (target.type !== leaf.type) throw new Error(`${key} (${leaf.type}) references ${ref} (${target.type}): type conflict`);
      return target.resolvedValue;
    });
    const name = cssName(key);
    if (names.has(name) && names.get(name) !== key) throw new Error(`CSS name collision: ${key} and ${names.get(name)} -> ${name}`);
    names.set(name, key);
    result[key] = { ...leaf, cssName: name, references, resolvedValue };
    return result[key];
  }
  for (const key of Object.keys(leaves)) resolve(key);
  return Object.fromEntries(Object.keys(leaves).map((key) => [key, result[key]]));
}
export function tokensCss(tokens) {
  return `/* Derived from KRDS kit 1.1.0; see package provenance and notices. */\n:root, :host {\n${Object.values(tokens).map((token) => `  ${token.cssName}: ${token.value.replace(/\{([^{}]+)\}/gu, (_, ref) => `var(${tokens[ref].cssName})`)};`).join('\n')}\n}\n`;
}
