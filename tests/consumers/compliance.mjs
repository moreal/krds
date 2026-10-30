import {readFile,lstat,readdir} from 'node:fs/promises';
import {join,relative} from 'node:path';
import {root,hash,files} from './lib.mjs';
import {scopedPackages,scopePackageIds} from './scopes.mjs';
import {scopedInputs,termsClosure} from './inputs.mjs';
import {validateSchema,expectedArtifacts,noticeFiles,safePath} from '../../tools/generate-notices.mjs';
async function walk(folder,prefix=''){const result=[];for(const entry of await readdir(join(folder,prefix),{withFileTypes:true})){const path=join(prefix,entry.name);if(entry.isSymbolicLink())throw new Error(`Symlink in scoped shipped material ${path}`);if(entry.isDirectory())result.push(...await walk(folder,path));else if(entry.isFile())result.push(path);}return result;}
const normalize=text=>text.replace(/\s+/gu,' ').trim();
const mit=`Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
export async function verifyPackageCompliance({baseRoot=root,scope='all'}={}){
 const packages=await scopedPackages({baseRoot,scope}),closure=await scopedInputs(baseRoot,scopePackageIds(scope));const {policy,entries}=closure;const schema=JSON.parse(await readFile(join(root,'compliance/provenance.schema.json'),'utf8'));validateSchema(entries,schema);
 const ids=new Set(),inputs=new Map();const record=async path=>{const bytes=await readFile(safePath(baseRoot,path));inputs.set(path,{path,size:bytes.length,sha256:hash(bytes)});return bytes;};
 for(const path of closure.paths)await record(path);
 const identity=JSON.parse(await record('compliance/project-identity.json')),holder=identity.copyright?.independentCodeHolder,year=identity.copyright?.independentCodeYear,copyright=`Copyright (c) ${year} ${holder}`;
 if(identity.copyright?.status!=='confirmed'||typeof holder!=='string'||!holder.trim()||!/^\d{4}$/u.test(String(year))||policy.independentCode?.intent!=='MIT'||policy.independentCode?.releaseAllowed!==true||policy.independentCode?.holderStatus!=='confirmed'||policy.independentCode?.grantStatus!=='completed'||policy.independentCode?.copyrightNotice!==copyright||normalize((await record(policy.independentCode?.termsPath)).toString())!==normalize(`MIT License ${copyright} ${mit}`))throw new Error('Incomplete/mismatched independent MIT grant');
 for(const path of closure.terms){const bytes=await record(path);if(!bytes.length||!policy.sourceDocuments?.[path]||hash(bytes)!==policy.sourceDocuments[path])throw new Error(`Required original terms missing/hash mismatch ${path}`);}
 for(const entry of entries){if(ids.has(entry.id))throw new Error(`Duplicate scoped provenance ${entry.id}`);ids.add(entry.id);if(entry.rightsStatus!=='verified')throw new Error(`Unverified scoped distribution ${entry.id}`);const terms=(await record(entry.licenseTextPath)).toString();if(entry.copyrightNotice&&!terms.includes(entry.copyrightNotice))throw new Error(`Original copyright missing ${entry.id}`);for(const [index,path] of entry.localPaths.entries()){if(index!==0&&path.startsWith('packages/')&&!scopePackageIds(scope).some(id=>path.startsWith(`packages/${id}/`)))continue;const bytes=await record(path);if((index===0||!entry.modified)&&hash(bytes)!==entry.sha256)throw new Error(`Provenance source byte drift ${path}`);}}
 const expected=await expectedArtifacts({root:baseRoot,policy,entries,packages,distribution:null}),notices=[];
 for(const {folder,pkg} of packages){for(const name of noticeFiles)if(!pkg.files?.includes(name))throw new Error(`${pkg.name}: missing files whitelist notice ${name}`);if(pkg.license!=='SEE LICENSE IN LICENSE.md')throw new Error(`Incorrect scoped license metadata ${pkg.name}`);
  const required=termsClosure(policy,[policy.independentCode.termsPath,...entries.filter(e=>e.distributedIn.includes(pkg.name)).flatMap(e=>[e.licenseTextPath,...(policy.localLicenseReferences?.[e.licenseIdOrRef]?.textPaths??[])])]);
  for(const term of required)expected.set(join(folder,term),await readFile(safePath(baseRoot,term)));
  const licensePaths=new Set();for(const [path,value] of expected){if(!path.startsWith(`${folder}/`))continue;const actual=await readFile(path);if(!actual.equals(Buffer.isBuffer(value)?value:Buffer.from(value)))throw new Error(`Stale/incomplete scoped generated notice ${relative(baseRoot,path)}`);notices.push({path:relative(baseRoot,path),size:actual.length,sha256:hash(actual)});if(path.startsWith(join(folder,'LICENSES')+'/'))licensePaths.add(path);}
  for(const path of await walk(join(folder,'LICENSES')))if(!licensePaths.has(join(folder,'LICENSES',path)))throw new Error(`Unused scoped license notice ${pkg.name}/${path}`);
  const shipped=[];for(const path of pkg.files??[]){if(/[*?{}[\]()]|(?:^|\/)!/u.test(path))throw new Error(`Unsupported public files glob ${pkg.name}/${path}`);let status;try{status=await lstat(safePath(folder,path));}catch(error){if(error.code==='ENOENT')continue;throw error;}if(status.isSymbolicLink())throw new Error(`Public symlink ${pkg.name}/${path}`);if(status.isDirectory())shipped.push(...(await walk(join(folder,path))).map(name=>join(folder,path,name)));else shipped.push(join(folder,path));}
  for(const path of shipped){if(!/\.(?:svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|wav|mp3|mp4|webm|vtt)$/iu.test(path))continue;const local=relative(baseRoot,path);if(!entries.some(e=>e.rightsStatus==='verified'&&e.distributedIn.includes(pkg.name)&&e.localPaths.includes(local)))throw new Error(`Untracked scoped shipped asset ${local}`);}
 }
 const result={schemaVersion:1,scope,packages:packages.map(({pkg})=>pkg.name),inputs:[...inputs.values()].sort((a,b)=>a.path.localeCompare(b.path)),notices:notices.sort((a,b)=>a.path.localeCompare(b.path))};return {...result,sha256:hash(JSON.stringify(result))};
}
