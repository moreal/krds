import {serveProduction,root,browserPath} from '../../../../tools/testing/support.mjs';
import {createBrowserEnvironment} from '../../../../tests/compatibility/browser-environment.mjs';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
const {chromium}=await import('playwright');
const server=await serveProduction(join(root,'apps/fixture-angular/dist'),{fixture:true});
const runtime=await createBrowserEnvironment('chromium');
const browser=await chromium.launch({env:runtime.env});
const result={artifact:server.snapshot,checks:{},errors:[]};
async function fixture(id,number){const page=await browser.newPage({viewport:{width:1280,height:800}});page.on('pageerror',error=>result.errors.push(String(error)));await page.goto(server.origin+`/fixtures/${id}?case=outcome-${number}`);await page.getByRole('status',{name:'Fixture health'}).waitFor();return page;}
try{
 const p=await fixture('bottom-sheet','01');const dialog=p.getByRole('dialog',{name:'지역 선택'});await dialog.waitFor();await dialog.getByRole('button',{name:'닫기',exact:true}).focus();const steps=[];for(let n=0;n<5;n++){await p.keyboard.press('Tab');steps.push(await dialog.evaluate(node=>({active:document.activeElement?.outerHTML,inside:node.contains(document.activeElement),elements:[...node.querySelectorAll('button,input')].map(item=>({tag:item.tagName,id:item.id,tabIndex:item.tabIndex,disabled:item.disabled}))})));}result.checks.bottomSheetTab=steps;await p.close();
 const l=await fixture('language-switcher','01');result.checks.language=await l.getByRole('link',{name:'English',exact:true}).evaluate(node=>({box:node.getBoundingClientRect().toJSON(),list:node.closest('ul')?.getBoundingClientRect().toJSON(),root:node.closest('krds-language-switcher')?.getBoundingClientRect().toJSON()}));await l.close();
 const c=await fixture('contextual-help','05');await c.setViewportSize({width:360,height:400});await c.getByRole('button',{name:'신청 자격 도움말'}).click();const popup=c.locator('[data-krds-component=contextual-help][data-krds-part=popover]');result.checks.contextImmediate=await popup.boundingBox();await popup.waitFor({state:'visible'});result.checks.contextCommitted=await popup.boundingBox();await c.close();
 const coach=await fixture('coach-mark','06');await coach.locator('[data-krds-component=coach-mark][data-krds-part=popover]').waitFor();await coach.setViewportSize({width:360,height:600});await coach.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));result.checks.coachCommittedTarget=await coach.locator('#applicant-name').boundingBox();await coach.close();
}finally{await browser.close();await runtime.cleanup();await server.close();await writeFile(join(root,'.superpowers/sdd/PLAN/t10-angular-logs/'+(process.env.KRDS_ANGULAR_DIAGNOSTIC_OUTPUT??'runtime2-production-diagnostics')+'.json'),JSON.stringify(result,null,2)+'\n');}
console.log(JSON.stringify(result.checks,null,2));
assert.equal(result.errors.length,0,'Actual production fixture must have no browser errors');
assert.equal(result.checks.bottomSheetTab.every(step=>step.inside),true,'Every actual native Tab must remain in the active sheet');
assert.ok(result.checks.language.box.left>=0&&result.checks.language.box.right<=1280,'Actual language link must be on screen');
assert.ok(result.checks.contextCommitted&&result.checks.contextCommitted.x>=0&&result.checks.contextCommitted.y>=0&&result.checks.contextCommitted.x+result.checks.contextCommitted.width<=360&&result.checks.contextCommitted.y+result.checks.contextCommitted.height<=400,'Actual committed contextual popup must be fully bounded');
assert.ok(result.checks.coachCommittedTarget.y>=0&&result.checks.coachCommittedTarget.y+result.checks.coachCommittedTarget.height<=600,'Actual Coach target must remain visible after real resize');
