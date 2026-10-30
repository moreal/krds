import { Show, createSignal, onCleanup } from 'solid-js';
import type { BackButtonContract } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';
import { Modal } from '../modal';

export type BackButtonProps = BackButtonContract;
export function BackButton(props: BackButtonProps) {
  const [pending, setPending] = createSignal(false);
  const [confirm, setConfirm] = createSignal(false);
  let alive = true;
  let generation = 0;
  onCleanup(() => { alive = false; generation++; });
  const activate = async (event: MouseEvent, fallback = false) => {
    if (fallback && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)) return;
    if (pending()) { event.preventDefault(); return; }
    if (!props.dirty) {
      if (!fallback) props.onBackRequest({ reason: 'activate' });
      return;
    }
    event.preventDefault();
    if (!props.requestConfirmation) { setConfirm(true); return; }
    const token = ++generation;
    setPending(true);
    try {
      const accepted = await props.requestConfirmation();
      if (accepted && alive && token === generation) props.onBackRequest({ reason: 'confirmed' });
    } catch {
      // A failed confirmation preserves the draft and current route.
    } finally {
      if (alive && token === generation) setPending(false);
    }
  };
  return <>
    <Show when={!props.canGoBack && props.fallbackHref} fallback={<button type="button" {...owned('back-button', 'root', pending() ? 'pending-confirmation' : '')} disabled={!props.canGoBack && !props.fallbackHref} aria-busy={pending() || undefined} onClick={event => void activate(event)}><span {...owned('back-button', 'icon')} aria-hidden="true">←</span><span {...owned('back-button', 'label')}>{props.label ?? '뒤로가기'}</span></button>}>
      <a {...owned('back-button', 'root', pending() ? 'pending-confirmation' : '')} href={props.fallbackHref} aria-busy={pending() || undefined} onClick={event => void activate(event, true)}>{props.label ?? '뒤로가기'}</a>
    </Show>
    <Modal title="변경사항을 버리시겠습니까?" open={confirm()} onOpenChange={({ open }) => setConfirm(open)} actions={<><button type="button" onClick={() => setConfirm(false)}>취소</button><button type="button" onClick={() => { if (!confirm()) return; setConfirm(false); props.onBackRequest({ reason: 'confirmed' }); }}>나가기</button></>}>입력한 내용이 저장되지 않았습니다.</Modal>
  </>;
}
