<script lang="ts">
import { RadioGroup, Button, Modal, Spinner } from '@unofficial-krds/svelte';
import IdentityNotice from './IdentityNotice.svelte';
import type { Identity, ConsentView } from './types';
let { view, identity, content, onChoice = () => { }, onReview = () => { }, onConfirm = () => { }, onClose = () => { }, onRetry = () => { } }: {
    view: ConsentView;
    identity: Identity;
    content: readonly {
        id: 'requiredChoice' | 'optionalChoice';
        title: string;
        required: boolean;
        paragraphs: readonly string[];
    }[];
    onChoice?: (field: 'requiredChoice' | 'optionalChoice', value: boolean) => void;
    onReview?: () => void;
    onConfirm?: () => void;
    onClose?: () => void;
    onRetry?: () => void;
} = $props();
</script>
<main><h1>예제 이용 안내 확인</h1><IdentityNotice {identity}/>{#each content as group}<section aria-labelledby={`example-consent-${group.id}-heading`}><h2 id={`example-consent-${group.id}-heading`}>{group.title}</h2><div id={`example-consent-${group.id}-description`}>{#each group.paragraphs as paragraph}<p>{paragraph}</p>{/each}</div><RadioGroup label={group.title} name={group.id} value={view[group.id]===null?null:view[group.id]?'agree':'decline'} required={group.required} invalid={group.required&&view.phase==='invalid'} helpId={`example-consent-${group.id}-description`} errorId={group.required&&view.phase==='invalid'?'example-consent-error':undefined} options={[{id:`example-consent-${group.required?'required':'optional'}-agree`,value:'agree',label:'동의함'},{id:`example-consent-${group.required?'required':'optional'}-decline`,value:'decline',label:'동의하지 않음'}]} onValueChange={({value})=>{if(value!==null)onChoice(group.id,value==='agree');}}/></section>{/each}
{#if view.phase==='invalid'}<p role="alert" id="example-consent-error">{view.error}</p>{/if}
<Button id="example-consent-review" onclick={onReview}>확인하기</Button>
<Modal id="example-consent-dialog" title="예제 선택 확인" open={view.modalOpen} initialFocusId="example-consent-dialog" returnFocusId="example-consent-review" description="선택 결과는 이 화면에서만 확인되며 실제 신청이나 전송은 이루어지지 않습니다." onOpenChange={({open})=>{if(!open)onClose();}}>
<p>필수 안내: {view.requiredChoice?'동의함':'동의하지 않음'}</p><p>선택 안내: {view.optionalChoice?'동의함':'동의하지 않음'}</p>
{#if view.phase==='loading'}<Spinner completionMessage="완료" pending label="예제 확인 중"/>{/if}{#if view.phase==='error'}<p role="alert">{view.error}</p>{/if}
{#snippet actions()}<Button id="example-consent-cancel" variant="secondary" onclick={onClose}>돌아가기</Button><Button id={view.phase==='error'?'example-consent-retry':'example-consent-confirm'} aria-disabled={view.phase==='loading'} onclick={()=>{if(view.phase==='error')onRetry();else if(view.phase!=='loading')onConfirm();}}>{view.phase==='error'?'다시 시도':'예제 완료'}</Button>{/snippet}
</Modal>
{#if view.receipt}<p role="status">로컬 예제 완료: {view.receipt.id} · 필수 동의함 · 선택 {view.receipt.optionalChoice?'동의함':'동의하지 않음'}</p>{/if}</main>
<style>main{max-width:64rem;margin:auto;padding:1rem}section{margin-block:2rem;padding-block:1rem}p{overflow-wrap:anywhere}</style>
