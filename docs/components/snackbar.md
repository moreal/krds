---
title: 'Snackbar · 스낵바'
---

# Snackbar

스낵바 · `Snackbar` · component

[Official KRDS guidance](https://www.krds.go.kr/html/site/component/component_12_06.html) · [Full reviewed specification](/sources/specs/components/snackbar.md.txt) · [Framework support](../compatibility/README.md)

## Native availability

These states are copied from `catalog/coverage.json`; they are not inferred from exports, examples, or test-runner exit codes.

| Framework | Package version | Recorded state | Export declaration | Native examples and stories |
| --- | --- | --- | --- | --- |
| react | `0.1.0` | planned | [exact subpath types](/sources/packages/react/dist/components/snackbar/index.d.ts.txt) | [react sources and preview policy](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [exact subpath types](/sources/packages/solid/dist/components/snackbar/index.d.ts.txt) | [solid sources and preview policy](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [exact subpath types](/sources/packages/svelte/dist/components/Snackbar.svelte.d.ts.txt) | [svelte sources and preview policy](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [exact subpath types](/sources/packages/vue/dist/components/snackbar/Snackbar.vue.d.ts.txt) | [vue sources and preview policy](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [exact subpath types](/sources/packages/lit/dist/components/snackbar/index.d.ts.txt) | [lit sources and preview policy](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [exact subpath types](/sources/packages/qwik/dist/components/snackbar/index.d.ts.txt) | [qwik sources and preview policy](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [exact subpath types](/sources/packages/angular/dist/types/unofficial-krds-angular-snackbar.d.ts.txt) | [angular sources and preview policy](../compatibility/README.mdexamples#angular) |
| solid-next (preview) | `0.1.0-preview.0` | planned | [exact root types](/sources/packages/solid-next/dist/index.d.ts.txt) | [solid-next sources and preview policy](../compatibility/README.mdexamples#solid-next) |

## Props, events, content and defaults

The semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.

```ts
export interface SnackbarContract {
    message: SnackbarMessage | null;
    action?: SnackbarAction;
    onAction?: (detail: {
        id: string;
        generation: number;
        actionId: string;
    }) => void;
    onDismiss: (detail: {
        id: string;
        reason: 'close' | 'timeout';
        generation: number;
    }) => void;
    durationMs?: number | null;
    fallbackFocusId?: string;
}

export interface SnackbarMessage {
    id: string;
    title: string;
    text: string;
    icon?: string;
    error?: string;
    actionPending?: boolean;
}

export type SnackbarAction = {
    kind: 'button';
    id: string;
    label: string;
} | {
    kind: 'link';
    id: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
};
```

| Semantic property / callback | Required | Exact type | Role |
| --- | --- | --- | --- |
| `message` | yes | `SnackbarMessage \| null` | data / state |
| `action` | no | `SnackbarAction` | data / state |
| `onAction` | no | `(detail: {id: string; generation: number; actionId: string}) => void` | semantic event request |
| `onDismiss` | yes | `(detail: {id: string; reason: 'close' \| 'timeout'; generation: number}) => void` | semantic event request |
| `durationMs` | no | `number \| null` | data / state |
| `fallbackFocusId` | no | `string` | data / state |

Optional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.

### Native content and event transport

React and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.

### Native structure and mandatory ordering

One bottom-center notification: optional subtle icon left, title, concise body, optional directly related text action (max one, at right), visible Close button. Never stack simultaneous snackbars or cover TabBar/FAB; field errors remain inline.

### Plain semantic API

Choose **host-owned current message and queue**: required `message:{id,title,text,icon?,error?,actionPending?}|null`, initially null; optional one discriminated action `action:{kind:"button",id,label}|{kind:"link",id,label,href,target?,rel?}`, `onAction({id,generation,actionId})` for button actions, `onDismiss({id,reason:close|timeout,generation})` as a dismissal request, durationMs=null (persistent default), and optional `fallbackFocusId`. Host controls message presence, queue/order and actual result; there is no internal enqueue/store/defaultMessage. An action does not implicitly dismiss; host explicitly replaces/removes message after its outcome if appropriate.

Undo/retry is a named native type=button invoking onAction once. Navigation is an actual anchor with href, native Enter/click, modified-click, context-menu and open-new-tab behavior; do not substitute imperative button navigation or cancel browser semantics. Communicate external/new-window meaning when applicable. Both occupy the one right-side text-action slot; never expose two actions or a nested interactive link/button. role=status applies to message text with controls outside the live text. Persistent default, optional timer and host lifecycle policies below are independent choices.

### Keyboard, focus and state transitions

No focus steal. Close is a named native type=button; the optional action uses its discriminated native button/link role. On each explicit Close activation request removal once, but wait for actual host removal before restoring focus or advancing any queue. A rejected request keeps the message, reachable action/Close and current focus; repeated explicit user activation may make a new one-per-action request. Button activation emits onAction only, not a synthetic dismissal. Native link navigation remains native; a route owner handles the destination focus rather than restoring an old-page initiator during departure.

The host's changed ID immediately replaces current content, and null removes it; neither emits a synthetic dismissal or internally advances a queue. Same-ID text/title/error/action kind/label/href updates the currently rendered notification rather than being discarded as a duplicate. Announce changed accessible message text once; identical text is not reannounced because a callback object changed. A removed/replaced focused control restores only after actual accepted rendering: usable saved initiating control, then usable fallbackFocusId, then nearest usable saved ancestor, finally live document body with temporary tabindex=-1 restored afterwards. Do not focus removed, hidden, disabled, inert or old-route controls; do not steal focus when another usable control already received it from the user's native navigation.

Use a generation bound to ID and meaningful accessible content/action/effective-duration revisions. Identical duplicate content/callback identity alone does not restart. Each meaningful generation cancels prior timers and may start a fresh full optional lifetime after actual rendering. Default duration null has no timer. For a configured positive timeout, pause remaining time while hovered, while focus is within the snackbar, while actionPending, or while document hidden; resume only when all gates clear. Increasing configured duration creates a new full lifetime as the explicit extension mechanism. A timeout emits one request per generation; if host rejects, keep it visible with no repeated timeout loop. Stale old-generation callbacks cannot dismiss replacements or same-ID revisions. Cleanup timers/listeners on actual removal/unmount; prop updates, focus movement and reset do not emit fabricated user/dismissal notifications.

### Responsive/mobile requirements

Bottom safe-area/navigation clearance; icon/message/action stay distinguishable and wrap readably on narrow/zoom. Reduced motion removes slide animation.

### Forms, reset and composition

No form/reset/IME state; buttons type=button.

### Asset, integration and composition completion

Host owns queue/current-message presence, undo/retry result, actual navigation destination and optional timer configuration. Required local examples include a functioning undo/retry **button** and a real href **navigation link**, each as the sole action; changed same-ID error/action content; rejected close/timeout; focus-safe accepted removal; and generation-safe replacement/cleanup. Persistent default keeps actions available; configured expiry must remain protected during hover/focus/hidden/pending interaction. No network or upstream toast manager is needed, and logging a navigation callback without an anchor does not satisfy completion.

### Stable parts and states

root, icon, title, message, action, close; open,closed,action-pending,error.

All rendered owned parts use `data-krds-component="snackbar"`, one `data-krds-part` token, and a space-separated `data-krds-state` set. Native/ARIA state is authoritative. Prose enumerations above are part/state vocabulary, frozen in `packages/contracts/src/full-catalog.ts`. Asset-only Favicon has no runtime parts.

## State examples and native checks

Supported case axes: `message`, `with-action`, `with-icon`. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.

[Required native story manifest](/sources/catalog/full-catalog-stories.json.txt) · [Pilot story manifest](/sources/catalog/story-cases.json.txt) · [Coverage evidence and native review links](/sources/catalog/coverage.json.txt)

Required full-catalog stories: `krds-snackbar--message`, `krds-snackbar--with-action`, `krds-snackbar--with-icon`, `krds-snackbar--undo-local`, `krds-snackbar--action-error`, `krds-snackbar--close-focused`, `krds-snackbar--timer-cleanup`, `krds-snackbar--narrow`, `krds-snackbar--navigation-link`, `krds-snackbar--same-id-error-action-update`, `krds-snackbar--dismissal-rejected`, `krds-snackbar--host-queue-replacement`, `krds-snackbar--generation-timer-pauses`.

### Native stories in current built outputs

The links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.

- react: [Message](/native/storybook-react/?path=/story/krds-snackbar--message) · [With Action](/native/storybook-react/?path=/story/krds-snackbar--with-action) · [With Icon](/native/storybook-react/?path=/story/krds-snackbar--with-icon) · [Undo Local](/native/storybook-react/?path=/story/krds-snackbar--undo-local) · [Action Error](/native/storybook-react/?path=/story/krds-snackbar--action-error) · [Close Focused](/native/storybook-react/?path=/story/krds-snackbar--close-focused) · [Timer Cleanup](/native/storybook-react/?path=/story/krds-snackbar--timer-cleanup) · [Narrow](/native/storybook-react/?path=/story/krds-snackbar--narrow) · [Navigation Link](/native/storybook-react/?path=/story/krds-snackbar--navigation-link) · [Same Id Error Action Update](/native/storybook-react/?path=/story/krds-snackbar--same-id-error-action-update) · [Dismissal Rejected](/native/storybook-react/?path=/story/krds-snackbar--dismissal-rejected) · [Host Queue Replacement](/native/storybook-react/?path=/story/krds-snackbar--host-queue-replacement) · [Generation Timer Pauses](/native/storybook-react/?path=/story/krds-snackbar--generation-timer-pauses).
- solid: [message](/native/storybook-solid/?path=/story/krds-snackbar--message) · [with-action](/native/storybook-solid/?path=/story/krds-snackbar--with-action) · [with-icon](/native/storybook-solid/?path=/story/krds-snackbar--with-icon) · [undo-local](/native/storybook-solid/?path=/story/krds-snackbar--undo-local) · [action-error](/native/storybook-solid/?path=/story/krds-snackbar--action-error) · [close-focused](/native/storybook-solid/?path=/story/krds-snackbar--close-focused) · [timer-cleanup](/native/storybook-solid/?path=/story/krds-snackbar--timer-cleanup) · [narrow](/native/storybook-solid/?path=/story/krds-snackbar--narrow) · [navigation-link](/native/storybook-solid/?path=/story/krds-snackbar--navigation-link) · [same-id-error-action-update](/native/storybook-solid/?path=/story/krds-snackbar--same-id-error-action-update) · [dismissal-rejected](/native/storybook-solid/?path=/story/krds-snackbar--dismissal-rejected) · [host-queue-replacement](/native/storybook-solid/?path=/story/krds-snackbar--host-queue-replacement) · [generation-timer-pauses](/native/storybook-solid/?path=/story/krds-snackbar--generation-timer-pauses).
- svelte: [message](/native/storybook-svelte/?path=/story/krds-snackbar--message) · [with-action](/native/storybook-svelte/?path=/story/krds-snackbar--with-action) · [with-icon](/native/storybook-svelte/?path=/story/krds-snackbar--with-icon) · [undo-local](/native/storybook-svelte/?path=/story/krds-snackbar--undo-local) · [action-error](/native/storybook-svelte/?path=/story/krds-snackbar--action-error) · [close-focused](/native/storybook-svelte/?path=/story/krds-snackbar--close-focused) · [timer-cleanup](/native/storybook-svelte/?path=/story/krds-snackbar--timer-cleanup) · [narrow](/native/storybook-svelte/?path=/story/krds-snackbar--narrow) · [navigation-link](/native/storybook-svelte/?path=/story/krds-snackbar--navigation-link) · [same-id-error-action-update](/native/storybook-svelte/?path=/story/krds-snackbar--same-id-error-action-update) · [dismissal-rejected](/native/storybook-svelte/?path=/story/krds-snackbar--dismissal-rejected) · [host-queue-replacement](/native/storybook-svelte/?path=/story/krds-snackbar--host-queue-replacement) · [generation-timer-pauses](/native/storybook-svelte/?path=/story/krds-snackbar--generation-timer-pauses).
- vue: [message](/native/storybook-vue/?path=/story/krds-snackbar--message) · [with-action](/native/storybook-vue/?path=/story/krds-snackbar--with-action) · [with-icon](/native/storybook-vue/?path=/story/krds-snackbar--with-icon) · [undo-local](/native/storybook-vue/?path=/story/krds-snackbar--undo-local) · [action-error](/native/storybook-vue/?path=/story/krds-snackbar--action-error) · [close-focused](/native/storybook-vue/?path=/story/krds-snackbar--close-focused) · [timer-cleanup](/native/storybook-vue/?path=/story/krds-snackbar--timer-cleanup) · [narrow](/native/storybook-vue/?path=/story/krds-snackbar--narrow) · [navigation-link](/native/storybook-vue/?path=/story/krds-snackbar--navigation-link) · [same-id-error-action-update](/native/storybook-vue/?path=/story/krds-snackbar--same-id-error-action-update) · [dismissal-rejected](/native/storybook-vue/?path=/story/krds-snackbar--dismissal-rejected) · [host-queue-replacement](/native/storybook-vue/?path=/story/krds-snackbar--host-queue-replacement) · [generation-timer-pauses](/native/storybook-vue/?path=/story/krds-snackbar--generation-timer-pauses).
- lit: [Message](/native/storybook-lit/?path=/story/krds-snackbar--message) · [With Action](/native/storybook-lit/?path=/story/krds-snackbar--with-action) · [With Icon](/native/storybook-lit/?path=/story/krds-snackbar--with-icon) · [Undo Local](/native/storybook-lit/?path=/story/krds-snackbar--undo-local) · [Action Error](/native/storybook-lit/?path=/story/krds-snackbar--action-error) · [Close Focused](/native/storybook-lit/?path=/story/krds-snackbar--close-focused) · [Timer Cleanup](/native/storybook-lit/?path=/story/krds-snackbar--timer-cleanup) · [Narrow](/native/storybook-lit/?path=/story/krds-snackbar--narrow) · [Navigation Link](/native/storybook-lit/?path=/story/krds-snackbar--navigation-link) · [Same Id Error Action Update](/native/storybook-lit/?path=/story/krds-snackbar--same-id-error-action-update) · [Dismissal Rejected](/native/storybook-lit/?path=/story/krds-snackbar--dismissal-rejected) · [Host Queue Replacement](/native/storybook-lit/?path=/story/krds-snackbar--host-queue-replacement) · [Generation Timer Pauses](/native/storybook-lit/?path=/story/krds-snackbar--generation-timer-pauses).
- qwik: [message](/native/storybook-qwik/?path=/story/krds-snackbar--message) · [with-action](/native/storybook-qwik/?path=/story/krds-snackbar--with-action) · [with-icon](/native/storybook-qwik/?path=/story/krds-snackbar--with-icon) · [undo-local](/native/storybook-qwik/?path=/story/krds-snackbar--undo-local) · [action-error](/native/storybook-qwik/?path=/story/krds-snackbar--action-error) · [close-focused](/native/storybook-qwik/?path=/story/krds-snackbar--close-focused) · [timer-cleanup](/native/storybook-qwik/?path=/story/krds-snackbar--timer-cleanup) · [narrow](/native/storybook-qwik/?path=/story/krds-snackbar--narrow) · [navigation-link](/native/storybook-qwik/?path=/story/krds-snackbar--navigation-link) · [same-id-error-action-update](/native/storybook-qwik/?path=/story/krds-snackbar--same-id-error-action-update) · [dismissal-rejected](/native/storybook-qwik/?path=/story/krds-snackbar--dismissal-rejected) · [host-queue-replacement](/native/storybook-qwik/?path=/story/krds-snackbar--host-queue-replacement) · [generation-timer-pauses](/native/storybook-qwik/?path=/story/krds-snackbar--generation-timer-pauses).
- angular: [message](/native/storybook-angular/?path=/story/krds-snackbar--message) · [with-action](/native/storybook-angular/?path=/story/krds-snackbar--with-action) · [with-icon](/native/storybook-angular/?path=/story/krds-snackbar--with-icon) · [undo-local](/native/storybook-angular/?path=/story/krds-snackbar--undo-local) · [action-error](/native/storybook-angular/?path=/story/krds-snackbar--action-error) · [close-focused](/native/storybook-angular/?path=/story/krds-snackbar--close-focused) · [timer-cleanup](/native/storybook-angular/?path=/story/krds-snackbar--timer-cleanup) · [narrow](/native/storybook-angular/?path=/story/krds-snackbar--narrow) · [navigation-link](/native/storybook-angular/?path=/story/krds-snackbar--navigation-link) · [same-id-error-action-update](/native/storybook-angular/?path=/story/krds-snackbar--same-id-error-action-update) · [dismissal-rejected](/native/storybook-angular/?path=/story/krds-snackbar--dismissal-rejected) · [host-queue-replacement](/native/storybook-angular/?path=/story/krds-snackbar--host-queue-replacement) · [generation-timer-pauses](/native/storybook-angular/?path=/story/krds-snackbar--generation-timer-pauses).
- solid-next: unsupported native Storybook preview integration.

Native compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.

- react: [read the checked consumer](/examples/react-1); [download exact source](/sources/packages/react/examples/catalog.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/react/package-build-stderr.log.txt).
- solid: [read the checked consumer](/examples/solid-3); [download exact source](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/solid/package-build-stderr.log.txt).
- svelte: [read the checked consumer](/examples/svelte-56); [download exact source](/sources/apps/fixture-svelte/src/public-examples/SnackbarExample.svelte.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).
- vue: [read the checked consumer](/examples/vue-58); [download exact source](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/vue/package-build-stderr.log.txt).
- lit: [read the checked consumer](/examples/lit-60); [download exact source](/sources/apps/fixture-lit/src/examples/catalog.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/lit/package-build-stderr.log.txt).
- qwik: [read the checked consumer](/examples/qwik-61); [download exact source](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/qwik/package-build-stderr.log.txt).
- angular: [read the checked consumer](/examples/angular-62); [download exact source](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt); [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt), [compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).

## Source identity and rights

Baseline: `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`. Official detail snapshot retrieved `2026-10-29T23:28:06.246Z`. SHA-256: `37d9d9357b2e3f020afed315ff700cc2cc0ee3c3aee5df128c62b458fb1b7322`. [Frozen component source records](/sources/catalog/components.json.txt) · [Official source](https://www.krds.go.kr/html/site/component/component_12_06.html). Raw original HTML remains reference evidence in the checkout and is not copied into this site.

KRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/index.md) before redistributing.
