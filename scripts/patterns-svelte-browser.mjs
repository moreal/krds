import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { exerciseSvelte } from '../tests/patterns/svelte.browser.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH = '/private/tmp/krds-playwright-1.64.1';
const require = createRequire(new URL('../apps/fixture-svelte/package.json', import.meta.url));
const { chromium } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');
const artifact = resolve(process.argv[2] ?? 'apps/fixture-svelte/dist');
const output = resolve(process.argv[3] ?? '.superpowers/sdd/PLAN/t11-svelte-logs/browser');
await mkdir(output, { recursive: true });
const server = createServer(async (req, res) => { const file = resolve(artifact, '.' + decodeURIComponent(new URL(req.url, 'http://local').pathname)); try {
    const data = await readFile(file);
    res.setHeader('Content-Type', ({ '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.html': 'text/html' })[extname(file)] ?? 'application/octet-stream');
    res.end(data);
}
catch {
    res.setHeader('Content-Type', 'text/html');
    res.end(await readFile(resolve(artifact, 'index.html')));
} });
await new Promise((r, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', r); });
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
page.setDefaultTimeout(10000);
const external = [];
const errors = [];
page.on('request', r => { if (!r.url().startsWith(origin) && !r.url().startsWith('data:'))
    external.push(r.url()); });
page.on('pageerror', e => errors.push(e.stack));
try {
    const results = await exerciseSvelte(page, origin, { capture: async (name, data) => { if (data)
            await writeFile(resolve(output, name + '.json'), JSON.stringify(data, null, 2));
        else
            await page.screenshot({ path: resolve(output, name + '.png'), fullPage: true }); }, axe: page => new AxeBuilder({ page }).analyze() });
    await writeFile(resolve(output, 'results.json'), JSON.stringify({ runtime:{node:process.versions.node,browser:browser.version()},artifact, origin, results, external, errors }, null, 2));
    console.log(JSON.stringify({ results, external, errors }, null, 2));
    if (results.some(r => r.status !== 'passed') || external.length || errors.length)
        process.exitCode = 1;
}
finally {
    await browser.close();
    await new Promise(r => server.close(r));
}
