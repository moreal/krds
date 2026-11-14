import { For, Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from 'solid-js';
import type { PaginationContract } from '@unofficial-krds/contracts';
import { owned, stateValue, focusTarget, ignoredKey, resetField } from '../../internal/catalog';
import { narrowViewport } from '../../internal/panel';

export type PaginationProps = PaginationContract;
export function Pagination(props: PaginationProps) {
  const page = stateValue(() => props.page, props.defaultPage, 1, page => props.onPageChange?.({ page }));
  const [draft, setDraft] = createSignal(String(page.read()));
  const [submitted, setSubmitted] = createSignal(false);
  const narrow = narrowViewport();
  const uid = createUniqueId();
  let root!: HTMLElement;
  type AppendRequest={before:number;total:number;sawPending:boolean};
  const [appendRequest,setAppendRequest]=createSignal<AppendRequest>();
  let appendObserver:MutationObserver|undefined;
  const cancelAppend=()=>{appendObserver?.disconnect();appendObserver=undefined;setAppendRequest(undefined);};
  onCleanup(()=>{appendObserver?.disconnect();setAppendRequest(undefined);});
  createEffect(()=>{
    const ticket=appendRequest(),more=props.loadMore;if(!ticket)return;
    if(!more||more.total!==ticket.total||more.shown<ticket.before){cancelAppend();return;}
    if(more.pending){ticket.sawPending=true;return;}
    if(more.shown>ticket.before){
      const focusAppend=()=>{const actual=props.loadMore;if(appendRequest()!==ticket||!actual||actual.pending||actual.shown<=ticket.before)return;const target=actual.firstNewItemId?document.getElementById(actual.firstNewItemId):null;if(target){target.scrollIntoView({block:'nearest',behavior:'instant'});focusTarget(target);cancelAppend();}};
      queueMicrotask(()=>{if(appendRequest()!==ticket)return;focusAppend();if(appendRequest()===ticket&&props.loadMore?.firstNewItemId&&!appendObserver){appendObserver=new MutationObserver(focusAppend);appendObserver.observe(root.ownerDocument.body,{childList:true,subtree:true});}});
    }else if(ticket.sawPending)cancelAppend();
  });
  const invalid = () => !/^\d+$/.test(draft()) || !Number.isSafeInteger(Number(draft())) || Number(draft()) < 1 || Number(draft()) > props.pageCount;
  createEffect(() => { setDraft(String(page.read())); setSubmitted(false); });
  resetField(() => root, () => { setDraft(String(page.read())); setSubmitted(false); });
  const go = () => { setSubmitted(true); if (!invalid()) page.request(Number(draft())); };
  const request = (number: number, event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (number < 1 || number > props.pageCount || number === page.read()) { event.preventDefault(); return; }
    if (props.onPageChange) { event.preventDefault(); page.request(number); }
  };
  const numbers = createMemo<(number | 'start-gap' | 'end-gap')[]>(() => {
    const total = props.pageCount, budget = narrow() ? 7 : 11;
    if (total <= budget) return Array.from({ length: total }, (_, index) => index + 1);
    const radius = narrow() ? 1 : 3;
    let first = Math.max(2, page.read() - radius), last = Math.min(total - 1, page.read() + radius);
    const size = () => 2 + last - first + 1 + Number(first > 2) + Number(last < total - 1);
    while (size() < budget) {
      if (first > 2) first--;
      else if (last < total - 1) last++;
      else break;
    }
    return [1, ...(first > 2 ? ['start-gap' as const] : []), ...Array.from({ length: last - first + 1 }, (_, index) => first + index), ...(last < total - 1 ? ['end-gap' as const] : []), total];
  });
  return <nav ref={root} {...owned('pagination')} data-krds-variant={props.variant ?? 'number-links'} aria-label={props.variant==='load-more'?'결과 더보기':'페이지 이동'}>
    <Show when={props.variant === 'load-more'} fallback={<>
      <Show when={page.read() > 1}><a {...owned('pagination', 'previous')} href={props.hrefForPage(page.read() - 1)} rel="prev" onClick={event => request(page.read() - 1, event)}>이전</a></Show>
      <Show when={props.variant === 'direct-page'} fallback={<ol {...owned('pagination', 'list')}><For each={numbers()}>{number => <li {...owned('pagination','item')}><Show when={typeof number === 'number'} fallback={<span {...owned('pagination','ellipsis')}>…</span>}><a {...owned('pagination', 'link', number === page.read() ? 'current' : '')} href={number === page.read() ? undefined : props.hrefForPage(number as number)} aria-current={number === page.read() ? 'page' : undefined} tabIndex={number === page.read() ? -1 : undefined} onClick={event => request(number as number, event)}>{number}</a></Show></li>}</For></ol>}>
        <label for={`${uid}-input`}>페이지</label><input id={`${uid}-input`} {...owned('pagination', 'input', submitted() && invalid() ? 'invalid' : '')} inputMode="numeric" type="text" value={draft()} aria-invalid={submitted() && invalid() || undefined} aria-describedby={submitted() && invalid() ? `${uid}-error` : undefined} onInput={event => setDraft(event.currentTarget.value)} onKeyDown={event => { if (event.key !== 'Enter') return; const ignored = ignoredKey(event); event.preventDefault(); if (!ignored) go(); }}/>
        <span {...owned('pagination','total')}>/ {props.pageCount}</span><button type="button" {...owned('pagination', 'go')} onClick={go}>이동</button>
        <Show when={submitted() && invalid()}><p id={`${uid}-error`} role="status">1부터 {props.pageCount} 사이의 페이지를 입력하세요.</p></Show>
      </Show>
      <Show when={page.read() < props.pageCount}><a {...owned('pagination', 'next')} href={props.hrefForPage(page.read() + 1)} rel="next" onClick={event => request(page.read() + 1, event)}>다음</a></Show>
    </>}><Show when={props.loadMore}>{more => <><p {...owned('pagination', 'count')} role="status">{more().shown} / {more().total}</p><button type="button" {...owned('pagination', 'load-more', more().pending ? 'pending' : '')} disabled={more().pending || more().shown >= more().total} onClick={() => { cancelAppend();setAppendRequest({before:more().shown,total:more().total,sawPending:false});try{more().onLoadMore();}catch(error){cancelAppend();throw error;} }}>더 보기</button></>}</Show></Show>
  </nav>;
}
