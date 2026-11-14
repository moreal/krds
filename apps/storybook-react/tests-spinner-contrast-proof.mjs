import {strict as assert} from 'node:assert';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Spinner} from '@unofficial-krds/react/spinner';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {root} from '../../tools/testing/support.mjs';
const output=join(root,'.superpowers/sdd/PLAN/t10-react-logs/'+(process.env.KRDS_SPINNER_OUTPUT??'spinner-path-proof'));
await mkdir(output,{recursive:true});
const css=await readFile(join(root,'packages/styles/dist/all.css'),'utf8');
const reset=await readFile(join(root,'packages/styles/dist/reset.css'),'utf8');
const markup=renderToStaticMarkup(createElement('main',null,createElement('h1',null,'로컬 진행 경로 대비'),createElement(Spinner,{pending:true,value:40,label:'신청 내역 불러오는 중',completionMessage:'완료'})));
const browser=await chromium.launch();
try{
 const context=await browser.newContext({viewport:{width:600,height:300}});const page=await context.newPage();
 await page.setContent(`<html lang="ko"><head><title>Native React Spinner proof</title><style>${reset}\n${css}</style></head><body>${markup}</body></html>`);
 const results=[];
 for(const forced of [false,true]){
  await page.emulateMedia({forcedColors:forced?'active':'none',reducedMotion:'reduce'});
  // The pending graphic is the native <progress> indicator; the shared stylesheet draws its ring with borders (track = inline-end border, progress arc = block-start border).
  const computed=await page.locator('progress[data-krds-component="spinner"][data-krds-part="indicator"]').evaluateAll(nodes=>nodes.map(node=>({track:getComputedStyle(node).borderInlineEndColor,indicator:getComputedStyle(node).borderBlockStartColor,width:getComputedStyle(node).borderBlockStartWidth,value:node.value,max:node.max,forcedColorAdjust:getComputedStyle(node).forcedColorAdjust,part:node.getAttribute('data-krds-part')})));
  const raw=await new AxeBuilder({page}).analyze();
  await writeFile(join(output,`${forced?'forced':'normal'}.axe.json`),JSON.stringify(raw,null,2)+'\n');
  await page.screenshot({path:join(output,`${forced?'forced':'normal'}.png`)});
  results.push({mode:forced?'forced':'normal',forcedMedia:await page.evaluate(()=>matchMedia('(forced-colors: active)').matches),computed,violations:raw.violations.map(v=>v.id)});
 }
 const luminance=color=>{const values=color.match(/[\d.]+/g)?.slice(0,3).map(Number);if(!values||values.length!==3)return null;return values.map(value=>{const v=value/255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;}).reduce((sum,value,index)=>sum+value*[0.2126,0.7152,0.0722][index],0);};
 const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return x===null||y===null?null:(Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);};
 const normal=results[0];const proof={scope:'Public native React Spinner SSR followed by actual browser styles; supplementary static proof, no CSF promotion',sourceSHA256:createHash('sha256').update(await readFile(join(root,'packages/react/src/components/spinner/index.tsx'))).digest('hex'),cssSHA256:createHash('sha256').update(css).digest('hex'),results,normalContrast:{indicatorToWhite:ratio(normal.computed[0].indicator,'rgb(255,255,255)'),trackToIndicator:ratio(normal.computed[0].track,normal.computed[0].indicator)}};
 await writeFile(join(output,'computed.json'),JSON.stringify(proof,null,2)+'\n');
 assert.equal(normal.computed.length,1,'One native progress indicator is rendered while pending');assert.equal(normal.computed[0].value,40);assert.equal(normal.computed[0].max,100);
 // The progress arc carries the information and must reach 3:1 on the page background; the pale ring behind it is the shared stylesheet's decorative track and is recorded, not asserted.
 assert(proof.normalContrast.indicatorToWhite>=3,'Normal progress arc/white contrast must be at least3');
 assert(results.every(result=>result.violations.length===0),'Actual normal/forced raw axe must be clean');
 console.log(JSON.stringify(proof.normalContrast));
}finally{await browser.close();}
