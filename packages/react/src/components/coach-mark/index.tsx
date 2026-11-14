import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CoachMarkContract, TutorialStopDetails } from '@unofficial-krds/contracts';
import { part, useValue, unique, focusSafe, useFloatingBox } from '../../catalog-utils.js';
export type CoachMarkProps = CoachMarkContract;
export function CoachMark({ steps, boundaries, stepId, defaultStepId, onStepChange, open, defaultOpen, onOpenChange, onTargetAction, onStop, startActionId, fallbackFocusId }: CoachMarkProps) {
    const visible = useValue(open, defaultOpen, false, 'CoachMark.open');
    const selected = useValue(stepId, defaultStepId, steps[0]?.id ?? '', 'CoachMark.step');
    unique(steps.map(s => s.id), 'CoachMark');
    if (!steps.length || !steps.some(s => s.id === selected.current))
        throw new RangeError('CoachMark requires a matching step.');
    if (steps.some(s => s.requiresAction) && !onTargetAction)
        throw new TypeError('Action-gated CoachMark requires onTargetAction.');
    const index = steps.findIndex(s => s.id === selected.current);
    const step = steps[index]!;
    const [boundary, setBoundary] = useState<HTMLElement | null>(null);
    const [missing, setMissing] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [box, setBox] = useState({ left: 0, top: 0, width: 0, height: 0 });
    const title = useRef<HTMLHeadingElement>(null);const targetRef=useRef<HTMLElement|null>(null);const presentationRef=useRef<HTMLDivElement>(null);const floating=useFloatingBox(visible.current&&!!boundary,targetRef,presentationRef);
    const generation = useRef(0);
    const pending = useRef(false);
    const latest = useRef({ onTargetAction, onStepChange, onStop });
    latest.current = { onTargetAction, onStepChange, onStop };
    const stopPending = useRef(false);
    const wasOpen = useRef(visible.current);
    const requestStep = (next: string, reason: 'previous' | 'next' | 'target-action') => { if (next === selected.current)
        return; selected.commit(next); onStepChange?.({ id: next, reason }); };
    const stop = (reason: TutorialStopDetails['reason']) => { if (!visible.current)
        return; stopPending.current = true; if (onStop)
        onStop({ reason, running: false, returnTo: { panel: 'tutorial', open: true, startActionId } });
    else {
        visible.commit(false);
        onOpenChange?.({ open: false });
    } };
    useLayoutEffect(() => { if (wasOpen.current && !visible.current && stopPending.current && !onStop) {
        stopPending.current = false;
        focusSafe(document, startActionId, fallbackFocusId);
    } wasOpen.current = visible.current; }, [visible.current]);
    const session=useRef({open:visible.current,stepId:step.id,targetId:step.targetId});
    session.current={open:visible.current,stepId:step.id,targetId:step.targetId};
    const stepIdentity=JSON.stringify(steps.map(item=>[item.id,item.targetId,item.requiresAction??false]));
    const boundaryIdentity=JSON.stringify(boundaries);
    useLayoutEffect(()=>{
        if(!visible.current){setBoundary(null);return;}
        generation.current++;pending.current=false;setWaiting(false);
        const root=presentationRef.current?.getRootNode();
        const scope=root&&'getElementById' in root?root as Document|ShadowRoot:document;
        const doc=scope instanceof Document?scope:scope.ownerDocument;
        const view=doc.defaultView;if(!view)return;
        const registration=boundaries.find(item=>item.targetId===step.targetId);
        let target:HTMLElement|null=null;
        let composing=false;
        let verificationTimer:ReturnType<typeof setTimeout>|undefined;
        const validSession=(token:number)=>generation.current===token&&session.current.open&&session.current.stepId===step.id&&session.current.targetId===step.targetId;
        const verify=(event:Event)=>{
            if(!step.requiresAction||pending.current||composing||event.defaultPrevented||('isComposing' in event&&event.isComposing))return;
            const input=target?.matches('input,select,textarea');
            if(event.type==='click'&&input||event.type==='change'&&!input)return;
            const token=generation.current;pending.current=true;setWaiting(true);
            // Run after native propagation and React's delegated handlers have committed.
            verificationTimer=setTimeout(async()=>{
                verificationTimer=undefined;
                try{
                    if(!validSession(token)||event.defaultPrevented||!target?.isConnected)return;
                    const accepted=await latest.current.onTargetAction?.({stepId:step.id,targetId:step.targetId});
                    if(accepted&&validSession(token)&&target?.isConnected){const next=steps[index+1];if(next)requestStep(next.id,'target-action');else stop('finish');}
                }catch{
                    // A rejected host verification never completes a task.
                }finally{if(validSession(token)){pending.current=false;setWaiting(false);}}
            },0);
        };
        const beginComposition=()=>{composing=true;};
        const endComposition=()=>{composing=false;};
        const detach=(node:HTMLElement|null)=>{node?.removeEventListener('click',verify);node?.removeEventListener('change',verify);node?.removeEventListener('compositionstart',beginComposition);node?.removeEventListener('compositionend',endComposition);};
        const attach=(node:HTMLElement|null)=>{node?.addEventListener('click',verify);node?.addEventListener('change',verify);node?.addEventListener('compositionstart',beginComposition);node?.addEventListener('compositionend',endComposition);};
        const resize=new ResizeObserver(()=>update());
        const update=()=>{
            const live=scope.getElementById(step.targetId);
            if(live!==target){
                generation.current++;pending.current=false;composing=false;setWaiting(false);
                if(verificationTimer!==undefined){clearTimeout(verificationTimer);verificationTimer=undefined;}
                detach(target);if(target)resize.unobserve(target);target=live;attach(target);if(target)resize.observe(target);
            }
            targetRef.current=target;
            const insertion=registration?scope.getElementById(registration.insertionBoundaryId):null;
            const valid=!!target&&!!insertion&&target.getRootNode()===insertion.getRootNode()&&insertion.previousElementSibling===target;
            setBoundary(valid?insertion:null);setMissing(!valid);
            if(target){const box=target.getBoundingClientRect();setBox({left:box.left,top:box.top,width:box.width,height:box.height});}
        };
        update();targetRef.current?.scrollIntoView({block:'nearest',behavior:'instant'});
        const observer=new MutationObserver(update);observer.observe(scope instanceof Document?scope.body:scope,{childList:true,subtree:true});
        const route=()=>{generation.current++;stop('route-change');};
        const key=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!event.defaultPrevented&&!event.isComposing&&event.keyCode!==229){event.preventDefault();stop('stop');}};
        view.addEventListener('scroll',update,true);view.addEventListener('resize',update);view.addEventListener('popstate',route);doc.addEventListener('keydown',key);
        return()=>{generation.current++;pending.current=false;detach(target);if(verificationTimer!==undefined)clearTimeout(verificationTimer);observer.disconnect();resize.disconnect();view.removeEventListener('scroll',update,true);view.removeEventListener('resize',update);view.removeEventListener('popstate',route);doc.removeEventListener('keydown',key);};
    },[visible.current,selected.current,stepIdentity,boundaryIdentity]);
    useLayoutEffect(() => { if (visible.current && boundary)
        title.current?.focus(); }, [visible.current, selected.current, boundary]);
    if (!visible.current)
        return null;
    const content = <div {...part('coach-mark', 'popover', missing ? 'missing-target' : waiting ? 'waiting' : '')} role="region" aria-labelledby={`${step.id}-coach-title`}><h3 {...part('coach-mark', 'title')} id={`${step.id}-coach-title`} ref={title} tabIndex={-1}>{step.title}</h3><p {...part('coach-mark', 'instruction')}>{missing?'대상을 찾을 수 없습니다. 따라하기를 중지하거나 화면을 확인하세요.':step.instruction}</p><p {...part('coach-mark', 'position')}>{index + 1} / {steps.length}</p><div {...part('coach-mark', 'actions')}><button {...part('coach-mark', 'stop')} type="button" onClick={() => stop('stop')}>그만보기</button><button {...part('coach-mark', 'previous')} type="button" hidden={index === 0} disabled={missing} onClick={() => { if (index > 0) requestStep(steps[index - 1]!.id, 'previous'); }}>이전</button><button {...part('coach-mark', 'next')} type="button" disabled={waiting || step.requiresAction || missing} onClick={() => steps[index + 1] ? requestStep(steps[index + 1]!.id, 'next') : stop('finish')}>{steps.length === 1 ? '확인' : index === steps.length - 1 ? '마치기' : '다음'}</button></div></div>;
    const presentation=<div ref={presentationRef} style={boundary?floating:undefined} {...part('coach-mark','root',missing?'open missing-target':waiting?'open waiting':'open current-step')}>{boundary&&<div {...part('coach-mark','spotlight')} aria-hidden="true" style={box}/>}{content}</div>;
    return boundary?createPortal(presentation,boundary):presentation;
}
