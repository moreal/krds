import {createSSRApp,h} from 'vue';
import {renderToString} from '@vue/server-renderer';
import {KrdsProvider} from '@unofficial-krds/vue';
import {presentationCases} from '@unofficial-krds/test-contracts/patterns';
import PatternPresentation from '../../../../packages/vue/examples/patterns/PatternPresentation.vue';
import {mapPresentation,identity} from '../../src/examples/presentation';
export async function renderSnapshots(){
 const results=[];
 for(const entry of presentationCases){
  const html=await renderToString(createSSRApp({render:()=>h(KrdsProvider,{},()=>h(PatternPresentation,{presentation:mapPresentation(structuredClone(entry.state),'navigate-current'),identity:{...identity},hrefForPage:page=>`?case=filter-resets-page&query=&category=all&page=${page}`}))}));
  results.push({id:entry.id,html});
 }
 return results;
}
