import {chromium,firefox,webkit} from 'playwright';
const engine=process.env.KRDS_BROWSER??'chromium',timezoneId=process.env.KRDS_TIMEZONE??'UTC';if(!['chromium','firefox','webkit'].includes(engine))throw new Error(`Unknown browser ${engine}`);
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {extname,join,resolve} from 'node:path';
const folder=resolve(process.argv[2]??'dist'),errors=[],requests=[];
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let path=join(folder,decodeURIComponent(url.pathname));if((await stat(path)).isDirectory())path=join(path,'index.html');if(!path.startsWith(`${folder}/`))throw new Error('unsafe request');const bytes=await readFile(path);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml'})[extname(path)]??'application/octet-stream');res.end(bytes);}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
let browser;
try{
 browser=await ({chromium,firefox,webkit})[engine].launch({headless:true}); const page=await browser.newPage({timezoneId});
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/*',route=>{const url=route.request().url();requests.push(url);if(!url.startsWith(origin)&&!url.startsWith('data:')){errors.push(`External request ${url}`);return route.abort();}return route.continue();});
 await page.goto(origin,{waitUntil:'networkidle'});
 const action=page.getByRole('button',{name:'Activate',exact:true}); await action.waitFor();
 if(await page.locator('output').textContent()!=='0')throw new Error('Invalid initial state');
 await action.click(); await page.waitForFunction(()=>document.querySelector('output')?.textContent==='1');
 await action.focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('output')?.textContent==='2');
 let reactiveForm=null;if(await page.locator('#cva-value').count()){await page.getByLabel('Region',{exact:true}).selectOption('b');await page.waitForFunction(()=>document.querySelector('#cva-value')?.textContent==='b');reactiveForm='NativeSelect ControlValueAccessor changed FormControl a→b';}
 if(errors.length)throw new Error(errors.join('\n'));
 console.log(JSON.stringify({status:'passed',browser:engine,timezoneId,reactiveForm,firstInteraction:'click 0→1',keyboard:'Enter 1→2',externalRequests:[],requests},null,2));
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
