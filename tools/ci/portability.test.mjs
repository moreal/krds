import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtemp, mkdir, readFile, writeFile, copyFile, rm, access, readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve, dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {assertNode, root} from './common.mjs';

const selected = assertNode();
function execute(args, {env = process.env, cwd = root} = {}) {
  const result = spawnSync(process.execPath, args, {cwd, env, encoding: 'utf8', timeout: 120000, maxBuffer: 32 * 1024 * 1024});
  assert.ifError(result.error);
  return result;
}
function successful(args, options) {
  const result = execute(args, options);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return result.stdout.trim();
}
const json = async path => JSON.parse(await readFile(join(root, path), 'utf8'));

for (const entry of ['fixture', 'canonical package']) test(`${entry} APF consumer launches the selected current executable despite foreign installedBinary metadata`, async () => {
  const directory = await mkdtemp(join(tmpdir(), 'krds-apf-portability-'));
  try {
    // The package test runs its direct vitest suite first, then the canonical APF/SSR consumer.
    const packageTest = (await json('packages/angular/package.json')).scripts.test;
    assert.equal(packageTest, 'vitest run --config vitest.config.ts && node ../../tests/ssr/angular/verify.mjs');
    const consumer = packageTest.split(' && ').at(-1);
    const script = entry === 'fixture' ? 'apps/fixture-angular/tests/apf/verify.mjs' : resolve(root, 'packages/angular', consumer.slice('node '.length)).slice(root.length + 1);
    for (const path of [dirname(script), 'tools', 'compatibility', 'packages/angular/node_modules']) await mkdir(join(directory, path), {recursive: true});
    await copyFile(join(root, script), join(directory, script));
    await copyFile(join(root, 'tools/check-node.mjs'), join(directory, 'tools/check-node.mjs'));
    if (entry === 'canonical package') {
      await mkdir(join(directory, 'tests/compatibility'), {recursive: true});
      for (const file of ['evidence.mjs', 'artifact-evidence.mjs']) await copyFile(join(root, 'tests/compatibility', file), join(directory, 'tests/compatibility', file));
    }
    await writeFile(join(directory, 'package.json'), '{"type":"module"}');
    await writeFile(join(directory, 'packages/angular/package.json'), '{"name":"apf-test-consumer"}');
    await writeFile(join(directory, 'compatibility/toolchain.json'), JSON.stringify({node: {...selected.node, installedBinary: '/foreign-workstation/node'}}));
    await mkdir(join(directory, dirname(script), 'consumer'));
    const receipt = join(directory, 'node-receipt.json');
    // The first real Node child records its executable and deliberately stops
    // before packing/building. An ENOENT from the foreign path cannot pass.
    await writeFile(join(directory, 'tools/yarn.mjs'), `import {writeFileSync} from 'node:fs'; writeFileSync(${JSON.stringify(receipt)}, JSON.stringify({executable:process.execPath,version:process.versions.node})); process.exit(51);`);
    const childEnv = {...process.env, TMPDIR: directory, KRDS_SSR_OUTPUT: join(directory, 'evidence'), KRDS_SSR_SOURCE_SHA256: 'controlled-first-child-boundary'};
    delete childEnv.KRDS_ANGULAR_SSR_TARBALL;
    const result = execute([join(directory, script)], {env: childEnv});
    assert.notEqual(result.status, 0, 'Controlled pack boundary must stop the consumer');
    assert.deepEqual(JSON.parse(await readFile(receipt, 'utf8').catch(() => 'null')), {executable: process.execPath, version: selected.node.version}, result.stderr);

    await rm(receipt);
    await writeFile(join(directory, 'compatibility/toolchain.json'), JSON.stringify({node: {version: '0.0.0', installedBinary: '/foreign-workstation/node'}}));
    const wrongVersion = execute([join(directory, script)], {env: childEnv});
    assert.notEqual(wrongVersion.status, 0);
    assert.match(wrongVersion.stderr, /Use Node 0\.0\.0; received/);
    await assert.rejects(access(receipt), {code: 'ENOENT'});
  } finally { await rm(directory, {recursive: true, force: true}); }
});

