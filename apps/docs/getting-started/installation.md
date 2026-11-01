# 로컬에서 시작하기

KRDS Native는 `@unofficial-krds` 이름을 선택한 비공식 독립 프로젝트입니다. 공개 패키지의 소스 버전은 `0.1.0`, 비공개 문서 워크스페이스는 `0.0.0`입니다. 이름과 저장소 메타데이터는 인증된 소유권이나 npm 게시 여부를 증명하지 않습니다. 이 안내는 저장소의 로컬 빌드를 사용합니다.

## 도구와 의존성 설치

저장소가 선택한 버전은 Node **24.18.0**, Yarn **4.14.1**입니다. `compatibility/toolchain.json`과 저장소 래퍼가 정확한 도구를 지정합니다. 전역 도구는 바꾸지 않습니다. 다른 환경에서는 먼저 이 Node 버전을 설치하세요.

```sh
node tools/yarn.mjs --version
node tools/yarn.mjs install --immutable
```

Yarn Berry와 단일 `yarn.lock`을 사용합니다. `.yarnrc.yml`의 `nodeLinker: pnpm`은 Yarn의 연결 방식입니다. `pnpm install`이나 별도 npm/pnpm lockfile을 사용하지 않습니다.

## Vue 컴포넌트로 첫 화면 만들기

[호환성 기록](../compatibility/)에서 원하는 프레임워크의 런타임·컴파일러와 지원 범위를 확인하세요. 아래 Vue 예시는 공개 Vue subpath를 사용합니다. 문서 사이트 자체는 Astro와 공개 Solid 1 컴포넌트로 렌더링합니다. 다른 프레임워크는 각자의 네이티브 어댑터와 소비자 코드가 있습니다.

```sh
node tools/yarn.mjs nx run krds-vue:build
node tools/yarn.mjs workspace @unofficial-krds/fixture-vue typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-vue build:local
```

Nx는 공유 contracts·tokens·styles를 먼저 빌드합니다. 출력은 각 워크스페이스의 `dist/`에 생성됩니다. 다음 코드는 같은 저장소에서 해당 패키지를 직접 의존성으로 선언한 Vue 앱에서 사용할 수 있습니다.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import Button from '@unofficial-krds/vue/button';
import Switch from '@unofficial-krds/vue/switch';
import '@unofficial-krds/styles/button.css';
import '@unofficial-krds/styles/switch.css';
const enabled = ref(false);
</script>

<template>
  <Switch id="example-notifications" v-model="enabled" label="알림 받기" />
  <Button :disabled="!enabled">계속하기</Button>
</template>
```

컴포넌트 스타일과 토큰은 명시적으로 가져옵니다. 전역 reset과 글꼴은 자동 적용하지 않습니다. KRDS의 rem 토큰과 기존 앱의 기본 글자 크기를 함께 검토하고 [CSS·토큰·글꼴 안내](./styling)를 따르세요. 문서 사이트는 공개 reset과 KRDS 스타일을 전체 UI에 적용하며, 원본 로컬 Pretendard GOV 글꼴을 사용합니다. 기본 root는 10px, 본문은 16px이고 medium Button은 48px입니다. 밝은 테마와 forced-colors를 지원합니다.

[54개 참조 문서](../components/)에서 API·키보드 규칙·출처를 확인하고, [네이티브 예시](../compatibility/examples)에서 실제 소비자 코드와 보존된 컴파일 체크포인트를 읽으세요. 컴파일 성공과 전체 동작 검증은 별도입니다.

## 문서와 로컬 미리보기

```sh
node tools/yarn.mjs nx run krds-docs:build
node tools/yarn.mjs workspace @unofficial-krds/docs typecheck
node tools/yarn.mjs workspace @unofficial-krds/docs test
node tools/yarn.mjs exec node apps/docs/scripts/serve.mjs
```

`http://127.0.0.1:49100/krds/`를 여세요. 공개 문서의 하위 페이지는 `.html` 주소를 사용하므로 직접 진입·새로고침할 수 있습니다. 공개 사이트에는 Fixture나 Storybook을 호스팅하지 않습니다. 각각 빌드한 뒤 로컬 서버의 `/krds/native/fixture-vue/`, `/krds/native/storybook-vue/` 같은 경로를 사용하세요. 없는 출력은 404로 명확히 표시합니다. Qwik 프로덕션 resume은 실제 SSR 서버와 첫 lazy 이벤트 검사가 필요합니다.

## 로컬 패키지 파일 검사

패키징은 npm 게시와 별도입니다. 필요한 패키지를 빌드한 뒤 임시 위치에 로컬 tarball을 만들 수 있습니다.

```sh
node tools/yarn.mjs workspace @unofficial-krds/vue pack --out /tmp/krds-vue-local.tgz
```

`package.json`, 공개 `dist/` export, 라이선스·출처·provenance를 검사하세요. 독립 앱에서 사용할 때는 선언된 모든 내부 공개 의존성의 실제 로컬 tarball과 정확한 프레임워크 버전이 필요합니다. 워크스페이스 빌드만으로 독립 설치를 검증했다고 볼 수 없습니다.

[과거 산출물 기록](./artifacts)은 당시 버전·파일명·해시를 보존한 체크포인트입니다. 현재 파일의 존재나 릴리스 승인을 뜻하지 않습니다. 현재 후보의 실제 바이트·설치·승인은 별도 릴리스 기록에서 확인해야 합니다. 이번 문서 작업은 npm 게시와 태그 생성을 포함하지 않습니다.
