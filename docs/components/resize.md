---
title: 'Resize'
---

# Resize {#resize}

화면 크기 조정 · `Resize`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_10_02.html) · [전체 명세](/sources/specs/components/resize.md.txt) · [프레임워크 지원](../compatibility/README.md)

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
export interface ResizeContract extends ControlledValue<string>, ControlledOpen {
    levels?: readonly {
        id: string;
        label: string;
        percent: number;
    }[];
}

export interface ControlledValue<T> {
    value?: T;
    defaultValue?: T;
    onValueChange?: (detail: ValueChangeDetails<T>) => void;
}

export interface ValueChangeDetails<T> {
    value: T;
}

export interface ControlledOpen {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails) => void;
}

export interface OpenChangeDetails {
    open: boolean;
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `value` | 아니요 | `string` | 데이터 / 상태 |
| `defaultValue` | 아니요 | `string` | 데이터 / 상태 |
| `onValueChange` | 아니요 | `(detail: ValueChangeDetails<string>) => void` | 이벤트 |
| `open` | 아니요 | `boolean` | 데이터 / 상태 |
| `defaultOpen` | 아니요 | `boolean` | 데이터 / 상태 |
| `onOpenChange` | 아니요 | `(detail: OpenChangeDetails) => void` | 이벤트 |
| `levels` | 아니요 | `readonly {id: string; label: string; percent: number}[]` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름 있는 화면 크기 컨트롤입니다. 설명 레이블이 있는 옵션과 현재 선택 값을 보여 줍니다. 공식 예시는 90%,100%,110%,130%,150%이며 옵션은 5개 이하입니다. 텍스트 레이블이 크기 아이콘/숫자와 함께 표시됩니다.

### 의미 API {#plain-semantic-api}

독립 API: `levels` `{id,label,percent}[]`=공식 5단계, `value?:string`, `defaultValue?:string="100"`, `onValueChange({value:id})`, `open`/`defaultOpen=false`, `onOpenChange`. 요청 값은 옵션 ID이며 콜백은 [ValueChangeDetails&lt;T>](/sources/packages/contracts/src/types.ts.txt)를 따릅니다. 호스트는 호환되지 않는 id 전용 페이로드를 받는 대신 `levels`에서 percent를 찾습니다. 정의된 `value`는 제어 모드를 택하고, 없으면 한 번만 읽는 기본값을 씁니다. 제어/기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 사용자의 선택 변경은 요청 하나를 내며, 같은 값/비활성 동작, props, 마운트, 리셋은 요청을 내지 않습니다. 호스트가 범위가 한정된 배율을 적용하고 값을 확정하며, 브라우저/기기 확대는 조작하지 않습니다.

제어 모드에서 거부된 클릭/Enter/접힌 상태 화살표 요청은 현재 옵션, 표시 값, 호스트 배율을 커밋된 값으로 유지합니다. 요청된 percent를 낙관적으로 적용하거나 조정 중에 두 번째 요청을 내보내지 않습니다. 배율 적용과 선택은 같은 권위 있는 값을 공유합니다. [파일럿 정책](/sources/specs/components/README.md.txt)과 별도의 열림 상태 소유는 그대로 적용됩니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

클릭/Enter/Space로 열고, Tab으로 옵션을 방문하며, 바깥 클릭/Escape로 닫고, Escape는 트리거로 초점을 돌려줍니다. Enter는 선택하고 닫습니다. 접힌 상태의 ArrowUp/Down은 공식 표에 따라 이전/다음 옵션을 선택하며 끝에서 순환하지 않습니다(프로젝트 정책). 리플로 후에도 선택 초점이 사용 가능해야 합니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

확대된 배율에서도 모든 콘텐츠와 동작에 접근할 수 있고, 문서화된 미디어/표 예외를 제외하면 페이지는 한 방향으로만 스크롤합니다. 컴포넌트 단계와 함께 실제 브라우저 200/400% 확대를 확인합니다. CSS transform만으로는 사용 가능한 레이아웃 리플로를 대신할 수 없습니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼 값이 없습니다. 설정 리셋은 암묵적 폼 리셋이 아니라 명시적인 호스트 환경설정 동작입니다. IME 편집은 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

배율 적용, 환경설정 영속화, 범위는 호스트가 맡습니다. 레이블 변경만이 아니라 리플로를 보여 주는 동작하는 로컬 설정 드라이버와 대표 페이지가 완료 조건입니다. 원격 저장소나 전역 브라우저 설정 편집은 없습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, trigger, current, list, option, scale-icon; open,closed,selected.

렌더링되는 모든 소유 파트는 `data-krds-component="resize"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 사용합니다. 네이티브/ARIA 상태가 기준입니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `five-levels`, `custom-levels`, `narrow-reflow`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-48) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_10_02.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
