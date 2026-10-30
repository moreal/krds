import { useRef } from 'react';

/** Defined values include false, null and empty strings; ownership cannot switch. */
export function useControlledMode(value: unknown, defaultValue: unknown, component: string): boolean {
  const controlled = value !== undefined;
  const initial = useRef(controlled);
  if (controlled && defaultValue !== undefined) {
    throw new TypeError(`${component} cannot combine a controlled prop with its default.`);
  }
  if (initial.current !== controlled) {
    throw new TypeError(`${component} cannot change controlled mode after mount.`);
  }
  return initial.current;
}
