import { createEffect, createUniqueId, onSettled, untrack } from 'solid-js';
import { Portal, type JSX } from '@solidjs/web';
import type { OpenChangeDetails } from '@unofficial-krds/contracts';
import { focusBody, focusableSelector, lockDocumentScroll, nativeState, ParentDialog, part, usable, useEnvironment } from '../../internal/native';
export interface ModalProps {
    id?: string;
    title: JSX.Element;
    titleId?: string;
    description?: JSX.Element;
    descriptionId?: string;
    children?: JSX.Element;
    actions?: JSX.Element;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (details: OpenChangeDetails) => void;
    closeOnOutsideClick?: boolean;
    showCloseButton?: boolean;
    initialFocusId?: string;
    returnFocusId?: string;
    closeLabel?: string;
    locale?: 'ko-KR' | 'en-US';
}
const stacks = new WeakMap<Document, HTMLDialogElement[]>();
export function Modal(props: ModalProps) {
    const environment = useEnvironment();
    const id = untrack(()=>props.id ?? `krds-modal-${createUniqueId()}`);
    const state = nativeState(() => props.open, () => props.defaultOpen ?? false, () => props.defaultOpen);
    let dialog!: HTMLDialogElement, opener: HTMLElement | undefined, pointerOpener: HTMLElement | undefined, ancestors: HTMLElement[] = [], down = false, active = false, disposed = false;
    let release: (()=>void)|undefined;
    let releaseScroll: (() => void) | undefined;
    const descendants = new Set<() => void>();
    const childLifetime = {
        isOpen: () => active && dialog.isConnected,
        register(close: () => void) {
            descendants.add(close);
            return () => { descendants.delete(close); };
        },
    };
    const request = (open: boolean) => {
        if (open !== state.value())
            state.request(open, detail => props.onOpenChange?.({ open: detail.value }));
    };
    const backdrop = (event:PointerEvent) => {
        const box=dialog.getBoundingClientRect();
        return event.target===dialog && (event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom);
    };
    const top = () => stacks.get(dialog.ownerDocument)?.at(-1) === dialog;
    const restore = () => {
        const doc = dialog.ownerDocument;
        const alternate = props.returnFocusId ? doc.getElementById(props.returnFocusId) : null;
        const target = usable(opener) ? opener : usable(alternate) ? alternate : ancestors.find(usable);
        if (target)
            target.focus({ preventScroll: true });
        else
            focusBody(doc);
    };
    const close = () => {
        if (!active)
            return;
        active = false;
        for (const closeChild of [...descendants]) closeChild();
        const doc = dialog.ownerDocument;
        const stack = stacks.get(doc)!;
        stack.splice(stack.indexOf(dialog), 1);
        dialog.close();
        releaseScroll?.();
        releaseScroll = undefined;
        restore();
    };
    const sync = (open: boolean) => {
        if (!dialog)
            return;
        if (!open) {
            close();
            return;
        }
        if (active)
            return;
        active = true;
        const doc = dialog.ownerDocument;
        opener = doc.activeElement instanceof HTMLElement && doc.activeElement !== doc.body ? doc.activeElement : pointerOpener;
        ancestors = [];
        for (let node = opener?.parentElement; node; node = node.parentElement)
            ancestors.push(node);
        const stack = stacks.get(doc) ?? [];
        stacks.set(doc, stack);
        stack.push(dialog);
        releaseScroll = lockDocumentScroll(doc);
        dialog.showModal();
        const first = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).find(usable);
        let target: HTMLElement = dialog;
        if (props.initialFocusId) {
            const wanted = doc.getElementById(props.initialFocusId);
            if (wanted !== dialog && wanted !== first)
                throw new RangeError('initialFocusId must identify dialog or first interactive element');
            target = wanted!;
        }
        if (props.showCloseButton === false && !first)
            throw new TypeError('Modal requires an enabled close action');
        target.focus({ preventScroll: true });
    };
    createEffect(() => state.value(), sync);
    const mount = () => {
        if(disposed)return;
        const doc = dialog.ownerDocument;
        const capture = (event: MouseEvent) => {
            if (active || event.button !== 0)
                return;
            const target = event.target instanceof Element ? event.target.closest<HTMLElement>(focusableSelector) : null;
            if (usable(target))
                pointerOpener = target;
            setTimeout(() => {
                pointerOpener = undefined;
            }, 0);
        };
        doc.addEventListener('click', capture, true);
        sync(state.value());
        release=()=>doc.removeEventListener('click', capture, true);
    };
    onSettled(()=>()=>{disposed=true;release?.();close();});
    return <Portal mount={environment.getDocument?.()?.body}><dialog ref={el => {
            dialog = el;
            el.tabIndex = -1;
            onSettled(mount);
        }} id={id} role="dialog" aria-modal="true" aria-labelledby={props.titleId ?? `${id}-title`} aria-describedby={props.description != null ? props.descriptionId ?? `${id}-description` : undefined} dir={environment.direction ?? 'ltr'} {...part('modal', 'content', state.value() ? 'open' : 'closed')} onCancel={event => {
            event.preventDefault();
        }} onKeyDown={event => {
            if (!top() || event.defaultPrevented || event.isComposing || event.keyCode === 229)
                return;
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                request(false);
            }
            else if (event.key === 'Tab') {
                const nodes = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(usable);
                const first = nodes[0], last = nodes.at(-1);
                if (!first) {
                    event.preventDefault();
                    dialog.focus();
                }
                else if (event.shiftKey && (dialog.ownerDocument.activeElement === first || dialog.ownerDocument.activeElement === dialog)) {
                    event.preventDefault();
                    last?.focus();
                }
                else if (!event.shiftKey && (dialog.ownerDocument.activeElement === last || dialog.ownerDocument.activeElement === dialog)) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }} onPointerDown={event => {
            down = backdrop(event) && event.button === 0 && event.isPrimary;
        }} onPointerUp={event => {
            if (down && backdrop(event) && event.button === 0 && event.isPrimary && props.closeOnOutsideClick && top())
                request(false);
            down = false;
        }}>
 <div {...part('modal', 'body')}><h2 id={props.titleId ?? `${id}-title`} {...part('modal', 'title')}>{props.title}</h2>{props.description != null && <p id={props.descriptionId ?? `${id}-description`} {...part('modal', 'description')}>{props.description}</p>}<ParentDialog value={childLifetime}>
     {props.children}
     <div {...part('modal', 'actions')}>{props.actions}</div>
 </ParentDialog>{props.showCloseButton !== false && <button type="button" aria-label={props.closeLabel ?? ((props.locale ?? environment.locale ?? 'ko-KR') === 'ko-KR' ? '닫기' : 'Close')} {...part('modal', 'close')} onClick={() => request(false)}>×</button>}</div>
 </dialog></Portal>;
}
