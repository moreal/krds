import type { LinkContract } from '@unofficial-krds/contracts';
import type { ReactNode, MouseEventHandler } from 'react';
import { part } from '../../catalog-utils.js';
export interface LinkProps extends LinkContract {
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}
export function Link({ href, label, target, rel, disabled = false, appearance = 'basic', size = 'medium', underline = true, children, onClick }: LinkProps) { return <a {...part('link', 'root', disabled ? 'disabled' : target === '_blank' ? 'external' : '')} data-krds-appearance={appearance} data-krds-size={size} style={underline ? undefined : { textDecoration: 'none' }} href={disabled ? undefined : href} aria-disabled={disabled || undefined} role={disabled ? 'link' : undefined} target={disabled ? undefined : target} rel={target === '_blank' ? [rel, 'noopener noreferrer'].filter(Boolean).join(' ') : rel} onClick={disabled ? e => e.preventDefault() : onClick}><span {...part('link', 'label')}>{children ?? label}</span>{target === '_blank' && <span {...part('link', 'icon')}> (새 창)</span>}</a>; }
