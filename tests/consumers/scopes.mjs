import {readFile} from 'node:fs/promises';
import {join,relative} from 'node:path';
import {scopedInputs} from './inputs.mjs';
import {root,hash,files} from './lib.mjs';
const shared=['assets','contracts','fonts','styles','tokens'];
const stable=['angular','lit','qwik','react','solid','svelte','vue'];
export function scopePackageIds(scope='all') {if(!['stable','preview','all'].includes(scope))throw new Error(`Unknown scope ${scope}`);return [...shared,...(scope==='stable'?stable:scope==='preview'?['solid-next']:[...stable,'solid-next'])].sort();}
export const scopeFrameworkIds=scope=>scopePackageIds(scope).filter(id=>!shared.includes(id));
export function selectCandidates(manifest,scope='all') {const names=scopePackageIds(scope).map(id=>`@unofficial-krds/${id}`),selected=manifest.packages?.filter(p=>names.includes(p.name))??[];if(selected.length!==names.length||new Set(selected.map(p=>p.name)).size!==names.length)throw new Error(`Incomplete/duplicate ${scope} candidate set; expected ${names.length}`);return selected.sort((a,b)=>a.name.localeCompare(b.name));}
export function artifactSetHash(manifest,scope='all') {return hash(JSON.stringify(selectCandidates(manifest,scope).map(p=>({name:p.name,version:p.version,sha256:p.sha256,normalizedContentSha256:p.normalizedContentSha256,packedManifest:p.packedManifest,files:p.files}))));}
function projection(name,value,scope){
 if(scope==='all')return value;
 const ids=scopeFrameworkIds(scope),names=new Set(scopePackageIds(scope).map(id=>`@unofficial-krds/${id}`));
 if(name==='compatibility/frameworks.json')return {...value,frameworks:value.frameworks?.filter(row=>ids.includes(row.id)),stableTargets:value.stableTargets?.filter(id=>ids.includes(id)),previewTargets:value.previewTargets?.filter(id=>ids.includes(id))};
 if(name==='compatibility/toolchain.json') {const environments=Object.fromEntries(Object.entries(value.environments??{}).filter(([,env])=>env.consumers?.some(id=>ids.includes(id))));return {schemaVersion:value.schemaVersion,node:value.node,packageManager:value.packageManager,sharedPins:value.sharedPins,environments};}
 if(name==='compliance/provenance.json'&&Array.isArray(value))return value.filter(row=>row.distributedIn?.some(name=>names.has(name))).map(row=>({...row,distributedIn:row.distributedIn.filter(name=>names.has(name))}));
 return value;
}
export async function sourceSnapshot({baseRoot=root,scope='all',inputsOnly=false}={}) {
 const records=[];const closure=await scopedInputs(baseRoot,scopePackageIds(scope));
 for(const id of scopePackageIds(scope)){const folder=join(baseRoot,'packages',id);for(const path of await files(folder)){if(inputsOnly&&(path.startsWith('dist/')||(id==='tokens'&&path==='src/source-map.json')))continue;records.push({path:relative(baseRoot,join(folder,path)),sha256:hash(await readFile(join(folder,path)))});}}
 for(const path of [...new Set([...closure.paths,'yarn.lock','compatibility/frameworks.json','compatibility/toolchain.json','compliance/provenance.json','compliance/project-identity.json','tools/yarn.mjs','tools/check-node.mjs','tools/build.mjs','tools/generate-notices.mjs','tools/verify-licenses.mjs','.yarn/releases/yarn-4.14.1.cjs'])]){if(inputsOnly&&(scopePackageIds(scope).some(id=>path.startsWith(`packages/${id}/dist/`))||path==='packages/tokens/src/source-map.json'))continue;const bytes=await readFile(join(baseRoot,path));const projected=path.endsWith('.json')?Buffer.from(JSON.stringify(path==='compliance/license-policy.json'&&scope!=='all'?closure.projectedPolicy:projection(path,JSON.parse(bytes),scope))):bytes;records.push({path,projection:scope==='all'?'full':'scope-v1',sha256:hash(projected)});}
 const unique=new Map(records.map(record=>[record.path,record]));records.length=0;records.push(...unique.values());
 records.sort((a,b)=>a.path.localeCompare(b.path));return {schemaVersion:2,scope,inputsOnly,records,sha256:hash(JSON.stringify(records))};
}
export async function validateSnapshot(snapshot,{baseRoot=root,scope=snapshot?.scope,inputsOnly=snapshot?.inputsOnly}={}) {const current=await sourceSnapshot({baseRoot,scope,inputsOnly});if(JSON.stringify(snapshot)!==JSON.stringify(current))throw new Error(`Stale/incomplete ${scope} source inventory`);return current;}
export async function scopedPackages({baseRoot=root,scope='all'}={}){const selected=[];for(const dir of scopePackageIds(scope)){const folder=join(baseRoot,'packages',dir);const pkg=JSON.parse(await readFile(join(folder,'package.json'),'utf8'));if(pkg.private||pkg.name!==`@unofficial-krds/${dir}`)throw new Error(`Invalid public package ${dir}`);selected.push({dir,folder,pkg});}return selected;}
