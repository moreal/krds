# T06 Solid 1 integration handoff

Lead owns `packages/solid/src/index.ts`, `providers/**`, Solid manifest/build/README,
fixture `src/**`/config, Storybook `.storybook/**`, shared pure fixtures and catalog data.
Controller assigns component directories/tests/stories. No worker writes those shared files.

## Native integration

`providers/index.ts` exports `KrdsProvider`, `useKrdsEnvironment` and their plain public types.
Provider props: optional `locale: 'ko-KR'|'en-US'`, `direction: 'ltr'|'rtl'`,
`ownerDocument: Document`, native Solid `children`. Context is optional, wrapper-free,
reactive and inherits nested values. `useKrdsEnvironment()` returns `locale()` and
`direction()` accessors, plus lazy `getDocument(): Document|undefined`. Component locale
props override context. Never read document/window at module evaluation. Native Solid
`Portal`/lifecycle owns modal rendering. Internal imports use `../../providers`.

Each directory exports named component and its `*Props` type from `index.ts`.
Use `JSX.Element` children/content and ordinary Solid native JSX attributes; public semantic
callbacks consume `ValueChangeDetails<T>`/`OpenChangeDetails` from contracts, never Ark types.
Common props and semantics are binding from specs/components. Types below coordinate fixture usage:

- `Button`: children + native onClick/type/name/value/form/disabled; variant/size per spec.
- `NativeSelect`: options, label/hint/error JSX content, id/name/form/value/defaultValue,
  disabled/required/invalid/size, `onValueChange`.
- `Modal`: title/titleId, description/descriptionId, children (body), actions, open/defaultOpen,
  onOpenChange, closeOnOutsideClick/showCloseButton/initialFocusId/returnFocusId; `trigger`
  native JSX content if convenient, otherwise fixture owns external button. Notify lead of choice.
- `Tabs`: items `{value,label:JSX.Element,content:JSX.Element,disabled?,id?}[]`, id,
  label or aria-label, value/defaultValue/onValueChange, activationMode/orientation.
- `DateInput`: discriminated mode single/range, semantic value/defaultValue/onValueChange,
  label/hint/error JSX, id/name/form/required/disabled/min/max/locale/translations,
  withCalendar/referenceDate/today. Range labels follow spec.
- `Calendar`: matching single/range semantic state, `onValueChange`, `onConfirm`, `onCancel`,
  bounds/locale/translations/referenceDate/today/disabled, label or aria-label. Optional required
  is internal DateInput coordination. DateInput imports Calendar locally; for Modal popup use
  sibling component directory directly after overlay owner marks ready. No foreign renderer.

DOM IDs use native Solid `createUniqueId` when caller id absent, preserve explicit ids and
stable relationships. Modal opener is saved actual active element; fallback fixture id
`solid-next-task` points to always-mounted button `다음 작업`. Fixture title is `확인`,
trigger `열기`, final close `닫기`. Tabs fixture names `첫 번째`/`두 번째`, values `first`/`second`.
Select names `지역`, options `seoul/서울`, `busan/부산`. Date single label `날짜`.

## Serial build/browser queue

Only lead runs `packages/solid` public builds, fixture production builds, browser Vitest,
canonical runners and Storybook builds. Workers may inspect/typecheck own code, write meaningful
native tests first, then message lead `RED ready: family; paths; command; expected failure`.
Lead runs exact files through `node tools/yarn.mjs workspace @krds-native/fixture-solid siheom:local <paths>`
with `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/krds-playwright-1.64.1`, reports full log path/result.
Workers implement after observed RED, then request GREEN. Lead publishes exports and builds when
directory is ready; tests import public `@krds-native/solid`, never source aliases.
Workers notify ready exports/types/API deviations before lead fixture integration. Lead announces
queue ownership and results. No concurrent dist/Vite/Storybook writers.

Canonical stories belong each owner: `button.stories.tsx`, `native-select.stories.tsx`,
`modal.stories.tsx`, `tabs.stories.tsx`, `date-input.stories.tsx`, `calendar.stories.tsx`.
CSF title `KRDS/Button` etc gives canonical ids `krds-button--disabled`,
`krds-native-select--controlled`, `krds-modal--open`, `krds-tabs--manual`,
`krds-date-input--invalid`. Add real default/applicable disabled/error/loading/open/selected
states and Calendar range story. Use pure shared fixtures only; no play/loaders/network.

Lead final checks require all six, real controlled rejection/forms/reset/focus/IME/date browser
behavior and rendered image inspection including in-range focused forced colors. Probe remains
explicit infrastructure only; no probe coverage. No commits, publish, push or subagents.

## Final API clarifications

Modal uses an external opener (no trigger prop). DateInput popup uses native dialog so its
selected-date initial focus does not weaken generic Modal initialFocusId policy. DateInput
adds optional returnFocusId and calendarTranslations. Calendar supports optional required
for DateInput coordination; translation dictionary includes endpoint labels and complete
weekday/month arrays. Public component entries are emitted from index.tsx or index.ts.
