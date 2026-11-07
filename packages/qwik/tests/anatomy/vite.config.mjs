import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { resolve } from 'node:path';

// Package-local production SSR build of the anatomy fixtures (outputs go to a caller-provided temporary directory).
const out = process.env.KRDS_QWIK_ANATOMY_OUT;
if (!out) throw new Error('KRDS_QWIK_ANATOMY_OUT is required');
export default defineConfig({
  root: import.meta.dirname,
  logLevel: 'warn',
  plugins: [qwikVite({ srcDir: import.meta.dirname, client: { input: resolve(import.meta.dirname, 'entry.client.tsx'), outDir: resolve(out, 'client') }, ssr: { input: resolve(import.meta.dirname, 'entry.ssr.tsx'), outDir: resolve(out, 'server') } })],
  build: { outDir: resolve(out, 'client'), emptyOutDir: false },
});
