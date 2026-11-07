import { createSignal, For, Show } from 'solid-js';
import { NativeSelect } from '@unofficial-krds/solid/native-select';
import { Link } from '@unofficial-krds/solid/link';
import { Disclosure } from '@unofficial-krds/solid/disclosure';
import { CodeBlock } from './CodeBlock';
import { excerptLabel, type DemoSourceFile } from '../demo-source-view';
export type { DemoSourceFile } from '../demo-source-view';
// File name first: the public NativeSelect clips the end of its label, and the full
// selected path is shown (wrapping) below it.
function optionLabel(source:DemoSourceFile){const slash=source.path.lastIndexOf('/');return slash<0?`${source.path} · ${source.role}`:`${source.path.slice(slash+1)} · ${source.role} · ${source.path.slice(0,slash)}`;}
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
export function NativeDemoSource(props:{files:DemoSourceFile[]}) {
 const [path,setPath]=createSignal('');
 const selected=()=>props.files.find(file=>file.path===path())??props.files.find(file=>file.role==='example')??props.files[0];
 return <section class="native-demo-source" aria-label="예시 소스"><Show when={selected()}>{file=><>
 <NativeSelect label="소스 파일" size="small" value={file().path} options={props.files.map(source=>({value:source.path,label:optionLabel(source)}))} onValueChange={({value})=>setPath(value)} />
 <p class="native-demo-path"><code>{file().path}</code></p>
 <Link href={file().downloadUrl} label="원본 소스 다운로드" />
 <Show when={file().excerpts?.length} fallback={<CodeBlock value={file().value??''} language={file().language}/>}>
  <For each={file().excerpts}>{excerpt=><figure class="native-demo-excerpt"><figcaption>{excerptLabel(excerpt,file().symbolOrBranch)}</figcaption><CodeBlock value={excerpt.value} language={file().language}/></figure>}</For>
  <Show when={file().path} keyed>{_path=><FullFile file={file()}/>}</Show>
 </Show>
 </>}</Show></section>;
}
