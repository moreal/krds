import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, rmSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const ordinaryOutputs = ['index.html', 'assets', 'local', 'local-assets', '_legal'];
export default defineConfig({ plugins: [{ name: 'scoped-fixture-cleanup', buildStart() {
  const dist = resolve('dist');
  if (!existsSync(dist)) return;
  for (const entry of readdirSync(dist)) {
    if (entry === 'docs-preview') continue;
    if (!ordinaryOutputs.includes(entry)) throw new Error(`Unowned React fixture output: ${entry}`);
    rmSync(resolve(dist, entry), { recursive: true, force: true });
  }
} }, react()], build: { outDir: 'dist', emptyOutDir: false } });
