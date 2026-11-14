import { useControlledMode } from '../../use-controlled-mode.js';
import { useId, useLayoutEffect, useRef, useState, type ReactNode, type SelectHTMLAttributes } from 'react';
import type { SelectOption, ValueChangeDetails } from '@unofficial-krds/contracts';
export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'multiple' | 'value' | 'defaultValue' | 'onChange' | 'children'> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  size?: 'small' | 'medium' | 'large';
  onValueChange?: (details: ValueChangeDetails<string>) => void;
}
export function NativeSelect({ options, value, defaultValue, label, hint, error, invalid = false, size = 'medium', onValueChange, id: suppliedId, ...native }: NativeSelectProps) {
  const controlled = useControlledMode(value, defaultValue, 'NativeSelect');
  const generatedId = useId(); const id = suppliedId ?? generatedId;
  if (new Set(options.map(option => option.value)).size !== options.length) throw new TypeError('Select option values must be unique.');
  const initial = useRef(defaultValue ?? options.find(option => !option.disabled)?.value ?? '');
  const [local, setLocal] = useState(initial.current);
  const current = controlled ? value! : local;
  if (current !== '' && !options.some(option => option.value === current)) throw new RangeError('Select value must identify an option.');
  const control = useRef<HTMLSelectElement>(null);
  const latest = useRef(current); latest.current = current;
  const apply = (next: string) => { if (control.current) { control.current.value = next; if (!options.some(option => option.value === next)) control.current.selectedIndex = -1; } };
  useLayoutEffect(() => { apply(current); });
  useLayoutEffect(() => {
    const form = control.current?.form; if (!form) return;
    const reset = (event: Event) => { queueMicrotask(() => { if (event.defaultPrevented) return; const next = controlled ? latest.current : initial.current; if (!controlled) setLocal(next); apply(next); }); };
    form.addEventListener('reset', reset); return () => form.removeEventListener('reset', reset);
  });
  const state = [native.disabled && 'disabled', invalid && 'invalid'].filter(Boolean).join(' ');
  const describedBy = [native['aria-describedby'], hint != null && `${id}-hint`, error != null && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return <div data-krds-component="native-select" data-krds-part="root" data-krds-state={state}>
    {label != null && <label htmlFor={id} data-krds-component="native-select" data-krds-part="label" data-krds-state="">{label}</label>}
    <select {...native} id={id} ref={control} value={current} aria-invalid={invalid || undefined} aria-describedby={describedBy} data-krds-component="native-select" data-krds-part="control" data-krds-size={size} data-krds-state={state} onChange={event => {
      const next = event.currentTarget.value; if (next !== current) { if (!controlled) setLocal(next); onValueChange?.({ value: next }); }
      if (controlled) apply(latest.current);
    }}>{options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</select>
    {hint != null && <div id={`${id}-hint`} data-krds-component="native-select" data-krds-part="hint" data-krds-state="">{hint}</div>}
    {error != null && <div id={`${id}-error`} data-krds-component="native-select" data-krds-part="error" data-krds-state="">{error}</div>}
  </div>;
}
