import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { readdirSync, rmSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const ordinaryOutputs = ['index.html', 'assets', 'local', 'local-assets', '_legal'];
export default defineConfig({ plugins: [{ name: 'scoped-fixture-cleanup', buildStart() {
  const dist = resolve('dist');
  if (!existsSync(dist)) return;
  for (const entry of readdirSync(dist)) {
    if (entry === 'docs-preview') continue;
    if (!ordinaryOutputs.includes(entry)) throw new Error(`Unowned Svelte fixture output: ${entry}`);
    rmSync(resolve(dist, entry), { recursive: true, force: true });
  }
} }, svelte()], build: { outDir: 'dist', emptyOutDir: false } });
