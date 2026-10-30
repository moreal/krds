import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { serveProduction } from '../../tools/testing/support.mjs';

const argument = name => process.argv.find(value => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const output = resolve(argument('output') ?? '.superpowers/sdd/PLAN/t10-solid-logs/final-layout-inspection');
await mkdir(output, { recursive: true });
const server = await serveProduction(resolve(argument('root') ?? '.superpowers/sdd/PLAN/t10-solid-logs/runtime-frozen-solid-20261030-1623/storybook-dist'));
const browser = await chromium.launch();
const report = { artifactSnapshot: server.artifactSnapshot, coverageAwarded: false, textScaleLimit: 'Controlled computed text scaling; not real browser zoom evidence', results: [] };
async function open(id, width, forcedColors = process.argv.includes('--forced-colors') ? 'active' : 'none') {
  const context = await browser.newContext({ viewport: { width, height: 800 }, forcedColors, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${server.origin}/iframe.html?id=krds-${id}&viewMode=story`, { waitUntil: 'networkidle' });
  return { context, page };
}
try {
  for (const caseId of argument('cases')?.split(',') ?? ['three-items', 'five-items', 'long-translated-label']) {
    for (const scale of argument('scales')?.split(',').map(Number) ?? [1, 2]) {
      const { context, page } = await open(`tab-bar--${caseId}`, 320);
      if (scale === 2) await page.evaluate(() => {
        const nodes = [...document.querySelectorAll('#storybook-root *')];
        const sizes = nodes.map(node => getComputedStyle(node).fontSize);
        nodes.forEach((node, index) => node.style.fontSize = `${parseFloat(sizes[index]) * 2}px`);
      });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const last = page.locator('[data-krds-host="last-content-action"]');
      await last.scrollIntoViewIfNeeded();
      await last.focus();
      const metrics = await page.evaluate(() => {
        const root = document.querySelector('[data-krds-component="tab-bar"][data-krds-part="root"]');
        const host = document.querySelector('[data-krds-host="bottom-layout"]');
        const box = root.getBoundingClientRect();
        const links = [...root.querySelectorAll('[data-krds-part="link"]')].map(link => {
          const rect = link.getBoundingClientRect();
          const label = link.querySelector('[data-krds-part="label"]');
          const icon = link.querySelector('[data-krds-part="icon"]');
          const style = getComputedStyle(link);
          const range = document.createRange(); range.selectNodeContents(label);
          return { width: rect.width, iconTop: icon.getBoundingClientRect().top, iconHeight: icon.getBoundingClientRect().height, iconFontSize: getComputedStyle(icon).fontSize, labelTop: label.getBoundingClientRect().top, labelFontSize: getComputedStyle(label).fontSize, paddingTop: style.paddingTop, paddingBottom: style.paddingBottom, borderTopWidth: style.borderTopWidth, borderTopColor: style.borderTopColor, fontWeight: style.fontWeight, current: link.getAttribute('aria-current'), indicator: Boolean(link.querySelector('[data-krds-part="indicator"]')), svg: Boolean(icon.querySelector('svg')), justifyContent: style.justifyContent, label: label.textContent, textInside: [...range.getClientRects()].every(line => line.left >= rect.left - 1 && line.right <= rect.right + 1 && line.top >= rect.top - 1 && line.bottom <= rect.bottom + 1) };
        });
        const lastBox = document.querySelector('[data-krds-host="last-content-action"]').getBoundingClientRect();
        return { viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, root: { top: box.top, bottom: box.bottom, height: box.height, position: getComputedStyle(root).position }, links, hostPadding: parseFloat(getComputedStyle(host).paddingBottom), scrollPadding: parseFloat(getComputedStyle(document.documentElement).scrollPaddingBottom), lastBottom: lastBox.bottom, focus: document.activeElement?.getAttribute('data-krds-host') };
      });
      const axe = (await new AxeBuilder({ page }).include('[data-krds-component="tab-bar"][data-krds-part="root"]').analyze()).violations;
      const passed = metrics.documentWidth <= 320 && metrics.root.position === 'fixed' && Math.abs(metrics.root.bottom - 800) < 1 && metrics.links.every(link => Math.abs(link.width - metrics.links[0].width) < 1 && Math.abs(link.iconTop - metrics.links[0].iconTop) < 1 && Math.abs(link.labelTop - metrics.links[0].labelTop) < 1 && link.textInside) && metrics.hostPadding >= metrics.root.height && metrics.scrollPadding >= metrics.root.height && metrics.lastBottom < metrics.root.top && metrics.focus === 'last-content-action' && !axe.length;
      report.results.push({ kind: 'tab-bar', caseId, scale, metrics, axe, passed });
      await writeFile(join(output, 'partial-report.json'), JSON.stringify(report, null, 2) + '\n');
      await page.screenshot({ path: join(output, `tab-bar-${caseId}-${scale}.png`) });
      await context.close();
    }
  }
  if (!process.argv.includes('--tabbar-only')) {
    const { context, page } = await open('main-menu--large-menu-overflow', 1280);
    await page.getByRole('button', { name: '분류 0', exact: true }).click();
    const submenu = page.locator('[data-krds-component="main-menu"][data-krds-part="submenu"]').filter({ visible: true }).first();
    await submenu.getByRole('link').last().focus();
    const metrics = await submenu.evaluate(node => ({ height: node.clientHeight, scrollHeight: node.scrollHeight, scrollTop: node.scrollTop, viewport: innerHeight, count: node.querySelectorAll('a').length, localOverflow: getComputedStyle(node).overflowY, focused: node.contains(document.activeElement), lastReachable: document.activeElement.getBoundingClientRect().bottom <= node.getBoundingClientRect().bottom + 1 }));
    report.results.push({ kind: 'main-menu', metrics, passed: metrics.height <= .7 * metrics.viewport + 1 && metrics.count === 40 && metrics.scrollHeight > metrics.height && metrics.scrollTop > 0 && metrics.focused && metrics.lastReachable });
    await page.screenshot({ path: join(output, 'main-menu-40-children.png') });
    await context.close();
  }
  if (!process.argv.includes('--tabbar-only')) {
    const { context, page } = await open('table--narrow-scroll', 360);
    const region = page.locator('[data-krds-component="table"][data-krds-part="scroll-region"]');
    const before = await region.evaluate(node => ({ clientWidth: node.clientWidth, scrollWidth: node.scrollWidth, scrollLeft: node.scrollLeft, tabIndex: node.tabIndex, columns: node.querySelectorAll('thead th').length, firstCell: node.querySelector('tbody td').textContent, wordBreak: getComputedStyle(node.querySelector('tbody td')).wordBreak }));
    await page.getByRole('button', { name: '표 오른쪽으로 이동' }).click();
    const after = await region.evaluate(node => node.scrollLeft);
    report.results.push({ kind: 'table', before, after, passed: before.columns === 9 && before.scrollWidth > before.clientWidth && before.tabIndex === 0 && after > before.scrollLeft && before.wordBreak === 'keep-all' });
    await page.screenshot({ path: join(output, 'table-nine-columns.png') });
    await context.close();
  }
  await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report.results.map(({ kind, caseId, scale, passed }) => ({ kind, caseId, scale, passed }))));
  if (report.results.some(result => !result.passed)) process.exitCode = 1;
} finally { await browser.close(); await server.close(); }
