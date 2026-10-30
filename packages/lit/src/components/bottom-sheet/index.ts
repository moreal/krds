import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KrdsElement, ValueState } from '../base.js';
import { target } from '../catalog-support.js';
import { SurfaceController } from '../../controllers/surface-controller.js';
export class BottomSheet extends KrdsElement {
    static override properties = { open: { type: Boolean }, defaultOpen: { type: Boolean, attribute: 'default-open' }, title: { type: String }, description: { type: String }, initialFocusId: { type: String, attribute: 'initial-focus-id' }, returnFocusId: { type: String, attribute: 'return-focus-id' }, dismissOnOutside: { type: Boolean, attribute: 'dismiss-on-outside' }, body: { attribute: false } };
    declare open: boolean | undefined;
    declare defaultOpen: boolean | undefined;
    declare description: string;
    declare initialFocusId: string;
    declare returnFocusId: string;
    declare dismissOnOutside: boolean;
    declare body: unknown;
    private state = new ValueState<boolean>();
    private pointerStart = 0;
    readonly surface = new SurfaceController(this, { open: () => this.committedOpen, modal: () => true, onClose: () => this.close('escape'), fallback: () => target(this, this.returnFocusId), initialFocus: () => this.initialFocusId ? this.renderRoot.querySelector<HTMLElement>(`#${CSS.escape(this.initialFocusId)}`) ?? target(this, this.initialFocusId) : undefined });
    constructor() { super(); this.description = ''; this.initialFocusId = ''; this.returnFocusId = ''; this.dismissOnOutside = false; this.body = ''; }
    get committedOpen() { return this.state.read(this.open, this.defaultOpen, () => false); }
    private close(reason: 'close' | 'escape' | 'outside' | 'drag') { if (!this.committedOpen)
        return; this.state.set(false); this.emit('open-change', { open: false, reason }); this.requestUpdate(); if (!this.committedOpen)
        this.emit('cancel', {}); }
    override render() { if (!this.title)
        throw new TypeError('Bottom sheet requires title'); return html `<div data-krds-component="bottom-sheet" data-krds-part="root" data-krds-state=${this.committedOpen ? 'open' : 'closed'} part="root"><dialog id="dialog" data-krds-component="bottom-sheet" data-krds-part="content" data-krds-state=${this.committedOpen ? 'open' : 'closed'} part="content" aria-labelledby="title" aria-describedby=${ifDefined(this.description ? 'description' : undefined)} tabindex="-1" style="margin-block-start:auto;max-block-size:90dvh;overflow:auto" @click=${(event: MouseEvent) => { if (event.target === event.currentTarget && this.dismissOnOutside) {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        if (event.clientY < rect.top || event.clientX < rect.left || event.clientX > rect.right)
            this.close('outside');
    } }}><div data-krds-component="bottom-sheet" data-krds-part="handle" data-krds-state="" part="handle" aria-hidden="true" style="touch-action:none" @pointerdown=${(event: PointerEvent) => { this.pointerStart = event.clientY; (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId); }} @pointerup=${(event: PointerEvent) => { if (event.clientY - this.pointerStart > 80)
        this.close('drag'); }}>―</div><button id="close" data-krds-component="bottom-sheet" data-krds-part="close" data-krds-state="" part="close" type="button" @click=${() => this.close('close')}>닫기</button><h2 id="title" data-krds-component="bottom-sheet" data-krds-part="title" data-krds-state="" part="title">${this.title}</h2>${this.description ? html `<p id="description">${this.description}</p>` : ''}${this.body}<slot></slot></dialog></div>`; }
}
