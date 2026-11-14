import { useId, useRef, useEffect } from 'react';
import type { ResizeContract } from '@unofficial-krds/contracts';
import { part, useValue, useFloatingBox } from '../../catalog-utils.js';
export type ResizeProps = ResizeContract;
const defaults = [90, 100, 110, 130, 150].map(percent => ({ id: String(percent), label: `${percent}%`, percent }));
export function Resize({ levels = defaults, value, defaultValue, onValueChange, open, defaultOpen, onOpenChange }: ResizeProps) { const id = useId(); const selected = useValue(value, defaultValue, '100', 'Resize.value'); const visible = useValue(open, defaultOpen, false, 'Resize.open'); if (levels.length > 5 || !levels.some(l => l.id === selected.current))
    throw new RangeError('Resize needs at most five levels and a matching selected ID.'); const root = useRef<HTMLDivElement>(null); const trigger = useRef<HTMLButtonElement>(null);const popup=useRef<HTMLDivElement>(null);const floating=useFloatingBox(visible.current,trigger,popup); const request = (next: boolean) => { if (next === visible.current)
    return; visible.commit(next); onOpenChange?.({ open: next }); }; const choose = (next: string) => { if (next !== selected.current) {
    selected.commit(next);
    onValueChange?.({ value: next });
} }; useEffect(() => { if (!visible.current)
    return; const outside = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node))
    request(false); }; document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside); }, [visible.current]); return <div {...part('resize', 'root')} ref={root} onKeyDown={e => { if (e.nativeEvent.isComposing)
    return; if (e.key === 'Escape' && visible.current) {
    e.preventDefault();
    request(false);
    queueMicrotask(() => { if (!root.current?.querySelector('[data-krds-part="list"]:not([hidden])'))
        trigger.current?.focus(); });
} }}><button {...part('resize', 'trigger')} ref={trigger} type="button" aria-expanded={visible.current} aria-controls={id} onClick={() => request(!visible.current)} onKeyDown={e => { if (visible.current || e.nativeEvent.isComposing || !['ArrowUp', 'ArrowDown'].includes(e.key))
    return; e.preventDefault(); const index = levels.findIndex(l => l.id === selected.current); const next = levels[index + (e.key === 'ArrowUp' ? -1 : 1)]; if (next)
    choose(next.id); }}>화면 크기 <span {...part('resize', 'current')}>{levels.find(l => l.id === selected.current)?.label}</span></button><div ref={popup} style={floating} {...part('resize', 'list')} id={id} hidden={!visible.current}>{levels.map(level => <button key={level.id} {...part('resize', 'option', level.id === selected.current ? 'selected' : '')} type="button" aria-pressed={level.id === selected.current} onClick={() => { choose(level.id); request(false); trigger.current?.focus(); }}>{level.label}</button>)}</div></div>; }
