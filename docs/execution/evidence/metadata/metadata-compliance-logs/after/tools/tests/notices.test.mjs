import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
const hash = (s) => createHash('sha256').update(s).digest('hex');
const root = resolve(import.meta.dirname, '../..');
const source = '<svg>selected original asset</svg>\n';
const terms = 'Copyright (c) 2025 Actual Upstream Author\nPermission to use, copy, modify and distribute is granted.\nTHE SOFTWARE IS PROVIDED AS IS.\n';
async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'krds-notices-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  for (const path of ['compliance', 'LICENSES', 'packages/one/src', 'packages/two/src', 'originals']) await mkdir(join(dir, path), { recursive: true });
  await writeFile(join(dir, 'originals/selected.svg'), source);
  await writeFile(join(dir, 'packages/one/src/selected.svg'), source);
  await writeFile(join(dir, 'LICENSES/selected.txt'), terms);
  await writeFile(join(dir, 'ATTRIBUTION.md'), 'Independent project; upstream attribution.\n');
  await writeFile(join(dir, 'LICENSE.md'), 'Independent code identity remains unconfirmed.\n');
  const entries = [{ id: 'selected', name: 'Selected asset', sourceKind: 'asset', upstreamUrl: 'https://example.org/source.svg', versionOrCommit: '1.0.0', upstreamPath: 'source.svg', sha256: hash(source), retrievedAt: '2026-10-30T01:00:00.000Z', copyrightNotice: 'Copyright (c) 2025 Actual Upstream Author', licenseIdOrRef: 'MIT', licenseTextPath: 'LICENSES/selected.txt', rightsStatus: 'verified', rightsEvidenceUrls: ['https://example.org/LICENSE'], metadataNotes: [], localPaths: ['originals/selected.svg', 'packages/one/src/selected.svg'], modified: false, changeSummary: 'Unmodified original.', distributedIn: ['@fixture/one'] }];
  const policy = { schemaVersion: 1, sourceDocuments: { 'LICENSES/selected.txt': hash(terms) }, staticAssetRoots: ['packages/one/src', 'packages/two/src'] };
  for (const name of ['one', 'two']) await writeFile(join(dir, 'packages', name, 'package.json'), JSON.stringify({ name: `@fixture/${name}`, version: '0.0.0', license: 'SEE LICENSE IN LICENSE.md', files: ['src', 'LICENSE.md', 'LICENSES', 'ATTRIBUTION.md', 'THIRD-PARTY-NOTICES.md', 'provenance.json'] }));
  const save = async () => { await writeFile(join(dir, 'compliance/provenance.json'), JSON.stringify(entries)); await writeFile(join(dir, 'compliance/license-policy.json'), JSON.stringify(policy)); };
  await save();
  return { dir, entries, policy, save };
}
function run(tool, dir, ...args) { return spawnSync(process.execPath, [join(root, 'tools', tool), '--root', dir, ...args], { encoding: 'utf8' }); }
function good(result) { assert.equal(result.status, 0, result.stderr || result.stdout); }
function bad(result, pattern) { assert.notEqual(result.status, 0); assert.match(result.stderr + result.stdout, pattern); }

