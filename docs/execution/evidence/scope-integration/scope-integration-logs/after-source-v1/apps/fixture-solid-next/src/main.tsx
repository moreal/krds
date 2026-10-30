/** T05 native infrastructure only; actual KRDS components belong to T09. */
import { createSignal, onCleanup, onSettled } from 'solid-js';
import { render } from '@solidjs/web';
import { WorkspaceProbe } from '@unofficial-krds/solid-next';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';

const route = new URL(window.location.href);
const componentId = decodeURIComponent(route.pathname.split('/')[2] ?? 'unknown');
const caseId = route.searchParams.get('case') ?? 'unknown';
const isProbe = componentId === '__probe' && caseId === 'native-state';
const initialState: Record<string, unknown> = isProbe
  ? { count: 0, label: 'Probe increment', disabled: false }
  : {};
const bridge = createFixtureBridge('solid-next', initialState);

function Fixture() {
  const [state, setState] = createSignal(initialState);
  // Solid 2 lifecycle callbacks run after render. Returning the subscription
  // cleanup keeps bridge writes outside a component's tracked execution.
  onSettled(() => bridge.subscribe(next => setState(next)));
  onCleanup(() => bridge.dispose());

  function increment() {
    const current = bridge.getState();
    if (current.disabled) return;
    const value = Number(current.count) + 1;
    void bridge.setState({ count: value });
    bridge.recordEvent('change', { value });
  }

  return (
    <main>
      <h1>Solid 2 native fixture</h1>
      <WorkspaceProbe />
      <p role="status" aria-label="Fixture health">ready</p>
      {isProbe ? (
        <section aria-label="Infrastructure probe">
          <button type="button" disabled={Boolean(state().disabled)} onClick={increment}>
            {String(state().label)}
          </button>
          <p role="status" aria-label="Probe value">{String(state().count)}</p>
        </section>
      ) : (
        <p role="note">Component not implemented: {componentId}/{caseId}</p>
      )}
    </main>
  );
}

const dispose = render(() => <Fixture />, document.getElementById('app')!);
window.addEventListener('pagehide', () => dispose(), { once: true });
