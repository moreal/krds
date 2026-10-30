import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readdirSync, readFileSync} from 'node:fs';
import {root, readJson} from './common.mjs';
const policy = await import('./release-policy.mjs').catch(() => ({}));
const require = createRequire(import.meta.url);
const {deriveNewSemverVersion} = require('nx/src/command-line/release/utils/semver');

test('the installed Nx algorithm derives the proposed initial versions without zero-major shifting', () => {
  const version = readJson('nx.json').release.version;
  assert.equal(version.adjustSemverBumpsForZeroMajorVersion, false);
  assert.equal(deriveNewSemverVersion('0.0.0', 'minor', 'preview', version), '0.1.0');
  assert.equal(deriveNewSemverVersion('0.0.0-next.0', 'preminor', 'preview', version), '0.1.0-preview.0');
});

test('version preparation supplies the explicit independent preview preid and never publishes', () => {
  assert.equal(typeof policy.preparationArgs, 'function');
  for (const dryRun of [true, false]) {
    const args = policy.preparationArgs({dryRun});
    assert.ok(args.includes('--preid=preview'));
    assert.ok(args.includes('--skip-publish'));
    assert.ok(args.includes('--first-release'));
    assert.equal(args.includes('--dry-run'), dryRun);
    assert.ok(!args.includes('--yes') && !args.includes('publish'));
  }
});

test('preview accepts only the bootstrap or proposed prerelease and rejects stable coercion', () => {
  assert.equal(typeof policy.previewChannel, 'function');
  assert.equal(policy.previewChannel('0.0.0-next.0'), 'next');
  assert.equal(policy.previewChannel('0.1.0-preview.0'), 'preview');
  for (const version of ['0.1.0', '0.1.0-next.0', '0.1.0-rc.19']) assert.throws(() => policy.previewChannel(version), /preview/i);
});

test('applying an initial candidate requires a real source commit and the requested checkout', () => {
  assert.equal(typeof policy.assertApplySourceCommit, 'function');
  for (const commit of ['', 'HEAD', undefined]) assert.throws(() => policy.assertApplySourceCommit(commit), /commit/i);
  assert.throws(() => policy.assertApplySourceCommit('a'.repeat(40), 'b'.repeat(40)), /source/i);
  assert.doesNotThrow(() => policy.assertApplySourceCommit('a'.repeat(40), 'a'.repeat(40)));
});

test('real independent Nx plan files cover all 12 stable minor bumps and one preview preminor', () => {
  const directory = `${root}/.nx/version-plans`;
  const files = readdirSync(directory);
  assert.ok(!files.includes('.gitkeep'), 'Nx reads every plan-directory file; the empty keep file must be removed');
  const plans = files.filter(file => file.endsWith('.md')).map(file => readFileSync(`${directory}/${file}`, 'utf8'));
  assert.equal(plans.length, 2);
  const bumpMaps = plans.map(plan => {
    const frontmatter = plan.match(/^---\n([\s\S]+?)\n---\n\n\S/);
    assert.ok(frontmatter, 'Plan must have genuine bump intent and a changelog message');
    return Object.fromEntries(frontmatter[1].split('\n').map(line => line.split(': ')));
  });
  const groups = readJson('nx.json').release.groups;
  assert.ok(bumpMaps.some(map => Object.keys(map).length === 12 && groups.stable.projects.every(project => map[project] === 'minor')));
  assert.ok(bumpMaps.some(map => Object.keys(map).length === 1 && map['krds-solid-next'] === 'preminor'));
});
