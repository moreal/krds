import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { PaginationContract } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState } from '../base.js';
import { integer, target, focusTarget } from '../catalog-support.js';
export class Pagination extends KrdsElement {
    static override properties = { page: { type: Number }, defaultPage: { type: Number, attribute: 'default-page' }, pageCount: { type: Number, attribute: 'page-count' }, hrefForPage: { attribute: false }, variant: { type: String }, loadMore: { attribute: false }, draft: { state: true }, invalid: { state: true }, narrow: { state: true } };
    declare page: number | undefined;
    declare defaultPage: number | undefined;
    declare pageCount: number;
    declare hrefForPage: PaginationContract['hrefForPage'];
    declare variant: string;
    declare loadMore: PaginationContract['loadMore'];
    declare private draft: string;
    declare private invalid: boolean;
    declare private narrow: boolean;
    private media: MediaQueryList | undefined;
    private state = new ValueState<number>();
    private wasPending = false;
    private requestedMore = false;
    private previousShown = 0;
    constructor() { super(); this.pageCount = 1; this.variant = 'number-links'; this.draft = ''; this.invalid = false; this.narrow = false; }
    private resize = () => { this.narrow = this.media?.matches ?? false; };
    override connectedCallback() { super.connectedCallback(); this.media = this.ownerDocument.defaultView?.matchMedia?.('(max-width: 767px)'); this.resize(); this.media?.addEventListener('change', this.resize); }
    override disconnectedCallback() { this.media?.removeEventListener('change', this.resize); super.disconnectedCallback(); }
    /** Page window shared by every renderer: first and last stay visible, each gap is its own list item. */
    private numbers(page: number): (number | 'start-gap' | 'end-gap')[] {
        const total = this.pageCount, budget = this.narrow ? 7 : 11;
        if (total <= budget) return Array.from({ length: total }, (_, index) => index + 1);
        const radius = this.narrow ? 1 : 3;
        let first = Math.max(2, page - radius), last = Math.min(total - 1, page + radius);
        const size = () => 2 + last - first + 1 + Number(first > 2) + Number(last < total - 1);
        while (size() < budget) {
            if (first > 2) first--;
            else if (last < total - 1) last++;
            else break;
        }
        return [1, ...(first > 2 ? ['start-gap' as const] : []), ...Array.from({ length: last - first + 1 }, (_, index) => first + index), ...(last < total - 1 ? ['end-gap' as const] : []), total];
    }
    get committedPage() { integer(this.pageCount, 1, Number.MAX_SAFE_INTEGER, 'pageCount'); const value = this.state.read(this.page, this.defaultPage, () => 1); integer(value, 1, this.pageCount, 'page'); return value; }
    override updated(_changed: PropertyValues) { if (this.wasPending && !this.loadMore?.pending && this.requestedMore) { const success = !!this.loadMore && this.loadMore.shown > this.previousShown; if (success && this.loadMore?.firstNewItemId) focusTarget(target(this, this.loadMore.firstNewItemId)); else this.shadowRoot?.querySelector<HTMLElement>('[part=load-more]')?.focus(); this.requestedMore = false; } this.wasPending = this.loadMore?.pending ?? false; if (!this.wasPending) this.previousShown = this.loadMore?.shown ?? 0; }
    private request(page: number) { if (page === this.committedPage || page < 1 || page > this.pageCount)
        return; this.state.set(page); this.emit('page-change', { page }); this.requestUpdate(); }
    private link(page: number, text: string, name: string, rel?: string) { const current = name === 'link' && page === this.committedPage; return html `<a data-krds-component="pagination" data-krds-part=${name} data-krds-state=${current ? 'current' : ''} part=${name} href=${ifDefined(current ? undefined : this.hrefForPage(page))} rel=${ifDefined(rel)} aria-current=${ifDefined(current ? 'page' : undefined)} aria-label=${ifDefined(name !== 'link' || current ? undefined : page === this.pageCount ? `마지막 페이지, ${page}` : `페이지 ${page}`)} tabindex=${ifDefined(current ? '-1' : undefined)} @click=${(event: MouseEvent) => { if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        this.request(page); }}>${text}</a>`; }
    private unavailable(text: string, name: 'previous' | 'next') { return html `<a data-krds-component="pagination" data-krds-part=${name} data-krds-state="disabled" part=${name} role="link" aria-disabled="true">${text}</a>`; }
    override render() {
        const page = this.committedPage;
        if (!['number-links', 'direct-page', 'load-more'].includes(this.variant) || typeof this.hrefForPage !== 'function')
            throw new TypeError('Pagination requires hrefForPage');
        if (this.variant === 'load-more') {
            if (!this.loadMore)
                throw new TypeError('Load-more data required');
            return html `<nav data-krds-component="pagination" data-krds-part="root" data-krds-state="" part="root" data-krds-variant=${this.variant} aria-label="결과 더보기"><p data-krds-component="pagination" data-krds-part="count" data-krds-state="" part="count" role="status">${this.loadMore.shown} / ${this.loadMore.total}</p><button data-krds-component="pagination" data-krds-part="load-more" data-krds-state=${this.loadMore.pending ? 'pending' : ''} part="load-more" type="button" ?disabled=${this.loadMore.pending || this.loadMore.shown >= this.loadMore.total} @click=${() => { this.requestedMore = true; this.previousShown = this.loadMore?.shown ?? 0; this.loadMore?.onLoadMore(); this.emit('load-more', {}); }}>${this.loadMore.pending ? '불러오는 중' : '더 보기'}</button></nav>`;
        }
        return html `<nav data-krds-component="pagination" data-krds-part="root" data-krds-state="" part="root" data-krds-variant=${this.variant} aria-label="페이지 이동">${page > 1 ? this.link(page - 1, '이전', 'previous', 'prev') : this.unavailable('이전', 'previous')}<ol data-krds-component="pagination" data-krds-part="list" data-krds-state="" part="list">${this.numbers(page).map(value => html `<li data-krds-component="pagination" data-krds-part="item" data-krds-state="" part="item">${typeof value === 'number' ? this.link(value, String(value), 'link') : html `<span data-krds-component="pagination" data-krds-part="ellipsis" data-krds-state="" part="ellipsis">…</span>`}</li>`)}</ol>${page < this.pageCount ? this.link(page + 1, '다음', 'next', 'next') : this.unavailable('다음', 'next')}${this.variant === 'direct-page' ? html `<label for="page-input">이동할 페이지</label><input id="page-input" data-krds-component="pagination" data-krds-part="input" data-krds-state=${this.invalid ? 'invalid' : ''} part="input" type="text" inputmode="numeric" .value=${this.draft || String(page)} aria-invalid=${ifDefined(this.invalid ? 'true' : undefined)} aria-describedby=${ifDefined(this.invalid ? 'page-error' : undefined)} @input=${(event: Event) => { this.draft = (event.target as HTMLInputElement).value; }}><span data-krds-component="pagination" data-krds-part="total" data-krds-state="" part="total">/ ${this.pageCount}</span><button data-krds-component="pagination" data-krds-part="go" data-krds-state="" part="go" type="button" @click=${() => { const value = Number(this.draft); this.invalid = !/^\d+$/.test(this.draft) || !Number.isInteger(value) || value < 1 || value > this.pageCount; if (!this.invalid) {
            this.request(value);
            this.emit('navigate', { href: this.hrefForPage(value), page: value });
        } }}>이동</button>${this.invalid ? html `<p id="page-error" role="status">1부터 ${this.pageCount}까지 입력하세요</p>` : ''}` : ''}</nav>`;
    }
}
