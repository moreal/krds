import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { BackButtonContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
import { Modal } from '../modal';
export type BackButtonProps = NativeContract<BackButtonContract>;
export const BackButton = component$<BackButtonProps>((props) => { const pending = useSignal(false), confirm = useSignal(false); return <>{!props.canGoBack && props.fallbackHref ? <a {...owned('back-button')} href={props.fallbackHref}>{props.label ?? '뒤로가기'}</a> : <button type="button" {...owned('back-button', 'root', pending.value ? 'pending-confirmation' : '')} disabled={pending.value || !props.canGoBack} onClick$={async () => { if (pending.value)
    return; if (props.dirty) {
    if (!props.requestConfirmation$) {
        confirm.value = true;
        return;
    }
    pending.value = true;
    try {
        if (await props.requestConfirmation$())
            await props.onBackRequest$({ reason: 'confirmed' });
    }
    finally {
        pending.value = false;
    }
}
else
    await props.onBackRequest$({ reason: 'activate' }); }}><span {...owned('back-button', 'icon')} aria-hidden="true">←</span><span {...owned('back-button', 'label')}>{props.label ?? '뒤로가기'}</span></button>}<Modal description="이전 화면으로 이동하면 입력 내용이 사라질 수 있습니다." title="작성 중인 내용이 있습니다" open={confirm.value} onOpenChange$={({ open }) => confirm.value = open} actions={<><button type="button" onClick$={() => confirm.value = false}>취소</button><button type="button" onClick$={async () => { confirm.value = false; await props.onBackRequest$({ reason: 'confirmed' }); }}>확인</button></>}>입력한 내용이 저장되지 않았습니다.</Modal></>; });
