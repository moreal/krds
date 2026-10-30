import {chromium} from 'playwright';import {expect} from '@playwright/test';import {writeFile,mkdir} from 'node:fs/promises';import {serveProduction,browserPath} from '../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;const server=await serveProduction(new URL('../dist',import.meta.url).pathname,{fixture:true});const browser=await chromium.launch();const results=[];
try{
 for(const id of ['native-select','date-input']){
  const page=await browser.newPage();const result={componentId:id,status:'failed'};
  try{await page.goto(`${server.origin}/fixtures/${id}?case=form-reset`);await page.waitForFunction(()=>window.__KRDS_FIXTURE__?.protocol===1);const field=page.getByRole(id==='native-select'?'combobox':'textbox');if(id==='native-select')await field.selectOption('busan');else{await field.fill('invalid draft');await field.press('Enter');}
   const before=await field.inputValue(),events=await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents());await field.evaluate(node=>node.form.addEventListener('reset',event=>event.preventDefault(),{once:true}));await page.getByRole('button',{name:'초기화',exact:true}).click();await expect(field).toHaveValue(before);expect(await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents())).toEqual(events);
   await page.getByRole('button',{name:'초기화',exact:true}).click();await expect(field).toHaveValue(id==='native-select'?'seoul':'');expect(await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents())).toEqual(events);result.status='passed';
  }catch(error){result.error=String(error);}finally{results.push(result);await page.close();}
 }
}finally{await browser.close();await server.close();}
console.log(JSON.stringify(results,null,2));const path=process.argv[2];if(path){await mkdir(new URL('.',new URL(path,'file://'+process.cwd()+'/')).pathname,{recursive:true});await writeFile(path,JSON.stringify(results,null,2)+'\n');}if(results.some(r=>r.status!=='passed'))process.exitCode=1;
