<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import type { Snippet } from 'svelte';
let { children }: { children: Snippet } = $props();
let result = $state('');
// The docs sandbox blocks native form submission, so the output is produced by a plain button handler.
function inspect(event: MouseEvent) { const form = (event.currentTarget as HTMLButtonElement).form!; result = JSON.stringify(Object.fromEntries(new FormData(form))); }
</script>
<form onreset={() => result = ''}>
  {@render children()}
  <Button variant="secondary" size="small" onclick={inspect}>입력 확인</Button>
  <output aria-label="입력 결과">{result}</output>
  <div class="preview-actions"><Button type="reset" variant="tertiary" size="small">입력 초기화</Button></div>
</form>
