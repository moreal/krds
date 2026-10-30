import { createContextId,type QRL,type Signal } from '@builder.io/qwik';
export const TutorialCoordinator=createContextId<{present:Signal<boolean>;stop:QRL<(reason:'stop'|'finish'|'target-removed'|'route-change')=>unknown>}>('krds-qwik-tutorial-coordinator');
