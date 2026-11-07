import { defineConfig, type Plugin } from 'vite';
import solid from 'vite-plugin-solid';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from '../../tools/docs-previews/contract.mjs';
import { writeArtifactManifest } from '../../tools/docs-previews/manifest.mjs';

const fixture = dirname(fileURLToPath(import.meta.url));
const root = resolve(fixture, '../..');
const sourceRoot = 'apps/fixture-solid/src/docs-preview';
const definitions = JSON.parse(readFileSync(resolve(root, sourceRoot, 'definitions.json'), 'utf8'));
const captured = new Map();
function identity(id: string) {
  let dir = dirname(id.split('?')[0]);
  while (dir.startsWith(root)) {
    const path = resolve(dir, 'package.json');
    if (existsSync(path)) {
      const pkg = JSON.parse(readFileSync(path, 'utf8'));
      if (pkg.name && pkg.version) return { package: pkg.name, version: pkg.version };
    }
    dir = dirname(dir);
  }
  return { package: 'vite', version: '8.3.5' };
}
const capture: Plugin = {
  name: 'solid-docs-captured-inputs', enforce: 'pre',
  transform(code, id) {
    const path = relative(root, id.split('?')[0]);
    const originals = !path.startsWith('..') && !path.includes('node_modules') && existsSync(id.split('?')[0])
      ? [{ path, sha256: sha256(readFileSync(id.split('?')[0])) }] : [];
    captured.set(id, { id: id.replaceAll(root + '/', ''), sha256: sha256(code), originals, ...identity(id) });
  },
  writeBundle() {
    const inputs = [...captured.values()];
    const bindings = definitions.demos.flatMap(d => d.sources.map(s => ({
      componentId: d.componentId, exampleId: d.exampleId,
      hostPath: `${sourceRoot}/main.tsx`, sourcePath: s.path,
      symbolOrBranch: s.symbolOrBranch, sha256: sha256(readFileSync(resolve(root, s.path))), ...(s.ranges ? { ranges: s.ranges } : {}),
      entryUrl: `/krds/previews/solid/index.html?component=${d.componentId}&example=${d.exampleId}`,
    })));
    writeArtifactManifest({ framework: 'solid', root, outputDir: resolve(fixture, 'dist/docs-preview'), definitions, bindings,
      modules: { identity: { package: '@unofficial-krds/solid', version: '0.1.0', renderer: 'solid-js/web@1.9.18', compiler: 'vite-plugin-solid@2.11.14' }, inputs } });
  },
};
// The landscape example is a served local asset (not an inlined data URI), like the absent failure specimen reference.
const servedAssets: Plugin = {
  name: 'solid-docs-served-assets',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'local-assets/example-landscape.svg', source: readFileSync(resolve(fixture, 'public/local-assets/example-landscape.svg')) });
  },
};
export default defineConfig({ root: resolve(fixture, 'src/docs-preview'), base: '/krds/previews/solid/', publicDir: false,
  plugins: [capture, servedAssets, solid()], build: { outDir: resolve(fixture, 'dist/docs-preview'), emptyOutDir: true } });
