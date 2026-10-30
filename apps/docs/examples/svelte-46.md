# file-upload · svelte

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/svelte version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-svelte/src/public-examples/FileUploadExample.svelte](/sources/apps/fixture-svelte/src/public-examples/FileUploadExample.svelte.txt). SHA-256: `376cdb52498118c9fb8535791fc0495323166d85340001c6030b3e274c16675f`.

Command: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


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

