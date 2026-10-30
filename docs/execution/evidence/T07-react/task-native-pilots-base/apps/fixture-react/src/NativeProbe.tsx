/** Test infrastructure only; never KRDS component coverage. */
export interface NativeProbeProps {
  count: number;
  label: string;
  disabled: boolean;
  onChange: (value: number) => void;
}
export function NativeProbe({ count, label, disabled, onChange }: NativeProbeProps) {
  return <section aria-label="Native React infrastructure probe">
    <button disabled={disabled} onClick={() => onChange(count + 1)}>{label}</button>
    <div role="status" aria-label="Probe value">{count}</div>
  </section>;
}
