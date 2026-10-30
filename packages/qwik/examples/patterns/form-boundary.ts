import { sync$ } from '@builder.io/qwik';

/**
 * Install native default cancellation through Qwik's synchronous SSR qinit transport.
 * A SubmitEvent has no initiating key's composition state. These transient listeners
 * belong to each form DOM node; no Event, WeakSet or listener is serialized as state.
 */
export const initializePatternFormBoundary = sync$((_: unknown, root: HTMLElement) => {
 for (const form of root.querySelectorAll<HTMLFormElement>('form[data-krds-pattern-form]')) {
  if (form.dataset.krdsPatternBoundary === 'ready') continue;
  form.dataset.krdsPatternBoundary = 'ready';
  const composing = new WeakSet<HTMLInputElement>();
  form.addEventListener('compositionstart', event => {
   if (event.target instanceof HTMLInputElement && event.target.form === form) composing.add(event.target);
  }, true);
  form.addEventListener('compositionend', event => {
   if (event.target instanceof HTMLInputElement) composing.delete(event.target);
  }, true);
  form.addEventListener('keydown', event => {
   if (event.defaultPrevented || event.key !== 'Enter') return;
   const target = event.target;
   if (!(target instanceof HTMLInputElement) || target.form !== form || !['text', 'search'].includes(target.type)) return;
   if (event.isComposing || event.keyCode === 229 || composing.has(target)) event.preventDefault();
  }, true);
 }
});
