import {sync$}from '@builder.io/qwik';
/** Browser-default boundary only: modified clicks retain their actual native destination. */
export const guardNativeLinkRequest=sync$((event:MouseEvent,anchor:HTMLAnchorElement)=>{
 if(anchor.getAttribute('data-krds-native-request')==='true'&&event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&!event.defaultPrevented){
  (event as unknown as Record<symbol,unknown>)[Symbol.for('unofficial-krds.native-link-request')]=true;
  event.preventDefault();
 }
});
export function nativeLinkRequest(event:MouseEvent){return event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&(!event.defaultPrevented||(event as unknown as Record<symbol,unknown>)[Symbol.for('unofficial-krds.native-link-request')]===true);}
