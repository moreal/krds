# @krds-native/solid

Native Solid 1 pilots: `Button`, `NativeSelect`, `Modal`, `Tabs`, `DateInput` and
`Calendar`. These render through Solid and native HTML. Solid 2 RC has a separate package.

Import from `@krds-native/solid`, or from the individual `/button`, `/native-select`,
`/modal`, `/tabs`, `/date-input`, `/calendar` and `/provider` entries. Public props use
native Solid content and semantic plain-value callbacks; no Ark implementation types
are part of this API.

Styles are explicit imports. Choose individual component CSS or `all.css`:

```tsx
import '@krds-native/styles/reset.css';
import '@krds-native/styles/fonts.css';
import '@krds-native/styles/all.css';
import { Button, DateInput, KrdsProvider } from '@krds-native/solid';

function VisitDateExample() {
  return <KrdsProvider locale="ko-KR"><form>
    <DateInput label="방문일" name="visitDate" defaultValue="2024-02-29" referenceDate="2024-02-01" />
    <Button type="submit">신청</Button><Button type="reset">초기화</Button>
  </form></KrdsProvider>;
}
```

`reset.css` opts into the KRDS root rem scale. `fonts.css` selects locally installed
fonts and system fallbacks; it downloads no font. Component imports add no global CSS.
`KrdsProvider` supplies reactive locale, direction and an optional owner document without
wrapper DOM or mutation of the document language.

Use `value`/`open` for controlled state and `defaultValue`/`defaultOpen` for uncontrolled
state. They are mutually exclusive, and mode stays fixed after mount. A callback requests
a change; a controlled parent may decline it, preserving the displayed committed value.
Prop updates and form reset emit no semantic change events.

```tsx
import { createSignal } from 'solid-js';
import { NativeSelect } from '@krds-native/solid';

function ControlledRegionExample() {
  const [region, setRegion] = createSignal('seoul');
  return <NativeSelect label="지역" name="region" value={region()}
    options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]}
    onValueChange={({ value }) => setRegion(value)} />;
}
```

Tabs default to manual activation and preserve sequential access to every enabled tab.
Modal restores a usable opener before a configured fallback. DateInput uses strict
date-only `YYYY-MM-DD` strings, separate text drafts, native form validation and tentative
calendar selection. Calendar has no form value or implicit modal; Confirm commits its
tentative selection. Range values are `{ start: string | null, end: string | null }`.

The repository's `apps/fixture-solid/src/examples.tsx` compiles examples for all six public
components. Component specifications live in `specs/components/`; the native fixture and
Storybook demonstrate their local state without APIs or external assets. Pilot verification
does not establish full catalog, screen-reader, release or independent-install acceptance.

Publishing authority and copyright holder are unconfirmed; do not publish.
