import { component$, useSignal } from '@builder.io/qwik';

export interface NativeProbeProps { count?: number; label?: string; disabled?: boolean; errorMessage?: string; }

/** Infrastructure only. Native Qwik state and local args; no component coverage. */
export const NativeProbe = component$<NativeProbeProps>((props) => {
  const count = useSignal(props.count ?? 0);
  return props.errorMessage
    ? <div role="alert">{props.errorMessage}</div>
    : <section><button disabled={props.disabled} onClick$={() => count.value++}>{props.label}</button>
      <div role="status" aria-label="Probe value">{count.value}</div></section>;
});
