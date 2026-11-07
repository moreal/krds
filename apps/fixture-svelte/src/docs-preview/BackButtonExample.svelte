<script lang="ts">
import BackButton from '@unofficial-krds/svelte/back-button';
import { localRoute } from './shared';
let route = $state(localRoute('current'));
</script>
<BackButton label="뒤로가기" canGoBack fallbackHref={localRoute('parent')} dirty={false} onBackRequest={() => route = localRoute('parent')} />
<p>현재 위치: {route}</p>
