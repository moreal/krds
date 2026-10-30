# Vue native pilot

The six controls use Vue 3.5.44 SFCs, native rendering, typed props/emits, slots and provide/inject. Vue remains a peer with an exact development copy. No foreign renderer or adapter is imported. The pilot does not establish full catalog or release readiness.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DateInput, KrdsProvider } from '@unofficial-krds/vue';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';
const visit = ref<string | null>('2024-02-29');
</script>
<template>
  <KrdsProvider locale="ko-KR">
    <DateInput v-model="visit" label="방문일" name="visit" reference-date="2024-02-15" />
  </KrdsProvider>
</template>
```

Root named exports are Button, NativeSelect, Modal, Tabs, Calendar, DateInput and KrdsProvider, plus semantic TypeScript types. Default component subpaths are `/button`, `/native-select`, `/modal`, `/tabs`, `/calendar`, `/date-input`. `v-model` and controlled `value`/`open` are supported. Requests emit `value-change` (`{value}`) and `open-change` (`{open}`); parent props remain authoritative. Do not bind both controlled forms to one component.

NativeSelect and DateInput expose `label`, `hint`, and `error` slots. Tabs exposes a rich `label` slot with `{item}` and named panel slots matching item values. Modal exposes `title`, `description`, default body and `actions` with `{close}`, and `trigger` with `{open,isOpen}`. Without the icon close control an enabled explicit action marked `data-krds-close` is required. Initial focus IDs may target only the dialog or its first interactive element. Enabled tabs and dates all remain sequential Tab stops.

KrdsProvider supplies reactive locale/direction and an optional document getter. Built root/subpath imports and SSR of closed controls use no DOM globals. Open modal portals require a mounted browser document. IDs use Vue useId; consumers must keep SSR/hydration app prefixes consistent.

DateInput uses strict ASCII Gregorian dates, separate raw drafts and canonical hidden form values. Mode is immutable; range commits are complete or empty. Enter/group blur commit, IME preserves drafts, and Calendar remains tentative until Confirm. No implicit clock exists. Form reset emits no value events.

`apps/fixture-vue/src/ConsumerExample.vue` is compiled with vue-tsc against the public built package and default subpath. `apps/fixture-vue/tests/ssr-consumer.mjs` verifies built public native Vue SSR. Behavioral tests live separately under the fixture's `tests/siheom`; state-only stories live under `apps/storybook-vue/src/stories`. Exact evidence and remaining gates are in `.superpowers/sdd/PLAN/task-T07-vue-report.md`.
