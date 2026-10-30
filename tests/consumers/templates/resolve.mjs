import {createRequire} from 'node:module';
import {readFile,realpath} from 'node:fs/promises';
import {dirname,join} from 'node:path';
const require=createRequire(new URL('./package.json',import.meta.url));
const request=JSON.parse(await readFile('resolution-request.json','utf8'));
const resolutions=[];
const {createHash}=await import('node:crypto');const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const [name,version] of Object.entries(request)) {
 const path=join(process.cwd(),'node_modules',name,'package.json');
 let resolvedEntry=null;try{resolvedEntry=import.meta.resolve(name);}catch{}
 const pkg=JSON.parse(await readFile(path,'utf8')); const location=await realpath(dirname(path));
 if(pkg.name!==name||pkg.version!==version)throw new Error(`${name}: expected ${version}, actual ${pkg.version}`);
 if(!location.startsWith(`${process.cwd()}/node_modules/`))throw new Error(`Escaped consumer installation: ${location}`);
 const bins=[];for(const [name,value] of Object.entries(typeof pkg.bin==='string'?{[pkg.name.split('/').at(-1)]:pkg.bin}:pkg.bin??{})){const path=await realpath(join(location,value));bins.push({name,path,sha256:hash(await readFile(path))});}
 resolutions.push({name,version:pkg.version,manifest:await realpath(path),manifestSha256:hash(await readFile(path)),location,resolvedEntry,entrySha256:resolvedEntry?hash(await readFile(new URL(resolvedEntry))):null,bins});
}
console.log(JSON.stringify(resolutions,null,2));
