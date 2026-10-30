import type { SpinnerContract } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
export interface SpinnerProps extends SpinnerContract {
    layout?: 'inline' | 'region';
}
export function Spinner({ pending, value, label, completionMessage, size = 'medium', layout = 'inline' }: SpinnerProps) {
    if (value !== undefined && (!Number.isFinite(value) || value < 0 || value > 100)) throw new RangeError('Spinner percentage must be 0..100.');
    const token = `${pending ? 'pending' : 'complete'} ${value === undefined ? 'indeterminate' : 'determinate'}`;
    const message = pending ? value === undefined ? label : `${value}% ${label}` : completionMessage;
    return <div {...part('spinner', 'root', token)} data-krds-size={size} data-krds-layout={layout} aria-busy={pending}>
        {pending && value === undefined ? <span {...part('spinner', 'track', token)} role="progressbar" aria-label={label}>
            <span {...part('spinner', 'indicator', token)} aria-hidden="true"/>
        </span> : <svg {...part('spinner', 'track', token)} viewBox="0 0 24 24" style={{ display: pending ? undefined : 'none' }} role={pending ? 'progressbar' : undefined} aria-label={pending ? label : undefined} aria-valuenow={pending ? value : undefined} aria-valuemin={pending ? 0 : undefined} aria-valuemax={pending ? 100 : undefined} aria-hidden={!pending || undefined}>
            {pending ? <>
                <circle cx="12" cy="12" r="9" pathLength="100" fill="none" stroke="var(--krds-light-color-border-gray-darker)" strokeWidth="2" strokeDasharray="1 3"/>
                <circle {...part('spinner', 'indicator', token)} cx="12" cy="12" r="9" pathLength="100" strokeDasharray={`${value} ${100 - value!}`} aria-hidden="true"/>
            </> : <path {...part('spinner', 'indicator', 'complete')} d="m5 12 4 4L19 6" aria-hidden="true"/>}
        </svg>}
        <span {...part('spinner', 'label', pending ? 'pending' : 'complete')}>{message}</span>
        <span {...part('spinner', 'status', pending ? 'pending' : 'complete')} role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap', border: 0 }}>{pending ? label : completionMessage}</span>
    </div>;
}
