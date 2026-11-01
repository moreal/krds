import { Show, type JSX } from 'solid-js';
import type { LinkContract } from '@unofficial-krds/contracts';
import { owned, safeRel } from '../../internal/catalog';
export type LinkProps = Omit<LinkContract, 'label'> & { label: JSX.Element; title?: string };
export function Link(props: LinkProps) { return <a style={{'text-decoration':props.underline===false?'none':undefined}} {...owned('link', 'root', props.disabled ? 'disabled' : props.target === '_blank' ? 'external' : '')} title={props.title} href={props.disabled ? undefined : props.href} aria-disabled={props.disabled ? 'true' : undefined} target={props.disabled ? undefined : props.target} rel={safeRel(props.target, props.rel)} data-krds-appearance={props.appearance ?? 'basic'} data-krds-size={props.size ?? 'medium'}><span {...owned('link', 'label')}>{props.label}</span><Show when={props.target === '_blank'}><span {...owned('link', 'icon')}> (새 창)</span></Show></a>; }
