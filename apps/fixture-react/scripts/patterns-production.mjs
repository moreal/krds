import {mkdtemp,cp,readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join,relative} from 'node:path';
/** Freeze before serving: other native owners may rebuild the normal output. */
export async function freezeProduction(source,out,kind) {
 const directory=await mkdtemp(`/private/tmp/krds-t11-react-${kind}-`);
 await cp(source,directory,{recursive:true});
 const files=[];
 async function walk(folder){for(const item of await readdir(folder,{withFileTypes:true})){const path=join(folder,item.name);if(item.isDirectory())await walk(path);else{const data=await readFile(path);files.push({path:relative(directory,path),bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});}}}
 await walk(directory);files.sort((a,b)=>a.path.localeCompare(b.path));
 await writeFile(join(out,'production-snapshot.json'),JSON.stringify({source,directory,files},null,2)+'\n');
 return directory;
}
