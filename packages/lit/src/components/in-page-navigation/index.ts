import { html, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { InPageSection } from '@unofficial-krds/contracts';
import { KrdsElement, unique } from '../base.js';
import { target, focusTarget } from '../catalog-support.js';
export class InPageNavigation extends KrdsElement {
    static override properties = { sections: { attribute: false }, activeId: { type: String, attribute: 'active-id' }, title: { type: String }, narrowMode: { type: String, attribute: 'narrow-mode' }, expanded: { state: true } };
    declare sections: readonly InPageSection[];
    declare activeId: string | undefined;
    declare narrowMode: string;
    declare private expanded: boolean;
    private observed?: IntersectionObserver;
    private localActive = '';
    private observedKey = '';
    private initialObservation = true;
    private activationTarget = '';
    private mutation?: MutationObserver;
    private observedTargets: readonly (HTMLElement | null)[] = [];
    constructor() { super(); this.sections = []; this.narrowMode = 'inline'; this.expanded = false; }
    private flat(items = this.sections): InPageSection[] { return items.flatMap(item => [item, ...item.children ? this.flat(item.children) : []]); }
    override updated() { const key = this.flat().map(item => item.id).join('|'); const targets = this.flat().map(item => target(this, item.id)); if (key === this.observedKey && targets.length === this.observedTargets.length && targets.every((element, index) => element === this.observedTargets[index]))
        return; this.observedTargets = targets; this.observedKey = key; this.observed?.disconnect(); this.initialObservation = true; this.observed = new IntersectionObserver(entries => { const initial = this.initialObservation; this.initialObservation = false; const candidate = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top)[0]; if (candidate && candidate.target.id !== (this.activeId ?? this.localActive)) {
        this.localActive = candidate.target.id;
        if (!initial && this.activationTarget !== candidate.target.id) this.emit('active-change', { id: candidate.target.id, reason: 'scroll' });
        if (this.activationTarget === candidate.target.id) this.activationTarget = '';
        this.requestUpdate();
    } }, { rootMargin: '0px 0px -50% 0px' }); for (const section of this.flat()) {
        const element = target(this, section.id);
        if (element)
            this.observed.observe(element);
    } }
    private trackScroll = () => {
        const view = this.ownerDocument.defaultView;
        if (!view) return;
        const candidate = this.flat().map(section => target(this, section.id)).filter((element): element is HTMLElement => !!element).map(element => ({ element, bounds: element.getBoundingClientRect() })).filter(({ bounds }) => bounds.bottom > 0 && bounds.top <= view.innerHeight / 2).sort((a, b) => b.bounds.top - a.bounds.top)[0]?.element;
        if (!candidate || candidate.id === (this.activeId ?? this.localActive)) return;
        this.localActive = candidate.id;
        if (this.activationTarget !== candidate.id) this.emit('active-change', { id: candidate.id, reason: 'scroll' });
        else this.activationTarget = '';
        this.requestUpdate();
    };
    override connectedCallback() { super.connectedCallback(); this.ownerDocument.defaultView?.addEventListener('scroll', this.trackScroll, { passive: true }); this.mutation = new MutationObserver(() => this.requestUpdate()); this.mutation.observe(this.getRootNode(), { subtree: true, childList: true }); }
    override disconnectedCallback() { this.ownerDocument.defaultView?.removeEventListener('scroll', this.trackScroll); this.mutation?.disconnect(); this.observed?.disconnect(); this.observedKey = ''; super.disconnectedCallback(); }
    private activate(event: MouseEvent | KeyboardEvent, id: string, keyboard: boolean) { const element = target(this, id); if (!element)
        return; event.preventDefault(); this.activationTarget = id; if (keyboard)
        focusTarget(element);
    else
        element.scrollIntoView({ block: 'start', behavior: 'instant' }); if (id !== (this.activeId ?? this.localActive)) {
        this.localActive = id;
        this.emit('active-change', { id, reason: 'activation' });
        this.requestUpdate();
    } }
    private list(items: readonly InPageSection[]): TemplateResult { return html `<ol data-krds-component="in-page-navigation" data-krds-part="list" data-krds-state=${this.expanded ? 'expanded' : 'collapsed'} part="list">${items.map(item => html `<li data-krds-component="in-page-navigation" data-krds-part="item" data-krds-state=${(this.activeId ?? this.localActive) === item.id ? 'active' : ''} part="item"><a data-krds-component="in-page-navigation" data-krds-part="link" data-krds-state="" part="link" href=${`#${item.id}`} aria-current=${ifDefined((this.activeId ?? this.localActive) === item.id ? 'location' : undefined)} @click=${(event: MouseEvent) => this.activate(event, item.id, event.detail === 0)} @keydown=${(event: KeyboardEvent) => { if (event.key === ' ')
        this.activate(event, item.id, true); }}>${item.label}</a>${item.children?.length ? this.list(item.children) : ''}</li>`)}</ol>`; }
    override render() { unique(this.flat().map(item => item.id)); if (!['inline', 'disclosure'].includes(this.narrowMode))
        throw new TypeError('Invalid outline mode'); return html `<nav data-krds-component="in-page-navigation" data-krds-part="root" data-krds-state="" part="root" aria-label=${this.title || this.label || '이 페이지 목차'}><h2 data-krds-component="in-page-navigation" data-krds-part="title" data-krds-state="" part="title">${this.title || '이 페이지 목차'}</h2>${this.narrowMode === 'disclosure' ? html `<button data-krds-component="in-page-navigation" data-krds-part="disclosure-trigger" data-krds-state=${this.expanded ? 'expanded' : 'collapsed'} part="disclosure-trigger" type="button" aria-expanded=${this.expanded} aria-controls="outline" @click=${() => { this.expanded = !this.expanded; }}>${this.expanded ? '구성 접기' : '구성 펼치기'}</button>` : ''}<div id="outline" ?hidden=${this.narrowMode === 'disclosure' && !this.expanded}>${this.list(this.sections)}</div></nav>`; }
}
