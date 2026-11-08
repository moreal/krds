import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm, symlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const write = async (directory, path, bytes) => {
  const target = resolve(directory, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);
};

async function fixture() {
  const directory = await mkdtemp(resolve(tmpdir(), 'krds-docs-artifacts-'));
  // Synthetic generator inputs isolate this regression from all native producers.
  // They are test data, never native compiler/coverage acceptance evidence.
  const source = 'export const example = 1;\n';
  const declaration = 'export declare const example: 1;\n';
  const official = '<p>Synthetic reference-only test source</p>';
  const inputs = {
    'apps/docs/declaration-checkpoint.json': {schemaVersion:1,kind:'historical-declaration-checkpoint',currentCandidate:false,records:[{sourcePath:'packages/fixture/dist/index.d.ts',checkpointPath:'apps/docs/public/sources/packages/fixture/dist/index.d.ts.txt',bytes:Buffer.byteLength(declaration),sha256:sha256(declaration)}]},
    'compatibility/frameworks.json': { frameworks: [{ id: 'fixture', renderer: 'test fixture', supportChannel: 'stable', pins: {} }] },
    'catalog/components.json': { krdsBaselineId: 'synthetic-test-only', components: [{ id: 'example', exportName: 'Example', nameEn: 'Example', nameKo: '예제', kind: 'component', webApplicable: true, variants: [], canonicalUrl: 'https://example.invalid/reference', source: { localPath: 'upstream/example.html', sha256: sha256(official), retrievedAt: '2026-10-30' }, specPath: 'specs/components/example.md' }] },
    'catalog/coverage.json': { stableFrameworks: ['fixture'], previewFrameworks: [], coverage: [{ framework: 'fixture', componentId: 'example', status: 'planned' }] },
    'catalog/full-catalog-stories.json': { cases: [] },
    'catalog/story-cases.json': { cases: [] },
    'packages/fixture/package.json': { name: '@unofficial-krds/fixture', version: '0.0.0', exports: {} },
    'apps/fixture-fixture/package.json': { private: true },
    'apps/docs/example-evidence.json': { examples: [{ framework: 'fixture', sourcePath: 'apps/fixture-fixture/src/consumer.ts', sourceSha256: sha256(source), status: 'compiler-checked', command: 'synthetic fixture record; not executed compiler evidence', componentIds: ['example'], publicPackageConsumption: true, evidencePaths: [] }] }
  };
  for (const [path, value] of Object.entries(inputs)) await write(directory, path, JSON.stringify(value));
  for (const [path, bytes] of Object.entries({
    'apps/docs/public/sources/packages/fixture/dist/index.d.ts.txt': declaration,
    'packages/contracts/src/full-catalog.ts': 'export interface ExampleContract { label?: string }',
    'packages/contracts/src/types.ts': 'export interface SharedDetail {}',
    'upstream/example.html': official,
    'specs/components/example.md': '# Example\n\n## 의미 API {#plain-semantic-api}\n\nSynthetic regression data.\n',
    'apps/fixture-fixture/src/consumer.ts': source,
    'docs/execution/evidence/T14/reports/task-T14-report.md': '# Synthetic report location\n'
  })) await write(directory, path, bytes);
  await mkdir(resolve(directory, 'docs/getting-started'), { recursive: true });
  await mkdir(resolve(directory, 'docs/legal'), { recursive: true });
  await write(directory, 'apps/docs/scripts/generate.mjs', await readFile(resolve(root, 'apps/docs/scripts/generate.mjs')));
  const checkpoint = resolve(root, 'apps/docs/artifact-checkpoint.json');
  if (existsSync(checkpoint)) await write(directory, 'apps/docs/artifact-checkpoint.json', await readFile(checkpoint));
  await symlink(resolve(root, 'apps/docs/node_modules'), resolve(directory, 'apps/docs/node_modules'), 'dir');
  return directory;
}

function generate(directory) {
  return spawnSync(process.execPath, [resolve(directory, 'apps/docs/scripts/generate.mjs')], {
    cwd: directory,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024
  });
}

