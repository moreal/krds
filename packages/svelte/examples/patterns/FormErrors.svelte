<script lang="ts">
import { tick } from 'svelte';
import { TextInput, NativeSelect, Textarea, Button, Spinner } from '@unofficial-krds/svelte';
import IdentityNotice from './IdentityNotice.svelte';
import type { Identity, Option, FormView } from './types';
let { view, identity, categories, onField = () => { }, onSubmit = () => { }, onReset = () => { }, onErrorLink = () => { }, onRetry = () => { } }: {
    view: FormView;
    identity: Identity;
    categories: readonly Option[];
    onField?: (field: 'title' | 'category' | 'detail', value: string) => void;
    onSubmit?: () => void;
    onReset?: () => void;
    onErrorLink?: (field: 'title' | 'category' | 'detail') => void;
    onRetry?: () => void;
} = $props();
const titleError = $derived(view.errors.find(e => e.field === 'title'));
const categoryError = $derived(view.errors.find(e => e.field === 'category'));
const detailError = $derived(view.errors.find(e => e.field === 'detail'));
const pending = $derived(view.phase === 'loading');
let composing = false;
let form = $state<HTMLFormElement>();
$effect(() => { const errors = view.errors; void tick().then(() => { if (!form?.isConnected)
    return; for (const field of ['title', 'category', 'detail']) {
    const control = form.elements.namedItem(field) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    control?.setCustomValidity(errors.find(error => error.field === field)?.message ?? '');
} }); });
function reset(e: Event) { queueMicrotask(() => { if (!e.defaultPrevented)
    onReset(); }); }
</script>
<main><h1>예제 입력폼</h1><IdentityNotice {identity}/>
<form bind:this={form} id="example-form" novalidate aria-busy={pending} onsubmit={e=>{e.preventDefault();if(!composing)onSubmit();}} onreset={reset} oncompositionstart={()=>composing=true} oncompositionend={()=>composing=false}>
{#if view.errors.length}<section id="example-form-errors" role="alert" aria-labelledby="example-form-errors-title"><h2 id="example-form-errors-title">입력 내용을 확인하세요</h2><ol>{#each view.errors as error}<li><a href={`#${error.targetId}`} onclick={e=>{e.preventDefault();onErrorLink(error.field);}}>{error.message}</a></li>{/each}</ol></section>{/if}
<TextInput id="example-form-title" name="title" label="예제 제목 (필수)" value={view.values.title} required disabled={pending} invalid={!!titleError} helpId="example-form-title-help" errorId={titleError?.errorId} onValueChange={({value})=>onField('title',value)}/><p id="example-form-title-help">4자 이상 60자 이하로 입력하세요.</p>{#if titleError}<p id={titleError.errorId}>{titleError.message}</p>{/if}
<NativeSelect id="example-form-category" name="category" label="연습 유형 (필수)" options={[...categories]} value={view.values.category} required disabled={pending} invalid={!!categoryError} error={categoryError?.message} onValueChange={({value})=>onField('category',value)}/>
<Textarea id="example-form-detail" name="detail" label="추가 설명 (선택)" value={view.values.detail} disabled={pending} invalid={!!detailError} helpId="example-form-detail-help" errorId={detailError?.errorId} onValueChange={({value})=>onField('detail',value)}/><p id="example-form-detail-help">120자 이하로 입력하세요.</p>{#if detailError}<p id={detailError.errorId}>{detailError.message}</p>{/if}
<div class="actions"><Button id="example-form-submit" type="submit" disabled={pending}>예제 저장</Button><Button id="example-form-reset" type="reset" variant="secondary">초기화</Button></div>
{#if pending}<div aria-label="예제 저장 상태"><Spinner completionMessage="완료" pending label="예제 저장 중"/></div>{/if}
{#if view.phase==='error'}<p role="alert">{view.error}</p><Button id="example-form-retry" onclick={onRetry}>다시 시도</Button>{/if}
{#if view.receipt}<p role="status">로컬 예제 완료: {view.receipt.id} — {view.receipt.title}</p>{/if}
</form></main>
<style>main{max-width:64rem;margin:auto;padding:1rem}form{display:grid;gap:1rem}.actions{display:flex;flex-wrap:wrap;gap:2rem}p{overflow-wrap:anywhere}</style>
