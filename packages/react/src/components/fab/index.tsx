import {NativeIcon} from '../../native-icon.js';
import { useId, useRef } from 'react';
import type { FABContract } from '@unofficial-krds/contracts';
import { part, states, useValue } from '../../catalog-utils.js';
export interface FABProps extends FABContract {clearance?:number;}
export function FAB({ label, icon, disabled, onAction, expanded, defaultExpanded, onExpandedChange, actions, clearance, showLabel = true }: FABProps) { const id = useId(); const state = useValue(expanded, defaultExpanded, false, 'FAB'); const trigger = useRef<HTMLButtonElement>(null); if (actions && actions.length > 3)
    throw new RangeError('FAB permits up to three actions.'); const request = (next: boolean) => { if (next === state.current || disabled)
    return; state.commit(next); onExpandedChange?.({ expanded: next }); }; const token = states(state.current ? 'expanded' : 'collapsed', disabled && 'disabled'); return <div style={{insetBlockEnd:clearance===undefined?undefined:`${clearance}px`}} {...part('fab', 'root', token)} data-krds-variant={actions ? 'expandable' : showLabel ? 'extended-label' : 'single-icon'} onKeyDown={e => { if (e.key === 'Escape' && !e.nativeEvent.isComposing && state.current) {
    e.preventDefault();
    request(false);
    queueMicrotask(() => { if (!trigger.current?.getAttribute('aria-expanded') || trigger.current.getAttribute('aria-expanded') === 'false')
        trigger.current?.focus(); });
} }}>{actions && state.current && <div {...part('fab', 'overlay', 'expanded')} onClick={() => request(false)} aria-hidden="true"/>}<button {...part('fab', 'trigger', token)} ref={trigger} type="button" disabled={disabled} aria-label={label} aria-expanded={actions ? state.current : undefined} aria-controls={actions ? id : undefined} onClick={() => actions ? request(!state.current) : onAction?.()}><span {...part('fab', 'icon')} aria-hidden="true"><NativeIcon name={icon}/></span><span {...part('fab', 'label')} hidden={!showLabel}>{label}</span></button>{actions && <ul {...part('fab', 'actions', state.current ? 'expanded' : 'collapsed')} id={id} hidden={!state.current}>{actions.map(action => <li key={action.id}><button {...part('fab', 'action', disabled ? 'disabled' : '')} type="button" disabled={disabled} onClick={action.onAction}>{action.label}</button></li>)}</ul>}</div>; }
