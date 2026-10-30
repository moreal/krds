/** Record the actual HTTP bytes fulfilled to the browser, including prefetches. */
import {readFile} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';

export function monitorDocsBrowser(browser,{root,dist,name}){
 const pending=new Set(),responses=[],failures=[];
 const drain=async()=>{while(pending.size)await Promise.all([...pending]);};
 const deliver=(route,options)=>{
  const task=(async()=>{
   let response,body;
   try{
    const url=new URL(options?.url??route.request().url());
    if(!['http:','https:'].includes(url.protocol)||!['localhost','127.0.0.1'].includes(url.hostname))throw new Error('Remote documentation response');
    // Fetch this intercepted browser request once, without following redirects.
    // Chromium exposes an empty response.body() for link prefetches, so retain
    // and deliver the same fetched bytes instead of using that protocol view.
    response=await route.fetch({...options,maxRedirects:0,maxRetries:0});
    body=await response.body();
    if(response.status()>=300&&response.status()<400){await route.fulfill({response,body});return;}
    if(response.status()!==200)throw new Error(`Documentation HTTP failure ${response.status()}`);
    const path=decodeURIComponent(url.pathname),choices=path.endsWith('/')?[`${path}index.html`]:[path,`${path}.html`,`${path}/index.html`];let file,expected;
    for(const candidate of choices){
     const candidateFile=resolve(dist,`.${candidate}`);
     if(!candidateFile.startsWith(`${dist}/`))throw new Error('Unsafe docs response path');
     try{expected=await readFile(candidateFile);file=candidateFile;break;}catch(cause){if(cause.code!=='ENOENT')throw cause;}
    }
    if(!expected)throw new Error(`Response is outside current built docs ${path}`);
    if(!body.equals(expected))throw new Error(`Browser consumed different documentation bytes ${path}`);
    await route.fulfill({response,body});
    responses.push({browser:name,url:url.href,responseUrl:response.url(),method:route.request().method(),status:response.status(),headers:response.headers(),delivery:'route.fulfill',path:relative(root,file),bytes:body.length,sha256:createHash('sha256').update(body).digest('hex')});
   }catch(cause){
    failures.push(cause.message);
    // Preserve the actual server outcome for the original producer's own
    // assertions; the monitor still fails on any invalid response bytes.
    try{if(response)await route.fulfill({response,body});else await route.abort();}catch(closeError){failures.push(closeError.message);}
   }finally{try{await response?.dispose();}catch(cause){failures.push(cause.message);}}
  })();
  pending.add(task);void task.finally(()=>pending.delete(task));return task;
 };
 const newContext=browser.newContext.bind(browser);
 browser.newContext=async(...options)=>{
  const context=await newContext(...options),register=context.route.bind(context),close=context.close.bind(context);
  await register('**/*',route=>deliver(route));
  // Keep the original T12 request policy callback, including its abort branch.
  context.route=(url,handler,...rest)=>register(url,(route,request)=>handler(new Proxy(route,{get(target,key){if(key==='continue')return options=>deliver(target,options);const value=Reflect.get(target,key);return typeof value==='function'?value.bind(target):value;}}),request),...rest);
  context.close=async(...args)=>{await drain();return close(...args);};
  return context;
 };
 const close=browser.close.bind(browser);browser.close=async(...args)=>{await drain();return close(...args);};
 return {responses,failures,drain};
}
