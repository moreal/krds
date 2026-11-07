// Regenerates the derived inputs of the Lit docs-preview so hashes and byte ranges never go stale by hand:
//   * data.json    = the acceptance inventory items (apps/docs/demo-acceptance.json), pretty-printed;
//   * definitions.json source ranges = the exact `builders.<id>` symbol (plus the module-level helper functions it
//     calls, because the symbol cannot be read without them) in examples.ts and the component's own entry in data.json.
// `--check` fails instead of writing. Offsets are UTF-8 bytes; lines are 1-based and inclusive (contract validateRanges).
import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import ts from 'typescript';

const here = import.meta.dirname;
const repo = resolve(here, '../../../..');
const check = process.argv.includes('--check');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const write = (path, text) => {
  if (readFileSync(path, 'utf8') === text) return;
  if (check) throw new Error(`${path} is stale; run write-definitions.mjs`);
  writeFileSync(path, text);
};

// 1. data.json mirrors the acceptance inventory.
const items = JSON.parse(readFileSync(resolve(repo, 'apps/docs/demo-acceptance.json'), 'utf8')).items;
const dataPath = resolve(here, 'data.json');
write(dataPath, JSON.stringify(items, null, 2));
const dataText = readFileSync(dataPath, 'utf8');

/** Byte range of [startChar, endChar) of `text` widened to whole lines at the start. */
function range(text, startChar, endChar) {
  const lineStart = text.lastIndexOf('\n', startChar - 1) + 1;
  const from = text.slice(lineStart, startChar).trim() ? startChar : lineStart; // entries sharing a line start at their own symbol
  const bytes = Buffer.from(text);
  const start = Buffer.byteLength(text.slice(0, from));
  const end = Buffer.byteLength(text.slice(0, endChar));
  return {start, end, sha256: sha256(bytes.subarray(start, end)), startLine: text.slice(0, from).split('\n').length, endLine: text.slice(0, endChar - 1).split('\n').length};
}

// 2. data.json: one range per top-level array element (an object spanning "\n  {" .. "\n  }").
const dataRanges = new Map();
{
  let from = 0;
  for (const item of items) {
    const open = dataText.indexOf('\n  {\n', from) + 1;
    const close = dataText.indexOf('\n  }', open) + 4;
    if (!JSON.parse(dataText.slice(open, close).trim()) || JSON.parse(dataText.slice(open, close)).componentId !== item.componentId) throw new Error(`data.json range mismatch for ${item.componentId}`);
    dataRanges.set(item.componentId, range(dataText, open, close));
    from = close;
  }
}

// 3. examples.ts: the `builders` property for each component plus the module-level helpers it calls.
const examplesPath = resolve(here, 'examples.ts');
const examples = readFileSync(examplesPath, 'utf8');
const file = ts.createSourceFile('examples.ts', examples, ts.ScriptTarget.Latest, true);
const helpers = new Map();
let builders;
file.forEachChild(node => {
  if (ts.isFunctionDeclaration(node) && node.name) helpers.set(node.name.text, node);
  if (ts.isVariableStatement(node)) for (const declaration of node.declarationList.declarations) if (declaration.name.getText(file) === 'builders') builders = declaration.initializer;
});
if (!builders || !ts.isObjectLiteralExpression(builders)) throw new Error('builders object not found');
const nameOf = property => property.name.getText(file).replace(/^['"]|['"]$/g, '');
const symbols = new Map(builders.properties.map(property => [nameOf(property), property]));
const exampleRanges = new Map();
for (const [id, property] of symbols) {
  const used = new Set();
  const visit = node => { if (ts.isIdentifier(node) && helpers.has(node.text)) used.add(node.text); ts.forEachChild(node, visit); };
  visit(property);
  const nodes = [...used].map(name => helpers.get(name)).concat(property).sort((a, b) => a.getStart(file) - b.getStart(file));
  exampleRanges.set(id, nodes.map(node => range(examples, node.getStart(file), node.end)));
}

// 4. definitions.json.
const definitionsPath = resolve(here, 'definitions.json');
const definitions = JSON.parse(readFileSync(definitionsPath, 'utf8'));
for (const demo of definitions.demos.filter(d => d.exampleId === 'default')) {
  const ranges = exampleRanges.get(demo.componentId);
  const data = dataRanges.get(demo.componentId);
  if (!ranges || !data) throw new Error(`no example symbol or data entry for ${demo.componentId}`);
  for (const source of demo.sources) {
    if (source.role === 'example') { source.symbolOrBranch = `builders.${demo.componentId}`; source.ranges = ranges; }
    if (source.role === 'data') { source.symbolOrBranch = demo.acceptanceId; source.ranges = [data]; }
  }
}
write(definitionsPath, `${JSON.stringify(definitions, null, 2)}\n`);
