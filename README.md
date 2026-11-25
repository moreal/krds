# Unofficial KRDS

대한민국 정부 디자인 시스템(KRDS)의 웹 컴포넌트 54개를 React, Vue, Svelte, Angular, Lit, Qwik, Solid 컴포넌트로 구현한 비공식 프로젝트입니다. 프레임워크마다 패키지가 따로 있고, Solid 2는 미리보기 패키지로 제공합니다.

npm에는 아직 게시하지 않았습니다. 공식 KRDS가 아닙니다.

[문서 사이트](https://moreal.github.io/krds/) · [설치하기](https://moreal.github.io/krds/getting-started/installation.html) · [컴포넌트](https://moreal.github.io/krds/components/) · [출처와 권리](https://moreal.github.io/krds/legal/)

## 사용하기

저장소에서 패키지를 빌드하고 tarball로 묶어 앱에 설치합니다. 단계별 방법과 프레임워크별 첫 예제는 [설치하기](https://moreal.github.io/krds/getting-started/installation.html)에 있습니다.

| 프레임워크 | 패키지 |
| --- | --- |
| React 19 | [`@unofficial-krds/react`](packages/react/README.md) |
| Vue 3 | [`@unofficial-krds/vue`](packages/vue/README.md) |
| Svelte 5 | [`@unofficial-krds/svelte`](packages/svelte/README.md) |
| Angular 22 | [`@unofficial-krds/angular`](packages/angular/README.md) |
| Lit 3 | [`@unofficial-krds/lit`](packages/lit/README.md) |
| Qwik 1 | [`@unofficial-krds/qwik`](packages/qwik/README.md) |
| Solid 1 | [`@unofficial-krds/solid`](packages/solid/README.md) |
| Solid 2 미리보기 | [`@unofficial-krds/solid-next`](packages/solid-next/README.md) |

모든 프레임워크 패키지는 [`@unofficial-krds/styles`](packages/styles/README.md)의 CSS와 [`@unofficial-krds/tokens`](packages/tokens/README.md)의 디자인 토큰을 함께 씁니다. 글꼴은 [`@unofficial-krds/fonts`](packages/fonts/README.md)에서 따로 고릅니다.

## 기여하기

Node 24.18.0이 필요합니다. 저장소에 들어 있는 Yarn을 `node tools/yarn.mjs`로 실행합니다.

```sh
node tools/yarn.mjs install --immutable
node tools/yarn.mjs nx run krds-docs:build
node tools/yarn.mjs exec node apps/docs/scripts/serve.mjs
```

문서는 `http://127.0.0.1:49100/krds/`에서 열립니다. `main`에 push하면 [Docs Pages workflow](.github/workflows/docs-pages.yml)가 문서를 GitHub Pages에 배포합니다. 테스트와 CI는 [CONTRIBUTING.md](CONTRIBUTING.md)에 있습니다.

## 라이선스

이 프로젝트에서 직접 작성한 코드는 MIT 라이선스입니다(Copyright (c) 2026 Lee Dogeon). KRDS 자료와 Pretendard GOV 글꼴은 원래 조건을 따릅니다. 자세한 내용은 [출처와 권리](https://moreal.github.io/krds/legal/)에 있습니다.
