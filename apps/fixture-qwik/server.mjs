import {createServer} from 'node:http';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {extname,join,relative,resolve,sep} from 'node:path';

/** Request-time SSR of the production optimizer output, using the built library. */
export async function startProductionSsr() {
 const directory=resolve(import.meta.dirname,'dist');
 const {render,patternRouteForUrl}=await import('./dist/server/entry.ssr.js');
 const assets=new Set();
 async function walk(current){for(const entry of await readdir(current,{withFileTypes:true})){if(entry.isSymbolicLink())throw new Error('Unexpected production symlink');const file=join(current,entry.name);if(entry.isDirectory()){if(entry.name!=='server')await walk(file);}else assets.add('/'+relative(directory,file).split(sep).join('/'));}}
 await walk(directory);
 const types={'.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'},renders=[];
 const server=createServer(async(request,response)=>{
  try {
   const path=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
   if(path.split('/').includes('..')||path.includes('\\')){response.writeHead(403).end();return;}
   const pattern=patternRouteForUrl(new URL(request.url,'http://localhost').href);
   if(pattern||path.startsWith('/__fixture/')||['/', '/index.html','/resume.html','/examples.html','/configuration.html','/fix1.html','/catalog-resume.html','/source-contracts.html','/source-file-contracts.html'].includes(path)){
    const query=new URL(request.url,'http://localhost').searchParams;
    const result=await render({sourceFileContract:path==='/source-file-contracts.html'?query.get('case')??'multiple':undefined,sourceContract:path==='/source-contracts.html'?query.get('case')??'quantity-order':undefined,pattern:pattern??undefined,catalog:path==='/catalog-resume.html'?{componentId:query.get('component')??'accordion',caseId:query.get('case')??'default'}:undefined,resume:path==='/resume.html',examples:path==='/examples.html',fix1:path==='/fix1.html',configuration:path==='/configuration.html'?new URL(request.url,'http://localhost').searchParams.get('case'):undefined});
    renders.push({path,bytes:Buffer.byteLength(result.html),sha256:createHash('sha256').update(result.html).digest('hex')});
    response.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-krds-render':'production-qwik-ssr'}).end(result.html);return;
   }
   if(!assets.has(path)){response.writeHead(404).end();return;}
   response.writeHead(200,{'content-type':types[extname(path)]??'application/octet-stream','cache-control':'no-store'}).end(await readFile(join(directory,path)));
  }catch(error){response.writeHead(500).end(String(error));}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 return {origin:`http://127.0.0.1:${server.address().port}`,renders,close:()=>new Promise((resolve,reject)=>{server.close(error=>error?reject(error):resolve());server.closeAllConnections();})};
}
