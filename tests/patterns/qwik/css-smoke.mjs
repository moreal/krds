import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {serveProduction} from '../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH='/private/tmp/krds-playwright-1.64.1';
const root=resolve(import.meta.dirname,'../../..'),require=createRequire(resolve(root,'apps/fixture-qwik/package.json')),{chromium}=require('playwright'),{default:AxeBuilder}=await import(require.resolve('@axe-core/playwright'));
const production=process.env.KRDS_PATTERN_PRODUCTION,stories=process.env.KRDS_PATTERN_STORIES;assert(production&&stories);
const directory=resolve(root,'.superpowers/sdd/PLAN/t11-qwik-logs/css-smoke');await mkdir(directory,{recursive:true});
const {startProductionSsr}=await import(pathToFileURL(resolve(production,'server.mjs'))),fixture=await startProductionSsr(),storybook=await serveProduction(stories),browser=await chromium.launch(),results=[];
try{for(const surface of ['fixture','storybook'])for(const width of [1280,360]){const context=await browser.newContext({viewport:{width,height:900},locale:'ko-KR'}),page=await context.newPage(),errors=[],external=[];page.on('pageerror',e=>errors.push(String(e)));const origin=surface==='fixture'?fixture.origin:storybook.origin;page.on('request',r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith('data:'))external.push(r.url());});
 await page.goto(origin+(surface==='fixture'?'/examples/service-layout?case=css-only':'/iframe.html?id=krds-pattern-service-layout--default&viewMode=story'),{waitUntil:'networkidle'});await page.locator('.pattern-layout').waitFor();
 const geometry=await page.evaluate(()=>{const layout=document.querySelector('.pattern-layout'),nav=layout.querySelector('nav'),main=layout.querySelector('main'),box=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};};return {display:getComputedStyle(layout).display,columns:getComputedStyle(layout).gridTemplateColumns,navDisplay:getComputedStyle(nav).display,nav:box(nav),main:box(main),scrollWidth:document.documentElement.scrollWidth,innerWidth};});
 if(width===1280){assert.equal(geometry.display,'grid');assert(geometry.main.left>geometry.nav.right,'Main follows sidebar in the actual desktop grid');}else{assert.equal(geometry.display,'block');assert.equal(geometry.navDisplay,'none');assert.equal(await page.locator('#example-layout-mobile-open').isVisible(),true);}
 assert(geometry.scrollWidth<=geometry.innerWidth);const axe=await new AxeBuilder({page}).include(surface==='storybook'?'#storybook-root':'body').analyze();await writeFile(resolve(directory,`${surface}-${width}-axe.json`),JSON.stringify(axe,null,2));assert.deepEqual(axe.violations,[]);await page.screenshot({path:resolve(directory,`${surface}-${width}.png`),fullPage:true});assert.deepEqual(errors,[]);assert.deepEqual(external,[]);results.push({surface,width,status:'passed',geometry,errors,external,violations:axe.violations});await context.close();
}}finally{await browser.close();await fixture.close();await storybook.close();await writeFile(resolve(directory,'report.json'),JSON.stringify({production,stories,results},null,2));}
console.log(`CSS-only actual native fixture/Storybook layout: ${results.length}/4`);
