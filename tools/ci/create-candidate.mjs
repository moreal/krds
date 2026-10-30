import {createHash} from 'node:crypto';
import {copyFileSync, mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {assertNode, command, git, root, writeJson} from './common.mjs';
assertNode();
const sourceSha = git(['rev-parse', 'HEAD']);
const directory = mkdtempSync(join(tmpdir(), 'krds-release-candidate-'));
try {
  const archive = join(directory, 'candidate.tgz');
  const exclusions = ['.git', 'node_modules', '.nx/cache', '.nx/workspace-data', '.yarn/cache', '.yarn/unplugged', '.yarn/install-state.gz', '.aws', '.codex', '.agents', '.superpowers', '.env*', './test-results/ci/candidate.tgz', './test-results/ci/candidate.json'];
  command('tar', ['-czf', archive, ...exclusions.map(path => `--exclude=${path}`), '-C', root, '.']);
  const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
  writeJson('test-results/ci/candidate.json', {
    sourceSha,
    archiveSha256: hash(archive),
    lockfileSha256: hash(join(root, 'yarn.lock')),
    artifactManifestSha256: hash(join(root, 'artifacts/manifest.json')),
    publicationAuthorized: false,
  });
  copyFileSync(archive, join(root, 'test-results/ci/candidate.tgz'));
} finally { rmSync(directory, {recursive: true, force: true}); }
