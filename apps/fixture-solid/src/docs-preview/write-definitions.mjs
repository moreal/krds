#!/usr/bin/env node
// Recompute source ranges in definitions.json by locating each example symbol,
// so hashes never go stale by hand. Run: node write-definitions.mjs [--check]
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const here = dirname(fileURLToPath(import.meta.url));
const dir = 'apps/fixture-solid/src/docs-preview';
const file = resolve(here, 'definitions.json');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const lineOf = (bytes, offset) => bytes.subarray(0, offset).toString().split('\n').length;
const byteOffset = (text, chars) => Buffer.byteLength(text.slice(0, chars));
function range(bytes, start, end) {
  return { start, end, sha256: sha256(bytes.subarray(start, end)), startLine: lineOf(bytes, start), endLine: lineOf(bytes, end - 1) };
}
const re = name => new RegExp(`^(?:export )?(?:const|function) ${name}\\b`, 'm');
// A one-line declaration ends at its line end; a function whose first line ends with "{" ends at the next "}" line.
function declaration(text, name) {
  const match = re(name).exec(text);
  if (!match) throw new Error(`symbol not found: ${name}`);
  const lineEnd = text.indexOf('\n', match.index);
  const first = text.slice(match.index, lineEnd < 0 ? text.length : lineEnd);
  let endChar = lineEnd < 0 ? text.length : lineEnd;
  if (/\{\s*$/.test(first)) { const close = text.indexOf('\n}', endChar); if (close < 0) throw new Error(`unterminated: ${name}`); endChar = close + 2; }
  return { start: byteOffset(text, match.index), end: byteOffset(text, endChar), text: text.slice(match.index, endChar) };
}
const declared = text => [...text.matchAll(/^(?:export )?(?:const|function) (\w+)/gm)].map(m => m[1]);
export function catalogRanges(bytes, symbol) {
  const text = bytes.toString();
  const main = declaration(text, symbol);
  const ranges = [main];
  // Shared declarations the example cannot be read without (props constants, form wrapper, route helper).
  for (const helper of declared(text)) if (helper !== symbol && new RegExp(`\\b${helper}\\b`).test(main.text)) ranges.push(declaration(text, helper));
  return [...new Map(ranges.map(r => [r.start, r])).values()].sort((a, b) => a.start - b.start).map(r => range(bytes, r.start, r.end));
}
export function selectionRange(bytes, componentId) {
  const text = bytes.toString();
  const match = new RegExp(`^  '${componentId}': .*,$`, 'm').exec(text);
  if (!match) throw new Error(`selection entry not found: ${componentId}`);
  return range(bytes, byteOffset(text, match.index) + 2, byteOffset(text, match.index + match[0].length));
}
const definitions = JSON.parse(readFileSync(file, 'utf8'));
const catalog = readFileSync(resolve(here, 'CatalogExamples.tsx')), selection = readFileSync(resolve(here, 'examples.ts'));
for (const demo of definitions.demos) {
  const sources = demo.sources.filter(source => source.path !== `${dir}/examples.ts`);
  for (const source of sources) {
    if (source.path === `${dir}/CatalogExamples.tsx`) source.ranges = catalogRanges(catalog, source.symbolOrBranch);
    if (source.path === `${dir}/main.tsx`) source.symbolOrBranch = 'render';
  }
  const index = sources.findIndex(source => source.role === 'example');
  sources.splice(index + 1, 0, { path: `${dir}/examples.ts`, role: 'host', language: 'ts', symbolOrBranch: 'examples', ranges: [selectionRange(selection, demo.componentId)] });
  demo.sources = sources;
}
const output = `${JSON.stringify(definitions, null, 2)}\n`;
if (process.argv.includes('--check')) {
  if (readFileSync(file, 'utf8') !== output) { console.error('definitions.json ranges are stale'); process.exit(1); }
} else writeFileSync(file, output);
