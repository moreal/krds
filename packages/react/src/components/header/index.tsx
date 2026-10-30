import { useId, useState, type ReactNode } from 'react';
import type { HeaderContract } from '@unofficial-krds/contracts';
import { part, states } from '../../catalog-utils.js';
import { MainMenu } from '../main-menu/index.js';
import { Masthead } from '../masthead/index.js';
import { SkipLink } from '../skip-link/index.js';
import { Link } from '../link/index.js';
export interface HeaderProps extends HeaderContract {
    governmentService?: boolean;
    specimen?: boolean;
    mainContentId?: string;
    utilityContent?: ReactNode;
    navigationContent?:ReactNode;
}
export function Header({ home, utilityItems, search, mainNavigation, actionLayout = 'horizontal', sticky = false, governmentService = false, specimen = false, mainContentId = 'main-content', utilityContent, navigationContent, currentId, mobileOpen, defaultMobileOpen, onMobileOpenChange, mobileTriggerId, mobileTriggerLabel, navigationLabel }: HeaderProps) { const id = useId(); const [expanded, setExpanded] = useState(false); return <><SkipLink links={[{ id: 'main', label: '본문 바로가기', targetId: mainContentId }]}/>{(governmentService || specimen) && <Masthead governmentService={governmentService}/>}<header {...part('header', 'root', states(expanded ? 'expanded' : 'collapsed', sticky && 'sticky'))} data-krds-action-layout={actionLayout} style={sticky ? { position: 'sticky', top: 0 } : undefined}><div {...part('header', 'identity')}><a href={home.href} aria-label={home.label}><img src={home.logo.src} alt={home.logo.alt}/></a></div><div {...part('header', 'utilities')}>{utilityItems.length >= 5 ? <><button {...part('header', 'utility-trigger', expanded ? 'expanded' : 'collapsed')} type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)}>유틸리티 메뉴</button><ul id={id} hidden={!expanded}>{utilityItems.map(item => <li key={item.id}><Link {...item}/></li>)}</ul></> : utilityItems.map(item => <Link key={item.id} {...item}/>)}{utilityContent}{search && <button {...part('header', 'search')} type="button" onClick={search.onRequest}>{search.label}</button>}</div><div {...part('header','navigation')}>{navigationContent!==undefined?navigationContent:<MainMenu items={mainNavigation} currentId={currentId} mobileOpen={mobileOpen} defaultMobileOpen={defaultMobileOpen} onMobileOpenChange={onMobileOpenChange} mobileTriggerId={mobileTriggerId} mobileTriggerLabel={mobileTriggerLabel} label={navigationLabel} mobileTriggerComponent="header"/>}</div></header></>; }
