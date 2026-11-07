import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { CarouselContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type CarouselProps = NativeContract<CarouselContract>;
export const Carousel = component$<CarouselProps>((props) => { const index = useField<number>(props, 'index', 'defaultIndex', 0), intent = useField<boolean>(props, 'playing', 'defaultPlaying', props.autoplay ?? false), compact=useSignal(true),manual = useSignal(false), latch = useSignal(false), hover = useSignal(false), hidden = useSignal(true), reduced = useSignal(true), root = useSignal<HTMLDivElement>(), start = useSignal<{
    x: number;
    y: number;
}>(); const visible=useComputed$(()=>{const count=props.layout==='multiple'&&!compact.value?Math.min(3,props.items.length):1;return props.items.map((_,i)=>Array.from({length:count},(_,offset)=>props.loop?(index.value.value+offset)%props.items.length:index.value.value+offset).includes(i));});useVisibleTask$(({cleanup})=>{const media=matchMedia('(max-width: 1022px)'),update=()=>compact.value=media.matches;update();media.addEventListener('change',update);cleanup(()=>media.removeEventListener('change',update));},{strategy:'document-ready'});const actual = useComputed$(() => intent.value.value && !latch.value && !hover.value && !hidden.value && !reduced.value && props.items.length > 1 && (props.loop || index.value.value < props.items.length - 1)); const move = $(async (next: number, reason: 'previous' | 'next' | 'indicator' | 'swipe' | 'timer') => { if (props.items.length < 2)
    return; const target = props.loop ? (next + props.items.length) % props.items.length : Math.min(props.items.length - 1, Math.max(0, next)); if (reason !== 'timer') {
    latch.value = true;
    await intent.request(false, () => props.onPlayingChange$?.({ playing: false, reason: 'navigation' }));
} if (target !== index.value.value) {
    await index.request(target, () => props.onIndexChange$?.({ index: target, reason }));
} }); useVisibleTask$(({ cleanup }) => { const element=root.value;const focus=(event:FocusEvent)=>{if(!element?.contains(event.relatedTarget as Node))latch.value=true;};const enter=()=>hover.value=true,leave=()=>hover.value=false;const key=(event:KeyboardEvent)=>{if(ignoredKey(event)||!(event.target as HTMLElement).matches('[data-krds-part="indicator"]')||!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();void move(index.value.value+(event.key==='ArrowRight'?1:-1),'indicator');};element?.addEventListener('focusin',focus);element?.addEventListener('mouseenter',enter);element?.addEventListener('mouseleave',leave);element?.addEventListener('keydown',key);cleanup(()=>{element?.removeEventListener('focusin',focus);element?.removeEventListener('mouseenter',enter);element?.removeEventListener('mouseleave',leave);element?.removeEventListener('keydown',key);});
const media = matchMedia('(prefers-reduced-motion: reduce)'), change = () => reduced.value = media.matches, visibility = () => hidden.value = document.hidden; change(); visibility(); media.addEventListener('change', change); document.addEventListener('visibilitychange', visibility); cleanup(() => { media.removeEventListener('change', change); document.removeEventListener('visibilitychange', visibility); }); }, { strategy: 'document-ready' }); useVisibleTask$(({ track, cleanup }) => { if (!track(() => actual.value))
    return; const timer = setInterval(() => { if (actual.value)
    void move(index.value.value + 1, 'timer'); }, Math.max(100, props.intervalMs ?? 6000)); cleanup(() => clearInterval(timer)); }, { strategy: 'document-ready' });
// Text children are plain render values. A derived-signal text child of a spread-prop (non-static) element subscribes in
// the host group, every host re-render clears that group, and Qwik 1's diff of an existing signal text vnode neither
// re-tracks nor rewrites it: after a timer-advance re-render, later focus/Play changes would never reach the text.
// (A bare `actual.value` alias would be inlined back into a derived signal by the optimizer, so whole strings are computed.)
const playLabel = actual.value ? '정지' : '재생', positionText = `${index.value.value + 1} / ${props.items.length}`; return <div ref={root} {...owned('carousel', 'root', actual.value ? 'playing' : 'paused')} role="region" aria-roledescription="캐러셀" aria-label="슬라이드" data-krds-layout={props.layout ?? 'single'} onMouseEnter$={() => hover.value = true} onMouseLeave$={() => hover.value = false} onFocusIn$={e => { if (!root.value?.contains(e.relatedTarget as Node))
    latch.value = true; }} onPointerDown$={e => { if (e.pointerType === 'touch')
    start.value = { x: e.clientX, y: e.clientY }; }} onPointerUp$={e => { if (start.value) {
    const dx = e.clientX - start.value.x, dy = e.clientY - start.value.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
        void move(index.value.value + (dx < 0 ? 1 : -1), 'swipe');
    start.value = undefined;
} }} onPointerCancel$={() => start.value = undefined}>{props.items.length > 1 && <><button type="button" {...owned('carousel', 'play-pause')} onClick$={async () => { if (actual.value) {
    manual.value = true;
    latch.value = true;
    await intent.request(false, () => props.onPlayingChange$?.({ playing: false, reason: 'stop' }));
}
else {
    manual.value = false;
    latch.value = false;
    await intent.request(true, () => props.onPlayingChange$?.({ playing: true, reason: 'play' }));
} }}>{playLabel}</button>{intent.value.value && !actual.value && <button type="button" {...owned('carousel', 'stop-intent', manual.value ? 'paused disabled' : 'paused')} disabled={manual.value} onClick$={async () => { if (manual.value)
    return; manual.value = true; latch.value = true; await intent.request(false); await props.onPlayingChange$?.({ playing: false, reason: 'stop' }); }}>자동 재생 중지</button>}</>}<div {...owned('carousel', 'viewport')}><div {...owned('carousel','list')}>{props.items.map((item, i) => <section key={item.id} {...owned('carousel', 'slide', visible.value[i] ? i===index.value.value?'active':'' : 'hidden')} role="group" aria-roledescription="슬라이드" aria-label={`${i + 1} / ${props.items.length}: ${item.label}`} hidden={!visible.value[i]} inert={!visible.value[i]}><h3>{item.label}</h3><p>{item.content}</p></section>)}</div></div>{props.items.length > 1 && <><button type="button" {...owned('carousel', 'previous')} disabled={!props.loop && index.value.value === 0} onClick$={() => move(index.value.value - 1, 'previous')}>이전 슬라이드</button><div {...owned('carousel', 'indicators')} hidden={compact.value}>{props.items.map((item, i) => <button key={item.id} type="button" {...owned('carousel', 'indicator', i === index.value.value ? 'active' : '')} aria-label={`${i + 1} ${item.label} 슬라이드`} aria-current={i === index.value.value ? 'true' : undefined} onClick$={() => move(i, 'indicator')}>{i + 1}</button>)}</div><span {...owned('carousel', 'position')}>{positionText}</span><button type="button" {...owned('carousel', 'next')} disabled={!props.loop && index.value.value >= props.items.length - 1} onClick$={() => move(index.value.value + 1, 'next')}>다음 슬라이드</button></>}</div>; });
