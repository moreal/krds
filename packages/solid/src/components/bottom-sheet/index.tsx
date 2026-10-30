import { ModalDismissCause } from '../../internal/modal-dismiss-cause';
import { createEffect, type JSX } from 'solid-js';
import type { BottomSheetContract } from '@unofficial-krds/contracts';
import { owned, stateValue } from '../../internal/catalog';
import { Modal } from '../modal';
export interface BottomSheetProps extends BottomSheetContract { children?:JSX.Element; actions?:JSX.Element; }
export function BottomSheet(props:BottomSheetProps){
 const open=stateValue(()=>props.open,props.defaultOpen,false);let pendingCancel=false;let wasOpen=open.read();let reason:'close'|'escape'|'outside'='escape';
 createEffect(()=>{const current=open.read();if(wasOpen&&!current&&pendingCancel){pendingCancel=false;props.onCancel?.();}wasOpen=current;});
 const cancel=(reason:'close'|'escape'|'outside'|'drag')=>{if(!open.read())return;pendingCancel=true;open.request(false);props.onOpenChange?.({open:false,reason});};let start:number|undefined;let dragged=false;
 return <ModalDismissCause.Provider value={cause=>reason=cause}><Modal title={props.title} description={props.description} open={open.read()} onOpenChange={()=>cancel(reason)} initialFocusId={props.initialFocusId} returnFocusId={props.returnFocusId} closeOnOutsideClick={props.dismissOnOutside} showCloseButton={false} actions={<div {...owned('bottom-sheet','actions')}>{props.actions}</div>}><div {...owned('bottom-sheet','root',open.read()?'open':'closed')}><button type="button" {...owned('bottom-sheet','handle')} aria-label="시트 닫기" onClick={event=>{if(dragged&&event.detail!==0){dragged=false;event.preventDefault();return;}dragged=false;cancel('close');}} onPointerDown={event=>{dragged=false;start=event.clientY;event.currentTarget.setPointerCapture(event.pointerId);}} onPointerUp={event=>{if(start!==undefined&&event.clientY-start>80){dragged=true;cancel('drag');}start=undefined;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}} onPointerCancel={()=>{start=undefined;dragged=false;}}>━</button><button type="button" {...owned('bottom-sheet','close')} onClick={()=>cancel('close')}>닫기</button><div {...owned('bottom-sheet','body')}>{props.children}</div></div></Modal></ModalDismissCause.Provider>;
}
