import '../../../tools/testing/browser-cache-preload.mjs';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';

// Native Qwik SSR of Accordion heading levels and TextList list roles.
const config = resolve(import.meta.dirname, 'accordion-text-list/vite.config.mjs');
let out, render, browser;
before(async () => {
  out = await mkdtemp(join(tmpdir(), 'krds-qwik-semantics-'));
  process.env.KRDS_QWIK_SEMANTICS_OUT = out;
  await build({ configFile: config });
  await build({ configFile: config, build: { ssr: resolve(import.meta.dirname, 'accordion-text-list/entry.ssr.tsx') } });
  ({ render } = await import(pathToFileURL(join(out, 'server/entry.ssr.js')).href));
  browser = await chromium.launch();
});
after(async () => { await browser?.close(); if (out) await rm(out, { recursive: true, force: true }); });

async function open(id) {
  const context = await browser.newContext(), page = await context.newPage();
  await page.setContent((await render(id)).html);
  return { page, close: () => context.close() };
}
const headings = page => page.evaluate(() => [...document.querySelectorAll('button[aria-controls]')].map(button => button.parentElement?.tagName));
const roles = (page, selector) => page.evaluate(selector => [...document.querySelectorAll(selector)].map(node => node.getAttribute('role')), selector);

// KRDS accordion accessibility (component_04_07 L1117): the header title follows the page outline with h1–h6.
test('Accordion headers are h3 by default and follow headingLevel', async () => {
  for (const [id, tag] of [['accordion-default', 'H3'], ['accordion-level-five', 'H5']]) {
    const { page, close } = await open(id);
    try { assert.deepEqual(await headings(page), [tag, tag]); } finally { await close(); }
  }
});

// KRDS text list accessibility (component_04_13 L1118–1119): with list-style none, lists carry role="list" and items role="listitem".
test('TextList states list and listitem roles on every level', async () => {
  for (const id of ['text-list-unordered', 'text-list-ordered']) {
    const { page, close } = await open(id);
    try {
      assert.deepEqual(await roles(page, 'ul,ol'), ['list', 'list', 'list']);
      assert.deepEqual(await roles(page, 'li'), ['listitem', 'listitem', 'listitem', 'listitem']);
    } finally { await close(); }
  }
});
