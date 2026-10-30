/** Runs native pattern behavior against one explicitly granted immutable official-CLI artifact. */
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile,stat} from 'node:fs/promises';
import {resolve,join,extname,relative} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {exerciseAngular} from '../tests/patterns/angular.browser.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH='/private/tmp/krds-playwright-1.64.1';
const root=resolve(import.meta.dirname,'..');
const require=createRequire(join(root,'apps/fixture-angular/package.json'));
const {chromium}=require('playwright');
const AxeBuilder=require('@axe-core/playwright').default;
const args=process.argv.slice(2),option=name=>args[args.indexOf(name)+1];
assert.ok(args.includes('--dist'),'Pass --dist for the owner-granted compiled immutable artifact.');
const directory=resolve(option('--dist'));const output=resolve(args.includes('--output')?option('--output'):join(root,'.superpowers/sdd/PLAN/t11-angular-logs/browser'));
await mkdir(output,{recursive:true});
const html=await readFile(join(directory,'index.html'),'utf8');assert.ok(/main(?:-|\.)/.test(html),'Expected official CLI production output.');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'};
const server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://127.0.0.1');let file=join(directory,decodeURIComponent(url.pathname));if(relative(directory,file).startsWith('..')){res.writeHead(403).end();return;}try{if(!(await stat(file)).isFile())file=join(directory,'index.html');}catch{file=join(directory,'index.html');}res.setHeader('Content-Type',mime[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch(error){res.writeHead(500).end(String(error));}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true});const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(8000);
const errors=[],requests=[],networkRequests=[],serviceRequests=[];page.on('pageerror',error=>errors.push(error.stack));page.on('request',request=>{networkRequests.push({url:request.url(),method:request.method(),type:request.resourceType()});if(['fetch','xhr','websocket'].includes(request.resourceType()))serviceRequests.push(request.url());if(!request.url().startsWith(origin)&&!request.url().startsWith('data:'))requests.push(request.url());});
async function capture(name,data){if(data)await writeFile(join(output,name+'.json'),JSON.stringify(data,null,2));else {await page.screenshot({path:join(output,name+'.png'),fullPage:true});if(name.endsWith('failure')){const details=await page.evaluate(()=>({active:document.activeElement?.outerHTML,dialogs:[...document.querySelectorAll('[role=dialog],dialog')].map(node=>node.outerHTML),events:window.__KRDS_FIXTURE__?.readEvents(),body:document.body.getAttribute('style'),inert:[...document.querySelectorAll('[inert]')].map(node=>node.tagName)}));await writeFile(join(output,name+'.json'),JSON.stringify(details,null,2));}}}
let results;
try{results=await exerciseAngular(page,origin,{capture,axe:page=>new AxeBuilder({page}).analyze()});}
finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
const sourceFiles=['packages/angular/examples/patterns/view.ts','packages/angular/examples/patterns/presentation.ts','apps/fixture-angular/src/examples/pattern-fixture-host.ts','tests/patterns/angular.browser.mjs','scripts/patterns-angular.mjs'];
const source=[];for(const file of sourceFiles){const bytes=await readFile(join(root,file));source.push({path:file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
const report={artifact:directory,source,results,errors,externalRequests:requests,networkRequests,serviceRequests};await writeFile(join(output,'results.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:results.filter(item=>item.status==='passed').length,failed:results.filter(item=>item.status==='failed').length,errors,externalRequests:requests,output},null,2));
assert.equal(results.filter(item=>item.status==='failed').length,0,JSON.stringify(results.filter(item=>item.status==='failed'),null,2));assert.ok(results.length>0,'Empty native behavioral suite');if(!process.env.KRDS_PATTERN_CASE)assert.equal(results.length,21,'Expected fifteen scenarios, two native integration checks and four visual/a11y groups');assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);assert.deepEqual(serviceRequests,[]);
