import test from 'node:test';
import assert from 'node:assert/strict';
import config from './main.ts';

test('Storybook owns public copies while preserving other Vite build options', async () => {
  assert.equal(typeof config.viteFinal, 'function');
  const result = await config.viteFinal({build: {minify: false, sourcemap: true}, base: './'});
  assert.deepEqual(result, {build: {minify: false, sourcemap: true, copyPublicDir: false}, base: './'});
  assert.deepEqual(config.staticDirs, ['../public']);
});
