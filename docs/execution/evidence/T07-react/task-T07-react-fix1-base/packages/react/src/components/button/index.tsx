import { forwardRef, type ButtonHTMLAttributes } from 'react';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon';
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'primary', size = 'medium', type = 'button', children, ...props }, ref) {
  return <button {...props} ref={ref} type={type} data-krds-component="button" data-krds-part="root" data-krds-variant={variant} data-krds-size={size} data-krds-state={props.disabled ? 'disabled' : undefined}><span data-krds-component="button" data-krds-part="label">{children}</span></button>;
});
