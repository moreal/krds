import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, relative, dirname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const json = async (path) => JSON.parse(await readFile(path, 'utf8'));
const exists = async (path) => { try { await access(path); return true; } catch { return false; } };
export async function workspaces(root) {
  const entries = [];
  for (const base of ['packages', 'apps']) {
    for (const name of await readdir(`${root}/${base}`)) {
      const dir = `${base}/${name}`;
      if (await exists(`${root}/${dir}/package.json`)) entries.push({ dir, pkg: await json(`${root}/${dir}/package.json`), project: await json(`${root}/${dir}/project.json`) });
    }
  }
  return entries;
}
async function sourceFiles(path) {
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.svelte-kit', 'storybook-static', '.angular', '.vite'].includes(entry.name)) continue;
    if (entry.isDirectory() && basename(path) === '.vitepress' && ['.temp', '.cache'].includes(entry.name)) continue;
    const file = `${path}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await sourceFiles(file));
    else if (/\.(?:[cm]?[jt]sx?|svelte|vue|css)$/.test(file)) files.push(file);
  }
  return files;
}
const runtimeOwners = { react: 'react', 'react-dom': 'react', 'solid-js': ['solid', 'solid-next'], '@solidjs/web': 'solid-next', svelte: 'svelte', vue: 'vue', lit: 'lit', '@builder.io/qwik': 'qwik', '@angular/core': 'angular' };
const packageId = (specifier) => specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
export async function inspectWorkspace(root) {
  const errors = [];
  const fail = (message) => errors.push(message);
  const [pkg, toolchain, frameworkData, testing] = await Promise.all([json(`${root}/package.json`), json(`${root}/compatibility/toolchain.json`), json(`${root}/compatibility/frameworks.json`), json(`${root}/compatibility/testing.json`)]);
  if (!pkg.private) fail('root must be private');
  if (pkg.packageManager !== toolchain.packageManager.packageManagerField) fail('packageManager must match selected exact Yarn');
  if (JSON.stringify(pkg.workspaces) !== JSON.stringify(['packages/*', 'apps/*'])) fail('unexpected workspace globs');
  if ((await readFile(`${root}/.node-version`, 'utf8')).trim() !== toolchain.node.version) fail('Node version mismatch');
  if (!/^nodeLinker:\s*pnpm\s*$/m.test(await readFile(`${root}/.yarnrc.yml`, 'utf8'))) fail('nodeLinker must be pnpm');
  for (const filename of toolchain.packageManager.prohibitedFiles) if (await exists(`${root}/${filename}`)) fail(`prohibited lock/config: ${filename}`);
  if (!await exists(`${root}/yarn.lock`)) fail('missing canonical yarn.lock');
  // Root overrides defeat generation isolation, even if today's value happens to match.
  if (Object.keys(pkg.resolutions ?? {}).length) fail('root resolutions are prohibited; declare exact workspace tools instead');
  if (pkg.devDependencies?.nx !== toolchain.orchestration.nx || pkg.devDependencies?.['@nx/js'] !== toolchain.orchestration['@nx/js']) fail('Nx versions differ from selected interface');
  const entries = await workspaces(root);
  const byName = new Map(entries.map((entry) => [entry.pkg.name, entry]));
  const byProject = new Map(entries.map((entry) => [entry.project.name, entry]));
  if (byName.size !== entries.length || byProject.size !== entries.length) fail('duplicate package/project names');
  const frameworks = new Map(frameworkData.frameworks.map((framework) => [framework.id, framework]));
  const permits = (from, to) => {
    const fromLayer = from.project.tags.find((tag) => tag.startsWith('layer:'));
    const toLayer = to.project.tags.find((tag) => tag.startsWith('layer:'));
    if (fromLayer === 'layer:shared') return toLayer === 'layer:shared';
    if (fromLayer === 'layer:adapter') return toLayer === 'layer:shared';
    if (fromLayer === 'layer:test') return toLayer === 'layer:shared';
    if (fromLayer === 'layer:app') return toLayer !== 'layer:app';
    return true;
  };
  for (const entry of entries) {
    const { dir, pkg: manifest, project } = entry;
    const pathId = dir.replace(/^packages\//, '').replace(/^apps\/(?:fixture|storybook)-/, '');
    const expectedFramework = frameworks.has(pathId) ? pathId : undefined;
    const expectedLayer = dir.startsWith('apps/') ? 'app' : expectedFramework ? 'adapter' : dir === 'packages/test-contracts' ? 'test' : 'shared';
    for (const tag of [`layer:${expectedLayer}`, ...(expectedFramework ? [`framework:${expectedFramework}`] : [])]) if (!project.tags?.includes(tag)) fail(`${dir}: required Nx tag ${tag}`);
    if (project.root !== dir) fail(`${dir}: project root mismatch`);
    for (const filename of ['yarn.lock', ...toolchain.packageManager.prohibitedFiles]) if (await exists(`${root}/${dir}/${filename}`)) fail(`${dir}: prohibited nested lock/config: ${filename}`);
    const frameworkId = project.tags.find((tag) => tag.startsWith('framework:'))?.slice(10);
    if ((dir.startsWith('apps/') || dir === 'packages/test-contracts') && manifest.private !== true) fail(`${dir} must be private`);
    for (const target of ['build', 'typecheck', 'test', 'lint']) if (!project.targets[target]) fail(`${dir} missing ${target} target`);
    if (!manifest.scripts?.['build:local']) fail(`${dir} missing build:local`);
    if (!await exists(`${root}/${dir}/tsconfig.json`)) fail(`${dir} missing tsconfig.json`);
    if (dir.startsWith('packages/') && dir !== 'packages/test-contracts') {
      for (const field of ['version', 'type', 'exports', 'files', 'license']) if (!manifest[field]) fail(`${dir} missing ${field}`);
      for (const file of ['README.md', 'LICENSE.md']) if (!await exists(`${root}/${dir}/${file}`)) fail(`${dir} missing ${file}`);
    }
    for (const [name, range] of Object.entries({ ...manifest.dependencies, ...manifest.devDependencies, ...manifest.peerDependencies })) {
      const dependency = byName.get(name);
      if (dependency && !permits(entry, dependency)) fail(`${dir}: dependency boundary -> ${dependency.dir}`);
      if (dependency && range !== 'workspace:^') fail(`${dir}: internal ${name} must use workspace:^`);
    }
    for (const name of project.implicitDependencies ?? []) {
      const dependency = byProject.get(name);
      // Docs links to fixture output, without importing an app into library code.
      if (dependency && dir !== 'apps/docs' && !permits(entry, dependency)) fail(`${dir}: implicit dependency boundary -> ${dependency.dir}`);
    }
    const framework = frameworks.get(frameworkId);
    if (dir.startsWith('apps/fixture-')) {
      const testProfile = testing.siheom.find((profile) => profile.framework === frameworkId);
      for (const [name, version] of Object.entries(testProfile?.directDevDependencies ?? {})) if (manifest.devDependencies?.[name] !== version) fail(`${dir}: direct behavioral test dependency ${name} must be ${version}`);
    }
    if (dir.startsWith('apps/storybook-')) {
      const storyProfile = testing.storybook.find((profile) => profile.framework === (frameworkId === 'solid-next' ? 'solid' : frameworkId));
      if (!storyProfile || manifest.devDependencies?.[storyProfile.integration] !== storyProfile.version || manifest.devDependencies?.storybook !== storyProfile.storybook) fail(`${dir}: Storybook pins must match selected native integration`);
      if (frameworkId === 'solid-next' && manifest.devDependencies?.['vite-plugin-solid'] !== 'npm:@solidjs/vite-plugin@3.0.0-next.53') fail(`${dir}: preview Storybook peer must alias the exact official Solid 2 plugin`);
    }
    if (framework) {
      const selected = { ...toolchain.environments[framework.toolchain].pins, ...framework.pins };
      for (const [name, version] of Object.entries(selected)) {
        if (manifest.devDependencies?.[name] !== version) fail(`${dir}: direct tool/runtime ${name} must be ${version}`);
      }
      if (dir.startsWith('packages/')) for (const [name, range] of Object.entries(framework.intendedPublicPeerDependencies)) {
        if (manifest.peerDependencies?.[name] !== range) fail(`${dir}: runtime peer ${name} must be ${range}`);
        if (manifest.dependencies?.[name]) fail(`${dir}: runtime ${name} must be a peer`);
      }
    }
    const declared = { ...manifest.dependencies, ...manifest.devDependencies, ...manifest.peerDependencies };
    for (const file of await sourceFiles(`${root}/${dir}`)) {
      const source = await readFile(file, 'utf8');
      // Scan the complete file so CSS imports inside Vue/Svelte style blocks and
      // Lit/Angular inline styles use the same policy as standalone stylesheets.
      const pattern = /(?:\b(?:import|export)\s+(?:[^;]*?\s+from\s*)?|\b(?:import|require)\s*\(\s*|@import\s*)["']([^"']+)["']/g;
      const cssUrlPattern = /@import\s+url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s"'()]+))\s*\)/gi;
      const specifiers = [
        ...Array.from(source.matchAll(pattern), (match) => match[1]),
        ...Array.from(source.matchAll(cssUrlPattern), (match) => match[1] ?? match[2] ?? match[3]),
      ];
      for (const specifier of specifiers.filter(Boolean)) {
        // Qwik's optimizer declares and supplies this exact SSR virtual module.
        // It is not an npm package, and must not exempt other imports or runtimes.
        if (specifier === '@qwik-client-manifest') {
          const optimizerVersion = frameworks.get('qwik')?.pins?.['@builder.io/qwik'];
          if (expectedFramework !== 'qwik' || frameworkId !== 'qwik' || !optimizerVersion || manifest.devDependencies?.['@builder.io/qwik'] !== optimizerVersion) {
            fail(`${relative(root, file)}: virtual module @qwik-client-manifest requires the selected Qwik optimizer in a Qwik workspace`);
          }
          continue;
        }
        const id = packageId(specifier);
        let dependency = byName.get(id);
        if (specifier.startsWith('.')) {
          const destination = relative(root, resolve(dirname(file), specifier));
          dependency = entries.find((candidate) => destination.startsWith(`${candidate.dir}/`));
        }
        if (dependency && dependency !== entry && !permits(entry, dependency)) fail(`${relative(root, file)}: import boundary -> ${dependency.dir}`);
        if (dependency && dependency !== entry && !declared[dependency.pkg.name]) fail(`${relative(root, file)}: undeclared internal import ${dependency.pkg.name}`);
        if (framework && runtimeOwners[id] && ![runtimeOwners[id]].flat().includes(frameworkId)) fail(`${relative(root, file)}: foreign runtime ${id}`);
        if (!specifier.startsWith('.') && !specifier.startsWith('node:') && !specifier.startsWith('$') && !specifier.startsWith('virtual:') && !declared[id] && id !== manifest.name) fail(`${relative(root, file)}: undeclared direct import ${id}`);
      }
    }
  }
  return errors;
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await import('./check-node.mjs');
  const errors = await inspectWorkspace(resolve(import.meta.dirname, '..'));
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log('Workspace verified: selected pins, pnpm linker, private apps, package metadata, dependency/import boundaries.');
}
