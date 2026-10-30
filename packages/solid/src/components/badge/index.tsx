import { createEffect } from 'solid-js';
import type { BadgeContract } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';
export type BadgeProps = BadgeContract;
export function Badge(props: BadgeProps) { createEffect(()=>{ if (!props.label.trim() || !['secondary', 'gray', 'point', 'danger', 'warning', 'success', 'information', 'disabled'].includes(props.tone ?? 'secondary'))
    throw new TypeError('Badge requires a label and supported tone'); }); return <span {...owned('badge','root',props.numeric?'numeric':'')} data-krds-appearance={props.appearance ?? 'outline'} data-krds-tone={props.tone ?? 'secondary'} data-krds-size={props.size ?? 'medium'}><span {...owned('badge', 'label')}>{props.label}</span></span>; }
