import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** Isolate Firefox's application data as well as its Playwright profile.
 * macOS 27 protects the installed user's Firefox data (Playwright #42768).
 * No browser binary, permission, HOME, profile, or version is changed.
 * Explicit caller overrides are preserved. The caller owns cleanup after close.
 */
export async function createBrowserEnvironment(browserName, base = process.env, platform = process.platform) {
  const env = { ...base };
  const directories = [];
  if (browserName === 'firefox' && platform === 'darwin') {
    for (const name of ['MOZ_APP_DATA', 'MOZ_LOCAL_APP_DATA']) {
      if (env[name] !== undefined) continue;
      const directory = await mkdtemp(join(tmpdir(), 'krds-firefox-'));
      directories.push(directory);
      env[name] = directory;
    }
  }
  return { env, directories, async cleanup() {
    await Promise.all(directories.map(directory => rm(directory, { recursive: true, force: true })));
  } };
}
