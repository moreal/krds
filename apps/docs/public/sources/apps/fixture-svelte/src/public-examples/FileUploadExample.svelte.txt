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
