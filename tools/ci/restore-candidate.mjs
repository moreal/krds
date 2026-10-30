import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';
import {assertNode, command, git, readJson, root} from './common.mjs';
assertNode();
const candidate = readJson('test-results/ci/candidate.json');
const archive = join(root, 'test-results/ci/candidate.tgz');
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
assert.equal(candidate.sourceSha, git(['rev-parse', 'HEAD']), 'Candidate archive is from another source SHA');
assert.equal(hash(archive), candidate.archiveSha256, 'Candidate archive hash mismatch');
const entries = command('tar', ['-tzf', archive]).split('\n');
assert.ok(entries.every(path => !path.startsWith('/') && !path.split('/').includes('..') && !path.split('/').includes('.git')), 'Candidate archive contains an invalid path');
// Reflect consumed version plan deletions instead of accidentally restoring the source checkout plans.
rmSync(join(root, '.nx/version-plans'), {recursive: true, force: true});
command('tar', ['-xzf', archive, '-C', root]);
assert.equal(hash(join(root, 'yarn.lock')), candidate.lockfileSha256);
assert.equal(hash(join(root, 'artifacts/manifest.json')), candidate.artifactManifestSha256);
console.log(`Restored the versioned, fully checked candidate for source ${candidate.sourceSha}`);
