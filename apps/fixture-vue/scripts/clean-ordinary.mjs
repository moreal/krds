import {readdirSync,rmSync,existsSync} from 'node:fs';
const dir=new URL('../dist/',import.meta.url); const owned=['index.html','assets','local','local-assets','_legal']; if(existsSync(dir)){for(const name of readdirSync(dir)){if(name==='docs-preview')continue;if(!owned.includes(name))throw Error(`Unknown ordinary output ${name}`);rmSync(new URL(name,dir),{recursive:true,force:true});}}
