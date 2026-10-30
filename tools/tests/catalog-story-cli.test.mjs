import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile);
test('actual catalog story CLI reads immutable HTTP index and saves strict native-control/axe/request/PNG evidence for an explicit subset',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'krds-story-cli-inspection-'));
 const id='krds-checkbox--binary';
 const html='<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Plain DOM observer inspection</title></head><body><main id="storybook-root"><h1>상태</h1><div data-krds-component="checkbox" data-krds-part="root"><label><input type="checkbox" name="consent" value="agreed">이용약관 동의</label></div></main></body></html>';
 try{
  await writeFile(join(directory,'index.html'),html);await writeFile(join(directory,'iframe.html'),html);
  await writeFile(join(directory,'index.json'),JSON.stringify({entries:{[id]:{id,type:'story',importPath:'./src/stories/checkbox.catalog.stories.ts',title:'KRDS/checkbox',exportName:'Binary'}}}));
  const result=await exec(process.execPath,['tools/run-story-tests.mjs','--catalog','--framework','vue','--component','checkbox','--case','binary'],{cwd:resolve(import.meta.dirname,'../..'),env:{...process.env,KRDS_STORYBOOK_DIST:directory}});
  const path=result.stdout.match(/Report: (.+)/)?.[1];assert.ok(path,result.stdout);
  const report=JSON.parse(await readFile(path,'utf8'));assert.equal(report.mode,'catalog');assert.equal(report.selection.selected,1);assert.equal(report.selection.completeRequiredSelection,false);
  assert.equal(report.results[0].status,'passed',JSON.stringify(report));assert.equal(report.results[0].fullCatalogGateSatisfied,false);assert.equal(report.results[0].artifactSnapshot.stableVerified,true);
  assert.equal(report.results[0].stories[0].coverageAwarded,false);assert.equal(report.results[0].stories[0].axe.violations.length,0);
 }finally{await rm(directory,{recursive:true,force:true});}
});
