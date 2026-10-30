/** Built-ins-only lossless selected-Node receipts; usable before immutable install. */
import {readFile,writeFile,mkdir,realpath} from 'node:fs/promises';
import {join,resolve,relative} from 'node:path';
import {root,hash,run,node} from '../../tests/consumers/lib.mjs';
const blocked=message=>Object.assign(new Error(message),{code:'EVIDENCE_BLOCKED'});
const failed=message=>Object.assign(new Error(message),{code:'EVIDENCE_FAILED'});
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
const equal=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
function local(baseRoot,path){const result=resolve(baseRoot,path);if(!result.startsWith(`${resolve(baseRoot)}/`))throw blocked(`Evidence path escapes root: ${path}`);return result;}
export async function evidenceRef(path,baseRoot=root){const bytes=await readFile(path);return {path:relative(baseRoot,path),size:bytes.length,sha256:hash(bytes)};}
export async function validateRef(ref,baseRoot=root){if(!ref||!Number.isInteger(ref.size)||!/^[a-f0-9]{64}$/u.test(ref.sha256))throw blocked('Missing hash-bound evidence bytes');const path=local(baseRoot,ref.path);let bytes;try{if(!(await realpath(path)).startsWith(`${await realpath(baseRoot)}/`))throw blocked('Evidence symlink escapes root');bytes=await readFile(path);}catch(error){if(error.code==='ENOENT')throw blocked(`Missing evidence bytes ${ref.path}`);throw error;}if(bytes.length!==ref.size||hash(bytes)!==ref.sha256)throw blocked(`Evidence bytes/hash changed: ${ref.path}`);return bytes;}
export async function captureStep(name,command,{baseRoot=root,output}={}){
 if(command.executable!==node)throw new Error('Step must use the selected exact Node');await mkdir(output,{recursive:true});const startedAt=new Date().toISOString();const result=run(command.args,{cwd:command.cwd,allowFailure:true});
 const raw={schemaVersion:2,name,command,executed:true,exitCode:result.status,signal:result.signal??null,stdout:result.stdout,stderr:result.stderr};
 for(const [file,bytes] of [['stdout.log',raw.stdout],['stderr.log',raw.stderr],['combined.log',raw.stdout+raw.stderr],['result.json',JSON.stringify(raw,null,2)+'\n']])await writeFile(join(output,file),bytes);
 return {schemaVersion:2,name,command,executed:true,exitCode:raw.exitCode,signal:raw.signal,startedAt,finishedAt:new Date().toISOString(),stdout:await evidenceRef(join(output,'stdout.log'),baseRoot),stderr:await evidenceRef(join(output,'stderr.log'),baseRoot),log:await evidenceRef(join(output,'combined.log'),baseRoot),rawResult:await evidenceRef(join(output,'result.json'),baseRoot)};
}
export async function validateStep(step,{baseRoot=root,expectedCommand}={}){
 if(!step||step.schemaVersion!==2||step.executed!==true||!equal(step.command,expectedCommand))throw blocked('Missing or changed actual command identity');
 const [stdout,stderr,log,rawBytes]=await Promise.all([step.stdout,step.stderr,step.log,step.rawResult].map(ref=>validateRef(ref,baseRoot)));let raw;try{raw=JSON.parse(rawBytes);}catch{throw blocked('Invalid raw subprocess result');}
 if(raw.executed!==true||!equal(raw.command,expectedCommand)||raw.name!==step.name||raw.exitCode!==step.exitCode||raw.signal!==step.signal||raw.stdout!==stdout.toString()||raw.stderr!==stderr.toString()||!log.equals(Buffer.concat([stdout,stderr])))throw blocked('Raw subprocess result differs from accepted command/log bytes');
 if(raw.exitCode!==0||raw.signal!==null)throw failed(`${step.name}: actual execution failed (${raw.exitCode??raw.signal})`);return raw;
}
