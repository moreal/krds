import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {root} from './common.mjs';
const phases = await import('./check-release-phase.mjs').catch(() => ({}));
const workflow = readFileSync(`${root}/.github/workflows/release-prepare.yml`, 'utf8');
function job(name) {
  const sections = workflow.split('\njobs:\n')[1].split(/^  ([\w-]+):\n/m);
  const index = sections.indexOf(name);
  assert.ok(index >= 0, `Missing job ${name}`);
  return sections[index + 1];
}

test('release phase must be explicit and one of the two supported choices', () => {
  assert.equal(typeof phases.parsePhase, 'function');
  for (const phase of ['prepare-versions', 'verify-candidate']) assert.equal(phases.parsePhase(['--phase', phase]), phase);
  for (const args of [[], ['--phase'], ['--phase', 'auto'], ['--phase', 'verify-candidate', '--apply']]) assert.throws(() => phases.parsePhase(args), /phase/i);
});

test('candidate verification requires the real requested HEAD and unchanged source', () => {
  assert.equal(typeof phases.assertVerifySource, 'function');
  const state = {head: 'a'.repeat(40), expectedSha: 'a'.repeat(40), trackedChanges: [], untrackedFiles: []};
  assert.doesNotThrow(() => phases.assertVerifySource(state));
  assert.throws(() => phases.assertVerifySource({...state, head: null}), /HEAD|commit/);
  assert.throws(() => phases.assertVerifySource({...state, expectedSha: undefined}), /source SHA/);
  assert.throws(() => phases.assertVerifySource({...state, expectedSha: 'b'.repeat(40)}), /source SHA/);
  for (const path of ['packages/react/package.json', 'packages/react/CHANGELOG.md', 'yarn.lock', 'packages/assets/LICENSE.md', 'docs/generated/catalog.md', 'apps/docs/public/catalog.json']) {
    assert.throws(() => phases.assertVerifySource({...state, trackedChanges: [path]}), /HEAD|source/);
    assert.throws(() => phases.assertVerifySource({...state, untrackedFiles: [path]}), /HEAD|source/);
  }
});

test('only the existing T16 generated evidence directories are exempt at phase entry', () => {
  assert.equal(typeof phases.assertVerifySource, 'function');
  const generated = ['docs/releases/0.1.0/verification.json', 'artifacts/manifest.json', 'test-results/ci/log.txt', '.nx/workspace-data/result.json', '.superpowers/notes.md', '.agents/local', '.codex/local', '.aws/local'];
  assert.doesNotThrow(() => phases.assertVerifySource({head: 'a'.repeat(40), expectedSha: 'a'.repeat(40), trackedChanges: generated, untrackedFiles: generated}));
});

test('version preparation is an explicit dry-run-only preview with retained failing logs', () => {
  assert.match(workflow, /phase:\n\s+description:[^\n]+\n\s+required: true\n\s+type: choice\n\s+default: prepare-versions\n\s+options:\n\s+- prepare-versions\n\s+- verify-candidate/);
  const preview = job('version-preview');
  assert.ok(preview.includes("inputs.phase == 'prepare-versions'"));
  assert.ok(preview.includes('check-release-phase.mjs --phase prepare-versions'));
  assert.ok(preview.includes('check-plans.mjs'));
  assert.ok(preview.includes('prepare-release.mjs --dry-run'));
  assert.ok(preview.includes('set -o pipefail'));
  assert.ok(preview.includes('if: always()'));
  for (const forbidden of ['--apply', 'verify:release', 'create-candidate.mjs', 'run-targets.mjs']) assert.ok(!preview.includes(forbidden), `Preview must not execute ${forbidden}`);
});

test('reviewed candidate verification never reapplies consumed plans and keeps final acceptance mandatory', () => {
  const validation = job('prepare');
  assert.ok(validation.includes("inputs.phase == 'verify-candidate'"));
  assert.ok(validation.includes('check-release-phase.mjs --phase verify-candidate'));
  for (const forbidden of ['check-plans.mjs', 'prepare-release.mjs', '--apply']) assert.ok(!validation.includes(forbidden), `Versioned candidate must not execute ${forbidden}`);
  assert.ok(validation.includes('create-candidate.mjs'));
  const final = job('verify-release');
  assert.ok(final.includes('needs: prepare'));
  assert.ok(final.includes("always() && inputs.phase == 'verify-candidate'"));
  assert.ok(final.includes('test "$PREPARATION_RESULT" = success'));
  assert.ok(final.includes('node tools/yarn.mjs verify:release'));
  assert.ok(workflow.includes('KRDS_RELEASE_SOURCE_SHA: ${{ github.sha }}'));
  assert.ok(!workflow.includes('--apply'));
});

test('ordinary CI requires version plans for PRs while retaining all validation on other events', () => {
  const ci = readFileSync(`${root}/.github/workflows/ci.yml`, 'utf8');
  assert.match(ci, /- name: Require package-specific Nx version plans\n\s+if: \$\{\{ github\.event_name == 'pull_request' \}\}\n\s+run: node tools\/ci\/check-plans\.mjs/);
  assert.ok(ci.includes('node tools/ci/run-targets.mjs'));
  assert.ok(ci.includes('node tools/ci/check-release-config.mjs'));
  assert.ok(job('version-preview').includes('node tools/ci/check-plans.mjs'));
});
