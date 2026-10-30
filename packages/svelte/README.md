# @unofficial-krds/svelte

Native Svelte 5 source components cover all 54 applicable catalog identities. The six reviewed pilots (`Button`, `NativeSelect`, `Modal`, `Tabs`, `Calendar`, and `DateInput`) retain their accepted public interfaces. Full catalog behavior and manual acceptance remain separate gates. This is an independent KRDS implementation. Original KRDS and font rights remain separate; see the attribution and license files. Publication is not authorized.

The selected consumer is Svelte **5.57.3**, compiled with the selected Svelte Vite plugin and Vite 8.3.5. Other Svelte major generations are not verified. `svelte-package` 3.0.1 distributes `.svelte` source, JavaScript helpers and public declarations. Native component declarations use Svelte's `Component<Props>` types: the selected `svelte2tsx` declaration emitter misidentifies its shim path under this workspace's pnpm linker and otherwise emits empty legacy props. These declarations travel through the official package build and are checked by the real consumer, rather than claiming that transpiled JavaScript establishes compatibility.

```svelte
<script lang="ts">
  import { Button, DateInput, KrdsProvider } from '@unofficial-krds/svelte';
  import type { DateValue } from '@unofficial-krds/svelte';
  import '@unofficial-krds/styles/all.css';
  let date = $state<DateValue>(null);
  let button = $state<HTMLButtonElement | null>(null);
</script>

<KrdsProvider locale="ko-KR" direction="ltr">
  <DateInput label="방문일" name="visit" value={date}
    onValueChange={({ value }) => { date = value; }} />
  <Button bind:element={button}>저장</Button>
</KrdsProvider>
```

Callbacks such as `onValueChange` and `onOpenChange` report user requests once. Passing `value` or `open` keeps the parent authoritative; update it in the callback to accept a request. Omit the controlled prop and use `defaultValue`/`defaultOpen` for local state. External prop changes and native reset do not replay user events. Button forwards native `onclick`, form attributes and keyboard activation, and supports `bind:element`.

Modal trigger/body/actions and tab panels accept native Svelte snippets. Modal body and actions snippets receive `{ close }`, which emits one native close request; use an enabled type=button action with this function when `showCloseButton={false}`. Escape remains available. A trigger snippet receives `{ open, expanded, controls }`: pass `open` directly to the native button `onclick` so the actual opening control is retained even when the platform does not focus pointer-clicked buttons. `KrdsProvider` uses native context without adding a wrapper. Locale, direction and owning document are context values; the rendered document remains the owner of DOM and native dialog behavior. Modal and DateInput popups use the browser's native dialog top layer, preserving inherited styles while isolating background interaction. Dialogs restore focus and body scrolling on close/unmount.

Dates are strict Gregorian ASCII `YYYY-MM-DD`; `DateInput` keeps raw drafts apart from canonical form entries. Range input is `{ start: string | null, end: string | null }`. No clock, timezone conversion, external request, or original KRDS JavaScript controls these components.

The independent fixture consumes public package exports without a source alias. `apps/fixture-svelte/src/DocsConsumer.svelte` exercises public types, context, a DOM binding, snippets and all six components; its selected production SSR build is also rendered. Evidence and remaining manual/release gates are listed in `docs/compatibility/svelte.md` and the T07 report. Pilot evidence does not establish full catalog or release readiness.


Every catalog component has a typed root export and a semantic subpath, for example `import Checkbox from '@unofficial-krds/svelte/checkbox'`. Public callback details come from the shared semantic contracts; native content uses Svelte snippets. The 48 catalog additions render their own native markup and use Svelte lifecycle/reactivity. No foreign renderer or common DOM renderer is involved.

`Disclosure` receives ordinary children; `Accordion` receives an optional `panel(item)` snippet; `Carousel` receives an optional `slide(item)` snippet. `StructuredList` accepts `toolbarContent()` and `actions(item)` snippets. Help and tutorial panels use native wide sections or native modal dialogs. `CoachMark` mounts its Svelte popover into the host's registered adjacent insertion boundary and retains the actual target control. File upload retains real browser `File` handles and contributes only committed files through the owning native form's `formdata` event.

The host owns speech, language/navigation decisions, tutorial completion, notifications and persistent result history. The examples use local drivers; they do not claim speech/audio or sign-language equivalence. A Toast's `persistentResultId` must name the same discoverable persistent result outside the transient message. Snackbar action and dismissal callbacks are requests; controlled rejection retains the visible message.

`apps/fixture-svelte/src/public-examples/` contains 54 strict consuming examples importing public subpaths, with no package-source alias. `CatalogConsumer.svelte` compiles them together, and `catalog-consumer-ssr.ts` renders all 54 example identities without a browser document. This compilation evidence does not award browser behavior, hydration, manual usability, asset-content equivalence or release coverage. Exact source hashes and current evidence are retained in `.superpowers/sdd/PLAN/t10-svelte-logs/` and the T10 Svelte report.
