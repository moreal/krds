import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {observeCatalogCase} from '../testing/catalog-observations.mjs';
const fixture=JSON.parse(await readFile(new URL('../../catalog/full-catalog-scenarios.json',import.meta.url),'utf8')).cases.find(item=>item.componentId==='header'&&item.caseId==='outcome-05');

test('independent sticky Header accepts absent/false Masthead while rejecting forged official text, fixed composed ancestors and hidden focused actions',async()=>{
  const {chromium}=await import('playwright');const browser=await chromium.launch();
  try{
    for(const mode of ['absent','false','shadow-false','forged-official','sticky-masthead','offscreen-search']){
      const page=await browser.newPage({viewport:{width:1280,height:800}});
      try{
        const text=mode==='forged-official'?'이 누리집은 대한민국 공식 전자정부 누리집입니다.':'비공식 독립 로컬 예제';
        const masthead=mode==='absent'?'':`<masthead-host style="${mode==='sticky-masthead'?'position:fixed;top:0;left:0;':''}"></masthead-host>`;
        await page.setContent(`<!doctype html><html lang="ko"><meta charset="utf-8"><body>${masthead}<header data-krds-component="header" data-krds-part="root" style="position:sticky;top:0;background:white"><a href="${fixture.initialState.home.href}">${fixture.initialState.home.label}</a><button data-krds-component="header" data-krds-part="search" style="${mode==='offscreen-search'?'position:fixed;left:-500px;':''}">검색</button></header><main style="height:2400px"><h1>예제 본문</h1></main></body></html>`);
        if(mode!=='absent')await page.evaluate(({text,shadow})=>{const host=document.querySelector('masthead-host');const parent=shadow?host.attachShadow({mode:'open'}):host;const paragraph=document.createElement('p');paragraph.dataset.krdsComponent='masthead';paragraph.dataset.krdsPart='root';paragraph.textContent=text;parent.append(paragraph);},{text,shadow:mode==='shadow-false'||mode==='sticky-masthead'});
        const run=observeCatalogCase(page,{readEvents:async()=>[]},fixture);
        if(['absent','false','shadow-false'].includes(mode))await run;
        else await assert.rejects(run,/toHaveCount|toBe|toBeGreaterThanOrEqual/);
      }finally{await page.close();}
    }
  }finally{await browser.close();}
});
