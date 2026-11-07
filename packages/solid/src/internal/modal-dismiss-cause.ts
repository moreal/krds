import { createContext } from 'solid-js';
/** Private native composition transport; public Modal requests stay plain {open}.
 * The value is keyed by the composing surface's own Modal title id, so only that Modal reports its dismissal cause;
 * public Modals nested in the surface body never report to it. */
export const ModalDismissCause = createContext<{ titleId: string; report: (reason: 'close' | 'escape' | 'outside') => void }>();
