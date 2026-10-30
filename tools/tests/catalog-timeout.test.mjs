import test from 'node:test';
import assert from 'node:assert/strict';
import {stat} from 'node:fs/promises';
import {runSelected} from '../testing/support.mjs';

test('process budget accepts default and explicit catalog maximum without delaying successful children',async()=>{
  const normal=await runSelected(['node','-e','process.stdout.write("default-budget-child")']);assert.equal(normal.code,0);assert.match(normal.output,/default-budget-child/);
  const catalog=await runSelected(['node','-e','process.stdout.write("catalog-budget-child")'],{timeoutMs:1800000});assert.equal(catalog.code,0);assert.match(catalog.output,/catalog-budget-child/);
});
test('short explicit process budget terminates its controlled child process group',async()=>{
  const start=Date.now();const result=await runSelected(['node','-e','setTimeout(()=>{},30000)'],{timeoutMs:80});assert.notEqual(result.code,0);assert.equal(result.signal,'SIGTERM');assert.ok(Date.now()-start<10000);
});
test('invalid process budgets fail before spawning any command',()=>{
  for(const timeoutMs of [0,-1,1.5,Infinity,NaN,1800001,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>runSelected(['node','-e','throw Error("must not spawn")'],{timeoutMs}),/positive safe integer at most 1800000/);
});

test('Firefox process environment preserves explicit paths and removes only generated per-run directories',async()=>{
 const supplied='/explicit/caller/firefox-app-data';
 const result=await runSelected(['node','-e','process.stdout.write(JSON.stringify({app:process.env.MOZ_APP_DATA,local:process.env.MOZ_LOCAL_APP_DATA}))'],{browserName:'firefox',env:{MOZ_APP_DATA:supplied}});
 assert.equal(result.code,0);const value=JSON.parse(result.output);assert.equal(value.app,supplied);
 if(process.platform==='darwin'&&process.env.MOZ_LOCAL_APP_DATA===undefined){assert.match(value.local,/krds-firefox-/);await assert.rejects(stat(value.local),{code:'ENOENT'});}
 const second=await runSelected(['node','-e','process.stdout.write(JSON.stringify({app:process.env.MOZ_APP_DATA,local:process.env.MOZ_LOCAL_APP_DATA}));process.exitCode=7'],{browserName:'firefox'});
 assert.equal(second.code,7);const own=JSON.parse(second.output);
 if(process.platform==='darwin')for(const [key,name] of [['app','MOZ_APP_DATA'],['local','MOZ_LOCAL_APP_DATA']])if(process.env[name]===undefined){assert.match(own[key],/krds-firefox-/);await assert.rejects(stat(own[key]),{code:'ENOENT'});}
});
