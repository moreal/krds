import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { chromium, webkit } from '@playwright/test';

const root=resolve(import.meta.dirname,'../../..'),site=resolve(root,'apps/docs'),evidence=resolve(root,'test-results/branding');
await mkdir(evidence,{recursive:true});
const manifest=JSON.parse(await readFile(resolve(site,'branding/source.json')));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const server=createServer(async(req,res)=>{try{const path=new URL(req.url,'http://localhost').pathname;if(!path.startsWith('/krds/'))throw Error('base');let file=resolve(site,'dist','.'+path.slice(5));if(path.endsWith('/'))file=resolve(file,'index.html');if(!file.startsWith(resolve(site,'dist')+'/'))throw Error('path');res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2'})[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.statusCode=404;res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`,results=[];
try {
  for (const [name,engine] of [['chromium',chromium],['webkit',webkit]]) {
    const browser=await engine.launch({headless:true});
    try {
      const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),errors=[],external=[];
      page.on('pageerror',error=>errors.push(error.message));
      page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
      await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.origin!==origin){external.push(url.href);return route.abort();}return route.continue();});
      const layouts=[];
      for (const viewport of [{width:1440,height:1000},{width:320,height:800}]) {
        await page.setViewportSize(viewport);
        for(const route of ['/krds/','/krds/components/badge.html']) {
          await page.goto(origin+route,{waitUntil:'networkidle'});
          await page.waitForFunction(()=>!document.querySelector('astro-island[ssr]'));
          const logos=page.locator('img[alt="KRDS Native"]');assert.equal(await logos.count(),2);
          const layout=await logos.evaluateAll(images=>images.map(image=>({loaded:image.complete&&image.naturalWidth>0,source:image.getAttribute('src'),natural:[image.naturalWidth,image.naturalHeight],width:image.getBoundingClientRect().width,height:image.getBoundingClientRect().height})));
          for(const logo of layout){assert.ok(logo.loaded);assert.deepEqual(logo.natural,[273,40]);assert.equal(logo.source,'/krds/local-assets/branding/wordmark-black.svg');assert.ok(Math.abs(logo.width/logo.height-273/40)<0.01);assert.ok(logo.width>=119);}
          const overflow=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
          assert.ok(overflow.scroll<=overflow.client+1,JSON.stringify({viewport,overflow}));
          const actionLines=await page.locator('.docs-header [data-krds-part="actions"] button:visible').evaluateAll(buttons=>buttons.map(button=>{const range=document.createRange();range.selectNodeContents(button);return [...range.getClientRects()].filter(rect=>rect.width>1&&rect.height>1).length;}));
          assert.deepEqual(actionLines,viewport.width===320?[1,1]:[1],'native header labels stay on one line');
          assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://moreal.github.io'+route);
          for(const selector of ['meta[property="og:image"]','meta[name="twitter:image"]'])assert.equal(await page.locator(selector).getAttribute('content'),'https://moreal.github.io/krds/local-assets/branding/social.png');
          assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'),'summary_large_image');
          assert.equal(await page.locator('meta[property="og:image:width"]').getAttribute('content'),'1200');
          assert.equal(await page.locator('meta[property="og:image:height"]').getAttribute('content'),'630');
          assert.equal(await page.locator('a[data-krds-component="header"][data-krds-part="identity"]').getAttribute('aria-label'),'KRDS Native 홈');
          await page.screenshot({path:resolve(evidence,`${name}-${viewport.width}-${route.endsWith('badge.html')?'reference':'home'}.png`)});
          if(route==='/krds/') {await page.locator('[data-krds-component="footer"][data-krds-part="root"]').screenshot({path:resolve(evidence,`${name}-${viewport.width}-footer.png`)});}
          layouts.push({viewport,route,logos:layout,overflow});
        }
      }
      await page.goto(origin+'/krds/',{waitUntil:'networkidle'});
      await page.waitForFunction(()=>!document.querySelector('astro-island[ssr]'));
      await page.evaluate(()=>document.documentElement.style.fontSize='125%');
      const enlarged=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,offenders:[...document.querySelectorAll('body *')].filter(node=>node.getBoundingClientRect().right>innerWidth+1&&getComputedStyle(node).position!=='fixed').slice(0,12).map(node=>({tag:node.tagName,part:node.getAttribute('data-krds-part'),class:node.className,width:node.getBoundingClientRect().width,right:node.getBoundingClientRect().right}))}));
      await page.screenshot({path:resolve(evidence,`${name}-320-text-200.png`)});
      assert.ok(enlarged.scroll<=enlarged.client+1,JSON.stringify({enlarged}));
      for(const ratio of await page.locator('img[alt="KRDS Native"]').evaluateAll(images=>images.map(image=>image.getBoundingClientRect().width/image.getBoundingClientRect().height)))assert.ok(Math.abs(ratio-273/40)<0.01);
      const enlargedHeader=await page.locator('.docs-header > header').evaluate(header=>({height:header.getBoundingClientRect().height,actions:[...header.querySelectorAll('button[data-krds-component="header"][data-krds-part="search"], button[data-krds-component="header"][data-krds-part="mobile-trigger"]')].map(button=>{const range=document.createRange();range.selectNodeContents(button);const style=getComputedStyle(button),box=button.getBoundingClientRect();return {label:button.textContent,lines:[...range.getClientRects()].filter(rect=>rect.width>1&&rect.height>1).length,width:box.width,height:box.height,scrollWidth:button.scrollWidth,clientWidth:button.clientWidth,lineHeight:style.lineHeight};})}));
      assert.deepEqual(enlargedHeader.actions.map(action=>action.label),['문서 검색','주 메뉴']);
      for(const action of enlargedHeader.actions){assert.equal(action.lines,1,JSON.stringify(action));assert.ok(action.scrollWidth<=action.clientWidth+1,JSON.stringify(action));}
      assert.ok(enlargedHeader.height<340,JSON.stringify(enlargedHeader));
      await page.locator('#docs-search-trigger').focus();await page.keyboard.press('Enter');await page.locator('#docs-search-input').waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator(':focus').getAttribute('id'),'docs-search-trigger');
      await page.locator('#docs-header-mobile-trigger').focus();await page.keyboard.press('Enter');await page.locator('[data-krds-component="main-menu"][role="dialog"]').waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator(':focus').getAttribute('id'),'docs-header-mobile-trigger');
      for(const selector of ['link[rel="icon"]','link[rel="apple-touch-icon"]'])for(const href of await page.locator(selector).evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')))){assert.ok(href.startsWith('/krds/'));assert.equal((await context.request.get(origin+href)).status(),200);}
      for(const record of manifest.outputs){const response=await context.request.get(origin+'/krds/'+record.path.replace('apps/docs/public/',''));assert.equal(response.status(),200);assert.equal(hash(await response.body()),record.sha256);}
      const fonts=await page.evaluate(async()=>{const result=[];for(const weight of [400,500,700]){const faces=await document.fonts.load(`${weight} 16px "Pretendard GOV"`,'한글 KRDS');result.push({weight,faces:faces.map(face=>({weight:face.weight,status:face.status}))});}return result;});
      for(const record of fonts)assert.deepEqual(record.faces,[{weight:String(record.weight),status:'loaded'}]);
      for(const scheme of ['light','dark']){await page.emulateMedia({colorScheme:scheme});const response=await context.request.get(origin+'/krds/local-assets/branding/favicon.svg');assert.equal(hash(await response.body()),manifest.outputs.find(record=>record.path.endsWith('/favicon.svg')).sha256);}
      assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
      if(name==='chromium') {
        const image=async(name,width)=>`<img alt="${name}" width="${width}" src="data:image/${name.endsWith('.svg')?'svg+xml':'png'};base64,${(await readFile(resolve(site,'public/local-assets/branding',name))).toString('base64')}">`;
        const icons=async()=>`<div class="icons">${await image('favicon-16.png',16)}${await image('favicon-32.png',32)}${await image('favicon-48.png',48)}<span>16 / 32 / 48 px · actual size</span></div>`;
        const preview=`<!doctype html><meta charset="utf-8"><title>KRDS Native artwork preview</title><style>*{box-sizing:border-box}body{margin:0;padding:36px;background:#eee;color:#111;font:14px Arial,sans-serif}h1{font-size:22px;margin:0 0 24px}h2{font-size:13px;font-weight:400;margin:0 0 24px;color:#777}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.card{padding:28px;background:white;min-height:175px}.dark{background:#111;color:white}.card img{display:block;height:auto;max-width:100%}.icons{display:flex;align-items:center;gap:20px;height:60px}.icons span{font-size:12px;color:#777}.compact{display:flex;align-items:center;gap:24px}.social{margin-top:20px;padding:24px;background:#ddd;text-align:center}.social img{width:600px;height:315px;display:block;margin:auto}.social p{margin:16px 0 0;color:#555;font-size:12px}</style><h1>KRDS Native</h1><div class="grid"><div class="card"><h2>Outlined wordmark · black / transparent</h2>${await image('wordmark-black.svg',370)}</div><div class="card dark"><h2>Outlined wordmark · white / transparent</h2>${await image('wordmark-white.svg',370)}</div><div class="card"><h2>Compact K + favicon · light surroundings</h2><div class="compact">${await image('icon-black.svg',64)}${await icons()}</div></div><div class="card dark"><h2>Compact K + favicon · dark surroundings</h2><div class="compact">${await image('icon-white.svg',64)}${await icons()}</div></div></div><div class="social">${await image('social.png',600)}<p>Social preview · 1200 × 630 master shown at 50%</p></div>`;
        await writeFile(resolve(evidence,'preview.html'),preview);
        await page.setViewportSize({width:1000,height:1000});await page.setContent(preview);await page.screenshot({path:resolve(evidence,'preview.png'),fullPage:true});
      }
      results.push({engine:name,layouts,enlarged,enlargedHeader,fonts,assets:manifest.outputs.length,errors,external});
      await context.close();console.log(`${name}: logo, header/footer, metadata, favicon and font smoke passed`);
    } finally {await browser.close();}
  }
  await writeFile(resolve(evidence,'browser-report.json'),JSON.stringify({scope:'Targeted documentation branding smoke; no catalog coverage awarded.',results},null,2)+'\n');
} finally {await new Promise(resolve=>server.close(resolve));}
