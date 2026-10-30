import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium,webkit} from 'playwright';
import {root} from '../../../tools/testing/support.mjs';
if(process.env.PLAYWRIGHT_BROWSERS_PATH!=='/private/tmp/krds-playwright-1.64.1')throw new Error('Use the selected browser cache before execution.');
const engine=process.env.KRDS_PATTERN_BROWSER==='webkit'?'webkit':'chromium';
const browser=await (engine==='webkit'?webkit:chromium).launch();const context=await browser.newContext({viewport:{width:360,height:800}});const page=await context.newPage();const observations=[];
const focus=()=>page.evaluate(()=>({id:document.activeElement?.id??'',tag:document.activeElement?.tagName,hasFocus:document.hasFocus()}));
try{
 await page.setContent('<select id="bare-select"><option value="all">전체</option><option value="guide">가이드</option><option value="example">예제</option></select>');
 await page.locator('select').focus();for(const key of ['ArrowDown','ArrowDown','Enter']){await page.keyboard.press(key);observations.push({control:'bare-select',key,value:await page.locator('select').inputValue(),focus:await focus()});}
 await page.setContent('<section id="bare-role-dialog" role="dialog" tabindex="-1"><button id="first">돌아가기</button><button id="second">예제 완료</button><button id="close">닫기</button></section>');
 await page.locator('#bare-role-dialog').focus();for(let i=0;i<4;i++){await page.keyboard.press('Tab');observations.push({control:'bare-role-dialog',step:i+1,focus:await focus()});}
 await page.locator('#first').focus();await page.keyboard.press('Tab');observations.push({control:'bare-first-button',focus:await focus()});
 await page.setContent('<dialog id="bare-dialog"><button id="native-first">돌아가기</button><button id="native-second">예제 완료</button><button id="native-close">닫기</button></dialog>');await page.locator('dialog').evaluate(dialog=>dialog.showModal());
 observations.push({control:'native-dialog-open',focus:await focus()});for(let i=0;i<4;i++){await page.keyboard.press('Tab');observations.push({control:'native-dialog',step:i+1,focus:await focus()});}
 const result={engine,browserVersion:browser.version(),browserCache:process.env.PLAYWRIGHT_BROWSERS_PATH,observations};await writeFile(join(root,'.superpowers/sdd/PLAN/t11-vue-logs',`33-${engine}-bare-keyboard.json`),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
