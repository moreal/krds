# @unofficial-krds/react

Native React 19 six-component pilot: Button, NativeSelect, Modal, Tabs, Calendar and DateInput. React owns JSX, context, portals, refs and effect cleanup. Components never render through another framework. This pilot does not establish full KRDS catalog or release readiness.

```tsx
import { useState } from 'react';
import { Button, DateInput, KrdsProvider, NativeSelect } from '@unofficial-krds/react';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/all.css';

export function VisitForm() {
  const [date, setDate] = useState<string | null>(null);
  return <KrdsProvider locale="ko-KR" direction="ltr">
    <form onSubmit={event => { event.preventDefault(); }}>
      <NativeSelect label="지역" name="region" defaultValue="seoul"
        options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} />
      <DateInput label="방문일" name="visit" value={date}
        onValueChange={({ value }) => setDate(value)} referenceDate="2024-02-15" />
      <Button type="submit" name="action" value="save">저장</Button>
      <Button type="reset" variant="secondary">초기화</Button>
    </form>
  </KrdsProvider>;
}
```

Each component and its props are also exported through `@unofficial-krds/react/button`, `/native-select`, `/modal`, `/tabs`, `/calendar`, `/date-input`; context through `/providers`. Importing components adds no CSS, font or browser-global side effect. Font CSS is separately optional and subject to its own rights.

`value`/`open` are parent-authoritative. User callbacks request a change; a declined request keeps the parent state. External prop changes and form reset emit no user changes. Uncontrolled defaults establish the reset baseline. NativeSelect uses a real single select, Button defaults to `type="button"`, and native form association is forwarded.

DateInput accepts strict ASCII `YYYY-MM-DD`, keeps raw drafts apart from committed hidden form values, and commits on Enter or group blur. Range mode uses `{start,end}` and `${name}.start`/`${name}.end`; incomplete or reversed committed ranges throw. Enter during IME is ignored. Invalid drafts remain editable and block native submission. Calendar selections stay tentative until Confirm; explicit referenceDate/today avoid dependence on the system clock.

```tsx
import { Calendar, Modal, Tabs } from '@unofficial-krds/react';

<Calendar mode="range" referenceDate="2024-02-15"
  defaultValue={{ start: '2024-02-12', end: '2024-02-18' }} />;
<Tabs label="안내" items={[
  { value: 'overview', label: '개요', panel: <p>개요 내용</p> },
  { value: 'details', label: '상세', panel: <p>상세 내용</p> },
]} />;
<Modal title="확인" trigger={<button type="button">열기</button>}
  actions={close => <button type="button" onClick={close}>취소</button>}>
  변경 내용을 확인하세요.
</Modal>;
```

Tabs preserve all panels and every enabled tab's sequential Tab stop; arrows add focus navigation. Calendar is a six-row native table with every enabled date sequentially reachable. Modal defaults to dialog-container entry focus, traps only the topmost modal, isolates the background, and restores a usable opener before any fallback. `initialFocusId` may target only the dialog or first interactive child. DateInput supplies its specialized selected/first-date entry policy. `showCloseButton={false}` requires an explicit enabled close action.

The selected toolchain is recorded in `compatibility/toolchain.json`; run commands through `node tools/yarn.mjs`. Native fixture behavior lives separately from pure local Storybook states. Validation and limits are recorded in `.superpowers/sdd/PLAN/task-T07-react-report.md` and `docs/compatibility/react.md`. No publishing, pushing or tagging has been authorized.
