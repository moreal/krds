import { createContext } from 'solid-js';
import type { TutorialStopDetails } from '@unofficial-krds/contracts';
/** One native Solid owner coordinates a linked panel and its coach children. */
export const TutorialCoordinator=createContext<{requestStop:(reason:TutorialStopDetails['reason'])=>void}>();
