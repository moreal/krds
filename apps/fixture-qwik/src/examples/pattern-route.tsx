import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { createPatternState, transition, patternScenarios, searchResources, demoIdentity, formCategories, resourceCategories, consentContent, layoutNavigation, layoutSections, type PatternId, type PatternState, type PatternAction, type Category } from '@unofficial-krds/test-contracts/patterns';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import { PatternView } from '../../../../packages/qwik/examples/patterns/view';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/all.css';
export {patternRouteForUrl} from './routing';
export const patternContent=JSON.parse(JSON.stringify({identity:demoIdentity,formCategories,resourceCategories,consent:consentContent,navigation:layoutNavigation,sections:layoutSections}));
function initialize(patternId:PatternId,caseId:string,search:string){
 let state:PatternState=createPatternState(patternId,caseId);
 const scenario=patternScenarios.find(s=>s.patternId===patternId&&s.caseId===caseId);
 for(const action of scenario?.initialActions??[])state=transition(state,action).state;
 const params=new URLSearchParams(search);
 if(state.patternId==='search-results'){
  const query=params.get('query')??state.query,raw=params.get('category'),category:Category=resourceCategories.some(c=>c.value===raw)?raw as Category:state.category;
  const page=params.has('page')?Number(params.get('page')):state.page;
  state={...state,query,appliedQuery:query,category,...searchResources({query,category,page})};
 }
 if(state.patternId==='service-layout'){
  const id=params.get('section');if(id&&Object.hasOwn(layoutSections,id))state=transition(state,{type:'navigate',id:id as any}).state;
 }
 return state;
}
export const PatternInstance=component$<{patternId:string;caseId?:string;search?:string}>(props=>{
 const patternId=props.patternId as PatternId,caseId=props.caseId??'';
 const state=useSignal<PatternState>(initialize(patternId,caseId,props.search??'')),completions=useSignal(0),commandSequence=useSignal(0),savedScroll=useSignal(0),mounted=useSignal(true);
 const scenario=patternScenarios.find(s=>s.patternId===patternId&&s.caseId===caseId),seed=scenario?.seed??'success';
 const dispatch=$(async(action:PatternAction)=>{
  if(!mounted.value)return;
  const before=state.value;
  if(action.type==='review'&&before.patternId==='consent-confirmation'&&!before.modalOpen)savedScroll.value=window.scrollY;
  const next=transition(before,action);state.value=next.state;
  if(next.state.patternId==='form-errors'){for(const field of ['title','category','detail']){const control=document.getElementById('example-form-'+field) as HTMLInputElement|null;control?.setCustomValidity(next.state.errors.find(error=>error.field===field)?.message??'');}}
  for(const effect of next.effects){if(effect.type==='request')window.__KRDS_FIXTURE__?.recordEvent('pattern:request',{operation:effect.operation,requestId:effect.requestId,payload:effect.payload});else requestAnimationFrame(()=>requestAnimationFrame(()=>document.getElementById(effect.targetId)?.focus({preventScroll:true})));}
  if(next.state.patternId==='service-layout'&&action.type==='navigate'&&next.state.currentId!== (before as any).currentId){history.pushState({},'', '/examples/service-layout?'+new URLSearchParams({case:caseId,section:next.state.currentId}));window.__KRDS_FIXTURE__?.recordEvent('pattern:route',{section:next.state.currentId});}
  if(next.state.patternId==='search-results'&&action.type==='resolve'&&next.state.phase==='success')history.pushState({},'','/examples/search-results?'+new URLSearchParams({case:caseId,query:next.state.appliedQuery,category:next.state.category,page:String(next.state.page)}));
  if(before.patternId==='consent-confirmation'&&before.modalOpen&&next.state.patternId==='consent-confirmation'&&!next.state.modalOpen)requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:savedScroll.value,behavior:'instant'})));
 });
 const settle=$(async(ok?:boolean)=>{
  if(state.value.phase!=='loading'||state.value.pendingRequestId===null||seed==='loading'&&ok===undefined)return;
  completions.value++;
  await dispatch({type:'resolve',requestId:state.value.pendingRequestId,ok:ok??(seed==='success'||seed==='error-once'&&completions.value>1)});
 });
 useVisibleTask$(({cleanup})=>{
  mounted.value=true;
  const bridge=createFixtureBridge('qwik',{patternId,caseId});
  const unsubscribe=bridge.subscribe(async patch=>{const command=patch.__patternCommand as any;if(command?.command==='settle'&&Number.isSafeInteger(command.sequence)&&command.sequence>commandSequence.value){commandSequence.value=command.sequence;await settle(command.ok);}});
  const pop=()=>{const next=initialize(patternId,caseId,location.search);next.requestId=state.value.requestId;state.value=next;};
  const click=(event:MouseEvent)=>{if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const anchor=(event.target as Element)?.closest('a[href]');if(!anchor)return;const url=new URL((anchor as HTMLAnchorElement).href);if(url.origin!==location.origin||url.pathname!==location.pathname)return;const current=state.value;if(current.patternId==='service-layout'&&url.searchParams.has('section')){event.preventDefault();void dispatch({type:'navigate',id:url.searchParams.get('section') as any});}else if(current.patternId==='search-results'&&url.searchParams.has('page')){event.preventDefault();void dispatch({type:'page',page:Number(url.searchParams.get('page'))});}};
  window.addEventListener('popstate',pop);document.addEventListener('click',click,true);
  cleanup(()=>{mounted.value=false;unsubscribe();bridge.dispose();window.removeEventListener('popstate',pop);document.removeEventListener('click',click,true);});
 },{strategy:'document-ready'});
 return <><PatternView state={state.value} content={patternContent} caseId={caseId} onAction$={dispatch}/><aside aria-label="로컬 테스트 제어"><button type="button" onClick$={()=>settle(true)}>로컬 성공 완료</button><button type="button" onClick$={()=>settle(false)}>로컬 실패 완료</button></aside></>;
});

/** Native parent lifecycle harness: this test control is outside the service view. */
export const PatternRoute=component$<{patternId:string;caseId?:string;search?:string}>(props=>{
 const visible=useSignal(true),generation=useSignal(0);
 return <>{visible.value&&<PatternInstance key={generation.value} {...props}/>}<aside aria-label="수명주기 테스트 제어"><button type="button" onClick$={()=>{visible.value=!visible.value;if(visible.value)generation.value++;}}>패턴 마운트 전환</button><output aria-label="패턴 마운트 상태">{visible.value?'mounted':'unmounted'}</output></aside></>;
});
