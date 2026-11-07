import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KrdsElement } from '../base.js';
import { target } from '../catalog-support.js';
export class Image extends KrdsElement {
    static override properties = { src: { type: String }, alt: { type: String }, width: { type: Number }, height: { type: Number }, srcset: { type: String }, sizes: { type: String }, loading: { type: String }, decorative: { type: Boolean }, caption: { type: String }, descriptionId: { type: String, attribute: 'description-id' }, status: { state: true } };
    declare src: string;
    declare alt: string;
    declare width: number | undefined;
    declare height: number | undefined;
    declare srcset: string | undefined;
    declare sizes: string | undefined;
    declare loading: 'eager' | 'lazy';
    declare decorative: boolean;
    declare caption: string;
    declare descriptionId: string;
    declare private status: string;
    private descriptionObserver?: MutationObserver;
    override connectedCallback() {
        super.connectedCallback();
        this.descriptionObserver = new MutationObserver(records => { if (this.descriptionId && records.some(record => record.type === 'childList' || record.attributeName === 'id')) this.requestUpdate(); });
        this.descriptionObserver.observe(this.getRootNode(), { subtree: true, childList: true, attributes: true, attributeFilter: ['id'] });
        this.requestUpdate();
    }
    override disconnectedCallback() { const image = this.renderRoot.querySelector('img'); if (image && 'ariaDescribedByElements' in image) image.ariaDescribedByElements = null; this.descriptionObserver?.disconnect(); this.descriptionObserver = undefined; super.disconnectedCallback(); }
    constructor() { super(); this.src = ''; this.alt = ''; this.loading = 'lazy'; this.decorative = false; this.caption = ''; this.descriptionId = ''; this.status = ''; }
    override willUpdate(changed: Map<PropertyKey, unknown>) { super.willUpdate(changed); if ((changed.has('src') || changed.has('srcset')) && this.hasUpdated) this.status = ''; }
    override updated() { const image = this.renderRoot.querySelector('img')!; const description = this.descriptionId ? target(this, this.descriptionId) : null; if ('ariaDescribedByElements' in image)
        image.ariaDescribedByElements = description ? [description] : null; }
    override render() { if (!this.src || !this.decorative && !this.alt.trim() || !['eager', 'lazy'].includes(this.loading))
        throw new TypeError('Informative image needs alternative text'); return html `<figure data-krds-component="image" data-krds-part="figure" data-krds-state=${this.status} part="figure"><img data-krds-component="image" data-krds-part="root" data-krds-state=${this.status} part="root" src=${this.src} alt=${this.decorative ? '' : this.alt} width=${ifDefined(this.width)} height=${ifDefined(this.height)} srcset=${ifDefined(this.srcset)} sizes=${ifDefined(this.sizes)} loading=${this.loading} style="max-inline-size:100%;block-size:auto" @load=${() => { this.status = 'loaded'; }} @error=${() => { this.status = 'error'; }}>${this.caption ? html `<figcaption data-krds-component="image" data-krds-part="caption" data-krds-state="" part="caption">${this.caption}</figcaption>` : ''}${this.status === 'error' ? html `<span data-krds-component="image" data-krds-part="description" data-krds-state="" part="description">이미지를 불러올 수 없습니다.</span>` : ''}</figure>`; }
}
