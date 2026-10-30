import {assertNode, readJson, yarn, writeJson} from './common.mjs';
import {targets} from './selection.mjs';
assertNode();
const selection = readJson('test-results/ci/selection.json');
const results = [];
// Stable and exact Solid 2 preview are reported separately; neither failure is hidden.
for (const channel of ['stable', 'preview']) {
  const projects = selection[`${channel}Projects`];
  for (const target of targets) {
    const selected = selection.targets[target].filter(project => projects.includes(project));
    if (!selected.length) continue; // Absence is already checked against supported targets by selection.mjs.
    console.log(`${channel}: ${target}: ${selected.join(', ')}`);
    try {
      yarn(['nx', 'run-many', '-t', target, `--projects=${selected.join(',')}`, '--parallel=2', '--outputStyle=static'], {stdio: 'inherit'});
      results.push({channel, target, projects: selected, status: 'passed'});
    } catch (error) {
      results.push({channel, target, projects: selected, status: 'failed', error: error.message});
      writeJson('test-results/ci/target-results.json', results);
      process.exitCode = 1;
    }
    writeJson('test-results/ci/target-results.json', results);
  }
}
for (const channel of ['stable', 'preview']) writeJson(`test-results/ci/${channel}-target-results.json`, results.filter(row => row.channel === channel));
