# solid · 6 components

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/solid version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-solid/src/examples.tsx](/sources/apps/fixture-solid/src/examples.tsx.txt). SHA-256: `243f137ee6cf7631bea2efc7716aa96a0a7091cde9e399caa06126251db92f8e`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-solid typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).


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

