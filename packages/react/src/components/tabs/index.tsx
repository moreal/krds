import { useControlledMode } from '../../use-controlled-mode.js';
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import type { ValueChangeDetails } from '@unofficial-krds/contracts';
export interface TabItem { value: string; label: ReactNode; panel: ReactNode; disabled?: boolean; id?: string; }
export interface TabsProps { items: TabItem[]; value?: string; defaultValue?: string; onValueChange?: (details: ValueChangeDetails<string>) => void; activationMode?: 'manual' | 'automatic'; orientation?: 'horizontal' | 'vertical'; id?: string; label?: ReactNode; 'aria-label'?: string; 'aria-labelledby'?: string; }
export function Tabs(props: TabsProps) {
  const controlled = useControlledMode(props.value, props.defaultValue, 'Tabs');
  const generatedId = useId(); const id = props.id ?? generatedId;
  const enabled = props.items.filter(item => !item.disabled);
  if (props.items.some(item => !item.value) || new Set(props.items.map(item => item.value)).size !== props.items.length) throw new TypeError('Tabs require unique nonempty values.');
  const [local, setLocal] = useState(props.defaultValue ?? enabled[0]?.value ?? '');
  const selected = controlled ? props.value! : local;
  if (enabled.length ? !enabled.some(item => item.value === selected) : selected !== '') throw new RangeError('Selected tab must be enabled.');
  const root = useRef<HTMLDivElement>(null); const focusRequest = useRef<string | null>(null);
  const orientation = props.orientation ?? 'horizontal'; const automatic = props.activationMode === 'automatic';
  const select = (value: string) => { if (value !== selected) { if (!controlled) setLocal(value); props.onValueChange?.({ value }); } };
  useLayoutEffect(() => {
    root.current?.querySelectorAll<HTMLElement>('[role="tabpanel"]').forEach(panel => {
      const first = panel.firstElementChild as HTMLElement | null;
      panel.tabIndex = first?.matches('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]') ? -1 : 0;
    });
  });
  return <div ref={root} data-krds-component="tabs" data-krds-part="root" data-krds-state="">
    {props.label != null && <div id={`${id}-label`}>{props.label}</div>}
    <div role="tablist" aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby'] ?? (props.label != null ? `${id}-label` : undefined)} aria-orientation={orientation} data-krds-component="tabs" data-krds-part="list" data-krds-state="" data-krds-orientation={orientation}>
      {props.items.map((item, index) => <button key={item.value} id={item.id ?? `${id}-tab-${index}`} type="button" role="tab" disabled={item.disabled} tabIndex={item.disabled ? -1 : 0} aria-selected={selected === item.value} aria-controls={`${id}-panel-${index}`} data-krds-component="tabs" data-krds-part="trigger" data-krds-state={[selected === item.value && 'selected', item.disabled && 'disabled'].filter(Boolean).join(' ')}
        onFocus={() => { if (automatic) { focusRequest.current = item.value; select(item.value); } }}
        onBlur={() => { focusRequest.current = null; }}
        onPointerDown={() => { focusRequest.current = null; }}
        onClick={() => { if (automatic && focusRequest.current === item.value) { focusRequest.current = null; return; } select(item.value); }}
        onKeyDown={event => {
          if (event.nativeEvent.isComposing || event.keyCode === 229) return;
          const previous = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'; const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
          if (![previous, next, 'Home', 'End'].includes(event.key)) { focusRequest.current = null; return; }
          event.preventDefault(); const currentIndex = enabled.findIndex(entry => entry.value === item.value);
          const target = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled.at(-1) : enabled[(currentIndex + (event.key === previous ? -1 : 1) + enabled.length) % enabled.length];
          const targetIndex = props.items.indexOf(target!);
          // getElementById avoids CSS escaping React's stable useId token.
          root.current?.ownerDocument.getElementById(target?.id ?? `${id}-tab-${targetIndex}`)?.focus();
        }}>{item.label}</button>)}
    </div>
    {props.items.map((item, index) => <div key={item.value} id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={item.id ?? `${id}-tab-${index}`} hidden={selected !== item.value} data-krds-component="tabs" data-krds-part="panel" data-krds-state={selected === item.value ? 'active' : 'inactive'}>{item.panel}</div>)}
  </div>;
}
