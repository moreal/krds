# @unofficial-krds/qwik

Native Qwik pilot components: `Button`, `NativeSelect`, `Modal`, `Tabs`, `Calendar`, and `DateInput`, plus `KrdsProvider`. The selected runtime and optimizer are Qwik 1.20.3 with Vite 7.3.1. This pilot does not establish complete KRDS catalog coverage or release readiness.

Import styles explicitly:

```tsx
import { component$, useSignal } from '@builder.io/qwik';
import { NativeSelect } from '@unofficial-krds/qwik';
import '@unofficial-krds/styles/all.css';

export default component$(() => {
  const region = useSignal('seoul');
  return <NativeSelect label="지역" value={region.value}
    options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]}
    onValueChange$={({ value }) => { region.value = value; }} />;
});
```

Semantic callbacks use Qwik QRL props (`onValueChange$`, `onOpenChange$`, `onConfirm$`, `onCancel$`). Button retains native `onClick$`. Props remain authoritative for controlled inputs. Dates use strict ASCII Gregorian ISO strings; reference dates are explicit. All enabled tabs and dates remain sequential keyboard stops.

Use `KrdsProvider` to supply `locale="en-US"` or `direction="rtl"`; Korean and LTR are the defaults. Each browser resource uses its owning element's document. No DOM access occurs at import. Modal document isolation, select reconciliation, tab panel inspection, and DateInput native form listeners are reconstructed client resources. State and QRL captures contain plain semantic values; modal services are excluded using `noSerialize`.

The production consumer in `apps/fixture-qwik` resolves this package's built `dist/index.qwik.mjs`. Its `resume.html` is actual paused SSR with independent cold first-event tests, resource timing and Chrome precise execution coverage. Storybook is a separate client-rendered state presentation. Test commands and limits are recorded in `docs/compatibility/qwik.md` and the T07Q report.

Independent project code is copyright (c) 2026 Lee Dogeon <dev.moreal@gmail.com> under the MIT grant in LICENSES/MIT.txt. KRDS and third-party materials retain their separate recorded terms. Publication is not authorized.


T10 adds native sources for the full catalog. Each component has its own Qwik `component$` renderer, semantic markup and QRL handlers. Import from `@unofficial-krds/qwik` or a named component subpath. Top-level semantic callback props use QRL names such as `onValueChange$`, `onOpenChange$`, and `onStop$`; callbacks nested in plain configuration must be explicitly wrapped with Qwik `$()`. Native child content uses Qwik slots.

Controlled props remain authoritative; defaults are captured once. Ordinary reset restores uncontrolled defaults without a change request, and canceled reset is inert. Files belong to the browser: put actual File handles behind `noSerialize`, retain plain descriptor metadata separately, and use `appendCommittedFiles` when constructing FormData from the host's committed set. Upload, speech, locale, history and media-content accuracy remain explicit host integrations.

The 54 standalone public examples live in `apps/fixture-qwik/src/catalog-examples.tsx` and compile under `apps/fixture-qwik/tsconfig.examples.json`. Full catalog behavior, manual accessibility/media review and release acceptance remain separately gated; source availability is not verified coverage. Publication, pushing and tagging are unauthorized.

`CoachMark` owns the step/open state and provides native context. Place a `CoachMarkOutlet` inside each registered insertion boundary immediately after its unchanged target, as children of that controller. The outlet is exported from the root and `coach-mark` subpath and adds no catalog component ID. The same native surface exists at that position in SSR and resumes there; targets and Qwik DOM ranges are never reparented. Missing or removed outlets suspend advancement. For a TutorialPanel composition, the native `targets` named slot can hold the controller outside the panel chrome while retaining the Tutorial coordinator. See `CoachMarkExample` for the complete public composition.

Nested callbacks retain their semantic names and require QRL values: `search.onRequest`, `selection.onChange`, `sort.onChange`, `loadMore.onLoadMore`, `actions[].onAction`, `iconAction.onAction`, and `menuAction.onRequest`. Their public types reject ordinary function closures. Native JSX content and browser `File` values are excluded from recursive callback transport mapping.

The FileUpload chooser is intentionally unnamed (`data-krds-name` records the semantic field name). Only the host's committed records become successful file entries. `appendCommittedFiles(data, name, files, disabled)` appends without deleting existing same-name fields. Invoke it once per uploader when constructing the submission, or once per uploader in a native `formdata` listener. A submission using that listener must consume `new FormData(form)` directly rather than appending the same committed files again. This preserves ordinary fields and other uploaders sharing a name; disabled uploaders append nothing.

Keep each Coach target and its after-target outlet in a stable keyed native DOM group when projecting them through the controller's slot. The public example uses this structure so receiving-parent updates preserve the actual input and its composing draft in selected Qwik 1.20.3. The compatibility report records the separate plain-framework conditional-Fragment limitation and the strict native-group identity/IME proof.
