<script lang="ts">
import FileUpload from '@unofficial-krds/svelte/file-upload';
import type { FileUploadProps } from '@unofficial-krds/svelte';
let files = $state<FileUploadProps['files']>([]);
</script>
<FileUpload label="첨부 서류" name="documents" multiple accept=".txt,.pdf" maxFiles={3} maxBytes={1048576} {files} onFilesChange={(d) => files = d.value} />
<p role="status">선택한 파일: {files.length ? files.map((f) => f.file.name).join(', ') : '없음'}</p>
