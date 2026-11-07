import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from '../../tools/docs-previews/contract.mjs';
import { writeArtifactManifest } from '../../tools/docs-previews/manifest.mjs';

const fixture = dirname(fileURLToPath(import.meta.url));
const root = resolve(fixture, '../..');
const sourceRoot = 'apps/fixture-react/src/docs-preview';
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
  name: 'react-docs-captured-inputs', enforce: 'pre',
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
      entryUrl: `/krds/previews/react/index.html?component=${d.componentId}&example=${d.exampleId}`,
    })));
    writeArtifactManifest({ framework: 'react', root, outputDir: resolve(fixture, 'dist/docs-preview'), definitions, bindings,
      modules: { identity: { package: '@unofficial-krds/react', version: '0.1.0', renderer: 'react-dom@19.3.1', compiler: '@vitejs/plugin-react@6.1.2' }, inputs } });
  },
};
const landscape: Plugin = {
  name: 'react-docs-served-landscape',
  generateBundle() { this.emitFile({ type: 'asset', fileName: 'local-assets/example-landscape.svg', source: readFileSync(resolve(fixture, 'public/local-assets/example-landscape.svg')) }); },
};
export default defineConfig({ root: resolve(fixture, 'src/docs-preview'), base: '/krds/previews/react/', publicDir: false,
  plugins: [capture, landscape, react()], build: { outDir: resolve(fixture, 'dist/docs-preview'), emptyOutDir: true } });
