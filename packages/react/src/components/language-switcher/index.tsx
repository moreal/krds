import { useId, useRef, useEffect } from 'react';
import type { LanguageSwitcherContract } from '@unofficial-krds/contracts';
import { part, useValue, focusSafe, useFloatingBox } from '../../catalog-utils.js';
export type LanguageSwitcherProps = LanguageSwitcherContract;
export function LanguageSwitcher({ currentLocale, options, onLocaleRequest, open, defaultOpen, onOpenChange }: LanguageSwitcherProps) { const id = useId(); const state = useValue(open, defaultOpen, false, 'LanguageSwitcher'); const root = useRef<HTMLDivElement>(null); const trigger = useRef<HTMLButtonElement>(null);const popup=useRef<HTMLUListElement>(null);const floating=useFloatingBox(state.current,trigger,popup); const request = (next: boolean) => { if (next === state.current)
    return; state.commit(next); onOpenChange?.({ open: next }); }; useEffect(() => { if (!state.current)
    return; const outside = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node))
    request(false); }; document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside); }, [state.current]); const list = <ul ref={popup} style={options.length<3?{position:'static',margin:0}:floating} {...part('language-switcher', 'list', options.length<3||state.current ? 'open' : 'closed')} id={id}>{options.map(option => <li key={option.locale}><a {...part('language-switcher', 'option', currentLocale === option.locale ? 'current' : '')} href={option.href} lang={option.locale} aria-label={option.nativeLabel} aria-current={currentLocale === option.locale ? 'true' : undefined} target={option.separateService ? '_blank' : undefined} rel={option.separateService ? 'noopener noreferrer' : undefined} onClick={e => { if (onLocaleRequest && !option.separateService && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    if (option.locale !== currentLocale)
        onLocaleRequest({ locale: option.locale, href: option.href });
    request(false);
} }}>{option.nativeLabel}{option.translatedLabel !== option.nativeLabel ? ` (${option.translatedLabel})` : ''}{option.separateService ? ' (새 창)' : ''}</a></li>)}</ul>; return <div {...part('language-switcher', 'root', `${state.current ? 'open' : 'closed'} current`)} ref={root} onKeyDown={e => { if (e.key === 'Escape' && !e.nativeEvent.isComposing && state.current) {
    e.preventDefault();
    request(false);
    queueMicrotask(() => { if (trigger.current?.getAttribute('aria-expanded')==='false')
        trigger.current?.focus(); });
} }}>{options.length >= 3 ? <><button {...part('language-switcher', 'trigger', state.current ? 'open' : 'closed')} ref={trigger} type="button" aria-expanded={state.current} aria-controls={id} onClick={() => request(!state.current)}>언어: {options.find(o => o.locale === currentLocale)?.nativeLabel ?? currentLocale}</button><div hidden={!state.current}>{list}</div></> : list}</div>; }
