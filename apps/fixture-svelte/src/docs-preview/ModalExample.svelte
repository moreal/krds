<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import Modal from '@unofficial-krds/svelte/modal';
</script>
<Modal title="확인">
  {#snippet trigger({ open, expanded, controls })}
    <Button variant="secondary" aria-haspopup="dialog" aria-expanded={expanded} aria-controls={controls} onclick={open}>열기</Button>
  {/snippet}
  변경 내용을 확인하세요.
</Modal>
