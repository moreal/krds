// Node --import runs before test-module static imports initialize Playwright's registry.
import { browserPath } from './support.mjs';

// Caller/CI choices (including Playwright's "0" mode) remain authoritative.
// Select the same portable default before installation and consumption, even
// when the cache does not exist yet. Never install/download here.
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
