import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { readFileSync, existsSync, cpSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from '../../tools/docs-previews/contract.mjs';
import { writeArtifactManifest } from '../../tools/docs-previews/manifest.mjs';

const fixture = dirname(fileURLToPath(import.meta.url));
const root = resolve(fixture, '../..');
const sourceRoot = 'apps/fixture-svelte/src/docs-preview';
const definitions = JSON.parse(readFileSync(resolve(root, sourceRoot, 'definitions.json'), 'utf8'));
const captured = new Map();
function identity(id: string) {
  let dir = dirname(id.split('?')[0]);
  while (dir.startsWith(root)) {
    const path = resolve(dir, 'package.json');
    if (existsSync(path)) {
      const pkg = JSON.parse(readFileSync(path, 'utf8'));
      return { package: pkg.name || 'native-build', version: pkg.version || '0.0.0' };
    }
    dir = dirname(dir);
  }
  return { package: 'vite', version: '8.3.5' };
}
const capture: Plugin = {
  name: 'svelte-docs-captured-inputs', enforce: 'pre',
  transform(code, id) {
    const path = relative(root, id.split('?')[0]);
    const originals = !path.startsWith('..') && !path.includes('node_modules') && existsSync(id.split('?')[0])
      ? [{ path, sha256: sha256(readFileSync(id.split('?')[0])) }] : [];
    captured.set(id, { id: id.replaceAll(root + '/', ''), sha256: sha256(code), originals, ...identity(id) });
  },
  writeBundle() {
    cpSync(resolve(fixture, 'public/local-assets'), resolve(fixture, 'dist/docs-preview/local-assets'), {recursive:true, filter: source => !/intentional-missing-image\.svg$/.test(source)}); // declared absent references must really 404
    const inputs = [...captured.values()];
    const bindings = definitions.demos.flatMap(d => d.sources.map(s => ({
      componentId: d.componentId, exampleId: d.exampleId,
      hostPath: `${sourceRoot}/main.ts`, sourcePath: s.path,
      symbolOrBranch: s.symbolOrBranch, sha256: sha256(readFileSync(resolve(root, s.path))),
      entryUrl: `/krds/previews/svelte/index.html?component=${d.componentId}&example=${d.exampleId}`,
    })));
    writeArtifactManifest({ framework: 'svelte', root, outputDir: resolve(fixture, 'dist/docs-preview'), definitions, bindings,
      modules: { identity: { package: '@unofficial-krds/svelte', version: '0.1.0', renderer: 'svelte@5.57.3', compiler: '@sveltejs/vite-plugin-svelte@7.3.1' }, inputs } });
  },
};
export default defineConfig({ root: resolve(fixture, 'src/docs-preview'), base: '/krds/previews/svelte/', publicDir: false,
  // Svelte's default cssHash hashes the component's absolute filename, so scoped class names
  // would differ per checkout location. Hash the repository-relative path instead.
  plugins: [capture, svelte({ compilerOptions: { cssHash: ({ hash, css, filename }) => `svelte-${hash(filename ? relative(root, filename).replaceAll('\\', '/') : css)}` } })],
  build: { outDir: resolve(fixture, 'dist/docs-preview'), emptyOutDir: true } });
