import { For, Show, createEffect, createRenderEffect, createSignal, onMount, onCleanup } from 'solid-js';
import type { CarouselContract } from '@unofficial-krds/contracts';
import { owned, keyedItems, stateValue, ignoredKey } from '../../internal/catalog';
export type CarouselProps = CarouselContract;
export function Carousel(props: CarouselProps) {
    const stableItems = keyedItems(() => props.items, 'id');
    const index = stateValue(() => props.index, props.defaultIndex, 0);
    const intent = stateValue(() => props.playing, props.defaultPlaying, props.autoplay ?? false);
    const [manualStop,setManualStop]=createSignal(false);
    const [hover, setHover] = createSignal(false), [latch, setLatch] = createSignal(false), [hidden, setHidden] = createSignal(true), [reduced, setReduced] = createSignal(true);
    let root!: HTMLDivElement; const [compact,setCompact]=createSignal(typeof window!=='undefined'&&matchMedia('(max-width: 1022px)').matches); let priorIndex=index.read(); createRenderEffect(()=>{const next=index.read();if(next!==priorIndex&&root){const previous=root.querySelectorAll<HTMLElement>('[data-krds-part="slide"]')[priorIndex];if(previous?.contains(document.activeElement))root.querySelector<HTMLButtonElement>('[data-krds-part="play-pause"]')?.focus();}priorIndex=next;}); onMount(()=>{const media=matchMedia('(max-width: 1022px)');const update=()=>{setCompact(media.matches);const indicators=root.querySelector('[data-krds-part="indicators"]');if(media.matches&&indicators?.contains(document.activeElement))root.querySelector<HTMLButtonElement>('[data-krds-part="play-pause"]')?.focus();};update();media.addEventListener('change',update);onCleanup(()=>media.removeEventListener('change',update));});
    let start: {
        x: number;
        y: number;
    } | undefined;
    const canNext = () => props.loop || index.read() < props.items.length - 1;
    const actual = () => intent.read() && !latch() && !hover() && !hidden() && !reduced() && props.items.length > 1 && canNext();
    const move = (next: number, reason: 'previous' | 'next' | 'indicator' | 'swipe' | 'timer') => { if (props.items.length < 2)
        return; const target = props.loop ? (next + props.items.length) % props.items.length : Math.min(props.items.length - 1, Math.max(0, next)); if (reason !== 'timer') {
        setLatch(true);
        if (intent.read()) {
            intent.request(false);
            props.onPlayingChange?.({ playing: false, reason: 'navigation' });
        }
    } if (target === index.read())
        return; index.request(target); props.onIndexChange?.({ index: target, reason }); };
    onMount(() => { const media = matchMedia('(prefers-reduced-motion: reduce)'); const change = () => setReduced(media.matches), visibility = () => setHidden(document.hidden); change(); visibility(); media.addEventListener('change', change); document.addEventListener('visibilitychange', visibility); onCleanup(() => { media.removeEventListener('change', change); document.removeEventListener('visibilitychange', visibility); }); });
    createEffect(() => { if (!actual())
        return; const timer = setInterval(() => { if (actual())
        move(index.read() + 1, 'timer'); }, Math.max(100, props.intervalMs ?? 6000)); onCleanup(() => clearInterval(timer)); });
    return <div ref={root} {...owned('carousel', 'root', actual() ? 'playing' : 'paused')} role="region" aria-roledescription="캐러셀" aria-label="슬라이드" data-krds-layout={props.layout ?? 'single'} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocusIn={event => { if (!root.contains(event.relatedTarget as Node))
        setLatch(true); }} onPointerDown={event => { if (event.pointerType === 'touch')
        start = { x: event.clientX, y: event.clientY }; }} onPointerUp={event => { if (start) {
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
            move(index.read() + (dx < 0 ? 1 : -1), 'swipe');
        start = undefined;
    } }} onPointerCancel={() => start = undefined} onKeyDown={event => { if (ignoredKey(event) || !(event.target as HTMLElement).matches('[data-krds-part="indicator"]'))
        return; if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        move(index.read() + (event.key === 'ArrowRight' ? 1 : -1), 'indicator');
    } }}><Show when={props.items.length > 1}><button type="button" {...owned('carousel', 'play-pause')} onClick={() => { if (actual()) {
        setManualStop(true);setLatch(true);
        if (intent.read()) {
            intent.request(false);
            props.onPlayingChange?.({ playing: false, reason: 'stop' });
        }
    }
    else {
        setManualStop(false);setLatch(false);
        if (!intent.read()) {
            intent.request(true);
            props.onPlayingChange?.({ playing: true, reason: 'play' });
        }
    } }}>{actual() ? '정지' : '재생'}</button><Show when={intent.read()&&!actual()}><button type="button" {...owned('carousel','stop-intent',manualStop()?'paused disabled':'paused')} disabled={manualStop()} onClick={()=>{if(manualStop())return;setManualStop(true);setLatch(true);intent.request(false);props.onPlayingChange?.({playing:false,reason:'stop'});}}>자동 재생 중지</button></Show></Show><div {...owned('carousel', 'viewport')}><For each={stableItems()}>{(item, i) => <section {...owned('carousel', 'slide', i() === index.read() ? 'active' : 'hidden')} role="group" aria-roledescription="슬라이드" aria-label={`${i() + 1} / ${props.items.length}: ${item.label}`} hidden={i() !== index.read()} inert={i() !== index.read()}><h3>{item.label}</h3><p>{item.content}</p></section>}</For></div><Show when={props.items.length > 1}><button type="button" {...owned('carousel', 'previous')} disabled={!props.loop && index.read() === 0} onClick={() => move(index.read() - 1, 'previous')}>이전 슬라이드</button><div hidden={compact()} {...owned('carousel', 'indicators')}><For each={stableItems()}>{(item, i) => <button type="button" {...owned('carousel', 'indicator', i() === index.read() ? 'active' : '')} aria-label={`${i() + 1} ${item.label} 슬라이드`} aria-current={i() === index.read() ? 'true' : undefined} onClick={() => move(i(), 'indicator')}>{i() + 1}</button>}</For></div><span hidden={!compact()} {...owned('carousel', 'position')}>{index.read() + 1} / {props.items.length}</span><button type="button" {...owned('carousel', 'next')} disabled={!canNext()} onClick={() => move(index.read() + 1, 'next')}>다음 슬라이드</button></Show></div>;
}
