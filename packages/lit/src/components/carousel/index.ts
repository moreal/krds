import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { CarouselContract } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState, deepActive, composedParent, unique } from '../base.js';
import { integer, focusTarget } from '../catalog-support.js';

export class Carousel extends KrdsElement {
    static override properties = { items: { attribute: false }, index: { type: Number }, defaultIndex: { type: Number, attribute: 'default-index' }, layout: { type: String }, autoplay: { type: Boolean }, intervalMs: { type: Number, attribute: 'interval-ms' }, playing: { type: Boolean }, defaultPlaying: { type: Boolean, attribute: 'default-playing' }, loop: { type: Boolean }, narrowIndicators: { state: true }, capacity: { state: true } };
    declare items: CarouselContract['items'];
    declare index: number | undefined;
    declare defaultIndex: number | undefined;
    declare layout: string;
    declare autoplay: boolean;
    declare intervalMs: number;
    declare playing: boolean | undefined;
    declare defaultPlaying: boolean | undefined;
    declare loop: boolean;
    declare private narrowIndicators: boolean;
    declare private capacity: number;
    private indexState = new ValueState<number>();
    private playState = new ValueState<boolean>();
    private stopped = false;
    private hovered = false;
    private explicitPlay = false;
    private reduced = true;
    private motionMedia?: MediaQueryList;
    private indicatorMedia?: MediaQueryList;
    private geometry?: ResizeObserver;
    private observedViewport: HTMLElement | null = null;
    private timer?: ReturnType<typeof setTimeout>;
    private startX = 0;
    private startY = 0;
    private activePointer: number | null = null;
    private restoreVisibleFocus = false;
    private pendingStopFocus = false;
    constructor() {
        super(); this.label = '콘텐츠 슬라이드'; this.items = []; this.layout = 'single';
        this.autoplay = false; this.intervalMs = 6000; this.loop = false;
        this.narrowIndicators = false; this.capacity = 2;
    }
    get committedIndex() {
        const index = this.indexState.read(this.index, this.defaultIndex, () => 0);
        integer(index, 0, Math.max(0, this.items.length - 1), 'carousel index'); return index;
    }
    get playingIntent() { return this.playState.read(this.playing, this.defaultPlaying, () => this.autoplay); }
    get advancing() {
        const intent = this.playingIntent;
        return this.isConnected && !!this.ownerDocument?.defaultView && intent && !this.stopped && !this.hovered && (!this.reduced || this.explicitPlay) && !this.ownerDocument.hidden && this.items.length > 1 && (this.loop || this.committedIndex < this.items.length - 1);
    }
    private visible(count = this.capacity): ReadonlySet<number> {
        const size = this.layout === 'multiple' ? Math.max(1, Math.min(count, this.items.length)) : 1;
        const start = Math.min(this.committedIndex, Math.max(0, this.items.length - size));
        return new Set(Array.from({ length: size }, (_, offset) => start + offset));
    }
    private motion = () => { this.reduced = this.motionMedia?.matches ?? true; this.requestUpdate(); };
    private indicatorResize = () => {
        const next = this.indicatorMedia?.matches ?? false;
        const active = deepActive(this.ownerDocument);
        if (next && this.renderRoot.querySelector('[part="indicators"]')?.contains(active)) this.restoreVisibleFocus = true;
        this.narrowIndicators = next;
    };
    private measure = () => {
        if (!this.isConnected) return;
        const list = this.renderRoot.querySelector<HTMLElement>('[part="viewport"]');
        if (!list?.clientWidth) return;
        const rootFont = Number.parseFloat(getComputedStyle(this.ownerDocument.documentElement).fontSize) || 16;
        const listStyle = getComputedStyle(list);
        const gap = Number.parseFloat(listStyle.columnGap) || 0;
        const width = list.clientWidth - (Number.parseFloat(listStyle.paddingInlineStart) || 0) - (Number.parseFloat(listStyle.paddingInlineEnd) || 0);
        if (width <= 0) return;
        const card = Math.min(24 * rootFont, width);
        const next = Math.max(1, Math.floor((width + gap) / (card + gap)));
        if (next === this.capacity) return;
        for (let active = deepActive(this.ownerDocument); active && active !== this; active = composedParent(active)) {
            if (active instanceof HTMLElement && active.dataset.krdsComponent === 'carousel' && active.dataset.krdsPart === 'slide' && !this.visible(next).has(Number(active.dataset.index))) this.restoreVisibleFocus = true;
        }
        this.capacity = next;
    };
    private visibility = () => this.requestUpdate();
    override connectedCallback() {
        super.connectedCallback();
        this.motionMedia = this.ownerDocument.defaultView!.matchMedia('(prefers-reduced-motion: reduce)');
        this.indicatorMedia = this.ownerDocument.defaultView!.matchMedia('(max-width: 1022px)');
        this.motion(); this.indicatorResize();
        this.motionMedia.addEventListener('change', this.motion);
        this.indicatorMedia.addEventListener('change', this.indicatorResize);
        this.ownerDocument.addEventListener('visibilitychange', this.visibility);
        this.geometry = new ResizeObserver(this.measure);
    }
    override disconnectedCallback() {
        clearTimeout(this.timer); this.geometry?.disconnect(); this.observedViewport = null;
        this.motionMedia?.removeEventListener('change', this.motion);
        this.indicatorMedia?.removeEventListener('change', this.indicatorResize);
        this.ownerDocument.removeEventListener('visibilitychange', this.visibility);
        this.activePointer = null; this.restoreVisibleFocus = false; this.pendingStopFocus = false; super.disconnectedCallback();
    }
    override updated() {
        const viewport = this.renderRoot.querySelector<HTMLElement>('[part="viewport"]');
        if (viewport && viewport !== this.observedViewport) { this.geometry?.disconnect(); this.geometry?.observe(viewport); this.observedViewport = viewport; }
        this.measure();
        clearTimeout(this.timer);
        if (this.advancing) this.timer = setTimeout(() => {
            if (this.isConnected && this.advancing) { this.navigate(this.committedIndex + 1, 'timer'); this.requestUpdate(); }
        }, this.intervalMs);
        if (this.pendingStopFocus && !this.playingIntent) { this.pendingStopFocus = false; this.restoreVisibleFocus = true; }
        if (this.restoreVisibleFocus) {
            this.restoreVisibleFocus = false;
            focusTarget(this.renderRoot.querySelector<HTMLElement>('[part="play-pause"]') ?? this.renderRoot.querySelector<HTMLElement>('[part="root"]'));
        }
    }
    private navigate(next: number, reason: 'previous' | 'next' | 'indicator' | 'swipe' | 'timer') {
        if (!this.items.length) return;
        if (this.loop) next = (next + this.items.length) % this.items.length;
        if (next < 0 || next >= this.items.length || next === this.committedIndex) return;
        if (reason !== 'timer') this.stop(true, 'navigation');
        this.indexState.set(next); this.emit('index-change', { index: next, reason }); this.requestUpdate();
    }
    private stop(notify: boolean, reason: 'stop' | 'navigation' = 'stop') {
        if (notify && reason === 'stop' && deepActive(this.ownerDocument) === this.renderRoot.querySelector('[part="stop-intent"]')) this.pendingStopFocus = true;
        this.stopped = true;
        if (notify && this.playingIntent) { this.playState.set(false); this.emit('playing-change', { playing: false, reason }); }
        this.requestUpdate();
    }
    private play() {
        this.stopped = false; this.explicitPlay = true;
        if (!this.playingIntent) { this.playState.set(true); this.emit('playing-change', { playing: true, reason: 'play' }); }
        this.requestUpdate();
    }
    override render() {
        unique(this.items.map(item => item.id));
        if (!this.label || !['single', 'multiple'].includes(this.layout) || !Number.isFinite(this.intervalMs) || this.intervalMs < 100) throw new TypeError('Invalid carousel configuration');
        const index = this.committedIndex; const playing = this.advancing; const visible = this.visible();
        return html`<div data-krds-component="carousel" data-krds-part="root" data-krds-state=${playing ? 'playing' : 'paused'} part="root" data-krds-layout=${this.layout} role="region" aria-roledescription="캐러셀" aria-label=${this.explicitName ?? this.label} @keydown=${(event: KeyboardEvent) => {
            const editable = event.composedPath().some(node => node instanceof HTMLElement && (node.matches('input,textarea,select') || node.isContentEditable));
            if (!event.defaultPrevented && !event.isComposing && event.keyCode !== 229 && !editable && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); this.navigate(this.committedIndex + (event.key === 'ArrowRight' ? 1 : -1), event.key === 'ArrowRight' ? 'next' : 'previous'); }
        }} @focusin=${() => { if (deepActive(this.ownerDocument) !== this.renderRoot.querySelector('[part="stop-intent"]')) this.pendingStopFocus = false; this.stop(false); }} @pointerenter=${() => { this.hovered = true; this.requestUpdate(); }} @pointerleave=${() => { this.hovered = false; this.requestUpdate(); }}>
            ${this.items.length > 1 ? html`<button data-krds-component="carousel" data-krds-part="play-pause" data-krds-state="" part="play-pause" type="button" @click=${() => playing ? this.stop(true) : this.play()}>${playing ? '정지' : '재생'}</button>${this.playingIntent && !playing ? html`<button data-krds-component="carousel" data-krds-part="stop-intent" data-krds-state="paused" part="stop-intent" type="button" @click=${() => this.stop(true)}>자동 재생 중지</button>` : ''}` : ''}
            <div data-krds-component="carousel" data-krds-part="viewport" data-krds-state="" part="viewport" style=${this.layout === 'multiple' ? 'touch-action:pan-y;display:flex;gap:var(--krds-gap-5)' : 'touch-action:pan-y'} @pointerdown=${(event: PointerEvent) => { if (event.isPrimary && event.button === 0) { this.activePointer = event.pointerId; this.startX = event.clientX; this.startY = event.clientY; } }} @pointercancel=${() => { this.activePointer = null; }} @pointerup=${(event: PointerEvent) => {
                if (event.pointerId !== this.activePointer) return;
                this.activePointer = null;
                const horizontal = event.clientX - this.startX; const vertical = event.clientY - this.startY;
                if (Math.abs(horizontal) > 40 && Math.abs(horizontal) > Math.abs(vertical)) this.navigate(index + (horizontal < 0 ? 1 : -1), 'swipe');
            }}>${this.items.map((item, position) => html`<section data-krds-component="carousel" data-krds-part="slide" data-krds-state=${visible.has(position) ? position === index ? 'active' : '' : 'hidden'} part="slide" data-index=${position} role="group" aria-roledescription="슬라이드" aria-label=${`${position + 1} / ${this.items.length}: ${item.label}`} ?hidden=${!visible.has(position)} ?inert=${!visible.has(position)}><h3>${item.label}</h3><p>${item.content}</p><slot name=${item.id}></slot></section>`)}</div>
            ${this.items.length > 1 ? html`<button data-krds-component="carousel" data-krds-part="previous" data-krds-state="" part="previous" type="button" ?disabled=${!this.loop && index === 0} @click=${() => this.navigate(index - 1, 'previous')}>이전 슬라이드</button><div data-krds-component="carousel" data-krds-part="indicators" data-krds-state="" part="indicators" ?hidden=${this.narrowIndicators}>${this.items.map((item, position) => html`<button data-krds-component="carousel" data-krds-part="indicator" data-krds-state=${position === index ? 'active' : ''} part="indicator" type="button" aria-label=${`${position + 1} ${item.label} 슬라이드`} aria-current=${ifDefined(position === index ? 'true' : undefined)} @click=${() => this.navigate(position, 'indicator')}>${position + 1}</button>`)}</div><span data-krds-component="carousel" data-krds-part="position" data-krds-state="" part="position" ?hidden=${!this.narrowIndicators}>${index + 1} / ${this.items.length}</span><button data-krds-component="carousel" data-krds-part="next" data-krds-state="" part="next" type="button" ?disabled=${!this.loop && index === this.items.length - 1} @click=${() => this.navigate(index + 1, 'next')}>다음 슬라이드</button>` : ''}
        </div>`;
    }
}
