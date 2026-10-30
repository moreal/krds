import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import manifest from './package.json' with { type: 'json' };
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', lib: { entry: 'src/index.ts', formats: ['es'], fileName: () => 'index.js' }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
});
