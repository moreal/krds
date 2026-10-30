import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeComposedOrder,lastComposedSubdivision} from '../testing/catalog-composed-inspection.mjs';
test('actual nested native Shadow navigation participates in header order and later footer subdivisions cannot hide behind a host',async()=>{
 const {chromium}=await import('playwright');const browser=await chromium.launch();const page=await browser.newPage();
 try{
  await page.setContent('<header-host></header-host><main>본문</main><footer><identifier-host></identifier-host></footer>');
  await page.evaluate(()=>{
   const header=document.querySelector('header-host').attachShadow({mode:'open'});header.innerHTML='<header><a href="/local/home">홈</a><button>검색</button><menu-host></menu-host></header>';
   header.querySelector('menu-host').attachShadow({mode:'open'}).innerHTML='<nav aria-label="주요 메뉴"><a href="/local/apply">신청</a></nav>';
   document.querySelector('identifier-host').attachShadow({mode:'open'}).innerHTML='<section aria-label="기관 식별자">기관 식별자</section><style>:host{display:block}</style>';
  });
  const header=page.getByRole('banner'),home=page.getByRole('link',{name:'홈',exact:true}),search=page.getByRole('button',{name:'검색',exact:true}),nav=page.getByRole('navigation');
  assert.deepEqual(await nativeComposedOrder(header,[home,search,nav],{controlsOnly:true}),[0,1,2]);
  const identifier=page.getByRole('region',{name:'기관 식별자'}),footer=page.getByRole('contentinfo');assert.equal(await lastComposedSubdivision(identifier,footer),true);
  await footer.evaluate(node=>node.insertAdjacentHTML('beforeend','<section>뒤늦은 구분</section>'));assert.equal(await lastComposedSubdivision(identifier,footer),false);
  const order=await nativeComposedOrder(page.locator('body'),[page.getByRole('main'),footer]);assert.ok(order[0]>=0&&order[1]>order[0]);
 }finally{await browser.close();}
});
