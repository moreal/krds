import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import manifest from './package.json' with { type: 'json' };
export default defineConfig({
  plugins: [qwikVite()],
  build: { outDir: 'dist', lib: { entry: 'src/index.ts', formats: ['es', 'cjs'], fileName: (format) => `index.qwik.${format === 'es' ? 'mjs' : 'cjs'}` }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
});
