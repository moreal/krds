import{sync$}from'@builder.io/qwik';
/** Cancel only this committed Coach's Escape before a containing modal handles it. */
export const guardCoachEscape=sync$((event:KeyboardEvent,scope:HTMLElement)=>{
 if(event.key!=='Escape'||event.defaultPrevented||event.isComposing||event.keyCode===229||event.ctrlKey||event.altKey||event.metaKey||scope.getAttribute('data-krds-coach-open')!=='true')return;
 const source=event.target as Element|null,uid=scope.getAttribute('data-krds-coach-controller');if(!source?.closest||!uid)return;
 const owner=source.closest('[data-krds-coach-owner]')?.getAttribute('data-krds-coach-owner'),targetId=scope.getAttribute('data-krds-coach-target'),target=targetId?scope.ownerDocument.getElementById(targetId):null;
 if(owner!==uid&&!target?.contains(source))return;
 (event as unknown as Record<symbol,unknown>)[Symbol.for('unofficial-krds.coach-escape')]=uid;event.preventDefault();event.stopPropagation();
});
