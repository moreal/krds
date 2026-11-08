import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256, type Definitions } from '../../tools/docs-previews/contract.mjs';
import { writeArtifactManifest } from '../../tools/docs-previews/manifest.mjs';

const fixture = dirname(fileURLToPath(import.meta.url));
const root = resolve(fixture, '../..');
const sourceRoot = 'apps/fixture-vue/src/docs-preview';
const definitions = JSON.parse(readFileSync(resolve(root, sourceRoot, 'definitions.json'), 'utf8')) as Definitions;
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
const specimens = ['specimen-logo.svg', 'specimen-landscape.svg', 'example-landscape.svg', 'specimen-icon-light.svg', 'specimen-icon-dark.svg', 'specimen-audio.wav'];
const localAssets: Plugin = {
  name: 'vue-docs-local-assets',
  generateBundle() {
    for (const name of specimens)
      this.emitFile({ type: 'asset', fileName: `local-assets/${name}`, source: readFileSync(resolve(fixture, 'public/local-assets', name)) });
  },
};
const capture: Plugin = {
  name: 'vue-docs-captured-inputs', enforce: 'pre',
  transform(code, id) {
    const path = relative(root, id.split('?')[0]);
    const originals = !path.startsWith('..') && !path.includes('node_modules') && existsSync(id.split('?')[0])
      ? [{ path, sha256: sha256(readFileSync(id.split('?')[0])) }] : [];
    captured.set(id, { id: id.replaceAll(root + '/', ''), sha256: sha256(code), originals, ...identity(id) });
  },
  writeBundle() {
    const inputs = [...captured.values()];
    const bindings = definitions.demos.flatMap(d => (d.sources ?? []).map(s => ({
      componentId: d.componentId, exampleId: d.exampleId,
      hostPath: `${sourceRoot}/main.ts`, sourcePath: s.path,
      symbolOrBranch: s.symbolOrBranch, sha256: sha256(readFileSync(resolve(root, s.path))),
      entryUrl: `/krds/previews/vue/index.html?component=${d.componentId}&example=${d.exampleId}`,
    })));
    writeArtifactManifest({ framework: 'vue', root, outputDir: resolve(fixture, 'dist/docs-preview'), definitions, bindings,
      modules: { identity: { package: '@unofficial-krds/vue', version: '0.1.0', renderer: 'vue@3.5.44', compiler: '@vitejs/plugin-vue@6.0.10' }, inputs } });
  },
};
export default defineConfig({ root: resolve(fixture, 'src/docs-preview'), base: '/krds/previews/vue/', publicDir: false,
  plugins: [localAssets, capture, vue()], build: { outDir: resolve(fixture, 'dist/docs-preview'), emptyOutDir: true } });
