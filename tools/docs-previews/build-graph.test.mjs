import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { frameworks } from './contract.mjs';

const root = resolve(import.meta.dirname, '../..');
const read = path => JSON.parse(readFileSync(join(root, path), 'utf8'));
const nx = read('nx.json');
const docsProject = read('apps/docs/project.json');
const docsPackage = read('apps/docs/package.json');
// Computed URLs: a literal specifier would make Nx infer a tools -> docs project edge (task cycle).
const docsScript = name => import(pathToFileURL(join(root, 'apps', 'docs', 'scripts', name)).href);
const libraries = ['krds-contracts', 'krds-tokens', 'krds-styles', 'krds-fonts', 'krds-solid'];
const fixtureProjects = frameworks.map(framework => `fixture-${framework}`);
const previewOutput = '{projectRoot}/dist/docs-preview';

test('docs-preview cache inputs name real files and cover every preview input family', () => {
 const target = nx.targetDefaults['docs-preview'];
 assert.equal(target.cache, true);
 assert.deepEqual(target.outputs, [previewOutput]);
 assert.deepEqual(target.dependsOn, ['^build']);
 for (const input of target.inputs.filter(value => typeof value === 'string' && value.startsWith('{workspaceRoot}/') && !value.includes('*'))) assert.ok(existsSync(join(root, input.slice('{workspaceRoot}/'.length))), `${input} must exist`);
 for (const required of [
  'default', '^default', // native demos, host maps, reused consumers and dependency sources
  '{workspaceRoot}/apps/docs/demo-definitions.json', '{workspaceRoot}/apps/docs/demo-acceptance.json', // source definitions/acceptance
  '{workspaceRoot}/catalog/**/*', // catalog IDs
  '{workspaceRoot}/tools/docs-previews/**/*', // host/protocol/manifest/provenance scripts
  '{workspaceRoot}/yarn.lock', '{workspaceRoot}/.yarnrc.yml', '{workspaceRoot}/compatibility/**/*', // lock/toolchain/framework settings
  '{workspaceRoot}/compliance/**/*', '{workspaceRoot}/upstream/krds/manifest.json', // asset/provenance bytes
  '{workspaceRoot}/packages/styles/**/*', '{workspaceRoot}/packages/fonts/**/*', '{workspaceRoot}/packages/assets/**/*',
 ]) assert.ok(target.inputs.includes(required), `docs-preview input ${required}`);
 assert.ok(nx.namedInputs.default.includes('!{projectRoot}/dist/**/*'), 'outputs never feed their own hash');
});

for (const framework of frameworks) test(`fixture-${framework} preview and ordinary outputs are disjoint`, () => {
 const project = read(`apps/fixture-${framework}/project.json`), pkg = read(`apps/fixture-${framework}/package.json`);
 const preview = project.targets['docs-preview'], build = project.targets.build;
 assert.ok(preview, 'docs-preview target');
 assert.equal(preview.options.command, `node tools/yarn.mjs workspace @unofficial-krds/fixture-${framework} docs-preview:local`);
 assert.ok(pkg.scripts['docs-preview:local'], 'docs-preview:local script');
 assert.deepEqual(preview.outputs ?? nx.targetDefaults['docs-preview'].outputs, [previewOutput]);
 // A project-level inputs array replaces targetDefaults; it may not drop shared inputs.
 if (preview.inputs) for (const input of nx.targetDefaults['docs-preview'].inputs) assert.ok(preview.inputs.includes(input), `fixture-${framework} docs-preview inputs drop ${input}`);
 if (preview.dependsOn) assert.ok(preview.dependsOn.includes('^build'), 'preview retains its package prerequisites');
 assert.equal(build.options.command, `node tools/yarn.mjs workspace @unofficial-krds/fixture-${framework} build:local`);
 assert.ok(Array.isArray(build.outputs) && build.outputs.length, 'ordinary build declares explicit owned outputs');
 for (const output of build.outputs) {
  assert.ok(output.startsWith('{projectRoot}/dist/'), `${output} is an explicit child of dist`);
  assert.ok(!previewOutput.startsWith(`${output}/`) && !output.startsWith(previewOutput) && output !== '{projectRoot}/dist', `${output} overlaps docs-preview`);
 }
 assert.doesNotMatch(pkg.scripts['build:local'], /docs-preview:local|docs-preview\.config|docs-preview\/build\.mjs/, 'ordinary build:local stays ordinary');
});

