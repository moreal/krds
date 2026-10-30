import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {serveProduction,browserPath} from '../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
const phase=process.argv[2]??'before';
const dir=`../../.superpowers/sdd/PLAN/t10-vue-logs/final-host-delta/${phase}`;
await mkdir(dir,{recursive:true});
const server=await serveProduction(new URL('../dist',import.meta.url).pathname),browser=await chromium.launch();
try {
 const context=await browser.newContext({viewport:{width:360,height:800}}),page=await context.newPage();
 await page.goto(`${server.origin}/iframe.html?id=krds-structured-list--narrow&viewMode=story`,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.documentElement.style.fontSize=`${parseFloat(getComputedStyle(document.documentElement).fontSize)*2}px`);
 await page.getByRole('textbox',{name:'공고 검색'}).focus();
 const geometry=await page.evaluate(()=>({pageWidth:document.documentElement.scrollWidth,viewport:innerWidth,chain:(()=>{const chain=[];let node=document.querySelector('input');for(let n=0;node&&n<5;n++,node=node.parentElement){const c=getComputedStyle(node);chain.push({tag:node.tagName,part:node.getAttribute('data-krds-part'),rect:node.getBoundingClientRect().toJSON(),clientWidth:node.clientWidth,scrollWidth:node.scrollWidth,minInlineSize:c.minInlineSize,maxInlineSize:c.maxInlineSize,gridTemplateColumns:c.gridTemplateColumns});}return chain;})()}));
 const axe=await new AxeBuilder({page}).analyze();
 await writeFile(`${dir}/structured-list.json`,JSON.stringify({phase,geometry,axe},null,2));
 await page.screenshot({path:`${dir}/structured-list.png`,fullPage:true});
 console.log(JSON.stringify({phase,geometry,violations:axe.violations.length},null,2));
 if(phase==='after'&&(geometry.pageWidth>360||axe.violations.length))process.exitCode=1;
} finally {await browser.close();await server.close();}
