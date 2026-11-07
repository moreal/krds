import { createSignal, createEffect, onMount, onCleanup, Show } from 'solid-js';
import { NativeSelect } from '@unofficial-krds/solid/native-select';
import { Button } from '@unofficial-krds/solid/button';
import { Link } from '@unofficial-krds/solid/link';
import type { DemoRegistryEntry, PlayableDemo } from '../../../../tools/docs-previews/contract';
import { matchesPreviewEvent, type PreviewIdentity } from '../../../../tools/docs-previews/protocol';
import { resolveDemoSelection } from '../demo-selection';
import { clampFrameHeight } from '../demo-frame';
import { NativeDemoSource, type DemoSourceFile } from './NativeDemoSource';
export type NativeDemoRecord=DemoRegistryEntry & {files:DemoSourceFile[]};
export function NativeDemo(props:{componentId:string;demos:NativeDemoRecord[]}) {
 const [selection,setSelection]=createSignal(resolveDemoSelection({records:props.demos}));
 const [mounted,setMounted]=createSignal(false),[generation,setGeneration]=createSignal(0),[status,setStatus]=createSignal('미리보기를 준비하고 있습니다.');
 const [nearViewport,setNearViewport]=createSignal(false);
 const [height,setHeight]=createSignal(240),[url,setUrl]=createSignal('');
 let region:HTMLDivElement|undefined;let frame:HTMLIFrameElement|undefined;let exit:HTMLDivElement|undefined;
 let current:PreviewIdentity|undefined;let timer:ReturnType<typeof setTimeout>|undefined;
 const selected=()=>selection();
 onMount(()=>{
  let preference:string|null=null;try{preference=sessionStorage.getItem('krds-demo-framework');}catch{}
  setSelection(resolveDemoSelection({records:props.demos,query:location.search,sessionFramework:preference}));setMounted(true);
  const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setNearViewport(true);observer.disconnect();}},{rootMargin:'300px'});
  if(region)observer.observe(region);onCleanup(()=>observer.disconnect());
  const receive=(event:MessageEvent)=>{
   if(!current||!frame)return;
   const message=matchesPreviewEvent(event,location.origin,frame.contentWindow,current);if(!message)return;
   if(message.type==='ready'){clearTimeout(timer);setStatus('미리보기가 준비되었습니다.');}
   if(message.type==='error'){clearTimeout(timer);setStatus(`미리보기를 불러올 수 없습니다: ${message.message}`);}
   if(message.type==='size'&&selected().status==='playable')setHeight(clampFrameHeight(selected() as PlayableDemo,message.height));
   if(message.type==='return-focus')exit?.focus();
  };
  window.addEventListener('message',receive);onCleanup(()=>window.removeEventListener('message',receive));
 });
 createEffect(()=>{
  const record=selected();generation();clearTimeout(timer);current=undefined;setUrl('');
  if(!mounted()||!nearViewport()||record.status!=='playable')return;
  current={version:1,framework:record.framework,componentId:record.componentId,exampleId:record.exampleId,token:crypto.randomUUID().replaceAll('-','')};
  const target=new URL(record.entryUrl,location.origin);for(const [key,value]of Object.entries(current))target.searchParams.set(key,String(value));
  setHeight(clampFrameHeight(record,record.minHeight));setStatus('미리보기를 불러오는 중입니다.');setUrl(target.href);
  timer=setTimeout(()=>setStatus('15초 안에 응답하지 않았습니다. 다시 시도해 주세요.'),15000);
 });
 onCleanup(()=>{clearTimeout(timer);current=undefined;});
 function initialize(){if(!current||!frame?.contentWindow)return;frame.contentWindow.postMessage({...current,type:'init',presentation:{colorMode:matchMedia('(forced-colors: active)').matches?'forced-colors':'light',reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches}},location.origin);}
 function change(framework:string,exampleId=selected().exampleId){const next=resolveDemoSelection({records:props.demos,query:`?framework=${encodeURIComponent(framework)}&example=${encodeURIComponent(exampleId)}`});setSelection(next);try{sessionStorage.setItem('krds-demo-framework',next.framework);}catch{}const target=new URL(location.href);target.searchParams.set('framework',next.framework);target.searchParams.set('example',next.exampleId);history.replaceState(null,'',target);}
 return <section class="native-demo" aria-label={`${props.componentId} 네이티브 예시`}>
 <div class="native-demo-toolbar"><NativeSelect label="프레임워크 패키지" size="small" value={selected().framework} options={[...new Map(props.demos.map(record=>[record.framework,{value:record.framework,label:record.label}])).values()]} onValueChange={({value})=>change(value)}/><p class="native-demo-package">{selected().package} <code>{selected().packageVersion}</code></p></div>
 <Show when={props.demos.filter(record=>record.framework===selected().framework).length>1}><NativeSelect label="예시" size="small" value={selected().exampleId} options={props.demos.filter(record=>record.framework===selected().framework).map(record=>({value:record.exampleId,label:record.exampleId}))} onValueChange={({value})=>change(selected().framework,value)} /></Show>
 <Show when={selected().status==='playable'} fallback={<p role="status">{(selected() as Extract<DemoRegistryEntry,{status:'unavailable'}>).reason}</p>}>
 <div class="native-demo-actions"><Button size="small" variant="tertiary" disabled={!mounted()} onClick={()=>setGeneration(value=>value+1)}>초기화 / 다시 시도</Button><Link href={(selected() as PlayableDemo).entryUrl} label="전체 화면에서 열기"/><Button size="small" variant="text" onClick={()=>exit?.focus()}>예시 건너뛰기</Button></div>
 <p class="native-demo-status" role="status" aria-live="polite">{status()}</p>
 <div class="native-demo-frame" ref={region} style={{'min-height':`${height()}px`}}><Show when={url()} keyed>{src=><iframe ref={frame} src={src} title={`${selected().label} ${props.componentId} ${selected().exampleId} 네이티브 미리보기`} sandbox="allow-scripts allow-same-origin" style={{height:`${height()}px`}} onLoad={initialize}/>}</Show></div>
 <noscript><p>네이티브 예시 실행에는 JavaScript가 필요합니다. 아래에서 소스를 읽거나 전체 화면 링크를 여세요.</p></noscript>
 </Show>
 <div id={`demo-exit-${props.componentId}`} ref={exit} tabIndex={-1} class="native-demo-exit">예시 다음: 소스 코드</div>
 <NativeDemoSource files={selected().files}/>
 </section>;
}
