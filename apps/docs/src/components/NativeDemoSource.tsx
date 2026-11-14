import { createSignal, For, Show } from 'solid-js';
import { Link } from '@unofficial-krds/solid/link';
import { Disclosure } from '@unofficial-krds/solid/disclosure';
import { CodeBlock } from './CodeBlock';
import { excerptLabel, type DemoSourceFile } from '../demo-source-view';
export type { DemoSourceFile } from '../demo-source-view';
async function digest(text:string){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(bytes)].map(byte=>byte.toString(16).padStart(2,'0')).join('');}
/** A ranged source shows its excerpts; the full file is fetched only when the visitor opens it, so pages never inline monoliths. */
function FullFile(props:{file:DemoSourceFile}) {
 const [value,setValue]=createSignal<string>(),[status,setStatus]=createSignal('');
 async function load(){
  if(value()!==undefined)return;setStatus('전체 파일을 불러오는 중입니다.');
  try{const response=await fetch(props.file.downloadUrl);if(!response.ok)throw new Error(String(response.status));const text=await response.text();if(await digest(text)!==props.file.sha256)throw new Error('hash');setValue(text);setStatus('');}
  catch{setStatus('전체 파일을 불러올 수 없습니다. 원본 소스 다운로드 링크를 이용해 주세요.');}
 }
 return <Disclosure label="전체 파일 보기" contentId={`native-demo-full-${props.file.path.replace(/[^A-Za-z0-9]+/g,'-')}`} onOpenChange={({open})=>{if(open)void load();}}>
  <Show when={value()!==undefined} fallback={<p role="status">{status()}</p>}><CodeBlock value={value()!} language={props.file.language}/></Show>
 </Disclosure>;
}
/** Shows the example's own source; host and style files stay reachable through the full-file view and the download. */
export function NativeDemoSource(props:{files:DemoSourceFile[]}) {
 const selected=()=>props.files.find(file=>file.role==='example')??props.files[0];
 return <section class="native-demo-source" aria-label="예시 소스"><Show when={selected()} keyed>{file=><>
 <Show when={file.excerpts?.length} fallback={<CodeBlock value={file.value??''} language={file.language}/>}>
  <For each={file.excerpts}>{excerpt=><figure class="native-demo-excerpt"><figcaption>{excerptLabel(excerpt,file.symbolOrBranch)}</figcaption><CodeBlock value={excerpt.value} language={file.language}/></figure>}</For>
  <FullFile file={file}/>
 </Show>
 <p class="native-demo-download"><Link href={file.downloadUrl} label="원본 소스 다운로드" /></p>
 </>}</Show></section>;
}
