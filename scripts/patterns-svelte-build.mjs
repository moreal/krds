import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
const require = createRequire(new URL('../apps/fixture-svelte/package.json', import.meta.url));
const { build } = await import(require.resolve('vite'));
const { svelte } = await import(require.resolve('@sveltejs/vite-plugin-svelte'));
const snapshot = process.env.KRDS_SVELTE_PACKAGE_SNAPSHOT;
if (!snapshot)
    throw new Error('An immutable native package snapshot is required');
const consumer = '/private/tmp/krds-t11-svelte-route-consumer';
await mkdir(resolve(consumer, 'public/local-assets'), { recursive: true });
await writeFile(resolve(consumer, 'public/local-assets/service-logo.svg'), await readFile(resolve('apps/fixture-svelte/public/local-assets/service-logo.svg')));
await writeFile(resolve(consumer, 'index.html'), '<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Svelte service patterns</title></head><body><div id="app"></div><script type="module" src="/entry.mjs"></script></body></html>');
await writeFile(resolve(consumer, 'entry.mjs'), `import {mount} from ${JSON.stringify(resolve(require.resolve('svelte/package.json'), '../src/index-client.js'))};import Host from ${JSON.stringify(resolve('apps/fixture-svelte/src/examples/PatternHost.svelte'))};import ${JSON.stringify(resolve('packages/styles/dist/all.css'))};mount(Host,{target:document.getElementById('app')});`);
await build({ root: consumer, configFile: false, plugins: [svelte()], resolve: { alias: [{ find: /^@unofficial-krds\/svelte$/, replacement: resolve(snapshot, 'dist/index.js') }] }, build: { outDir: resolve(process.argv[2] ?? '/private/tmp/krds-t11-svelte-fixture'), emptyOutDir: true } });
