import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import manifest from './package.json' with { type: 'json' };
export default defineConfig({
  plugins: [solid()],
  build: { outDir: 'dist', lib: { entry: 'src/index.ts', formats: ['es'], fileName: () => 'index.js' }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
});
