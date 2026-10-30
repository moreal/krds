import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveProduction } from '../../../tools/testing/support.mjs';

const argument = name => process.argv.find(value => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const repository=fileURLToPath(new URL('../../../',import.meta.url));
const source = resolve(repository,argument('root'));
const output = resolve(repository,argument('output'));
await mkdir(output, { recursive: true });
const server = await serveProduction(source, { fixture: true });
const browser = await chromium.launch();
const report = { source, artifactSnapshot: server.artifactSnapshot, coverageAwarded: false, observations: [] };
try {
  const context=await browser.newContext({viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await page.addInitScript(() => {
    window.__observerEntries = [];
    window.__observerTargets = [];
    const Native = window.IntersectionObserver;
    window.IntersectionObserver = class extends Native {
      constructor(callback, options) {
        super((entries, observer) => { window.__observerEntries.push(entries.map(entry => ({ id: entry.target.id, intersecting: entry.isIntersecting, top: entry.boundingClientRect.top, bottom: entry.boundingClientRect.bottom }))); callback(entries, observer); }, options);
      }
      observe(target) { window.__observerTargets.push(target.id); super.observe(target); }
    };
  });
  await page.goto(`${server.origin}/fixtures/in-page-navigation?case=outcome-04`);
  await page.waitForFunction(() => window.__KRDS_FIXTURE__?.protocol === 1);
  await page.getByRole('button', { name: '외부 작업', exact: true }).focus();
  await page.locator('#requirements').scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  report.observations.push({ kind: 'in-page-passive', ...(await page.evaluate(() => ({ scrollY, targets: window.__observerTargets, observerEntries: window.__observerEntries, sections: ['overview','requirements'].map(id => { const node = document.getElementById(id), rect = node.getBoundingClientRect(); return { id, top: rect.top, bottom: rect.bottom }; }), active: [...document.querySelectorAll('[data-krds-component="in-page-navigation"] a')].map(node => ({ text: node.textContent, current: node.getAttribute('aria-current') })), events: window.__KRDS_FIXTURE__.readEvents(), bridge: window.__KRDS_FIXTURE__.getState(), focus: document.activeElement?.id }))) });
  await page.screenshot({ path: join(output, 'in-page-passive.png') });
  await page.goto(`${server.origin}/fixtures/radio-group?case=outcome-01`);
  await page.waitForFunction(() => window.__KRDS_FIXTURE__?.protocol === 1);
  const radio = page.getByRole('radio').first();
  await radio.click();
  const geometry = await page.locator('[data-krds-component="radio-group"][data-krds-part="item"]').evaluateAll(nodes => nodes.map(node => {
    const input = node.querySelector('input'), label = node.querySelector('[data-krds-part="label"]'), indicator = node.querySelector('[data-krds-part="indicator"]');
    const box = element => { const value = element.getBoundingClientRect(); return { x:value.x,y:value.y,width:value.width,height:value.height,centerY:value.y+value.height/2 }; };
    return { input:box(input),label:box(label),indicatorHidden:indicator.hidden, checked:input.checked, indicatorDisplay:getComputedStyle(indicator).display };
  }));
  const axe = await new AxeBuilder({ page }).include('[data-krds-component="radio-group"][data-krds-part="root"]').analyze();
  const data = await radio.evaluate(node => [...new FormData(node.form).entries()]);
  report.observations.push({ kind:'radio-row',geometry,formData:data,axe:axe.violations,aligned:geometry.every(row => row.label.x>=row.input.x+row.input.width&&row.label.y<row.input.y+row.input.height&&row.label.y+row.label.height>row.input.y) });
  await page.screenshot({ path:join(output,'radio-row.png') });
  await writeFile(join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
  if(!report.observations.find(item=>item.kind==='radio-row').aligned||report.observations.find(item=>item.kind==='in-page-passive').active.at(-1)?.current!=='location')process.exitCode=1;
  process.stdout.write(JSON.stringify(report.observations.map(item => ({kind:item.kind,aligned:item.aligned,targets:item.targets,active:item.active})))+'\n');
} finally { await browser.close(); await server.close(); }
