import {cpSync, lstatSync, mkdtempSync, readFileSync, readdirSync, readlinkSync, rmSync, symlinkSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {basename, join, relative} from 'node:path';
import {assertNode, command, root, writeJson} from './common.mjs';
assertNode();
const destination = mkdtempSync(join(tmpdir(), 'krds-ci-snapshot-'));
const excluded = new Set(['node_modules', '.git', '.nx', '.yarn', '.superpowers', '.aws', '.codex', '.agents', 'dist', 'coverage', 'test-results', 'playwright-report', '.svelte-kit', '.angular', '.vite', 'artifacts']);
const inputs = [];
try {
  cpSync(root, destination, {recursive: true, filter: source => {
    if (source === root) return true;
    if (excluded.has(basename(source)) || basename(source).startsWith('.env') || source.endsWith('.tsbuildinfo')) return false;
    return true;
  }});
  symlinkSync(join(root, 'node_modules'), join(destination, 'node_modules'));
  symlinkSync(join(root, '.yarn'), join(destination, '.yarn'));
  const snapshotInputs = [];
  function inventory(path) {
    for (const name of readdirSync(path).sort()) {
      if (excluded.has(name)) continue;
      const file = join(path, name);
      const stat = lstatSync(file);
      if (stat.isDirectory()) inventory(file);
      else snapshotInputs.push({path: relative(destination, file), sha256: createHash('sha256').update(stat.isSymbolicLink() ? readlinkSync(file) : readFileSync(file)).digest('hex')});
    }
  }
  inventory(destination);
  const snapshotSourceSha256 = createHash('sha256').update(JSON.stringify(snapshotInputs)).digest('hex');
  writeJson('test-results/ci/cache-snapshot-inputs.json', snapshotInputs);
  // Copy source bytes, but reuse read-only installed dependencies; this is not an independent consumer test.
  for (const file of ['package.json', 'nx.json', 'yarn.lock', 'packages/tokens/project.json', 'packages/tokens/package.json', 'packages/tokens/scripts/build.mjs']) {
    inputs.push({path: relative(root, join(root, file)), sha256: createHash('sha256').update(readFileSync(join(destination, file))).digest('hex')});
  }
  command(process.execPath, ['tools/ci/verify-cache.mjs', '--projects', 'krds-tokens'], {cwd: destination, stdio: 'inherit'});
  writeJson('test-results/ci/cache-snapshot.json', {status: 'passed', snapshotSourceSha256, snapshotInputCount: snapshotInputs.length, inputs, cache: JSON.parse(readFileSync(join(destination, 'test-results/ci/cache-restoration.json'), 'utf8')), note: 'Isolated source snapshot, shared installed dependencies. Live workspace outputs were not removed.'});
} finally { rmSync(destination, {recursive: true, force: true}); }
