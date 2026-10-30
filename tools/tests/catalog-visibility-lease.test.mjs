import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm,stat} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {acquireNativeVisibilityLease} from '../testing/catalog-visibility-lease.mjs';

const moduleUrl=new URL('../testing/catalog-visibility-lease.mjs',import.meta.url).href;
function child(directory,exitWithoutCleanup=false){
  const source=`import {acquireNativeVisibilityLease} from ${JSON.stringify(moduleUrl)};const lease=await acquireNativeVisibilityLease({directory:${JSON.stringify(directory)},timeoutMs:3000,pollMs:5});console.log(JSON.stringify({phase:'start',time:Date.now(),pid:process.pid}));${exitWithoutCleanup?'process.exit(0);':"await new Promise(resolve=>setTimeout(resolve,80));console.log(JSON.stringify({phase:'end',time:Date.now(),pid:process.pid}));await lease.cleanup();"}`;
  const process=spawn(globalThis.process.execPath,['--input-type=module','-e',source],{stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='';process.stdout.on('data',chunk=>stdout+=chunk);process.stderr.on('data',chunk=>stderr+=chunk);
  return new Promise((resolve,reject)=>process.on('exit',code=>code===0?resolve(stdout.trim().split('\n').map(line=>JSON.parse(line))):reject(new Error(stderr))));
}

test('private visibility lease serializes independent real processes and cleans its owned directory',async()=>{
  const root=await mkdtemp(join(tmpdir(),'krds-visibility-lease-proof-')),directory=join(root,'lease');
  try{
    const results=await Promise.all([child(directory),child(directory)]);
    const intervals=results.map(events=>({start:events[0].time,end:events[1].time,pid:events[0].pid})).sort((a,b)=>a.start-b.start);
    assert.notEqual(intervals[0].pid,intervals[1].pid);assert.ok(intervals[1].start>=intervals[0].end,JSON.stringify(intervals));
    await assert.rejects(stat(directory),{code:'ENOENT'});
  }finally{await rm(root,{recursive:true,force:true});}
});

test('visibility lease reclaims a demonstrably exited owner but never deletes a live owner on bounded timeout',async()=>{
  const root=await mkdtemp(join(tmpdir(),'krds-visibility-stale-proof-')),directory=join(root,'lease');
  try{
    const exited=await child(directory,true);
    const lease=await acquireNativeVisibilityLease({directory,timeoutMs:1000,pollMs:5});
    try{
      assert.notEqual(lease.evidence.ownerPid,exited[0].pid);
      const original=JSON.parse(await readFile(join(directory,'owner.json'),'utf8'));
      assert.equal(original.pid,process.pid);assert.ok(original.processIdentity);
      await assert.rejects(acquireNativeVisibilityLease({directory,timeoutMs:25,pollMs:5}),/Timed out waiting for the real headed visibility lease/);
      assert.equal(JSON.parse(await readFile(join(directory,'owner.json'),'utf8')).token,original.token);
    }finally{await lease.cleanup();}
    await assert.rejects(stat(directory),{code:'ENOENT'});
  }finally{await rm(root,{recursive:true,force:true});}
});
