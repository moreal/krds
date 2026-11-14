import type { TextListContract, TextListItem } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
export type TextListProps = TextListContract;
export function TextList({ ordered = false, marker = 'dot', items }: TextListProps) {
    const List = ordered ? 'ol' : 'ul';
    const render = (rows: readonly TextListItem[], depth: number) => { if (depth > 3)
        throw new RangeError('TextList supports at most three levels.'); return <List role="list" {...part('text-list', depth === 1 ? 'root' : 'nested-list')} data-krds-ordering={ordered ? 'ordered' : 'unordered'} data-krds-marker={ordered ? undefined : marker}>{rows.map(row => <li key={row.id} {...part('text-list', 'item', `level-${depth}`)}><span {...part('text-list', 'content')}>{row.content}</span>{row.children?.length ? render(row.children, depth + 1) : null}</li>)}</List>; };
    return render(items, 1);
}
