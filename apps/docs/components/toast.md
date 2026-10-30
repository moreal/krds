---
title: 'Toast · 토스트'
---

# Toast

토스트 · `Toast` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_12_05.html) · [Full reviewed specification](/sources/specs/components/toast.md.txt) · [Framework support](../compatibility/)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.0.0` | planned | [exact subpath types](/sources/packages/react/dist/components/toast/index.d.ts.txt) | [react sources and preview policy](../compatibility/examples#react) |
| solid | `0.0.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/toast/index.d.ts.txt) | [solid sources and preview policy](../compatibility/examples#solid) |
| svelte | `0.0.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Toast.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/examples#svelte) |
| vue | `0.0.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/toast/Toast.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/examples#vue) |
| lit | `0.0.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/toast/index.d.ts.txt) | [lit sources and preview policy](../compatibility/examples#lit) |
| qwik | `0.0.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/toast/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/examples#qwik) |
| angular | `0.0.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-toast.d.ts.txt) | [angular sources and preview policy](../compatibility/examples#angular) |
| solid-next (preview) | `0.0.0-next.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/examples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface ToastContract {
    message: ToastMessage | null;
    durationMs?: number;
    onDismiss: (detail: {
        id: string;
        reason: 'timeout';
        generation: number;
    }) => void;
}

export interface ToastMessage {
    id: string;
    text: string;
    tone: 'information' | 'warning';
    persistentResultId: string;
}
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `message` | yes | `ToastMessage \| null` | data / state |
| `durationMs` | no | `number` | data / state |
| `onDismiss` | yes | `(detail: {id: string; reason: 'timeout'; generation: number}) => void` | semantic event request |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

Transient noninteractive container with one concise sentence, bottom-center above page and clear of TabBar/FAB. No action buttons; action-needed content uses Snackbar. Do not use for urgent/critical or individual field errors.

### Plain semantic API

Choose a **host-owned current-message and queue** API: required `message:{id:string,text:string,tone:information|warning,persistentResultId:string}|null`, initially null; durationMs defaults to 3000 information/4000 warning, and `onDismiss({id,reason:"timeout",generation})` is a dismissal **request**, not notification that host content has been removed. No defaultMessage, internal queue or enqueue/store object exists. The host owns result correctness, current message, ordering and queue advancement; it can configure a longer positive duration. role=status/aria-live=polite is independent native policy; toast remains noninteractive and never a focus destination.

**Adequate exposure/retrieval is mandatory completion**, beyond matching a short default timer ([official L946–949](https://www.krds.go.kr/html/site/component/component_12_05.html)). This project's concrete accommodation requires persistentResultId to resolve to the same result text in a discoverable accessible **persistent result/status or history outside the transient toast**, in normal reading/navigation order. It stays available until deliberate host/user clearing or leaving the relevant screen. The fixture must include this real local persistent result so a slow reader or delayed announcement can still retrieve the outcome after the toast expires. The history/log mechanism is independent project policy, not a claim that KRDS prescribes that exact UI; absence of sufficient exposure/retrieval cannot pass completion.

### Keyboard, focus and state transitions

Never steal focus or add action/close controls. A changed message ID immediately replaces the visible message because the host chose it; the component does not enqueue the previous/current snapshots. message=null removes it. Neither replacement nor prop removal emits onDismiss or advances a queue internally.

Maintain a monotonic internal generation for each new ID or meaningful same-ID text/tone/effective-duration revision. Same-ID changed text updates the current toast, announces changed text once and starts a fresh full exposure; same-ID tone/duration-only revision updates appearance/lifetime with no duplicate identical-text announcement. Identical same-ID content and mere callback/object identity changes do not reannounce or restart. The same ID reused after message=null is a new visible generation. Requests carry the ID and generation they concern; callbacks contain no renderer object.

Start the full countdown only after that generation is actually rendered. Pause remaining time while the document is hidden; resume the remaining time when visible. Replacement, removal, meaningful revision and unmount cancel the former generation's timer/listeners; stale callbacks must check the current generation before requesting anything. Timeout emits exactly one dismissal request for its generation, then consumes that timer. If the controlled host keeps the message, it remains visible: no local hiding, queue advancement, repeated timeout loop or false “actual dismissal” callback. A new meaningful generation can start a fresh timer. Focus, prop updates, mount and reset do not fabricate user-change/dismissal events.

### Responsive/mobile requirements

Keep clear of bottom safe-area/navigation/FAB; wrap only as necessary for translated/zoom text, prioritize readable message over clipping. No motion required; reduced motion appears/disappears without sliding.

### Forms, reset and composition

No form/reset/IME behavior.

### Asset, integration and composition completion

Host owns the queue/current-message prop, persistent result/history target and result truth/recovery. Completion requires a local action producing both actual persistent result and transient message; slow-reading/delayed-announcement retrieval; and deterministic timeout, update, replacement, rejected-dismissal and cleanup behavior. The official 2–3s information/3–4s warning values are defaults within sufficient-exposure guidance, not proof every user has read/heard a result. A correctly timed but irretrievable result fails the gate. No action or close button is added to turn Toast into Snackbar.

### Stable parts and states

root, message; information,warning,open,closed.

All rendered owned parts use `data-krds-component="toast"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `information`, `warning`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-toast--information`, `krds-toast--warning`, `krds-toast--duplicate`, `krds-toast--queued`, `krds-toast--timer-cleanup`, `krds-toast--narrow`, `krds-toast--reduced-motion`, `krds-toast--slow-reading-persistent-result`, `krds-toast--same-id-content-update`, `krds-toast--host-replacement-removal`, `krds-toast--timeout-rejected`, `krds-toast--generation-timer`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Information](/native/storybook-react/?path=/story/krds-toast--information) · [Warning](/native/storybook-react/?path=/story/krds-toast--warning) · [Duplicate](/native/storybook-react/?path=/story/krds-toast--duplicate) · [Queued](/native/storybook-react/?path=/story/krds-toast--queued) · [Timer Cleanup](/native/storybook-react/?path=/story/krds-toast--timer-cleanup) · [Narrow](/native/storybook-react/?path=/story/krds-toast--narrow) · [Reduced Motion](/native/storybook-react/?path=/story/krds-toast--reduced-motion) · [Slow Reading Persistent Result](/native/storybook-react/?path=/story/krds-toast--slow-reading-persistent-result) · [Same Id Content Update](/native/storybook-react/?path=/story/krds-toast--same-id-content-update) · [Host Replacement Removal](/native/storybook-react/?path=/story/krds-toast--host-replacement-removal) · [Timeout Rejected](/native/storybook-react/?path=/story/krds-toast--timeout-rejected) · [Generation Timer](/native/storybook-react/?path=/story/krds-toast--generation-timer).
- solid: [information](/native/storybook-solid/?path=/story/krds-toast--information) · [warning](/native/storybook-solid/?path=/story/krds-toast--warning) · [duplicate](/native/storybook-solid/?path=/story/krds-toast--duplicate) · [queued](/native/storybook-solid/?path=/story/krds-toast--queued) · [timer-cleanup](/native/storybook-solid/?path=/story/krds-toast--timer-cleanup) · [narrow](/native/storybook-solid/?path=/story/krds-toast--narrow) · [reduced-motion](/native/storybook-solid/?path=/story/krds-toast--reduced-motion) · [slow-reading-persistent-result](/native/storybook-solid/?path=/story/krds-toast--slow-reading-persistent-result) · [same-id-content-update](/native/storybook-solid/?path=/story/krds-toast--same-id-content-update) · [host-replacement-removal](/native/storybook-solid/?path=/story/krds-toast--host-replacement-removal) · [timeout-rejected](/native/storybook-solid/?path=/story/krds-toast--timeout-rejected) · [generation-timer](/native/storybook-solid/?path=/story/krds-toast--generation-timer).
- svelte: [information](/native/storybook-svelte/?path=/story/krds-toast--information) · [warning](/native/storybook-svelte/?path=/story/krds-toast--warning) · [duplicate](/native/storybook-svelte/?path=/story/krds-toast--duplicate) · [queued](/native/storybook-svelte/?path=/story/krds-toast--queued) · [timer-cleanup](/native/storybook-svelte/?path=/story/krds-toast--timer-cleanup) · [narrow](/native/storybook-svelte/?path=/story/krds-toast--narrow) · [reduced-motion](/native/storybook-svelte/?path=/story/krds-toast--reduced-motion) · [slow-reading-persistent-result](/native/storybook-svelte/?path=/story/krds-toast--slow-reading-persistent-result) · [same-id-content-update](/native/storybook-svelte/?path=/story/krds-toast--same-id-content-update) · [host-replacement-removal](/native/storybook-svelte/?path=/story/krds-toast--host-replacement-removal) · [timeout-rejected](/native/storybook-svelte/?path=/story/krds-toast--timeout-rejected) · [generation-timer](/native/storybook-svelte/?path=/story/krds-toast--generation-timer).
- vue: [information](/native/storybook-vue/?path=/story/krds-toast--information) · [warning](/native/storybook-vue/?path=/story/krds-toast--warning) · [duplicate](/native/storybook-vue/?path=/story/krds-toast--duplicate) · [queued](/native/storybook-vue/?path=/story/krds-toast--queued) · [timer-cleanup](/native/storybook-vue/?path=/story/krds-toast--timer-cleanup) · [narrow](/native/storybook-vue/?path=/story/krds-toast--narrow) · [reduced-motion](/native/storybook-vue/?path=/story/krds-toast--reduced-motion) · [slow-reading-persistent-result](/native/storybook-vue/?path=/story/krds-toast--slow-reading-persistent-result) · [same-id-content-update](/native/storybook-vue/?path=/story/krds-toast--same-id-content-update) · [host-replacement-removal](/native/storybook-vue/?path=/story/krds-toast--host-replacement-removal) · [timeout-rejected](/native/storybook-vue/?path=/story/krds-toast--timeout-rejected) · [generation-timer](/native/storybook-vue/?path=/story/krds-toast--generation-timer).
- lit: [Information](/native/storybook-lit/?path=/story/krds-toast--information) · [Warning](/native/storybook-lit/?path=/story/krds-toast--warning) · [Duplicate](/native/storybook-lit/?path=/story/krds-toast--duplicate) · [Queued](/native/storybook-lit/?path=/story/krds-toast--queued) · [Timer Cleanup](/native/storybook-lit/?path=/story/krds-toast--timer-cleanup) · [Narrow](/native/storybook-lit/?path=/story/krds-toast--narrow) · [Reduced Motion](/native/storybook-lit/?path=/story/krds-toast--reduced-motion) · [Slow Reading Persistent Result](/native/storybook-lit/?path=/story/krds-toast--slow-reading-persistent-result) · [Same Id Content Update](/native/storybook-lit/?path=/story/krds-toast--same-id-content-update) · [Host Replacement Removal](/native/storybook-lit/?path=/story/krds-toast--host-replacement-removal) · [Timeout Rejected](/native/storybook-lit/?path=/story/krds-toast--timeout-rejected) · [Generation Timer](/native/storybook-lit/?path=/story/krds-toast--generation-timer).
- qwik: [information](/native/storybook-qwik/?path=/story/krds-toast--information) · [warning](/native/storybook-qwik/?path=/story/krds-toast--warning) · [duplicate](/native/storybook-qwik/?path=/story/krds-toast--duplicate) · [queued](/native/storybook-qwik/?path=/story/krds-toast--queued) · [timer-cleanup](/native/storybook-qwik/?path=/story/krds-toast--timer-cleanup) · [narrow](/native/storybook-qwik/?path=/story/krds-toast--narrow) · [reduced-motion](/native/storybook-qwik/?path=/story/krds-toast--reduced-motion) · [slow-reading-persistent-result](/native/storybook-qwik/?path=/story/krds-toast--slow-reading-persistent-result) · [same-id-content-update](/native/storybook-qwik/?path=/story/krds-toast--same-id-content-update) · [host-replacement-removal](/native/storybook-qwik/?path=/story/krds-toast--host-replacement-removal) · [timeout-rejected](/native/storybook-qwik/?path=/story/krds-toast--timeout-rejected) · [generation-timer](/native/storybook-qwik/?path=/story/krds-toast--generation-timer).
- angular: [information](/native/storybook-angular/?path=/story/krds-toast--information) · [warning](/native/storybook-angular/?path=/story/krds-toast--warning) · [duplicate](/native/storybook-angular/?path=/story/krds-toast--duplicate) · [queued](/native/storybook-angular/?path=/story/krds-toast--queued) · [timer-cleanup](/native/storybook-angular/?path=/story/krds-toast--timer-cleanup) · [narrow](/native/storybook-angular/?path=/story/krds-toast--narrow) · [reduced-motion](/native/storybook-angular/?path=/story/krds-toast--reduced-motion) · [slow-reading-persistent-result](/native/storybook-angular/?path=/story/krds-toast--slow-reading-persistent-result) · [same-id-content-update](/native/storybook-angular/?path=/story/krds-toast--same-id-content-update) · [host-replacement-removal](/native/storybook-angular/?path=/story/krds-toast--host-replacement-removal) · [timeout-rejected](/native/storybook-angular/?path=/story/krds-toast--timeout-rejected) · [generation-timer](/native/storybook-angular/?path=/story/krds-toast--generation-timer).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-react-logs/fixround1/public-examples-source-candidate.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/docs-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-solid-logs/final-public-fixture-typecheck.log.txt).
- svelte: [read the checked consumer](/examples/svelte-55); [download exact source](/sources/apps/fixture-svelte/src/public-examples/ToastExample.svelte.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-inventory.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/public-examples-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-examples-types.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-build.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/svelte-t10-ssr-render.log.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-svelte-logs/integration-deltas/svelte-integration-deltas-types.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/public-example-evidence.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-vue-logs/242-final-fixture-types.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-compiler.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-lit-logs/public-examples-typecheck.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-qwik-logs/public-examples-types.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/public-examples-compiler-source-fix1.json.txt), [compiler evidence](/sources/.superpowers/sdd/PLAN/t10-angular-logs/review-s13-official-aot.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:06.180Z`. SHA-256: `407e2dc99ded84b9ceaeab40478d4a5c4d0125d96c968c05d2f309ae802fb9af`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_12_05.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.
