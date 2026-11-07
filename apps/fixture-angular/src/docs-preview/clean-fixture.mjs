import { readdirSync, rmSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const dist=resolve('dist');
const owned=new Set(['index.html','main.js','styles.css','3rdpartylicenses.txt','local','local-assets','_legal']);
if(existsSync(dist)) for(const name of readdirSync(dist)) { if(name==='docs-preview') continue; if(!owned.has(name)) throw new Error(`Unowned Angular fixture output: ${name}`); rmSync(resolve(dist,name),{recursive:true,force:true}); }
