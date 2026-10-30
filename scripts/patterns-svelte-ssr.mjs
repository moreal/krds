import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createServer } from 'node:http';
import assert from 'node:assert/strict';
process.env.PLAYWRIGHT_BROWSERS_PATH = '/private/tmp/krds-playwright-1.64.1';
const require = createRequire(new URL('../apps/fixture-svelte/package.json', import.meta.url));
const { createServer: createVite, build } = await import(require.resolve('vite'));
const { svelte } = await import(require.resolve('@sveltejs/vite-plugin-svelte'));
const snapshot = process.env.KRDS_SVELTE_PACKAGE_SNAPSHOT;
if (!snapshot)
    throw new Error('An immutable package snapshot is required');
const packageAlias = { find: /^@unofficial-krds\/svelte$/, replacement: resolve(snapshot, 'dist/index.js') };
const root = resolve('apps/fixture-svelte');
const output = resolve(process.argv[2] ?? '.superpowers/sdd/PLAN/t11-svelte-logs/ssr');
await mkdir(output, { recursive: true });
const vite = await createVite({ root, configFile: false, plugins: [svelte()], resolve: { alias: [packageAlias] }, server: { middlewareMode: true }, appType: 'custom' });
const results = [];
const rendered = new Map();
try {
    const { default: PatternStory } = await vite.ssrLoadModule(resolve('apps/storybook-svelte/src/stories/patterns/PatternStory.svelte'));
    const { render } = await vite.ssrLoadModule('svelte/server');
    const { presentationCases } = await vite.ssrLoadModule('@unofficial-krds/test-contracts/patterns');
    for (const item of presentationCases) {
        const { body, head } = render(PatternStory, { props: { state: item.state } });
        assert.ok(body.includes('<main'));
        assert.ok(!body.includes('__KRDS_FIXTURE__'));
        rendered.set(item.id, { body, head, state: item.state });
        results.push({ id: item.id, ssr: 'passed', bytes: Buffer.byteLength(body) });
        await writeFile(resolve(output, item.id + '.html'), body);
    }
}
finally {
    await vite.close();
}
const buildRoot = '/private/tmp/krds-t11-svelte-hydration-source';
const artifact = '/private/tmp/krds-t11-svelte-hydration';
await mkdir(buildRoot, { recursive: true });
await mkdir(resolve(buildRoot, 'public/local-assets'), { recursive: true });
await writeFile(resolve(buildRoot, 'public/local-assets/service-logo.svg'), await readFile(resolve('apps/fixture-svelte/public/local-assets/service-logo.svg')));
await writeFile(resolve(buildRoot, 'index.html'), '<html lang="ko"><head><meta charset="utf-8"><title>Svelte native SSR</title></head><body><div id="app"></div><script type="module" src="/Users/moreal/github/moreal/krds/scripts/patterns-svelte-hydration-entry.mjs"></script></body></html>');
await build({ root: buildRoot, configFile: false, plugins: [svelte()], resolve: { alias: [packageAlias, { find: '@unofficial-krds/styles', replacement: resolve('packages/styles/dist') }, { find: /^svelte$/, replacement: resolve(require.resolve('svelte/package.json'), '../src/index-client.js') }] }, build: { outDir: artifact, emptyOutDir: true, minify: false, sourcemap: true } });
if (process.env.KRDS_HYDRATION_DIAGNOSTIC) {
    for (const file of await readdir(resolve(artifact, 'assets'))) {
        if (!file.endsWith('.js'))
            continue;
        const target = resolve(artifact, 'assets', file);
        const code = await readFile(target, 'utf8');
        await writeFile(target, code.replace('function hydration_mismatch(location) {', `function hydration_mismatch(location) { console.error('HYDRATION_NODE '+JSON.stringify({node:hydrate_node?.outerHTML??hydrate_node?.data,parent:hydrate_node?.parentElement?.outerHTML}));`));
    }
}
const template = await readFile(resolve(artifact, 'index.html'), 'utf8');
const server = createServer(async (req, res) => { const url = new URL(req.url, 'http://local'); const record = rendered.get(url.searchParams.get('id')); if (record) {
    res.setHeader('Content-Type', 'text/html');
    res.end(template.replace('<div id="app"></div>', `<div id="app">${record.body}</div><script>window.__PATTERN_PROPS__=${JSON.stringify({ state: record.state }).replace(/</g, '\\u003c')}</script>`));
    return;
} try {
    const file = resolve(artifact, '.' + url.pathname);
    res.setHeader('Content-Type', extname(file) === '.js' ? 'text/javascript' : extname(file) === '.css' ? 'text/css' : 'image/svg+xml');
    res.end(await readFile(file));
}
catch {
    res.statusCode = 404;
    res.end();
} });
await new Promise((r, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', r); });
const { chromium } = require('playwright');
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
await page.addInitScript(() => { const original = console.warn; console.warn = (...args) => { original(...args); if (args.some(value => String(value).includes('hydration_mismatch')))
    console.error(new Error('hydration location').stack); }; });
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error' || m.text().includes('hydration_mismatch'))
    errors.push(m.text()); });
try {
    for (const result of results) {
        const errorStart = errors.length;
        await page.goto(`http://127.0.0.1:${server.address().port}/?id=${result.id}`);
        await page.waitForFunction(() => window.__PATTERN_HYDRATED__);
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
        assert.equal(await page.getByRole('main').count(), 1);
        result.hydration = errors.length === errorStart ? 'passed' : 'failed';
        result.hydrationErrors = errors.slice(errorStart);
    }
    await writeFile(resolve(output, 'results.json'), JSON.stringify({ runtime:{node:process.versions.node,browser:browser.version()},results, errors }, null, 2));
    console.log(JSON.stringify({ runtime:{node:process.versions.node,browser:browser.version()},results, errors }, null, 2));
    assert.deepEqual(errors, []);
}
finally {
    await browser.close();
    await new Promise(r => server.close(r));
}
