# radio-group · svelte {#radio-group-·-svelte}

이 컴파일러 체크포인트는 아래 소스를 생산자의 공개 빌드 패키지 검사에 묶습니다. 원래의 import와 로컬 상태를 포함합니다. 최신 네이티브 후보, 동작, SSR/resume, 릴리스를 인증하지 않습니다.

- Nx 버전 적용 완료 후 새로 만든 컴파일러 체크포인트입니다. 공개 @unofficial-krds/svelte 버전은 0.1.0입니다. 소스와 보존된 명령·로그 바이트는 해시로 고정됩니다. 컴파일 성공만으로는 네이티브 동작, SSR/하이드레이션/resume, 수동 검사, 최종 릴리스 인수가 인정되지 않습니다.

소스: [apps/fixture-svelte/src/public-examples/RadioGroupExample.svelte](/sources/apps/fixture-svelte/src/public-examples/RadioGroupExample.svelte.txt). SHA-256: `8642fd041578bef34cbbbfa5c71b0a3f99d0768aeb768343b00523f5894ab636`.

명령: `node tools/yarn.mjs workspace @unofficial-krds/fixture-svelte typecheck`. [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/proof.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/stderr.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-result.json.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stdout.log.txt) · [원본 컴파일러 근거](/sources/apps/docs/compiler-checkpoints/final-versions/svelte/package-build-stderr.log.txt).


```svelte
<script lang="ts">
import RadioGroup from '@unofficial-krds/svelte/radio-group';
import type { RadioGroupProps } from '@unofficial-krds/svelte';
const props: RadioGroupProps = {
  "label": "거주 지역",
  "name": "region",
  "options": [
    {
      "value": "seoul",
      "label": "서울"
    },
    {
      "value": "busan",
      "label": "부산"
    },
    {
      "value": "jeju",
      "label": "제주",
      "disabled": true
    }
  ],
  "size": "medium",
  "appearance": "default"
};
</script>
<section data-example="radio-group"><RadioGroup {...props}/></section>
```

