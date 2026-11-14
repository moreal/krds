import type { SpinnerContract } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
export interface SpinnerProps extends SpinnerContract {
    layout?: 'inline' | 'region';
}
export function Spinner({ pending, value, label, completionMessage, size = 'medium', layout = 'inline' }: SpinnerProps) {
    if (value !== undefined && (!Number.isFinite(value) || value < 0 || value > 100)) throw new RangeError('Spinner percentage must be 0..100.');
    return <div {...part('spinner', 'root', pending ? 'pending' : 'complete')} aria-busy={pending} data-krds-size={size} data-krds-layout={layout === 'inline' ? undefined : layout}>
        {pending && <progress {...part('spinner', 'indicator', value === undefined ? 'indeterminate' : 'determinate')} aria-label={label} max={100} value={value} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}/>}
        <span {...part('spinner', 'label')}><span {...part('spinner', 'status')} role="status" aria-live="polite">{pending ? label : completionMessage}</span></span>
    </div>;
}
