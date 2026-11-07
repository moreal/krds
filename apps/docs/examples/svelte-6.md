# header · svelte {#header-·-svelte}

이 컴파일러 체크포인트는 아래 소스를 생산자의 공개 빌드 패키지 검사에 묶습니다. 원래의 import와 로컬 상태를 포함합니다. 최신 네이티브 후보, 동작, SSR/resume, 릴리스를 인증하지 않습니다.

- Nx 버전 적용 완료 후 새로 만든 컴파일러 체크포인트입니다. 공개 @unofficial-krds/svelte 버전은 0.1.0입니다. 소스와 보존된 명령·로그 바이트는 해시로 고정됩니다. 컴파일 성공만으로는 네이티브 동작, SSR/하이드레이션/resume, 수동 검사, 최종 릴리스 인수가 인정되지 않습니다.

소스: [apps/fixture-svelte/src/public-examples/HeaderExample.svelte](/sources/apps/fixture-svelte/src/public-examples/HeaderExample.svelte.txt). SHA-256: `e838fa4ef72a748067476d3e3563742302b9b47a6e881c81aa5d233ff27d670a`.

명령: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import Header from '@unofficial-krds/svelte/header';
import type { HeaderProps } from '@unofficial-krds/svelte';
const props: HeaderProps = {
  "home": {
    "href": "/local/home",
    "label": "예제 서비스 홈",
    "logo": {
      "src": "/local-assets/specimen-logo.svg",
      "alt": "예제 서비스 홈"
    }
  },
  "utilityItems": [
    {
      "id": "policy",
      "label": "이용약관",
      "href": "/local/policy"
    }
  ],
  "mainNavigation": [
    {
      "id": "home",
      "label": "홈",
      "href": "/local/home"
    },
    {
      "id": "apply",
      "label": "신청",
      "children": [
        {
          "id": "apply-new",
          "label": "신규 신청",
          "href": "/local/apply"
        },
        {
          "id": "history",
          "label": "신청 내역",
          "href": "/local/history"
        }
      ]
    },
    {
      "id": "support",
      "label": "지원",
      "href": "/local/support"
    }
  ],
  "actionLayout": "horizontal",
  "sticky": false
};
</script>
<section data-example="header"><Header {...props}/></section>
```

