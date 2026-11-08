# 네이티브 예제 {#native-examples}

프레임워크마다 공개 패키지를 사용하는 예제 코드와 조립된 미리보기가 있습니다. 예제는 컴파일 검사를 통과한 소스이며, 동작 검증이나 릴리스 준비를 뜻하지는 않습니다.

## 예제 커버리지 {#checkpoint-coverage}

| 프레임워크 | 예제가 있는 컴포넌트 수 |
| --- | --- |
| [solid](#solid) | 54 |
| [react](#react) | 54 |
| [svelte](#svelte) | 54 |
| [vue](#vue) | 54 |
| [lit](#lit) | 54 |
| [qwik](#qwik) | 54 |
| [angular](#angular) | 54 |

## 로컬 네이티브 미리보기 {#local-native-previews}

각 프레임워크의 미리보기는 `/krds/previews/<framework>/`에 조립됩니다. 문서를 빌드한 뒤 `node apps/docs/scripts/serve.mjs`를 실행하면 같은 트리를 로컬에서 볼 수 있습니다. 이 서버는 네이티브 앱을 다시 빌드하지 않으며 없는 파일에는 404를 반환합니다.


## react {#react}

[패키지 매니페스트](/sources/packages/react/package.json.txt) · [호환성 보고서](/sources/docs/compatibility/react.md.txt)

미리보기: `/krds/previews/react/`

- [예제 코드 보기](/examples/react-1) · [소스 파일 내려받기](/sources/packages/react/examples/catalog.tsx.txt) · 컴포넌트 54개
- [apps/fixture-react/src/CatalogExample.tsx](/sources/apps/fixture-react/src/CatalogExample.tsx.txt)
- [apps/fixture-react/src/main.tsx](/sources/apps/fixture-react/src/main.tsx.txt)

## solid {#solid}

[패키지 매니페스트](/sources/packages/solid/package.json.txt) · [호환성 보고서](/sources/docs/compatibility/solid.md.txt)

미리보기: `/krds/previews/solid/`

- [예제 코드 보기](/examples/solid-2) · [소스 파일 내려받기](/sources/apps/fixture-solid/src/examples.tsx.txt) · 컴포넌트 6개
- [예제 코드 보기](/examples/solid-3) · [소스 파일 내려받기](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt) · 컴포넌트 48개
- [apps/fixture-solid/src/catalog-examples.tsx](/sources/apps/fixture-solid/src/catalog-examples.tsx.txt)
- [apps/fixture-solid/src/examples.tsx](/sources/apps/fixture-solid/src/examples.tsx.txt)
- [apps/fixture-solid/src/main.tsx](/sources/apps/fixture-solid/src/main.tsx.txt)

## svelte {#svelte}

[패키지 매니페스트](/sources/packages/svelte/package.json.txt) · [호환성 보고서](/sources/docs/compatibility/svelte.md.txt)

미리보기: `/krds/previews/svelte/`

- [예제 코드 보기](/examples/svelte-4) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/MastheadExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-5) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/IdentifierExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-6) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/HeaderExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-7) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FooterExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-8) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SkipLinkExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-9) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/MainMenuExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-10) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/BreadcrumbExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-11) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SideNavigationExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-12) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/InPageNavigationExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-13) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/PaginationExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-14) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/StructuredListExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-15) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CriticalAlertExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-16) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CalendarExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-17) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/DisclosureExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-18) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ModalExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-19) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/BadgeExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-20) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/AccordionExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-21) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ImageExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-22) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CarouselExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-23) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TabsExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-24) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TableExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-25) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TextListExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-26) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FaviconExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-27) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/LinkExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-28) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ButtonExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-29) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FABExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-30) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/RadioGroupExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-31) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CheckboxExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-32) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/NativeSelectExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-33) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TagExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-34) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SwitchExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-35) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/StepIndicatorExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-36) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SpinnerExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-37) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/HelpPanelExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-38) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TutorialPanelExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-39) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ContextualHelpExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-40) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/CoachMarkExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-41) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TooltipExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-42) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TTSExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-43) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/DateInputExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-44) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TextareaExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-45) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TextInputExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-46) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/FileUploadExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-47) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/LanguageSwitcherExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-48) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ResizeExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-49) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/AccessibleMediaExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-50) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/VisuallyHiddenExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-51) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/RangeSliderExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-52) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/BackButtonExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-53) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/BottomSheetExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-54) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/QuantityToggleExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-55) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/ToastExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-56) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/SnackbarExample.svelte.txt) · 컴포넌트 1개
- [예제 코드 보기](/examples/svelte-57) · [소스 파일 내려받기](/sources/apps/fixture-svelte/src/public-examples/TabBarExample.svelte.txt) · 컴포넌트 1개
- [apps/fixture-svelte/src/DocsConsumer.svelte](/sources/apps/fixture-svelte/src/DocsConsumer.svelte.txt)

