#!/usr/bin/env node
// Recompute source ranges in definitions.json by locating each example symbol,
// so hashes never go stale by hand. Run: node write-definitions.mjs [--check]
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../..');
const dir = 'apps/fixture-react/src/docs-preview';
const file = resolve(here, 'definitions.json');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const lineOf = (bytes, offset) => bytes.subarray(0, offset).toString().split('\n').length;
function range(bytes, start, end) {
  return { start, end, sha256: sha256(bytes.subarray(start, end)), startLine: lineOf(bytes, start), endLine: lineOf(bytes, end - 1) };
}
// Top-level declarations are one logical statement each; a declaration ends at the blank line after it.
function declaration(bytes, text, pattern, label) {
  const match = pattern.exec(text);
  if (!match) throw new Error(`symbol not found: ${label}`);
  const startChar = match.index;
  const rest = text.slice(startChar), blank = rest.search(/\n\s*\n|\n?$/);
  const endChar = startChar + (blank < 0 ? rest.length : blank);
  const start = Buffer.byteLength(text.slice(0, startChar)), end = start + Buffer.byteLength(text.slice(startChar, endChar).replace(/\s+$/, ''));
  return { start, end, text: text.slice(startChar, endChar).replace(/\s+$/, '') };
}
const re = name => new RegExp(`^(?:export )?(?:const|function) ${name}\\b`, 'm');
export function catalogRanges(bytes, symbol) {
  const text = bytes.toString();
  const main = declaration(bytes, text, re(symbol), symbol);
  const ranges = [main];
  for (const helper of ['FormExample', `${symbol.replace(/Example$/, '')}ExampleProps`, `${symbol.replace(/Example$/, '')}FailureProps`]) {
    if (!new RegExp(`\\b${helper}\\b`).test(main.text) && helper !== `${symbol.replace(/Example$/, '')}ExampleProps`) continue;
    if (!re(helper).test(text)) continue;
    ranges.push(declaration(bytes, text, re(helper), helper));
  }
  return [...new Map(ranges.map(r => [r.start, r])).values()].sort((a, b) => a.start - b.start).map(r => range(bytes, r.start, r.end));
}
export function selectionRange(bytes, componentId, exampleId) {
  const text = bytes.toString();
  const pattern = exampleId === 'secondary' ? /^export \{ SecondaryButtonExample \}.*$/m : new RegExp(`^  '${componentId}': .*,$`, 'm');
  const match = pattern.exec(text);
  if (!match) throw new Error(`selection entry not found: ${componentId}/${exampleId}`);
  const start = Buffer.byteLength(text.slice(0, match.index)) + (exampleId === 'secondary' ? 0 : 2);
  return range(bytes, start, Buffer.byteLength(text.slice(0, match.index + match[0].length)));
}
const definitions = JSON.parse(readFileSync(file, 'utf8'));
const catalog = readFileSync(resolve(here, 'CatalogExamples.tsx')), selection = readFileSync(resolve(here, 'examples.ts'));
for (const demo of definitions.demos) {
  const sources = demo.sources.filter(source => source.path !== `${dir}/examples.ts`);
  for (const source of sources) {
    if (source.path === `${dir}/CatalogExamples.tsx`) source.ranges = catalogRanges(catalog, source.symbolOrBranch);
  }
  const index = sources.findIndex(source => source.role === 'example');
  sources.splice(index + 1, 0, { path: `${dir}/examples.ts`, role: 'host', language: 'ts', symbolOrBranch: 'examples', ranges: [selectionRange(selection, demo.componentId, demo.exampleId)] });
  demo.sources = sources;
}
const output = `${JSON.stringify(definitions, null, 2)}\n`;
if (process.argv.includes('--check')) {
  if (readFileSync(file, 'utf8') !== output) { console.error('definitions.json ranges are stale'); process.exit(1); }
} else writeFileSync(file, output);
