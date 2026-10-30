import { chromium, webkit } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const output = resolve(dirname(fileURLToPath(import.meta.url)), '../../../.superpowers/sdd/PLAN/t12-docs-logs/postreview-browser');
await mkdir(output, { recursive: true });
const origin = 'http://127.0.0.1:49100';
const results = [];
for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await engine.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  const external = [];
  page.on('pageerror', error => errors.push(error.message));
  await context.route('**/*', route => {
    if (new URL(route.request().url()).hostname !== '127.0.0.1') { external.push(route.request().url()); return route.abort(); }
    return route.continue();
  });
  await page.goto(`${origin}/components/badge`, { waitUntil: 'networkidle' });
  await page.locator('.vp-doc a[href^="/examples/svelte-"]').first().click();
  await page.locator('.vp-doc pre').waitFor();
  const source = await page.locator('.vp-doc pre').innerText();
  assert.ok(source.includes('@unofficial-krds/svelte/badge'));
  assert.ok(source.includes('BadgeProps'));
  const exampleAxe = await new AxeBuilder({ page }).analyze();
  await writeFile(resolve(output, `${name}-example-axe.json`), JSON.stringify(exampleAxe, null, 2));
  assert.deepEqual(exampleAxe.violations, []);
  await page.screenshot({ path: resolve(output, `${name}-svelte-example.png`) });
  await page.goto(`${origin}/legal/`, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'local distribution inventory', exact: true }).click();
  await page.getByRole('heading', { name: 'Source and license notices', level: 1 }).waitFor();
  const legal = await page.locator('main').innerText();
  assert.ok(legal.includes('Lee Dogeon'));
  assert.ok(legal.includes('KRDS/KOGL'));
  const legalAxe = await new AxeBuilder({ page }).analyze();
  await writeFile(resolve(output, `${name}-legal-axe.json`), JSON.stringify(legalAxe, null, 2));
  assert.deepEqual(legalAxe.violations, []);
  await page.screenshot({ path: resolve(output, `${name}-legal-sidecar.png`) });
  const policy = await page.locator('a[href$="KRDS-copyright-en.html.txt"]').getAttribute('href');
  const response = await page.goto(new URL(policy, page.url()).href);
  assert.match(response.headers()['content-type'], /^text\/plain/);
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  results.push({ browser: name, status: 'passed', checks: ['Badge links to actual typed public Svelte consumer', 'source includes public subpath and Props', 'Svelte example raw axe zero', 'legal sidecar reachable from legal guide', 'independent/KRDS rights remain separate', 'legal raw axe zero', 'original policy served as text/plain', 'browser errors and external requests zero'], errors, external });
  await browser.close();
}
await writeFile(resolve(output, 'report.json'), JSON.stringify({ results, scope: 'Post-review Svelte/compiler-source and legal-link delta only; no native behavior acceptance awarded.' }, null, 2) + '\n');
console.log(JSON.stringify(results));
