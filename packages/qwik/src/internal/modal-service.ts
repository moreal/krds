/** Browser resources are constructed only after resume, never included in q:json. */
const selector = 'a[href],area[href],button,input:not([type="hidden"]),select,textarea,[tabindex],[contenteditable="true"]';
export function usable(element: Element | null | undefined): element is HTMLElement {
    if (!element || !('focus' in element) || !element.isConnected || element.closest('[hidden],[inert]') || element.matches(':disabled,[aria-disabled="true"]'))
        return false;
    const style = element.ownerDocument.defaultView?.getComputedStyle(element);
    return style?.display !== 'none' && style?.visibility !== 'hidden' && element.getClientRects().length > 0 && element.matches(selector);
}
const focusables = (root: HTMLElement) => Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(element => usable(element) && element.tabIndex >= 0);
interface Entry {
    root: HTMLElement;
    content: HTMLElement;
}
interface DocumentState {
    entries: Entry[];
    inert: Map<HTMLElement, string | null>;
    overflow: string;
    priority: string;
    observer?: MutationObserver;
}
const documents = new WeakMap<Document, DocumentState>();
const disposalCallbacks=new WeakMap<HTMLElement,Set<()=>void>>();
/** Notify composition return owners only after this shell releases actual isolation. */
export function afterLayerDisposal(root:HTMLElement|undefined,callback:()=>void,descendants=false){const state=root?documents.get(root.ownerDocument):undefined,owner=state?.entries.find(entry=>entry.root===root||!!root?.id&&entry.root.id===root.id),anchor=owner?.root??root,active=descendants?[...state?.entries??[]].reverse().find(entry=>entry.root===anchor||!!anchor?.contains(entry.root)):owner;if(!active){callback();return;}const actual=active.root;let callbacks=disposalCallbacks.get(actual);if(!callbacks){callbacks=new Set();disposalCallbacks.set(actual,callbacks);}callbacks.add(descendants?()=>afterLayerDisposal(anchor,callback,true):callback);}

