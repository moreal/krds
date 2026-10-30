import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {root, readJson} from './common.mjs';
import {selectOptions} from '../testing/selection.mjs';

test('release readiness recognizes the six real registered gate implementations', () => {
  const run = spawnSync(process.execPath, ['tools/ci/required-gates.mjs'], {cwd: root, encoding: 'utf8'});
  assert.equal(run.status, 0, run.stdout + run.stderr);
  const readiness = readJson('test-results/ci/release-gate-readiness.json');
  assert.equal(readiness.status, 'registered');
  assert.equal(readiness.gates.length, 6);
  assert.ok(readiness.gates.every(gate => gate.present));
  assert.equal(readiness.gates.find(gate => gate.script === 'verify:compatibility').file, 'tests/compatibility/verify.mjs');
  assert.equal(readiness.gates.find(gate => gate.script === 'test:ssr').file, 'tools/run-ssr-tests.mjs');
  assert.match(run.stdout, /execution remains required/);
});

test('release explicitly covers pilot and catalog selections in every required browser', () => {
  const workflow = readFileSync(`${root}/.github/workflows/release-prepare.yml`, 'utf8');
  for (const kind of ['contract', 'stories']) {
    for (const catalog of [false, true]) {
      const command = `node tools/yarn.mjs test:${kind} --all-stable${catalog ? ' --catalog' : ''} --browser "$browser"`;
      assert.ok(workflow.includes(command), `Missing ${command}`);
      for (const browser of ['chromium', 'firefox', 'webkit']) {
        const options = selectOptions(['--all-stable', ...(catalog ? ['--catalog'] : []), '--browser', browser], kind === 'stories' ? 'story' : kind);
        assert.equal(options.frameworks.length, 7);
        assert.equal(Boolean(options.catalog), catalog);
        assert.equal(options.browser, browser);
      }
    }
  }
  assert.equal(workflow.match(/for browser in chromium firefox webkit; do/g)?.length, 2);
});

test('release packaging produces the source and output build attestation', () => {
  const workflow = readFileSync(`${root}/.github/workflows/release-prepare.yml`, 'utf8');
  assert.match(workflow, /^\s+node tools\/yarn\.mjs pack:all --build$/m);
  assert.doesNotMatch(workflow, /^\s+node tools\/yarn\.mjs pack:all\s*$/m);
  assert.ok(workflow.indexOf('pack:all --build') < workflow.indexOf('node tools/yarn.mjs inspect:tarballs'));
  assert.ok(workflow.indexOf('node tools/yarn.mjs inspect:tarballs') < workflow.indexOf('node tools/yarn.mjs test:consumers'));
});
