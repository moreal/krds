import { readFileSync } from 'node:fs';
const selected = JSON.parse(readFileSync(new URL('../compatibility/toolchain.json', import.meta.url))).node.version;
if (process.versions.node !== selected) {
  throw new Error(`Use Node ${selected}; received ${process.versions.node}. Run the selected installed binary or tools/yarn.mjs.`);
}
