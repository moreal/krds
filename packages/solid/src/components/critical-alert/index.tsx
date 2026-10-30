import { Show } from 'solid-js';
import type { CriticalAlertContract } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';
export type CriticalAlertProps = CriticalAlertContract;
export function CriticalAlert(props: CriticalAlertProps) { return <section {...owned('critical-alert')} data-krds-urgency={props.urgency} role="banner" aria-label={props.label}><span {...owned('critical-alert','icon')} aria-hidden="true">!</span><strong {...owned('critical-alert', 'label')}>{props.label}</strong><p {...owned('critical-alert', 'message')}>{props.message}</p><Show when={props.details}>{details => <a {...owned('critical-alert', 'link')} href={details().href} title={details().destinationTitle}>{details().label}</a>}</Show></section>; }
