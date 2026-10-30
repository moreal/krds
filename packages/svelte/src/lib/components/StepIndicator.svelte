<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { StepIndicatorContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: StepIndicatorContract & { optionalAction?:Snippet<[StepIndicatorContract['steps'][number],StepIndicatorContract['steps'][number]|undefined]> } = $props();

</script>
<nav aria-label="진행 단계" {...owned('step-indicator','root')} data-krds-mode={p.mode??'sequential'}><ol {...owned('step-indicator','list')}>{#each p.steps as step,i(step.id)}<li {...owned('step-indicator','item',step.status)} aria-current={step.status==='current'?'step':undefined}><span {...owned('step-indicator','number',step.status)}>{i+1}</span>{#if step.href&&(step.status!=='pending'||p.mode==='adaptive')}<a href={step.href} {...owned('step-indicator','label',step.status)}>{step.label}</a>{:else if p.onStepRequest&&(step.status!=='pending'||p.mode==='adaptive')}<button type="button" onclick={()=>p.onStepRequest?.({id:step.id})} {...owned('step-indicator','label',step.status)}>{step.label}</button>{:else}<span {...owned('step-indicator','label',step.status)}>{step.label}</span>{/if}{#if step.optional}<span>선택 단계</span>{#if step.status==='current'&&p.optionalAction}{@render p.optionalAction(step,p.steps[i+1])}{/if}{/if}{#if step.status==='current'}<span {...owned('step-indicator','current-indicator','current')}>현재 단계</span>{:else if step.status==='complete'}<span {...owned('step-indicator','complete-indicator','complete')}>완료</span>{/if}{#if i<p.steps.length-1}<span aria-hidden="true" {...owned('step-indicator','connector',step.status)}>→</span>{/if}</li>{/each}</ol></nav>
