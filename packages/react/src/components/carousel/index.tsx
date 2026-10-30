import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { CarouselContract } from '@unofficial-krds/contracts';
import { part, states, useValue, unique } from '../../catalog-utils.js';
export interface CarouselProps extends CarouselContract {
    label?: string;
    content?: Readonly<Record<string, ReactNode>>;
}
export function Carousel({ items, index, defaultIndex, onIndexChange, layout = 'single', autoplay = false, intervalMs = 6000, playing, defaultPlaying, onPlayingChange, loop = false, label = '캐러셀', content }: CarouselProps) {
    const id = useId();
    const slide = useValue(index, defaultIndex, 0, 'Carousel.index');
    const intent = useValue(playing, defaultPlaying, autoplay, 'Carousel.playing');
    unique(items.map(i => i.id), 'Carousel');
    if (!items.length || !Number.isInteger(slide.current) || slide.current < 0 || slide.current >= items.length || !Number.isFinite(intervalMs) || intervalMs <= 0)
        throw new RangeError('Invalid Carousel items, index or interval.');
    const root = useRef<HTMLElement>(null);
    const playButton = useRef<HTMLButtonElement>(null);
    const [hover, setHover] = useState(false);
    const [stopped, setStopped] = useState(false);
    const [visible, setVisible] = useState(true);
    const [reduced, setReduced] = useState(true);
    const [narrow, setNarrow] = useState(false);
    const start = useRef<{
        x: number;
        y: number;
    } | undefined>(undefined);
    const permitted = intent.current && items.length > 1 && (loop || slide.current < items.length - 1) && visible && !hover && !stopped && !reduced;
    const latest = useRef({ slide, onIndexChange, permitted });
    latest.current = { slide, onIndexChange, permitted };
    useEffect(() => { const motion = window.matchMedia('(prefers-reduced-motion: reduce)'); const width = window.matchMedia('(max-width: 1022px)'); const update = () => { setReduced(motion.matches); setNarrow(width.matches); setVisible(document.visibilityState === 'visible'); }; update(); motion.addEventListener('change', update); width.addEventListener('change', update); document.addEventListener('visibilitychange', update); return () => { motion.removeEventListener('change', update); width.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); }; }, []);
    const move = (next: number, reason: 'previous' | 'next' | 'indicator' | 'swipe' | 'timer') => { const normalized = loop ? (next + items.length) % items.length : Math.min(items.length - 1, Math.max(0, next)); if (reason !== 'timer') {
        setStopped(true);
        if (intent.current) {
            intent.commit(false);
            onPlayingChange?.({ playing: false, reason: 'navigation' });
        }
    } if (normalized === slide.current)
        return; const focused = root.current?.ownerDocument.activeElement; const activeSlide = focused?.closest('[data-krds-part="slide"]'); if (activeSlide && root.current?.contains(activeSlide))
        playButton.current?.focus(); slide.commit(normalized); onIndexChange?.({ index: normalized, reason }); };
    const moveRef = useRef(move);
    moveRef.current = move;
    useEffect(() => { if (!permitted)
        return; const timer = setInterval(() => { if (latest.current.permitted)
        moveRef.current(latest.current.slide.current + 1, 'timer'); }, intervalMs); return () => clearInterval(timer); }, [permitted, intervalMs, items.length, slide.current]);
    return <section {...part('carousel', 'root', states('active', permitted ? 'playing' : 'paused'))} data-krds-layout={layout} data-krds-indicator={narrow ? 'fraction' : 'dots'} aria-label={label} aria-roledescription="캐러셀" ref={root} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onFocusCapture={e => { if (!e.currentTarget.contains(e.relatedTarget as Node))
        setStopped(true); }} onPointerDown={e => { if (e.pointerType === 'touch')
        start.current = { x: e.clientX, y: e.clientY }; }} onPointerUp={e => { const point = start.current; start.current = undefined; if (point && Math.abs(e.clientX - point.x) > 50 && Math.abs(e.clientX - point.x) > Math.abs(e.clientY - point.y))
        move(slide.current + (e.clientX < point.x ? 1 : -1), 'swipe'); }} onPointerCancel={() => { start.current = undefined; }}>{items.length > 1 && <button {...part('carousel', 'play-pause', permitted ? 'playing' : 'paused')} ref={playButton} type="button" onClick={() => { const next = !permitted; if (next)
        setStopped(false);
    else
        setStopped(true); if (next !== intent.current) {
        intent.commit(next);
        onPlayingChange?.({ playing: next, reason: next ? 'play' : 'stop' });
    } }}>{permitted ? '정지' : '재생'}</button>}{items.length>1&&intent.current&&!permitted&&<button {...part('carousel','stop-intent','paused')} type="button" onClick={()=>{setStopped(true);intent.commit(false);onPlayingChange?.({playing:false,reason:'stop'});}}>자동 재생 중지</button>}<div {...part('carousel', 'viewport', permitted ? 'playing' : 'paused')}>{items.map((item, i) => <div {...part('carousel', 'slide', i === slide.current ? 'active' : 'hidden')} key={item.id} id={`${id}-${i}`} role="group" aria-roledescription="슬라이드" aria-label={`${i + 1} / ${items.length}: ${item.label}`} hidden={i !== slide.current} inert={i !== slide.current}>{content?.[item.id] ?? item.content}</div>)}</div>{items.length > 1 && <><button {...part('carousel', 'previous', !loop && slide.current === 0 ? 'disabled' : '')} type="button" disabled={!loop && slide.current === 0} onClick={() => move(slide.current - 1, 'previous')}>이전 슬라이드</button><span {...part('carousel', 'position')} aria-live={permitted ? 'off' : 'polite'}>{slide.current + 1} / {items.length}</span>{!narrow && <div {...part('carousel', 'indicators')}>{items.map((item, i) => <button {...part('carousel', 'indicator', i === slide.current ? 'active' : '')} type="button" key={item.id} aria-label={`${i + 1}번 슬라이드`} aria-current={i === slide.current ? 'true' : undefined} onClick={() => move(i, 'indicator')} onKeyDown={e => { if (e.nativeEvent.isComposing)
        return; if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        move(slide.current + (e.key === 'ArrowLeft' ? -1 : 1), 'indicator');
    } }}>●</button>)}</div>}<button {...part('carousel', 'next', !loop && slide.current === items.length - 1 ? 'disabled' : '')} type="button" disabled={!loop && slide.current === items.length - 1} onClick={() => move(slide.current + 1, 'next')}>다음 슬라이드</button></>}</section>;
}
