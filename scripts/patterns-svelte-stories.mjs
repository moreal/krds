import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve, dirname, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import assert from 'node:assert/strict';
process.env.PLAYWRIGHT_BROWSERS_PATH = '/private/tmp/krds-playwright-1.64.1';
const require = createRequire(new URL('../apps/storybook-svelte/package.json', import.meta.url));
const snapshot = process.env.KRDS_SVELTE_PACKAGE_SNAPSHOT;
if (!snapshot)
    throw new Error('An immutable package snapshot is required');
const existingArtifact=process.env.KRDS_SVELTE_STORYBOOK_ARTIFACT;
const artifact = existingArtifact ?? '/private/tmp/krds-t11-svelte-storybook';
const config = '/private/tmp/krds-t11-svelte-storybook-config';
const output = resolve(process.argv[2] ?? '.superpowers/sdd/PLAN/t11-svelte-logs/stories');
await mkdir(config, { recursive: true });
await mkdir(output, { recursive: true });
await writeFile(resolve(config, 'main.mjs'), `export default {framework:{name:${JSON.stringify(dirname(require.resolve('@storybook/svelte-vite/package.json')))},options:{builder:{viteConfigPath:${JSON.stringify(resolve('apps/storybook-svelte/vite.config.ts'))}}}},stories:[${JSON.stringify(resolve('apps/storybook-svelte/src/stories/patterns/*.stories.ts'))}],staticDirs:[${JSON.stringify(resolve('apps/storybook-svelte/public'))}],addons:[],core:{disableTelemetry:true},viteFinal:async config=>({...config,resolve:{...config.resolve,alias:[...(Array.isArray(config.resolve?.alias)?config.resolve.alias:[]),{find:/^@unofficial-krds\\/svelte$/,replacement:${JSON.stringify(resolve(snapshot, 'dist/index.js'))}}]}})};`);
const build = existingArtifact ? {status:0} : spawnSync(process.execPath, ['tools/yarn.mjs', 'workspace', '@unofficial-krds/storybook-svelte', 'exec', 'storybook', 'build', '--config-dir', config, '--output-dir', artifact], { stdio: 'inherit', env: { ...process.env, STORYBOOK_DISABLE_TELEMETRY: '1' } });
if (build.status !== 0)
    process.exit(build.status ?? 1);
const index = JSON.parse(await readFile(resolve(artifact, 'index.json'), 'utf8'));
const ids = Object.keys(index.entries).filter(id => id.startsWith('krds-pattern-'));
assert.equal(ids.length, 16);
const server = createServer(async (req, res) => { try {
    const file = resolve(artifact, '.' + new URL(req.url, 'http://local').pathname);
    res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.html': 'text/html' })[extname(file)] ?? 'application/octet-stream');
    res.end(await readFile(file));
}
catch {
    res.statusCode = 404;
    res.end();
} });
await new Promise((r, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', r); });
const origin = `http://127.0.0.1:${server.address().port}`;
const { chromium } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const external = [];
const errors = [];
const results = [];
page.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:'))
    external.push(r.url()); });
page.on('pageerror', e => errors.push(e.message));
try {
    for (const id of ids) {
        await page.goto(`${origin}/iframe.html?id=${id}&viewMode=story`);
        await page.locator('#storybook-root main').waitFor();
        assert.equal(await page.evaluate(() => window.__KRDS_FIXTURE__), undefined);
        const axe = await new AxeBuilder({ page }).include('#storybook-root').analyze();
        await writeFile(resolve(output, id + '-axe.json'), JSON.stringify(axe, null, 2));
        await page.screenshot({ path: resolve(output, id + '.png'), fullPage: true });
        assert.equal(axe.violations.length, 0, JSON.stringify(axe.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) }))));
        results.push({ id, status: 'passed' });
    }
    await writeFile(resolve(output, 'results.json'), JSON.stringify({runtime:{node:process.versions.node,browser:browser.version()}, artifact, snapshot, results, external, errors }, null, 2));
    console.log(JSON.stringify({ results, external, errors }, null, 2));
    assert.equal(external.length, 0);
    assert.equal(errors.length, 0);
}
finally {
    await browser.close();
    await new Promise(r => server.close(r));
}
