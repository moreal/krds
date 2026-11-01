# Unofficial KRDS

대한민국 정부 디자인 시스템(KRDS)을 React, Solid, Svelte, Vue, Lit, Qwik, Angular의 고유 렌더러로 구현하는 **비공식 독립 프로젝트**입니다. Solid 2는 별도 프리뷰로 격리합니다. 컴포넌트별 지원 범위는 실제 [호환성 기록](docs/compatibility/README.md)과 [카탈로그](docs/components/README.md)에서 확인하세요.

[문서 사이트](https://moreal.github.io/krds/) · [빠른 시작](docs/getting-started/installation.md) · [54개 컴포넌트](docs/components/README.md) · [출처와 라이선스](docs/legal/index.md)

공개 패키지의 소스 버전은 `0.1.0`, 비공개 문서 워크스페이스는 `0.0.0`입니다. 선택한 네임스페이스 `@unofficial-krds`는 npm 게시 여부나 계정 소유권 확인을 뜻하지 않습니다. 현재는 저장소를 빌드해 사용하는 로컬 개발 후보이며, 모든 컴포넌트의 검증 완료를 주장하지 않습니다.

## 로컬에서 시작하기

[선택된 도구](compatibility/toolchain.json)는 Node **24.18.0**, Yarn **4.14.1**입니다. 저장소 래퍼는 해당 Node와 vendored Yarn을 실행하며 전역 도구를 바꾸지 않습니다. Linux CI에서는 먼저 정확한 Node 버전을 설치합니다.

```sh
node tools/yarn.mjs install --immutable
node tools/yarn.mjs nx run krds-docs:build
node tools/yarn.mjs workspace @unofficial-krds/docs typecheck
node tools/yarn.mjs exec node apps/docs/scripts/serve.mjs
```

문서는 `http://127.0.0.1:49100/krds/`에서 열립니다. 문서 빌드는 Astro 및 공개 Solid 1 UI에 필요한 공유 패키지와 Solid 패키지를 먼저 빌드합니다. 프레임워크별 소비자 코드와 빌드 명령은 [빠른 시작](docs/getting-started/installation.md)을 참고하세요. Fixture와 Storybook은 별도로 빌드한 뒤 로컬 서버의 `/krds/native/` 경로에서 확인합니다. Qwik 프로덕션 SSR/resume은 전용 서버와 검사가 필요합니다.

## 문서 배포

[Docs Pages workflow](.github/workflows/docs-pages.yml)는 `main` push 또는 수동 실행으로 문서 빌드, 타입·링크·브라우저·권리 검사를 거친 `apps/docs/dist`를 GitHub Pages에 배포합니다. 문서 공개는 npm 패키지 게시나 릴리스 태그를 만들지 않습니다.

독립 구현 코드는 Lee Dogeon의 2026 MIT 허가를 따릅니다. 공식 KRDS 자료와 글꼴은 별도 권리와 조건을 유지합니다. 재사용·재배포 전 [라이선스와 출처 안내](docs/legal/index.md)를 확인하세요. 공식 KRDS 또는 정부 기관의 보증·후원을 의미하지 않습니다.
