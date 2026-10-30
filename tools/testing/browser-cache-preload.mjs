// Node --import runs before test-module static imports initialize Playwright's registry.
import { statSync } from 'node:fs';
import { browserPath } from './support.mjs';

// Caller/CI choices (including Playwright's "0" mode) remain authoritative.
// Reuse the existing local installation when present; otherwise Playwright uses
// its standard platform cache, as installed by CI. Never install/download here.
if (process.env.PLAYWRIGHT_BROWSERS_PATH === undefined &&
    statSync(browserPath, { throwIfNoEntry: false })?.isDirectory()) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = browserPath;
}
