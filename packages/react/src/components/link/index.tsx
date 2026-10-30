import type { LinkContract } from '@unofficial-krds/contracts';
import type { ReactNode, MouseEventHandler } from 'react';
import { part, states } from '../../catalog-utils.js';
export interface LinkProps extends LinkContract {
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}
export function Link({ href, label, target, rel, disabled = false, appearance = 'basic', size = 'medium', underline = true, children, onClick }: LinkProps) { return <a {...part('link', 'root', states(disabled && 'disabled', target === '_blank' && 'external'))} data-krds-appearance={appearance} data-krds-size={size} data-krds-underline={underline} style={!disabled&&!underline?{textDecoration:'none'}:undefined} href={disabled ? undefined : href} aria-disabled={disabled || undefined} target={disabled ? undefined : target} rel={target === '_blank' ? [rel, 'noopener noreferrer'].filter(Boolean).join(' ') : rel} onClick={disabled ? e => e.preventDefault() : onClick}>{children ?? label}{target === '_blank' && <span {...part('link', 'icon')}> (새 창)</span>}</a>; }
