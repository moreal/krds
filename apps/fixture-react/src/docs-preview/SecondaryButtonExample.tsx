import { useState } from 'react';
import { Button } from '@unofficial-krds/react/button';

export function SecondaryButtonExample() {
  const [count, setCount] = useState(0);
  return <section aria-label="보조 버튼 예제">
    <Button variant="secondary" onClick={() => setCount(value => value + 1)}>관심 목록에 담기</Button>
    <p role="status">관심 목록 {count}건</p>
  </section>;
}
