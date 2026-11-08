# 프레임워크 호환성 {#framework-compatibility}

버전, 피어 범위, 지원 상태는 현재 네이티브 패키지 매니페스트, 호환성 대상, 커버리지 기록에서 생성합니다. 안정 **대상**이라고 해서 54개 컴포넌트가 모두 인수를 통과했다는 뜻은 아닙니다. 독립 리뷰, 동작 근거, 시각 검사, 출처 권리, 격리된 소비는 각각 별도 관문입니다.

| 네이티브 렌더러 | 패키지 | 선택한 런타임/컴파일러 | 공개 피어 | 기록된 커버리지 |
| --- | --- | --- | --- | --- |
| React native JSX | `@unofficial-krds/react@0.1.0` | `react@19.3.1`<br>`react-dom@19.3.1`<br>`@vitejs/plugin-react@6.1.2`<br>`@types/react@19.3.0`<br>`@types/react-dom@19.3.0` | `react@^19.3.1`<br>`react-dom@^19.3.1` | 54 planned |
| Solid 1 native JSX | `@unofficial-krds/solid@0.1.0` | `solid-js@1.9.18`<br>`vite-plugin-solid@2.11.14`<br>`babel-preset-solid@1.9.16`<br>`@babel/core@7.28.5` | `solid-js@^1.9.18` | 48 planned, 6 implemented |
| Svelte 5 native source/snippets | `@unofficial-krds/svelte@0.1.0` | `svelte@5.57.3`<br>`@sveltejs/package@3.0.1`<br>`@sveltejs/kit@3.1.0`<br>`@sveltejs/vite-plugin-svelte@7.3.1`<br>`svelte-check@4.7.7` | `svelte@^5.57.3` | 54 planned |
| Vue 3 native SFC/slots | `@unofficial-krds/vue@0.1.0` | `vue@3.5.44`<br>`@vue/compiler-sfc@3.5.44`<br>`@vitejs/plugin-vue@6.0.10`<br>`vue-tsc@3.3.14` | `vue@^3.5.44` | 54 planned |
| Lit native custom elements/DOM events | `@unofficial-krds/lit@0.1.0` | `lit@3.3.3`<br>`@lit-labs/ssr@4.1.0`<br>`@lit-labs/ssr-client@1.1.8` | `lit@^3.3.3` | 54 planned |
| Qwik 1 native component$/QRL | `@unofficial-krds/qwik@0.1.0` | `@builder.io/qwik@1.20.3`<br>`@builder.io/qwik-city@1.20.3` | `@builder.io/qwik@^1.20.3` | 54 planned |
| Angular 22 native standalone components/inputs/outputs | `@unofficial-krds/angular@0.1.0` | `@angular/core@22.2.4`<br>`@angular/compiler@22.2.4`<br>`@angular/compiler-cli@22.2.4`<br>`@angular/cli@22.2.5`<br>`@angular/build@22.2.5`<br>`@angular-devkit/build-angular@22.2.5`<br>`@angular/ssr@22.2.5`<br>`ng-packagr@22.2.5`<br>`@angular/common@22.2.4`<br>`@angular/forms@22.2.4`<br>`@angular/router@22.2.4`<br>`@angular/platform-browser@22.2.4`<br>`@angular/platform-browser-dynamic@22.2.4`<br>`@angular/platform-server@22.2.4`<br>`@angular/animations@22.2.4`<br>`@angular-devkit/core@22.2.5`<br>`@angular-devkit/architect@0.2202.5`<br>`rxjs@7.8.2`<br>`zone.js@0.16.3`<br>`tslib@2.8.1` | `@angular/common@^22.2.4`<br>`@angular/core@^22.2.4`<br>`@angular/forms@^22.2.4` | 54 planned |
| Solid 2 native runtime and @solidjs/web renderer · **미리보기** | `@unofficial-krds/solid-next@0.1.0-preview.0` | `solid-js@2.0.0-rc.19`<br>`@solidjs/web@2.0.0-rc.19`<br>`@solidjs/compiler@2.0.0-rc.19`<br>`@solidjs/babel-plugin@2.0.0-rc.19`<br>`@solidjs/vite-plugin@3.0.0-next.53`<br>`@babel/core@7.28.5`<br>`@babel/preset-typescript@7.28.5` | `@solidjs/web@2.0.0-rc.19`<br>`solid-js@2.0.0-rc.19` | 54 planned |

## 근거의 의미 {#what-the-evidence-means}

`planned`는 작업을 예약한 상태입니다. `in-progress`는 진행 중인 작업을 기록합니다. `implemented`는 완전한 인수 없이 구현만 기록합니다. `blocked`는 해결되지 않은 관문을 기록합니다. `verified`에는 커버리지 스키마가 정한 컨트롤러 소유 네이티브 근거와 독립 리뷰가 필요합니다. 미리보기는 안정 합계와 분리됩니다. 기록된 상태는 각 컴포넌트 페이지에서 확인합니다.

## 패키지와 브라우저 경계 {#package-and-browser-boundaries}

Qwik은 Vite 7을 씁니다. 나머지 선택된 네이티브 Vite 워크스페이스는 Vite 8을 씁니다. Angular는 자체 CLI/ng-packagr의 partial APF 출력과 CVA 폼을 맡습니다. Solid 1과 Solid 2는 런타임, 컴파일러, 렌더러 그래프가 서로 격리됩니다. Svelte 2/3은 현재 안정 대상이 아닙니다. 선언된 피어 범위가 그 안의 모든 버전을 테스트했다는 근거는 아닙니다.

[네이티브 예제](./examples) · [Solid 1 → 2](./solid-migration) · [테스트 역할](../getting-started/testing)
