import { component$, useStore } from '@builder.io/qwik';
import { cleanup, screen, waitFor } from '@noma.to/qwik-testing-library';
import { actions, assertions, given, query, runSiheom } from '@siheom/qwik';
import { expect, test } from 'vitest';

// Test-only native component; JSX is passed to the published @siheom/qwik given.
const NativeProbe = component$(() => {
  const state = useStore({ count: 0, value: 'initial' });
  return <section>
    <button onClick$={() => state.count++}>Probe increment</button>
    <div role="status" aria-label="Probe value">{state.count}</div>
    <label>Controlled value<input value={state.value} onInput$={(_, element) => state.value = element.value} /></label>
    <div role="status" aria-label="Controlled echo">{state.value}</div>
  </section>;
});

test('published native siheom render, click, controlled update and cleanup', async () => {
  await runSiheom(
    given.render(<NativeProbe />),
    assertions.textContent(query.status('Probe value'), '0'),
    actions.click(query.button('Probe increment')),
    assertions.textContent(query.status('Probe value'), '1'),
    actions.fill(query.textbox('Controlled value'), 'updated'),
    assertions.value(query.textbox('Controlled value'), 'updated'),
    assertions.textContent(query.status('Controlled echo'), 'updated'),
  );
  cleanup();
  await waitFor(() => expect(screen.queryByRole('button', { name: 'Probe increment' })).toBeNull());
});

test('native siheom focus is a separate browser result', async () => {
  await runSiheom(
    given.render(<NativeProbe />),
    actions.click(query.button('Probe increment')),
    assertions.focused(query.button('Probe increment')),
    actions.tab(query.button('Probe increment')),
    assertions.focused(query.textbox('Controlled value')),
  );
});
