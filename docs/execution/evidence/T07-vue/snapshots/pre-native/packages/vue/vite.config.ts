import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import manifest from './package.json' with { type: 'json' };
export default defineConfig({
  plugins: [vue()],
  build: { outDir: 'dist', lib: { entry: 'src/index.ts', formats: ['es'], fileName: () => 'index.js' }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
});
