import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import './check-node.mjs';

// Bootstrap dependency test; behavioral/catalog coverage belongs to later tasks.
const root = process.cwd();
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json')));
const require = createRequire(resolve(root, 'package.json'));
test(`${pkg.name}: direct toolchain resolves from this workspace`, () => {
  for (const name of ['typescript', 'vite', 'solid-js', '@solidjs/web', '@solidjs/compiler', '@solidjs/babel-plugin', '@solidjs/vite-plugin', '@angular/compiler-cli', '@builder.io/qwik', 'svelte', 'vue', 'lit', 'react']) {
    if (!pkg.devDependencies?.[name]) continue;
    let dir = dirname(require.resolve(name));
    let installed;
    while (dir !== dirname(dir)) {
      try { const candidate = JSON.parse(readFileSync(resolve(dir, 'package.json'))); if (candidate.name === name) { installed = candidate; break; } } catch {}
      dir = dirname(dir);
    }
    assert.equal(installed?.version, pkg.devDependencies[name], `${name} must resolve the workspace's exact selected version`);
  }
});
