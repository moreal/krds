# solid · 컴포넌트 6개 {#solid-·-6-components}

이 컴파일러 체크포인트는 아래 소스를 생산자의 공개 빌드 패키지 검사에 묶습니다. 원래의 import와 로컬 상태를 포함합니다. 최신 네이티브 후보, 동작, SSR/resume, 릴리스를 인증하지 않습니다.

- Nx 버전 적용 완료 후 새로 만든 컴파일러 체크포인트입니다. 공개 @unofficial-krds/solid 버전은 0.1.0입니다. 소스와 보존된 명령·로그 바이트는 해시로 고정됩니다. 컴파일 성공만으로는 네이티브 동작, SSR/하이드레이션/resume, 수동 검사, 최종 릴리스 인수가 인정되지 않습니다.

소스: [apps/fixture-solid/src/examples.tsx](/sources/apps/fixture-solid/src/examples.tsx.txt). SHA-256: `243f137ee6cf7631bea2efc7716aa96a0a7091cde9e399caa06126251db92f8e`.

명령: `node tools/yarn.mjs workspace @unofficial-krds/fixture-solid typecheck`. [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).


```tsx
import { createSignal } from 'solid-js';
import { Button, Calendar, DateInput, KrdsProvider, Modal, NativeSelect, Tabs } from '@unofficial-krds/solid';

/** Compiled documentation examples use only the built public package. */
export function ControlledRegionExample() {
  const [region, setRegion] = createSignal('seoul');
  return <NativeSelect label="지역" name="region" value={region()}
    options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]}
    onValueChange={({ value }) => setRegion(value)} />;
}

export function VisitDateExample() {
  return <KrdsProvider locale="ko-KR"><form>
    <DateInput label="방문일" name="visitDate" defaultValue="2024-02-29" referenceDate="2024-02-01" />
    <Button type="submit">신청</Button><Button type="reset">초기화</Button>
  </form></KrdsProvider>;
}

export function RangeCalendarExample() {
  return <Calendar mode="range" label="방문 기간 선택" referenceDate="2024-02-15"
    defaultValue={{ start: '2024-02-12', end: '2024-02-18' }} />;
}

export function ConfirmationExample() {
  const [open, setOpen] = createSignal(false);
  return <><Button onClick={() => setOpen(true)}>열기</Button>
    <Modal title="확인" open={open()} onOpenChange={({ open }) => setOpen(open)}>
      <p>입력한 정보를 확인하세요.</p>
    </Modal>
  </>;
}

export function SectionsExample() {
  return <Tabs label="정보 구분" defaultValue="first" items={[
    { value: 'first', label: '첫 번째', content: <p>첫 번째 내용</p> },
    { value: 'second', label: '두 번째', content: <p>두 번째 내용</p> },
  ]} />;
}
```

