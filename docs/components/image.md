---
title: 'Image'
---

# Image {#image}

이미지 · `Image`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_08.html) · [전체 명세](/sources/specs/components/image.md.txt) · [프레임워크 지원](../compatibility/README.md)

## 네이티브 지원 현황 {#native-availability}

상태는 기록된 커버리지 기준입니다. [상태의 의미](../compatibility/README.md#what-the-evidence-means)를 참고하세요.

| 프레임워크 | 패키지 버전 | 상태 | 예제 |
| --- | --- | --- | --- |
| react | `0.1.0` | planned | [react 예제](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [solid 예제](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [svelte 예제](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [vue 예제](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [lit 예제](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [qwik 예제](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [angular 예제](../compatibility/README.mdexamples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [solid-next 예제](../compatibility/README.mdexamples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

모든 프레임워크가 공유하는 의미 계약입니다. 콜백 이름과 detail 타입은 그대로 씁니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 선택 속성의 기본값은 자동으로 채워지지 않으므로 아래 안내의 명시적 기본값을 씁니다.

```ts
export interface ImageContract {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    srcset?: string;
    sizes?: string;
    loading?: 'eager' | 'lazy';
    decorative?: boolean;
    caption?: string;
    descriptionId?: string;
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `src` | 예 | `string` | 데이터 / 상태 |
| `alt` | 예 | `string` | 데이터 / 상태 |
| `width` | 아니요 | `number` | 데이터 / 상태 |
| `height` | 아니요 | `number` | 데이터 / 상태 |
| `srcset` | 아니요 | `string` | 데이터 / 상태 |
| `sizes` | 아니요 | `string` | 데이터 / 상태 |
| `loading` | 아니요 | `'eager' \| 'lazy'` | 데이터 / 상태 |
| `decorative` | 아니요 | `boolean` | 데이터 / 상태 |
| `caption` | 아니요 | `string` | 데이터 / 상태 |
| `descriptionId` | 아니요 | `string` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

명시적 alt를 가진 네이티브 img를 씁니다. 장식 이미지는 alt=""입니다. 정보 이미지의 대체 텍스트는 간결하고 맥락에 맞아야 합니다. 저작자 표기, 불필요한 “이미지”라는 말, 인접 설명과의 중복, 지어낸 세부 사항은 넣지 않습니다. 복잡한 설명은 가까운 figure/figcaption이나 연결된 설명 콘텐츠로 줄 수 있습니다. 픽셀에 굽힌 텍스트보다 실제 텍스트를 우선합니다.

### 의미 API {#plain-semantic-api}

독립 API입니다. src, alt(필수이며 장식이면 비어도 됨), width/height, srcset/sizes, loading, 선택 caption/descriptionId를 씁니다. 장식 플래그는 alt와 일치해야 합니다. 네이티브 이미지 role 재정의와 클릭 콜백은 없습니다. 클릭 가능한 이미지는 Link/Button과 조합합니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

정적 이미지는 탭 정지점을 더하지 않습니다. 링크 조합의 접근 가능한 이름은 목적을 설명합니다. 로드/오류 이벤트는 네이티브 결과를 노출하며, 실제 디코드 전에는 콘텐츠가 로드되었다고 주장하지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

호스트가 의미 있는 자르기/소스 선택을 제공합니다. 좁은 화면에서도 핵심 정보를 보존합니다. 장식 이미지는 좁은 화면에서 생략할 수 있지만, 정보 콘텐츠에는 동등한 텍스트가 필요합니다. 환경에 맞게 자산 크기를 정합니다. 외부 CDN을 요구하지 않습니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 로컬이며 출처가 바르게 표시된 자산과 설명을 제공합니다. 완료에는 정보, 장식, 복잡, 이미지 로드 실패 결과가 포함됩니다. 원격 자리표시 이미지는 해당하지 않습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root (img), figure, caption, description; 관찰될 때 loaded,error.

렌더링된 모든 소유 파트는 `data-krds-component="image"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `informative`, `decorative`, `complex-description`, `responsive`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-21) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_04_08.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
