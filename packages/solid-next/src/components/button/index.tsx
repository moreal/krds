import { omit } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { part } from '../../internal/native';
export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon';
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    icon?: JSX.Element;
}
/** Activation, submitter data, validation, and reset use the native button algorithm. */
export function Button(props: ButtonProps) {
    const native = omit(props, 'variant', 'size', 'icon', 'children', 'type');
    return <button {...native} type={props.type ?? 'button'} {...part('button', 'root', props.disabled ? 'disabled' : '')} data-krds-variant={props.variant ?? 'primary'} data-krds-size={props.size ?? 'medium'}><span {...part('button', 'label')}>{props.children}</span>{props.icon != null && <span aria-hidden="true" {...part('button', 'icon')}>{props.icon}</span>}</button>;
}
