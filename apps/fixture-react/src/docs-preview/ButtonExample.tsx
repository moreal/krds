import { useState } from 'react';
import { Button } from '@unofficial-krds/react/button';

export function ButtonExample() {
  const [count, setCount] = useState(0);
  return <section aria-label="버튼 예제">
    <Button onClick={() => setCount(value => value + 1)}>신청하기</Button>
    <p role="status">{count === 0 ? '아직 신청하지 않았습니다.' : `신청이 ${count}회 완료되었습니다.`}</p>
  </section>;
}
