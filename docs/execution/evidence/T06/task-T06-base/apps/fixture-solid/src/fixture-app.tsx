import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { WorkspaceProbe } from '@krds-native/solid';
import { createFixtureBridge } from '@krds-native/test-contracts/driver';

/** Native test infrastructure. This is deliberately not a KRDS implementation. */
export function FixtureApp(props: { componentId: string; caseId: string }) {
  const bridge = createFixtureBridge('solid', { count: 0, label: 'Probe increment', disabled: false });
  const [state, setState] = createSignal(bridge.getState());
  const [ready, setReady] = createSignal(false);
  const unsubscribe = bridge.subscribe(next => setState(next));
  onMount(() => setReady(true));
  onCleanup(() => { unsubscribe(); bridge.dispose(); });
  const increment = () => {
    const count = Number(state().count) + 1;
    void bridge.setState({ count });
    bridge.recordEvent('change', { value: count });
  };
  return (
    <main>
      <div role="status" aria-label="Fixture health">{ready() ? 'ready' : 'mounting'}</div>
      <Show when={props.componentId === '__probe' && props.caseId === 'native-state'} fallback={<p role="note">Component not implemented: {props.componentId}/{props.caseId}</p>}>
        <button disabled={Boolean(state().disabled)} onClick={increment}>{String(state().label)}</button>
        <div role="status" aria-label="Probe value">{String(state().count)}</div>
      </Show>
      <div aria-hidden="true"><WorkspaceProbe /></div>
    </main>
  );
}
