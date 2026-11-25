import { afterEach, expect, test } from 'vitest';
import { ErrorBoundary, type JSX } from 'solid-js';
import { render } from 'solid-js/web';
import * as K from '../src';

const cleanups: (() => void)[] = [];
afterEach(() => { cleanups.splice(0).reverse().forEach(dispose => dispose()); });
function mount(view: () => JSX.Element) {
  const host = document.createElement('div'); document.body.append(host);
  let failure: unknown; const dispose = render(() => <ErrorBoundary fallback={error => { failure = error; return null; }}>{view()}</ErrorBoundary>, host);
  cleanups.push(() => { dispose(); host.remove(); }); if (failure) throw failure; return host;
}
const nextTask = () => new Promise(resolve => setTimeout(resolve, 0));
const invalid = [NaN, Infinity, 0, -1];

test.each(invalid)('Toast rejects durationMs %s instead of dismissing at once', async durationMs => {
  const calls: unknown[] = [];
  expect(() => mount(() => <K.Toast message={{ id: 'saved', text: 'Saved', tone: 'information', persistentResultId: 'result' }} durationMs={durationMs} onDismiss={detail => calls.push(detail)}/>)).toThrow(RangeError);
  await nextTask();
  expect(calls).toEqual([]);
});

test.each(invalid)('Snackbar rejects durationMs %s instead of dismissing at once', async durationMs => {
  const calls: unknown[] = [];
  expect(() => mount(() => <K.Snackbar message={{ id: 'saved', title: 'Saved', text: 'Saved message' }} durationMs={durationMs} onDismiss={detail => calls.push(detail)}/>)).toThrow(RangeError);
  await nextTask();
  expect(calls).toEqual([]);
});
