import { defineConfig } from 'vite';
export default defineConfig({ plugins: [], build: { rollupOptions: {output:{manualChunks:(id:string)=>id.includes('lit-html')?'lit-html':undefined},input: {main:'index.html',harness:'harness.html',hydrate:'hydrate.html',gallery:'gallery.html'}}, outDir: 'dist' } });