test('copies exact terms and copyright only into the package that distributes the asset', async (t) => {
  const f = await fixture(t); good(run('generate-notices.mjs', f.dir));
  assert.equal(await readFile(join(f.dir, 'packages/one/LICENSES/selected.txt'), 'utf8'), terms);
  assert.match(await readFile(join(f.dir, 'packages/one/THIRD-PARTY-NOTICES.md'), 'utf8'), /Copyright \(c\) 2025 Actual Upstream Author/);
  assert.doesNotMatch(await readFile(join(f.dir, 'packages/two/THIRD-PARTY-NOTICES.md'), 'utf8'), /Selected asset|Actual Upstream Author/);
  good(run('verify-licenses.mjs', f.dir));
});
test('rejects unresolved rights on a distributed asset', async (t) => {
  const f = await fixture(t); f.entries[0].rightsStatus = 'unresolved'; await f.save();
  bad(run('generate-notices.mjs', f.dir), /unresolved|verified/);
});
test('rejects distributed material without preserved full terms', async (t) => {
  const f = await fixture(t); await rm(join(f.dir, 'LICENSES/selected.txt'));
  bad(run('generate-notices.mjs', f.dir), /license|terms|ENOENT/i);
});
test('rejects truncated or altered license terms using preserved source hash', async (t) => {
  const f = await fixture(t); await writeFile(join(f.dir, 'LICENSES/selected.txt'), 'MIT');
  bad(run('generate-notices.mjs', f.dir), /hash|sha256/i);
});
test('accepts absent original web metadata with evidence, without inventing copyright', async (t) => {
  const f = await fixture(t); Object.assign(f.entries[0], { sourceKind: 'web-document', versionOrCommit: null, upstreamPath: null, copyrightNotice: null, metadataNotes: ['Original policy page provides no version, source file path, or material-specific copyright notice.'] }); await f.save();
  good(run('generate-notices.mjs', f.dir)); good(run('verify-licenses.mjs', f.dir));
  assert.equal(JSON.parse(await readFile(join(f.dir, 'packages/one/provenance.json'), 'utf8'))[0].copyrightNotice, null);
});
test('rejects whitespace metadata and unsupported fields instead of hiding missing values', async (t) => {
  const f = await fixture(t); f.entries[0].versionOrCommit = ' '; f.entries[0].invented = true; await f.save();
  bad(run('generate-notices.mjs', f.dir), /versionOrCommit|invented|schema/);
});
test('rejects distributed source hash drift and untracked shipped binary assets', async (t) => {
  const f = await fixture(t); await writeFile(join(f.dir, 'packages/one/src/selected.svg'), '<svg>changed</svg>');
  bad(run('generate-notices.mjs', f.dir), /hash|sha256/i);
  await writeFile(join(f.dir, 'packages/one/src/selected.svg'), source); await writeFile(join(f.dir, 'packages/two/src/mystery.woff2'), 'unverified binary');
  bad(run('generate-notices.mjs', f.dir), /untracked|provenance/i);
});
test('detects stale package notices and a missing files whitelist entry', async (t) => {
  const f = await fixture(t); good(run('generate-notices.mjs', f.dir));
  await writeFile(join(f.dir, 'packages/one/THIRD-PARTY-NOTICES.md'), 'stale');
  bad(run('verify-licenses.mjs', f.dir), /stale|generated|notice/i);
  good(run('generate-notices.mjs', f.dir));
  const p = join(f.dir, 'packages/one/package.json'); const pkg = JSON.parse(await readFile(p, 'utf8')); pkg.files = pkg.files.filter((x) => x !== 'LICENSES'); await writeFile(p, JSON.stringify(pkg));
  bad(run('verify-licenses.mjs', f.dir), /files|LICENSES/);
});
test('allows an unresolved investigation record only when it is excluded from distribution', async (t) => {
  const f = await fixture(t); const e = { ...f.entries[0], id: 'investigation', rightsStatus: 'unresolved', licenseIdOrRef: null, licenseTextPath: null, distributedIn: [], localPaths: ['originals/selected.svg'], metadataNotes: ['Rights not verified; investigation only.'] }; f.entries.push(e); await f.save();
  good(run('generate-notices.mjs', f.dir)); good(run('verify-licenses.mjs', f.dir));
});
test('rejects a shipped binary outside the configured asset roots', async (t) => {
  const f = await fixture(t); await mkdir(join(f.dir, 'packages/two/payload')); await writeFile(join(f.dir, 'packages/two/payload/untracked.png'), 'binary');
  const path = join(f.dir, 'packages/two/package.json'); const pkg = JSON.parse(await readFile(path, 'utf8')); pkg.files.push('payload'); await writeFile(path, JSON.stringify(pkg));
  bad(run('generate-notices.mjs', f.dir), /untracked|provenance/i);
});
test('rejects missing rights evidence and missing original copyright even with a replacement license hash', async (t) => {
  const f = await fixture(t); f.entries[0].rightsEvidenceUrls = []; await f.save();
  bad(run('generate-notices.mjs', f.dir), /rightsEvidenceUrls|schema/);
  f.entries[0].rightsEvidenceUrls = ['https://example.org/LICENSE']; const changed = terms.replace('Copyright (c) 2025 Actual Upstream Author\n', ''); await writeFile(join(f.dir, 'LICENSES/selected.txt'), changed); f.policy.sourceDocuments['LICENSES/selected.txt'] = hash(changed); await f.save();
  bad(run('generate-notices.mjs', f.dir), /copyright/i);
});
test('requires explanation for original metadata absence', async (t) => {
  const f = await fixture(t); f.entries[0].copyrightNotice = null; await f.save();
  bad(run('generate-notices.mjs', f.dir), /metadataNotes|schema/);
});
test('preserves related full policy text with the package that uses it', async (t) => {
  const f = await fixture(t); const related = 'Additional original license conditions, including no implied sponsorship.\n';
  await writeFile(join(f.dir, 'LICENSES/additional-policy.txt'), related); f.policy.sourceDocuments['LICENSES/additional-policy.txt'] = hash(related); f.policy.relatedDocuments = { 'LICENSES/selected.txt': ['LICENSES/additional-policy.txt'] }; await f.save();
  good(run('generate-notices.mjs', f.dir)); assert.equal(await readFile(join(f.dir, 'packages/one/LICENSES/additional-policy.txt'), 'utf8'), related);
  await writeFile(join(f.dir, 'LICENSES/additional-policy.txt'), 'truncated'); bad(run('generate-notices.mjs', f.dir), /hash|sha256/i);
});
test('rejects a stale supply-chain inventory after the lockfile changes', async (t) => {
  const f = await fixture(t); await writeFile(join(f.dir, 'yarn.lock'), 'changed lockfile\n');
  await writeFile(join(f.dir, 'compliance/provenance-dependencies.json'), JSON.stringify({ lockfileSha256: hash('previous lockfile\n'), lockResolutionCount: 0, packages: {}, missingManifests: [] }));
  f.policy.dependencyInventoryPath = 'compliance/provenance-dependencies.json'; await f.save(); good(run('generate-notices.mjs', f.dir));
  bad(run('verify-licenses.mjs', f.dir), /lockfile|inventory|hash/i);
});
async function prepareReleaseFixture(f, { completedGrant = false, confirmedPolicy = completedGrant, staleNotice = false } = {}) {
  // Synthetic identity exists only in this isolated test fixture, never in project metadata.
  const identity = { scopeOwnership: { status: 'confirmed', publishAuthorized: true }, copyright: { status: 'confirmed', independentCodeHolder: 'Fixture Rights Holder', independentCodeYear: 2026 }, repository: { ownershipVerified: true, releaseMetadataRepositoryUrl: 'https://example.org/fixture-repository' } };
  await writeFile(join(f.dir, 'compliance/project-identity.json'), JSON.stringify(identity));
  const currentGrant = await readFile(join(root, 'LICENSES/MIT.txt'), 'utf8');
  const intended = `MIT License — incomplete fixture grant\n\nIndependent-code copyright holder is unconfirmed.\n\n${currentGrant.slice(currentGrant.indexOf('Permission is hereby granted'))}`;
  const path = completedGrant ? 'LICENSES/MIT.txt' : 'LICENSES/MIT-intended.txt';
  const grant = completedGrant ? `MIT License\n\nCopyright (c) 2026 Fixture Rights Holder\n\n${intended.slice(intended.indexOf('Permission is hereby granted'))}` : intended;
  await writeFile(join(f.dir, path), grant);
  f.policy.independentCode = { intent: 'MIT', holderStatus: confirmedPolicy ? 'confirmed' : 'unconfirmed', releaseAllowed: confirmedPolicy, termsPath: path };
  f.policy.sourceDocuments[path] = hash(grant);
  if (completedGrant) await writeFile(join(f.dir, 'LICENSE.md'), `# Independent code license\n\nCopyright (c) 2026 Fixture Rights Holder\n\nIndependent code uses the MIT License. See ${path}.\n${staleNotice ? '\nThis is not a completed independent-code grant.\n' : ''}`);
  await f.save();
}
test('blocks release when confirmed identity still has an incomplete independent-code policy and grant', async (t) => {
  const f = await fixture(t); await prepareReleaseFixture(f); good(run('generate-notices.mjs', f.dir)); good(run('verify-licenses.mjs', f.dir));
  bad(run('verify-licenses.mjs', f.dir, '--release'), /independent-code.*(?:policy|grant)|incomplete/i);
});
test('blocks release when policy flags are confirmed but the independent-code grant is incomplete', async (t) => {
  const f = await fixture(t); await prepareReleaseFixture(f, { confirmedPolicy: true }); good(run('generate-notices.mjs', f.dir));
  bad(run('verify-licenses.mjs', f.dir, '--release'), /independent-code.*grant|incomplete/i);
});
test('blocks release when completed policy and grant still generate an explicitly incomplete notice', async (t) => {
  const f = await fixture(t); await prepareReleaseFixture(f, { completedGrant: true, staleNotice: true }); good(run('generate-notices.mjs', f.dir));
  bad(run('verify-licenses.mjs', f.dir, '--release'), /independent-code.*notice|incomplete/i);
});
test('rejects files glob patterns instead of skipping untracked shipped material', async (t) => {
  const f = await fixture(t); good(run('generate-notices.mjs', f.dir));
  await mkdir(join(f.dir, 'packages/two/payload')); await writeFile(join(f.dir, 'packages/two/payload/mystery.svg'), '<svg>untracked material</svg>');
  const path = join(f.dir, 'packages/two/package.json'); const pkg = JSON.parse(await readFile(path, 'utf8')); const legalFiles = pkg.files.filter((p) => p !== 'src');
  for (const pattern of ['payload/*.svg', 'payload/@(mystery).svg', 'payload/+(mystery).svg', 'payload/!(other).svg']) {
    pkg.files = [pattern, ...legalFiles]; await writeFile(path, JSON.stringify(pkg));
    for (const tool of ['generate-notices.mjs', 'verify-licenses.mjs']) {
      const result = run(tool, f.dir); bad(result, /unsupported files pattern.*literal/i); assert.ok(result.stderr.includes(pattern), result.stderr);
    }
  }
});
test('accepts local release readiness when confirmed identity, complete MIT grant and package notices agree', async (t) => {
  const f = await fixture(t); await prepareReleaseFixture(f, { completedGrant: true }); good(run('generate-notices.mjs', f.dir));
  assert.equal(await readFile(join(f.dir, 'packages/one/LICENSES/MIT.txt'), 'utf8'), await readFile(join(f.dir, 'LICENSES/MIT.txt'), 'utf8'));
  good(run('verify-licenses.mjs', f.dir, '--release'));
});
test('blocks release when the completed independent-code grant names a different confirmed holder', async (t) => {
  const f = await fixture(t); await prepareReleaseFixture(f, { completedGrant: true }); good(run('generate-notices.mjs', f.dir));
  const path = join(f.dir, 'compliance/project-identity.json'); const identity = JSON.parse(await readFile(path, 'utf8')); identity.copyright.independentCodeHolder = 'Different Fixture Holder'; await writeFile(path, JSON.stringify(identity));
  bad(run('verify-licenses.mjs', f.dir, '--release'), /independent-code.*(?:grant|notice)|copyright/i);
});
