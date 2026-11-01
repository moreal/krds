import { createMemo, createSignal, onMount, Show } from 'solid-js';
import { Modal } from '@unofficial-krds/solid/modal';
import { TextInput } from '@unofficial-krds/solid/text-input';
import { Button } from '@unofficial-krds/solid/button';
import { StructuredList } from '@unofficial-krds/solid/structured-list';
import { Link } from '@unofficial-krds/solid/link';
import type { SearchRecord } from '../content';
let cached: Promise<SearchRecord[]> | undefined;
function loadIndex() {
 return cached??=(fetch('/krds/search-index.json').then(response=>{if(!response.ok)throw Error('검색 색인 응답 오류');return response.json() as Promise<SearchRecord[]>;}).catch(error=>{cached=undefined;throw error;}));
}
const normalize=(value:string)=>value.normalize('NFKC').toLocaleLowerCase('ko-KR');
export function SearchDialog(props:{onClose:()=>void}) {
 const [query,setQuery]=createSignal(''),[records,setRecords]=createSignal<SearchRecord[]>([]),[state,setState]=createSignal<'loading'|'ready'|'error'>('loading');
 async function load(){setState('loading');try{setRecords(await loadIndex());setState('ready');}catch{setState('error');}}
 onMount(()=>{void load();});
 const matches=createMemo(()=>{const terms=normalize(query()).trim().split(/\s+/).filter(Boolean);if(!terms.length)return [];return records().map(record=>{const title=normalize(record.title+' '+record.heading),text=normalize(record.text);return {record,score:terms.every(term=>(title+' '+text).includes(term))?terms.reduce((score,term)=>score+(title.includes(term)?10:1),0):0};}).filter(result=>result.score>0).sort((a,b)=>b.score-a.score||a.record.id.localeCompare(b.record.id,'en')).map(result=>result.record);});
 const items=createMemo(()=>matches().slice(0,20).map(record=>({id:record.id,title:record.heading?`${record.title} — ${record.heading}`:record.title,href:record.href,metadata:[{label:'문서',value:record.text.slice(0,140)}]})));
 const status=()=>state()==='loading'?'검색 색인을 불러오는 중입니다.':state()==='error'?'검색 색인을 불러오지 못했습니다. 다시 시도해 주세요.':!query().trim()?'한국어·영어 이름, API 또는 키보드 안내를 입력하세요.':matches().length?`검색 결과 ${matches().length}개${matches().length>20?' 중 처음 20개를 표시합니다.':'입니다.'}`:'검색 결과가 없습니다.';
 return <Modal id="docs-search-dialog" title="문서 검색" description="Ctrl / ⌘ + K로 열고 Escape로 닫습니다. Tab으로 검색 결과 링크를 탐색하세요." open initialFocusId="docs-search-input" returnFocusId="docs-search-trigger" onOpenChange={({open})=>{if(!open)props.onClose();}} actions={<><Link href="/krds/components/" label="전체 컴포넌트 보기" /><Button variant="tertiary" onClick={props.onClose}>검색 닫기</Button></>}>
  <TextInput id="docs-search-input" label="검색어" type="search" value={query()} onValueChange={({value})=>setQuery(value)} autocomplete="off" helpId="docs-search-status" />
  <p id="docs-search-status" role="status" aria-live="polite">{status()}</p>
  <div class="docs-actions"><Button size="small" variant="tertiary" disabled={!query()} onClick={()=>{setQuery('');document.getElementById('docs-search-input')?.focus();}}>검색 지우기</Button><Show when={state()==='error'}><Button size="small" onClick={()=>void load()}>다시 시도</Button></Show></div>
  <Show when={state()==='ready'&&items().length}><StructuredList items={items()} itemActions={item=><Link href={item.href!} label="문서 열기" />} /></Show>
 </Modal>;
}
