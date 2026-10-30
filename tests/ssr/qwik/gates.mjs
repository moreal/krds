import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const directory = resolve('.superpowers/sdd/PLAN/t07q-qwik-logs');
await mkdir(directory, { recursive: true });
const gates = [
    ['library-build', ['workspace', '@unofficial-krds/qwik', 'build:local']],
    ['library-types', ['workspace', '@unofficial-krds/qwik', 'typecheck']],
    ['workspace-boundary', ['workspace', '@unofficial-krds/qwik', 'lint']],
    ['library-exports', ['workspace', '@unofficial-krds/qwik', 'test']],
    ['fixture-types', ['workspace', '@unofficial-krds/fixture-qwik', 'typecheck']],
    ['storybook-types', ['workspace', '@unofficial-krds/storybook-qwik', 'typecheck']],
    ['production-build', ['workspace', '@unofficial-krds/fixture-qwik', 'build:local']],
    ['storybook-build', ['workspace', '@unofficial-krds/storybook-qwik', 'build:local']],
    ['native-siheom', ['test:siheom', '--framework', 'qwik']],
    ['canonical-chromium', ['test:contract', '--framework', 'qwik']],
    ['canonical-webkit', ['test:contract', '--framework', 'qwik', '--browser', 'webkit']],
    ['native-stories', ['test:stories', '--framework', 'qwik']],
    ['production-configuration', ['exec', 'node', 'tests/ssr/qwik/configuration.mjs']],
    ['production-resume', ['exec', 'node', 'tests/ssr/qwik/resume.mjs']],
    ['fix1-resume', ['exec', 'node', 'tests/ssr/qwik/resume.mjs'], { KRDS_RESUME_MODE: 'behavior' }],
    ['fix1-behavior-chromium', ['exec', 'node', 'tests/ssr/qwik/behavior.mjs'], { KRDS_BEHAVIOR_FILTER: 'automatic rejected|enabled tabs|uncontrolled date|raw IME|range field|date popup|same-value popup|tab IDs|default prop|canceled native reset' }],
    ['fix1-behavior-webkit', ['exec', 'node', 'tests/ssr/qwik/behavior.mjs'], { KRDS_BROWSER: 'webkit', KRDS_BEHAVIOR_FILTER: 'automatic rejected|enabled tabs|uncontrolled date|raw IME|range field|date popup|same-value popup|tab IDs|default prop|canceled native reset' }],
    ['fix1-siheom-tabs', ['test:siheom', '--framework', 'qwik', '--component', 'tabs']],
    ['fix1-siheom-date', ['test:siheom', '--framework', 'qwik', '--component', 'date-input']],
    ['fix2-chromium', ['exec', 'node', 'tests/ssr/qwik/fix2.mjs']],
    ['fix2-webkit', ['exec', 'node', 'tests/ssr/qwik/fix2.mjs'], { KRDS_BROWSER: 'webkit' }],
    ['fix1-tabs', ['exec', 'node', 'tests/ssr/qwik/fix1.mjs'], { KRDS_FIX1_FILTER: 'leading' }],
    ['fix1-chromium', ['exec', 'node', 'tests/ssr/qwik/fix1.mjs']],
    ['fix1-webkit', ['exec', 'node', 'tests/ssr/qwik/fix1.mjs'], { KRDS_BROWSER: 'webkit' }],
    ['behavior-chromium', ['exec', 'node', 'tests/ssr/qwik/behavior.mjs']],
    ['behavior-webkit', ['exec', 'node', 'tests/ssr/qwik/behavior.mjs'], { KRDS_BROWSER: 'webkit' }],
];
const selected = process.argv.slice(2), results = [];
for (const [name, args, env = {}] of gates.filter(([name]) => !selected.length || selected.includes(name))) {
    console.log(`Qwik gate ${name}: node tools/yarn.mjs ${args.join(' ')}`);
    const started = new Date().toISOString();
    let output = '';
    const code = await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, ['tools/yarn.mjs', ...args], { env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: '/private/tmp/krds-playwright-1.64.1', ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
        for (const stream of [child.stdout, child.stderr])
            stream.on('data', chunk => { output += String(chunk); process.stdout.write(chunk); });
        child.once('error', reject);
        child.once('close', code => resolve(code ?? 1));
    });
    await writeFile(`${directory}/${name}.log`, `Command: node tools/yarn.mjs ${args.join(' ')}\nEnvironment overrides: ${JSON.stringify(env)}\nStarted: ${started}\nExit: ${code}\n\n${output}`);
    results.push({ name, command: ['node', 'tools/yarn.mjs', ...args], env, code, started, finished: new Date().toISOString(), log: `${directory}/${name}.log` });
    await writeFile(`${directory}/gate-summary${selected.length ? '-selected' : ''}.json`, JSON.stringify(results, null, 2));
}
if (results.some(result => result.code !== 0))
    process.exitCode = 1;
