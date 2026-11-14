import { useLayoutEffect, useRef, type ReactNode } from 'react';
import type { DisclosureContract } from '@unofficial-krds/contracts';
import { part, useValue } from '../../catalog-utils.js';
export interface DisclosureProps extends DisclosureContract {
    children?: ReactNode;
}
export function Disclosure({ open, defaultOpen, onOpenChange, label, contentId, children }: DisclosureProps) { const state = useValue(open, defaultOpen, false, 'Disclosure'); const trigger = useRef<HTMLButtonElement>(null); const panel = useRef<HTMLDivElement>(null); useLayoutEffect(() => { if (!state.current && panel.current?.contains(panel.current.ownerDocument.activeElement))
    trigger.current?.focus(); }, [state.current]); const token = state.current ? 'open' : 'closed'; return <div {...part('disclosure', 'root', token)}><button {...part('disclosure', 'trigger')} ref={trigger} type="button" aria-expanded={state.current} aria-controls={contentId} onClick={() => { state.commit(!state.current); onOpenChange?.({ open: !state.current }); }}><span>{label}</span><span {...part('disclosure', 'icon')} aria-hidden="true">{state.current ? '−' : '+'}</span></button><div {...part('disclosure', 'content')} id={contentId} ref={panel} hidden={!state.current}>{children}</div></div>; }
