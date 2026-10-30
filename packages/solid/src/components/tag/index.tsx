import { For, Show, createSignal, createEffect, createUniqueId, onMount, onCleanup } from 'solid-js';
import type { TagContract } from '@unofficial-krds/contracts';
import { owned, keyedItems, focusTarget, ignoredKey } from '../../internal/catalog';

export type TagProps = TagContract;
export function Tag(props: TagProps) {
  const items = keyedItems(() => props.items);
  const uid = createUniqueId();
  const [active, setActive] = createSignal(props.items.find(item => !item.disabled)?.id);
  let list!: HTMLUListElement; onMount(()=>{const entry=(event:KeyboardEvent)=>{if(event.key==='Tab'&&!list.contains(event.target as Node))setActive(props.items.find(item=>!item.disabled)?.id);};document.addEventListener('keydown',entry,true);onCleanup(()=>document.removeEventListener('keydown',entry,true));});
  let pending: { id: string; order: string[] } | undefined;
  let armed: HTMLButtonElement | undefined;
  const control = (id: string) => document.getElementById(`${uid}-${id}`);
  createEffect(() => {
    const eligible = props.items.filter(item => !item.disabled).map(item => item.id);
    if (!eligible.includes(active() ?? '')) setActive(eligible[0]);
    if (pending && !props.items.some(item => item.id === pending!.id)) {
      const { id, order } = pending;
      pending = undefined;
      const index = order.indexOf(id);
      const destination = order.slice(0, index).reverse().find(id => eligible.includes(id)) ?? order.slice(index + 1).find(id => eligible.includes(id));
      if (destination) setActive(destination);
      queueMicrotask(() => focusTarget(destination ? control(destination) : list));
    }
  });
  const activate = (id: string) => {
    if (props.mode === 'removable') {
      pending = { id, order: props.items.map(item => item.id) };
      props.onRemove?.({ id });
    } else if (props.mode === 'toggle') {
      props.onSelectionChange?.({ ids: props.selectedIds?.includes(id) ? props.selectedIds.filter(value => value !== id) : [...(props.selectedIds ?? []), id] });
    } else if (props.mode === 'add-filter') {
      props.onAdd?.({ id });
      queueMicrotask(() => { if (props.appliedBarId) focusTarget(document.getElementById(props.appliedBarId)); });
    }
  };
  const keydown = (event: KeyboardEvent & { currentTarget: HTMLButtonElement }) => {
    if (!['Enter', ' '].includes(event.key)) return;
    const ignored = ignoredKey(event);
    event.preventDefault();
    if (!ignored && !event.repeat) armed = event.currentTarget;
  };
  const keyup = (event: KeyboardEvent & { currentTarget: HTMLButtonElement }) => {
    if (!['Enter', ' '].includes(event.key)) return;
    const target = armed;
    armed = undefined;
    const ignored = ignoredKey(event);
    event.preventDefault();
    if (!ignored && target === event.currentTarget) target.click();
  };
  return <div role={props.mode&&props.mode!=='static'?'group':undefined} {...owned('tag')} data-krds-mode={props.mode ?? 'static'}>
    <ul ref={list} tabIndex={-1} {...owned('tag', 'list')} onKeyDown={event => {
      if (ignoredKey(event) || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const controls = [...list.querySelectorAll<HTMLElement>('button:not(:disabled),a[href]')];
      if (!controls.length) return;
      event.preventDefault();
      const index = controls.indexOf(document.activeElement as HTMLElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + controls.length) % controls.length;
      controls[next]!.focus();
    }}><For each={items()}>{item => <li {...owned('tag', 'item', props.selectedIds?.includes(item.id) ? 'selected' : '')}>
      <Show when={props.mode === 'link'} fallback={<Show when={['toggle', 'add-filter'].includes(props.mode ?? '')} fallback={<>
        <span {...owned('tag', 'label')}>{item.label}</span><Show when={props.mode === 'removable'}><button id={`${uid}-${item.id}`} type="button" {...owned('tag', 'remove')} disabled={item.disabled} tabIndex={!item.disabled && active() === item.id ? 0 : -1} onFocus={() => setActive(item.id)} onBlur={() => { armed = undefined; }} aria-label={`${item.label} 옵션 삭제`} onKeyDown={keydown} onKeyUp={keyup} onClick={() => activate(item.id)}>×</button></Show>
      </>}><button id={`${uid}-${item.id}`} type="button" {...owned('tag', 'label')} disabled={item.disabled} tabIndex={!item.disabled && active() === item.id ? 0 : -1} onFocus={() => setActive(item.id)} onBlur={() => { armed = undefined; }} aria-pressed={props.mode === 'toggle' ? props.selectedIds?.includes(item.id) ?? false : undefined} aria-label={props.mode === 'add-filter' ? `${item.label} 필터 옵션 추가` : undefined} onKeyDown={keydown} onKeyUp={keyup} onClick={() => activate(item.id)}>{item.label}</button></Show>}>
        <a id={`${uid}-${item.id}`} href={item.disabled ? undefined : item.href} aria-disabled={item.disabled || undefined} tabIndex={!item.disabled && active() === item.id ? 0 : -1} onFocus={() => setActive(item.id)}>{item.label}</a>
      </Show>
    </li>}</For></ul>
    <Show when={props.onClear && props.items.length && ['toggle', 'removable', 'add-filter'].includes(props.mode ?? 'static')}><button type="button" {...owned('tag', 'clear')} onClick={() => props.onClear?.()}>전체 삭제</button></Show>
  </div>;
}
