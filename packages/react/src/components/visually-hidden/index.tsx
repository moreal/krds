import type { VisuallyHiddenContract } from '@unofficial-krds/contracts';
import { type CSSProperties, type ReactElement, type ReactNode, cloneElement, isValidElement } from 'react';
import { part } from '../../catalog-utils.js';
export interface VisuallyHiddenProps extends VisuallyHiddenContract {
    children?: ReactNode;
    surrogate?: ReactNode;
}
const clipping: CSSProperties = { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 };
export function VisuallyHidden({ id, lang, content, variant = 'text', children, surrogate }: VisuallyHiddenProps) { if (variant === 'interactive-overlay') {
    if (!isValidElement(children) || !['input', 'button', 'select', 'textarea'].includes(String(children.type)))
        throw new TypeError('Interactive overlay requires one actual native control.');
    return <span {...part('visually-hidden', 'root', 'interactive-overlay')} data-krds-variant={variant} id={id} lang={lang} style={{ position: 'relative', display: 'inline-block' }}>{cloneElement(children as ReactElement<Record<string, unknown>>, { ...part('visually-hidden', 'overlay-control'), tabIndex: 0 })}<span {...part('visually-hidden', 'visible-surrogate')} aria-hidden="true">{surrogate ?? content}</span></span>;
} return <span {...part('visually-hidden', 'root', 'text')} data-krds-variant={variant} id={id} lang={lang} style={clipping}>{children ?? content}</span>; }
