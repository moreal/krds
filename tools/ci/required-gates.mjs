import {existsSync} from 'node:fs';
import {assertNode, readJson, root, writeJson} from './common.mjs';
assertNode();
const manifest = readJson('package.json');
const required = {
  'verify:compatibility': 'tests/compatibility/verify.mjs',
  'test:ssr': 'tools/run-ssr-tests.mjs',
  'pack:all': 'tools/pack-all.mjs',
  'inspect:tarballs': 'tools/inspect-tarballs.mjs',
  'test:consumers': 'tools/test-consumers.mjs',
  'verify:release': 'tools/verify-release.mjs',
};
const gates = Object.entries(required).map(([script, file]) => {
  const command = manifest.scripts[script] ?? '';
  const registered = command === `node ${file}` || command.startsWith(`node ${file} `);
  return {script, file, present: registered && existsSync(`${root}/${file}`)};
});
const missing = gates.filter(gate => !gate.present);
writeJson('test-results/ci/release-gate-readiness.json', {status: missing.length ? 'preparing' : 'registered', gates, publicationAuthorized: false});
if (missing.length) throw new Error(`Release preparation is pending; mandatory gates are unavailable: ${missing.map(gate => `${gate.script} (${gate.file})`).join(', ')}. Nothing was skipped or treated as passed.`);
console.log('All mandatory release gate implementations and root commands are present; execution remains required');
