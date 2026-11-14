import { booleanAttribute, afterEveryRender, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild, type OnDestroy, type OnInit, type OnChanges } from '@angular/core';
import { ControlMode, composing, focusables, KRDS_ENVIRONMENT, usable } from '../../internal/behavior';
import type { Button } from '../button/button';
import type { OpenChangeDetails } from '@unofficial-krds/contracts';
import {ModalLayer} from '../../internal/modal-stack';
@Component({ selector: 'krds-modal', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
    template: `@if (isOpen()) {
    <div #root data-krds-component="modal" data-krds-part="root" data-krds-state="open" [attr.dir]="environment.direction" [attr.lang]="environment.locale.slice(0, 2)" style="position:fixed;inset:0">
      <div #backdrop data-krds-component="modal" data-krds-part="backdrop" data-krds-state="open" (pointerdown)="outsideStart($event)" (pointerup)="outsideEnd($event)"></div>
      <div #content role="dialog" aria-modal="true" tabindex="-1" data-krds-component="modal" data-krds-part="content" data-krds-state="open" [id]="id" [attr.aria-labelledby]="id + '-title'" [attr.aria-describedby]="description ? id + '-description' : null">
        <h2 data-krds-component="modal" data-krds-part="title" [id]="id + '-title'">{{title}}</h2>
        @if (description) { <div data-krds-component="modal" data-krds-part="description" [id]="id + '-description'">{{description}}</div> }
        <div data-krds-component="modal" data-krds-part="body"><ng-content /></div>
        <div #actions data-krds-component="modal" data-krds-part="actions"><ng-content select="[krdsModalActions]" /></div>
        @if (showCloseButton) { <button type="button" data-krds-component="modal" data-krds-part="close" (click)="request(false)" [attr.aria-label]="closeLabel || (environment.locale === 'en-US' ? 'Close' : '닫기')"><span aria-hidden="true">×</span></button> }
      </div>
    </div>
  }`, host: { '[attr.id]': 'null' },
})
export class Modal implements OnInit, OnChanges, OnDestroy {
    @Input({ required: true })
    id = '';
    @Input({ required: true })
    title = '';
    @Input()
    description = '';
    @Input()
    open: boolean | undefined;
    @Input()
    defaultOpen: boolean | undefined;
    @Input({ transform: booleanAttribute })
    closeOnOutsideClick = false;
    @Input({ transform: booleanAttribute })
    showCloseButton = true;
    @Input()
    closeLabel = '';
    @Input()
    initialFocusId = '';
    @Input()
    returnFocusId = '';
    @Output()
    readonly openChange = new EventEmitter<OpenChangeDetails>();
    @ViewChild('backdrop')
    backdrop?: ElementRef<HTMLElement>;
    @ViewChild('content')
    content?: ElementRef<HTMLElement>;
    @ViewChild('root')
    root?: ElementRef<HTMLElement>;
    @ViewChild('actions')
    actions?: ElementRef<HTMLElement>;
    readonly environment = inject(KRDS_ENVIRONMENT);
    private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly local = signal(false);
    private readonly mode = new ControlMode();
    private initialized = false;
    private actual = false;
    private initialEntry = true;
    private opener: HTMLElement | null = null;
    private requestedOpener: HTMLElement | null = null;
    private requestedAncestors: HTMLElement[] = [];
    private ancestors: HTMLElement[] = [];
    private layer: ModalLayer | null = null;
    private portal: HTMLElement | null = null;
    private outsidePointer: number | null = null;
    private readonly key = (event: KeyboardEvent) => this.keydown(event);
    private readonly focus = (event: FocusEvent) => { if (this.top() && this.content && !this.content.nativeElement.contains(event.target as Node))
        this.content.nativeElement.focus(); };
    constructor() { afterEveryRender(() => this.sync()); }
    ngOnInit(): void { this.mode.check(this.open, this.defaultOpen); this.local.set(this.defaultOpen ?? false); this.initialized = true; }
    ngOnChanges(): void { if (this.initialized)
        this.mode.check(this.open, this.defaultOpen); }
    isOpen(): boolean { return this.open ?? this.local(); }
    openFrom(opener: HTMLElement | Button): void { if (!this.isOpen()) {
        const element = 'element' in opener ? opener.element : opener;
        this.requestedOpener = element;
        this.requestedAncestors = [];
        for (let parent = element.parentElement; parent; parent = parent.parentElement) this.requestedAncestors.push(parent);
        this.request(true);
    } }
    request(open: boolean): void { if (this.isOpen() === open)
        return; if (this.open === undefined)
        this.local.set(open); this.openChange.emit({ open }); }
    private top(): boolean { return this.layer?.isTop() ?? false; }
    private sync(): void {
        this.reconcileActions();
        if (this.isOpen() && !this.actual && this.content && this.root)
            this.enter();
        else if (!this.isOpen() && this.actual)
            this.leave();
        if (this.actual) { this.inheritTheme(); const active=this.environment.document.activeElement;if(this.top()&&(!usable(active)||!this.content?.nativeElement.contains(active)))this.content?.nativeElement.focus(); }
        else if (!this.isOpen()) { this.requestedOpener = null; this.requestedAncestors = []; }
        this.initialEntry = false;
    }
    /** The actions part exists only while actions are projected, like every other renderer's optional actions. */
    private reconcileActions(): void {
        const actions = this.actions?.nativeElement, content = this.content?.nativeElement;
        if (!actions || !content) return;
        const filled = Array.from(actions.childNodes).some(node => node.nodeType === 1 || node.nodeType === 3 && !!node.textContent?.trim());
        if (filled && actions.parentNode !== content) content.insertBefore(actions, content.querySelector(':scope > [data-krds-part="close"]'));
        else if (!filled && actions.parentNode) actions.parentNode.removeChild(actions);
    }
    private inheritTheme(): void {
        const style = this.environment.document.defaultView?.getComputedStyle(this.host.nativeElement);
        if (style && this.portal) for (const property of [...Array.from(style).filter(property=>property.startsWith("--krds-")),"font-family","font-size","font-weight","font-style","line-height","letter-spacing","color"]) this.portal.style.setProperty(property, style.getPropertyValue(property));
    }
    private enter(): void {
        const document = this.environment.document;
        const content = this.content!.nativeElement;
        const portal = this.root!.nativeElement;
        const active = document.activeElement as HTMLElement | null;
        // Keep the opening action's ancestry even if Angular removes its trigger before rendering the dialog.
        if (this.requestedOpener) {
            this.opener = this.requestedOpener;
            this.ancestors = this.requestedAncestors;
        } else {
            this.opener = !this.initialEntry && usable(active) && active !== document.body ? active : null;
            this.ancestors = [];
            for (let parent = this.opener?.parentElement; parent; parent = parent.parentElement) this.ancestors.push(parent);
        }
        this.requestedOpener = null;
        this.requestedAncestors = [];
        this.portal = portal;
        document.body.appendChild(portal);
        this.layer = new ModalLayer(document, portal, content, { handleKeys: false, focusGuard: false });
        this.layer.enter();
        document.addEventListener('keydown', this.key);
        document.addEventListener('focusin', this.focus);
        this.actual = true;
        const focusable = focusables(content);
        if (!this.showCloseButton && !focusable.some(element => element.matches('button, [role="button"]')))
            throw new TypeError('A modal requires an enabled close action.');
        const target = this.initialFocusId ? document.getElementById(this.initialFocusId) : content;
        if (target !== content && target !== focusable[0])
            throw new TypeError('initialFocusId must identify the dialog or first interactive element.');
        (target as HTMLElement).focus();
    }
    private leave(): void {
        const document = this.environment.document;
        document.removeEventListener('keydown', this.key);
        document.removeEventListener('focusin', this.focus);
        const result = this.layer?.leave(() => this.portal?.remove()) ?? { wasTop: false, remaining: false };
        this.layer = null;
        this.portal = null;
        this.actual = false;
        const wasTop = result.wasTop;
        if (!wasTop) { this.opener = null; this.ancestors = []; return; }
        const alternate = this.returnFocusId ? document.getElementById(this.returnFocusId) : null;
        const target = usable(this.opener) ? this.opener : usable(alternate) ? alternate : this.ancestors.find(element => usable(element) && element.matches('button, input, select, textarea, a[href], [tabindex]'));
        if (target) target.focus();
        else if (!result.remaining) {
            const previous = document.body.getAttribute('tabindex');
            document.body.tabIndex = -1;
            document.body.focus();
            if (previous === null) document.body.removeAttribute('tabindex');
            else document.body.setAttribute('tabindex', previous);
        }
        this.opener = null;
        this.ancestors = [];
    }

    private keydown(event: KeyboardEvent): void {
        if (!this.top() || event.defaultPrevented || composing(event))
            return;
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            this.request(false);
        }
        else if (event.key === 'Tab' && this.content) {
            const items = focusables(this.content.nativeElement);
            const active = this.environment.document.activeElement;
            if (!items.length) {
                event.preventDefault();
                this.content.nativeElement.focus();
            }
            else if (event.shiftKey && (active === items[0] || active === this.content.nativeElement)) {
                event.preventDefault();
                items.at(-1)!.focus();
            }
            else if (!event.shiftKey && (active === items.at(-1) || active === this.content.nativeElement)) {
                event.preventDefault();
                items[0].focus();
            }
        }
    }
    outsideStart(event: PointerEvent): void { this.outsidePointer = this.top() && event.button === 0 && event.target === event.currentTarget ? event.pointerId : null; }
    outsideEnd(event: PointerEvent): void { const allowed = this.outsidePointer === event.pointerId && event.target === event.currentTarget && event.button === 0; this.outsidePointer = null; if (allowed && this.closeOnOutsideClick)
        this.request(false); }
    ngOnDestroy(): void { if (this.actual)
        this.leave(); }
}