test('every consumed workspace package is a declared dependency of its preview owner', () => {
 const packages = new Map();
 for (const dir of ['contracts', 'tokens', 'styles', 'assets', 'fonts', 'test-contracts', ...frameworks]) if (existsSync(join(root, `packages/${dir}/package.json`))) packages.set(dir, read(`packages/${dir}/package.json`));
 const byName = new Map([...packages].map(([dir, pkg]) => [pkg.name, dir]));
 const closure = names => {
  const seen = new Set(), queue = [...names];
  while (queue.length) { const dir = byName.get(queue.shift()); if (!dir || seen.has(dir)) continue; seen.add(dir); const pkg = packages.get(dir); queue.push(...Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })); }
  return seen;
 };
 let checked = 0;
 for (const framework of frameworks) {
  const manifestPath = `apps/fixture-${framework}/dist/docs-preview/artifact-manifest.json`;
  if (!existsSync(join(root, manifestPath))) continue;
  const pkg = read(`apps/fixture-${framework}/package.json`), project = read(`apps/fixture-${framework}/project.json`);
  const reachable = closure(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }));
  const implicit = new Set(project.implicitDependencies.map(name => name.replace(/^krds-/, '')));
  for (const mod of read(manifestPath).modules) for (const input of mod.originals) {
   const dir = input.path.match(/^packages\/([^/]+)\//)?.[1];
   if (!dir) continue;
   checked++;
   assert.ok(reachable.has(dir), `${framework} consumes packages/${dir} without a workspace dependency`);
   if (['styles', 'fonts', 'assets', 'tokens'].includes(dir) && Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).includes(packages.get(dir).name)) assert.ok(implicit.has(dir), `${framework} consumes ${dir} without an implicit dependency`);
  }
 }
 assert.ok(checked > 0, 'no artifact manifests were checked; an empty suite cannot pass');
});

test('docs build requires the eight native previews and its library prerequisites without ordinary fixture builds', () => {
 for (const project of fixtureProjects) assert.ok(docsProject.implicitDependencies.includes(project), `docs implicit dependency ${project}`);
 for (const library of libraries) assert.ok(docsProject.implicitDependencies.includes(library), `docs implicit dependency ${library}`);
 const aggregate = docsProject.targets['docs-previews'];
 assert.deepEqual(aggregate.dependsOn, [{ target: 'docs-preview', projects: fixtureProjects }]);
 const build = docsProject.targets.build;
 assert.equal(build.options.command, 'node tools/yarn.mjs workspace @unofficial-krds/docs build:local');
 assert.ok(!build.dependsOn.includes('^build'), 'docs ^build would run ordinary fixture builds');
 assert.deepEqual(build.dependsOn, [{ target: 'build', projects: libraries }, 'docs-previews']);
 assert.ok(build.inputs.includes('{workspaceRoot}/apps/fixture-*/dist/docs-preview/**/*'));
 for (const generated of ['!{projectRoot}/public/previews/**/*', '!{projectRoot}/public/demo-sources/**/*', '!{projectRoot}/public/demo-registry.json']) assert.ok(build.inputs.includes(generated), generated);
 for (const output of ['{projectRoot}/dist', '{projectRoot}/public/previews', '{projectRoot}/public/demo-sources', '{projectRoot}/public/demo-registry.json']) assert.ok(build.outputs.includes(output), output);
 assert.deepEqual(docsProject.targets.test.dependsOn, ['build', { target: 'build', projects: libraries }]);
 assert.deepEqual(docsProject.targets.typecheck.dependsOn, [{ target: 'build', projects: libraries }]);
});

