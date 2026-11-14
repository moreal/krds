import type { ReactNode } from 'react';
import type { StructuredListContract } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
export interface StructuredListProps extends StructuredListContract {
    title?: string;
    onToolbarAction?: (detail: {
        id: string;
    }) => void;
    itemActions?: Readonly<Record<string, ReactNode>>;
    pagination?: ReactNode;
}
export function StructuredList({ items, variant = 'list', toolbar, selection, sort, title, onToolbarAction, itemActions, pagination }: StructuredListProps) {
    const contents = (item: StructuredListProps['items'][number]) => <>{item.image && <img {...part('structured-list', 'preview')} src={item.image.src} alt={item.image.alt}/>}<div {...part('structured-list','content')}><h3>{item.href ? <a {...part('structured-list', 'cta')} href={item.href}>{item.title}</a> : item.title}</h3><dl {...part('structured-list', 'metadata')}>{item.metadata.map((field, i) => <div key={i}><dt>{field.label}</dt><dd>{field.value ?? '—'}</dd></div>)}</dl><div {...part('structured-list', 'tags')}>{item.tags?.map(tag => <span key={tag}>{tag}</span>)}</div></div>{selection && <input type="checkbox" data-selection-id={item.id} aria-label={`${item.title} 선택`} checked={selection.ids.includes(item.id)} onChange={() => selection.onChange({ ids: selection.ids.includes(item.id) ? selection.ids.filter(id => id !== item.id) : [...selection.ids, item.id] })}/>}{itemActions && <div {...part('structured-list', 'actions')}>{itemActions[item.id]}</div>}</>;
    return <section {...part('structured-list', 'root', items.length ? '' : 'empty')} data-krds-variant={variant}>{title && <h2 {...part('structured-list', 'header')}>{title}</h2>}<div {...part('structured-list', 'toolbar')}>{toolbar?.map(action => <button type="button" key={action.id} disabled={action.disabled} onClick={() => onToolbarAction?.({ id: action.id })}>{action.label}</button>)}{sort && <button type="button"  onClick={() => sort.onChange({ key: sort.key, direction: sort.direction === 'ascending' ? 'descending' : 'ascending' })}>정렬 {sort.direction === 'ascending' ? '오름차순' : '내림차순'}</button>}</div>{variant === 'table' ? <table {...part('structured-list', 'list')}><caption>{title ?? '목록'}</caption><thead><tr><th scope="col">항목</th></tr></thead><tbody>{items.map(item => <tr {...part('structured-list', 'item')} key={item.id}><td>{contents(item)}</td></tr>)}</tbody></table> : <ul {...part('structured-list', 'list')}>{items.map(item => <li {...part('structured-list', 'item', selection?.ids.includes(item.id) ? 'selected' : '')} key={item.id}>{contents(item)}</li>)}</ul>}{!items.length && <p role="status">조회 결과가 없습니다.</p>}{pagination && <div {...part('structured-list', 'pagination')}>{pagination}</div>}</section>;
}
