import { For, Show, createEffect } from 'solid-js';
import type { StepIndicatorContract } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';
export type StepIndicatorProps = StepIndicatorContract;
export function StepIndicator(props: StepIndicatorProps) {createEffect(()=>{if(props.steps.length<3||props.steps.length>7)throw new TypeError('StepIndicator requires three to seven steps');}); return <ol {...owned('step-indicator')} aria-label="진행 단계" data-krds-mode={props.mode ?? 'sequential'}><For each={props.steps}>{(step, index) => <li {...owned('step-indicator', 'item', step.status)} aria-current={step.status === 'current' ? 'step' : undefined}><span {...owned('step-indicator', 'number')}>{index() + 1}</span><Show when={step.href && (props.mode === 'adaptive' || step.status === 'complete')} fallback={<span {...owned('step-indicator', 'label')}>{step.label}</span>}><a {...owned('step-indicator', 'label')} href={step.href} onClick={event => { if (props.onStepRequest) {
    event.preventDefault();
    props.onStepRequest({ id: step.id });
} }}>{step.label}</a></Show><span {...owned('step-indicator', step.status === 'complete' ? 'complete-indicator' : 'current-indicator')}>{step.status === 'complete' ? '완료' : step.status === 'current' ? '현재 단계' : '예정'}</span></li>}</For></ol>; }
