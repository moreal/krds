import { type PropertyValues, type PropertyDeclarations } from 'lit';
import { KrdsElement, effectivelyInert, unique } from './base.js';
import { FormControlController } from '../controllers/form-control-controller.js';
export function target(host: Element, id: string, boundary?: Document | ShadowRoot): HTMLElement | null {
    const root = boundary ?? host.getRootNode() as Document | ShadowRoot;
    const direct = root.getElementById?.(id) as HTMLElement | null;
    if (direct || !id) return direct ?? null;
    const matches: HTMLElement[] = [];
    const visit = (parent: ParentNode) => { for (const element of parent.querySelectorAll('*')) if (element.shadowRoot) { const found = element.shadowRoot.getElementById(id); if (found instanceof HTMLElement) matches.push(found); visit(element.shadowRoot); } };
    visit(root);
    return matches.length === 1 ? matches[0]! : null;
}
export function usable(element: HTMLElement | null): element is HTMLElement {
    return !!element && element.isConnected && !effectivelyInert(element) && !element.matches(':disabled,[hidden]') && !!element.getClientRects().length;
}
export function focusTarget(element: HTMLElement | null) {
    if (!usable(element))
        return false;
    const temporary = !element.hasAttribute('tabindex') && !element.matches('button,input,textarea,select,a[href]');
    if (temporary) {
        element.tabIndex = -1;
        element.addEventListener('blur', () => element.removeAttribute('tabindex'), { once: true });
    }
    element.focus({ preventScroll: true });
    element.scrollIntoView({ block: 'nearest' });
    return true;
}
/** New-window links always carry noopener/noreferrer alongside the host rel. */
export function safeRel(target?: string, rel?: string): string | undefined { return target === '_blank' ? [...new Set(`${rel ?? ''} noopener noreferrer`.trim().split(/\s+/))].join(' ') : rel || undefined; }
export function integer(value: number, min: number, max: number, name: string) {
    if (!Number.isInteger(value) || value < min || value > max)
        throw new RangeError(`Invalid ${name}`);
}
export function bounded(value: number, min: number, max: number, step: number) {
    if (![value, min, max, step].every(Number.isFinite) || max < min || step <= 0 || value < min || value > max || Math.abs((value - min) / step - Math.round((value - min) / step)) > 1e-7)
        throw new RangeError('Value must lie on the bounded step');
}
/** Shared FACE plumbing; each field owns its native template and state transitions. */
export abstract class FormElement extends KrdsElement {
    static override properties: PropertyDeclarations = { name: { type: String, reflect: true }, disabled: { type: Boolean, reflect: true }, required: { type: Boolean }, invalid: { type: Boolean }, hint: { type: String }, error: { type: String }, helpId: { type: String, attribute: 'help-id' }, errorId: { type: String, attribute: 'error-id' } };
    declare name: string;
    declare disabled: boolean;
    declare required: boolean;
    declare invalid: boolean;
    declare hint: string;
    declare error: string;
    declare helpId: string;
    declare errorId: string;
    readonly formControl = new FormControlController(this);
    constructor() { super(); this.name = ''; this.disabled = false; this.required = false; this.invalid = false; this.hint = ''; this.error = ''; this.helpId = ''; this.errorId = ''; }
    abstract resetControl(): void;
    abstract restoreControl(state: string | FormData | File | null): void;
    formResetCallback() { this.resetControl(); }
    formDisabledCallback(disabled: boolean) { this.formControl.disabledCallback(disabled); }
    formStateRestoreCallback(state: string | FormData | File | null) { this.restoreControl(state); }
    protected get descriptionIds() { return [this.hint ? this.helpId || 'hint' : this.helpId, this.error ? this.errorId || 'error' : this.errorId].filter(Boolean).join(' ') || undefined; }
    protected validateName() { if (!this.label && !this.explicitName)
        throw new TypeError('Field requires a label'); }
    protected sync(control: HTMLInputElement | HTMLTextAreaElement, value: string | FormData | null, state?: string) {
        this.formControl.setValue(value, state);
        const validity: ValidityStateFlags = {};
        if (control.willValidate && !this.formControl.disabled) for (const key of ['valueMissing', 'typeMismatch', 'patternMismatch', 'tooLong', 'tooShort', 'rangeUnderflow', 'rangeOverflow', 'stepMismatch', 'badInput', 'customError'] as const)
            if (control.validity[key])
                validity[key] = true;
        this.formControl.internals?.setValidity(validity, control.validationMessage, control);
        this.applyExplicitNaming(control);
        const references = [this.helpId, this.errorId].filter(Boolean).map(id => target(this, id)).filter((element): element is HTMLElement => !!element);
        if (references.length && 'ariaDescribedByElements' in control)
            control.ariaDescribedByElements = [...[...this.renderRoot.querySelectorAll<HTMLElement>('[id]')].filter(element => element.id === (this.helpId || 'hint') || element.id === (this.errorId || 'error')), ...references];
    }
    override updated(_changed: PropertyValues) { }
}

export interface NativeTreeItem { id: string; children?: readonly NativeTreeItem[]; }
export function validateTree(items: readonly NativeTreeItem[]) { const ids: string[] = []; const visit = (nodes: readonly NativeTreeItem[]) => { for (const node of nodes) { ids.push(node.id); if (node.children) visit(node.children); } }; visit(items); unique(ids); }
