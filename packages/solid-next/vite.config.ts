import { defineConfig } from 'vite';
import solid from '@solidjs/vite-plugin';
import manifest from './package.json' with { type: 'json' };
export default defineConfig({
  plugins: [solid({ ssr: true })],
  build: { outDir: 'dist', lib: { entry: Object.fromEntries(['index', 'button', 'native-select', 'modal', 'tabs', 'calendar', 'date-input'].map(name => [name, name === 'index' ? 'src/index.ts' : `src/components/${name}/index.tsx`])), formats: ['es'], fileName: (_format, name) => `${name}.js` }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
});
