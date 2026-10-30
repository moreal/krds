import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const read = (path) => JSON.parse(readFileSync(path));
let failures = 0;
try {
  const fixtureRequire = createRequire(resolve('apps/fixture-vue/package.json'));
  const fixture = read('apps/fixture-vue/package.json');
  assert.equal(fixture.devDependencies['@vue/server-renderer'], '3.5.44');
  const testing = fixtureRequire.resolve('@testing-library/vue/package.json');
  const testingRequire = createRequire(testing);
  const utilsEntry = testingRequire.resolve('@vue/test-utils');
  const utilsRequire = createRequire(utilsEntry);
  const renderer = read(utilsRequire.resolve('@vue/server-renderer/package.json'));
  assert.equal(renderer.version, '3.5.44');
  assert.equal(typeof testingRequire('@vue/test-utils').mount, 'function');
  assert.equal(typeof fixtureRequire('@testing-library/vue').render, 'function');
  console.log(`Vue: real nested @vue/test-utils CJS and @testing-library/vue imports passed with server-renderer ${renderer.version}.`);
} catch (error) { failures++; console.error('Vue nested import failed:', error); }
try {
  const appRequire = createRequire(resolve('apps/storybook-angular/package.json'));
  assert.equal(read(appRequire.resolve('@angular-devkit/build-angular/package.json')).version, '22.2.5');
  const angular = appRequire.resolve('@storybook/angular/package.json');
  const frameworkRequire = createRequire(angular);
  const commonPath = frameworkRequire.resolve('storybook/internal/common');
  const common = await import(pathToFileURL(commonPath));
  for (const [name, version] of [['@angular-devkit/build-angular', '22.2.5'], ['@angular/animations', '22.2.4']]) {
    // Use precisely the preset's no-parent resolver call from its Storybook peer context.
    const directory = common.resolvePackageDir(name);
    assert.equal(read(`${directory}/package.json`).version, version);
    console.log(`Angular: actual Storybook resolvePackageDir('${name}') -> ${version}, from ${commonPath}.`);
  }
} catch (error) { failures++; console.error('Angular preset resolver failed:', error); }
assert.equal(failures, 0, 'All targeted nested imports/resolver calls must pass');
console.log('No browser, Storybook build, native suite, or component implementation was executed.');
