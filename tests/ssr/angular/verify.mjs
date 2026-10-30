import { mkdtemp, cp, mkdir, readdir, symlink, readFile, writeFile, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import {snapshot,sha256} from '../../compatibility/evidence.mjs';
import {retainArtifactCopies,captureArtifactInventory} from '../../compatibility/artifact-evidence.mjs';
const root = resolve(import.meta.dirname, '../../..');
const require = createRequire(join(root, 'packages/angular/package.json'));
const node = JSON.parse(await readFile(join(root, 'compatibility/toolchain.json'), 'utf8')).node.installedBinary;
const directory = await mkdtemp(join(tmpdir(), 'krds-angular-apf-consumer-'));
const evidence = resolve(process.env.KRDS_SSR_OUTPUT ?? join(root, '.superpowers/sdd/PLAN/t07a-angular-logs'));
await mkdir(evidence, { recursive: true });
const sourceSha256=process.env.KRDS_SSR_SOURCE_SHA256??(await snapshot(['angular'])).sha256;
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
const providedTarball=process.env.KRDS_ANGULAR_SSR_TARBALL;
if(providedTarball){const bytes=await readFile(resolve(providedTarball));assert.ok(process.env.KRDS_ANGULAR_SSR_TARBALL_SHA256,'Immutable input tarball requires its granted SHA-256');assert.equal(sha256(bytes),process.env.KRDS_ANGULAR_SSR_TARBALL_SHA256,'Granted Angular tarball identity changed');await writeFile(tarball,bytes);}
else await execute(node, [join(root, 'tools/yarn.mjs'), 'workspace', '@unofficial-krds/angular', 'pack', '--out', tarball], root);
const inputTarball={kind:providedTarball?'granted-immutable-tarball':'leased-workspace-pack',source:providedTarball?resolve(providedTarball):join(root,'packages/angular/dist'),sha256:sha256(await readFile(tarball))};
await mkdir(angularPackage, { recursive: true });
await execute('tar', ['-xzf', tarball, '-C', angularPackage, '--strip-components=1'], directory);
assert.ok(!(await readdir(angularPackage)).includes('src'), 'Packed consumer must not contain a raw Angular source directory.');
for (const name of ['contracts', 'styles', 'tokens']) await symlink(join(root, 'packages', name), join(directory, 'node_modules/@unofficial-krds', name), 'dir');
await writeFile(join(directory, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
const manifest = JSON.parse(await readFile(join(directory, 'node_modules/@unofficial-krds/angular/package.json'), 'utf8'));
assert.equal(manifest.peerDependencies['@angular/core'], '^22.2.4');
for (const entry of ['.', './button', './native-select', './modal', './tabs', './calendar', './date-input', './forms']) {
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
const html = await readFile(join(directory, 'dist/browser/index.html'), 'utf8');
for (const text of ['Independent Angular APF consumer', '2024-02-29', 'Region', 'Visit date', 'First content', 'February 2024', 'ngh=']) assert.ok(html.includes(text), `SSR document missing ${text}`);
assert.ok(!html.includes('data-workspace-probe'));
await writeFile(join(evidence, 'outside-consumer-ssr.html'), html);
const retainedDirectory=join(evidence,'linked-consumer');
const copies=await retainArtifactCopies([{source:tarball,name:'input/angular.tgz'},{source:angularPackage,name:'input/package'},{source:join(directory,'dist'),name:'dist'},{source:join(directory,'src'),name:'src'},{source:join(directory,'angular.json'),name:'angular.json'},{source:join(directory,'tsconfig.json'),name:'tsconfig.json'}],retainedDirectory);
await readFile(join(retainedDirectory,'dist/server/main.server.mjs'));
const retainedTarball=join(retainedDirectory,'input/angular.tgz'),servedDirectory=join(retainedDirectory,'dist/browser');
const artifactRoots=[retainedDirectory];
const artifacts=await captureArtifactInventory(evidence,'linked-consumer-artifacts',artifactRoots,sourceSha256);
await writeFile(join(evidence,'retention-map.json'),JSON.stringify({sourceSha256,copies},null,2));
await rm(directory,{recursive:true,force:true});
await writeFile(join(evidence, 'outside-consumer.json'), JSON.stringify({ directory:retainedDirectory,temporaryDirectory:directory,temporaryDirectoryCleaned:true,tarball:retainedTarball,inputTarball, retainedDirectory,retainedTarball,servedDirectory,artifactEvidence:{sourceSha256,produced:artifacts}, package:join(retainedDirectory,'input/package'), sourceAliases: [], compilation: 'official partial APF linked by Angular CLI', runtime: '22.2.4', cli: '22.2.5', changeDetection: 'OnPush + provideZonelessChangeDetection', rendering: 'Angular SSR prerender + provideClientHydration', ssrPassed: true }, null, 2));
console.log(`Outside APF consumer and SSR passed: ${directory}`);
