import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// These exact literals are the release recorder's reviewed output-only transform.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const evidence = resolve(root, process.env.KRDS_DOCS_EVIDENCE ?? 'test-results/docs-pages/browser');
const { runDocsBrowser } = await import(pathToFileURL(resolve(root, 'apps/docs/tests/shell-browser.mjs')).href);
await runDocsBrowser({ root, evidence });
