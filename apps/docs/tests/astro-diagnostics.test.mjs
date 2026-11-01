import test from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const site = resolve(import.meta.dirname, '..');
test('actual Astro checker rejects invalid Astro and public Solid TSX props', async () => {
  const astro = resolve(site, 'src/DiagnosticsRegression.astro');
  const solid = resolve(site, 'src/DiagnosticsRegression.tsx');
  try {
    await writeFile(astro, '---\nconst count: number = "invalid-astro-value";\n---\n<p>{count}</p>');
    await writeFile(solid, 'import { Button } from "@unofficial-krds/solid/button";\nexport const invalid = <Button size="invalid-solid-size">Test</Button>;');
    const result = spawnSync(process.execPath, [resolve(site, 'node_modules/@astrojs/check/bin/astro-check.js'), '--root', site, '--minimumFailingSeverity', 'error'], { cwd: site, encoding: 'utf8', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout, /DiagnosticsRegression\.astro/);
    assert.match(result.stdout, /DiagnosticsRegression\.tsx/);
    assert.match(result.stdout, /invalid-solid-size/);
  } finally {
    await Promise.all([rm(astro, { force: true }), rm(solid, { force: true })]);
  }
});
