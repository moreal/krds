import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {root, readJson} from './common.mjs';
import {selectOptions} from '../testing/selection.mjs';
import {releaseSteps} from './collect-release-evidence.mjs';
import {recipe} from '../release-evidence/producers.mjs';
const steps=releaseSteps({directory:'test-results/release/integration',ssrDirectory:'test-results/t13/ssr-runs/integration'});

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
  assert.match(workflow,/run: node tools\/ci\/collect-release-evidence.mjs/);
  const commands=steps.flatMap(step=>step.recipe?.startsWith('ci:')?[recipe(step.recipe)]:[step.args]);
  for (const kind of ['contract', 'stories']) {
    for (const catalog of [false, true]) {
      for (const browser of ['chromium', 'firefox', 'webkit']) {
        const selected=commands.filter(args=>args[0]==='tools/yarn.mjs'&&args[1]===`test:${kind}`).map(args=>selectOptions(args.slice(2),kind==='stories'?'story':kind)).filter(options=>Boolean(options.catalog)===catalog&&options.browser===browser);
        const frameworks=selected.flatMap(options=>options.frameworks).filter(id=>id!=='solid-next');
        assert.equal(frameworks.length,7,`${kind}/${catalog}/${browser}`);
        assert.equal(new Set(frameworks).size,7);
      }
    }
  }
});

test('release packaging produces the source and output build attestation', () => {
  assert.deepEqual(steps.filter(step=>step.args[1]==='pack:all').map(step=>step.args),[['tools/yarn.mjs','pack:all','--build']]);
  const at=id=>steps.findIndex(step=>step.id===id);
  assert.ok(at('pack')<at('tarballs'));
  assert.ok(at('tarballs')<at('consumers'));
});
