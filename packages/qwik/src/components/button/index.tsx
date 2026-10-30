import { component$, Slot, type QwikIntrinsicElements } from '@builder.io/qwik';
import { attrs } from '../../internal/behavior';
export type ButtonProps = QwikIntrinsicElements['button'] & {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon';
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
};
export const Button = component$<ButtonProps>((props) => {
    const { variant = 'primary', size = 'medium', type = 'button', ...native } = props;
    if (!['primary', 'secondary', 'tertiary', 'text', 'icon'].includes(variant) || !['xsmall', 'small', 'medium', 'large', 'xlarge'].includes(size) || !['button', 'submit', 'reset'].includes(type))
        throw new TypeError('Invalid Button option');
    return <button {...native} type={type} data-krds-variant={variant} data-krds-size={size} {...attrs('button', 'root', props.disabled ? 'disabled' : '')}><Slot /></button>;
});
