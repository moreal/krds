import type { TextListContract, TextListItem } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
export type TextListProps = TextListContract;
export function TextList({ ordered = false, marker = 'dot', items }: TextListProps) {
    const List = ordered ? 'ol' : 'ul';
    const render = (rows: readonly TextListItem[], depth: number) => { if (depth > 3)
        throw new RangeError('TextList supports at most three levels.'); return <List {...part('text-list', depth === 1 ? 'root' : 'nested-list', `${ordered ? 'ordered' : 'unordered'} level-${depth}`)} data-krds-marker={marker} data-krds-ordering={ordered ? 'ordered' : 'unordered'}>{rows.map(row => <li key={row.id} {...part('text-list', 'item', `level-${depth}`)}>{row.content}{row.children?.length ? render(row.children, depth + 1) : null}</li>)}</List>; };
    return render(items, 1);
}