## vue {#vue}

[패키지 매니페스트](/sources/packages/vue/package.json.txt) · [호환성 보고서](/sources/docs/compatibility/vue.md.txt)

미리보기: `/krds/previews/vue/`

- [예제 코드 보기](/examples/vue-58) · [소스 파일 내려받기](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt) · 컴포넌트 48개
- [예제 코드 보기](/examples/vue-59) · [소스 파일 내려받기](/sources/apps/fixture-vue/src/ConsumerExample.vue.txt) · 컴포넌트 6개
- [apps/fixture-vue/src/CatalogExamples.vue](/sources/apps/fixture-vue/src/CatalogExamples.vue.txt)
- [apps/fixture-vue/src/ConsumerExample.vue](/sources/apps/fixture-vue/src/ConsumerExample.vue.txt)

## lit {#lit}

[패키지 매니페스트](/sources/packages/lit/package.json.txt) · [호환성 보고서](/sources/docs/compatibility/lit.md.txt)

미리보기: `/krds/previews/lit/`

- [예제 코드 보기](/examples/lit-60) · [소스 파일 내려받기](/sources/apps/fixture-lit/src/examples/catalog.ts.txt) · 컴포넌트 54개
- [apps/fixture-lit/src/full-catalog.ts](/sources/apps/fixture-lit/src/full-catalog.ts.txt)

## qwik {#qwik}

[패키지 매니페스트](/sources/packages/qwik/package.json.txt) · [호환성 보고서](/sources/docs/compatibility/qwik.md.txt)

미리보기: `/krds/previews/qwik/` (사전 렌더링된 정적 페이지입니다. 프로덕션 SSR/resume은 네이티브 서버가 필요합니다)

- [예제 코드 보기](/examples/qwik-61) · [소스 파일 내려받기](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt) · 컴포넌트 54개
- [apps/fixture-qwik/src/catalog-examples.tsx](/sources/apps/fixture-qwik/src/catalog-examples.tsx.txt)
- [apps/fixture-qwik/src/examples.tsx](/sources/apps/fixture-qwik/src/examples.tsx.txt)

## angular {#angular}

[패키지 매니페스트](/sources/packages/angular/package.json.txt) · [호환성 보고서](/sources/docs/compatibility/angular.md.txt)

미리보기: `/krds/previews/angular/`

- [예제 코드 보기](/examples/angular-62) · [소스 파일 내려받기](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt) · 컴포넌트 54개
- [apps/fixture-angular/src/fixture-app.ts](/sources/apps/fixture-angular/src/fixture-app.ts.txt)

## solid-next {#solid-next}

[패키지 매니페스트](/sources/packages/solid-next/package.json.txt) · [호환성 보고서](/sources/docs/compatibility/solid-2.md.txt)

미리보기: `/krds/previews/solid-next/` · Storybook 통합 없음

등록된 예제 코드가 아직 없습니다. 아래는 픽스처 소스입니다.

- [apps/fixture-solid-next/src/main.tsx](/sources/apps/fixture-solid-next/src/main.tsx.txt)
