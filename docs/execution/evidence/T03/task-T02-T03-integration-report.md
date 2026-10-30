# T02/T03 shared root integration

Status: complete. Added exactly four entries to the root `package.json` scripts object:

```json
{
  "verify:catalog": "node tools/check-catalog.mjs",
  "generate:notices": "node tools/generate-notices.mjs",
  "verify:licenses": "node tools/verify-licenses.mjs",
  "test:notices": "node --test tools/tests/notices.test.mjs"
}
```

No other root manifest fields, dependencies, lockfile, or worker-owned files were changed. This report is the only other file created for the integration. The named implementation/test files remain owned by the T02/T03 workers; their commands were not run or fabricated.

Validation command, executed from the repository root:

```sh
/Users/moreal/.local/share/mise/installs/node/24.18.0/bin/node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const expected = {
  'verify:catalog': 'node tools/check-catalog.mjs',
  'generate:notices': 'node tools/generate-notices.mjs',
  'verify:licenses': 'node tools/verify-licenses.mjs',
  'test:notices': 'node --test tools/tests/notices.test.mjs',
};
for (const [name, command] of Object.entries(expected)) assert.equal(pkg.scripts[name], command);
assert.equal(pkg.packageManager, 'yarn@4.14.1');
assert.deepEqual(pkg.workspaces, ['packages/*', 'apps/*']);
console.log('Root package.json parses; all four requested scripts have exact wiring; Yarn/workspace configuration retained.');
JS
```

Actual result: exit 0.

```text
Root package.json parses; all four requested scripts have exact wiring; Yarn/workspace configuration retained.
```

No install, dependency change, subagent, commit, tag, push, or publish operation occurred.

## T02 contracts production-test exclusion

Added only `"exclude": ["src/**/*.test.ts"]` to `packages/contracts/tsconfig.json`. Existing include patterns, compiler options, dependencies and lockfile are unchanged. T02 owns subsequent build/typecheck execution.

Validation command:

```sh
/Users/moreal/.local/share/mise/installs/node/24.18.0/bin/node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const config = JSON.parse(readFileSync('packages/contracts/tsconfig.json', 'utf8'));
assert.deepEqual(config.exclude, ['src/**/*.test.ts']);
assert.deepEqual(config.include, ['src/**/*.ts', 'src/**/*.tsx']);
assert.equal(config.compilerOptions.rootDir, 'src');
assert.equal(config.compilerOptions.outDir, 'dist');
console.log('Contracts tsconfig parses; production compilation excludes src/**/*.test.ts and retains source/output wiring.');
JS
```

Actual result: exit 0.

```text
Contracts tsconfig parses; production compilation excludes src/**/*.test.ts and retains source/output wiring.
```

No install, dependency/lockfile change, subagent or commit occurred.
