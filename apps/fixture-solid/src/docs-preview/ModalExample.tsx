import { createSignal } from 'solid-js';
import { Button, Modal } from '@unofficial-krds/solid';
export function ModalExample() {
  const [open, setOpen] = createSignal(false);
  const [result, setResult] = createSignal('확인을 기다리고 있습니다.');
  return <section aria-label="모달 예제"><Button id="preview-modal-trigger" onClick={() => setOpen(true)}>모달 열기</Button><p role="status">{result()}</p><Modal title="신청 확인" description="신청 내용을 확인해 주세요." open={open()} returnFocusId="preview-modal-trigger" closeOnOutsideClick onOpenChange={detail => setOpen(detail.open)} actions={<Button onClick={() => { setResult('신청을 확인했습니다.'); setOpen(false); }}>확인</Button>}><p>선택한 내용으로 신청하시겠습니까?</p></Modal></section>;
}
