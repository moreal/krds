#!/usr/bin/env node
// Drive one KRDS component in a built native fixture app the way a user would, headless, and keep the evidence.
//   node .claude/skills/verify-krds-fixtures/drive.mjs doctor [--framework <id>]
//   node .claude/skills/verify-krds-fixtures/drive.mjs cases [--component <id>]
//   node .claude/skills/verify-krds-fixtures/drive.mjs run --framework <id> --component <id> --case <id> --name <label> [actions]
// Each run serves its own snapshot of the fixture build on a free port and closes it when it ends.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(import.meta.dirname, '../../..');
const self = fileURLToPath(import.meta.url);
const { node } = JSON.parse(readFileSync(`${root}/compatibility/toolchain.json`, 'utf8'));
if (process.versions.node !== node.version) {
  const result = spawnSync(node.installedBinary, [self, ...process.argv.slice(2)], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exit(result.status ?? 2);
}

const frameworks = ['react', 'solid', 'svelte', 'vue', 'lit', 'qwik', 'angular', 'solid-next'];
const [command, ...rest] = process.argv.slice(2);
const usage = `Usage:
  drive.mjs doctor [--framework <id>]
  drive.mjs cases [--component <id>]
  drive.mjs run --framework <id> --component <id> --case <id> --name <label> [--viewport 1920x1080] [actions]
Actions run in the order given. <role> and <name> are the ARIA role and exact accessible name.
  --click <role> <name>          --hover <role> <name>         --focus <role> <name>
  --fill <role> <name> <value>   --press <key>                 --wait <milliseconds>
  --expect <role> <name>         the element is visible
  --expect-none <role> <name>    no such element is visible
  --expect-focus <role> <name>   the element holds keyboard focus
  --expect-text <text>           the text is visible somewhere on the page
Frameworks: ${frameworks.join(', ')}`;

function fail(message) { console.error(message); process.exit(2); }

function manifests() {
  const read = (path) => JSON.parse(readFileSync(join(root, path), 'utf8')).cases;
  return [
    ...read('catalog/full-catalog-scenarios.json').map((item) => ({ ...item, source: 'catalog' })),
    ...read('catalog/fixture-cases.json').map((item) => ({ ...item, source: 'pilot', expectedOutcome: item.description })),
  ];
}

function fixtureIndex(framework) {
  const base = join(root, `apps/fixture-${framework}/dist`);
  return existsSync(join(base, 'browser/index.html')) ? join(base, 'browser/index.html') : join(base, 'index.html');
}

// Nx hashes every input of the fixture and its packages, so its build is the only reliable freshness test.
// An unchanged fixture is a cache hit of about two seconds.
function build(framework, log) {
  const result = spawnSync(process.execPath, [join(root, 'tools/yarn.mjs'), 'nx', 'run', `fixture-${framework}:build`, '--output-style=static'], { cwd: root, encoding: 'utf8' });
  writeFileSync(log, `${result.stdout}${result.stderr}`);
  return result.status === 0;
}

async function browserState() {
  const { chromium } = await import('playwright');
  const path = chromium.executablePath();
  return existsSync(path) ? { ok: true, path } : { ok: false, path };
}

function option(name) { const index = rest.indexOf(name); return index === -1 ? undefined : rest[index + 1]; }

if (command === 'doctor') {
  const selected = option('--framework') ? [option('--framework')] : frameworks;
  let problems = 0;
  console.log(`node ${process.versions.node} (selected ${node.version})`);
  const browser = await browserState();
  if (!browser.ok) problems++;
  console.log(browser.ok ? `chromium ok: ${browser.path}` : `chromium MISSING at ${browser.path}. Installing it is a download; ask the user first.`);
  for (const framework of selected) {
    if (!frameworks.includes(framework)) fail(`Unknown framework: ${framework}`);
    const index = fixtureIndex(framework);
    if (!existsSync(index)) problems++;
    console.log(existsSync(index) ? `fixture-${framework} has a build from ${statSync(index).mtime.toISOString()} (run rebuilds it when its sources changed)` : `fixture-${framework} has NO build. Build: node tools/yarn.mjs nx run fixture-${framework}:build`);
  }
  process.exit(problems === 0 ? 0 : 2);
}

if (command === 'cases') {
  const component = option('--component');
  const cases = manifests().filter((item) => !component || item.componentId === component);
  if (!cases.length) fail(component ? `No cases for component ${component}. Run without --component to list all.` : 'No cases found.');
  if (component) for (const item of cases) console.log(`${item.componentId} ${item.caseId} [${item.source}: ${item.requiredFrameworks ? item.requiredFrameworks.join(', ') : 'all eight frameworks'}] ${item.expectedOutcome}`);
  else for (const id of [...new Set(cases.map((item) => item.componentId))]) console.log(`${id}: ${cases.filter((item) => item.componentId === id).map((item) => item.caseId).join(', ')}`);
  process.exit(0);
}

if (command !== 'run') fail(usage);

const settings = { viewport: '1920x1080' };
const actions = [];
const arity = { '--click': 2, '--hover': 2, '--focus': 2, '--fill': 3, '--press': 1, '--wait': 1, '--expect': 2, '--expect-none': 2, '--expect-focus': 2, '--expect-text': 1 };
for (let index = 0; index < rest.length; index++) {
  const flag = rest[index];
  const take = (count) => { const values = rest.slice(index + 1, index + 1 + count); if (values.length !== count) fail(`${flag} needs ${count} value(s).\n${usage}`); index += count; return values; };
  if (['--framework', '--component', '--case', '--name', '--viewport'].includes(flag)) settings[flag.slice(2)] = take(1)[0];
  else if (flag in arity) actions.push({ kind: flag.slice(2), values: take(arity[flag]) });
  else fail(`Unknown option: ${flag}\n${usage}`);
}
for (const required of ['framework', 'component', 'case', 'name']) if (!settings[required]) fail(`Missing --${required}.\n${usage}`);
if (!frameworks.includes(settings.framework)) fail(`Unknown framework: ${settings.framework}`);
if (!/^[a-z0-9-]+$/.test(settings.name)) fail('--name must be lowercase letters, digits and hyphens.');
const size = /^(\d+)x(\d+)$/.exec(settings.viewport);
if (!size) fail('--viewport must look like 1920x1080.');
const selected = manifests().find((item) => item.componentId === settings.component && item.caseId === settings.case);
if (selected?.requiredFrameworks && !selected.requiredFrameworks.includes(settings.framework)) fail(`${settings.component}/${settings.case} is not implemented in ${settings.framework}. It covers: ${selected.requiredFrameworks.join(', ')}.`);
if (!selected) fail(`No case ${settings.component}/${settings.case}. List them with: drive.mjs cases --component ${settings.component}`);

const browser = await browserState();
if (!browser.ok) fail(`Chromium is missing at ${browser.path}. Installing it is a download; ask the user first.`);

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const evidence = join(root, 'test-results/verify', `${settings.name}-${settings.framework}-${stamp}`);
mkdirSync(evidence, { recursive: true });
if (!build(settings.framework, join(evidence, 'build.log'))) fail(`fixture-${settings.framework} did not build. Read ${relative(root, join(evidence, 'build.log'))}`);

const { serveProduction, fixtureDist } = await import(join(root, 'tools/testing/support.mjs'));
const { chromium } = await import('playwright');
const server = await serveProduction(await fixtureDist(settings.framework), { fixture: true });
const instance = await chromium.launch({ headless: true });
const record = {
  framework: settings.framework, component: settings.component, case: settings.case, expectedOutcome: selected.expectedOutcome ?? null,
  url: `${server.origin}/fixtures/${encodeURIComponent(settings.component)}?case=${encodeURIComponent(settings.case)}`,
  artifactSha256: server.snapshot.sha256, viewport: settings.viewport,
  startedAt: new Date().toISOString(), steps: [], pageErrors: [], consoleErrors: [], status: 'failed',
};
let exitCode = 1;
try {
  const context = await instance.newContext({
    viewport: { width: Number(size[1]), height: Number(size[2]) }, locale: selected.environment?.locale ?? 'ko-KR', timezoneId: 'Asia/Seoul',
    colorScheme: selected.environment?.colorMode ?? 'light', reducedMotion: 'reduce', serviceWorkers: 'block',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  page.on('pageerror', (error) => record.pageErrors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') record.consoleErrors.push(message.text()); });

  const capture = async (label) => {
    const prefix = `${String(record.steps.length).padStart(2, '0')}-${label}`;
    writeFileSync(join(evidence, `${prefix}.aria.yml`), await page.locator('body').ariaSnapshot());
    await page.screenshot({ path: join(evidence, `${prefix}.png`) });
    return prefix;
  };
  const step = async (label, description, run) => {
    const entry = { step: record.steps.length, action: description, ok: false };
    try { await run(); entry.ok = true; } catch (error) { entry.error = String(error.message ?? error).split('\n')[0]; }
    entry.focused = await page.evaluate(() => { let element = document.activeElement; while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement; return element && element !== document.body ? `${element.tagName.toLowerCase()} "${(element.getAttribute('aria-label') ?? element.textContent ?? '').trim().slice(0, 60)}"` : null; }).catch(() => null);
    entry.evidence = await capture(label).catch((error) => `capture failed: ${error.message}`);
    record.steps.push(entry);
    console.log(`${entry.ok ? 'ok  ' : 'FAIL'} ${String(entry.step).padStart(2, '0')} ${description}${entry.ok ? '' : `\n     ${entry.error}`}`);
    return entry.ok;
  };
  const target = ([role, name]) => page.getByRole(role, { name, exact: true });

  let passing = await step('open', `open ${record.url}`, async () => {
    await page.goto(record.url);
    await page.waitForFunction(() => window.__KRDS_FIXTURE__?.protocol === 1);
    const actual = await page.evaluate(() => window.__KRDS_FIXTURE__.framework);
    if (actual !== settings.framework) throw new Error(`fixture reports framework ${actual}, expected ${settings.framework}`);
    await page.getByRole('status', { name: 'Fixture health', exact: true }).waitFor();
    if (await page.getByRole('note').filter({ hasText: 'Component not implemented' }).count()) throw new Error('fixture shows "Component not implemented" for this case');
  });
  for (const action of actions) {
    if (!passing) break;
    const { kind, values } = action;
    const description = `${kind} ${values.map((value) => JSON.stringify(value)).join(' ')}`;
    passing = await step(kind, description, async () => {
      if (kind === 'click') await target(values).click();
      else if (kind === 'hover') await target(values).hover();
      else if (kind === 'focus') await target(values).focus();
      else if (kind === 'fill') await target(values).fill(values[2]);
      else if (kind === 'press') await page.keyboard.press(values[0]);
      else if (kind === 'wait') await page.waitForTimeout(Number(values[0]));
      else if (kind === 'expect') await target(values).first().waitFor({ state: 'visible' });
      else if (kind === 'expect-none') { await page.waitForTimeout(250); const count = await target(values).filter({ visible: true }).count(); if (count) throw new Error(`${count} visible element(s) match`); }
      else if (kind === 'expect-focus') { await page.waitForTimeout(250); if (!(await target(values).evaluate((element) => { let active = document.activeElement; while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement; return element === active; }))) throw new Error('the element does not hold focus'); }
      else if (kind === 'expect-text') await page.getByText(values[0], { exact: false }).first().waitFor({ state: 'visible' });
    });
  }
  record.events = await page.evaluate(() => window.__KRDS_FIXTURE__?.readEvents() ?? null).catch(() => null);
  if (passing && record.pageErrors.length) console.log(`FAIL uncaught page error: ${record.pageErrors[0]}`);
  if (passing && !record.pageErrors.length) { record.status = 'passed'; exitCode = 0; }
} catch (error) {
  record.error = String(error.stack ?? error);
  console.error(record.error);
  exitCode = 2;
} finally {
  await instance.close();
  await server.close();
  record.finishedAt = new Date().toISOString();
  writeFileSync(join(evidence, 'run.json'), JSON.stringify(record, null, 2) + '\n');
  console.log(`${record.status.toUpperCase()} ${settings.framework} ${settings.component}/${settings.case}\nEvidence: ${relative(root, evidence)}`);
}
process.exit(exitCode);
