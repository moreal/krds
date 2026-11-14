import { createSignal, createEffect, onMount, onCleanup, Show, type JSX } from 'solid-js';
import { NativeSelect } from '@unofficial-krds/solid/native-select';
import { Tabs } from '@unofficial-krds/solid/tabs';
import { Button } from '@unofficial-krds/solid/button';
import { Link } from '@unofficial-krds/solid/link';
import type { DemoRegistryEntry, PlayableDemo } from '../../../../tools/docs-previews/contract';
import { matchesPreviewEvent, type PreviewIdentity } from '../../../../tools/docs-previews/protocol';
import { resolveDemoSelection } from '../demo-selection';
import { clampFrameHeight } from '../demo-frame';
import { NativeDemoSource, type DemoSourceFile } from './NativeDemoSource';
import { frameworkMark } from '../framework-marks';
export type NativeDemoRecord=DemoRegistryEntry & {files:DemoSourceFile[]};
export function NativeDemo(props:{componentId:string;demos:NativeDemoRecord[]}) {
 const [selection,setSelection]=createSignal(resolveDemoSelection({records:props.demos}));
 const [mounted,setMounted]=createSignal(false),[generation,setGeneration]=createSignal(0),[status,setStatus]=createSignal('미리보기를 준비하고 있습니다.');
 const [nearViewport,setNearViewport]=createSignal(false),[view,setView]=createSignal('preview');
 // Server markup already reserves the selected example's recorded height.
 const first=selection();let sized='';
 const [height,setHeight]=createSignal(first.status==='playable'?clampFrameHeight(first,first.minHeight):240),[url,setUrl]=createSignal('');
 let region:HTMLElement|undefined;let frame:HTMLIFrameElement|undefined;let exit:HTMLDivElement|undefined;
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
  // A reset keeps the height already on screen, so the content below does not drop and grow again;
  // another framework or example starts from its own recorded height.
  const key=`${record.framework}/${record.exampleId}`;setHeight(value=>clampFrameHeight(record,key===sized?value:record.minHeight));sized=key;setStatus('미리보기를 불러오는 중입니다.');setUrl(target.href);
  timer=setTimeout(()=>setStatus('15초 안에 응답하지 않았습니다. 다시 시도해 주세요.'),15000);
 });
 onCleanup(()=>{clearTimeout(timer);current=undefined;});
 function initialize(){if(!current||!frame?.contentWindow)return;frame.contentWindow.postMessage({...current,type:'init',presentation:{colorMode:matchMedia('(forced-colors: active)').matches?'forced-colors':'light',reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches}},location.origin);}
 function change(framework:string,exampleId=selected().exampleId){const next=resolveDemoSelection({records:props.demos,query:`?framework=${encodeURIComponent(framework)}&example=${encodeURIComponent(exampleId)}`});setSelection(next);try{sessionStorage.setItem('krds-demo-framework',next.framework);}catch{}const target=new URL(location.href);target.searchParams.set('framework',next.framework);target.searchParams.set('example',next.exampleId);history.replaceState(null,'',target);}
 // Label and content are accessors so each is created where Tabs inserts it, on the server and during hydration alike.
 const lazy=(render:()=>JSX.Element)=>render as unknown as JSX.Element;
 const Preview=()=><>
 <div class="native-demo-actions"><Button size="small" variant="tertiary" disabled={!mounted()} onClick={()=>setGeneration(value=>value+1)}>초기화</Button><Link href={(selected() as PlayableDemo).entryUrl} label="전체 화면에서 열기"/><span class="native-demo-skip"><Button size="small" variant="text" onClick={()=>exit?.focus()}>미리보기 건너뛰기</Button></span><p class="native-demo-status" role="status" aria-live="polite">{status()}</p></div>
 <div class="native-demo-frame" style={{'min-height':`${height()}px`}}><Show when={url()} keyed>{src=><iframe ref={frame} src={src} title={`${selected().label} ${props.componentId} ${selected().exampleId} 네이티브 미리보기`} sandbox="allow-scripts allow-same-origin" style={{height:`${height()}px`}} onLoad={initialize}/>}</Show></div>
 <noscript><p>미리보기 실행에는 JavaScript가 필요합니다. 아래 코드를 읽거나 전체 화면 링크를 여세요.</p><style>{'.native-demo-views > [role="tabpanel"] { display: block !important; }'}</style></noscript>
 <div id={`demo-exit-${props.componentId}`} ref={exit} tabIndex={-1} class="native-demo-exit">미리보기 끝</div>
 </>;
 // The same body sits in whichever framework tab is selected; only that panel mounts it. The chosen view survives a framework change.
 const Body=()=><>
 <p class="native-demo-package">{selected().package} <code>{selected().packageVersion}</code></p>
 <Show when={props.demos.filter(record=>record.framework===selected().framework).length>1}><NativeSelect label="예시" size="small" value={selected().exampleId} options={props.demos.filter(record=>record.framework===selected().framework).map(record=>({value:record.exampleId,label:record.exampleId}))} onValueChange={({value})=>change(selected().framework,value)} /></Show>
 <Show when={selected().status==='playable'} fallback={<><p role="status">{(selected() as Extract<DemoRegistryEntry,{status:'unavailable'}>).reason}</p><NativeDemoSource files={selected().files}/></>}>
 <Tabs class="native-demo-views" aria-label="보기" value={view()} onValueChange={({value})=>setView(value)} items={[{value:'preview',label:'미리보기',content:lazy(()=><Preview/>)},{value:'code',label:'코드',content:lazy(()=><NativeDemoSource files={selected().files}/>)}]}/>
 </Show>
 </>;
 const frameworks=[...new Map(props.demos.map(record=>[record.framework,record.label])).entries()].map(([framework,label])=>({value:framework,
  label:lazy(()=><span class="native-demo-framework"><Show when={frameworkMark(framework)}>{d=><svg viewBox="0 0 24 24" aria-hidden="true"><path d={d()}/></svg>}</Show><span class="native-demo-framework-name">{label}</span><Show when={props.demos.every(record=>record.framework!==framework||record.status!=='playable')}><span class="native-demo-framework-note">미제공</span></Show></span>),
  content:lazy(()=><Show when={selected().framework===framework}><Body/></Show>)}));
 return <section class="native-demo" ref={region} aria-label={`${props.componentId} 예제`}>
 <Tabs class="native-demo-frameworks" aria-label="프레임워크" value={selected().framework} items={frameworks} onValueChange={({value})=>change(value)}/>
 </section>;
}
