import { LitElement, unsafeCSS, type PropertyDeclarations } from 'lit';
import { shadowStyles } from '@unofficial-krds/styles/lit';
export class KrdsElement extends LitElement {
    static override styles = [unsafeCSS(shadowStyles.base), ...(['button', 'native-select', 'modal', 'tabs', 'calendar', 'date-input'] as const).map(name => unsafeCSS(shadowStyles[name])), unsafeCSS(':host{display:block;min-inline-size:0;max-inline-size:100%;color:var(--krds-color-text-primary,#1e2124);font-family:inherit} :host([hidden]){display:none} [hidden]{display:none!important} dialog::backdrop{background:var(--krds-color-light-alpha-black50)}')];
    static override properties: PropertyDeclarations = { locale: { type: String }, direction: { type: String, attribute: 'dir' }, label: { type: String } };
    declare locale: 'ko-KR' | 'en-US';
    declare direction: 'ltr' | 'rtl';
    declare label: string;
    constructor() { super(); this.locale = 'ko-KR'; this.direction = 'ltr'; this.label = ''; }
    static override get observedAttributes() { return [...new Set([...super.observedAttributes, 'aria-label', 'aria-labelledby'])]; }
    override attributeChangedCallback(name: string, old: string | null, value: string | null) {
        super.attributeChangedCallback(name, old, value);
        if (name === 'aria-label' || name === 'aria-labelledby') this.requestUpdate();
    }
    /** Resolve host naming references into a same-root plain-text control name. */
    protected get explicitName(): string | undefined {
        const references = this.getAttribute('aria-labelledby')?.trim().split(/\s+/).filter(Boolean);
        if (references?.length) {
            const root = this.getRootNode() as Document | ShadowRoot;
            const name = references.map(id => root.getElementById?.(id)?.textContent?.trim() ?? '').filter(Boolean).join(' ');
            if (name) return name;
        }
        return this.getAttribute('aria-label') ?? undefined;
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
