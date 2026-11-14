import { useId, useRef, useLayoutEffect, type ReactNode } from 'react';
import type { TutorialPanelContract, TutorialStopDetails } from '@unofficial-krds/contracts';
import { part, useValue, focusSafe } from '../../catalog-utils.js';
import { NativeLayer, useNarrow } from '../../native-layer.js';
export interface TutorialPanelProps extends TutorialPanelContract {
    helpContent?: ReactNode;
    delegateRestoration?: boolean; startActionVisible?:boolean;
    children?: ReactNode;
}
export function TutorialPanel({ tasks, activeTaskId, activeStepId, running, defaultRunning, open, defaultOpen, activePanel, defaultActivePanel, onOpenChange, onTaskChange, onStepChange, onActivePanelChange, onStop, onStart, startActionId, fallbackFocusId, helpContent, children, delegateRestoration=false, startActionVisible=true }: TutorialPanelProps) {
    const id = useId();
    const narrow = useNarrow();
    const visible = useValue(open, defaultOpen, true, 'TutorialPanel.open');
    const progress = useValue(running, defaultRunning, false, 'TutorialPanel.running');
    const tab = useValue(activePanel, defaultActivePanel, 'tutorial', 'TutorialPanel.tab');
    const opener = useRef<HTMLButtonElement>(null);
    const panel = useRef<HTMLElement>(null);
    const stopped = useRef(false);
    const previous = useRef(progress.current);
    const previousVisibility = useRef(visible.current);
    const ownedFocus = useRef(false);
    const narrowNow = useRef(narrow); narrowNow.current = narrow;
    const fallbackNow = useRef(fallbackFocusId); fallbackNow.current = fallbackFocusId;
    const requestOpen = (next: boolean) => { if (visible.current === next)
        return; stopped.current = false; visible.commit(next); onOpenChange?.({ open: next }); };
    const stop = (reason: TutorialStopDetails['reason']) => { if (!progress.current)
        return; stopped.current = true; if (!progress.controlled) {
        progress.commit(false);
        visible.commit(true);
        tab.commit('tutorial');
    } onStop?.({ reason, running: false, returnTo: { panel: 'tutorial', open: true, startActionId } }); };
    useLayoutEffect(() => {
        const acceptedStop = previous.current && !progress.current && stopped.current;
        if (acceptedStop) {
            stopped.current = false;
            if (!delegateRestoration) restoreTutorialFocus(startActionId, fallbackFocusId, opener.current?.id);
        } else if (!narrow) {
            if (!previousVisibility.current && visible.current) panel.current?.focus();
            else if (previousVisibility.current && !visible.current && !stopped.current && ownedFocus.current) {
                ownedFocus.current = false;
                focusSafe(document, opener.current?.id, fallbackFocusId, opener.current);
            }
        }
        previous.current = progress.current;
        previousVisibility.current = visible.current;
    }, [progress.current, visible.current, tab.current, narrow]);
    useLayoutEffect(() => {
        const savedOpener = opener.current;
        const doc = savedOpener?.ownerDocument;
        return () => {
            if (!doc || narrowNow.current || !ownedFocus.current) return;
            queueMicrotask(() => {
                if (doc.activeElement === doc.body) focusSafe(doc, savedOpener?.id, fallbackNow.current, savedOpener);
            });
        };
    }, []);
    const task = tasks.find(t => t.id === activeTaskId);
    if (activeTaskId !== null && !task)
        throw new RangeError('Unknown tutorial task.');
    if (activeStepId !== null && !task?.steps.some(s => s.id === activeStepId))
        throw new RangeError('Unknown tutorial step.');
    const availableTask = task?.steps.length ? task : tasks.find(candidate => candidate.steps.length > 0);
    // Task view (frozen component_08_02 body state b) replaces the overview only when the host has committed a task and one of its steps.
    const viewTask = task && activeStepId !== null ? task : undefined;
    const visibleTasks = viewTask ? [viewTask] : tasks;
    const Root = (narrow ? 'div' : 'aside') as 'aside';
    const selectTab = (next: 'help' | 'tutorial') => { if (tab.current !== next) { tab.commit(next); onActivePanelChange?.({ value: next }); } };
    const content = <Root {...part('tutorial-panel', 'root', progress.current ? 'open running' : 'open idle')} id={`${id}-panel`} data-krds-layout={narrow ? 'narrow-modal' : 'desktop'} role={narrow ? undefined : 'complementary'} ref={panel} tabIndex={-1} onFocusCapture={() => { ownedFocus.current = true; }} onBlurCapture={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) ownedFocus.current = false; }} aria-labelledby={`${id}-title`}>
        <div {...part('tutorial-panel', 'header')}><h2 {...part('tutorial-panel', 'title')} id={`${id}-title`}>따라하기</h2><button {...part('tutorial-panel', 'close')} type="button" onClick={() => requestOpen(false)}>튜토리얼 닫기</button></div>
        <div {...part('tutorial-panel', 'tabs')} role="tablist" aria-label="지원 패널"><button {...part('tutorial-panel', 'tab', tab.current === 'help' ? 'selected' : '')} id={`${id}-help-tab`} type="button" role="tab" aria-controls={`${id}-help`} aria-selected={tab.current === 'help'} onClick={() => selectTab('help')}>도움말</button><button {...part('tutorial-panel', 'tab', tab.current === 'tutorial' ? 'selected' : '')} id={`${id}-tutorial-tab`} type="button" role="tab" aria-controls={`${id}-tutorial`} aria-selected={tab.current === 'tutorial'} onClick={() => selectTab('tutorial')}>튜토리얼</button></div>
        <section id={`${id}-help`} role="tabpanel" aria-labelledby={`${id}-help-tab`} hidden={tab.current !== 'help'}>{helpContent ?? <p>도움말을 확인하세요.</p>}</section>
        <section id={`${id}-tutorial`} role="tabpanel" aria-labelledby={`${id}-tutorial-tab`} hidden={tab.current !== 'tutorial'}>
            {startActionVisible&&<button {...part('tutorial-panel', 'start')} id={startActionId} type="button" disabled={progress.current || !availableTask} onClick={() => { if (progress.current)
        return; const requested=availableTask;if(!requested?.steps[0])return;progress.commit(true);onStart?.({taskId:requested.id,stepId:requested.steps[0].id});}}>따라하기 시작</button>}
            {viewTask && <button {...part('tutorial-panel', 'back')} type="button" onClick={() => onTaskChange?.({ id: null })}>작업 목록</button>}
            <ul {...part('tutorial-panel', 'task-list')}>{visibleTasks.map(item => <li {...part('tutorial-panel', 'task')} key={item.id}><details open={activeTaskId === item.id}><summary {...part('tutorial-panel', 'task-toggle')} onClick={e => { e.preventDefault(); onTaskChange?.({ id: activeTaskId === item.id ? null : item.id }); }}>{item.title}</summary><ol {...part('tutorial-panel', 'step-list')}>{item.steps.map(step => <li key={step.id} data-krds-state={activeStepId === step.id ? 'active-step' : ''}><button {...part('tutorial-panel', 'step', activeStepId === step.id ? 'current' : '')} type="button" aria-current={activeStepId === step.id ? 'step' : undefined} onClick={() => { if (activeStepId !== step.id)
        onStepChange?.({ id: step.id }); }}>{step.title}</button><p>{step.instruction}</p></li>)}</ol></details></li>)}</ul>
        </section>
        {progress.current && <button {...part('tutorial-panel', 'stop')} type="button" onClick={() => stop('stop')}>따라하기 중지</button>}
    </Root>;
    return <><button {...part('tutorial-panel', 'opener')} id={`${id}-opener`} ref={opener} type="button" aria-expanded={visible.current} onClick={() => requestOpen(true)}>튜토리얼 열기</button>{narrow ? <NativeLayer open={visible.current} titleId={`${id}-title`} onEscape={() => requestOpen(false)} onReleased={() => { if (!stopped.current)
        focusSafe(document, opener.current?.id, fallbackFocusId, opener.current); }}>{content}</NativeLayer> : visible.current ? content : null}{children}</>;
}

/** One composition coordinator calls this only after an accepted Stop has rendered. */
export function restoreTutorialFocus(startActionId:string,fallbackFocusId?:string,openerId?:string){
    const activeModal=[...document.querySelectorAll<HTMLElement>('[role="dialog"][aria-modal="true"]')].some(node=>node.isConnected&&!node.closest('[hidden],[inert]')&&node.getClientRects().length>0);
    if(activeModal)focusSafe(document,startActionId,fallbackFocusId,openerId?document.getElementById(openerId):null);
    else focusSafe(document,startActionId,openerId??fallbackFocusId,fallbackFocusId?document.getElementById(fallbackFocusId):null);
}
