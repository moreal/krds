import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {assertNode, readJson, yarn, git as runGit, writeJson} from './common.mjs';

export const targets = ['lint', 'typecheck', 'test', 'build', 'contract', 'siheom', 'storybook-build', 'stories'];
export function resolveScope({base, head, git = runGit} = {}) {
  if (/^[a-f0-9]{40}$/i.test(head ?? '')) {
    let checkout;
    try { checkout = git(['rev-parse', 'HEAD']); }
    catch (error) { return {mode: 'full', reason: `Full verification required: ${error.message}`}; }
    if (checkout !== head) throw new Error('checkout does not match requested head; refusing to validate another source SHA');
  }
  try {
    if (![base, head].every(sha => /^[a-f0-9]{40}$/i.test(sha ?? ''))) throw new Error('PR base/head SHA unavailable');
    git(['cat-file', '-e', `${base}^{commit}`]);
    git(['cat-file', '-e', `${head}^{commit}`]);
    const mergeBase = git(['merge-base', base, head]);
    if (!/^[a-f0-9]{40}$/i.test(mergeBase)) throw new Error('merge base unavailable');
    return {mode: 'affected', base: mergeBase, head, reason: 'exact PR merge base'};
  } catch (error) {
    return {mode: 'full', reason: `Full verification required: ${error.message}`};
  }
}

export function buildSelection(nodes, projects, testing) {
  if (!projects.length) throw new Error('Zero projects selected; refusing a vacuous CI success');
  const result = {projects: [...projects].sort(), targets: Object.fromEntries(targets.map(target => [target, []])), unsupported: testing.unsupportedOrSeparate};
  for (const name of result.projects) {
    const project = nodes[name]?.data;
    if (!project) throw new Error(`Unknown selected project ${name}`);
    for (const target of targets) if (project.targets[target]) result.targets[target].push(name);
    const framework = name.replace(/^(fixture|storybook)-/, '');
    const required = name.startsWith('fixture-') ? ['contract', ...(testing.requiredSiheomFrameworks.includes(framework) ? ['siheom'] : [])]
      : name.startsWith('storybook-') ? ['storybook-build', 'stories'] : [];
    for (const target of required) if (!project.targets[target]) throw new Error(`${name} is missing mandatory ${target}`);
    if (name.startsWith('fixture-') && testing.unsupportedOrSeparate.some(row => row.framework === framework && row.siheom?.status === 'unsupported-upstream') && project.targets.siheom) {
      throw new Error(`${name} invents an unsupported upstream siheom target`);
    }
  }
  if (!result.targets.test.length) throw new Error('Zero test projects selected; refusing a vacuous CI success');
  if (!result.targets.build.length) throw new Error('Zero build projects selected');
  return result;
}

export function loadGraph() {
  const directory = mkdtempSync(join(tmpdir(), 'krds-ci-graph-'));
  try {
    const file = join(directory, 'graph.json');
    yarn(['nx', 'graph', `--file=${file}`]);
    return JSON.parse(readFileSync(file, 'utf8')).graph;
  } finally { rmSync(directory, {recursive: true, force: true}); }
}
export function affectedProjects(scope) {
  return JSON.parse(yarn(['nx', 'show', 'projects', '--affected', `--base=${scope.base}`, `--head=${scope.head}`, '--json']));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  assertNode();
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--full')) throw new Error('Usage: selection.mjs [--full]');
  const graph = loadGraph();
  const scope = args.includes('--full') ? {mode: 'full', reason: 'Explicit whole-workspace verification'} : resolveScope({base: process.env.PR_BASE_SHA, head: process.env.PR_HEAD_SHA});
  const projects = scope.mode === 'full' ? Object.keys(graph.nodes) : affectedProjects(scope);
  const selection = {...buildSelection(graph.nodes, projects, readJson('compatibility/testing.json')), scope};
  selection.previewProjects = selection.projects.filter(name => name.endsWith('solid-next'));
  selection.stableProjects = selection.projects.filter(name => !name.endsWith('solid-next'));
  writeJson('test-results/ci/selection.json', selection);
  console.log(JSON.stringify(selection, null, 2));
}
