import type { ReactNode } from 'react';
import type { StructuredListContract } from '@unofficial-krds/contracts';
import { part, states } from '../../catalog-utils.js';
import { Badge } from '../badge/index.js';
export interface StructuredListProps extends StructuredListContract {
    title?: string;
    onToolbarAction?: (detail: {
        id: string;
    }) => void;
    itemActions?: Readonly<Record<string, ReactNode>>;
    pagination?: ReactNode;
}
export function StructuredList({ items, variant = 'list', toolbar, selection, sort, title = '목록', onToolbarAction, itemActions, pagination }: StructuredListProps) {
    const contents = (item: StructuredListProps['items'][number]) => <>{selection && <label><input type="checkbox" checked={selection.ids.includes(item.id)} onChange={() => selection.onChange({ ids: selection.ids.includes(item.id) ? selection.ids.filter(id => id !== item.id) : [...selection.ids, item.id] })}/>{item.title} 선택</label>}{item.image && <img src={item.image.src} alt={item.image.alt}/>}<div {...part('structured-list','content')}><h3 {...part('structured-list', 'header')}>{item.href ? <a {...part('structured-list', 'cta')} href={item.href}>{item.title}</a> : item.title}</h3><dl {...part('structured-list', 'metadata')}>{item.metadata.map((field, i) => <div key={i}><dt>{field.label}</dt><dd>{field.value ?? '—'}</dd></div>)}</dl>{item.tags?.map(tag => <Badge label={tag} key={tag}/>)}</div>{itemActions?.[item.id] && <div {...part('structured-list', 'actions')}>{itemActions[item.id]}</div>}</>;
    return <section {...part('structured-list', 'root', states(!items.length && 'empty', !!selection?.ids.length && 'selected'))} data-krds-variant={variant} aria-label={title}><h2>{title}</h2>{toolbar && <div {...part('structured-list', 'toolbar')}>{toolbar.map(action => <button type="button" key={action.id} disabled={action.disabled} onClick={() => onToolbarAction?.({ id: action.id })}>{action.label}</button>)}</div>}{sort && <button type="button"  onClick={() => sort.onChange({ key: sort.key, direction: sort.direction === 'ascending' ? 'descending' : 'ascending' })}>정렬 {sort.direction === 'ascending' ? '오름차순' : '내림차순'}</button>}{variant === 'table' ? <table {...part('structured-list', 'list', !items.length ? 'empty' : '')}><caption>{title}</caption><thead><tr><th scope="col">내용</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td {...part('structured-list', 'item', selection?.ids.includes(item.id) ? 'selected' : '')}>{contents(item)}</td></tr>)}</tbody></table> : <ul {...part('structured-list', 'list', !items.length ? 'empty' : '')}>{items.map(item => <li {...part('structured-list', 'item', selection?.ids.includes(item.id) ? 'selected' : '')} key={item.id}>{contents(item)}</li>)}</ul>}{!items.length && <p role="status">조회 결과가 없습니다.</p>}{pagination && <div {...part('structured-list', 'pagination')}>{pagination}</div>}</section>;
}
