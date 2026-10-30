<script lang="ts">
import { TextInput, NativeSelect, Button, Spinner, StructuredList, Pagination } from '@unofficial-krds/svelte';
import IdentityNotice from './IdentityNotice.svelte';
import type { Identity, Option, SearchView } from './types';
let { view, identity, categories, hrefForPage, onQuery = () => { }, onSearch = () => { }, onFilter = () => { }, onPage = () => { }, onRetry = () => { } }: {
    view: SearchView;
    identity: Identity;
    categories: readonly Option[];
    hrefForPage: (page: number) => string;
    onQuery?: (value: string) => void;
    onSearch?: () => void;
    onFilter?: (value: string) => void;
    onPage?: (page: number) => void;
    onRetry?: () => void;
} = $props();
let composing = false;
const items = $derived(view.items.map(item => ({ id: item.id, title: item.title, summary: item.summary, metadata: [{ label: '자료 유형', value: categories.find(c => c.value === item.category)?.label ?? item.category }, { label: '날짜', value: item.date }, { label: '설명', value: item.summary }] })));
</script>
<main><h1>로컬 자료 검색</h1><IdentityNotice {identity}/><p>열두 개의 자료는 모두 가상의 학습 자료입니다.</p>
<form onsubmit={e=>{e.preventDefault();if(!composing)onSearch();}} oncompositionstart={()=>composing=true} oncompositionend={()=>composing=false}><TextInput id="example-search-query" type="search" name="query" label="검색어" value={view.query} onValueChange={({value})=>onQuery(value)}/><Button id="example-search-submit" type="submit">검색</Button></form>
<NativeSelect id="example-search-category" name="category" label="자료 유형" options={[...categories]} value={view.category} onValueChange={({value})=>onFilter(value)}/>
{#if view.phase==='loading'}<div aria-label="검색 상태"><Spinner completionMessage="완료" pending label="검색 중"/></div>{:else if view.phase==='error'}<p role="alert">{view.error}</p><Button id="example-search-retry" onclick={onRetry}>다시 시도</Button>{:else}
<p id="example-search-count" aria-live="polite">검색어: {view.appliedQuery||'전체'} · 자료 유형: {categories.find(c=>c.value===view.category)?.label} · {view.total}건</p>
{#if view.total===0}<p>검색 결과가 없습니다. 검색어나 자료 유형을 바꿔 보세요.</p>{:else}<h2>검색 결과</h2><StructuredList {items}/><Pagination page={view.page} pageCount={view.pageCount} {hrefForPage} onPageChange={({page})=>onPage(page)}/>{/if}{/if}</main>
<style>main{max-width:64rem;margin:auto;padding:1rem}form{display:flex;align-items:end;flex-wrap:wrap;gap:1rem}main :global([data-krds-component='native-select']){margin-block:1rem}p{overflow-wrap:anywhere}</style>
