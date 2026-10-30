import type {HelpPlacement} from '@unofficial-krds/contracts';
/** Position an owned nonmodal popup without moving or cloning its real target. */
export function positionPopup(trigger:HTMLElement,popup:HTMLElement,placement:HelpPlacement='bottom-start'):void {
 const view=trigger.ownerDocument.defaultView;if(!view||!trigger.isConnected||!popup.isConnected)return;
 const target=trigger.getBoundingClientRect();const margin=8;popup.style.position='fixed';popup.style.boxSizing='border-box';popup.style.maxWidth=Math.max(1,view.innerWidth-2*margin)+'px';popup.style.maxHeight=Math.max(1,view.innerHeight-2*margin)+'px';popup.style.overflowY='auto';const content=popup.getBoundingClientRect();
 const rtl=view.getComputedStyle(trigger).direction==='rtl';const top=placement.startsWith('top');
 let x=placement.endsWith('start')?(rtl?target.right-content.width:target.left):placement.endsWith('end')?(rtl?target.left:target.right-content.width):target.left+(target.width-content.width)/2;
 let y=top?target.top-content.height-margin:target.bottom+margin;
 if(y<margin)y=target.bottom+margin;else if(y+content.height>view.innerHeight-margin)y=target.top-content.height-margin;
 x=Math.max(margin,Math.min(x,view.innerWidth-content.width-margin));y=Math.max(margin,Math.min(y,view.innerHeight-content.height-margin));
 popup.style.position='fixed';popup.style.left=x+'px';popup.style.top=y+'px';popup.style.maxHeight=Math.max(1,view.innerHeight-2*margin)+'px';popup.style.overflowY='auto';
}
