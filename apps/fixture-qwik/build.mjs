import { spawnSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
const run=(args)=>{const result=spawnSync(process.execPath,['../../tools/yarn.mjs',...args],{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1);};
run(['exec','vite','build']);
run(['exec','vite','build','--ssr','src/entry.ssr.tsx']);
const {render}=await import('./dist/server/entry.ssr.js');
for(const [file,resume]of [['index.html',false],['resume.html',true],['examples.html',false]]){const output=await render({resume,examples:file==='examples.html'});await writeFile(`dist/${file}`,output.html);}