function isolate(doc: Document, state: DocumentState) {
    for (const [element, attribute] of state.inert) {
        if (attribute === null)
            element.removeAttribute('inert');
        else
            element.setAttribute('inert', attribute);
    }
    state.inert.clear();
    let branch: HTMLElement | null = state.entries.at(-1)?.root ?? null;
    // A previously closed nested dialog may have been isolated while its own inert bit was true.
    // The actual active top layer must not inherit that stale closed-state snapshot.
    if(branch)branch.inert=false;
    while (branch?.parentElement) {
        for (const sibling of branch.parentElement.children) {
            if (sibling === branch || !('inert' in sibling))
                continue;
            const element = sibling as HTMLElement;
            state.inert.set(element, element.getAttribute('inert'));
            element.inert = true;
        }
        if (branch.parentElement === doc.body)
            break;
        branch = branch.parentElement;
    }
}
/** Shared activation-order stack. Compositions own their distinct return policy. */
export function topModal(doc:Document):HTMLElement|undefined { return documents.get(doc)?.entries.at(-1)?.content; }
export function registerModalLayer(root:HTMLElement,content:HTMLElement){
 const doc=root.ownerDocument;let state=documents.get(doc);
 if(!state){state={entries:[],inert:new Map(),overflow:'',priority:''};documents.set(doc,state);}
 if(!state.entries.length){state.overflow=doc.body.style.getPropertyValue('overflow');state.priority=doc.body.style.getPropertyPriority('overflow');doc.body.style.setProperty('overflow','hidden');state.observer=new MutationObserver(()=>isolate(doc,state!));state.observer.observe(doc.body,{childList:true,subtree:true});}
 const entry={root,content};state.entries.push(entry);root.style.zIndex=String(1000+state.entries.length);isolate(doc,state);
 const top=()=>state!.entries.at(-1)===entry;
 return {top,dispose:()=>{const index=state!.entries.indexOf(entry);if(index<0)return;state!.entries.splice(index,1);isolate(doc,state!);if(!state!.entries.length){state!.observer?.disconnect();if(state!.overflow)doc.body.style.setProperty('overflow',state!.overflow,state!.priority);else doc.body.style.removeProperty('overflow');}const callbacks=disposalCallbacks.get(root);disposalCallbacks.delete(root);for(const callback of callbacks??[])callback();}};
}
export function startModal(root: HTMLElement, options: {
    initial: boolean;
    initialFocusId?: string;
    returnFocusId?: string;
    showCloseButton?: boolean;
    closeOnOutsideClick?: boolean;
    requestClose: () => Promise<unknown>;
}) {
    const doc = root.ownerDocument, content = root.querySelector<HTMLElement>('[data-krds-part="content"]')!, backdrop = root.querySelector<HTMLElement>('[data-krds-part="backdrop"]')!;
    const pointerKey = Symbol.for('unofficial-krds.modal-pointer');
    const transient = doc as unknown as Record<symbol, WeakRef<HTMLElement> | undefined>;
    const pointerElement = transient[pointerKey]?.deref();
    delete transient[pointerKey];
    const active = doc.activeElement;
    const opener = options.initial ? undefined : usable(pointerElement) && !root.contains(pointerElement) ? pointerElement : active !== doc.body && usable(active) ? active : undefined;
    const ancestors: HTMLElement[] = [];
    let ancestor = opener?.parentElement;
    while (ancestor && ancestor !== doc.body) {
        ancestors.push(ancestor);
        ancestor = ancestor.parentElement;
    }
    const first = focusables(content)[0], requested = options.initialFocusId ? doc.getElementById(options.initialFocusId) : content;
    if (requested !== content && requested !== first)
        throw new TypeError('initialFocusId must identify the dialog or first interactive element');
    if (options.showCloseButton === false && !focusables(content).some(element => element.matches('button,[role="button"]')))
        throw new TypeError('Modal requires an enabled close action');
    const layer = registerModalLayer(root, content);
    const top = layer.top;
    (requested as HTMLElement).focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
        if (!top() || event.defaultPrevented || event.isComposing || event.keyCode === 229)
            return;
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            void options.requestClose();
        }
        else if (event.key === 'Tab') {
            const items = focusables(content);
            const index = items.indexOf(doc.activeElement as HTMLElement);
            event.preventDefault();
            if (!items.length)
                content.focus();
            else
                items[index < 0 ? event.shiftKey ? items.length - 1 : 0 : (index + (event.shiftKey ? -1 : 1) + items.length) % items.length].focus();
        }
    };
    const focusin = (event: FocusEvent) => {
        if (top() && !content.contains(event.target as Node))
            content.focus({ preventScroll: true });
    };
    // Disabling/removing the active descendant can blur to body without a focusin event.
    // Observe only this owned dialog and recover only while it remains the top open modal.
    const focusObserver = new MutationObserver(() => {
        const active = doc.activeElement;
        if (top() && usable(content) && (!content.contains(active) || !usable(active)))
            content.focus({ preventScroll: true });
    });
    focusObserver.observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'hidden', 'inert', 'aria-hidden', 'tabindex'] });
    let pointer: number | undefined;
    const clear = () => { pointer = undefined; };
    const down = (event: PointerEvent) => { pointer = top() && event.target === backdrop && event.button === 0 && event.isPrimary ? event.pointerId : undefined; };
    const up = (event: PointerEvent) => {
        const allowed = pointer === event.pointerId && event.target === backdrop && event.button === 0 && event.isPrimary;
        clear();
        if (allowed && options.closeOnOutsideClick && top())
            void options.requestClose();
    };
    doc.addEventListener('keydown', keydown);
    doc.addEventListener('focusin', focusin);
    doc.addEventListener('pointerdown', down, true);
    doc.addEventListener('pointerup', up, true);
    doc.addEventListener('pointercancel', clear, true);
    doc.defaultView?.addEventListener('blur', clear);
    return { dispose: () => {
            focusObserver.disconnect();
            doc.removeEventListener('keydown', keydown);
            doc.removeEventListener('focusin', focusin);
            doc.removeEventListener('pointerdown', down, true);
            doc.removeEventListener('pointerup', up, true);
            doc.removeEventListener('pointercancel', clear, true);
            doc.defaultView?.removeEventListener('blur', clear);
            const wasTop = top();
            layer.dispose();
            if (!wasTop)
                return;
            const alternate = options.returnFocusId ? doc.getElementById(options.returnFocusId) : null;
            const target = usable(opener) ? opener : usable(alternate) ? alternate : ancestors.find(usable);
            if (target) {
                target.focus({ preventScroll: true });
                return;
            }
            const parent = topModal(doc);
            if (parent) {
                parent.focus({ preventScroll: true });
                return;
            }
            const previous = doc.body.getAttribute('tabindex');
            doc.body.tabIndex = -1;
            doc.body.focus({ preventScroll: true });
            if (previous === null)
                doc.body.removeAttribute('tabindex');
            else
                doc.body.setAttribute('tabindex', previous);
        } };
}
