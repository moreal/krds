import { useId, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import type { HelpPanelContract } from '@unofficial-krds/contracts';
import { part, useValue, focusSafe } from '../../catalog-utils.js';
import { NativeLayer, useNarrow } from '../../native-layer.js';
export interface HelpPanelProps extends HelpPanelContract {
    tutorialContent?: ReactNode;
    onModeRequest?: (mode: 'help' | 'tutorial') => void;
    delegateRestoration?: boolean;
    showOpener?:boolean; showTopicTriggers?:boolean;
}
export function HelpPanel({ topics, open, defaultOpen, onOpenChange, selectedTopicId, defaultSelectedTopicId, onTopicChange, mode = 'help', fallbackFocusId, tutorialContent, onModeRequest, delegateRestoration = false, showOpener=true, showTopicTriggers=true }: HelpPanelProps) {
    const id = useId();
    const narrow = useNarrow();
    const shown = useValue(open, defaultOpen, true, 'HelpPanel.open');
    const selected = useValue<string | null>(selectedTopicId, defaultSelectedTopicId, null, 'HelpPanel.topic');
    if (selected.current !== null && !topics.some(t => t.id === selected.current))
        throw new RangeError('Unknown HelpPanel topic.');
    const opener = useRef<HTMLButtonElement>(null);
    const panel = useRef<HTMLElement>(null);
    const initiating = useRef<HTMLElement | null>(null);
    const previous = useRef(shown.current);
    const firstNarrow = useRef(false);
    useLayoutEffect(() => { if (narrow && !firstNarrow.current) {
        firstNarrow.current = true;
        if (open === undefined && defaultOpen === undefined)
            shown.commit(false);
    } }, [narrow]);
    const restore = () => { if (!delegateRestoration)
        focusSafe(document, opener.current?.id, fallbackFocusId, initiating.current); };
    useLayoutEffect(() => { if (previous.current && !shown.current && !narrow)
        restore(); if (!previous.current && shown.current && !narrow)
        panel.current?.focus(); previous.current = shown.current; }, [shown.current, narrow]);
    const request = (next: boolean) => { if (next === shown.current)
        return; shown.commit(next); onOpenChange?.({ open: next }); };
    useLayoutEffect(()=>{if(shown.current&&selected.current!==null)panel.current?.focus();},[selected.current]);
    const lifetime=useRef({open:shown.current,narrow,restore});lifetime.current={open:shown.current,narrow,restore};
    useEffect(()=>()=>{if(lifetime.current.open&&!lifetime.current.narrow)lifetime.current.restore();},[]);
    const topic = topics.find(t => t.id === selected.current);
    const Root = (narrow ? 'div' : 'aside') as 'aside';
    const select = (next: string | null) => { if (selected.current !== next) { selected.commit(next); onTopicChange?.({ id: next }); } };
    const content = <Root {...part('help-panel', 'root', narrow ? 'open modal' : 'open')} id={`${id}-panel`} data-krds-layout={narrow ? 'narrow-modal' : 'desktop'} data-krds-mode={onModeRequest || mode === 'tutorial' ? mode : undefined} role={narrow ? undefined : 'complementary'} ref={panel} tabIndex={-1} aria-labelledby={`${id}-title`}><div {...part('help-panel', 'header')}><h2 {...part('help-panel', 'title')} id={`${id}-title`}>{mode === 'tutorial' ? '따라하기' : '도움말'}</h2>{onModeRequest && <div {...part('help-panel', 'tabs')}><button type="button" aria-pressed={mode === 'help'} onClick={() => onModeRequest('help')}>도움말</button><button type="button" aria-pressed={mode === 'tutorial'} onClick={() => onModeRequest('tutorial')}>따라하기</button></div>}<button {...part('help-panel', 'close')} type="button" onClick={() => request(false)}>도움말 닫기</button></div><div {...part('help-panel', 'body')}>{mode === 'tutorial' ? tutorialContent : topic ? <article><h3>{topic.title}</h3><p>{topic.content}</p><ul {...part('help-panel', 'related')}>{topic.relatedLinks.map((link, i) => <li key={i}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label} (새 창)</a></li>)}</ul><button type="button" onClick={() => select(null)}>목록으로</button></article> : <ul>{topics.map(item => <li key={item.id}><button type="button" onClick={() => select(item.id)}>{item.title}</button></li>)}</ul>}</div></Root>;
    return <>{showOpener&&<button {...part('help-panel', 'opener')} id={`${id}-opener`} ref={opener} type="button" aria-expanded={shown.current} aria-controls={`${id}-panel`} onClick={() => request(true)}>도움말 열기</button>}{showTopicTriggers&&topics.map(item => <button {...part('help-panel', 'topic-trigger')} key={item.id} type="button" onClick={e => { initiating.current = e.currentTarget; select(item.id); request(true); }}>{item.title} 도움말</button>)}{narrow ? <NativeLayer open={shown.current} titleId={`${id}-title`} onEscape={() => request(false)} onReleased={restore}>{content}</NativeLayer> : shown.current ? content : null}</>;
}
