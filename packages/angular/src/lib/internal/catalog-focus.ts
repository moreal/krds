import {topModalContent} from './modal-stack';
import {focusables,usable} from './behavior';
/** A composition restores once after its accepted rendering and modal cleanup. */
export function restoreCatalogFocus(document:Document,candidates:readonly (HTMLElement|null|undefined)[]):void{
 const modals=[...document.querySelectorAll<HTMLElement>('dialog:modal,[role="dialog"][aria-modal="true"]')].filter(node=>node.isConnected&&node.getClientRects().length>0);
 const modal=topModalContent(document)??modals.at(-1);
 const candidate=candidates.find(node=>usable(node??null)&&(!modal||modal.contains(node!)));
 if(candidate){candidate.focus();return;}
 const internal=modal&&focusables(modal)[0];if(internal){internal.focus();return;}
 const target=modal??document.body;const old=target.getAttribute('tabindex');target.tabIndex=-1;target.focus();old===null?target.removeAttribute('tabindex'):target.setAttribute('tabindex',old);
}
