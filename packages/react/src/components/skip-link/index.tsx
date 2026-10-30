import type { SkipLinkContract } from '@unofficial-krds/contracts';
import { part, unique } from '../../catalog-utils.js';
export type SkipLinkProps = SkipLinkContract;
export function SkipLink({ links, visibility = 'focus-revealed' }: SkipLinkProps) { unique(links.map(i => i.id), 'SkipLink'); return <nav {...part('skip-link', 'root')} data-krds-visibility={visibility} aria-label="건너뛰기"><ul {...part('skip-link', 'list')}>{links.map(link => <li key={link.id}><a {...part('skip-link', 'link')} href={`#${link.targetId}`} onClick={e => { const target = e.currentTarget.ownerDocument.getElementById(link.targetId); if (!target)
    return; e.preventDefault(); const prior = target.getAttribute('tabindex'); target.tabIndex = -1; target.focus(); target.scrollIntoView({ block: 'start' }); target.addEventListener('blur', () => { if (prior === null)
    target.removeAttribute('tabindex');
else
    target.setAttribute('tabindex', prior); }, { once: true }); }}>{link.label}</a></li>)}</ul></nav>; }
