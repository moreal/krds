import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { READY, expectedSourceDisplay, frameFloor } from './row.mjs';
import { exercise } from './scenarios.mjs';
import { paintedScreenshot } from './png.mjs';

/**
 * Shell/frame-boundary proof for one framework (the original Button/Accordion gate): lazy
 * loading, multi-example sharing, bounded resizing, token/stale rejection, Reset, return
 * focus, copy/download fidelity, 1440/390/320 widths, 200% text and the no-JS source.
 * React in Chromium keeps the historical evidence filenames.
 */
export async function shellProof({ browser, browserName, origin, framework, registry, evidence }) {
  const legacy = framework === 'react' && browserName === 'chromium';
  const dir = legacy ? evidence : resolve(evidence, 'shell', browserName, framework);
  await mkdir(dir, { recursive: true });
  const lines = [];
  const clipboard = browserName === 'chromium';
  const context = await browser.newContext(clipboard ? { permissions: ['clipboard-read', 'clipboard-write'] } : {});
  try {
    const page = await context.newPage(); const errors = []; page.on('pageerror', error => errors.push(error.message));
    const ready = p => p.locator('.native-demo-status').filter({ hasText: READY }).waitFor({ timeout: 20000 });
    // Anchored reference navigation must not eagerly start a distant runtime.
    const lazy = await context.newPage(); const nativeRequests = [];
    lazy.on('request', request => { if (request.url().includes('/previews/')) nativeRequests.push(request.url()); });
    await lazy.goto(`${origin}/krds/components/button.html?framework=${framework}#native-availability`);
    await lazy.waitForFunction(() => document.querySelector('[data-docs-ready]')?.dataset.docsReady === 'true');
    await lazy.waitForTimeout(150); assert.equal(await lazy.locator('.native-demo iframe').count(), 0); assert.deepEqual(nativeRequests, []);
    await lazy.locator('.native-demo-frame').scrollIntoViewIfNeeded(); await ready(lazy); assert.equal(await lazy.locator('.native-demo iframe').count(), 1);
    assert.ok(nativeRequests.every(url => url.includes(`/previews/${framework}/`))); await lazy.close();
    // A genuine second native example must be shareable, including its exact source.
    const secondaryRow = registry.find(r => r.framework === framework && r.componentId === 'button' && r.exampleId === 'secondary' && r.status === 'playable');
    if (framework === 'react' && !secondaryRow) throw new Error('Multi-example regression requires the authored secondary native Button artifact');
    await page.goto(`${origin}/krds/components/button.html?framework=${framework}#button`);
    await ready(page);
    if (secondaryRow) {
      const variants = page.getByLabel('예시', { exact: true });
      await variants.selectOption('secondary'); await ready(page);
      assert.equal(new URL(page.url()).searchParams.get('example'), 'secondary'); assert.equal(new URL(page.url()).hash, '#button');
      const secondary = page.frameLocator('.native-demo iframe'); await secondary.getByRole('button', { name: '관심 목록에 담기', exact: true }).click(); await secondary.getByText('관심 목록 1건', { exact: true }).waitFor();
      assert.match(await page.locator('.native-demo pre code').first().textContent(), /SecondaryButtonExample/);
      await page.reload(); await ready(page); assert.equal(await page.getByLabel('예시', { exact: true }).inputValue(), 'secondary'); await secondary.getByText('관심 목록 0건', { exact: true }).waitFor(); assert.match(await page.locator('.native-demo pre code').first().textContent(), /SecondaryButtonExample/);
      await paintedScreenshot(page, resolve(dir, 'button-secondary.png'));
      lines.push('button/secondary: shared URL, reload restore, native result');
    }
    // Package switch keeps selector focus and selects the matching route/source.
    const others = [...new Set(registry.filter(r => r.componentId === 'button' && r.framework !== framework).map(r => r.framework))];
    if (others.length) {
      await page.goto(`${origin}/krds/components/button.html?framework=${framework}`); await ready(page);
      const selector = page.getByLabel('프레임워크 패키지', { exact: true });
      await selector.focus(); await selector.selectOption(others[0]);
      assert.ok(await selector.evaluate(node => node === document.activeElement), 'package switch keeps selector focus');
      assert.equal(new URL(page.url()).searchParams.get('framework'), others[0]);
      const target = registry.find(r => r.framework === others[0] && r.componentId === 'button' && r.exampleId === 'default');
      if (target.status === 'playable') { await ready(page); assert.ok((await page.locator('.native-demo iframe').getAttribute('src')).includes(`/previews/${others[0]}/`)); }
      lines.push(`package switch ${framework} -> ${others[0]} keeps focus`);
    } else lines.push('package switch: only one framework assembled; not exercised');
    for (const component of ['button', 'accordion']) {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(`${origin}/krds/components/${component}.html?framework=${framework}`); await ready(page);
      assert.equal(await page.locator('.native-demo iframe').count(), 1);
      const iframe = page.frameLocator('.native-demo iframe');
      // Shared semantic scenario (same as the matrix) so every framework's native Button/Accordion is exercised.
      const mounted = await (await page.locator('.native-demo iframe').elementHandle()).contentFrame();
      await mounted.waitForSelector('[data-preview-return]');
      await exercise(mounted, component);
      await page.waitForFunction(() => { const frame = document.querySelector('.native-demo iframe'); const inner = frame?.contentDocument?.documentElement; return !!inner && parseFloat(frame.style.height) >= Math.min(1200, inner.scrollHeight); });
      await page.locator('.native-demo-frame').screenshot({ path: resolve(dir, `${component}-changed.png`) });
      const nativeFrame = () => page.frames().find(frame => frame.url().includes('/previews/') && frame.url().includes(`token=${tokenOf()}`));
      let currentSrc = await page.locator('.native-demo iframe').getAttribute('src');
      const tokenOf = () => new URL(currentSrc).searchParams.get('token');
      const send = async (type, height, token) => nativeFrame().evaluate(({ type, height, token }) => { const q = new URLSearchParams(location.search); const message = { version: 1, framework: q.get('framework'), componentId: q.get('componentId'), exampleId: q.get('exampleId'), token: token ?? q.get('token'), type, ...(type === 'size' ? { height } : {}) }; parent.postMessage(message, location.origin); }, { type, height, token });
      await send('size', 1199, 'abcdefghijklmnop'); await page.waitForTimeout(50); assert.notEqual(await page.locator('.native-demo iframe').evaluate(node => node.style.height), '1199px');
      await send('size', 9999); await page.waitForFunction(() => document.querySelector('.native-demo iframe').style.height === '1200px');
      // A tiny size message clamps to the registry floor (minHeight, then the layout floor), not a fixed 240.
      const floor = frameFloor(registry.find(r => r.framework === framework && r.componentId === component && r.exampleId === 'default'));
      await send('size', 1); await page.waitForFunction(expected => document.querySelector('.native-demo iframe').style.height === expected, `${floor}px`);
      const old = currentSrc, oldToken = tokenOf(); await page.getByRole('button', { name: '초기화 / 다시 시도' }).click();
      await page.waitForFunction(previous => document.querySelector('.native-demo iframe')?.getAttribute('src') !== previous, old); await ready(page);
      currentSrc = await page.locator('.native-demo iframe').getAttribute('src'); assert.notEqual(currentSrc, old);
      // A stale token from the disposed frame is ignored by the fresh session.
      await page.waitForFunction(() => !!document.querySelector('.native-demo iframe')?.contentDocument?.querySelector('[data-preview-return]'));
      await send('size', 1111, oldToken); await page.waitForTimeout(50); assert.notEqual(await page.locator('.native-demo iframe').evaluate(node => node.style.height), '1111px');
      await iframe.getByRole('button', { name: '문서로 돌아가기' }).click(); await page.waitForFunction(() => document.activeElement?.classList.contains('native-demo-exit'));
      const code = await page.locator('.native-demo pre code').first().textContent();
      if (clipboard) { await page.locator('.native-demo').getByRole('button', { name: '코드 복사', exact: true }).first().click(); assert.equal(await page.evaluate(() => navigator.clipboard.readText()), code); }
      const href = await page.locator('.native-demo-source').getByRole('link', { name: '원본 소스 다운로드' }).getAttribute('href'); const bytes = await (await page.request.get(origin + href)).body();
      // A ranged example shows its first excerpt (exact range bytes); the download is the full file.
      const shown = registry.find(r => r.framework === framework && r.componentId === component && r.exampleId === 'default');
      const example = shown?.sources?.find(s => s.downloadUrl === href);
      assert.equal(code, expectedSourceDisplay(example ?? { excerpts: [] }, bytes)[0].text, 'displayed code equals the downloaded bytes or their first range');
      // A viewport change re-measures inside the frame; capture only after the applied height contains the native content again.
      const settled = async () => { await page.waitForFunction(() => { const frame = document.querySelector('.native-demo iframe'); const inner = frame?.contentDocument?.documentElement; if (!frame || !inner) return false; const applied = parseFloat(frame.style.height); return applied >= Math.min(1200, inner.scrollHeight); }); };
      for (const width of [1440, 390, 320]) { await page.setViewportSize({ width, height: 1000 }); await page.evaluate(() => scrollTo(0, 0)); await settled(); await paintedScreenshot(page, resolve(dir, `${component}-${width}.png`)); assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); const rect = await page.locator('.native-demo iframe').boundingBox(); assert.ok(rect.y < 1000, `preview visible ${component}/${width}: ${rect.y}`); }
      // 200% text (WCAG 1.4.4) at a desktop width: shell and frame reflow without horizontal overflow; frame re-measures.
      const text200 = async () => {
        await page.addStyleTag({ content: 'html {font-size:200% !important}' });
        await nativeFrame().evaluate(() => { const s = document.createElement('style'); s.textContent = 'html {font-size:200% !important}'; document.head.append(s); });
        await settled(); await page.locator('.native-demo').evaluate(node => node.scrollIntoView({ block: 'start' }));
      };
      await page.setViewportSize({ width: 1280, height: 1000 }); await text200();
      await paintedScreenshot(page, resolve(dir, `${component}-text-200.png`));
      // Preview contract: the demo section and frame stay inside the viewport and the frame contains its content.
      // Page-level overflow from reference tables/TOC is recorded, not attributed to the preview.
      assert.ok(await page.locator('.native-demo').evaluate(n => { const r = n.getBoundingClientRect(); return r.left >= -1 && r.right <= innerWidth + 1; }), `demo section within viewport at 200% text ${component}`);
      lines.push(`${component}: 200% text at 1280px page overflow ${await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)}px (recorded)`);
      // 320 px combined with 200% text is recorded (not gated): the reference tables/code are outside the preview contract.
      await page.setViewportSize({ width: 320, height: 1000 }); await settled();
      // Valid evidence: the preview frame itself is in view, and the capture is a painted (non-blank) frame.
      // Chromium returns an unpainted all-white frame right after resizing this ~100k px page (review M10).
      await page.locator('.native-demo-frame').evaluate(node => node.scrollIntoView({ block: 'start' }));
      const capture320 = await paintedScreenshot(page, resolve(dir, `${component}-320-text-200.png`));
      const inView = await page.locator('.native-demo iframe').evaluate(n => { const r = n.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; });
      assert.ok(inView, `preview frame in the 320 px + 200% capture ${component}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      const frameFits = await page.locator('.native-demo iframe').evaluate(n => n.getBoundingClientRect().right <= innerWidth + 1);
      assert.ok(frameFits, `preview frame fits 320 px at 200% text ${component}`);
      lines.push(`${component}: 320px+200% text page overflow ${overflow}px (recorded), preview frame fits, capture painted (${capture320.colors} colours, attempt ${capture320.attempts})`);
      lines.push(`${component}: native result, bounded resize, stale/wrong token rejected, reset token, return focus, ${clipboard ? 'copy/' : ''}download SHA ${createHash('sha256').update(bytes).digest('hex')}`);
    }
    assert.deepEqual(errors, []);
    const nojs = await browser.newContext({ javaScriptEnabled: false }); const staticPage = await nojs.newPage(); await staticPage.goto(`${origin}/krds/components/button.html?framework=${framework}`); assert.ok(await staticPage.locator('.native-demo pre code').first().textContent()); assert.ok(await staticPage.getByRole('link', { name: '전체 화면에서 열기' }).count()); await nojs.close();
    lines.push('no-JS: source and full-page link present');
    return { framework, browser: browserName, status: 'passed', lines };
  } catch (error) {
    return { framework, browser: browserName, status: 'failed', lines, error: String(error?.message ?? error).split('\n').slice(0, 6).join(' | ') };
  } finally { await context.close(); }
}
