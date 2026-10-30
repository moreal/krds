import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { createBrowserEnvironment } from './browser-environment.mjs';
test('macOS Firefox gets private application data and preserves caller overrides', async () => {
  const first = await createBrowserEnvironment('firefox', { MOZ_APP_DATA: '/caller/explicit' }, 'darwin');
  const second = await createBrowserEnvironment('firefox', {}, 'darwin');
  try {
    assert.equal(first.env.MOZ_APP_DATA, '/caller/explicit');
    assert.equal(first.directories.length, 1);
    assert.equal(second.directories.length, 2);
    assert.notEqual(first.env.MOZ_LOCAL_APP_DATA, second.env.MOZ_LOCAL_APP_DATA);
    for (const directory of [...first.directories, ...second.directories]) await access(directory);
  } finally { await first.cleanup(); await second.cleanup(); }
  for (const directory of [...first.directories, ...second.directories]) await assert.rejects(access(directory));
});
test('other platforms and browsers keep the exact supplied environment', async () => {
  for (const [browser, platform] of [['firefox', 'linux'], ['chromium', 'darwin'], ['webkit', 'darwin']]) {
    const value = await createBrowserEnvironment(browser, { KEY: 'value' }, platform);
    assert.deepEqual(value.env, { KEY: 'value' }); assert.deepEqual(value.directories, []); await value.cleanup();
  }
});