test('Nx task graph builds previews for docs and never ordinary fixture outputs', () => {
 const directory = mkdtempSync(join(tmpdir(), 'krds-preview-graph-'));
 try {
  const env = { ...process.env, NX_DAEMON: 'false', NX_CACHE_PROJECT_GRAPH: 'false', NX_NO_CLOUD: 'true', NX_TUI: 'false' };
  const graph = flags => {
   const file = join(directory, `graph-${flags.length}.json`);
   const result = spawnSync(process.execPath, ['tools/yarn.mjs', 'exec', 'nx', 'run', 'krds-docs:build', ...flags, `--graph=${file}`], { cwd: root, env, encoding: 'utf8' });
   assert.equal(result.status, 0, result.stderr || result.stdout);
   return JSON.parse(readFileSync(file, 'utf8')).tasks;
  };
  const full = graph([]);
  const ids = Object.keys(full.tasks);
  for (const project of fixtureProjects) assert.ok(ids.includes(`${project}:docs-preview`), `${project}:docs-preview`);
  for (const project of fixtureProjects) assert.ok(!ids.includes(`${project}:build`), `${project}:build is not a docs prerequisite`);
  for (const library of libraries) assert.ok(full.dependencies['krds-docs:build'].map(task => task.id ?? task).includes(`${library}:build`), `${library}:build`);
  assert.deepEqual(Object.keys(graph(['--exclude-task-dependencies']).tasks), ['krds-docs:build']);
 } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('direct docs build:local assembles validated fresh artifacts first and fails clearly without them', async () => {
 assert.match(docsPackage.scripts['build:local'], /^node scripts\/assemble-previews\.mjs && node scripts\/generate\.mjs && /);
 assert.doesNotMatch(docsPackage.scripts['build:local'], /nx |docs-preview:local|vite build/, 'no recursive native build');
 const { assemblePreviews } = await docsScript('assemble-previews.mjs');
 const temp = mkdtempSync(join(tmpdir(), 'krds-missing-preview-'));
 try {
  mkdirSync(join(temp, 'apps/docs/public'), { recursive: true }); mkdirSync(join(temp, 'catalog'), { recursive: true });
  writeFileSync(join(temp, 'apps/docs/public/previews-sentinel'), 'keep');
  // Real definitions and their sources, but no built artifacts at all.
  const copy = path => { mkdirSync(join(temp, path, '..'), { recursive: true }); writeFileSync(join(temp, path), readFileSync(join(root, path))); };
  for (const path of ['apps/docs/demo-definitions.json', 'catalog/full-catalog-contracts.json']) copy(path);
  for (const framework of frameworks) {
   const fragment = `apps/fixture-${framework}/src/docs-preview/definitions.json`;
   if (!existsSync(join(root, fragment))) continue;
   copy(fragment);
   for (const demo of read(fragment).demos) for (const source of demo.sources ?? []) if (existsSync(join(root, source.path))) copy(source.path);
  }
  assert.throws(() => assemblePreviews({ root: temp }), /Native preview assembly failed: .*artifact-manifest\.json[^]*Build every fixture docs-preview target first/);
  assert.equal(readFileSync(join(temp, 'apps/docs/public/previews-sentinel'), 'utf8'), 'keep');
  assert.ok(!existsSync(join(temp, 'apps/docs/public/demo-registry.json')), 'no partial registry');
 } finally { rmSync(temp, { recursive: true, force: true }); }
});

test('local docs server serves the assembled /krds/ tree with no fixture redirects', async () => {
 const { createDocsServer } = await docsScript('serve.mjs');
 const temp = mkdtempSync(join(tmpdir(), 'krds-serve-'));
 const put = (path, value) => { mkdirSync(join(temp, path, '..'), { recursive: true }); writeFileSync(join(temp, path), value); };
 put('index.html', '<h1>docs</h1>'); put('previews/react/index.html', '<div id="root"></div>'); put('previews/qwik/button/default/index.html', '<p>qwik</p>'); put('previews/react/assets/a.wav', 'RIFF');
 const server = await createDocsServer({ directory: temp, port: 0 });
 try {
  const base = `http://127.0.0.1:${server.address().port}`;
  const get = path => fetch(`${base}${path}`, { redirect: 'manual' });
  assert.equal((await get('/krds/previews/react/index.html?component=button&example=default')).status, 200);
  assert.equal(await (await get('/krds/previews/qwik/button/default/')).text(), '<p>qwik</p>');
  assert.equal((await get('/krds/previews/react/assets/a.wav')).headers.get('content-type'), 'audio/wav');
  for (const path of ['/krds/native/fixture-react/', '/krds/native/fixture-qwik/', '/krds/previews/vue/index.html']) assert.equal((await get(path)).status, 404, path);
  assert.equal((await get('/krds/%2e%2e/%2e%2e/package.json')).status === 200, false);
  assert.equal((await get('/previews/react/index.html')).status, 404, 'only beneath /krds/');
 } finally { await new Promise(done => server.close(done)); rmSync(temp, { recursive: true, force: true }); }
 const source = readFileSync(join(root, 'apps/docs/scripts/serve.mjs'), 'utf8');
 assert.doesNotMatch(source, /fixture-\$\{|apps\/\$\{key\}|'fixture'/, 'serve.mjs never maps fixture outputs');
});

test('Pages workflow builds exact-toolchain preview artifacts in parallel and assembles them in a separate job', () => {
 const workflow = readFileSync(join(root, '.github/workflows/docs-pages.yml'), 'utf8');
 const job = name => { const match = workflow.match(new RegExp(`\\n  ${name}:\\n([\\s\\S]*?)(?=\\n  [a-z-]+:\\n|$)`)); assert.ok(match, `job ${name}`); return match[1]; };
 const preview = job('native-preview'), build = job('build'), deploy = job('deploy');
 assert.match(preview, /strategy:\n\s+fail-fast: false\n\s+matrix:\n\s+framework: \[react, solid, svelte, vue, angular, lit, qwik, solid-next\]/);
 for (const section of [preview, build]) {
  assert.match(section, /node-version: '24\.18\.0'/);
  assert.match(section, /node tools\/ci\/check-toolchain\.mjs\n/);
  assert.match(section, /node tools\/yarn\.mjs install --immutable/);
  assert.match(section, /check-toolchain\.mjs --installed/);
  assert.match(section, /persist-credentials: false/);
 }
 assert.match(preview, /nx run fixture-\$\{\{ matrix\.framework \}\}:docs-preview --skip-nx-cache/);
 assert.match(preview, /ci-artifact\.mjs stage --framework "\$\{\{ matrix\.framework \}\}" --revision "\$GITHUB_SHA" --out test-results\/docs-preview-stage/);
 assert.match(preview, /path: test-results\/docs-preview-stage/);
 assert.match(preview, /name: docs-preview-\$\{\{ matrix\.framework \}\}/);
 assert.match(build, /needs: native-preview/);
 assert.match(build, /pattern: docs-preview-\*/);
 assert.match(build, /ci-artifact\.mjs restore --framework "\$framework" --from "test-results\/docs-previews\/docs-preview-\$framework" --revision "\$GITHUB_SHA"/);
 // The assembler re-hashes every manifest original under packages/*/dist, so the build job must
 // rebuild each consumed native package, not only the docs site's own Solid dependency.
 assert.match(build, /nx run-many -t build --projects=krds-contracts,krds-tokens,krds-styles,krds-fonts,krds-react,krds-solid,krds-solid-next,krds-svelte,krds-vue,krds-angular,krds-lit,krds-qwik\n/);
 assert.match(build, /nx run krds-docs:build --exclude-task-dependencies/);
 for (const command of ['docs typecheck', 'docs test', 'docs test:content', 'docs test:pipeline', 'docs test:previews', 'docs test:previews:browser', 'docs test:previews:browser:webkit', 'docs test:previews:integration', 'docs test:reproducibility', 'docs test:browser', 'verify:licenses']) assert.ok(build.includes(command), command);
 assert.match(build, /path: apps\/docs\/dist/);
 assert.match(deploy, /needs: build/);
 assert.doesNotMatch(workflow, /nx-cloud|NX_CLOUD_ACCESS_TOKEN|nxCloud/i);
 assert.match(workflow, /NX_NO_CLOUD: 'true'/);
 assert.doesNotMatch(preview, /upload-pages-artifact|deploy-pages/);
 assert.doesNotMatch(workflow, /\$\{\{\s*runner\.temp/);
});
