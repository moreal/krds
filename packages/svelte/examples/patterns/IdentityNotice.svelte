<script lang="ts">
import type { Identity } from './types';
let { identity }: {
    identity: Identity;
} = $props();
</script>
<aside aria-label="독립 예제 안내"><p><strong>{identity.name}</strong></p><p>{identity.notice}</p><p>{identity.dataNotice}</p></aside>
