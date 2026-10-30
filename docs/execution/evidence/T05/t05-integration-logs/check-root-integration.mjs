import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
const evidence = '.superpowers/sdd/PLAN/t05-integration-logs';
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const pkg = readJson('package.json');
const nx = readJson('nx.json');
const mutations = readJson(`${evidence}/mutations.json`);
const expectedPackage = readJson(`${evidence}/package-before.json`);
Object.assign(expectedPackage.scripts, mutations.scripts);
Object.assign(expectedPackage.devDependencies, mutations.devDependencies);
assert.deepEqual(pkg, expectedPackage);
assert.equal(pkg.packageManager, 'yarn@4.14.1');
assert.equal(pkg.resolutions, undefined);
const expectedNx = readJson(`${evidence}/nx-before.json`);
for (const [target, additions] of Object.entries(mutations.nxInputsAdded)) {
  for (const input of additions) if (!expectedNx.targetDefaults[target].inputs.includes(input)) expectedNx.targetDefaults[target].inputs.push(input);
  const inputs = nx.targetDefaults[target].inputs;
  assert.equal(inputs.length, new Set(inputs).size);
}
assert.deepEqual(nx, expectedNx);
assert.ok(nx.targetDefaults.contract.inputs.includes('{workspaceRoot}/playwright.config.ts'));
for (const name of ['test:contract', 'test:siheom', 'test:stories']) assert.match(pkg.scripts[name], /^node tools\/run-[a-z-]+\.mjs$/);
console.log('Exact four root scripts/dependencies and Nx input additions verified; existing fields, nonrecursive node entry wiring and target settings preserved.');
const require = createRequire(resolve('package.json'));
for (const [name, selected] of Object.entries(mutations.devDependencies)) {
  const entry = require.resolve(name);
  let directory = dirname(entry);
  let installed;
  while (directory !== dirname(directory)) {
    try { const candidate = readJson(resolve(directory, 'package.json')); if (candidate.name === name) { installed = candidate; break; } } catch {}
    directory = dirname(directory);
  }
  assert.equal(installed?.version, selected);
  console.log(`Root direct ${name}@${installed.version}: ${entry}`);
}
assert.equal(typeof require('@playwright/test').test, 'function');
assert.equal(typeof require('playwright').chromium.launch, 'function');
assert.equal(typeof require('playwright-core').chromium.launch, 'function');
const axe = require('@axe-core/playwright');
assert.equal(typeof (axe.default ?? axe.AxeBuilder ?? axe), 'function');
console.log(`All four real root imports loaded under Node ${process.versions.node}; no browsers or not-yet-created harness scripts were launched.`);
