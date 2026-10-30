import { For, createEffect } from 'solid-js';
import type { SkipLinkContract } from '@unofficial-krds/contracts';
import { owned, focusTarget } from '../../internal/catalog';
export type SkipLinkProps = SkipLinkContract;
export function SkipLink(props: SkipLinkProps) {createEffect(()=>{if(props.links.length>3)throw new TypeError('SkipLink supports at most three links');}); return <nav {...owned('skip-link')} data-krds-visibility={props.visibility ?? 'focus-revealed'} aria-label="건너뛰기"><ul {...owned('skip-link','list')}><For each={props.links}>{link => <li {...owned('skip-link','item')}><a {...owned('skip-link', 'link')} href={`#${link.targetId}`} onClick={event => { const target = document.getElementById(link.targetId); if (!target) {event.preventDefault();throw new TypeError(`SkipLink target not found: ${link.targetId}`);} if (target) {
    event.preventDefault();
    focusTarget(target);
    target.scrollIntoView({ block: 'start' });
} }}>{link.label}</a></li>}</For></ul></nav>; }
