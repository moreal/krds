# File upload · svelte {#file-upload-·-svelte}

공개 `@unofficial-krds/svelte` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FileUploadExample.svelte.txt).


```svelte
<script lang="ts">
import FileUpload from '@unofficial-krds/svelte/file-upload';
import type { FileUploadProps } from '@unofficial-krds/svelte';
const props: FileUploadProps = {
  "label": "첨부 서류",
  "name": "documents",
  "files": [],
  "multiple": false,
  "accept": ".txt,.pdf",
  "maxFiles": 3,
  "maxBytes": 1048576
,
onFilesChange: () => {}
};
</script>
<section data-example="file-upload"><FileUpload {...props}/></section>
```

