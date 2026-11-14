---
title: 'Visually hidden'
---

# Visually hidden {#visually-hidden}

숨긴 콘텐츠 · `VisuallyHidden` — 화면에는 보이지 않지만 스크린 리더는 읽는 텍스트를 넣습니다.

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_11_02.html) · [전체 명세](/sources/specs/components/visually-hidden.md.txt) · [프레임워크 지원](../compatibility/)

## 프레임워크 지원 현황 {#native-availability}

상태는 기록된 커버리지 기준입니다. [상태의 의미](../compatibility/#what-the-evidence-means)를 참고하세요.

| 프레임워크 | 패키지 버전 | 상태 | 예제 |
| --- | --- | --- | --- |
| react | `0.1.0` | planned | [react 예제](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [solid 예제](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [svelte 예제](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [vue 예제](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [lit 예제](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [qwik 예제](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [angular 예제](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [solid-next 예제](../compatibility/examples#solid-next) |

## 속성과 이벤트 {#props-events-content-and-defaults}

모든 프레임워크가 같은 속성 이름과 이벤트 타입을 씁니다. 콘텐츠를 넣는 방법과 이벤트를 받는 문법만 프레임워크마다 다릅니다. 선택 속성의 기본값은 아래 안내를 따릅니다.

| 이름 | 타입 | 필수 | 구분 |
| --- | --- | --- | --- |
| `id` | `string` | 선택 | 속성 |
| `lang` | `string` | 선택 | 속성 |
| `content` | `string` | 선택 | 속성 |
| `variant` | `'text' \| 'interactive-overlay' \| 'aria-association'` | 선택 | 속성 |

표에 나온 타입의 정의입니다.

```ts
export interface VisuallyHiddenContract {
    id?: string;
    lang?: string;
    content?: string;
    variant?: 'text' | 'interactive-overlay' | 'aria-association';
}
```

### 프레임워크별 콘텐츠와 이벤트 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 마크업 구조와 순서 {#native-structure-and-mandatory-ordering}

의미 있는 콘텐츠를 접근성 트리에 보존하는 텍스트 숨김 프리미티브와, 보이는 대체 요소의 기하와 일치하는 별도의 대화형 오버레이 패턴을 둡니다. display:none/visibility:hidden, 크기가 0인 텍스트/글꼴 크기 0 텍스트, 화면 밖으로 옮긴 초점 대상은 절대 쓰지 않습니다. 네이티브 시맨틱과 보이는 정보를 먼저 선택합니다.

### API와 기본값 {#plain-semantic-api}

독립 API: VisuallyHidden은 기본적으로 id/lang/콘텐츠를 가진 span을 렌더링하며, text 변형은 0이 아닌 클리핑 스타일을 씁니다. interactive-overlay 변형에는 보이는 표현 위에 같은 크기, opacity/z-index, 보이는 대체 초점 윤곽선을 가진 실제 네이티브 자식 컨트롤이 필요합니다. ARIA 관계 모드는 숨은 중복 이름을 추가하지 않고 실제 ID/속성을 씁니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드와 초점 {#keyboard-focus-and-state-transitions}

텍스트 프리미티브에는 탭 정지점이나 키 동작이 없습니다. 대화형 자식은 네이티브 키보드 동작을 유지하고 실제 위치에 보이는 초점 표시를 둡니다. 초점 가능한 컨트롤에는 1px 텍스트 클리핑 스타일을 적용하지 않습니다. 스크린 리더 가상 커서 기하는 수동으로 테스트합니다.

### 반응형 동작 {#responsive-mobile-requirements}

반응형 레이아웃/확대에서 오버레이 정렬을 유지하고, 서비스 언어가 바뀌면 숨긴 텍스트도 번역합니다. 출처에 명시된 데스크톱 조합뿐 아니라 모바일 VoiceOver/TalkBack도 테스트합니다.

### 폼 제출과 초기화 {#forms-reset-and-composition}

숨긴 콘텐츠 자체에는 폼 값이 없습니다. 위에 겹친 네이티브 입력은 이를 소비하는 컨트롤의 name/value/리셋/IME 규칙을 모두 유지합니다.

### 호스트 책임과 완료 기준 {#asset-integration-and-composition-completion}

의미 있는 설명과 번역은 호스트가 소유합니다. 이 프리미티브는 올바른 네이티브 시맨틱이나 보편적인 이름 결정을 대체하지 않습니다. 완료에는 텍스트의 접근성 트리 증명과 대화형 기하/수동 보조 기술 근거가 포함됩니다. 테스트하지 않은 CSS 클래스만으로는 부족합니다.

### 파트와 상태 속성 {#stable-parts-and-states}

root, overlay-control, visible-surrogate; text,interactive-overlay,focus-visible.

렌더링되는 모든 소유 파트는 `data-krds-component="visually-hidden"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 지원하는 변형 {#state-examples-and-native-checks}

`text`, `interactive-overlay`, `aria-association`

이 이름은 프로젝트가 정한 구분이며 공식 KRDS 유형 이름은 아닙니다.

### 예제 코드 {#local-native-stories}

위 미리보기는 각 프레임워크의 실제 패키지로 만든 예제입니다. Storybook은 로컬에서만 실행하며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-50) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_11_02.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
