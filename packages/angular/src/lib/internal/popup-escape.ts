import {topModalContent} from './modal-stack';
/** Inner popup events bubble before document modal handlers; background owners abstain. */
export function ownsPopupEscape(document:Document,root:HTMLElement,event:KeyboardEvent):boolean{
 const ownedRoot=root.matches('[data-krds-part="root"]')?root:root.querySelector<HTMLElement>('[data-krds-part="root"]')??root;
 const modal=topModalContent(document);if(modal&&!modal.contains(root))return false;
 const target=event.target instanceof Element?event.target:document.activeElement;
 const inner=target?.closest('[data-krds-part="root"][data-krds-component="tooltip"],[data-krds-part="root"][data-krds-component="contextual-help"],[data-krds-part="root"][data-krds-component="coach-mark"]');
 if(inner&&inner!==ownedRoot&&!inner.contains(ownedRoot))return false;
 const widget=target?.closest('[role="listbox"],[role="menu"],[role="combobox"]');if(widget&&!root.contains(widget))return false;
 return true;
}
