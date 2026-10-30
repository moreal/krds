import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,mkdir,rm,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {serveProduction} from '../testing/support.mjs';
import {observeCatalogCase} from '../testing/catalog-observations.mjs';
import {captionSemantics} from '../testing/catalog-media-outcomes.mjs';

async function local(run) {
  const directory=await mkdtemp(join(tmpdir(),'krds-media-inspection-'));
  await writeFile(join(directory,'index.html'),'<html lang="ko"><meta charset="utf-8"><audio controls src="/clip.wav"><track kind="captions" srclang="ko" label="한국어" src="/captions.vtt"></audio><a href="/destination.html">신청 안내</a></html>');
  await writeFile(join(directory,'destination.html'),'<h1>신청 안내</h1>');
  const wav=Buffer.alloc(44+1600);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(1600,40);
  await writeFile(join(directory,'clip.wav'),wav);await writeFile(join(directory,'captions.vtt'),'WEBVTT\n\n00:00.000 --> 00:00.080\n[화자] 안녕하세요 [종소리]\n');await writeFile(join(directory,'clip.mp4'),'inspection header only');await writeFile(join(directory,'clip.webm'),'inspection header only');
  const server=await serveProduction(directory);let browser;
  try{const {chromium}=await import('playwright');browser=await chromium.launch();await run(server,browser);}finally{await browser?.close();await server.close();await rm(directory,{recursive:true,force:true});}
}

test('media source validation awaits genuine metadata and accepts actual direct/nested sources while rejecting wrong or never-ready media',async()=>{
  const all=JSON.parse(await readFile(new URL('../../catalog/full-catalog-scenarios.json',import.meta.url),'utf8')).cases;
  const original=all.find(item=>item.componentId==='accessible-media'&&item.caseId==='outcome-01');
  const fixture={...original,initialState:{...original.initialState,media:{kind:'audio',src:'/clip.wav'},captionTracks:[],transcript:{content:'실제 로컬 음원 대본'}}};
  await local(async(server,browser)=>{
    for(const mode of ['direct','nested','wrong-source','never-ready']){
      const page=await browser.newPage();
      try{
        await page.goto(server.origin);
        await page.setContent(`<main data-krds-component="accessible-media" data-krds-part="root"><h1>${fixture.initialState.title}</h1><audio controls data-krds-component="accessible-media" data-krds-part="media">${mode==='nested'?'<source>':''}</audio><p>실제 로컬 음원 대본</p></main>`);
        await page.evaluate(mode=>setTimeout(()=>{if(mode==='never-ready')return;const media=document.querySelector('audio'),src=mode==='wrong-source'?'/clip.wav?wrong=1':'/clip.wav';if(mode==='nested')media.querySelector('source').src=src;else media.src=src;media.load();},250),mode);
        const run=observeCatalogCase(page,{readEvents:async()=>[]},fixture);
        if(['direct','nested'].includes(mode))await assert.rejects(run,error=>error.code==='KRDS_MANUAL_OBSERVATION_REQUIRED');
        else await assert.rejects(run,/toBe|toEqual|Invalid URL/);
      }finally{await page.close();}
    }
  });
});

test('production media MIME types are exact and an actual local Korean VTT track loads timed cues',async()=>{
  await local(async(server,browser)=>{
    for(const [path,mime] of [['clip.wav','audio/wav'],['captions.vtt','text/vtt'],['clip.mp4','video/mp4'],['clip.webm','video/webm']]){const response=await fetch(`${server.origin}/${path}`);assert.equal(response.headers.get('content-type'),mime);}
    const page=await browser.newPage();await page.goto(server.origin);await page.locator('track').evaluate(track=>track.track.mode='hidden');await page.waitForFunction(()=>document.querySelector('track').readyState===2);
    const cues=await page.locator('track').evaluate(track=>[...track.track.cues].map(cue=>({start:cue.startTime,end:cue.endTime,text:cue.text})));
    assert.deepEqual(cues,[{start:0,end:0.08,text:'[화자] 안녕하세요 [종소리]'}]);await page.close();
  });
});
test('actual native modified link opens a real browser page without a synthetic click handler',async()=>{
  await local(async(server,browser)=>{const page=await browser.newPage();page.setDefaultTimeout(1200);await page.goto(server.origin);
    await observeCatalogCase(page,{readEvents:async()=>[]},{componentId:'link',caseId:'outcome-01',initialState:{label:'신청 안내',href:'/destination.html'},host:{}});await page.close();});
});


test('caption observer reads actual browser cues and rejects empty or media-out-of-bounds timing',async()=>{
 await local(async(server,browser)=>{
  const page=await browser.newPage();await page.goto(server.origin);
  await page.locator('audio').evaluate(node=>{const video=document.createElement('video');video.controls=true;video.src=node.src;video.dataset.krdsComponent='accessible-media';video.dataset.krdsPart='media';video.innerHTML=node.innerHTML;node.replaceWith(video);});
  const fixture={initialState:{captionTracks:[{src:'/captions.vtt',lang:'ko',label:'한국어'}]}};
  await captionSemantics(page,fixture);
  await page.locator('track').evaluate(track=>track.track.removeCue(track.track.cues[0]));
  await assert.rejects(captionSemantics(page,fixture),/toBeGreaterThan/);
  await page.locator('track').evaluate(track=>track.track.addCue(new VTTCue(0,50,'[신호음]')));
  await assert.rejects(captionSemantics(page,fixture),/toBeLessThanOrEqual/);
  await page.close();
 });
});
