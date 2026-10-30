import { createEffect, type JSX } from 'solid-js';
import type { DisclosureContract } from '@unofficial-krds/contracts';
import { owned, stateValue } from '../../internal/catalog';
export interface DisclosureProps extends DisclosureContract {
    children?: JSX.Element;
}
export function Disclosure(props: DisclosureProps) { const open = stateValue(() => props.open, props.defaultOpen, false, open => props.onOpenChange?.({ open })); let trigger!: HTMLButtonElement; let panel!: HTMLDivElement; createEffect(() => { if (!open.read() && panel?.contains(document.activeElement))
    trigger.focus(); }); return <div {...owned('disclosure', 'root', open.read() ? 'open' : 'closed')}><button ref={trigger} type="button" {...owned('disclosure', 'trigger')} aria-expanded={open.read()} aria-controls={props.contentId} onClick={() => open.request(!open.read())}><span>{props.label}</span><span {...owned('disclosure', 'icon')} aria-hidden="true">{open.read() ? '−' : '+'}</span></button><div ref={panel} id={props.contentId} hidden={!open.read()} {...owned('disclosure', 'content')}>{props.children}</div></div>; }
