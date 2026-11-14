<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { StepIndicatorContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: StepIndicatorContract & { optionalAction?:Snippet<[StepIndicatorContract['steps'][number],StepIndicatorContract['steps'][number]|undefined]> } = $props();

</script>
<ol {...owned('step-indicator','root')} aria-label="진행 단계" data-krds-mode={p.mode??'sequential'}>{#each p.steps as step,i(step.id)}<li {...owned('step-indicator','item',step.status)} aria-current={step.status==='current'?'step':undefined}><span {...owned('step-indicator','number')}>{i+1}</span>{#if step.href&&(p.mode==='adaptive'||step.status==='complete')}<a {...owned('step-indicator','label')} href={step.href}>{step.label}</a>{:else if !step.href&&p.onStepRequest&&(step.status!=='pending'||p.mode==='adaptive')}<button type="button" onclick={()=>p.onStepRequest?.({id:step.id})} {...owned('step-indicator','label')}>{step.label}</button>{:else}<span {...owned('step-indicator','label')}>{step.label}</span>{/if}{#if step.optional}<span>선택 단계</span>{#if step.status==='current'&&p.optionalAction}{@render p.optionalAction(step,p.steps[i+1])}{/if}{/if}<span {...owned('step-indicator',step.status==='complete'?'complete-indicator':'current-indicator')}>{step.status==='complete'?'완료':step.status==='current'?'현재 단계':'예정'}</span></li>{/each}</ol>
