# Modal · svelte {#modal-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ModalExample.svelte.txt).


```svelte
<script lang="ts">
import Modal from '@unofficial-krds/svelte/modal';
import type { ModalProps } from '@unofficial-krds/svelte';
const props: ModalProps = {title:"확인",defaultOpen:false};
</script>
<section data-example="modal"><Modal {...props}/></section>
```

