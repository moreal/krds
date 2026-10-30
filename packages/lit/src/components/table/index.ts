import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { TableContract, TableColumn } from '@unofficial-krds/contracts';
import { KrdsElement, unique } from '../base.js';
export class Table extends KrdsElement {
    static override properties = { caption: { type: String }, columns: { attribute: false }, rows: { attribute: false }, sort: { attribute: false }, rowHeaderColumnId: { type: String, attribute: 'row-header-column-id' }, overflow: { state: true } };
    declare caption: string;
    declare columns: readonly TableColumn[];
    declare rows: TableContract['rows'];
    declare sort: TableContract['sort'];
    declare rowHeaderColumnId: string | undefined;
    declare private overflow: boolean; private observer?: ResizeObserver; private observed: HTMLElement | null = null;
    constructor() { super(); this.caption = ''; this.columns = []; this.rows = []; this.overflow = false; }
    override connectedCallback() { super.connectedCallback(); this.observer = new ResizeObserver(() => this.measure()); }
    override disconnectedCallback() { this.observer?.disconnect(); this.observed = null; super.disconnectedCallback(); }
    override updated() { const region = this.renderRoot.querySelector<HTMLElement>('[part="scroll-region"]'); if (region && region !== this.observed) { this.observer?.disconnect(); this.observer?.observe(region); this.observed = region; } this.measure(); }
    private measure() { if (this.isConnected && this.observed) this.overflow = this.observed.scrollWidth > this.observed.clientWidth + 1; }
    get committedSort() { return this.sort; }
    private toggle(columnId: string) { if (!this.sort) return; const direction = this.committedSort?.columnId === columnId && this.committedSort.direction === 'ascending' ? 'descending' : 'ascending'; this.emit('sort-change', { columnId, direction }); this.requestUpdate(); }
    override render() {
        unique(this.columns.map(column => column.id));
        unique(this.rows.map(row => row.id));
        if (!this.caption || !this.columns.length || this.rowHeaderColumnId && !this.columns.some(column => column.id === this.rowHeaderColumnId))
            throw new TypeError('Table requires caption and valid columns');
        const sort = this.committedSort;
        if (sort && !this.columns.some(column => column.id === sort.columnId && column.sortable))
            throw new TypeError('Invalid table sort');
        const rows = [...this.rows];
        if (sort) {
            const column = this.columns.find(column => column.id === sort.columnId)!;
            rows.sort((a, b) => { const x = a.cells[column.id]; const y = b.cells[column.id]; const order = column.kind === 'number' ? Number(x) - Number(y) : column.kind === 'date' ? Date.parse(String(x)) - Date.parse(String(y)) : String(x ?? '').localeCompare(String(y ?? ''), this.locale); return order * (sort.direction === 'ascending' ? 1 : -1); });
        }
        return html `<div><div data-krds-component="table" data-krds-part="scroll-region" data-krds-state="" part="scroll-region" role=${ifDefined(this.overflow ? 'region' : undefined)} aria-label=${ifDefined(this.overflow ? `${this.caption} 가로 스크롤` : undefined)} tabindex=${ifDefined(this.overflow ? '0' : undefined)} style="overflow:auto"><table data-krds-component="table" data-krds-part="root" data-krds-state=${sort?.direction ?? ''} part="root"><caption data-krds-component="table" data-krds-part="caption" data-krds-state="" part="caption">${this.caption}</caption><thead><tr>${this.columns.map(column => html `<th data-krds-component="table" data-krds-part="header-cell" data-krds-state=${sort?.columnId === column.id ? sort.direction : ''} part="header-cell" id=${`header-${column.id}`} scope="col" aria-sort=${ifDefined(sort?.columnId === column.id ? sort.direction : undefined)}>${sort && column.sortable ? html `<button data-krds-component="table" data-krds-part="sort-trigger" data-krds-state="" part="sort-trigger" type="button" @click=${() => this.toggle(column.id)}>${column.label}</button>` : column.label}</th>`)}</tr></thead><tbody>${rows.map(row => html `<tr data-krds-component="table" data-krds-part="row" data-krds-state="" part="row">${this.columns.map(column => column.id === this.rowHeaderColumnId ? html `<th data-krds-component="table" data-krds-part="cell" data-krds-state="" part="cell" id=${`row-${row.id}`} scope="row" headers=${`header-${column.id}`}>${row.cells[column.id] ?? '—'}</th>` : html `<td data-krds-component="table" data-krds-part="cell" data-krds-state="" part="cell" headers=${[`header-${column.id}`, this.rowHeaderColumnId ? `row-${row.id}` : ''].filter(Boolean).join(' ')} style=${column.kind === 'number' ? 'text-align:end;font-variant-numeric:tabular-nums' : ''}>${row.cells[column.id] ?? '—'}</td>`)}</tr>`)}</tbody></table></div>${this.overflow ? html`<div><button data-krds-component="table" data-krds-part="scroll-previous" data-krds-state="overflow" part="scroll-previous" type="button" @click=${() => this.renderRoot.querySelector('div[role="region"]')?.scrollBy({ left: -240 })}>이전 열</button><button data-krds-component="table" data-krds-part="scroll-next" data-krds-state="overflow" part="scroll-next" type="button" @click=${() => this.renderRoot.querySelector('div[role="region"]')?.scrollBy({ left: 240 })}>다음 열</button></div>` : ''}</div>`;
    }
}
