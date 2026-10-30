import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
for (const [framework, expectedVite] of [['svelte', '8.3.5'], ['vue', '8.3.5'], ['qwik', '7.3.1']]) {
  const fixture = resolve(`apps/fixture-${framework}`);
  const require = createRequire(`${fixture}/package.json`);
  const viteVersion = JSON.parse(readFileSync(require.resolve('vite/package.json'))).version;
  assert.equal(viteVersion, expectedVite);
  console.log(`${framework}: direct Vite ${viteVersion}`);
  const provider = require.resolve('@vitest/browser-playwright/package.json');
  const providerRequire = createRequire(provider);
  const browser = providerRequire.resolve('@vitest/browser/package.json');
  for (const parent of [provider, browser]) {
    const parentRequire = createRequire(parent);
    const meta = JSON.parse(readFileSync(parent));
    const mockerNode = parentRequire.resolve('@vitest/mocker/node');
    const mockerRequire = createRequire(mockerNode);
    const resolvedVite = JSON.parse(readFileSync(mockerRequire.resolve('vite/package.json'))).version;
    assert.equal(resolvedVite, expectedVite);
    await import(pathToFileURL(mockerNode));
    console.log(`  ${meta.name}@${meta.version} -> @vitest/mocker/node -> Vite ${resolvedVite}: imported`);
  }
  const vite = await import(pathToFileURL(require.resolve('vite')));
  const config = await vite.loadConfigFromFile({ command: 'serve', mode: 'test' }, `${fixture}/vitest.config.ts`, fixture);
  assert.ok(config?.config?.test, 'Actual Vitest config must load');
  console.log(`  Actual ${framework} Vitest configuration loaded successfully; no browser/test suite launched.`);
}
