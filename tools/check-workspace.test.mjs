import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, cp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { inspectWorkspace } from './check-workspace.mjs';

async function withWorkspaceCopy(root, run) {
  const dir = await mkdtemp(`${tmpdir()}/krds-workspace-`);
  try {
    for (const item of ['package.json', 'yarn.lock', '.yarnrc.yml', '.node-version', 'nx.json', 'packages', 'apps', 'tools', 'compatibility', 'compliance']) {
      await cp(`${root}/${item}`, `${dir}/${item}`, { recursive: true, filter: (src) => !/(?:^|\/)(?:node_modules|dist|\.svelte-kit)(?:\/|$)/.test(src) });
    }
    await run(dir);
  } finally { await rm(dir, { recursive: true, force: true }); }
}

// Exercise policy failures against a disposable copy, never mutate the live tree.
test('workspace configuration and source boundaries', async (t) => {
  const root = resolve(import.meta.dirname, '..');
  assert.deepEqual(await inspectWorkspace(root), []);
  for (const [name, mutate, expected] of [
    ['linker', async (dir) => writeFile(`${dir}/.yarnrc.yml`, 'nodeLinker: node-modules\n'), /nodeLinker/],
    ['second lockfile', async (dir) => writeFile(`${dir}/pnpm-lock.yaml`, ''), /prohibited/],
    ['nested npm lockfile', async (dir) => writeFile(`${dir}/packages/contracts/package-lock.json`, '{}'), /prohibited/],
    ['public app', async (dir) => {
      const path = `${dir}/apps/fixture-react/package.json`;
      const pkg = JSON.parse(await readFile(path)); pkg.private = false;
      await writeFile(path, JSON.stringify(pkg));
    }, /must be private/],
    ['runtime resolution', async (dir) => {
      const path = `${dir}/package.json`;
      const pkg = JSON.parse(await readFile(path)); pkg.resolutions = { 'solid-js': '1.9.18' };
      await writeFile(path, JSON.stringify(pkg));
    }, /resolutions/],
    ['removed boundary tags', async (dir) => {
      const path = `${dir}/packages/contracts/project.json`;
      const project = JSON.parse(await readFile(path)); project.tags = [];
      await writeFile(path, JSON.stringify(project));
    }, /required Nx tag/],
    ['upward relative import', async (dir) => writeFile(`${dir}/packages/contracts/src/illegal.ts`, 'export * from "../../react/src/index";'), /boundary/],
    ['multiline import', async (dir) => writeFile(`${dir}/packages/contracts/src/illegal.ts`, 'import {\n WorkspaceProbe,\n} from "../../react/src/index";'), /boundary/],
    ['foreign renderer', async (dir) => writeFile(`${dir}/packages/solid/src/illegal.ts`, 'import React from "react";'), /foreign runtime/],
    ['native source alias', async (dir) => writeFile(`${dir}/packages/solid/src/illegal.ts`, 'export * from "@unofficial-krds/react";'), /boundary/],
    ...[
      ['CSS double-quoted URL', 'packages/contracts/src/illegal.css', '@import url("../../react/src/review.css");'],
      ['CSS single-quoted URL', 'packages/contracts/src/illegal.css', "@import url('../../react/src/review.css');"],
      ['CSS unquoted URL', 'packages/contracts/src/illegal.css', '@import url(../../react/src/review.css);'],
      ['CSS URL whitespace', 'packages/contracts/src/illegal.css', '@import url(\n "../../react/src/review.css"\n);'],
      ['Vue embedded CSS URL', 'packages/vue/src/Illegal.vue', '<style>@import url("../../react/src/review.css");</style>'],
      ['Svelte embedded CSS URL', 'packages/svelte/src/lib/Illegal.svelte', '<style>@import url(../../../react/src/review.css);</style>'],
      ['Lit embedded CSS URL', 'packages/lit/src/illegal.ts', 'const styles = css`@import url("../../react/src/review.css");`;'],
      ['Angular embedded CSS URL', 'packages/angular/src/illegal.ts', '@Component({ styles: [`@import url(../../react/src/review.css);`] }) class Probe {}'],
    ].map(([name, path, source]) => [name, async (dir) => writeFile(`${dir}/${path}`, source), [/import boundary -> packages\/react/, /undeclared internal import @unofficial-krds\/react/]]),
    ['CSS permitted layer without declaration', async (dir) => writeFile(`${dir}/packages/styles/src/illegal.css`, '@import url(../../fonts/src/review.css);'), /undeclared internal import @unofficial-krds\/fonts/],
  ]) {
    await t.test(`rejects ${name}`, async () => {
      await withWorkspaceCopy(root, async (dir) => {
        await mutate(dir);
        const diagnostics = (await inspectWorkspace(dir)).join('\n');
        for (const expression of [expected].flat()) assert.match(diagnostics, expression);
      });
    });
  }
  await t.test('permits declared shared CSS imports and retains their implicit graph edge', async () => {
    await withWorkspaceCopy(root, async (dir) => {
      const path = `${dir}/packages/styles/project.json`;
      const projectBefore = JSON.parse(await readFile(path));
      assert.ok(projectBefore.implicitDependencies.includes('krds-tokens'));
      await writeFile(`${dir}/packages/tokens/src/probe.css`, ':root { --workspace-probe: 1; }');
      await writeFile(`${dir}/packages/styles/src/allowed.css`, '@import "../../tokens/src/probe.css";\n@import url("../../tokens/src/probe.css");\n@import url(../../tokens/src/probe.css);');
      assert.deepEqual(await inspectWorkspace(dir), []);
      assert.deepEqual(JSON.parse(await readFile(path)), projectBefore);
    });
  });
});

