import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {serveProduction,root,browserPath} from '../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const output=join(root,'.superpowers/sdd/PLAN/t10-react-logs/'+(process.env.KRDS_VISUAL_OUTPUT??(process.env.KRDS_VISUAL_COMPONENT?'footer-proof':'story-visual-fifth')));
await mkdir(output,{recursive:true});
const stories=JSON.parse(await readFile(join(root,'catalog/full-catalog-stories.json'),'utf8')).cases.filter(item=>process.env.KRDS_VISUAL_COMPONENTS?process.env.KRDS_VISUAL_COMPONENTS.split(',').includes(item.componentId):!process.env.KRDS_VISUAL_COMPONENT||item.componentId===process.env.KRDS_VISUAL_COMPONENT);
if(process.env.KRDS_VISUAL_ENV_ONLY){for(let index=stories.length-1;index>=0;index--)if(stories.findIndex(story=>story.componentId===stories[index].componentId)!==index)stories.splice(index,1);}
const index=JSON.parse(await readFile(join(process.env.KRDS_REACT_STORY_SNAPSHOT??join(root,'apps/storybook-react/dist'),'index.json'),'utf8'));
const server=await serveProduction(process.env.KRDS_REACT_STORY_SNAPSHOT??join(root,'apps/storybook-react/dist'));
const browser=await chromium.launch();
const results=[];
try{
 const pending=[...stories];
 await Promise.all(Array.from({length:3},async()=>{
  for(let story;(story=pending.shift());){
   const context=await browser.newContext({viewport:story.environment.viewport,locale:'ko-KR',timezoneId:'Asia/Seoul',reducedMotion:'reduce',serviceWorkers:'block'});
   const requests=[],runtimeErrors=[];
   await context.route('**/*',async route=>{const req=route.request();const url=new URL(req.url());const allowed=url.origin===server.origin&&['GET','HEAD'].includes(req.method());requests.push({url:req.url(),method:req.method(),allowed});if(allowed)await route.continue();else await route.abort('blockedbyclient');});
   const page=await context.newPage();page.on('pageerror',e=>runtimeErrors.push(String(e)));
   const item={id:story.id,componentId:story.componentId,indexPresent:!!index.entries[story.id],requests,runtimeErrors,coverageAwarded:false};
   try{
    if(!item.indexPresent)throw new Error('Story ID missing from actual native Storybook index');
    await page.goto(`${server.origin}/iframe.html?id=${story.id}&viewMode=story`,{waitUntil:'networkidle'});
    await page.locator('#storybook-root').waitFor();await page.evaluate(()=>document.fonts.ready);
    const errors=await page.locator('.sb-errordisplay:visible,.sb-error:visible').count();if(errors||runtimeErrors.length)throw new Error('Native story runtime error');
    const raw=await new AxeBuilder({page}).include('#storybook-root').analyze();
    await writeFile(join(output,`${story.id}.axe.json`),JSON.stringify(raw,null,2));
    if(story.componentId==='badge')item.computedLabels=await page.locator('[data-krds-component="badge"][data-krds-part="label"]').evaluateAll(nodes=>nodes.map(node=>({text:node.textContent,color:getComputedStyle(node).color,fontSize:getComputedStyle(node).fontSize,fontWeight:getComputedStyle(node).fontWeight,background:getComputedStyle(node.parentElement).backgroundColor,opacity:getComputedStyle(node).opacity,tone:node.parentElement.dataset.krdsTone,appearance:node.parentElement.dataset.krdsAppearance})));
    if(story.componentId==='footer')item.computedLinks=await page.locator('[data-krds-component="footer"][data-krds-part="root"] a').evaluateAll(nodes=>nodes.map(node=>({text:node.textContent,color:getComputedStyle(node).color,fontSize:getComputedStyle(node).fontSize,fontWeight:getComputedStyle(node).fontWeight,background:getComputedStyle(node.closest('footer')).backgroundColor,component:node.dataset.krdsComponent,part:node.dataset.krdsPart})));
    item.axeViolations=raw.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length}));
    const subject=page.locator(`[data-krds-component="${story.componentId}"][data-krds-part="root"]`).filter({visible:true}).first();
    const capture=async(path)=>{await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));if(await subject.count()){await subject.screenshot({path,animations:'disabled',caret:'hide',scale:'css'});}else await page.screenshot({path,animations:'disabled',caret:'hide',scale:'css'});};
    const screenshot=join(output,`${story.id}.png`);await capture(screenshot);await page.screenshot({path:join(output,`${story.id}.context.png`),fullPage:true,animations:'disabled',caret:'hide',scale:'css'});
    item.screenshot=screenshot;item.screenshotSha256=createHash('sha256').update(await readFile(screenshot)).digest('hex');
    if(stories.find(s=>s.componentId===story.componentId).id===story.id){
     item.environments=[];
     for(const mode of ['narrow-200-text','forced-colors']){
      if(mode==='narrow-200-text'){await page.setViewportSize({width:320,height:800});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));item.textScaling=await page.evaluate(()=>{const nodes=[...document.querySelectorAll('#storybook-root, #storybook-root *')];const before=nodes.map(node=>({node,size:parseFloat(getComputedStyle(node).fontSize),inline:node.style.fontSize,priority:node.style.getPropertyPriority('font-size')}));window.__krdsFontRestore=before;for(const item of before)item.node.style.setProperty('font-size',`${item.size*2}px`,'important');return before.filter(item=>item.node.textContent?.trim()).map(item=>({tag:item.node.tagName,part:item.node.dataset.krdsPart??null,before:item.size,after:parseFloat(getComputedStyle(item.node).fontSize)}));});}
      else {await page.setViewportSize({width:1280,height:800});await page.evaluate(()=>{for(const item of window.__krdsFontRestore??[]){if(item.inline)item.node.style.setProperty('font-size',item.inline,item.priority);else item.node.style.removeProperty('font-size');}delete window.__krdsFontRestore;});await page.emulateMedia({forcedColors:'active'});}
      const name=`${story.id}.${mode}`;await capture(join(output,name+'.png'));
      const axe=await new AxeBuilder({page}).include('#storybook-root').analyze();await writeFile(join(output,name+'.axe.json'),JSON.stringify(axe,null,2));
      if(mode==='narrow-200-text')item.survivingTextScale=await page.evaluate(()=>(window.__krdsFontRestore??[]).filter(item=>item.node.isConnected&&item.node.textContent?.trim()).map(item=>({tag:item.node.tagName,part:item.node.dataset.krdsPart??null,before:item.size,after:parseFloat(getComputedStyle(item.node).fontSize)})));
      item.environments.push({mode,violations:axe.violations.map(v=>v.id),horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});
     }
    }
    item.status=requests.every(r=>r.allowed)&&!runtimeErrors.length?'rendered':'failed';
   }catch(error){item.status='failed';item.error=String(error);await page.screenshot({path:join(output,`${story.id}.failed.png`)}).catch(()=>{});}
   finally{results.push(item);await context.close();await writeFile(join(output,'progress.json'),JSON.stringify(results,null,2));}
  }
 }));
 await writeFile(join(output,'report.json'),JSON.stringify({framework:'react',stories:results,coverageAwarded:false,visualReview:'pending-human-and-independent-review',textScaling:'Actual per-element computed font sizes doubled at 320 CSS px; raw before/after recorded; browser chrome zoom remains manual'},null,2));
 console.log(JSON.stringify({total:results.length,rendered:results.filter(r=>r.status==='rendered').length,failed:results.filter(r=>r.status==='failed').length,axeViolations:results.filter(r=>r.axeViolations?.length).length}));
}finally{await browser.close();await server.close();}
