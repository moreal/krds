import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sha256 } from './contract.mjs';
import { stage, restore } from './ci-artifact.mjs';

const revision = 'a'.repeat(40);
function fixture(t) {
 const base = mkdtempSync(join(tmpdir(), 'preview-ci-artifact-'));
 t.after(() => rmSync(base, { recursive: true, force: true }));
 const worker = join(base, 'worker'), assembler = join(base, 'assembler'), out = join(base, 'stage');
 const put = (root, path, value) => { mkdirSync(join(root, path, '..'), { recursive: true }); writeFileSync(join(root, path), value); };
 const files = { 'index.html': '<p>preview</p>', 'assets/main.js': 'export {}' };
 for (const [path, value] of Object.entries(files)) put(worker, `apps/fixture-react/dist/docs-preview/${path}`, value);
 put(worker, 'apps/fixture-react/dist/docs-preview/stray-harness.html', 'not allowlisted');
 const manifest = { schemaVersion: 1, framework: 'react', files: Object.entries(files).map(([path, value]) => ({ path, sha256: sha256(value), size: Buffer.byteLength(value) })).sort((a, b) => a.path.localeCompare(b.path)) };
 put(worker, 'apps/fixture-react/dist/docs-preview/artifact-manifest.json', JSON.stringify(manifest));
 put(assembler, 'apps/fixture-react/dist/index.html', 'ordinary fixture output');
 put(assembler, 'apps/fixture-react/dist/docs-preview/old.js', 'stale preview');
 const validated = [];
 const validate = (m, outputDir, framework) => { validated.push([m.framework, framework]); };
 return { worker, assembler, out, put, manifest, validate, validated };
}

test('stages only manifest-allowlisted bytes with a revision record and restores them exactly', async t => {
 const f = fixture(t);
 const origin = await stage({ root: f.worker, framework: 'react', out: f.out, revision, validate: f.validate });
 assert.deepEqual(f.validated, [['react', 'react']]);
 assert.deepEqual(origin, { schemaVersion: 1, framework: 'react', revision, artifactSha256: sha256(readFileSync(join(f.worker, 'apps/fixture-react/dist/docs-preview/artifact-manifest.json'))), files: 2 });
 assert.ok(!existsSync(join(f.out, 'docs-preview/stray-harness.html')), 'unlisted output is never uploaded');
 restore({ root: f.assembler, framework: 'react', from: f.out, revision });
 assert.deepEqual(readdirSync(join(f.assembler, 'apps/fixture-react/dist/docs-preview')).sort(), ['artifact-manifest.json', 'assets', 'index.html']);
 assert.equal(readFileSync(join(f.assembler, 'apps/fixture-react/dist/index.html'), 'utf8'), 'ordinary fixture output', 'sibling fixture output preserved');
});

test('stage fails on stale or invalid artifacts before writing', async t => {
 const f = fixture(t);
 f.put(f.worker, 'apps/fixture-react/dist/docs-preview/assets/main.js', 'tampered');
 await assert.rejects(stage({ root: f.worker, framework: 'react', out: f.out, revision, validate: f.validate }), /stale artifact file/);
 await assert.rejects(stage({ root: f.worker, framework: 'react', out: f.out, revision, validate: () => { throw new Error('contract rejected'); } }), /contract rejected/);
 await assert.rejects(stage({ root: f.worker, framework: 'vue', out: f.out, revision, validate: f.validate }), /artifact-manifest\.json|ENOENT|no such file/i);
 await assert.rejects(stage({ root: f.worker, framework: 'react', out: f.out, revision: 'main', validate: f.validate }), /40-hex source revision/);
});

test('restore rejects other revisions, frameworks, extra files, tampering and symlinks', async t => {
 const f = fixture(t);
 await stage({ root: f.worker, framework: 'react', out: f.out, revision, validate: f.validate });
 assert.throws(() => restore({ root: f.assembler, framework: 'react', from: f.out, revision: 'b'.repeat(40) }), /differs from checkout/);
 assert.throws(() => restore({ root: f.assembler, framework: 'vue', from: f.out, revision }), /artifact origin names react/);
 f.put(f.out, 'docs-preview/extra.js', 'extra');
 assert.throws(() => restore({ root: f.assembler, framework: 'react', from: f.out, revision }), /not exactly the manifest allowlist/);
 rmSync(join(f.out, 'docs-preview/extra.js'));
 f.put(f.out, 'docs-preview/index.html', 'tampered');
 assert.throws(() => restore({ root: f.assembler, framework: 'react', from: f.out, revision }), /downloaded bytes differ/);
 f.put(f.out, 'docs-preview/index.html', '<p>preview</p>');
 symlinkSync('/etc/hosts', join(f.out, 'docs-preview/link.html'));
 assert.throws(() => restore({ root: f.assembler, framework: 'react', from: f.out, revision }), /symlink rejected/);
 assert.equal(readFileSync(join(f.assembler, 'apps/fixture-react/dist/docs-preview/old.js'), 'utf8'), 'stale preview', 'failed restore leaves destination untouched');
});
