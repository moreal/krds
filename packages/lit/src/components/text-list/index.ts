import { html, type TemplateResult } from 'lit';
import type { TextListItem } from '@unofficial-krds/contracts';
import { KrdsElement, unique } from '../base.js';
export class TextList extends KrdsElement {
    static override properties = { items: { attribute: false }, ordered: { type: Boolean }, marker: { type: String } };
    declare items: readonly TextListItem[];
    declare ordered: boolean;
    declare marker: string;
    constructor() { super(); this.items = []; this.ordered = false; this.marker = 'dot'; }
    private list(items: readonly TextListItem[], level: number): TemplateResult { if (level > 3)
        throw new RangeError('Text lists support three levels'); unique(items.map(item => item.id)); const content = items.map(item => html `<li data-krds-component="text-list" data-krds-part="item" data-krds-state=${`level-${level}`} part="item"><span data-krds-component="text-list" data-krds-part="content" data-krds-state="" part="content">${item.content}</span>${item.children?.length ? this.list(item.children, level + 1) : ''}</li>`); return this.ordered ? html `<ol data-krds-component="text-list" data-krds-part=${level === 1 ? 'root' : 'nested-list'} data-krds-state="" part=${level === 1 ? 'root' : 'nested-list'} role="list" data-krds-ordering="ordered">${content}</ol>` : html `<ul data-krds-component="text-list" data-krds-part=${level === 1 ? 'root' : 'nested-list'} data-krds-state="" part=${level === 1 ? 'root' : 'nested-list'} role="list" data-krds-ordering="unordered" data-krds-marker=${this.marker}>${content}</ul>`; }
    override render() { if (!['dot', 'dash', 'hollow'].includes(this.marker))
        throw new TypeError('Invalid text list marker'); return this.list(this.items, 1); }
}
