import { $, component$, useSignal } from '@builder.io/qwik';
import type { BackButtonContract } from '@unofficial-krds/contracts';
import { owned, type NativeContract } from '../../internal/catalog';
import { Modal } from '../modal';
export type BackButtonProps = NativeContract<BackButtonContract>;
export const BackButton = component$<BackButtonProps>((props) => {
  const pending = useSignal(false), confirm = useSignal(false);
  // Shared by the history button and the fallback link: unsaved input is always confirmed before leaving.
  const activate$ = $(async (fallback: boolean) => {
    if (pending.value) return;
    if (!props.dirty) {
      // A clean fallback link navigates natively; only the button asks the host to go back.
      if (!fallback) await props.onBackRequest$({ reason: 'activate' });
      return;
    }
    if (!props.requestConfirmation$) { confirm.value = true; return; }
    pending.value = true;
    try {
      if (await props.requestConfirmation$()) await props.onBackRequest$({ reason: 'confirmed' });
    } finally {
      pending.value = false;
    }
  });
  const state = pending.value ? 'pending-confirmation' : '';
  return <>
    {!props.canGoBack && props.fallbackHref
      // The first click resumes lazily, so the dirty link is held declaratively instead of in the handler.
      ? <a {...owned('back-button', 'root', state)} href={props.fallbackHref} aria-busy={pending.value || undefined} preventdefault:click={!!props.dirty || pending.value} onClick$={event => { if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; return activate$(true); }}>{props.label ?? '뒤로가기'}</a>
      : <button type="button" {...owned('back-button', 'root', state)} disabled={pending.value || !props.canGoBack} aria-busy={pending.value || undefined} onClick$={() => activate$(false)}><span {...owned('back-button', 'icon')} aria-hidden="true">←</span><span {...owned('back-button', 'label')}>{props.label ?? '뒤로가기'}</span></button>}
    <Modal description="이전 화면으로 이동하면 입력 내용이 사라질 수 있습니다." title="작성 중인 내용이 있습니다" open={confirm.value} onOpenChange$={({ open }) => confirm.value = open} actions={<><button type="button" onClick$={() => confirm.value = false}>취소</button><button type="button" onClick$={async () => { confirm.value = false; await props.onBackRequest$({ reason: 'confirmed' }); }}>확인</button></>}>입력한 내용이 저장되지 않았습니다.</Modal>
  </>;
});
