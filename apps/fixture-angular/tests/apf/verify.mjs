import '../../../../tools/check-node.mjs';
import { mkdtemp, cp, mkdir, readdir, symlink, readFile, writeFile, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const root = resolve(import.meta.dirname, '../../../..');
const require = createRequire(join(root, 'packages/angular/package.json'));
const node = process.execPath;
const directory = await mkdtemp(join(tmpdir(), 'krds-angular-apf-consumer-'));
const evidence = resolve(process.env.KRDS_SSR_OUTPUT ?? join(root, '.superpowers/sdd/PLAN/t10-angular-logs/apf'));
await mkdir(evidence, { recursive: true });
await cp(join(import.meta.dirname, 'consumer'), directory, { recursive: true });
await mkdir(join(directory, 'node_modules/@unofficial-krds'), { recursive: true });
for (const entry of await readdir(join(root, 'packages/angular/node_modules'), { withFileTypes: true })) {
  if (entry.name === '.bin' || entry.name === '@unofficial-krds') continue;
  await symlink(await realpath(join(root, 'packages/angular/node_modules', entry.name)), join(directory, 'node_modules', entry.name), 'dir');
}
const angularPackage = join(directory, 'node_modules/@unofficial-krds/angular');
const tarball = join(directory, 'angular.tgz');
async function execute(command, args, cwd) {
  await new Promise((resolveRun, reject) => {
    const child = spawn(command, args, { cwd, env: { ...process.env, NG_CLI_ANALYTICS: 'false' }, stdio: 'inherit' });
    child.once('error', reject); child.once('exit', code => code === 0 ? resolveRun() : reject(new Error(`${command} exited ${code}`)));
  });
}
await execute(node, [join(root, 'tools/yarn.mjs'), 'workspace', '@unofficial-krds/angular', 'pack', '--out', tarball], root);
await mkdir(angularPackage, { recursive: true });
await execute('tar', ['-xzf', tarball, '-C', angularPackage, '--strip-components=1'], directory);
assert.ok(!(await readdir(angularPackage)).includes('src'), 'Packed consumer must not contain a raw Angular source directory.');
for (const name of ['contracts', 'styles', 'tokens']) await symlink(join(root, 'packages', name), join(directory, 'node_modules/@unofficial-krds', name), 'dir');
await writeFile(join(directory, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
const manifest = JSON.parse(await readFile(join(directory, 'node_modules/@unofficial-krds/angular/package.json'), 'utf8'));
assert.equal(manifest.peerDependencies['@angular/core'], '^22.2.4');
for (const entry of Object.keys(manifest.exports)) {
  assert.ok(manifest.exports[entry]?.types); await readFile(join(directory, 'node_modules/@unofficial-krds/angular', manifest.exports[entry].types));
}
const bundle = await readFile(join(angularPackage, 'dist/fesm2022/unofficial-krds-angular.mjs'), 'utf8');
assert.ok(bundle.includes('ɵɵngDeclareComponent'), 'Distribution must retain official partial declarations before consumer linking.');
await execute(node, ['--input-type=module', '-e', "if ('document' in globalThis || 'window' in globalThis) throw new Error('Expected no browser globals'); await import('@angular/compiler'); const library = await import('@unofficial-krds/angular'); if (!library.DateInput || !library.Calendar) throw new Error('Missing exports'); console.log('DOM-free packed APF module import passed');"], directory);
const angularCli = require.resolve('@angular/cli/bin/ng.js');
const log = [];
await new Promise((resolveRun, reject) => {
  const child = spawn(node, [angularCli, 'build', 'consumer'], { cwd: directory, env: { ...process.env, NG_CLI_ANALYTICS: 'false', NG_BUILD_MAX_WORKERS: '2' } });
  for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => { log.push(chunk.toString()); process.stdout.write(chunk); });
  child.once('error', reject); child.once('exit', code => code === 0 ? resolveRun() : reject(new Error(`Outside consumer Angular build exit ${code}`)));
}).finally(() => writeFile(join(evidence, 'outside-consumer-build.log'), log.join('')));
assert.ok(!/\bERROR\b/.test(log.join('')), 'Official SSR emitted a runtime error despite its exit code.');
const html = await readFile(join(directory, 'dist/browser/index.html'), 'utf8');
for (const text of ['Independent Angular APF consumer', '2024-02-29', 'Region', 'Visit date', 'First content', 'February 2024', 'ngh=']) assert.ok(html.includes(text), `SSR document missing ${text}`);
assert.ok(!html.includes('data-workspace-probe'));
await writeFile(join(evidence, 'outside-consumer-ssr.html'), html);
const {createHash}=await import('node:crypto');
const partialEntries=Object.keys(manifest.exports).filter(entry=>entry!=='.'&&entry!=='./forms');
assert.equal(partialEntries.length,54);
for(const entry of partialEntries)if(entry!=='./favicon')assert.ok(html.includes('data-krds-component=\"'+entry.slice(2)+'\"')||html.includes('<krds-'+entry.slice(2)), 'SSR missing native '+entry);
const publicSource=await readFile(join(directory,'src/public-catalog-examples.ts'),'utf8');
await writeFile(join(evidence,'full-catalog-consumer.json'),JSON.stringify({directory,tarball,tarballSha256:createHash('sha256').update(await readFile(tarball)).digest('hex'),publicSourceSha256:createHash('sha256').update(publicSource).digest('hex'),entries:partialEntries,strictTemplates:true,sourceAliases:[],rendering:'official Angular CLI linked partial APF + SSR prerender + provideClientHydration + provideZonelessChangeDetection',ssrPassed:true},null,2));
await writeFile(join(evidence, 'outside-consumer.json'), JSON.stringify({ directory, tarball, package: await realpath(join(directory, 'node_modules/@unofficial-krds/angular')), sourceAliases: [], compilation: 'official partial APF linked by Angular CLI', runtime: '22.2.4', cli: '22.2.5', changeDetection: 'OnPush + provideZonelessChangeDetection', rendering: 'Angular SSR prerender + provideClientHydration', ssrPassed: true }, null, 2));
console.log(`Outside APF consumer and SSR passed: ${directory}`);
