---
title: 'Link'
---

# Link {#link}

링크 · `Link`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_05_01.html) · [전체 명세](/sources/specs/components/link.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

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

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

모든 프레임워크가 공유하는 의미 계약입니다. 콜백 이름과 detail 타입은 그대로 씁니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 선택 속성의 기본값은 자동으로 채워지지 않으므로 아래 안내의 명시적 기본값을 씁니다.

```ts
export interface LinkContract {
    href: string;
    label: string;
    target?: string;
    rel?: string;
    disabled?: boolean;
    appearance?: 'basic' | 'emphasis';
    size?: Size;
    underline?: boolean;
}

export type Size = 'small' | 'medium' | 'large';
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `href` | 예 | `string` | 데이터 / 상태 |
| `label` | 예 | `string` | 데이터 / 상태 |
| `target` | 아니요 | `string` | 데이터 / 상태 |
| `rel` | 아니요 | `string` | 데이터 / 상태 |
| `disabled` | 아니요 | `boolean` | 데이터 / 상태 |
| `appearance` | 아니요 | `'basic' \| 'emphasis'` | 데이터 / 상태 |
| `size` | 아니요 | `Size` | 데이터 / 상태 |
| `underline` | 아니요 | `boolean` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

목적지를 구체적으로 알리는 레이블과 선택적 장식/외부 아이콘·밑줄을 담은 실제 &lt;a href>를 씁니다. 인라인 크기는 본문과 같게 합니다. 외부 목적지와 새 창 동작을 구분해 알립니다. 사용할 수 없는 링크는 href를 생략하며 키보드 동작이 아닙니다.

### 의미 API {#plain-semantic-api}

독립 API입니다. href, target, rel, label/content, disabled=false, appearance=basic|emphasis, size=small|medium|large, underline=true(명확한 내비게이션 맥락은 예외)를 씁니다. disabled는 href를 생략하고 모든 이동과 콜백을 막습니다. 오래된 클릭 핸들러를 남기지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

네이티브 Tab과 Enter/클릭 이동을 따르며, 보조키 클릭, 컨텍스트 메뉴, 새 탭 열기를 포함합니다. Space를 버튼처럼 처리하는 핸들러는 없습니다. 같은 문서 초점 정책은 모든 링크가 아니라 SkipLink/InPageNavigation의 몫입니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

레이블은 읽기 쉬워야 하고 초점이 보여야 합니다. 권장 클릭 영역은 포인터 17×17, 터치 44×44이며 적절한 레이아웃에서 적용됩니다. 인라인 링크는 텍스트 흐름을 유지합니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

실제 목적지, tel:/mailto: 값, 외부 링크의 의미는 호스트가 책임집니다. 필요하다고 명시한 출처별 조합을 제외하고 target=_blank를 자동으로 붙이지 않습니다. 네이티브 브라우저 Link 동작은 라우터 통합 뒤에도 유지되어야 합니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, label, icon; disabled,external.

렌더링된 모든 소유 파트는 `data-krds-component="link"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `standalone`, `inline`, `group`, `external`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-27) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_05_01.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
