// Regenerates source bindings in definitions.json from the live source files, so hashes and line spans never go stale by hand.
// Each example symbol gets one exact UTF-8 byte range (plus one range per shared helper it cannot be read without);
// every definition also binds entry.ssr.tsx (symbol `render`) as a host source.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('.', import.meta.url));
const definitionsPath = `${dir}definitions.json`;
const examplesPath = `${dir}examples.tsx`;
const repoPrefix = 'apps/fixture-qwik/src/docs-preview';
const bytes = readFileSync(examplesPath);
const text = bytes.toString('utf8');
const byteOffset = index => Buffer.byteLength(text.slice(0, index), 'utf8');

/** A top-level `export const Symbol =` statement runs until the next blank line (examples contain none; verified below). */
function rangeOf(symbol) {
  const start = text.search(new RegExp(`^export const ${symbol}\\b`, 'm'));
  if (start < 0) throw new Error(`No top-level export ${symbol} in examples.tsx`);
  const gap = text.indexOf('\n\n', start);
  const end = gap < 0 ? text.replace(/\n+$/, '').length : gap;
  const next = text.slice(end).trimStart();
  if (next && !/^(export |\/\*\*|const |\/\/)/.test(next)) throw new Error(`${symbol}: statement contains a blank line`);
  const slice = text.slice(start, end);
  const b = Buffer.from(slice, 'utf8');
  const startByte = byteOffset(start);
  return { start: startByte, end: startByte + b.length, sha256: createHash('sha256').update(b).digest('hex'), startLine: text.slice(0, start).split('\n').length, endLine: text.slice(0, end).split('\n').length, text: slice };
}
const strip = ({ text: _text, ...range }) => range;
const helpers = [['FormExample', /<FormExample\b/], ['LocalDestinations', /<LocalDestinations\b/]];

const definitions = JSON.parse(readFileSync(definitionsPath, 'utf8'));
for (const demo of definitions.demos) {
  const example = demo.sources.find(source => source.role === 'example');
  const main = rangeOf(example.symbolOrBranch);
  const ranges = [strip(main)];
  for (const [name, pattern] of helpers) if (pattern.test(main.text)) ranges.push(strip(rangeOf(name)));
  example.ranges = ranges;
  demo.sources = demo.sources.filter(source => !(source.role === 'host' && source.path.endsWith('entry.ssr.tsx')));
  const hostAt = demo.sources.findIndex(source => source.role === 'host');
  demo.sources.splice(hostAt + 1, 0, { path: `${repoPrefix}/entry.ssr.tsx`, role: 'host', language: 'tsx', symbolOrBranch: 'render' });
}
writeFileSync(definitionsPath, `${JSON.stringify(definitions, null, 2)}\n`);
console.log(`Qwik definitions: ${definitions.demos.length} example ranges regenerated.`);
