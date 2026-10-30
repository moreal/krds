import { afterEach, expect, test } from 'vitest';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { Spinner } from '../src';

let cleanup: (() => void) | undefined;
afterEach(() => cleanup?.());

test('Spinner displays one loading message and retains one polite status through completion', () => {
  const host = document.createElement('div');
  document.body.append(host);
  const [pending, setPending] = createSignal(true);
  const dispose = render(() => <Spinner pending={pending()} label="신청 처리 중" completionMessage="신청 처리 완료"/>, host);
  cleanup = () => { dispose(); host.remove(); };
  const status = host.querySelector('[role="status"]')!;
  expect(status.getAttribute('aria-live')).toBe('polite');
  expect(host.textContent).toBe('신청 처리 중');
  setPending(false);
  expect(host.querySelector('[role="status"]')).toBe(status);
  expect(status.textContent).toBe('신청 처리 완료');
  expect(host.querySelector('progress')).toBeNull();
});
