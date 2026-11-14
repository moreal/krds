import type { CriticalAlertContract } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
export type CriticalAlertProps = CriticalAlertContract;
export function CriticalAlert({ urgency, label, message, details }: CriticalAlertProps) { return <section {...part('critical-alert', 'root')} data-krds-urgency={urgency} role="banner" aria-label={label}><span {...part('critical-alert', 'icon')} aria-hidden="true">!</span><strong {...part('critical-alert', 'label')}>{label}</strong><p {...part('critical-alert', 'message')}>{message}</p>{details && <a {...part('critical-alert', 'link')} href={details.href} title={details.destinationTitle}>{details.label}</a>}</section>; }
