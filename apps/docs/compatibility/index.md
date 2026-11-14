# 프레임워크 호환성 {#framework-compatibility}

프레임워크마다 패키지가 따로 있습니다. 아래는 각 패키지를 빌드하고 테스트할 때 쓰는 런타임과 컴파일러 버전, 그리고 설치할 때 필요한 피어 의존성입니다. 패키지는 아직 npm에 게시하지 않았습니다.

| 프레임워크 | 패키지 | 빌드·테스트에 쓰는 버전 | 피어 의존성 |
| --- | --- | --- | --- |
| React | `@unofficial-krds/react@0.1.0` | `react@19.3.1`<br>`react-dom@19.3.1`<br>`@vitejs/plugin-react@6.1.2`<br>`@types/react@19.3.0`<br>`@types/react-dom@19.3.0` | `react@^19.3.1`<br>`react-dom@^19.3.1` |
| Solid 1 | `@unofficial-krds/solid@0.1.0` | `solid-js@1.9.18`<br>`vite-plugin-solid@2.11.14`<br>`babel-preset-solid@1.9.16`<br>`@babel/core@7.28.5` | `solid-js@^1.9.18` |
| Svelte | `@unofficial-krds/svelte@0.1.0` | `svelte@5.57.3`<br>`@sveltejs/package@3.0.1`<br>`@sveltejs/kit@3.1.0`<br>`@sveltejs/vite-plugin-svelte@7.3.1`<br>`svelte-check@4.7.7` | `svelte@^5.57.3` |
| Vue | `@unofficial-krds/vue@0.1.0` | `vue@3.5.44`<br>`@vue/compiler-sfc@3.5.44`<br>`@vitejs/plugin-vue@6.0.10`<br>`vue-tsc@3.3.14` | `vue@^3.5.44` |
| Lit | `@unofficial-krds/lit@0.1.0` | `lit@3.3.3`<br>`@lit-labs/ssr@4.1.0`<br>`@lit-labs/ssr-client@1.1.8` | `lit@^3.3.3` |
| Qwik | `@unofficial-krds/qwik@0.1.0` | `@builder.io/qwik@1.20.3`<br>`@builder.io/qwik-city@1.20.3` | `@builder.io/qwik@^1.20.3` |
| Angular | `@unofficial-krds/angular@0.1.0` | `@angular/core@22.2.4`<br>`@angular/compiler@22.2.4`<br>`@angular/compiler-cli@22.2.4`<br>`@angular/cli@22.2.5`<br>`@angular/build@22.2.5`<br>`@angular-devkit/build-angular@22.2.5`<br>`@angular/ssr@22.2.5`<br>`ng-packagr@22.2.5`<br>`@angular/common@22.2.4`<br>`@angular/forms@22.2.4`<br>`@angular/router@22.2.4`<br>`@angular/platform-browser@22.2.4`<br>`@angular/platform-browser-dynamic@22.2.4`<br>`@angular/platform-server@22.2.4`<br>`@angular/animations@22.2.4`<br>`@angular-devkit/core@22.2.5`<br>`@angular-devkit/architect@0.2202.5`<br>`rxjs@7.8.2`<br>`zone.js@0.16.3`<br>`tslib@2.8.1` | `@angular/common@^22.2.4`<br>`@angular/core@^22.2.4`<br>`@angular/forms@^22.2.4` |
| Solid 2 · **미리보기** | `@unofficial-krds/solid-next@0.1.0-preview.0` | `solid-js@2.0.0-rc.19`<br>`@solidjs/web@2.0.0-rc.19`<br>`@solidjs/compiler@2.0.0-rc.19`<br>`@solidjs/babel-plugin@2.0.0-rc.19`<br>`@solidjs/vite-plugin@3.0.0-next.53`<br>`@babel/core@7.28.5`<br>`@babel/preset-typescript@7.28.5` | `@solidjs/web@2.0.0-rc.19`<br>`solid-js@2.0.0-rc.19` |

Solid 2는 미리보기 단계라 일부 컴포넌트만 제공합니다. 제공 여부는 각 컴포넌트 페이지의 Solid 2 탭에서 확인합니다.

## 프레임워크별 콘텐츠와 이벤트 {#native-content-and-event-transport}

속성 이름과 타입은 모든 프레임워크가 같습니다. 콘텐츠를 넣고 이벤트를 받는 문법만 각 프레임워크의 방식을 따릅니다.

- React, Solid: JSX와 콘텐츠 prop
- Svelte: snippet
- Vue: 슬롯
- Angular: input, output, 콘텐츠 투영
- Lit: custom element 속성, 슬롯, DOM 이벤트
- Qwik: QRL 이벤트

정확한 문법은 각 컴포넌트 페이지의 코드 탭에서 프레임워크별로 확인합니다. 속성 표의 `on…` 콜백 이름이 Lit의 DOM 이벤트 이름과 같다는 뜻은 아닙니다.

## 버전을 고를 때 {#package-and-browser-boundaries}

- Qwik은 Vite 7, 나머지 Vite 기반 프레임워크는 Vite 8에 맞췄습니다.
- Angular 패키지는 ng-packagr로 만든 partial APF 형식이고, 폼 컴포넌트는 `ControlValueAccessor`로 연결합니다.
- Solid 1과 Solid 2는 패키지가 다릅니다. 한 앱에서 섞어 쓰지 않습니다.
- Svelte는 5 버전만 지원합니다.
- 피어 의존성 범위 안의 모든 버전을 테스트하지는 않았습니다. 표의 버전이 가장 확실합니다.

[프레임워크별 예제](./examples) · [Solid 1 → 2](./solid-migration) · [테스트 역할](../getting-started/testing)
