import { act, useState } from 'react';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { actions, assertions, cleanupReactRoots, createReactSiheom, given, query } from '@siheom/react';
import { NativeProbe } from '../../src/NativeProbe';

const { runSiheom } = createReactSiheom({ user: userEvent });

test('native React render, provider click, controlled update and cleanup', async () => {
  let update: (count: number) => void = () => { throw new Error('not mounted'); };
  let lastValue = 0;
  function ControlledProbe() {
    const [count, setCount] = useState(0);
    update = setCount;
    return <NativeProbe count={count} label="Probe increment" disabled={false}
      onChange={(value) => { lastValue = value; setCount(value); }} />;
  }
  await runSiheom(
    given.render(<ControlledProbe />),
    assertions.textContent(query.status('Probe value'), '0'),
    actions.click(query.button('Probe increment')),
    assertions.textContent(query.status('Probe value'), '1'),
  );
  expect(lastValue).toBe(1);
  await act(async () => { update(7); });
  await runSiheom(
    assertions.textContent(query.status('Probe value'), '7'),
    actions.click(query.button('Probe increment')),
    assertions.textContent(query.status('Probe value'), '8'),
  );
  expect(lastValue).toBe(8);
  await cleanupReactRoots();
  expect(document.querySelector('button')).toBeNull();
  expect(document.querySelector('[aria-label="Probe value"]')).toBeNull();
});

test('provider click moves focus onto the native button', async () => {
  await runSiheom(
    given.render(<NativeProbe count={0} label="Focus probe" disabled={false} onChange={() => {}} />),
    actions.click(query.button('Focus probe')),
    assertions.focused(query.button('Focus probe')),
  );
});
