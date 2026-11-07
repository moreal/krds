import '../../../tools/testing/browser-cache-preload.mjs';
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { chromium } from 'playwright';

// Native Qwik SSR of AccessibleMedia: the media element's computed accessible description is the transcript text (Chromium AX tree).
const config = resolve(import.meta.dirname, 'description/vite.config.mjs');
let out, render, browser;
before(async () => {
  out = await mkdtemp(join(tmpdir(), 'krds-qwik-media-'));
  process.env.KRDS_QWIK_DESCRIPTION_OUT = out;
  await build({ configFile: config });
  await build({ configFile: config, build: { ssr: resolve(import.meta.dirname, 'description/entry.ssr.tsx') } });
  ({ render } = await import(pathToFileURL(join(out, 'server/entry.ssr.js')).href));
  browser = await chromium.launch();
});
after(async () => { await browser?.close(); if (out) await rm(out, { recursive: true, force: true }); });

test('AccessibleMedia computed accessible description is the transcript text', async () => {
  const page = await (await browser.newContext()).newPage();
  await page.setContent((await render()).html);
  const media = page.locator('audio');
  const id = await media.getAttribute('aria-describedby');
  assert.ok(id);
  assert.equal(await page.locator(`[id="${id}"]`).getAttribute('aria-label'), null);
  const session = await page.context().newCDPSession(page);
  await session.send('Accessibility.enable');
  const { root } = await session.send('DOM.getDocument', { depth: 0 });
  const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'audio' });
  const { nodes } = await session.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false });
  const description = nodes[0].properties?.find(p => p.name === 'description')?.value?.value ?? nodes[0].description?.value;
  assert.match(description, /안녕하세요 대본 본문입니다/);
});
