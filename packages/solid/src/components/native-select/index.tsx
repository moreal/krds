import { createEffect, createSignal, createUniqueId, For, onCleanup, onMount, Show, splitProps, type JSX } from 'solid-js';
import type { SelectOption, ValueChangeDetails } from '@unofficial-krds/contracts';

export interface NativeSelectProps extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'value' | 'size' | 'multiple'> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  label?: JSX.Element;
  hint?: JSX.Element;
  error?: JSX.Element;
  invalid?: boolean;
  size?: 'small' | 'medium' | 'large';
  onValueChange?: (details: ValueChangeDetails<string>) => void;
}

/** Platform single-select with authoritative Solid state and native form participation. */
export function NativeSelect(props: NativeSelectProps): JSX.Element {
  const [local, native] = splitProps(props, ['options', 'value', 'defaultValue', 'label', 'hint', 'error', 'invalid', 'size', 'id', 'disabled', 'onValueChange', 'onChange', 'ref', 'aria-describedby']);
  const generatedId = `krds-select-${createUniqueId()}`;
  const id = () => local.id ?? generatedId;
  const controlled = local.value !== undefined;
  if (controlled && local.defaultValue !== undefined) throw new TypeError('NativeSelect value and defaultValue are mutually exclusive');
  const initialValue = controlled ? local.value! : local.defaultValue ?? local.options.find(option => !option.disabled)?.value ?? '';
  const [uncontrolledValue, setUncontrolledValue] = createSignal(initialValue);
  const value = () => controlled ? local.value! : uncontrolledValue();
  const state = () => [local.disabled && 'disabled', local.invalid && 'invalid'].filter(Boolean).join(' ');
  let control!: HTMLSelectElement;
  let labelElement: HTMLLabelElement | undefined;
  let disposed = false;

  function validate() {
    if ((local.value !== undefined) !== controlled) throw new TypeError('NativeSelect cannot change controlled mode');
    if (controlled && local.defaultValue !== undefined) throw new TypeError('NativeSelect value and defaultValue are mutually exclusive');
    if (!['small', 'medium', 'large'].includes(local.size ?? 'medium')) throw new TypeError('Invalid NativeSelect size');
    const values = new Set<string>();
    for (const option of local.options) {
      if (typeof option.value !== 'string' || typeof option.label !== 'string' || values.has(option.value)) throw new TypeError('NativeSelect options require unique string values and string labels');
      values.add(option.value);
    }
    if (typeof value() !== 'string' || (value() !== '' && !values.has(value()))) throw new TypeError('NativeSelect value must exist in options');
    if (local.label == null && !props['aria-label']?.trim() && !props['aria-labelledby']?.trim()) throw new TypeError('NativeSelect requires an accessible name');
  }
  validate();

  function restoreSelection() {
    if (!control) return;
    const selectedValue = value();
    if (selectedValue === '' && !local.options.some(option => option.value === '')) control.selectedIndex = -1;
    else control.value = selectedValue;
  }

  const handleChange: JSX.ChangeEventHandler<HTMLSelectElement, Event> = event => {
    const next = event.currentTarget.value;
    const option = local.options.find(option => option.value === next);
    try {
      if (!local.disabled && option && !option.disabled && next !== value()) {
        if (!controlled) setUncontrolledValue(next);
        local.onValueChange?.({ value: next });
      }
      const handler = local.onChange;
      if (typeof handler === 'function') handler(event);
      else if (handler) handler[0](handler[1], event);
    } finally {
      // A declined controlled request does not invalidate a Solid dependency.
      restoreSelection();
    }
  };

  const root = <div data-krds-component="native-select" data-krds-part="root" data-krds-state={state()}>
    <Show when={local.label != null}><label ref={element => { labelElement = element; }} for={id()} data-krds-component="native-select" data-krds-part="label" data-krds-state="">{local.label}</label></Show>
    <select {...native} ref={element => { control = element; if (typeof local.ref === 'function') local.ref(element); }}
      id={id()} disabled={local.disabled} aria-invalid={local.invalid ? 'true' : undefined}
      aria-describedby={[local['aria-describedby'], local.hint != null && `${id()}-hint`, local.error != null && `${id()}-error`].filter(Boolean).join(' ') || undefined}
      onChange={handleChange} data-krds-component="native-select" data-krds-part="control" data-krds-state={state()} data-krds-size={local.size ?? 'medium'}>
      <For each={local.options}>{option => <option value={option.value} selected={option.value === value()} disabled={option.disabled}>{option.label}</option>}</For>
    </select>
    <Show when={local.hint != null}><div id={`${id()}-hint`} data-krds-component="native-select" data-krds-part="hint" data-krds-state="">{local.hint}</div></Show>
    <Show when={local.error != null}><div id={`${id()}-error`} data-krds-component="native-select" data-krds-part="error" data-krds-state="">{local.error}</div></Show>
  </div>;

  createEffect(() => {
    validate();
    // Conservative presence guard, not a complete accessible-name computation.
    // Preserve visually hidden text and native image text alternatives; ignore
    // decorative descendants without rejecting fields in inactive ancestors.
    const accessibleLabel = local.label != null ? labelElement?.cloneNode(true) as HTMLLabelElement | undefined : undefined;
    accessibleLabel?.querySelectorAll('[aria-hidden="true"], [hidden]').forEach(element => element.remove());
    const hasImageAlternative = [...accessibleLabel?.querySelectorAll('img[alt], [role="img"][aria-label]') ?? []]
      .some(element => Boolean(element.getAttribute('alt')?.trim() || element.getAttribute('aria-label')?.trim()));
    if (!props['aria-label']?.trim() && !props['aria-labelledby']?.trim() && !accessibleLabel?.textContent?.trim() && !hasImageAlternative) throw new TypeError('NativeSelect requires an accessible name');
    restoreSelection();
  });
  onMount(() => {
    const ownerDocument = control.ownerDocument;
    const reset = (event: Event) => {
      if (event.target !== control.form) return;
      queueMicrotask(() => {
        if (disposed || event.defaultPrevented || event.target !== control.form) return;
        if (!controlled) setUncontrolledValue(initialValue);
        restoreSelection();
      });
    };
    ownerDocument.addEventListener('reset', reset, true);
    onCleanup(() => { disposed = true; ownerDocument.removeEventListener('reset', reset, true); });
    restoreSelection();
  });
  return root;
}