async function protectedArtifactOutputs(directory) {
  return Promise.all(['apps/docs/public/docs-metadata.json'].map(path => readFile(resolve(directory, path), 'utf8')));
}

test('live artifact creation, rewrites, corruption and removal do not change protected docs', async t => {
  const directory = await fixture();
  t.after(() => rm(directory, { recursive: true, force: true }));
  const initial = generate(directory);
  assert.equal(initial.status, 0, initial.stderr);
  const before = await protectedArtifactOutputs(directory);
  const tarball = 'artifacts/tarballs/react.tgz';
  for (const phase of ['created', 'rewritten', 'malformed', 'removed']) {
    if (phase === 'removed') await rm(resolve(directory, 'artifacts'), { recursive: true, force: true });
    else {
      const bytes = Buffer.from(`isolated ${phase} tarball`);
      await write(directory, tarball, bytes);
      const inventory = JSON.stringify({ createdAt: phase, status: phase, packages: [{ name: '@unofficial-krds/react', version: phase, tarball, sha256: sha256(bytes) }] });
      for (const path of ['artifacts/manifest.json', 'artifacts/debug-inventory.json', 'artifacts/debug-solid-inventory.json']) {
        await write(directory, path, phase === 'malformed' ? '{ not JSON' : inventory);
      }
    }
    const result = generate(directory);
    assert.equal(result.status, 0, `${phase}: ${result.stderr}`);
    const after = await protectedArtifactOutputs(directory);
    assert.deepEqual(after, before, `${phase}: protected docs metadata changed`);
    t.diagnostic(`${phase}: full metadata SHA256 ${sha256(after[0])}`);
  }
  const output = JSON.parse(before[0]);
  assert.ok(output.sourceInputs.some(input => input.path === 'apps/docs/artifact-checkpoint.json'));
  assert.ok(output.sourceInputs.every(input => !input.path.startsWith('artifacts/')));
  assert.ok(Array.isArray(output.artifactEvidence) && output.artifactEvidence.length > 0, 'historical inventories stay in the machine record');
  t.diagnostic('Four isolated live-artifact states retained byte-identical full docs metadata.');
});

test('historical checkpoint exactly preserves accepted artifact observations', async () => {
  const checkpoint = JSON.parse(await readFile(resolve(root, 'apps/docs/artifact-checkpoint.json'), 'utf8'));
  assert.equal(checkpoint.currentCandidate, false);
  assert.equal(checkpoint.publicationAuthorized, false);
  assert.equal(checkpoint.origin.metadataSha256, '3b864fdf29a22498a5cfdb4ea58945ac6744eae75be052c2d8c162f3309bd7c2');
  assert.equal(sha256(JSON.stringify(checkpoint.inventories)), '7b41ac766fe27251774874e49abaa846e2aad495a6d34409edd2d4c1b4933783');
});

test('compiler source freshness remains strict in the isolated generator', async t => {
  const directory = await fixture();
  t.after(() => rm(directory, { recursive: true, force: true }));
  const sourcePath = 'apps/fixture-fixture/src/consumer.ts';
  await write(directory, sourcePath, '// deliberately changed compiler source\n');
  const result = generate(directory);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Compiler example source changed/);
});

test('checkpoint rejects current-candidate or publication-authorized scope', async t => {
  const directory = await fixture();
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = 'apps/docs/artifact-checkpoint.json';
  const original = JSON.parse(await readFile(resolve(directory, path), 'utf8'));
  const declarationPath = 'apps/docs/public/sources/packages/fixture/dist/index.d.ts.txt';
  const frozenDeclaration = await readFile(resolve(directory, declarationPath));
  for (const field of ['currentCandidate', 'publicationAuthorized']) {
    // Each negative generation may recreate public/sources before rejecting its
    // artifact scope, so restore this independent case's immutable fixture input.
    await write(directory, declarationPath, frozenDeclaration);
    await write(directory, path, JSON.stringify({ ...original, [field]: true }));
    const result = generate(directory);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Invalid historical artifact checkpoint scope/);
  }
});
