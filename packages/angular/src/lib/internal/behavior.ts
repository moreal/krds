import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject, type Provider } from '@angular/core';
import { parseIsoDate, type DateRangeValue } from '@unofficial-krds/contracts';
export type Locale = 'ko-KR' | 'en-US';
export type DateValue = string | null | DateRangeValue;
export interface KrdsEnvironment {
    locale: Locale;
    direction: 'ltr' | 'rtl';
    document: Document;
}
export const KRDS_ENVIRONMENT = new InjectionToken<KrdsEnvironment>('KRDS environment', {
    providedIn: 'root', factory: () => ({ locale: 'ko-KR', direction: 'ltr', document: inject(DOCUMENT) }),
});
export function provideKrds(options: Partial<KrdsEnvironment> = {}): Provider {
    return { provide: KRDS_ENVIRONMENT, useFactory: () => ({ locale: 'ko-KR', direction: 'ltr', document: inject(DOCUMENT), ...options }) };
}
export function oneOf(value: unknown, choices: readonly unknown[], name: string): void {
    if (!choices.includes(value)) throw new TypeError(`Invalid ${name}.`);
}
export function same(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    return typeof a === 'object' && a !== null && typeof b === 'object' && b !== null &&
        'start' in a && 'end' in a && 'start' in b && 'end' in b && a.start === b.start && a.end === b.end;
}
export function composing(event: KeyboardEvent): boolean { return event.isComposing || event.keyCode === 229; }
export function unique(values: string[]): void {
    if (new Set(values).size !== values.length)
        throw new TypeError('Item values must be unique.');
}
export class ControlMode {
    private controlled?: boolean;
    check(value: unknown, initial: unknown): void {
        const next = value !== undefined;
        if (next && initial !== undefined)
            throw new TypeError('value and defaultValue cannot be combined.');
        if (this.controlled !== undefined && next !== this.controlled)
            throw new TypeError('Controlled mode cannot change.');
        this.controlled = next;
    }
}
export function emptyDate(mode: 'single' | 'range'): DateValue { return mode === 'single' ? null : { start: null, end: null }; }
export function dateFields(value: DateValue): [
    string,
    string
] {
    return typeof value === 'object' && value !== null ? [value.start ?? '', value.end ?? ''] : [value ?? '', ''];
}
export function checkBounds(min?: string, max?: string, reference = '2000-01-01', today?: string): void {
    for (const value of [min, max, reference, today])
        if (value !== undefined && !parseIsoDate(value))
            throw new RangeError('Expected strict YYYY-MM-DD.');
    if (min && max && min > max)
        throw new RangeError('min exceeds max.');
}
export function checkDate(value: DateValue, mode: 'single' | 'range', min?: string, max?: string, partial = false): void {
    if (mode === 'single' ? value !== null && typeof value !== 'string' : !value || typeof value !== 'object' || !('start' in value) || !('end' in value))
        throw new TypeError('Date value does not match mode.');
    if (mode === 'range') {
        const range = value as DateRangeValue;
        if ([range.start, range.end].some(endpoint => endpoint !== null && typeof endpoint !== 'string')) throw new TypeError('Range endpoints must be strings or null.');
    }
    const dates = mode === 'single' ? [value as string | null] : [(value as DateRangeValue).start, (value as DateRangeValue).end];
    for (const date of dates) {
        if (date !== null && (!parseIsoDate(date) || min && date < min || max && date > max))
            throw new RangeError('Invalid or out-of-bounds date.');
    }
    if (mode === 'range') {
        const { start, end } = value as DateRangeValue;
        if (!partial && (start !== null) !== (end !== null) || start !== null && end !== null && start > end)
            throw new RangeError('A committed range must be complete and ordered.');
    }
}
export const focusSelector = 'button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
export function usable(element: Element | null): element is HTMLElement {
    if (!element || !element.isConnected || element.closest('[inert], [hidden]') || element.matches(':disabled') || !element.matches('button, input:not([type="hidden"]), select, textarea, a[href], [tabindex], [contenteditable="true"]')) return false;
    const style = element.ownerDocument.defaultView?.getComputedStyle(element);
    return style?.visibility !== 'hidden' && style?.visibility !== 'collapse' && (element as HTMLElement).getClientRects().length > 0;
}
export function focusables(root: HTMLElement): HTMLElement[] { return [...root.querySelectorAll<HTMLElement>(focusSelector)].filter(usable); }
