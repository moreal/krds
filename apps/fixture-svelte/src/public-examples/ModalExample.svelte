<script lang="ts">
import Modal from '@unofficial-krds/svelte/modal';
import type { ModalProps } from '@unofficial-krds/svelte';
const props: ModalProps = {title:"확인",defaultOpen:false};
</script>
<section data-example="modal"><Modal {...props}/></section>
