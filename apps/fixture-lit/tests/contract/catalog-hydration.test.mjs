import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, cp, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { render } from '@lit-labs/ssr';
import { registerKrdsElements, faviconLinks } from '@unofficial-krds/lit';
import { recipes } from './catalog-recipes.mjs';
import { browserPath, serveProduction } from '../../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const { chromium, webkit } = await import('playwright');
registerKrdsElements(customElements);
const hydrationDist = await mkdtemp(join(tmpdir(), 'krds-lit-hydration-'));
await cp(new URL('../../dist', import.meta.url), hydrationDist, { recursive: true });
after(() => rm(hydrationDist, { recursive: true, force: true }));
const skeleton = await readFile(join(hydrationDist, 'hydrate.html'), 'utf8');
for (const [id, properties] of recipes) {
  const props = { ...properties };
  if (id === 'pagination') props.hrefForPage = page => `#page-${page}`;
  const keys = Object.keys(props);
  const opening = `<krds-${id} id="ssr-${id}" defer-hydration ${keys.map((key, index) => `.${key}=__BIND_${index}__`).join(' ')}></krds-${id}>`;
  const strings = opening.split(/__BIND_\d+__/); strings.raw = [...strings];
  const markup = [...render({ _$litType$: 1, strings, values: Object.values(props) })].join('');
  const json = JSON.stringify({ [`ssr-${id}`]: props }).replaceAll('<', '\\u003c');
  const headMarkup = id === 'favicon' ? [...render(faviconLinks(props))].join('') : '';
  const document = skeleton.replace('</head>', `${headMarkup}</head>`).replace('<main id="app"></main>', `<main id="app"><button id="tour-start">시작</button><h2 id="target" tabindex="-1">본문 대상</h2><div id="tour-boundary"></div><p id="result" role="status">저장 완료</p><form id="catalog-form">${markup}</form></main><script id="krds-hydration-state" type="application/json">${json}</script><script>window.beforeIcon=document.head.querySelector('link[rel=\"icon\"]');window.beforeHydration=document.getElementById('ssr-${id}').shadowRoot.querySelector('button,input,textarea,a,nav,section,header,footer,p,ol,ul,table,figure,span,div,dialog,audio,video,progress');window.hydratedRequests=[];window.allHydrationRequests=[];for(const name of ['value-change','checked-change','open-change','expanded-change','page-change','index-change','playing-change','selection-change','active-change','topic-change','request','back-request','dismiss','locale-request','files-change','action'])document.getElementById('ssr-${id}').addEventListener(name,()=>window.allHydrationRequests.push(name));document.getElementById('ssr-${id}').addEventListener('value-change',event=>window.hydratedRequests.push(event.detail));document.getElementById('ssr-${id}').addEventListener('checked-change',event=>window.hydratedRequests.push(event.detail));</script>`);
  await writeFile(join(hydrationDist, `ssr-catalog-${id}.html`), document);
}
for (const engine of ['chromium', 'webkit']) test(`Lit ${engine} standalone 48-item hydration reuses actual native DOM and first events`, async t => {
  const server = await serveProduction(hydrationDist);
  const browser = await ({ chromium, webkit })[engine].launch();
  try {
    for (const [id] of recipes) await t.test(id, async () => {
      const page = await browser.newPage({ reducedMotion: 'reduce' }); const errors = []; page.on('pageerror', error => errors.push(String(error)));
      try {
        await page.goto(`${server.origin}/ssr-catalog-${id}.html`);
        await page.waitForFunction(() => customElements.get('krds-button'));
        const observation = await page.locator(`#ssr-${id}`).evaluate(async element => { await element.updateComplete; return { hasNative: !!window.beforeHydration, reused: element.shadowRoot.querySelector('button,input,textarea,a,nav,section,header,footer,p,ol,ul,table,figure,span,div,dialog,audio,video,progress') === window.beforeHydration }; });
        if (id !== 'favicon') { assert.equal(observation.hasNative, true); assert.equal(observation.reused, true, `${id} must reuse SSR native node`); }
        if (id === 'text-input' || id === 'textarea') { const control = page.locator(`#ssr-${id}`).getByRole('textbox'); assert.equal(await control.inputValue(), id === 'textarea' ? '기본' : '김'); await control.fill('첫 입력'); assert.deepEqual(await page.evaluate(() => window.hydratedRequests), [{ value: '첫 입력' }]); }
        if (id === 'checkbox' || id === 'switch') { await page.locator(`#ssr-${id}`).getByRole(id === 'checkbox' ? 'checkbox' : 'switch').check(); assert.deepEqual(await page.evaluate(() => window.hydratedRequests), [{ checked: true }]); }
        if (id === 'accordion') { await page.locator(`#ssr-${id}`).getByRole('button', { name: '첫 안내' }).click(); assert.equal(await page.getByText('상세 내용', { exact: true }).isVisible(), true); }
        if (id === 'range-slider') { await page.locator(`#ssr-${id}`).getByRole('slider').press('ArrowRight'); assert.deepEqual(await page.evaluate(() => window.hydratedRequests), [{ value: 2.5 }]); }
        if (!['text-input','textarea','checkbox','switch','accordion','range-slider'].includes(id)) {
          let expectedEvent;
          const host = page.locator(`#ssr-${id}`);
          if (id === 'main-menu' || id === 'side-navigation') { await host.getByRole('button').filter({visible:true}).first().click(); expectedEvent = 'expanded-change'; }
          if (id === 'disclosure' || id === 'help-panel' || id === 'tutorial-panel' || id === 'contextual-help' || id === 'resize') { await host.getByRole('button').filter({visible:true}).first().click(); expectedEvent = 'open-change'; }
          if (id === 'bottom-sheet') { await host.getByRole('button', {name:'닫기',exact:true}).click(); expectedEvent = 'open-change'; }
          if (id === 'carousel') { await host.getByRole('button', {name:'다음 슬라이드'}).click(); expectedEvent = 'index-change'; }
          if (id === 'fab') { await host.getByRole('button').first().click(); expectedEvent = 'expanded-change'; }
          if (id === 'radio-group') { await host.getByRole('radio').first().check(); expectedEvent = 'value-change'; }
          if (id === 'tag') { await host.getByRole('button').first().click(); expectedEvent = 'selection-change'; }
          if (id === 'tooltip') { await host.getByRole('button').focus(); expectedEvent = 'open-change'; }
          if (id === 'tts') { await host.locator('[part="play"]').click(); expectedEvent = 'request'; }
          if (id === 'file-upload') { await host.locator('input[type=file]').setInputFiles({name:'hydrate.txt',mimeType:'text/plain',buffer:Buffer.from('first native file')}); expectedEvent = 'files-change'; }
          if (id === 'language-switcher') { await host.getByRole('link').first().click(); expectedEvent = 'locale-request'; }
          if (id === 'back-button') { await host.getByRole('button').click(); expectedEvent = 'back-request'; }
          if (id === 'quantity-toggle') { await host.locator('[part="increment"]').click(); expectedEvent = 'value-change'; }
          if (id === 'snackbar') { await host.getByRole('button',{name:'알림 닫기'}).click(); expectedEvent = 'dismiss'; }
          if (id === 'in-page-navigation') { await page.evaluate(()=>{window.allHydrationRequests=[];}); await host.getByRole('link').first().press('Enter'); assert.equal(await page.locator('#target').evaluate(node=>document.activeElement===node),true); }
          if (expectedEvent) assert.deepEqual(await page.evaluate(()=>window.allHydrationRequests), [expectedEvent], `${id} first native event is exactly one request`);
          if (id === 'skip-link') { await host.getByRole('link').first().press('Enter'); assert.equal(await page.locator('#target').evaluate(node=>document.activeElement===node),true); }
          if (['header','footer','link','structured-list','tab-bar'].includes(id)) { const link=host.getByRole('link').filter({visible:true}).first(); const href=await link.getAttribute('href'); if(href?.startsWith('#')){await link.click();assert.equal(new URL(page.url()).hash,href);} }
        }
        assert.deepEqual(errors, []);
      } finally { await page.close(); }
    });
  } finally { await browser.close(); await server.close(); }
});


test('Favicon real standalone head is reused once through hydration', async () => {
  const server = await serveProduction(hydrationDist); const browser = await chromium.launch();
  try { const page = await browser.newPage(); await page.goto(`${server.origin}/ssr-catalog-favicon.html`); await page.waitForFunction(() => customElements.get('krds-favicon')); await page.locator('krds-favicon').evaluate(async host => await host.updateComplete); assert.equal(await page.locator('head link[rel="icon"]').count(), 1); assert.equal(await page.evaluate(() => document.head.querySelector('link[rel="icon"]') === window.beforeIcon), true); } finally { await browser.close(); await server.close(); }
});
