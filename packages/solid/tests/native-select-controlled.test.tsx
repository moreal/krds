import { afterEach, expect, test } from 'vitest';
import { render } from 'solid-js/web';
import { createSignal, onMount, type JSX } from 'solid-js';
import * as K from '../src';
const cleanup: (() => void)[] = [];
afterEach(() => { cleanup.splice(0).reverse().forEach(dispose => dispose()); });
function mount(view: () => JSX.Element) { const host = document.createElement('div'); document.body.append(host); const dispose = render(view, host); cleanup.push(() => { dispose(); host.remove(); }); return host; }
const records = [{ id: 'default' }, { id: 'secondary' }];
test('controlled NativeSelect keeps its value when a host effect replaces option objects', () => {
  function Host() {
    const [selected, setSelected] = createSignal('default');
    // Mirrors a host that derives fresh option objects from the same selection signal and commits the real selection in an effect.
    const options = () => records.filter(() => selected() !== undefined).map(record => ({ value: record.id, label: record.id }));
    onMount(() => setSelected('secondary'));
    return <K.NativeSelect label="예시" value={selected()} options={options()} onValueChange={({ value }) => setSelected(value)}/>;
  }
  const host = mount(() => <Host/>);
  const select = host.querySelector('select')!;
  expect(select.value).toBe('secondary');
  expect(select.selectedIndex).toBe(1);
});
test('controlled NativeSelect keeps its value when option objects are replaced outside an effect', () => {
  const [value, setValue] = createSignal('b');
  const [options, setOptions] = createSignal([{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]);
  const host = mount(() => <K.NativeSelect label="Choice" value={value()} options={options()} onValueChange={({ value }) => setValue(value)}/>);
  const select = host.querySelector('select')!;
  expect(select.value).toBe('b');
  setOptions(options().map(option => ({ ...option })));
  expect(select.value).toBe('b');
  setValue('a');
  expect(select.value).toBe('a');
});
