import { children, createEffect, splitProps, type JSX } from 'solid-js';

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon';
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /** Decorative content after the action label; excluded from the accessible name. */
  icon?: JSX.Element;
}

/** Native button activation and form algorithms remain owned by the browser. */
export function Button(props: ButtonProps): JSX.Element {
  const [local, native] = splitProps(props, ['children', 'icon', 'variant', 'size', 'type', 'disabled']);
  const content = children(() => local.children);
  function validate() {
    if (!['primary', 'secondary', 'tertiary', 'text', 'icon'].includes(local.variant ?? 'primary')) throw new TypeError('Invalid Button variant');
    if (!['xsmall', 'small', 'medium', 'large', 'xlarge'].includes(local.size ?? 'medium')) throw new TypeError('Invalid Button size');
    if (!['button', 'submit', 'reset'].includes(local.type ?? 'button')) throw new TypeError('Invalid Button type');
  }
  validate();
  let label!: HTMLSpanElement;
  const root = <button {...native} type={local.type ?? 'button'} disabled={local.disabled}
    data-krds-component="button" data-krds-part="root" data-krds-state={local.disabled ? 'disabled' : ''}
    data-krds-variant={local.variant ?? 'primary'} data-krds-size={local.size ?? 'medium'}>
    <span ref={element => { label = element; }} data-krds-component="button" data-krds-part="label" data-krds-state="">{content()}</span>
    {local.icon != null && <span data-krds-component="button" data-krds-part="icon" data-krds-state="" aria-hidden="true">{local.icon}</span>}
  </button>;
  createEffect(() => {
    validate();
    content();
    const visibleLabel = label.cloneNode(true) as HTMLSpanElement;
    visibleLabel.querySelectorAll('[aria-hidden="true"], [hidden]').forEach(element => element.remove());
    if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim() && !visibleLabel.textContent?.trim()) throw new TypeError('Button requires an accessible action name');
  });
  return root;
}
