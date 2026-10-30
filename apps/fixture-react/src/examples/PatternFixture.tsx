import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {createFixtureBridge} from '@unofficial-krds/test-contracts/driver';
import {createLocalDriver,createPatternState,transition,patternScenarios,type LocalDriver,type PatternAction,type PatternEffect,type PatternFixtureCommand,type PatternId,type PatternState} from '@unofficial-krds/test-contracts/patterns';
import type {FixtureBridge} from '@unofficial-krds/test-contracts';
import {PatternPresentation} from '../../../../packages/react/examples/patterns/PatternPresentation';
import {patternContent} from './content';
import {searchLocation} from './search-location';
interface Runtime {driver:LocalDriver<PatternId>;bridge:FixtureBridge;}
function href(pattern:PatternId,caseId:string,values:Record<string,string|number>) {const params=new URLSearchParams({case:caseId});for(const [key,value] of Object.entries(values)) params.set(key,String(value));return `/examples/${pattern}?${params}`;}
/** Own every mutable resource inside the mounted route, including StrictMode re-mounts. */
export function PatternFixture() {
 const patternId=decodeURIComponent(location.pathname.split('/')[2]??'') as PatternId;
 const caseId=new URLSearchParams(location.search).get('case')??'';
 const scenario=patternScenarios.find(item=>item.patternId===patternId&&item.caseId===caseId);
 const [state,setState]=useState<PatternState|null>(null);
 const runtime=useRef<Runtime|null>(null);
 const focus=useRef<string[]>([]);
 const savedScroll=useRef<{x:number;y:number}|null>(null);
 const wasOpen=useRef(false);
 const effects=(items:PatternEffect[])=>{for(const effect of items){if(effect.type==='request') runtime.current?.bridge.recordEvent('pattern:request',{operation:effect.operation,requestId:effect.requestId,payload:effect.payload});else focus.current.push(effect.targetId);}};
 useEffect(()=>{
  if(!scenario)return;
  function makeDriver() {
   const initialState=patternId==='search-results'?searchLocation(location.search,caseId):patternId==='service-layout'? (()=>{const base=createPatternState('service-layout');const section=new URLSearchParams(location.search).get('section');return section&&Object.hasOwn(patternContent.layoutSections,section)?transition(base,{type:'navigate',id:section as 'overview'}).state:base;})():undefined;
   const instance=createLocalDriver(patternId,{caseId,seed:scenario!.seed,...(initialState?{initialState}:{})});
   for(const action of scenario!.initialActions)instance.dispatch(action);
   return instance;
  }
  let driver=makeDriver();
  const bridge=createFixtureBridge('react',{patternId,caseId});runtime.current={driver,bridge};
  let unsubscribe=driver.subscribe(snapshot=>setState(snapshot));setState(driver.getState());
  let commandSequence=0;
  const unsubscribeBridge=bridge.subscribe(snapshot=>{const command=snapshot.__patternCommand as PatternFixtureCommand|undefined;if(!command||command.command!=='settle'||!Number.isSafeInteger(command.sequence)||command.sequence<=commandSequence)return;commandSequence=command.sequence;effects(driver.settle(command.ok===undefined?{}:{ok:command.ok}).effects);});
  const normalize=()=>{const snapshot=driver.getState();if(snapshot.patternId==='service-layout')history.replaceState(null,'',href(patternId,caseId,{section:snapshot.currentId}));if(snapshot.patternId==='search-results')history.replaceState(null,'',href(patternId,caseId,{query:snapshot.appliedQuery,category:snapshot.category,page:snapshot.page}));};
  const pop=()=>{if(runtime.current?.driver!==driver)return;unsubscribe();driver.dispose();driver=makeDriver();runtime.current={driver,bridge};unsubscribe=driver.subscribe(snapshot=>setState(snapshot));setState(driver.getState());normalize();};
  window.addEventListener('popstate',pop);normalize();
  return()=>{window.removeEventListener('popstate',pop);unsubscribeBridge();unsubscribe();driver.dispose();bridge.dispose();if(runtime.current?.driver===driver)runtime.current=null;focus.current=[];};
 },[patternId,caseId]);
 useLayoutEffect(()=>{
  if(!state)return;
  const open=state.patternId==='consent-confirmation'&&state.modalOpen;
  if(wasOpen.current&&!open&&savedScroll.current){window.scrollTo({left:savedScroll.current.x,top:savedScroll.current.y,behavior:'instant'});savedScroll.current=null;}
  wasOpen.current=open;
  for(const target of focus.current.splice(0)){const element=document.getElementById(target);element?.focus();}
  if(state.patternId==='form-errors'){for(const field of ['title','category','detail'] as const){const control=document.getElementById(patternContent.fieldIds[field]) as HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|null;control?.setCustomValidity(state.errors.find(item=>item.field===field)?.message??'');}}
 },[state]);
 const dispatch=(action:PatternAction)=>{
  const mounted=runtime.current;if(!mounted)return;
  const before=mounted.driver.getState();
  if(action.type==='review'&&before.patternId==='consent-confirmation'&&before.requiredChoice===true&&!before.modalOpen)savedScroll.current={x:scrollX,y:scrollY};
  mounted.bridge.recordEvent('pattern:action',action);
  const output=mounted.driver.dispatch(action);effects(output.effects);
  if(output.state.patternId==='service-layout'&&action.type==='navigate'&&before.patternId==='service-layout'&&before.currentId!==output.state.currentId){history.pushState(null,'',href(patternId,caseId,{section:output.state.currentId}));mounted.bridge.recordEvent('pattern:route',{section:output.state.currentId});}
  if(output.state.patternId==='search-results'&&output.effects.some(effect=>effect.type==='request')){const search=output.state.pendingPayload;if(search)history.pushState(null,'',href(patternId,caseId,{query:search.query,category:search.category,page:search.page}));}
 };
 if(!scenario)return <main><h1>알 수 없는 로컬 예제</h1></main>;
 return <>{state&&<PatternPresentation state={state} content={patternContent} onAction={dispatch} hrefForPage={page=>state.patternId==='search-results'?href(patternId,caseId,{query:state.appliedQuery,category:state.category,page}):'#'} hrefForSection={section=>href(patternId,caseId,{section})}/>}<div role="status" aria-label="Fixture health">{state?'ready':'starting'}</div></>;
}
