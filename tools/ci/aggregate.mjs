import assert from 'node:assert/strict';
import {appendFileSync, readdirSync, readFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {assertNode, git, readJson, writeJson} from './common.mjs';
import {canonical, pairKey, validateManifest} from './partition.mjs';
export const requiredJobs = ['select-and-check', 'native-stable', 'native-shared', 'native-docs', 'native-preview'];
const equal = (a, b, message) => assert.equal(canonical(a), canonical(b), message);
const sameSet = (a, b, message) => { assert.equal(new Set(a).size, a.length, `Duplicate ${message}`); equal([...a].sort(), [...b].sort(), message); };
export function aggregateResults(manifest, results, needs, sourceSha) {
  const errors = []; const channelErrors = {stable: [], preview: []};
  const reject = (message, channel) => { errors.push(message); if (channel) channelErrors[channel].push(message); else for (const c of ['stable', 'preview']) channelErrors[c].push(message); };
  try { validateManifest(manifest, sourceSha); } catch (e) { reject(`Invalid manifest: ${e.message}`); }
  if (!errors.length) {
    try { sameSet(Object.keys(needs ?? {}), requiredJobs, 'required job set'); } catch (e) { reject(e.message); }
    for (const id of requiredJobs) if (needs?.[id]?.result !== 'success') reject(`${id}: required job result is ${needs?.[id]?.result ?? 'missing'}`, id === 'native-preview' ? 'preview' : id === 'select-and-check' ? undefined : 'stable');
    if (!Array.isArray(results)) { reject('Worker results must be an array'); results = []; }
    const seen = new Set();
    for (const result of results) {
      const worker = manifest.workers.find(w => w.id === result?.workerId);
      if (!worker) { reject(`Unexpected worker artifact ${result?.workerId}`); continue; }
      const channel = worker.id === 'preview' ? 'preview' : 'stable';
      if (seen.has(worker.id)) { reject(`Duplicate worker artifact ${worker.id}`, channel); continue; }
      seen.add(worker.id);
      try {
        assert.equal(result.schemaVersion, 1, 'Result schema mismatch');
        assert.equal(result.sourceSha, manifest.sourceSha, 'Result SHA mismatch');
        assert.equal(result.selectionDigest, manifest.selectionDigest, 'Result digest mismatch');
        equal(result.omittedProjects, manifest.omittedProjects, 'Result omission metadata mismatch');
        equal(result.unsupported, manifest.unsupported, 'Result unsupported metadata mismatch');
        assert.equal(result.status, worker.pairs.length ? 'passed' : 'not-selected', 'Worker did not pass / empty lane was not explicitly not-selected');
        assert.ok(Array.isArray(result.pairs), 'Missing pair evidence');
        sameSet(result.pairs.map(pairKey), worker.pairs.map(pairKey), 'pair coverage');
        for (const p of result.pairs) assert.equal(p.status, 'passed', `${pairKey(p)} did not pass`);
        assert.equal(result.cache?.status, worker.cacheProjects.length ? 'passed' : 'not-selected', 'Cache did not pass / empty cache set not explicit');
        assert.ok(Array.isArray(result.cache.projects), 'Missing cache project evidence');
        sameSet(result.cache.projects.map(p => p.project), worker.cacheProjects, 'cache project coverage');
        for (const p of result.cache.projects) assert.equal(p.status, 'passed', `${p.project} cache did not pass`);
      } catch (e) { reject(`${worker.id}: ${e.message}`, channel); }
    }
    for (const w of manifest.workers) if (!seen.has(w.id)) reject(`Missing worker artifact ${w.id}`, w.id === 'preview' ? 'preview' : 'stable');
  }
  const summary = channel => ({status: channelErrors[channel].length ? 'failed' : 'passed', expectedPairs: manifest?.expectedPairs?.filter(p => p.channel === channel) ?? [], errors: channelErrors[channel]});
  return {schemaVersion: 1, sourceSha, selectionDigest: manifest?.selectionDigest, status: errors.length ? 'failed' : 'passed', omittedProjects: manifest?.omittedProjects ?? [], unsupported: manifest?.unsupported ?? [], stable: summary('stable'), preview: summary('preview'), errors};
}
export function readWorkerResults(directory) {
  const results = [];
  function visit(path) {
    for (const entry of readdirSync(path, {withFileTypes: true}).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = join(path, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile() && entry.name === 'worker-result.json') results.push(JSON.parse(readFileSync(file, 'utf8')));
    }
  }
  visit(directory); return results;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  assertNode();
  let report;
  try {
    const args = process.argv.slice(2);
    if (args.length !== 6 || args[0] !== '--manifest' || args[2] !== '--results' || args[4] !== '--needs') throw new Error('Usage: aggregate.mjs --manifest PATH --results DIR --needs PATH');
    report = aggregateResults(readJson(args[1]), readWorkerResults(resolve(args[3])), readJson(args[5]), git(['rev-parse', 'HEAD']));
  } catch (error) { report = {schemaVersion: 1, status: 'failed', errors: [error.message], stable: {status: 'failed', errors: [error.message]}, preview: {status: 'failed', errors: [error.message]}}; }
  writeJson('test-results/ci/final-result.json', report);
  for (const channel of ['stable', 'preview']) writeJson(`test-results/ci/${channel}-summary.json`, report[channel]);
  const summary = `Native CI: ${report.status}\n\nStable: ${report.stable.status}\n\nPreview (mandatory): ${report.preview.status}\n\n${report.errors.map(e => `- ${e}`).join('\n')}\n`;
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  if (report.status !== 'passed') process.exitCode = 1;
}
