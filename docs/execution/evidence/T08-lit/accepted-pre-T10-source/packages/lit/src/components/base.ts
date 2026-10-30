import { LitElement, unsafeCSS, type PropertyDeclarations } from 'lit';
import { shadowStyles } from '@unofficial-krds/styles/lit';
export class KrdsElement extends LitElement {
    static override styles = [unsafeCSS(shadowStyles.base), ...(['button', 'native-select', 'modal', 'tabs', 'calendar', 'date-input'] as const).map(name => unsafeCSS(shadowStyles[name])), unsafeCSS(':host{display:block;min-inline-size:0;max-inline-size:100%;color:var(--krds-color-text-primary,#1e2124);font-family:inherit} :host([hidden]){display:none} [hidden]{display:none!important} dialog::backdrop{background:var(--krds-color-light-alpha-black50)}')];
    static override properties: PropertyDeclarations = { locale: { type: String }, direction: { type: String, attribute: 'dir' }, label: { type: String }, labelReferences: { attribute: false } };
    declare locale: 'ko-KR' | 'en-US';
    declare direction: 'ltr' | 'rtl';
    declare label: string;
    declare labelReferences: Readonly<Record<string, string>>;
    private labelObserver?: MutationObserver;
    private namedSemantics = new WeakSet<Element>();
    constructor() { super(); this.locale = 'ko-KR'; this.direction = 'ltr'; this.label = ''; this.labelReferences = {}; }
    static override get observedAttributes() { return [...new Set([...super.observedAttributes, 'aria-label', 'aria-labelledby'])]; }
    override attributeChangedCallback(name: string, old: string | null, value: string | null) {
        super.attributeChangedCallback(name, old, value);
        if (name === 'aria-label' || name === 'aria-labelledby') this.requestUpdate();
    }
    private get namingIds(): string[] {
        return this.getAttribute('aria-labelledby')?.trim().split(/\s+/).filter(Boolean) ?? [];
    }
    private get namingElements(): Element[] {
        const root = this.getRootNode?.() as Document | ShadowRoot | undefined;
        return this.namingIds.map(id => root?.getElementById?.(id)).filter((element): element is HTMLElement => !!element);
    }
    /** Plain labels are a fallback; native element-reference ARIA computes browser names. */
    protected get explicitName(): string | undefined {
        const ids = this.namingIds;
        if (this.hasAttribute('aria-labelledby')) {
            if (!ids.length) throw new TypeError('aria-labelledby requires nonempty references');
            const root = this.getRootNode?.() as Document | ShadowRoot | undefined;
            const names = ids.map(id => {
                if (root?.getElementById) {
                    const element = root.getElementById(id);
                    if (!element) throw new TypeError(`Missing naming reference: ${id}`);
                    return element.getAttribute('aria-label')?.trim() || element.textContent?.trim() || '';
                }
                return this.labelReferences[id]?.trim() ?? '';
            });
            if (names.some(name => !name)) throw new TypeError('Naming references require nonempty plain label text; SSR requires labelReferences');
            return names.join(' ');
        }
        const label = this.getAttribute('aria-label');
        if (label !== null && !label.trim()) throw new TypeError('aria-label cannot be empty');
        return label ?? undefined;
    }
    protected applyExplicitNaming(element: Element): void {
        if (!('ariaLabelledByElements' in element)) return;
        const references = this.namingElements;
        if (references.length) {
            element.ariaLabelledByElements = references;
            this.namedSemantics.add(element);
        } else if (this.namedSemantics.has(element)) {
            const internalReference = element.getAttribute('aria-labelledby');
            element.ariaLabelledByElements = null;
            if (internalReference !== null) element.setAttribute('aria-labelledby', internalReference);
            this.namedSemantics.delete(element);
        }
    }
    override connectedCallback(): void {
        super.connectedCallback();
        const root = this.getRootNode();
        this.labelObserver = new MutationObserver(records => {
            if (!this.namingIds.length) return;
            const elements = this.namingElements;
            if (records.some(record => elements.some(element => element === record.target || element.contains(record.target)) || record.type === 'childList')) this.requestUpdate();
        });
        this.labelObserver.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label'] });
    }
    override disconnectedCallback(): void {
        this.labelObserver?.disconnect();
        this.labelObserver = undefined;
        super.disconnectedCallback();
    }
    protected emit(name: string, detail: unknown) { this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true })); }
    protected named(part: string, component: string, state = '') { return { 'data-krds-component': component, 'data-krds-part': part, 'data-krds-state': state, part }; }
}
export class ValueState<T> {
    private initialized = false;
    private controlled = false;
    private local!: T;
    initial!: T;
    read(value: T | undefined, defaultValue: T | undefined, fallback: () => T): T {
        if (!this.initialized) {
            this.controlled = value !== undefined;
            if (this.controlled && defaultValue !== undefined)
                throw new TypeError('Cannot combine value and defaultValue');
            this.local = defaultValue !== undefined ? defaultValue : fallback();
            this.initial = structuredClone(this.local);
            this.initialized = true;
        }
        if ((value !== undefined) !== this.controlled)
            throw new TypeError('Cannot change controlled mode');
        return this.controlled ? value! : this.local;
    }
    set(value: T) { if (!this.controlled)
        this.local = structuredClone(value); }
    reset() { this.local = this.initial; }
}
export function unique(values: readonly string[], allowEmpty = false) { if (new Set(values).size !== values.length || values.some(value => typeof value !== 'string' || (!allowEmpty && !value.trim())))
    throw new TypeError('Expected unique item values'); }
export function deepActive(document: Document): Element | null { let active = document.activeElement; while (active?.shadowRoot?.activeElement)
    active = active.shadowRoot.activeElement; return active; }
export const focusable = 'button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex]:not([tabindex="-1"])';
/** Logical focus order includes nested open shadow roots and assigned slots. */
export function shadowFocusables(root: ParentNode): HTMLElement[] {
    const result: HTMLElement[] = [];
    for (const element of root.children) {
        if (!(element instanceof HTMLElement) || element.hidden || element.inert)
            continue;
        if (element.matches(focusable) && element.getClientRects().length)
            result.push(element);
        if (element instanceof HTMLSlotElement) {
            for (const assigned of element.assignedElements({ flatten: true })) {
                if (assigned instanceof HTMLElement && assigned.matches(focusable) && assigned.getClientRects().length)
                    result.push(assigned);
                result.push(...shadowFocusables(assigned));
            }
        }
        else
            result.push(...shadowFocusables(element.shadowRoot ?? element));
    }
    return result;
}

/** Composed ancestry includes slot assignment and enclosing shadow hosts. */
export function composedParent(element: Element): Element | null {
    if (element.assignedSlot) return element.assignedSlot;
    if (element.parentElement) return element.parentElement;
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root.host : null;
}
export function effectivelyInert(element: Element): boolean {
    let current: Element | null = element;
    while (current) {
        if (current.hasAttribute('inert')) return true;
        current = composedParent(current);
    }
    return false;
}
