import { useId, useRef, type ReactNode } from 'react';
import type { BottomSheetContract } from '@unofficial-krds/contracts';
import { part, useValue, focusSafe } from '../../catalog-utils.js';
import { NativeLayer } from '../../native-layer.js';
export interface BottomSheetProps extends BottomSheetContract {
    id?: string;
    children?: ReactNode;
    actions?: ReactNode;
    trigger?: ReactNode;
}
export function BottomSheet({ open, defaultOpen, onOpenChange, title, description, onCancel, returnFocusId, dismissOnOutside = false, children, actions, trigger, initialFocusId, id: providedId }: BottomSheetProps) { const generatedId = useId(); const id = providedId ?? generatedId; const state = useValue(open, defaultOpen, false, 'BottomSheet'); const opener = useRef<HTMLElement | null>(null);
    const dragStart=useRef<number|null>(null); const request = (next: boolean, reason: 'close' | 'escape' | 'outside' | 'drag') => { if (state.current === next)
    return; if (next)
    opener.current = document.activeElement as HTMLElement; state.commit(next); onOpenChange?.({ open: next, reason }); if (!next)
    onCancel?.(); }; return <><span onClick={() => request(true, 'close')}>{trigger}</span><NativeLayer initialFocusId={initialFocusId} component="bottom-sheet" open={state.current} titleId={`${id}-title`} descriptionId={description ? `${id}-description` : undefined} onEscape={() => request(false, 'escape')} onOutside={dismissOnOutside ? () => request(false, 'outside') : undefined} onReleased={() => focusSafe(document, undefined, returnFocusId, opener.current)}><div {...part('bottom-sheet', 'root', 'open')} id={id}><header {...part('bottom-sheet', 'header')}><h2 {...part('bottom-sheet', 'title')} id={`${id}-title`}>{title}</h2><button {...part('bottom-sheet', 'close')} id={`${id}-close`} type="button" onClick={() => request(false, 'close')}>닫기</button></header><button {...part('bottom-sheet', 'handle')} type="button" aria-label="시트 닫기" onPointerDown={e=>{dragStart.current=e.clientY;e.currentTarget.setPointerCapture(e.pointerId);}} onPointerUp={e=>{const start=dragStart.current;dragStart.current=null;if(start!==null&&e.clientY-start>60)request(false,'drag');}} onPointerCancel={()=>{dragStart.current=null;}} onClick={() => request(false, 'drag')}>—</button>{description && <p id={`${id}-description`}>{description}</p>}<div {...part('bottom-sheet', 'body')}>{children}</div>{actions && <div {...part('bottom-sheet', 'actions')}>{actions}</div>}</div></NativeLayer></>; }
