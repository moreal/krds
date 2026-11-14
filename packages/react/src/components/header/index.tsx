import { useId, useRef, useState, type ReactNode } from 'react';
import type { HeaderContract } from '@unofficial-krds/contracts';
import { part, safeRel, useValue } from '../../catalog-utils.js';
import { MainMenu } from '../main-menu/index.js';
import { Masthead } from '../masthead/index.js';
import { SkipLink } from '../skip-link/index.js';
export interface HeaderProps extends HeaderContract {
    governmentService?: boolean;
    specimen?: boolean;
    mainContentId?: string;
    utilityContent?: ReactNode;
    navigationContent?:ReactNode;
}
export function Header({ home, utilityItems, search, mainNavigation, actionLayout = 'horizontal', sticky = false, governmentService = false, specimen = false, mainContentId = 'main-content', utilityContent, navigationContent, currentId, mobileOpen, defaultMobileOpen, onMobileOpenChange, mobileTriggerId, mobileTriggerLabel = '메뉴', navigationLabel }: HeaderProps) {
    const id = useId();
    const [expanded, setExpanded] = useState(false);
    // The Header owns the visible mobile trigger; the composed MainMenu keeps the layer and returns focus to it.
    const mobile = useValue(mobileOpen, defaultMobileOpen, false, 'Header.mobile');
    const mobileTrigger = useRef<HTMLButtonElement>(null);
    const requestMobile = (next: boolean) => { if (next === mobile.current) return; mobile.commit(next); onMobileOpenChange?.({ open: next }); };
    const collapsible = utilityItems.length > 4;
    return <><SkipLink links={[{ id: 'main', label: '본문 바로가기', targetId: mainContentId }]}/>{(governmentService || specimen) && <Masthead governmentService={governmentService}/>}<header {...part('header', 'root', sticky ? 'sticky' : '')} data-krds-action-layout={actionLayout}>
        <a {...part('header', 'identity')} href={home.href} target={home.target} rel={safeRel(home.target, home.rel)} aria-label={home.label} aria-describedby={home.target === '_blank' ? `${id}-identity-window` : undefined}><img src={home.logo.src} alt={home.logo.alt}/>{home.target === '_blank' && <span id={`${id}-identity-window`}> (새 창)</span>}</a>
        <div {...part('header', 'utilities')}>
            {collapsible && <button {...part('header', 'utility-trigger', expanded ? 'expanded' : 'collapsed')} type="button" aria-expanded={expanded} aria-controls={`${id}-utilities`} onClick={() => setExpanded(!expanded)}>유틸리티 메뉴</button>}
            <ul id={`${id}-utilities`} hidden={collapsible && !expanded}>{utilityItems.map((item, index) => <li key={item.id ?? index}><a href={item.href} target={item.target} rel={safeRel(item.target, item.rel)}>{item.label}{item.target === '_blank' && <span> (새 창)</span>}</a></li>)}</ul>
            {utilityContent}
        </div>
        <div {...part('header', 'actions')}>
            {search && <button {...part('header', 'search')} type="button" onClick={search.onRequest}>{search.label}</button>}
            {mainNavigation.length > 0 && <button {...part('header', 'mobile-trigger', mobile.current ? 'expanded' : 'collapsed')} id={mobileTriggerId} ref={mobileTrigger} type="button" aria-expanded={mobile.current} aria-controls={`${id}-navigation`} onClick={() => requestMobile(!mobile.current)}>{mobileTriggerLabel}</button>}
        </div>
        {(mainNavigation.length > 0 || navigationContent !== undefined) && <div id={`${id}-navigation`} {...part('header', 'navigation')}>{navigationContent !== undefined ? navigationContent : <MainMenu label={navigationLabel} mobileTriggerRef={mobileTrigger} items={mainNavigation} currentId={currentId} mobileOpen={mobile.current} onMobileOpenChange={({ open }) => requestMobile(open)}/>}</div>}
    </header></>;
}
