import assert from 'node:assert/strict';
import {existsSync, rmSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {assertNode, env, git, readJson, root, writeJson} from './common.mjs';
import {canonical, validateManifest} from './partition.mjs';
import {targets} from './selection.mjs';
import {runCommand} from './process-runner.mjs';

const minute = 60_000;
export function targetCommands(worker) {
  const commands = [];
  for (const target of targets) {
    const projects = worker.pairs.filter(p => p.target === target).map(p => p.project);
    const lit = target === 'test' && projects.includes('fixture-lit');
    const groups = [projects.filter(p => !(lit && p === 'fixture-lit')), ...(lit ? [['fixture-lit']] : [])].filter(g => g.length);
    for (const group of groups) {
      const heavy = ['build', 'typecheck', 'test', 'contract', 'siheom', 'storybook-build', 'stories'].includes(target) && ['stable-angular', 'docs'].includes(worker.id);
      commands.push({target, projects: group, timeoutMs: lit && group.length === 1 && group[0] === 'fixture-lit' ? 10 * minute : heavy ? 30 * minute : 20 * minute,
        args: ['tools/yarn.mjs', 'nx', 'run-many', '-t', target, `--projects=${group.join(',')}`, '--parallel=2', '--outputStyle=stream']});
    }
  }
  return commands;
}
export async function runWorker(manifest, workerId, {sourceSha, resultPath = resolve(root, 'test-results/ci/worker-result.json'), budgetMs, runner = runCommand} = {}) {
  // Initialize before validation or any child process so malformed input still leaves evidence.
  const started = Date.now();
  const result = {schemaVersion: 1, sourceSha, selectionDigest: manifest?.selectionDigest, workerId, status: 'running', startedAt: new Date().toISOString(), pairs: [], cache: {status: 'incomplete', projects: []}, omittedProjects: manifest?.omittedProjects ?? [], unsupported: manifest?.unsupported ?? []};
  const persist = () => writeJson(resultPath, result);
  persist();
  try {
    validateManifest(manifest, sourceSha);
    const worker = manifest.workers.find(w => w.id === workerId); assert.ok(worker, `Unknown worker ${workerId}`);
    budgetMs ??= (workerId === 'shared' ? 32 : workerId === 'preview' ? 37 : 52) * minute;
    assert.ok(Number.isFinite(budgetMs) && budgetMs > 0, 'Worker budget must be positive');
    const remaining = () => budgetMs - (Date.now() - started) - 60_000;
    result.budgetMs = budgetMs;
    result.pairs = worker.pairs.map(p => ({...p, status: 'incomplete'}));
    result.cache = {status: worker.cacheProjects.length ? 'incomplete' : 'not-selected', projects: worker.cacheProjects.map(project => ({project, status: 'incomplete'}))};
    persist();
    for (const command of targetCommands(worker)) {
      if (remaining() <= 0) { result.error = 'Worker budget exhausted'; break; }
      const records = result.pairs.filter(p => p.target === command.target && command.projects.includes(p.project));
      for (const p of records) { p.status = 'running'; p.startedAt = new Date().toISOString(); }
      persist();
      let outcome;
      try { outcome = await runner({command: process.execPath, args: command.args, cwd: root, env, timeoutMs: Math.min(command.timeoutMs, remaining()), logPath: join(dirname(resultPath), `target-${command.target}-${command.projects.join('_')}.log`), label: `${workerId}:${command.target}:${command.projects.join(',')}`}); }
      catch (e) { outcome = {status: 'failed', error: e.message}; }
      for (const p of records) Object.assign(p, {status: outcome.status, completedAt: new Date().toISOString(), command: outcome});
      persist();
    }
    if (worker.cacheProjects.length && remaining() > 0) {
      result.cache.status = 'running'; persist();
      const reportPath = join(dirname(resultPath), 'cache-restoration.json');
      rmSync(reportPath, {force: true});
      const timeoutMs = Math.min((['docs', 'stable-angular'].includes(workerId) ? 30 : 20) * minute, remaining());
      let outcome;
      try {
        outcome = await runner({command: process.execPath, args: ['tools/ci/verify-cache.mjs', '--projects', worker.cacheProjects.join(','), '--timeout-ms', String(timeoutMs), '--report', reportPath], cwd: root, env, timeoutMs, logPath: join(dirname(resultPath), 'cache-verification.log'), label: `${workerId}:cache`});
        assert.equal(outcome.status, 'passed', 'Cache command did not pass');
        assert.ok(existsSync(reportPath), 'Cache command did not produce a report');
        const report = readJson(reportPath);
        assert.equal(report.status, 'passed', 'Cache restoration failed');
        assert.equal(canonical([...report.projects].sort()), canonical(worker.cacheProjects), 'Cache project coverage mismatch');
        for (const key of ['first', 'restored']) assert.equal(canonical(report[key].map(p => p.project).sort()), canonical(worker.cacheProjects), `Cache ${key} coverage mismatch`);
        result.cache = {status: 'passed', projects: worker.cacheProjects.map(project => ({project, status: 'passed'})), command: outcome, reportPath};
      } catch (e) { result.cache = {status: outcome?.status === 'timed-out' ? 'timed-out' : 'failed', projects: worker.cacheProjects.map(project => ({project, status: 'failed'})), error: e.message, command: outcome}; }
      persist();
    }
    result.status = !worker.pairs.length ? 'not-selected' : result.pairs.every(p => p.status === 'passed') && ['passed', 'not-selected'].includes(result.cache.status) ? 'passed' : 'failed';
  } catch (error) { result.status = 'failed'; result.error = error.message; }
  result.completedAt = new Date().toISOString(); persist(); return result;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  assertNode();
  // A provisional diagnostic also covers malformed CLI, missing manifest, or unavailable Git.
  const diagnostic = {schemaVersion: 1, status: 'failed', workerId: process.env.CI_WORKER_ID, sourceSha: process.env.GITHUB_SHA, pairs: [], cache: {status: 'incomplete', projects: []}, error: 'Worker initialization did not complete'};
  writeJson('test-results/ci/worker-result.json', diagnostic);
  try {
    const args = process.argv.slice(2);
    if (![4, 6].includes(args.length) || args[0] !== '--manifest' || args[2] !== '--worker' || args.length === 6 && args[4] !== '--budget-ms') throw new Error('Usage: run-targets.mjs --manifest PATH --worker ID [--budget-ms N]');
    const result = await runWorker(readJson(args[1]), args[3], {sourceSha: git(['rev-parse', 'HEAD']), ...(args.length === 6 ? {budgetMs: Number(args[5])} : {})});
    if (result.status === 'failed') process.exitCode = 1;
  } catch (error) { writeJson('test-results/ci/worker-result.json', {...diagnostic, error: error.message}); console.error(error.message); process.exitCode = 1; }
}
