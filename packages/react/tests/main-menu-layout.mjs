import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chromium, webkit } from 'playwright';
import { MainMenu } from '@unofficial-krds/react/main-menu';
import { styles } from '@unofficial-krds/styles';

// The React renderer's visibility div is also used by Svelte and Lit. Exercise
// the actual public React output, not a hand-built approximation of that shape.
const items = [{ id: 'catalog', label: 'Catalog', children: [{ id: 'nested', label: 'Nested', children: [{ id: 'deep', label: 'Deep link', href: '#deep' }] }, ...Array.from({ length: 55 }, (_, i) => ({ id: `c${i}`, label: `Component ${i + 1}`, href: `#c${i}` }))] }, { id: 'legal', label: 'Legal', href: '#legal' }];
for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
 const browser = await engine.launch({ headless: true });
 try {
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  const geometry = async expanded => {
   const markup = renderToStaticMarkup(createElement(MainMenu, { items, defaultExpandedId: expanded }));
   await page.setContent(`<style>${styles.all}</style>${markup}<main>Following content</main>`);
   return page.evaluate(() => ({ nav: document.querySelector('nav').getBoundingClientRect().height, main: document.querySelector('main').getBoundingClientRect().top }));
  };
  const closed = await geometry(null), opened = await geometry('nested');
  assert.ok(Math.abs(opened.nav - closed.nav) <= 1); assert.ok(Math.abs(opened.main - closed.main) <= 1);
  const rootPanel = page.locator('[data-krds-part="list"] > li > div'), nestedPanel = rootPanel.locator('[data-krds-part="submenu"] > li > div').first();
  assert.equal(await rootPanel.evaluate(element => getComputedStyle(element).position), 'absolute');
  assert.equal(await nestedPanel.evaluate(element => getComputedStyle(element).position), 'static');
  assert.equal(await rootPanel.locator('ul').first().evaluate(element => getComputedStyle(element).listStyleType), 'none');
  assert.ok((await rootPanel.boundingBox()).height <= 561);
  await rootPanel.locator('a').last().scrollIntoViewIfNeeded();
  const last = await rootPanel.locator('a').last().boundingBox(), panel = await rootPanel.boundingBox();
  assert.ok(last.y + last.height <= panel.y + panel.height + 1);
  console.log(`${name}: public React MainMenu wrapped-list geometry, nested flow and local scroll passed`);
 } finally { await browser.close(); }
}
