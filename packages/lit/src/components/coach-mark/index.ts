import { html, render as renderNative } from 'lit';
import type { CoachMarkStep, CoachMarkBoundary, CoachMarkContract, TutorialStopDetails } from '@unofficial-krds/contracts';
import { shadowStyles } from '@unofficial-krds/styles/lit';
import { KrdsElement, ValueState, unique, composedParent } from '../base.js';
import { target, usable } from '../catalog-support.js';
import { restoreModalAware } from '../../controllers/surface-controller.js';
const presentations = new WeakMap<Document, CoachMark>();
/** Adjacent native insertion preserves the actual host target, its input state and IME. */
export class CoachMark extends KrdsElement {
    static override properties = { open: { type: Boolean }, defaultOpen: { type: Boolean, attribute: 'default-open' }, steps: { attribute: false }, boundaries: { attribute: false }, stepId: { type: String, attribute: 'step-id' }, defaultStepId: { type: String, attribute: 'default-step-id' }, onTargetAction: { attribute: false }, startActionId: { type: String, attribute: 'start-action-id' }, fallbackFocusId: { type: String, attribute: 'fallback-focus-id' }, waiting: { state: true }, missing: { state: true }, linked: { type: Boolean }, verificationFailed: { state: true } };
    declare open: boolean | undefined;
    declare defaultOpen: boolean | undefined;
    declare steps: readonly CoachMarkStep[];
    declare boundaries: readonly CoachMarkBoundary[];
    declare stepId: string | undefined;
    declare defaultStepId: string | undefined;
    declare onTargetAction: CoachMarkContract['onTargetAction'];
    declare startActionId: string;
    declare fallbackFocusId: string;
    declare private waiting: boolean;
    declare private missing: boolean;
    declare linked: boolean;
    declare private verificationFailed: boolean;
    private presentStepId = '';
    private focusStepId: string | null = null;
    private openState = new ValueState<boolean>();
    private stepState = new ValueState<string>();
    private boundary: HTMLElement | null = null;
    private nativeTarget: HTMLElement | null = null;
    private observer?: MutationObserver;
    private generation = 0;
    private pendingStop = false;
    constructor() { super(); this.steps = []; this.boundaries = []; this.startActionId = ''; this.fallbackFocusId = ''; this.waiting = false; this.missing = false; this.linked = false; this.verificationFailed = false; }
    get committedOpen() { return this.openState.read(this.open, this.defaultOpen, () => false); }
    get committedStep() { const id = this.stepState.read(this.stepId, this.defaultStepId, () => this.steps[0]?.id ?? ''); const step = this.steps.find(step => step.id === id); if (!step)
        throw new TypeError('Coach mark requires a valid step'); return step; }
    private route = () => { this.generation++; this.waiting = false; this.verificationFailed = false; this.stop('route-change'); this.requestUpdate(); };
    private resize = () => this.position();
    override connectedCallback() { super.connectedCallback(); this.ownerDocument.defaultView!.addEventListener('popstate', this.route); this.ownerDocument.defaultView!.addEventListener('resize', this.resize); this.ownerDocument.addEventListener('scroll', this.resize, true); this.observer = new MutationObserver(() => { if (this.committedOpen && this.nativeTarget && !this.nativeTarget.isConnected) {
        this.clear();
        this.missing = true;
        this.requestUpdate();
    } else if (this.committedOpen && this.missing && target(this, this.committedStep.targetId)) this.requestUpdate(); }); this.observer.observe(this.getRootNode(), { childList: true, subtree: true }); }
    override disconnectedCallback() { this.observer?.disconnect(); this.ownerDocument.defaultView?.removeEventListener('popstate', this.route); this.ownerDocument.defaultView?.removeEventListener('resize', this.resize); this.ownerDocument.removeEventListener('scroll', this.resize, true); const wasOpen = this.committedOpen; this.clear(); if (wasOpen) {
        restoreModalAware(this, [target(this, this.fallbackFocusId)]);
    } super.disconnectedCallback(); }
    private stopDetails(reason: TutorialStopDetails['reason']): TutorialStopDetails { return { reason, running: false, returnTo: { panel: 'tutorial', open: true, startActionId: this.startActionId } }; }
    start() { if (this.committedOpen)
        return; this.focusStepId = this.committedStep.id; this.openState.set(true); this.emit('open-change', { open: true }); this.requestUpdate(); }
    stop(reason: TutorialStopDetails['reason'] = 'stop') { if (!this.committedOpen || this.pendingStop)
        return; this.pendingStop = true; this.openState.set(false); if (this.linked)
        this.emit('stop', this.stopDetails(reason));
    else
        this.emit('open-change', { open: false }); this.requestUpdate(); }
    private clear() { this.generation++; this.nativeTarget?.removeEventListener('click', this.targetAction); if (this.boundary)
        renderNative(html ``, this.boundary, { host: this }); this.boundary = null; this.nativeTarget = null; this.presentStepId = ''; this.waiting = false; if (presentations.get(this.ownerDocument) === this)
        presentations.delete(this.ownerDocument); }
    private change(index: number, reason: 'previous' | 'next' | 'target-action') { const next = this.steps[index]; if (!next || next.id === this.committedStep.id)
        return; this.focusStepId = next.id; this.stepState.set(next.id); this.emit('step-change', { id: next.id, reason }); this.requestUpdate(); }
    private targetAction = async (event: Event) => {
        const step = this.committedStep;
        if (!step.requiresAction || this.waiting || event.defaultPrevented || !event.isTrusted || event.currentTarget !== this.nativeTarget)
            return;
        if (!this.onTargetAction) {
            this.emit('target-action-unavailable', { stepId: step.id, targetId: step.targetId });
            return;
        }
        const generation = this.generation;
        this.waiting = true;
        this.requestUpdate();
        try {
            await Promise.resolve();
            if (generation !== this.generation || !this.isConnected || !this.committedOpen)
                return;
            const accepted = await this.onTargetAction({ stepId: step.id, targetId: step.targetId });
            if (!this.isConnected || generation !== this.generation || !this.committedOpen || this.committedStep.id !== step.id)
                return;
            if (accepted === true) {
                const index = this.steps.findIndex(item => item.id === step.id);
                if (index === this.steps.length - 1)
                    this.stop('finish');
                else
                    this.change(index + 1, 'target-action');
            }
        }
        catch {
            if (generation === this.generation)
                this.verificationFailed = true;
        }
        finally {
            if (generation === this.generation) {
                this.waiting = false;
                this.requestUpdate();
            }
        }
    };
    override updated() {
        if (!this.committedOpen) {
            const restore = this.pendingStop;
            this.pendingStop = false;
            this.clear();
            if (restore) {
                this.emit('return-request', { panel: 'tutorial', open: true, startActionId: this.startActionId });
                if (!this.linked) queueMicrotask(() => restoreModalAware(this, [target(this, this.startActionId), target(this, this.fallbackFocusId)]));
            }
            return;
        }
        this.pendingStop = false;
        const owner = presentations.get(this.ownerDocument);
        if (owner && owner !== this)
            throw new TypeError('Only one coach presentation may be active');
        const step = this.committedStep;
        const nativeTarget = target(this, step.targetId);
        const boundaryId = this.boundaries.find(boundary => boundary.targetId === step.targetId)?.insertionBoundaryId;
        const boundary = boundaryId ? target(this, boundaryId) : null;
        if (!usable(nativeTarget) || !boundary) {
            if (!this.missing || this.boundary !== boundary) this.clear();
            if (!this.missing) { this.missing = true; this.emit('target-missing', { id: step.targetId }); }
            if (boundary) { const changedBoundary = this.boundary !== boundary; this.boundary = boundary; renderNative(this.recovery(), boundary, { host: this }); if (changedBoundary) this.requestUpdate(); }
            return;
        }
        if (nativeTarget.nextElementSibling !== boundary)
            throw new TypeError('Coach insertion boundary must immediately follow the real target');
        if (this.nativeTarget !== nativeTarget || this.boundary !== boundary || this.presentStepId !== step.id) {
            this.clear();
            this.nativeTarget = nativeTarget;
            this.boundary = boundary;
            this.presentStepId = step.id;
            this.verificationFailed = false;
            nativeTarget.addEventListener('click', this.targetAction);
            nativeTarget.scrollIntoView({ block: 'nearest' });
        }
        this.missing = false;
        presentations.set(this.ownerDocument, this);
        const index = this.steps.findIndex(item => item.id === step.id);
        renderNative(html `<style>${shadowStyles.all}</style><div data-krds-component="coach-mark" data-krds-part="root" data-krds-state=${`open current-step ${this.waiting ? 'waiting' : ''}`} part="root"><section data-krds-component="coach-mark" data-krds-part="popover" data-krds-state=${`open current-step ${this.waiting ? 'waiting' : ''}`} part="popover" role="region" aria-label=${step.title} @keydown=${(event: KeyboardEvent) => { if (event.key === 'Escape' && !event.isComposing)
            this.stop(); }}><h3 data-krds-component="coach-mark" data-krds-part="title" data-krds-state="" part="title" tabindex="-1">${step.title}</h3><p data-krds-component="coach-mark" data-krds-part="instruction" data-krds-state="" part="instruction">${step.instruction}</p><span data-krds-component="coach-mark" data-krds-part="position" data-krds-state="" part="position">${index + 1} / ${this.steps.length}</span>${index > 0 ? html `<button data-krds-component="coach-mark" data-krds-part="previous" data-krds-state="" part="previous" type="button" @click=${() => this.change(index - 1, 'previous')}>이전</button>` : ''}${step.requiresAction ? html `<p role="status">${this.waiting ? '작업 확인 중' : this.verificationFailed ? '작업 확인에 실패했습니다. 다시 시도하세요.' : '대상에서 작업을 완료하세요'}</p><button data-krds-component="coach-mark" data-krds-part="next" data-krds-state="" part="next" type="button" disabled>${index === this.steps.length - 1 ? '마치기' : '다음'}</button>` : html `<button data-krds-component="coach-mark" data-krds-part="next" data-krds-state="" part="next" type="button" @click=${() => index === this.steps.length - 1 ? this.stop('finish') : this.change(index + 1, 'next')}>${this.steps.length === 1 ? '확인' : index === this.steps.length - 1 ? '마치기' : '다음'}</button>`}<button data-krds-component="coach-mark" data-krds-part="stop" data-krds-state="" part="stop" type="button" @click=${() => this.stop()}>그만보기</button></section></div>`, boundary, { host: this });
        this.position();
        if (this.focusStepId === step.id) {
            this.focusStepId = null;
            boundary.querySelector<HTMLElement>('[part="title"]')?.focus({ preventScroll: true });
        }
    }
    private recovery() { return html`<style>${shadowStyles.all}</style><div data-krds-component="coach-mark" data-krds-part="root" data-krds-state="open missing-target" part="root"><section data-krds-component="coach-mark" data-krds-part="popover" data-krds-state="open missing-target" part="popover" role="region" aria-label="이용 방법 대상 없음" style="position:static"><h3 data-krds-component="coach-mark" data-krds-part="title" data-krds-state="" part="title">${this.committedStep.title}</h3><p data-krds-component="coach-mark" data-krds-part="instruction" data-krds-state="" part="instruction">대상을 찾을 수 없습니다. 화면을 확인한 후 다시 시작하세요.</p><button data-krds-component="coach-mark" data-krds-part="next" data-krds-state="" part="next" type="button" disabled>다음</button><button data-krds-component="coach-mark" data-krds-part="stop" data-krds-state="" part="stop" type="button" @click=${() => this.stop()}>그만보기</button></section></div>`; }
    private position() { const popup = this.boundary?.querySelector<HTMLElement>('[part="root"]'); if (!popup || !this.nativeTarget)
        return; const rect = this.nativeTarget.getBoundingClientRect(); const view = this.ownerDocument.defaultView!; let ancestor: Element | null = this.nativeTarget; while (ancestor && !ancestor.matches('dialog:modal')) ancestor = composedParent(ancestor); if (ancestor) { popup.style.position = 'static'; popup.style.maxInlineSize = '100%'; popup.style.maxBlockSize = 'none'; popup.style.overflow = 'visible'; popup.style.left = 'auto'; popup.style.top = 'auto'; return; } popup.style.position = 'fixed'; popup.style.maxInlineSize = 'min(24rem,calc(100vw - 16px))'; popup.style.maxBlockSize = 'calc(100dvh - 16px)'; popup.style.overflow = 'auto'; popup.style.zIndex = '1000'; const below = Math.max(0, view.innerHeight - rect.bottom - 16); const above = Math.max(0, rect.top - 16); const placeBelow = below >= 160 || below >= above; popup.style.maxBlockSize = `${Math.max(1, placeBelow ? below : above)}px`; const content = popup.querySelector<HTMLElement>('[part="popover"]'); if (content) { content.style.maxBlockSize = popup.style.maxBlockSize; content.style.boxSizing = 'border-box'; } const box = popup.getBoundingClientRect(); popup.style.left = `${Math.max(8, Math.min(rect.left, view.innerWidth - box.width - 8))}px`; popup.style.top = `${placeBelow ? rect.bottom + 8 : Math.max(8, rect.top - box.height - 8)}px`; }
    override render() { unique(this.steps.map(step => step.id)); if (this.steps.length > 15)
        throw new RangeError('Coach mark supports at most fifteen steps'); unique(this.boundaries.map(boundary => boundary.targetId)); if (this.steps.some(step => step.requiresAction) && !this.onTargetAction)
        throw new TypeError('Action-gated coach steps require a committed-state verifier'); if (!this.startActionId)
        throw new TypeError('Coach requires a usable start action ID'); if (this.steps.length)
        void this.committedStep; if (this.committedOpen && (!this.missing || this.boundary)) return html``; return html `<div data-krds-component="coach-mark" data-krds-part="root" data-krds-state=${this.committedOpen ? this.missing ? 'open missing-target' : 'open current-step' : 'closed'} part="root">${this.committedOpen && this.missing && !this.boundary ? html `<section data-krds-component="coach-mark" data-krds-part="popover" data-krds-state="open missing-target" part="popover" role="region" aria-label="이용 방법 대상 없음"><h3 data-krds-component="coach-mark" data-krds-part="title" data-krds-state="" part="title">${this.committedStep.title}</h3><p data-krds-component="coach-mark" data-krds-part="instruction" data-krds-state="" part="instruction">대상을 찾을 수 없습니다. 화면을 확인한 후 다시 시작하세요.</p><button data-krds-component="coach-mark" data-krds-part="next" data-krds-state="" part="next" type="button" disabled>다음</button><button data-krds-component="coach-mark" data-krds-part="stop" data-krds-state="" part="stop" type="button" @click=${() => this.stop()}>그만보기</button></section>` : ''}</div>`; }
}