test('all registered docs snapshots preserve their exact bytes and rights and are Git-includable', async () => {
  const distribution = await json('compliance/distribution-provenance.json');
  const docs = distribution.documentation;
  const metadataBytes = await readFile(join(root, docs.metadataPath));
  assert.equal(createHash('sha256').update(metadataBytes).digest('hex'), docs.metadataSha256);
  const metadata = JSON.parse(metadataBytes);
  assert.equal(docs.records.length, 547); assert.equal(metadata.distributedSources.length, 547);
  assert.ok(!metadata.sourceInputs.some(input => /^(?:packages\/[^/]+|apps\/storybook-[^/]+)\/dist\//.test(input.path)), 'public docs must not require optional live dist inputs');
  const declarations = await json('apps/docs/declaration-checkpoint.json');
  assert.equal(declarations.records.length, 385);
  assert.equal(declarations.currentCandidate, false);
  const snapshots = new Map(metadata.distributedSources.map(record => [`apps/docs/public/${record.outputPath}`, record]));
  const git = spawnSync('git', ['-c', 'core.fsmonitor=false', 'ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', docs.publicRoot], {cwd: root, encoding: 'utf8'});
  assert.equal(git.status, 0, git.stderr);
  const included = new Set(git.stdout.split('\0')); const missing = [];
  for (const record of docs.records) {
    const original = snapshots.get(record.destination);
    assert.ok(original, record.destination);
    for (const key of ['sourcePath', 'bytes', 'sha256']) assert.equal(record[key], original[key], `${record.destination}: ${key}`);
    assert.ok(['independent', 'krds-reference-adaptation', 'mixed-record', 'preserved-terms'].includes(record.rights), record.destination);
    const bytes = await readFile(join(root, record.destination));
    assert.equal(bytes.length, record.bytes, record.destination);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256, record.destination);
    if (!included.has(record.destination)) missing.push(record.destination);
  }
  assert.deepEqual(missing, [], `${missing.length} registered docs snapshots are absent from the Git source inventory`);
  const builds = ['packages/react/dist/index.d.ts', 'apps/docs/dist/index.html', 'apps/fixture-react/dist/index.html', 'apps/docs/public/sources/packages/react/dist/generated.js'];
  const ignored = spawnSync('git', ['-c', 'core.fsmonitor=false', 'check-ignore', '--no-index', '--stdin'], {cwd: root, encoding: 'utf8', input: builds.join('\n') + '\n'});
  assert.equal(ignored.status, 0, ignored.stderr);
  assert.deepEqual(ignored.stdout.trim().split('\n'), builds, 'Source exceptions must not admit generated package/app outputs');
});

test('browser preload chooses a portable runner temporary default before the cache exists', () => {
  for (const runnerTemp of [join(tmpdir(), 'krds-empty-runner-cache'), undefined]) {
    const env = {...process.env};
    delete env.PLAYWRIGHT_BROWSERS_PATH;
    delete env.RUNNER_TEMP;
    if (runnerTemp !== undefined) env.RUNNER_TEMP = runnerTemp;
    const result = successful(['--import', './tools/testing/browser-cache-preload.mjs', '--input-type=module', '-e', 'console.log(JSON.stringify(process.env.PLAYWRIGHT_BROWSERS_PATH))'], {env});
    assert.equal(JSON.parse(result), join(runnerTemp ?? tmpdir(), 'krds-playwright-1.64.1'));
  }
});

test('browserPath and preload preserve explicit caller caches including Playwright 0 mode', () => {
  for (const cache of [join(tmpdir(), 'caller-browser-cache'), '0']) {
    const output = successful(['--import', './tools/testing/browser-cache-preload.mjs', '--input-type=module', '-e', "import {browserPath} from './tools/testing/support.mjs'; console.log(JSON.stringify({browserPath,env:process.env.PLAYWRIGHT_BROWSERS_PATH}));"], {env: {...process.env, PLAYWRIGHT_BROWSERS_PATH: cache}});
    assert.deepEqual(JSON.parse(output), {browserPath: cache, env: cache});
  }
});

test('runSelected propagates the current caller cache and explicit child overrides unchanged', () => {
  for (const [caller, override, expected] of [
    ['/caller/cache', undefined, '/caller/cache'],
    ['0', undefined, '0'],
    ['/caller/cache', '0', '0'],
    ['0', '/child/cache', '/child/cache'],
  ]) {
    const program = `import {runSelected} from './tools/testing/support.mjs'; process.env.PLAYWRIGHT_BROWSERS_PATH=${JSON.stringify(caller)}; const result=await runSelected(['exec','node','--input-type=module','-e','console.log(JSON.stringify(process.env.PLAYWRIGHT_BROWSERS_PATH))'],{env:${JSON.stringify(override === undefined ? {} : {PLAYWRIGHT_BROWSERS_PATH: override})}}); if(result.code!==0)process.exit(result.code);`;
    const env = {...process.env}; delete env.PLAYWRIGHT_BROWSERS_PATH;
    assert.equal(JSON.parse(successful(['--input-type=module', '-e', program], {env})), expected);
  }
});

test('Nx test graphs include each output-consuming app build and retain dependency builds', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'krds-prerequisite-graph-'));
  try {
    const graphPath = join(directory, 'graph.json');
    successful(['tools/yarn.mjs', 'exec', 'nx', 'run-many', '-t', 'test', '--projects=storybook-angular,storybook-solid,storybook-vue,krds-docs', `--graph=${graphPath}`], {env: {...process.env, NX_DAEMON: 'false', NX_CACHE_PROJECT_GRAPH: 'false', NX_NO_CLOUD: 'true', NX_TUI: 'false'}});
    const graph = JSON.parse(await readFile(graphPath, 'utf8')).tasks;
    for (const [project, build] of [['storybook-angular', 'storybook-build'], ['storybook-solid', 'build'], ['storybook-vue', 'storybook-build'], ['krds-docs', 'build']]) {
      const prerequisites = graph.dependencies[`${project}:test`].map(dependency => dependency.id);
      assert.ok(prerequisites.includes(`${project}:${build}`), `${project}:test must build its own dist`);
      assert.ok(prerequisites.includes('krds-styles:build'), `${project}:test must retain ^build`);
      if (project === 'krds-docs') {
        for (const dependency of ['krds-solid','krds-fonts','krds-contracts','krds-tokens']) assert.ok(prerequisites.includes(`${dependency}:build`), `docs retains actual ${dependency} prerequisite`);
        assert.ok(!prerequisites.includes('krds-vue:build'), 'Astro docs does not build an unused renderer');
      }
    }
  } finally { await rm(directory, {recursive: true, force: true}); }
});

