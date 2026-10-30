import {createServer} from 'node:http';
import {readFile,readdir,stat,mkdir,writeFile,appendFile} from 'node:fs/promises';
import {resolve,relative,sep,extname,join} from 'node:path';
import {spawn} from 'node:child_process';
import {randomUUID,createHash} from 'node:crypto';
import {createBrowserEnvironment} from '../../tests/compatibility/browser-environment.mjs';
export const root=resolve(import.meta.dirname,'../..');
export const browserPath='/private/tmp/krds-playwright-1.64.1';
const exampleEntries=new Set(['/examples/form-errors','/examples/search-results','/examples/consent-confirmation','/examples/service-layout']);
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.woff':'font/woff','.ico':'image/x-icon','.wav':'audio/wav','.vtt':'text/vtt','.mp4':'video/mp4','.webm':'video/webm'};
export async function assetPaths(directory) {
  const paths=new Set();
  async function walk(current) { for (const item of await readdir(current,{withFileTypes:true})) {
    if (item.isSymbolicLink()) throw new Error(`Production asset symlink forbidden: ${item.name}`);
    const path=join(current,item.name); if (item.isDirectory()) await walk(path); else paths.add('/'+relative(directory,path).split(sep).join('/'));
  }}
  await walk(directory); if(paths.has('/index.html')) paths.add('/');
  // These aliases exist only for actual, allowlisted local fixture documents.
  for(const path of [...paths]) if(path.startsWith('/local/') && path.endsWith('/index.html')) {
    paths.add(path.slice(0,-'/index.html'.length));paths.add(path.slice(0,-'index.html'.length));
  }
  return paths;
}
function localDocument(assets,pathname){
  const index=`${pathname.replace(/\/$/,'')}/index.html`;
  return pathname.startsWith('/local/')&&assets.has(index)?index:pathname==='/'?'/index.html':pathname;
}
async function productionSnapshot(directory){
  const assets=await assetPaths(directory);
  if(!assets.has('/index.html'))throw new Error(`Missing production index.html in ${directory}; build selected app first`);
  const paths=[...new Set([...assets].map(path=>localDocument(assets,path)))].sort();
  const bytes=new Map();const files=[];
  for(const path of paths){
    const content=await readFile(join(directory,path));bytes.set(path,content);
    files.push({path,bytes:content.length,sha256:createHash('sha256').update(content).digest('hex')});
  }
  const after=await assetPaths(directory);
  if([...assets].sort().join('\n')!==[...after].sort().join('\n'))throw new Error(`Production output changed during snapshot: ${directory}`);
  for(const file of files){
    const current=await readFile(join(directory,file.path));
    if(createHash('sha256').update(current).digest('hex')!==file.sha256)throw new Error(`Production asset changed during snapshot: ${file.path}`);
  }
  const snapshot={directory,sha256:createHash('sha256').update(JSON.stringify(files)).digest('hex'),files,stableVerified:true,capturedAt:new Date().toISOString()};
  return {assets,bytes,snapshot};
}
export async function serveProduction(directory,{fixture=false,responseLedger}={}) {
  directory=resolve(directory);
  // Capture real production bytes, then independently reread/hash the source.
  // Once listening, no request reads a mutable producer directory again.
  const {assets,bytes,snapshot}=await productionSnapshot(directory);
  let sequence=0,ledgerWrites=Promise.resolve(),ledgerError;
  if(responseLedger)await writeFile(responseLedger,'');
  const server=createServer((request,response)=>{
    let asset=null,bodySha256=null,contentType=null;
    if(responseLedger){
      const startedAt=Date.now(),requestSequence=++sequence;
      let requestUrl;
      try{requestUrl=new URL(request.url,`http://127.0.0.1:${server.address()?.port}`).href;}
      catch{requestUrl=request.url;}
      response.once('finish',()=>{
        const row={sequence:requestSequence,startedAt,finishedAt:Date.now(),url:requestUrl,method:request.method,destination:request.headers['sec-fetch-dest']??null,accept:request.headers.accept??null,status:response.statusCode,contentType,asset,bodySha256,artifactSha256:snapshot.sha256};
        ledgerWrites=ledgerWrites.then(()=>appendFile(responseLedger,JSON.stringify(row)+'\n')).catch(error=>{ledgerError??=error;});
      });
    }
    try{
      const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
      if(pathname.split('/').includes('..')||pathname.includes('\\')){response.writeHead(403).end();return;}
      let file=localDocument(assets,pathname);
      if(fixture&&(pathname.startsWith('/fixtures/')||exampleEntries.has(pathname)))file='/index.html';
      const content=bytes.get(file);
      if(!content){response.writeHead(404).end('Unknown production asset');return;}
      if(responseLedger){asset=file;bodySha256=snapshot.files.find(item=>item.path===file).sha256;}
      const localHtml=pathname.startsWith('/local/')&&extname(file)===''&&/^\s*(?:<!doctype\s+html\b|<html\b)/i.test(content.toString('utf8',0,512));
      contentType=mime[extname(file)]??(localHtml?'text/html':'application/octet-stream');
      response.writeHead(200,{'Content-Type':contentType,'Cache-Control':'no-store','X-KRDS-Artifact-SHA256':snapshot.sha256}).end(content);
    }catch{response.writeHead(400).end();}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const origin=`http://127.0.0.1:${server.address().port}`;
  return {origin,assets,snapshot,close:async()=>{
    await new Promise((resolve,reject)=>{server.close(error=>error?reject(error):resolve());server.closeAllConnections();});
    await ledgerWrites;if(ledgerError)throw ledgerError;
  }};
}
export async function fixtureDist(framework) {
  const base=join(root,`apps/fixture-${framework}/dist`);
  if(await stat(join(base,'browser/index.html')).catch(()=>false)) return join(base,'browser');
  return base;
}
export async function reportDirectory(kind) {
  const directory=join(root,'test-results/t05',`${kind}-${Date.now()}-${process.pid}-${randomUUID().slice(0,8)}`);
  await mkdir(directory,{recursive:true});return directory;
}
export async function writeReport(directory,report) {
  const path=join(directory,'report.json');await writeFile(path,JSON.stringify(report,null,2)+'\n');console.log(`Report: ${path}`);return path;
}
export function runSelected(args,{env={},cwd=root,log,timeoutMs=180000,browserName}={}) {
  if(!Number.isSafeInteger(timeoutMs) || timeoutMs<=0 || timeoutMs>1800000) throw new RangeError('Command timeoutMs must be a positive safe integer at most 1800000');
  return (async()=>{
    const runtime=await createBrowserEnvironment(browserName,{...process.env,PLAYWRIGHT_BROWSERS_PATH:browserPath,...env});
    try{return await new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[join(root,'tools/yarn.mjs'),...args],{cwd,env:runtime.env,stdio:['ignore','pipe','pipe'],detached:true});
    let output=''; const onData=data=>{const text=String(data);output+=text;process.stdout.write(text);};child.stdout.on('data',onData);child.stderr.on('data',onData);
    const stop=()=>{try {process.kill(-child.pid,'SIGTERM');} catch {}};
    process.once('SIGINT',stop);process.once('SIGTERM',stop);
    const timeout=setTimeout(()=>{stop();setTimeout(()=>{try{process.kill(-child.pid,'SIGKILL');}catch{}},1000).unref();},timeoutMs);
    child.once('error',error=>{clearTimeout(timeout);process.off('SIGINT',stop);process.off('SIGTERM',stop);reject(error);});
    child.once('close',async(code,signal)=>{clearTimeout(timeout);process.off('SIGINT',stop);process.off('SIGTERM',stop);try{if(log)await writeFile(log,output);resolve({code:code??1,signal,output});}catch(error){reject(error);}});
    });}finally{await runtime.cleanup();}
  })();
}
