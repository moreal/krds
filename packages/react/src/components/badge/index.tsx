import type { BadgeContract } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
export type BadgeProps = BadgeContract;
export function Badge({ label, appearance = 'outline', tone = 'secondary', size = 'medium', numeric = false }: BadgeProps) { if (!['outline', 'filled', 'pastel'].includes(appearance) || !['secondary', 'gray', 'point', 'danger', 'warning', 'success', 'information', 'disabled'].includes(tone) || !['small', 'medium', 'large'].includes(size))
    throw new TypeError('Unsupported Badge presentation.'); return <span {...part('badge', 'root', numeric ? 'numeric' : '')} data-krds-appearance={appearance} data-krds-tone={tone} data-krds-size={size}><span {...part('badge', 'label')}>{label}</span></span>; }
