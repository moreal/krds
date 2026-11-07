import { useState } from 'react';
import { Accordion } from '@unofficial-krds/react/accordion';

export function AccordionExample() {
  const [openIds, setOpenIds] = useState<readonly string[]>([]);
  return <Accordion items={[
    { id: 'application', title: '신청 방법', content: '온라인 신청서를 작성한 후 제출해 주세요.' },
    { id: 'documents', title: '필요 서류', content: '신분증과 신청 확인서를 준비해 주세요.' },
  ]} openIds={openIds} onOpenChange={({ ids }) => setOpenIds(ids)} />;
}