test('official Qwik client-manifest virtual module policy', async (t) => {
  const root = resolve(import.meta.dirname, '..');
  const manifestImport = 'import { manifest } from "@qwik-client-manifest";\n';
  await t.test('permits the exact optimizer module in the selected Qwik fixture', async () => {
    await withWorkspaceCopy(root, async (dir) => {
      await writeFile(`${dir}/apps/fixture-qwik/src/virtual-module.ts`, manifestImport);
      assert.deepEqual(await inspectWorkspace(dir), []);
    });
  });
  await t.test('rejects the virtual module in a foreign framework', async () => {
    await withWorkspaceCopy(root, async (dir) => {
      await writeFile(`${dir}/apps/fixture-react/src/virtual-module.ts`, manifestImport);
      assert.match((await inspectWorkspace(dir)).join('\n'), /virtual module @qwik-client-manifest requires the selected Qwik optimizer in a Qwik workspace/);
    });
  });
  await t.test('requires a direct selected Qwik optimizer dependency', async () => {
    await withWorkspaceCopy(root, async (dir) => {
      const path = `${dir}/apps/fixture-qwik/package.json`;
      const pkg = JSON.parse(await readFile(path)); delete pkg.devDependencies['@builder.io/qwik'];
      await writeFile(path, JSON.stringify(pkg));
      await writeFile(`${dir}/apps/fixture-qwik/src/virtual-module.ts`, manifestImport);
      assert.match((await inspectWorkspace(dir)).join('\n'), /virtual module @qwik-client-manifest requires the selected Qwik optimizer in a Qwik workspace/);
    });
  });
  await t.test('does not allow arbitrary similarly prefixed module IDs', async () => {
    await withWorkspaceCopy(root, async (dir) => {
      await writeFile(`${dir}/apps/fixture-qwik/src/virtual-module.ts`, 'import "@qwik-client-manifest/unrelated";');
      assert.match((await inspectWorkspace(dir)).join('\n'), /undeclared direct import @qwik-client-manifest\/unrelated/);
    });
  });
  await t.test('still checks adapter boundaries after a valid virtual import', async () => {
    await withWorkspaceCopy(root, async (dir) => {
      await writeFile(`${dir}/packages/qwik/src/virtual-module.ts`, manifestImport + 'export * from "@unofficial-krds/react";');
      const diagnostics = (await inspectWorkspace(dir)).join('\n');
      assert.match(diagnostics, /import boundary -> packages\/react/);
      assert.match(diagnostics, /undeclared internal import @unofficial-krds\/react/);
      assert.doesNotMatch(diagnostics, /undeclared direct import @qwik-client-manifest(?:\n|$)/);
    });
  });
});

// Authored Astro files remain boundary-checked; only the root generated cache is ignored.
test('Astro authored imports are checked and only root generated cache is ignored', async () => {
  const root = resolve(import.meta.dirname, '..');
  await withWorkspaceCopy(root, async dir => {
    await mkdir(`${dir}/apps/docs/src/pages`, { recursive: true });
    await writeFile(`${dir}/apps/docs/src/pages/policy.astro`, '---\nimport secret from "astro-review-undeclared";\n---\n<p>Policy</p>');
    assert.match((await inspectWorkspace(dir)).join('\n'), /undeclared direct import astro-review-undeclared/);
    await writeFile(`${dir}/apps/docs/src/pages/policy.astro`, '---\nimport "../../../..\/packages/react/src/index";\n---');
    assert.match((await inspectWorkspace(dir)).join('\n'), /undeclared internal import @unofficial-krds\/react/);
    await rm(`${dir}/apps/docs/src/pages/policy.astro`);
    await mkdir(`${dir}/apps/docs/.astro`, { recursive: true });
    await writeFile(`${dir}/apps/docs/.astro/generated.js`, 'import "astro-generated-only";');
    assert.deepEqual(await inspectWorkspace(dir), []);
    await mkdir(`${dir}/apps/docs/src/.astro`, { recursive: true });
    await writeFile(`${dir}/apps/docs/src/.astro/authored.astro`, '---\nimport "astro-authored-nested";\n---');
    assert.match((await inspectWorkspace(dir)).join('\n'), /undeclared direct import astro-authored-nested/);
  });
});


test('quarantined unsupported preview cannot regain executable scripts, targets, or a stale production entry', async t => {
  const root = resolve(import.meta.dirname, '..');
  for (const [name, mutate] of [
    ['script', async dir => { const path = `${dir}/apps/storybook-solid-next/package.json`; const pkg = JSON.parse(await readFile(path)); pkg.scripts = {typecheck: 'tsc --noEmit'}; await writeFile(path, JSON.stringify(pkg)); }],
    ['target', async dir => { const path = `${dir}/apps/storybook-solid-next/project.json`; const project = JSON.parse(await readFile(path)); project.targets.build = {}; await writeFile(path, JSON.stringify(project)); }],
    ['production entry', async dir => { await mkdir(`${dir}/apps/storybook-solid-next/dist`, {recursive: true}); await writeFile(`${dir}/apps/storybook-solid-next/dist/index.html`, '<html>obsolete probe</html>'); }],
  ]) await t.test(name, async () => withWorkspaceCopy(root, async dir => {
    await mutate(dir);
    assert.match((await inspectWorkspace(dir)).join('\n'), /quarantin/i);
  }));
});
