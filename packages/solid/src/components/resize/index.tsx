import { For, Show, createUniqueId, onMount, onCleanup } from 'solid-js';
import type { ResizeContract } from '@unofficial-krds/contracts';
import { owned, stateValue, ignoredKey } from '../../internal/catalog';
export type ResizeProps = ResizeContract;
export function Resize(props: ResizeProps) { const uid = createUniqueId(); const levels = () => props.levels ?? [90, 100, 110, 130, 150].map(percent => ({ id: String(percent), label: `${percent}%`, percent })); const value = stateValue(() => props.value, props.defaultValue, '100', value => props.onValueChange?.({ value })); const open = stateValue(() => props.open, props.defaultOpen, false, open => props.onOpenChange?.({ open })); let trigger!: HTMLButtonElement, root!: HTMLDivElement; onMount(()=>{const outside=(event:PointerEvent)=>{if(open.read()&&!root.contains(event.target as Node))open.request(false);};document.addEventListener('pointerdown',outside);onCleanup(()=>document.removeEventListener('pointerdown',outside));}); return <div ref={root} {...owned('resize')} onKeyDown={event => { if (ignoredKey(event))
    return; if (event.key === 'Escape' && open.read()) {
    event.preventDefault();
    open.request(false);
    queueMicrotask(() => { if (!open.read())
        trigger.focus(); });
}
else if (!open.read() && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    const index = levels().findIndex(level => level.id === value.read());
    const next = levels()[index + (event.key === 'ArrowDown' ? 1 : -1)];
    if (next)
        value.request(next.id);
} }}><button ref={trigger} type="button" {...owned('resize', 'trigger')} aria-expanded={open.read()} aria-controls={uid} onClick={() => open.request(!open.read())}>화면 크기 <span {...owned('resize', 'current')}>{levels().find(level => level.id === value.read())?.label}</span></button><div id={uid} {...owned('resize', 'list')} hidden={!open.read()}><For each={levels()}>{level => <button type="button" {...owned('resize', 'option', value.read() === level.id ? 'selected' : '')} aria-pressed={value.read() === level.id} onClick={() => { value.request(level.id); open.request(false); queueMicrotask(() => { if (!open.read())
    trigger.focus(); }); }}>{level.label}</button>}</For></div></div>; }
