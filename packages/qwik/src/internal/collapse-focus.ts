/** Remember the real focused descendant before the browser blurs a hidden branch. */
export function observeCollapseFocus(root:HTMLElement,part:'panel'|'submenu'){
 const doc=root.ownerDocument;let focused:HTMLElement|undefined;
 const focus=(event:FocusEvent)=>{const target=event.target as HTMLElement;if(root.contains(target))focused=target;else if(target!==doc.body)focused=undefined;};
 const pointer=(event:PointerEvent)=>{if(!root.contains(event.target as Node))focused=undefined;};
 const observer=new MutationObserver(()=>{const active=doc.activeElement;if(!focused||!root.contains(focused)||active!==doc.body&&active!==focused)return;const hidden=focused.closest<HTMLElement>(`[data-krds-part="${part}"][hidden]`);if(!hidden||!root.contains(hidden))return;const trigger=[...root.querySelectorAll<HTMLButtonElement>('button[aria-controls]')].find(button=>button.getAttribute('aria-controls')===hidden.id);focused=undefined;if(trigger&&!trigger.closest('[hidden],[inert]'))trigger.focus({preventScroll:true});});
 doc.addEventListener('focusin',focus);doc.addEventListener('pointerdown',pointer,true);observer.observe(root,{subtree:true,attributes:true,attributeFilter:['hidden']});
 return ()=>{observer.disconnect();doc.removeEventListener('focusin',focus);doc.removeEventListener('pointerdown',pointer,true);focused=undefined;};
}
