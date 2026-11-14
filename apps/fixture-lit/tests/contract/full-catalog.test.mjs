import test from 'node:test';
import assert from 'node:assert/strict';
import { browserPath, serveProduction } from '../../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const { chromium, webkit } = await import('playwright');

// Each recipe asserts an actual native semantic outcome, followed by component-specific actions.
import { recipes } from './catalog-recipes.mjs';

for (const engine of ['chromium', 'webkit']) {
  test(`Lit ${engine} full catalog native outcomes`, async t => {
    const server = await serveProduction(new URL('../../dist', import.meta.url).pathname);
    const browser = await ({ chromium, webkit })[engine].launch();
    try {
      for (const [id, properties, text] of recipes) await t.test(id, async () => {
        const page = await browser.newPage({ reducedMotion: 'reduce' });
        try {
          await page.goto(`${server.origin}/harness.html`);
          await page.waitForFunction(() => customElements.get('krds-button'));
          const observation = await page.evaluate(async ({ id, properties }) => {
            const main = document.querySelector('main');
            main.innerHTML = '<button id="tour-start">시작</button><h2 id="target" tabindex="-1">본문 대상</h2><div id="tour-boundary"></div><p id="result" role="status">저장 완료</p><form id="catalog-form"></form>';
            const element = document.createElement(`krds-${id}`);
            if (id === 'pagination') properties.hrefForPage = page => `#page-${page}`;
            Object.assign(element, properties);
            if (id === 'disclosure') element.innerHTML = '<a href="#detail">추가 본문</a>';
            document.getElementById('catalog-form').append(element);
            await element.updateComplete;
            window.catalogElement = element; window.requests = [];
            for (const name of ['value-change', 'checked-change', 'open-change', 'expanded-change', 'action', 'back-request', 'index-change', 'sort-change', 'files-change', 'dismiss', 'request']) element.addEventListener(name, event => window.requests.push({ name, detail: event.detail }));
            const composedText = root => [...root.childNodes].map(node => node.shadowRoot ? composedText(node.shadowRoot) : node.childNodes?.length ? composedText(node) : node.textContent ?? '').join('');
            await Promise.all([...element.shadowRoot?.querySelectorAll('*') ?? []].map(child => child.updateComplete));
            return { shadow: !!element.shadowRoot, text: element.shadowRoot ? composedText(element.shadowRoot) : '', native: !!element.shadowRoot?.querySelector('button,input,textarea,a,nav,section,header,footer,p,ol,ul,table,figure,span,div,dialog,audio,video,progress') };
          }, { id, properties });
          assert.equal(observation.shadow, true, `${id}: native Shadow DOM is required`);
          if (text !== null) assert.ok(observation.text.includes(text), `${id}: visible semantic content ${text}`);
          if (id !== 'favicon' && id !== 'coach-mark') assert.equal(observation.native, true);
          const host = page.locator(`krds-${id}`);
          if (id === 'disclosure') { assert.equal(await host.getByRole('link').isVisible(), false); await host.getByRole('button').click(); assert.equal(await host.getByRole('link').isVisible(), true); }
          if (id === 'accordion') { await host.getByRole('button', { name: '첫 안내' }).click(); assert.equal(await host.getByText('상세 내용').isVisible(), true); await host.getByRole('button', { name: '다음 안내' }).click(); assert.equal(await host.getByText('상세 내용').isVisible(), true); }
          if (id === 'main-menu') { await host.getByRole('button', { name: '신청', exact: true }).click(); assert.equal(await host.getByRole('link', { name: '상세 신청' }).getAttribute('href'), '#apply'); await host.getByRole('link').press('Escape'); assert.equal(await host.getByRole('button', { name: '신청', exact: true }).getAttribute('aria-expanded'), 'false'); }
          if (id === 'skip-link' || id === 'in-page-navigation') { await host.getByRole('link').first().press('Enter'); assert.equal(await page.evaluate(() => document.activeElement?.id), 'target'); }
          if (id === 'link') assert.equal(await host.getByRole('link').getAttribute('href'), '#destination');
          if (id === 'favicon') assert.equal(await page.locator('head link[rel="icon"]').getAttribute('href'), '/logo.svg');
          if (id === 'radio-group') { const radios = host.getByRole('radio'); await radios.nth(0).check(); await radios.nth(0).press('ArrowRight'); assert.equal(await radios.nth(1).isChecked(), true); assert.deepEqual(await page.evaluate(() => [...new FormData(document.getElementById('catalog-form'))]), [['region', 'b']]); }
          if (id === 'checkbox' || id === 'switch') { await host.getByRole(id === 'switch' ? 'switch' : 'checkbox').check(); assert.deepEqual(await page.evaluate(() => [...new FormData(document.getElementById('catalog-form'))]), [[id === 'switch' ? 'notification' : 'agreement', 'on']]); }
          if (id === 'text-input' || id === 'textarea') { const input = host.getByRole('textbox'); await input.fill('갱신'); assert.deepEqual(await page.evaluate(() => [...new FormData(document.getElementById('catalog-form'))]), [[id === 'textarea' ? 'reason' : 'person', '갱신']]); await page.evaluate(() => document.getElementById('catalog-form').reset()); assert.equal(await input.inputValue(), id === 'textarea' ? '기본' : '김'); }
          if (id === 'range-slider') { await host.getByRole('slider').press('End'); assert.deepEqual(await page.evaluate(() => [...new FormData(document.getElementById('catalog-form'))]), [['amount', '10']]); }
          if (id === 'quantity-toggle') { await host.getByRole('button', { name: '수량 늘리기' }).click(); assert.deepEqual(await page.evaluate(() => [...new FormData(document.getElementById('catalog-form'))]), [['quantity', '3']]); }
          if (id === 'carousel') { await host.getByRole('button', { name: '다음 슬라이드', exact: true }).click(); assert.equal(await host.getByText('다음 내용', { exact: true }).isVisible(), true); assert.equal(await host.getByText('첫 내용', { exact: true }).isVisible(), false); }
          if (id === 'table') {
            assert.equal(await host.getByRole('button', { name: '신청자', exact: true }).count(), 0);
            await host.evaluate(async element => {
              element.sort = { columnId: 'name', direction: 'descending' };
              element.addEventListener('sort-change', event => { element.sort = event.detail; });
              await element.updateComplete;
            });
            assert.equal(await host.getByRole('columnheader').getAttribute('aria-sort'), 'descending');
            assert.deepEqual(await host.locator('tbody td').allTextContents(), ['나', '가']);
            await host.getByRole('button', { name: '신청자', exact: true }).click();
            await host.evaluate(element => element.updateComplete);
            assert.deepEqual(await page.evaluate(() => window.requests), [{ name: 'sort-change', detail: { columnId: 'name', direction: 'ascending' } }]);
            assert.equal(await host.getByRole('columnheader').getAttribute('aria-sort'), 'ascending');
            assert.deepEqual(await host.locator('tbody td').allTextContents(), ['가', '나']);
          }
          if (id === 'contextual-help') { await host.getByRole('button').click(); assert.equal(await host.getByText('기관을 선택하세요').isVisible(), true); await page.keyboard.press('Escape'); assert.equal(await host.getByText('기관을 선택하세요').isVisible(), false); }
          if (id === 'tooltip') { await host.getByRole('button').focus(); assert.equal(await host.getByRole('tooltip').isVisible(), true); await page.keyboard.press('Escape'); assert.equal(await host.getByRole('tooltip').isVisible(), false); }
          if (id === 'fab') { await host.getByRole('button', { name: '빠른 작업' }).click(); assert.equal(await host.getByRole('button', { name: '저장' }).isVisible(), true); await page.keyboard.press('Escape'); assert.equal(await host.getByRole('button', { name: '저장' }).isVisible(), false); }
          if (id === 'tag') { await host.getByRole('button', { name: '서울' }).click(); assert.equal(await host.getByRole('button', { name: '서울' }).getAttribute('aria-pressed'), 'true'); }
          if (id === 'bottom-sheet') { assert.equal(await host.getByRole('dialog').isVisible(), true); await page.keyboard.press('Escape'); assert.equal(await host.getByRole('dialog').isVisible(), false); }
          if (id === 'snackbar') { await host.getByRole('button', { name: '실행 취소' }).click(); assert.equal(await page.evaluate(() => window.requests.filter(request => request.name === 'action').length), 1); }
          if (id === 'back-button') { await host.getByRole('button').click(); assert.equal(await page.evaluate(() => window.requests.filter(request => request.name === 'back-request').length), 1); }
          if (id === 'tts') { await host.getByRole('button', { name: '안내 듣기 재생', exact: true }).click(); assert.deepEqual(await page.evaluate(() => window.requests), [{ name: 'request', detail: { action: 'play', summary: '로컬 안내', locale: 'ko-KR' } }]); assert.equal(await host.getByRole('button', { name: '안내 듣기 일시정지', exact: true }).count(), 0); assert.equal(await host.getByRole('button', { name: '안내 듣기 중지', exact: true }).count(), 0); assert.equal(await host.evaluate(element => element.state), 'idle'); }
          if (id === 'tab-bar') assert.equal(await host.getByRole('link', { name: '홈' }).getAttribute('aria-current'), 'page');
        } finally { await page.close(); }
      });
    } finally { await browser.close(); await server.close(); }
  });
}
