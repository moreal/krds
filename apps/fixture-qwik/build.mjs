import { spawnSync } from 'node:child_process';
import { writeFile, readdir, rm } from 'node:fs/promises';
const ordinaryOutputs=['index.html','resume.html','examples.html','build','server','assets','q-manifest.json','local','local-assets','_legal'];
for(const entry of await readdir('dist').catch(()=>[])){if(entry==='docs-preview'||entry==='docs-preview-server'||entry==='docs-preview-capture')continue;if(!ordinaryOutputs.includes(entry))throw new Error(`Unowned Qwik fixture output: ${entry}`);await rm(`dist/${entry}`,{recursive:true,force:true});}
const run=(args)=>{const result=spawnSync(process.execPath,['../../tools/yarn.mjs',...args],{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1);};
run(['exec','vite','build']);
run(['exec','vite','build','--ssr','src/entry.ssr.tsx']);
const {render}=await import('./dist/server/entry.ssr.js');
for(const [file,resume]of [['index.html',false],['resume.html',true],['examples.html',false]]){const output=await render({resume,examples:file==='examples.html'});await writeFile(`dist/${file}`,output.html);}
