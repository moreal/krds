import { afterEveryRender, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, signal, TemplateRef, ViewChild, type OnChanges, type OnInit } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import type { ValueChangeDetails } from '@unofficial-krds/contracts';
import { oneOf, composing, ControlMode, focusables, unique } from '../../internal/behavior';
export interface TabItem {
    value: string;
    label: string;
    disabled?: boolean;
    panel?: string | TemplateRef<unknown>;
}
@Component({ selector: 'krds-tabs', standalone: true, host: { '[attr.id]': 'null' }, imports: [NgTemplateOutlet], changeDetection: ChangeDetectionStrategy.OnPush,
    styles: ['[data-krds-component="tabs"][data-krds-part="list"] { padding: var(--krds-number-3); scroll-padding: var(--krds-number-3); }'],
    template: `<div #root data-krds-component="tabs" data-krds-part="root">
    <div role="tablist" data-krds-component="tabs" data-krds-part="list" [attr.aria-label]="label || null" [attr.aria-labelledby]="ariaLabelledby || null" [attr.aria-orientation]="orientation" [attr.data-krds-orientation]="orientation">
      @for (item of items; track item.value; let index = $index) {
        <button type="button" role="tab" data-krds-component="tabs" data-krds-part="trigger" [id]="tabId(index)" [attr.aria-controls]="panelId(index)" [attr.aria-selected]="current() === item.value" [disabled]="!!item.disabled" [tabIndex]="item.disabled ? -1 : 0" [attr.data-krds-state]="(current() === item.value ? 'selected ' : '') + (item.disabled ? 'disabled' : '')" (keydown)="navigate($event, index)" (pointerdown)="pointerStart()" (focus)="focused(item, $event)" (blur)="paired = null" (click)="clicked(item)">{{item.label}}</button>
      }
    </div>
    @for (item of items; track item.value; let index = $index) {
      <div role="tabpanel" data-krds-component="tabs" data-krds-part="panel" [id]="panelId(index)" [attr.aria-labelledby]="tabId(index)" [hidden]="current() !== item.value" [attr.data-krds-state]="current() === item.value ? 'active' : 'inactive'" tabindex="0">
        @if (template(item.panel); as panel) { <ng-container [ngTemplateOutlet]="panel" /> } @else { {{item.panel}} }
      </div>
    }
  </div>`,
})
export class Tabs implements OnInit, OnChanges {
    @Input({ required: true })
    id = '';
    @Input()
    items: readonly TabItem[] = [];
    @Input()
    label = '';
    @Input()
    ariaLabelledby = '';
    @Input()
    value: string | undefined;
    @Input()
    defaultValue: string | undefined;
    @Input()
    activationMode: 'manual' | 'automatic' = 'manual';
    @Input()
    orientation: 'horizontal' | 'vertical' = 'horizontal';
    @Output()
    readonly valueChange = new EventEmitter<ValueChangeDetails<string>>();
    @ViewChild('root')
    root?: ElementRef<HTMLElement>;
    readonly local = signal('');
    paired: string | null = null;
    private initialized = false;
    private pointerGesture = false;
    private pendingVisibility: HTMLElement | null = null;
    private readonly mode = new ControlMode();
    constructor() {
        afterEveryRender(() => {
            const root = this.root?.nativeElement;
            if (!root) return;
            for (const panel of root.querySelectorAll<HTMLElement>('[role="tabpanel"]')) {
                const firstContent = Array.from(panel.childNodes).find(node => node.nodeType === 1 || node.nodeType === 3 && !!node.textContent?.trim());
                panel.tabIndex = firstContent?.nodeType === 1 && focusables(panel).includes(firstContent as HTMLElement) ? -1 : 0;
            }
            // Keep the focused label visible after Angular has finished rendering the focus gesture.
            const focused = this.pendingVisibility;
            this.pendingVisibility = null;
            if (focused?.isConnected && root.ownerDocument.activeElement === focused) focused.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        });
    }
    ngOnInit(): void { this.mode.check(this.value, this.defaultValue); this.local.set(this.defaultValue ?? this.items.find(item => !item.disabled)?.value ?? ''); this.initialized = true; this.check(); }
    ngOnChanges(): void { if (this.initialized) {
        this.mode.check(this.value, this.defaultValue);
        this.check();
    } }
    private check(): void { oneOf(this.activationMode, ['manual', 'automatic'], 'activation mode'); oneOf(this.orientation, ['horizontal', 'vertical'], 'orientation'); unique(this.items.map(item => item.value)); if (this.items.some(item => !item.value))
        throw new TypeError('Tabs need nonempty values.'); if (this.current() ? !this.items.some(item => item.value === this.current() && !item.disabled) : this.items.some(item => !item.disabled))
        throw new TypeError('Invalid tab selection.'); }
    current(): string { return this.value ?? this.local(); }
    tabId(index: number): string { return `${this.id}-tab-${index}`; }
    panelId(index: number): string { return `${this.id}-panel-${index}`; }
    template(value: TabItem['panel']): TemplateRef<unknown> | null { return typeof value === 'object' ? value : null; }
    private select(item: TabItem): void { if (item.disabled || this.current() === item.value)
        return; if (this.value === undefined)
        this.local.set(item.value); this.valueChange.emit({ value: item.value }); }
    focused(item: TabItem, event?: FocusEvent): void {
        this.pendingVisibility = event?.currentTarget as HTMLElement | null; if (this.activationMode === 'automatic') {
        this.paired = this.pointerGesture ? item.value : null;
        this.select(item);
    } }
    pointerStart(): void { this.pointerGesture = true; this.paired = null; }
    clicked(item: TabItem): void { this.pointerGesture = false; if (this.paired === item.value) {
        this.paired = null;
        return;
    } this.select(item); }
    navigate(event: KeyboardEvent, index: number): void {
        this.pointerGesture = false;
        this.paired = null;
        if (composing(event))
            return;
        const enabled = this.items.map((item, i) => item.disabled ? -1 : i).filter(i => i >= 0);
        const previous = this.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
        const next = this.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
        let target: number | undefined;
        if (event.key === previous || event.key === next)
            target = enabled[(enabled.indexOf(index) + (event.key === next ? 1 : enabled.length - 1)) % enabled.length];
        else if (event.key === 'Home')
            target = enabled[0];
        else if (event.key === 'End')
            target = enabled.at(-1);
        if (target !== undefined) {
            event.preventDefault();
            this.root?.nativeElement.querySelector<HTMLElement>(`[id="${this.tabId(target)}"]`)?.focus();
        }
    }
}
