# 로컬에서 시작하기

Unofficial KRDS는 KRDS를 여러 프레임워크의 컴포넌트로 구현한 비공식 독립 프로젝트입니다. 패키지 이름은 `@unofficial-krds`로 시작하고 현재 버전은 `0.1.0`입니다.

아직 npm에 게시하지 않았습니다. [저장소](https://github.com/moreal/krds)를 내려받아 빌드해서 씁니다.

## 도구와 의존성 설치

Node **24.18.0**과 Yarn **4.14.1**을 씁니다. Yarn은 저장소에 들어 있으므로 따로 설치하지 않습니다.

1. Node 24.18.0을 설치합니다.
2. 저장소 루트에서 아래 명령을 실행합니다.

```sh
node tools/yarn.mjs --version
node tools/yarn.mjs install --immutable
```

`node tools/yarn.mjs`는 저장소가 지정한 Yarn을 실행합니다. 전역 도구는 바꾸지 않습니다. 정확한 버전은 `compatibility/toolchain.json`에 있습니다.

설치는 Yarn으로만 합니다. lockfile은 `yarn.lock` 하나입니다. `.yarnrc.yml`의 `nodeLinker: pnpm`은 Yarn이 패키지를 연결하는 방식일 뿐이므로 `pnpm install`은 쓰지 않습니다.

## Vue 컴포넌트로 첫 화면 만들기

아래는 Vue 예시입니다. 다른 프레임워크에도 각자의 패키지와 예제 앱이 있습니다. 프레임워크별 지원 버전은 [호환성 기록](../compatibility/)에서 확인하세요.

먼저 Vue 패키지와 Vue 예제 앱을 빌드합니다.

```sh
node tools/yarn.mjs nx run krds-vue:build
node tools/yarn.mjs workspace @unofficial-krds/fixture-vue typecheck
node tools/yarn.mjs workspace @unofficial-krds/fixture-vue build:local
```

Nx가 공유 패키지(contracts, tokens, styles)를 먼저 빌드합니다. 결과물은 각 워크스페이스의 `dist/`에 생깁니다.

이제 같은 저장소 안에서 이 패키지를 의존성으로 선언한 Vue 앱이라면 다음처럼 쓸 수 있습니다.

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

스타일은 쓰는 컴포넌트마다 직접 import합니다. 전역 reset과 글꼴은 자동으로 적용되지 않습니다.

KRDS 토큰은 rem 단위입니다. 기존 앱에 넣을 때는 앱의 기본 글자 크기와 맞는지 확인하고 [CSS·토큰·글꼴 안내](./styling)를 따르세요. 참고로 이 문서 사이트는 reset과 KRDS 스타일을 전체에 적용했습니다. root는 10px, 본문은 16px이고 medium Button은 48px입니다. 밝은 테마와 forced-colors를 지원합니다.

다음에 볼 문서는 두 가지입니다.

- [컴포넌트 문서](../components/): 컴포넌트별 API와 키보드 규칙
- [네이티브 예시](../compatibility/examples): 프레임워크별 실제 사용 코드

## 문서와 로컬 미리보기

이 문서 사이트를 로컬에서 빌드해 띄울 수 있습니다.

```sh
node tools/yarn.mjs nx run krds-docs:build
node tools/yarn.mjs workspace @unofficial-krds/docs typecheck
node tools/yarn.mjs workspace @unofficial-krds/docs test
node tools/yarn.mjs exec node apps/docs/scripts/serve.mjs
```

서버가 뜨면 `http://127.0.0.1:49100/krds/`를 여세요. 하위 페이지는 `.html` 주소를 쓰므로 주소로 바로 들어가거나 새로고침해도 됩니다.

예제 앱과 Storybook은 공개 사이트에 올리지 않습니다. 각각 빌드한 뒤 로컬 서버의 `/krds/native/fixture-vue/`, `/krds/native/storybook-vue/` 같은 경로에서 봅니다. 빌드하지 않은 경로는 404로 표시됩니다.

## 로컬 패키지 파일 검사

저장소 밖의 앱에서 써 보려면 패키지를 tarball로 만듭니다. 필요한 패키지를 빌드한 뒤 실행합니다.

```sh
node tools/yarn.mjs workspace @unofficial-krds/vue pack --out /tmp/krds-vue-local.tgz
```

tarball에서 `package.json`, 공개 `dist/` export, 라이선스와 출처 파일을 확인하세요.

독립 앱에 설치할 때는 두 가지가 더 필요합니다.

- 그 패키지가 의존하는 다른 `@unofficial-krds` 패키지의 tarball
- [호환성 기록](../compatibility/)에 적힌 정확한 프레임워크 버전