test('every provenance-referenced legal source exists with its recorded hash and is Git-includable', async () => {
  const sources = new Map();
  function record(path, hash) {
    if (typeof path !== 'string' || !path.startsWith('LICENSES/')) return;
    if (!sources.has(path)) sources.set(path, new Set());
    if (hash) sources.get(path).add(hash);
  }
  function walk(value) {
    if (!value || typeof value !== 'object') return;
    record(value.localPath, value.sha256);
    record(value.licenseTextPath);
    for (const path of Array.isArray(value.localPaths) ? value.localPaths : []) record(path, value.sha256);
    for (const child of Object.values(value)) {
      if (typeof child === 'string' && child.startsWith('LICENSES/')) record(child);
      else walk(child);
    }
  }
  for (const name of await readdir(join(root, 'compliance'))) if (/^provenance.*\.json$/.test(name)) walk(await json(`compliance/${name}`));
  for (const [path, hash] of Object.entries((await json('compliance/license-policy.json')).sourceDocuments)) record(path, hash);
  const git = spawnSync('git', ['-c', 'core.fsmonitor=false', 'ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', 'LICENSES'], {cwd: root, encoding: 'utf8'});
  assert.equal(git.status, 0, git.stderr);
  const included = new Set(git.stdout.split('\0'));
  assert.ok(sources.size > 100, 'Inventory must cover all preserved legal sources');
  for (const [path, hashes] of sources) {
    const bytes = await readFile(join(root, path));
    assert.ok(hashes.size > 0, `${path} must have a preserved legal-source hash`);
    for (const hash of hashes) assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, path);
    assert.ok(included.has(path), `${path} is missing from the Git source inventory (possibly ignored)`);
  }
});


test('Pages keeps portable runner context and publishes only checked Astro dist', async () => {
  const workflow=await readFile(join(root,'.github/workflows/docs-pages.yml'),'utf8');
  assert.doesNotMatch(workflow,/\$\{\{\s*runner\.temp/);
  assert.match(workflow,/PLAYWRIGHT_BROWSERS_PATH=\$RUNNER_TEMP\/krds-playwright-1\.64\.1/);
  for(const command of ['krds-docs:build','docs typecheck','docs test','docs test:content','docs test:pipeline','docs test:reproducibility','docs test:browser','verify:licenses'])assert.ok(workflow.includes(command),command);
  assert.match(workflow,/path: apps\/docs\/dist/);
  assert.doesNotMatch(workflow,/native Vue|vitepress/i);
});
