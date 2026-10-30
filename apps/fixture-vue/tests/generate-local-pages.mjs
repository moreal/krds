import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const workspace=resolve(new URL('../../..',import.meta.url).pathname);
const destinations=new Map();
function collect(node){
 if(Array.isArray(node)){for(const child of node)collect(child);return;}
 if(!node||typeof node!=='object')return;
 for(const [key,value]of Object.entries(node)){
  if(typeof value==='string'&&value.startsWith('/local/')&&(key.toLowerCase().includes('href')||key.endsWith('Destination'))){
   const path=value.split(/[?#]/)[0];if(!/[{}]/.test(path))destinations.set(path,{label:node.nativeLabel??node.label??node.title??path.split('/').at(-1),locale:node.locale});
  }else collect(value);
 }
}
for(const source of ['catalog/full-catalog-scenarios.json','catalog/full-catalog-stories.json'])collect(JSON.parse(await readFile(join(workspace,source),'utf8')));
for(const route of ['home','result','help','review'])if(!destinations.has(`/local/${route}`))destinations.set(`/local/${route}`,{label:({home:'홈',result:'처리 결과',help:'도움말',review:'신청 내용 확인'})[route]});
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
for(const app of ['fixture-vue','storybook-vue'])for(const [route,{label,locale}]of destinations){
 const directory=join(workspace,'apps',app,'public',route);await mkdir(directory,{recursive:true});
 const language=locale??(route.endsWith('/en')||route.endsWith('/separate-en')?'en':route.endsWith('/ja')?'ja':'ko');
 const description=language==='en'?'English local service content. Review application guidance and return to the Korean service.':language==='ja'?'日本語の申請案内。必要な資料と手順を確認できます。':'로컬 서비스 안내입니다. 신청 절차와 처리 결과를 확인할 수 있습니다.';
 const html=`<!doctype html>\n<html lang="${escape(language)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(label)}</title></head><body><main><h1>${escape(label)}</h1><p data-krds-host="locale-content">${escape(label)} — ${description}</p><p data-krds-host="route">${escape(route)}</p><nav aria-label="언어 / Language"><a href="/local/ko" lang="ko">한국어</a> · <a href="/local/en" lang="en">English</a> · <a href="/local/ja" lang="ja">日本語</a></nav><a href="/fixtures/language-switcher?case=outcome-01">언어 선택 예제로 돌아가기</a></main></body></html>\n`;
 await writeFile(join(directory,'index.html'),html);
}
console.log(JSON.stringify({destinations:[...destinations.keys()],count:destinations.size,apps:['fixture-vue','storybook-vue'],network:false},null,2));
