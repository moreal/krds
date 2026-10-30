import { createSignal, Show } from 'solid-js';

export interface NativeProbeProps {
  count?: number;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  errorMessage?: string;
}

/** Test infrastructure only; it contributes no KRDS component coverage. */
export function NativeProbe(props: NativeProbeProps) {
  const [increment, setIncrement] = createSignal(0);
  return (
    <Show when={!props.errorMessage} fallback={<div role="alert">{props.errorMessage}</div>}>
      <button disabled={props.disabled || props.loading} onClick={() => setIncrement(value => value + 1)}>{props.label ?? 'Probe increment'}</button>
      <div role="status" aria-label="Probe value">{(props.count ?? 0) + increment()}</div>
    </Show>
  );
}
