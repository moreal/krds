import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
export default defineConfig({
 plugins:[qwikVite({client:{input:'src/entry.client.tsx',outDir:'dist'},ssr:{input:'src/entry.ssr.tsx',outDir:'dist/server'}})],
 build:{outDir:'dist',emptyOutDir:true},
});
