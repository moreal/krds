# breadcrumb · svelte {#breadcrumb-·-svelte}

이 컴파일러 체크포인트는 아래 소스를 생산자의 공개 빌드 패키지 검사에 묶습니다. 원래의 import와 로컬 상태를 포함합니다. 최신 네이티브 후보, 동작, SSR/resume, 릴리스를 인증하지 않습니다.

- Nx 버전 적용 완료 후 새로 만든 컴파일러 체크포인트입니다. 공개 @unofficial-krds/svelte 버전은 0.1.0입니다. 소스와 보존된 명령·로그 바이트는 해시로 고정됩니다. 컴파일 성공만으로는 네이티브 동작, SSR/하이드레이션/resume, 수동 검사, 최종 릴리스 인수가 인정되지 않습니다.

소스: [apps/fixture-svelte/src/public-examples/BreadcrumbExample.svelte](/sources/apps/fixture-svelte/src/public-examples/BreadcrumbExample.svelte.txt). SHA-256: `19686c4b356eab13bca4948d1913f3f4fc9e6e619d6ad58fe151183f0508bf09`.

명령: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import Breadcrumb from '@unofficial-krds/svelte/breadcrumb';
import type { BreadcrumbProps } from '@unofficial-krds/svelte';
const props: BreadcrumbProps = {
  "home": {
    "href": "/local/home",
    "label": "홈"
  },
  "items": [
    {
      "id": "apply",
      "label": "신청",
      "href": "/local/apply"
    }
  ],
  "omitCurrent": true,
  "maxVisible": 4,
  "currentItem": {
    "id": "detail",
    "label": "신청 상세"
  }
};
</script>
<section data-example="breadcrumb"><Breadcrumb {...props}/></section>
```

