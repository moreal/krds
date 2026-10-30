import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { PaginationContract } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState } from '../base.js';
import { integer, target, focusTarget } from '../catalog-support.js';
export class Pagination extends KrdsElement {
    static override properties = { page: { type: Number }, defaultPage: { type: Number, attribute: 'default-page' }, pageCount: { type: Number, attribute: 'page-count' }, hrefForPage: { attribute: false }, variant: { type: String }, loadMore: { attribute: false }, draft: { state: true }, invalid: { state: true } };
    declare page: number | undefined;
    declare defaultPage: number | undefined;
    declare pageCount: number;
    declare hrefForPage: PaginationContract['hrefForPage'];
    declare variant: string;
    declare loadMore: PaginationContract['loadMore'];
    declare private draft: string;
    declare private invalid: boolean;
    private state = new ValueState<number>();
    private wasPending = false;
    private requestedMore = false;
    private previousShown = 0;
    constructor() { super(); this.pageCount = 1; this.variant = 'number-links'; this.draft = ''; this.invalid = false; }
    get committedPage() { integer(this.pageCount, 1, Number.MAX_SAFE_INTEGER, 'pageCount'); const value = this.state.read(this.page, this.defaultPage, () => 1); integer(value, 1, this.pageCount, 'page'); return value; }
    override updated(_changed: PropertyValues) { if (this.wasPending && !this.loadMore?.pending && this.requestedMore) { const success = !!this.loadMore && this.loadMore.shown > this.previousShown; if (success && this.loadMore?.firstNewItemId) focusTarget(target(this, this.loadMore.firstNewItemId)); else this.shadowRoot?.querySelector<HTMLElement>('[part=load-more]')?.focus(); this.requestedMore = false; } this.wasPending = this.loadMore?.pending ?? false; if (!this.wasPending) this.previousShown = this.loadMore?.shown ?? 0; }
    private request(page: number) { if (page === this.committedPage || page < 1 || page > this.pageCount)
        return; this.state.set(page); this.emit('page-change', { page }); this.requestUpdate(); }
    private link(page: number, text: string, name: string) { const disabled = page < 1 || page > this.pageCount; return html `<a data-krds-component="pagination" data-krds-part=${name} data-krds-state=${disabled ? 'disabled' : ''} part=${name} href=${ifDefined(disabled ? undefined : this.hrefForPage(page))} aria-disabled=${ifDefined(disabled ? 'true' : undefined)} @click=${(event: MouseEvent) => { if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; if (!disabled)
        this.request(page); }}>${text}</a>`; }
    override render() {
        const page = this.committedPage;
        if (!['number-links', 'direct-page', 'load-more'].includes(this.variant) || typeof this.hrefForPage !== 'function')
            throw new TypeError('Pagination requires hrefForPage');
        if (this.variant === 'load-more') {
            if (!this.loadMore)
                throw new TypeError('Load-more data required');
            return html `<nav data-krds-component="pagination" data-krds-part="root" data-krds-state=${this.loadMore.pending ? 'pending' : ''} part="root" aria-label="결과 더보기"><p data-krds-component="pagination" data-krds-part="count" data-krds-state="" part="count">${this.loadMore.shown} / ${this.loadMore.total}</p><button data-krds-component="pagination" data-krds-part="load-more" data-krds-state=${this.loadMore.pending ? 'pending disabled' : ''} part="load-more" type="button" ?disabled=${this.loadMore.pending || this.loadMore.shown >= this.loadMore.total} @click=${() => { this.requestedMore = true; this.previousShown = this.loadMore?.shown ?? 0; this.loadMore?.onLoadMore(); this.emit('load-more', {}); }}>${this.loadMore.pending ? '불러오는 중' : '더 보기'}</button></nav>`;
        }
        const pages = [...new Set([1, ...Array.from({ length: 5 }, (_, index) => page - 2 + index).filter(value => value > 1 && value < this.pageCount), this.pageCount])];
        return html `<nav data-krds-component="pagination" data-krds-part="root" data-krds-state=${this.invalid ? 'invalid' : ''} part="root" aria-label="페이지 이동">${this.link(page - 1, '이전', 'previous')}${this.variant === 'direct-page' ? html `<label>이동할 페이지<input data-krds-component="pagination" data-krds-part="input" data-krds-state=${this.invalid ? 'invalid' : ''} part="input" type="text" inputmode="numeric" .value=${this.draft || String(page)} aria-invalid=${this.invalid} @input=${(event: Event) => { this.draft = (event.target as HTMLInputElement).value; }}></label><span data-krds-component="pagination" data-krds-part="total" data-krds-state="" part="total">/ ${this.pageCount}</span><button data-krds-component="pagination" data-krds-part="go" data-krds-state="" part="go" type="button" @click=${() => { const value = Number(this.draft); this.invalid = !/^\d+$/.test(this.draft) || !Number.isInteger(value) || value < 1 || value > this.pageCount; if (!this.invalid) {
            this.request(value);
            this.emit('navigate', { href: this.hrefForPage(value), page: value });
        } }}>이동</button>${this.invalid ? html `<p role="alert">1부터 ${this.pageCount}까지 입력하세요</p>` : ''}` : html `<ol data-krds-component="pagination" data-krds-part="list" data-krds-state="" part="list">${pages.map((value, index) => html `${index && value - pages[index - 1]! > 1 ? html `<li data-krds-component="pagination" data-krds-part="ellipsis" data-krds-state="" part="ellipsis">…</li>` : ''}<li data-krds-component="pagination" data-krds-part="item" data-krds-state=${value === page ? 'current' : ''} part="item">${value === page ? html `<span data-krds-component="pagination" data-krds-part="link" data-krds-state="current" part="link" aria-current="true">${value}</span>` : this.link(value, String(value), 'link')}</li>`)}</ol>`}${this.link(page + 1, '다음', 'next')}</nav>`;
    }
}
