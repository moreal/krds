import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { BadgeContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type BadgeProps = NativeContract<BadgeContract>;
export const Badge = component$<BadgeProps>((props) => { if (!props.label.trim() || !['secondary', 'gray', 'point', 'danger', 'warning', 'success', 'information', 'disabled'].includes(props.tone ?? 'secondary'))
    throw new TypeError('Badge requires a label and supported tone'); return <span {...owned('badge', 'root', states(props.appearance ?? 'outline', props.tone ?? 'secondary', props.size ?? 'medium', props.numeric && 'numeric'))} data-krds-appearance={props.appearance ?? 'outline'} data-krds-tone={props.tone ?? 'secondary'} data-krds-size={props.size ?? 'medium'}><span {...owned('badge', 'label')}>{props.label}</span></span>; });
