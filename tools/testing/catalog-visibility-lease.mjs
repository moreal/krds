import {mkdir,readFile,writeFile,open,unlink,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

function processIdentity(pid){
  const result=spawnSync('ps',['-p',String(pid),'-o','lstart='],{encoding:'utf8',timeout:1000});
  return result.status===0?result.stdout.trim():null;
}
function exited(owner){
  if(!Number.isSafeInteger(owner?.pid)||owner.pid<=0)return false;
  try{process.kill(owner.pid,0);}catch(error){return error.code==='ESRCH';}
  const identity=processIdentity(owner.pid);
  return Boolean(identity&&owner.processIdentity&&identity!==owner.processIdentity);
}
async function readOwner(directory){
  try{return JSON.parse(await readFile(join(directory,'owner.json'),'utf8'));}
  catch(error){if(error.code==='ENOENT'||error instanceof SyntaxError)return null;throw error;}
}
async function reclaimExitedOwner(directory){
  if(!exited(await readOwner(directory)))return;
  // Only one contender can inspect/remove a dead owner's directory. A contender
  // arriving after removal must re-read the new owner, never trust an old PID.
  let guard;let removed=false;
  try{
    guard=await open(join(directory,'reclaim'),'wx',0o600);
    if(exited(await readOwner(directory))){await rm(directory,{recursive:true});removed=true;}
  }catch(error){if(!['EEXIST','ENOENT'].includes(error.code))throw error;}
  finally{await guard?.close();if(guard&&!removed)await unlink(join(directory,'reclaim')).catch(error=>{if(error.code!=='ENOENT')throw error;});}
}

/** Serializes only genuine headed visibility observations across Node workers.
 * Unknown/malformed ownership is never guessed stale, and a live owner is never
 * evicted by elapsed time. Normal browser tests do not acquire this lease. */
export async function acquireNativeVisibilityLease({directory=join(tmpdir(),'krds-catalog-native-visibility-lease'),timeoutMs=15000,pollMs=50}={}){
  if(!Number.isSafeInteger(timeoutMs)||timeoutMs<=0||timeoutMs>120000)throw new TypeError('Invalid visibility lease timeout');
  if(!Number.isSafeInteger(pollMs)||pollMs<=0)throw new TypeError('Invalid visibility lease polling interval');
  const started=Date.now(),token=randomUUID();
  const owner={pid:process.pid,processIdentity:processIdentity(process.pid),token,createdAt:new Date().toISOString()};
  if(!owner.processIdentity)throw new Error('Cannot establish visibility lease owner process identity');
  for(;;){
    try{
      await mkdir(directory,{mode:0o700});
      try{await writeFile(join(directory,'owner.json'),JSON.stringify(owner)+'\n',{mode:0o600,flag:'wx'});}
      catch(error){await rm(directory,{recursive:true,force:true});throw error;}
      let released=false;
      return {
        evidence:{ownerPid:owner.pid,processIdentity:owner.processIdentity,acquiredAt:new Date().toISOString(),waitedMs:Date.now()-started,privateDirectory:directory},
        async cleanup(){
          if(released)return;released=true;
          if((await readOwner(directory))?.token===token)await rm(directory,{recursive:true,force:true});
        },
      };
    }catch(error){if(error.code!=='EEXIST')throw error;}
    await reclaimExitedOwner(directory);
    if(Date.now()-started>=timeoutMs)throw new Error('Timed out waiting for the real headed visibility lease; no owner was evicted and no visibility observation was fabricated');
    await new Promise(resolve=>setTimeout(resolve,pollMs));
  }
}
