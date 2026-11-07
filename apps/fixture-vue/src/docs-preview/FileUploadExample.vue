<script setup lang="ts">
import { ref } from 'vue';
import { Button, FileUpload, type FileRecord } from '@unofficial-krds/vue';
const files=ref<readonly FileRecord[]>([]);
</script>
<template><div><form id="example-form" @submit.prevent @reset="files=[]"><FileUpload :files="files" label="첨부 서류" name="documents" accept=".txt,.pdf" multiple @files-change="files=$event.value"/></form><p role="status">선택한 파일: {{files.map(record=>record.file.name).join(", ") || "없음"}}</p><div class="actions"><Button type="reset" form="example-form" variant="tertiary" size="small">초기화</Button></div></div></template>
