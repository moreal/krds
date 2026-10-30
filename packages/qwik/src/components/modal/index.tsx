import { useKrdsEnvironment } from '../../providers';
import { $, component$, noSerialize, Slot, useComputed$, useId, useOnDocument, useSignal, useVisibleTask$, type JSXChildren, type NoSerialize, type QRL } from '@builder.io/qwik';
import type { OpenChangeDetails } from '@unofficial-krds/contracts';
import { attrs, controlMode, type Locale } from '../../internal/behavior';
import { captureModalPointer, clearModalPointer } from '../../internal/event-props';
import { startModal } from '../../internal/modal-service';
export interface ModalProps {
    id?: string;
    title: JSXChildren;
    titleId?: string;
    description?: JSXChildren;
    descriptionId?: string;
    actions?: JSXChildren;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange$?: QRL<(details: OpenChangeDetails) => void>;
    closeOnOutsideClick?: boolean;
    showCloseButton?: boolean;
    initialFocusId?: string;
    returnFocusId?: string;
    closeLabel?: string;
    locale?: Locale;
    children?: JSXChildren;
}
export const Modal = component$<ModalProps>((props) => {
    const environment = useKrdsEnvironment();
    useOnDocument('pointerdown', captureModalPointer);
    useOnDocument('keydown', clearModalPointer);
    const generated = useId(), id = props.id ?? `krds-modal-${generated}`, controlled = props.open !== undefined;
    controlMode(props.open, props.defaultOpen, controlled);
    if (props.title == null || props.title === '')
        throw new TypeError('Modal requires a visible title');
    const initialOpen = props.open ?? props.defaultOpen ?? false;
    const internal = useSignal(props.defaultOpen ?? false), opened = useSignal(false);
    const resource = useSignal<NoSerialize<ReturnType<typeof startModal>>>();
    const isOpen = useComputed$(() => { controlMode(props.open, props.defaultOpen, controlled); return controlled ? props.open! : internal.value; });
    const close = $(async () => {
        if (!isOpen.value)
            return;
        if (!controlled)
            internal.value = false;
        await props.onOpenChange$?.({ open: false });
    });
    // Modal is the only widget that must eagerly establish document isolation while open.
    // The noSerialize resource is reconstructed after SSR; semantic open state remains plain.
    useVisibleTask$(({ track, cleanup }) => {
        const open = track(() => isOpen.value);
        if (!open)
            return;
        const root = document.getElementById(`${id}-root`);
        if (!root)
            return;
        const initial = !opened.value && initialOpen;
        opened.value = true;
        const service = startModal(root, { initial, initialFocusId: props.initialFocusId, returnFocusId: props.returnFocusId, showCloseButton: props.showCloseButton, closeOnOutsideClick: props.closeOnOutsideClick, requestClose: close });
        resource.value = noSerialize(service);
        cleanup(() => { service.dispose(); resource.value = undefined; });
    }, { strategy: 'document-ready' });
    return <div hidden={!isOpen.value} inert={!isOpen.value} dir={environment.direction} lang={props.locale ?? environment.locale} id={`${id}-root`} {...attrs('modal', 'root', isOpen.value ? 'open' : 'closed')} style={{ position: 'fixed', inset: '0', zIndex: '1000' }}>
  {isOpen.value && <><div {...attrs('modal', 'backdrop', 'open')}/>
  <div id={id} role="dialog" aria-modal="true" aria-labelledby={props.titleId ?? `${id}-title`} aria-describedby={props.description != null ? props.descriptionId ?? `${id}-description` : undefined} tabIndex={-1} {...attrs('modal', 'content', 'open')}>
   <h2 id={props.titleId ?? `${id}-title`} {...attrs('modal', 'title')}>{props.title}</h2>
   {props.description != null && <div id={props.descriptionId ?? `${id}-description`} {...attrs('modal', 'description')}>{props.description}</div>}
   <div {...attrs('modal', 'body')}><Slot /></div>
   {props.actions != null && <div {...attrs('modal', 'actions')}>{props.actions}</div>}
   {props.showCloseButton !== false && <button type="button" aria-label={props.closeLabel ?? ((props.locale ?? environment.locale) === 'en-US' ? 'Close' : '닫기')} onClick$={close} {...attrs('modal', 'close')}><span aria-hidden="true">×</span></button>}
  </div>
 </>}</div>;
});
