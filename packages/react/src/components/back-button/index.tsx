import { useLayoutEffect, useRef, useState } from 'react';
import type { BackButtonContract } from '@unofficial-krds/contracts';
import { part } from '../../catalog-utils.js';
export type BackButtonProps = BackButtonContract;
export function BackButton({label='뒤로가기',canGoBack,fallbackHref,dirty=false,onBackRequest,requestConfirmation}:BackButtonProps) {
  const [pending,setPending]=useState(false);
  const busy=useRef(false);
  const alive=useRef(true);
  const generation=useRef(0);
  const disabled=!canGoBack&&!fallbackHref;
  const latest=useRef({canGoBack,fallbackHref,onBackRequest});
  latest.current={canGoBack,fallbackHref,onBackRequest};
  useLayoutEffect(()=>{generation.current++;busy.current=false;setPending(false);},[canGoBack,fallbackHref]);
  useLayoutEffect(()=>{alive.current=true;return()=>{alive.current=false;generation.current++;};},[]);
  if(dirty&&!disabled&&!requestConfirmation)throw new TypeError('Dirty navigation requires confirmation.');
  const activate=async()=>{
    if(disabled||busy.current)return;
    if(!dirty){onBackRequest({reason:'activate'});return;}
    const token=++generation.current;
    busy.current=true;setPending(true);
    try{
      const accepted=await requestConfirmation!();
      if(accepted&&alive.current&&generation.current===token&&(latest.current.canGoBack||latest.current.fallbackHref))latest.current.onBackRequest({reason:'confirmed'});
    }catch{
      // Rejected host confirmation retains the current page and its form.
    }finally{
      if(alive.current&&generation.current===token){busy.current=false;setPending(false);}
    }
  };
  const labelContent=<><span {...part('back-button','icon')} aria-hidden="true">←</span><span {...part('back-button','label')}>{label}</span></>;
  // A fallback destination stays a native link; dirty activation is held for the host confirmation.
  return !canGoBack&&fallbackHref
    ? <a {...part('back-button','root',pending?'pending-confirmation':'')} href={fallbackHref} aria-busy={pending||undefined} onClick={event=>{if(!dirty)return;event.preventDefault();void activate();}}>{label}</a>
    : <button {...part('back-button','root',pending?'pending-confirmation':'')} type="button" disabled={disabled} aria-busy={pending||undefined} onClick={()=>void activate()}>{labelContent}</button>;
}
