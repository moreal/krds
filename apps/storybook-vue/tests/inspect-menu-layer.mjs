import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {serveProduction,browserPath} from '../../../tools/testing/support.mjs';
import {guardStoryNetwork} from '../../../tools/testing/network.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
const phase=process.argv[2]??'before',viewportWidth=phase.includes('320')?320:360,dir='../../.superpowers/sdd/PLAN/t10-vue-logs/mobile-menu-layout';await mkdir(dir,{recursive:true});
const server=await serveProduction(new URL('../dist',import.meta.url).pathname),browser=await chromium.launch();
try {
 const context=await browser.newContext({viewport:{width:viewportWidth,height:800}}),page=await context.newPage();
 const policy=await guardStoryNetwork(context,server.origin,server.assets);
 await page.goto(`${server.origin}/iframe.html?id=krds-main-menu--mobile-drilldown&viewMode=story`,{waitUntil:'networkidle'});
 if(phase.includes('text200'))await page.evaluate(()=>document.documentElement.style.fontSize=`${parseFloat(getComputedStyle(document.documentElement).fontSize)*2}px`);
 const opener=page.getByRole('button',{name:'전체 메뉴',exact:true});await opener.click();const dialog=page.getByRole('dialog',{name:'전체 메뉴',exact:true});
 for(const id of ['root','branch','apply'])await dialog.locator(`[data-krds-part=trigger][id$="-${id}"]`).click();
 const geometry=await page.evaluate(()=>{const describe=node=>{const c=getComputedStyle(node);return{tag:node.tagName,text:node.matches('a,button')?node.textContent.trim():undefined,availableTextInlineSize:node.clientWidth-parseFloat(c.paddingInlineStart)-parseFloat(c.paddingInlineEnd),part:node.getAttribute('data-krds-part'),component:node.getAttribute('data-krds-component'),rect:node.getBoundingClientRect().toJSON(),clientWidth:node.clientWidth,scrollWidth:node.scrollWidth,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight,css:{fontSize:c.fontSize,lineHeight:c.lineHeight,minBlockSize:c.minBlockSize,paddingInlineStart:c.paddingInlineStart,paddingInlineEnd:c.paddingInlineEnd,position:c.position,inset:c.inset,zIndex:c.zIndex,transform:c.transform,overflow:c.overflow,padding:c.padding}}};const close=document.querySelector('[data-krds-component=modal][data-krds-part=close]'),r=close.getBoundingClientRect();return{viewport:{width:innerWidth,height:innerHeight},pageWidth:document.documentElement.scrollWidth,chain:(()=>{let node=document.querySelector('[data-krds-component=main-menu][data-krds-part=mobile-content]');const chain=[];for(let i=0;node&&i<5;i++,node=node.parentElement)chain.push(describe(node));return chain;})(),menuItems:[...document.querySelectorAll('[data-krds-component=main-menu] ul,[data-krds-component=main-menu] li,[data-krds-component=main-menu][data-krds-part=submenu],[data-krds-component=main-menu][data-krds-part=trigger],[data-krds-component=main-menu][data-krds-part=link]')].filter(node=>node.getClientRects().length).map(describe),close:describe(close),closeHitTarget:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.outerHTML};});
 const css=await readFile('../../packages/styles/src/components/main-menu.css'),axe=await new AxeBuilder({page}).analyze();
 await page.screenshot({path:`${dir}/${phase}.png`,fullPage:true});
 const leaf=dialog.getByRole('link',{name:'신규 신청',exact:true});await leaf.scrollIntoViewIfNeeded();await page.screenshot({path:`${dir}/${phase}-leaf.png`,fullPage:true});
 const record={phase,geometry,leafViewport:await leaf.boundingBox(),axe,owningCSS:{path:'packages/styles/src/components/main-menu.css',sha256:createHash('sha256').update(css).digest('hex')},nativeOverflowMaskAdded:false,requests:policy.requests,forbiddenRequests:policy.violations};
 try{const close=dialog.locator('[data-krds-component=modal][data-krds-part=close]');await close.scrollIntoViewIfNeeded();record.closeAfterScrollHit=await close.evaluate(node=>{const r=node.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===node||node.contains(hit);});await close.click({timeout:1500});await expect(opener).toBeFocused();record.realCloseAndReturn='passed';}catch(error){record.realCloseAndReturn=String(error);}
 await writeFile(`${dir}/${phase}.json`,JSON.stringify(record,null,2));console.log(JSON.stringify({phase,geometry,realCloseAndReturn:record.realCloseAndReturn,violations:axe.violations.length},null,2));
 if(phase.startsWith('after')) {
  expect(geometry.chain[0].rect.height).toBeGreaterThan(0);
  expect(geometry.chain[1].rect.height).toBeGreaterThan(0);
  expect(geometry.chain[0].css.position).toBe('static');
  expect(geometry.chain[0].css.overflow).toBe('visible');
  expect(geometry.chain[0].scrollWidth).toBeLessThanOrEqual(geometry.chain[0].clientWidth);
  expect(geometry.chain[1].scrollWidth).toBeLessThanOrEqual(geometry.chain[1].clientWidth);
  expect(record.closeAfterScrollHit).toBe(true);
  expect(geometry.menuItems.filter(item=>item.part==='trigger'||item.part==='link').every(item=>item.rect.height>=44)).toBe(true);
  expect(policy.violations).toEqual([]);
  expect(record.realCloseAndReturn).toBe('passed');
  expect(axe.violations).toEqual([]);
  expect(geometry.pageWidth).toBeLessThanOrEqual(viewportWidth);
 }
}finally{await browser.close();await server.close();}
