import { createContext } from 'solid-js';
/** Private native composition transport; public Modal requests stay plain {open}. */
export const ModalDismissCause = createContext<(reason: 'close' | 'escape' | 'outside') => void>();
