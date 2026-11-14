import { component$ } from '@builder.io/qwik';
import type { LinkContract } from '@unofficial-krds/contracts';
import { owned, safeRel, type NativeContract } from '../../internal/catalog';
export type LinkProps = NativeContract<LinkContract>;
export const Link = component$<LinkProps>((props) => { return <a {...owned('link', 'root', props.disabled ? 'disabled' : props.target === '_blank' ? 'external' : '')} href={props.disabled ? undefined : props.href} aria-disabled={props.disabled ? 'true' : undefined} role={props.disabled ? 'link' : undefined} target={props.disabled ? undefined : props.target} rel={safeRel(props.target, props.rel)} data-krds-appearance={props.appearance ?? 'basic'} data-krds-size={props.size ?? 'medium'} data-krds-underline={String(props.underline ?? true)}><span {...owned('link', 'label')}>{props.label}</span>{props.target === '_blank' && <span {...owned('link', 'icon')}> (새 창)</span>}</a>; });
