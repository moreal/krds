import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import { bundleProvenance } from './scripts/bundle-provenance.mjs';

export default defineConfig({
  site: 'https://moreal.github.io',
  base: '/krds/',
  output: 'static',
  outDir: './dist',
  build: { format: 'preserve' },
  integrations: [solid()],
  vite: { plugins: [bundleProvenance()] },
});
