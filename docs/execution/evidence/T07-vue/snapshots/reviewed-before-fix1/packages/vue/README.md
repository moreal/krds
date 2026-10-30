# @unofficial-krds/vue

Native Vue 3.5.44 six-component pilot: Button, NativeSelect, Modal, Tabs, Calendar and DateInput. This is an independent implementation; it does not claim official KRDS endorsement, full catalog coverage or release readiness. Original KRDS and font rights remain separate from the independent-code MIT grant; see LICENSE.md, ATTRIBUTION.md and THIRD-PARTY-NOTICES.md.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, DateInput } from '@unofficial-krds/vue';
import '@unofficial-krds/styles/all.css';
const visit = ref<string | null>(null);
</script>
<template>
  <DateInput v-model="visit" label="방문일" name="visit" reference-date="2024-02-15" />
  <Button type="submit">신청</Button>
</template>
```

Use root named exports or default component subpaths `/button`, `/native-select`, `/modal`, `/tabs`, `/calendar`, `/date-input`. Controlled inputs accept `value` (Modal `open`) or `v-model`; requests emit `value-change` (`{value}`) and `open-change` (`{open}`). The parent remains authoritative. Native slots support rich labels, hints/errors, modal body/actions and persistent tab panels. `KrdsProvider` supplies locale, direction and document access without browser globals at import time.

See `docs/compatibility/vue.md` in the repository for the compiled consumer example, form/date behavior, SSR limits and verification evidence. Publication, pushing and tagging are not authorized by the pilot implementation.
