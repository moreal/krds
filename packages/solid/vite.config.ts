import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import manifest from './package.json' with { type: 'json' };
import { existsSync } from 'node:fs';
const componentIds = Object.keys(manifest.exports).filter(key => key !== '.' && key !== './provider').map(key => key.slice(2));
const entries = Object.fromEntries(componentIds.flatMap(id => {
  const entry = ['ts', 'tsx'].map(extension => `src/components/${id}/index.${extension}`)
    .find(path => existsSync(new URL(path, import.meta.url)));
  return entry ? [[id, entry]] : [];
}));
export default defineConfig({
  plugins: [solid({ ssr: true })],
  build: { outDir: 'dist', lib: { entry: { index: 'src/index.ts', provider: 'src/providers/index.ts', ...entries }, formats: ['es'], fileName: (_format, name) => `${name}.js` }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
});
