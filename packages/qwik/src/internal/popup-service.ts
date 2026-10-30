import type {HelpPlacement} from '@unofficial-krds/contracts';
/** Browser-only resources; no timers or observers enter paused serialization. */
const leaves=new WeakMap<HTMLElement,ReturnType<typeof setTimeout>>();
export function cancelPopupLeave(root:HTMLElement|undefined){if(!root)return;const timer=leaves.get(root);if(timer!==undefined)clearTimeout(timer);leaves.delete(root);}
export function schedulePopupLeave(root:HTMLElement|undefined,close:()=>unknown){if(!root)return;cancelPopupLeave(root);const timer=setTimeout(()=>{if(leaves.get(root)!==timer)return;leaves.delete(root);if(root.isConnected)void close();},100);leaves.set(root,timer);}
export function positionPopup(trigger:HTMLElement,popup:HTMLElement,placement:HelpPlacement='top'){
 const doc=trigger.ownerDocument,view=doc.defaultView;if(!view)return;const box=trigger.getBoundingClientRect(),gap=8,padding=8,width=view.innerWidth,height=view.innerHeight;
 const preferred=placement.startsWith('top')?'top':'bottom',above=Math.max(0,box.top-gap-padding),below=Math.max(0,height-box.bottom-gap-padding);
 Object.assign(popup.style,{position:'fixed',right:'auto',bottom:'auto',insetInlineEnd:'auto',insetBlockEnd:'auto',transform:'none',maxWidth:`${Math.max(1,width-padding*2)}px`,maxHeight:`${Math.max(1,height-padding*2)}px`,overflow:'auto'});
 const required=popup.getBoundingClientRect().height,side=(preferred==='top'?above:below)<required&&(preferred==='top'?below:above)>(preferred==='top'?above:below)?(preferred==='top'?'bottom':'top'):preferred,space=side==='top'?above:below;
 popup.style.maxHeight=`${Math.max(1,space)}px`;const rect=popup.getBoundingClientRect(),ideal=placement.endsWith('start')?box.left:placement.endsWith('end')?box.right-rect.width:box.left+(box.width-rect.width)/2;
 popup.style.left=`${Math.max(padding,Math.min(ideal,width-rect.width-padding))}px`;
 popup.style.top=`${side==='top'?Math.max(padding,box.top-gap-rect.height):Math.min(height-padding-rect.height,box.bottom+gap)}px`;
 popup.dataset.krdsResolvedPlacement=placement.replace(/^(top|bottom)/,side);
}
