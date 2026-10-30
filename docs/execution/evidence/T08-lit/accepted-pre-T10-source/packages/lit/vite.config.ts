import { defineConfig } from 'vite';
import manifest from './package.json' with { type: 'json' };
export default defineConfig({
  plugins: [],
  build: { outDir: 'dist', lib: { entry: {index:'src/index.ts',register:'src/register.ts'}, formats: ['es'], fileName: (_format, entry) => `${entry}.js` }, rollupOptions: { external: (id) => Object.keys({ ...manifest.peerDependencies, ...manifest.dependencies }).some((name) => id === name || id.startsWith(name + '/')) } },
});
