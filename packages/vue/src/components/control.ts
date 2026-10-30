import { watchEffect } from 'vue';

/** Retain the initial ownership boundary; defaults are initialization, not a second writer. */
export function controlContract(read: () => { value: unknown; modelValue: unknown; defaultValue: unknown }) {
  const initial = read();
  const controlled = initial.value !== undefined || initial.modelValue !== undefined;
  watchEffect(() => {
    const state = read();
    const current = state.value !== undefined || state.modelValue !== undefined;
    if (current !== controlled) throw new TypeError('Controlled mode cannot change after mount.');
    if (current && state.defaultValue !== undefined) throw new TypeError('A controlled value cannot be combined with a default.');
    if (state.value !== undefined && state.modelValue !== undefined) throw new TypeError('Choose value/open or v-model as the controlled source.');
  });
  return controlled;
}
export function oneOf(value: unknown, allowed: readonly unknown[], name: string) {
  if (!allowed.includes(value)) throw new TypeError(`Invalid ${name}.`);
}
