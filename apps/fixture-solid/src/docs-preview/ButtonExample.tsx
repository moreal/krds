import { createSignal } from 'solid-js';
import { Button } from '@unofficial-krds/solid';
export function ButtonExample() {
  const [count, setCount] = createSignal(0);
  return <section aria-label="버튼 예제"><Button onClick={() => setCount(n => n + 1)}>신청하기</Button><p role="status">{count() === 0 ? '아직 신청하지 않았습니다.' : `신청이 ${count()}회 완료되었습니다.`}</p></section>;
}
