<script lang="ts">
import { onMount } from 'svelte';
import CatalogFixture from './CatalogFixture.svelte';
import PatternHost from './examples/PatternHost.svelte';
import { Button, NativeSelect, Modal, Tabs, Calendar, DateInput } from '@unofficial-krds/svelte';
import type { DateValue } from '@unofficial-krds/svelte';
import { fullCatalogScenarios } from '@unofficial-krds/test-contracts';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import type { FixtureBridge } from '@unofficial-krds/test-contracts';
import '@unofficial-krds/styles/all.css';
const componentId = decodeURIComponent(window.location.pathname.split('/')[2] ?? 'unknown');
const caseId = new URLSearchParams(window.location.search).get('case') ?? 'default';
let fixtureState = $state<Record<string, unknown>>({ value: componentId === 'native-select' ? 'seoul' : componentId === 'tabs' ? 'first' : null, disabled: componentId === 'button' && caseId === 'disabled', triggerVisible: true });
let bridge: FixtureBridge;
let ready = $state(false);
let opened = $state(false);
onMount(() => {
    if (!['button','native-select','modal','tabs','calendar','date-input'].includes(componentId)) return;
    bridge = createFixtureBridge('svelte', fixtureState);
    const off = bridge.subscribe(next => {
        fixtureState = next;
    });
    ready = true;
    return () => {
        off();
        bridge.dispose();
    };
});
function change(detail: {
    value: unknown;
}) {
    bridge.recordEvent('valueChange', detail);
    if (!fixtureState.reject)
        void bridge.setState({ value: detail.value });
}
</script>
{#if window.location.pathname.startsWith('/examples/')}<PatternHost/>{:else if componentId==='unknown'}<main><h1>KRDS Svelte native catalog</h1><p>독립 로컬 예제입니다.</p><ul>{#each ['button','native-select','modal','tabs','calendar','date-input'] as id}<li><a href={`/fixtures/${id}?case=${id==='button'?'disabled':'default'}`}>{id}</a></li>{/each}{#each fullCatalogScenarios.filter((item,index,all)=>all.findIndex(candidate=>candidate.componentId===item.componentId)===index) as item}<li><a href={`/fixtures/${item.componentId}?case=${item.caseId}`}>{item.componentId}</a></li>{/each}</ul></main>{:else if !['button','native-select','modal','tabs','calendar','date-input'].includes(componentId)}<CatalogFixture {componentId} {caseId}/>{:else}
<main style="max-width:60rem;margin:1rem;padding:1rem">
 <h1>Svelte native fixture</h1>{#if ready}
<p role="status" aria-label="Fixture health">ready</p>{/if}
 {#if componentId==='button'}
<Button disabled={Boolean(fixtureState.disabled)} onclick={()=>bridge.recordEvent('click',{})}>저장</Button>
 {:else if componentId==='native-select'}
 <form>
<NativeSelect label="지역" options={[{value:'seoul',label:'서울'},{value:'busan',label:'부산'},{value:'blocked',label:'선택 불가',disabled:true}]} name="region" value={caseId==='form-reset'?undefined:fixtureState.value as string} defaultValue={caseId==='form-reset'?'seoul':undefined} onValueChange={change}/>
<Button type="reset">초기화</Button>
</form>
 {:else if componentId==='modal'}
 <Button id="alternate">다음 작업</Button>
 <Modal title="확인" open={opened} returnFocusId="alternate" onOpenChange={({open})=>{bridge.recordEvent('openChange',{open});if(!fixtureState.reject)opened=open;}}>
  {#snippet trigger({open,expanded,controls})}
   {#if fixtureState.triggerVisible}
<Button aria-haspopup="dialog" aria-expanded={expanded} aria-controls={controls} onclick={open}>열기</Button>{/if}
  {/snippet}
  <p>입력 내용을 확인하세요.</p>
 </Modal>
 {:else if componentId==='tabs'}
<Tabs label="안내" value={fixtureState.value as string} activationMode={fixtureState.activationMode==='automatic'?'automatic':'manual'} items={[{value:'first',label:'첫 번째',content:'첫 번째 내용'},{value:'second',label:'두 번째',content:'두 번째 내용'},{value:'disabled',label:'비활성',disabled:true,content:'비활성 내용'}]} onValueChange={change}/>
 {:else if componentId==='calendar'}
<Calendar label="날짜 선택" referenceDate="2024-02-15" value={fixtureState.value as DateValue} onValueChange={change}/>
 {:else if componentId==='date-input'}
<form>
<DateInput label="날짜" name="date" referenceDate="2024-02-15" value={fixtureState.value as DateValue} onValueChange={change}/>
<Button type="submit">제출</Button>
<Button type="reset">초기화</Button>
</form>
 {:else}
<p role="note">Component not implemented: {componentId}/{caseId}</p>{/if}
</main>

{/if}
