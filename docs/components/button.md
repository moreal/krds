---
title: 'Button'
---

# Button {#button}

버튼 · `Button`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_05_02.html) · [전체 명세](/sources/specs/components/button.md.txt) · [프레임워크 지원](../compatibility/README.md)

## 네이티브 지원 현황 {#native-availability}

상태는 기록된 커버리지 기준입니다. [상태의 의미](../compatibility/README.md#what-the-evidence-means)를 참고하세요.

| 프레임워크 | 패키지 버전 | 상태 | 예제 |
| --- | --- | --- | --- |
| react | `0.1.0` | planned | [react 예제](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | implemented | [solid 예제](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [svelte 예제](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [vue 예제](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [lit 예제](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [qwik 예제](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [angular 예제](../compatibility/README.mdexamples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [solid-next 예제](../compatibility/README.mdexamples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

모든 프레임워크가 공유하는 의미 계약입니다. 콜백 이름과 detail 타입은 그대로 씁니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 선택 속성의 기본값은 자동으로 채워지지 않으므로 아래 안내의 명시적 기본값을 씁니다.

공개 API는 아래 검토된 안내와 각 네이티브 공개 선언이 정의합니다. [공유 이벤트·날짜 타입](/sources/packages/contracts/src/types.ts.txt).

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 공식 요구사항 {#official-requirements}

KRDS는 접근 가능한 동작 이름, Enter/Space 키보드 조작, 보이는 초점을 요구합니다. 아이콘만 있는 버튼에는 기능적 텍스트 대체가 필요합니다. 레이블 옆의 장식 아이콘은 레이블을 반복하면 안 됩니다. 버튼은 동작을 수행하고, 이동에는 Link를 씁니다. 비활성 동작은 사용할 수 없습니다. 데이터 제출 버튼의 반복 활성화는 요청이 진행 중인 동안 애플리케이션이 막아야 합니다.

### 프로젝트 API와 기본값 {#project-api-and-defaults}

실제 `button`을 렌더링합니다. 옵션: `type: 'button' | 'submit' | 'reset'`(기본 `button`), `disabled: boolean`(false), `variant: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon'`(primary), `size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'`(medium), 네이티브 `name`, `value`, `form`, `aria-label`, `aria-labelledby`, 네이티브 콘텐츠. 아이콘은 다른 역할이 아니라 표시 변형입니다. 명시적인 접근 가능한 이름이 없으면 레이블 텍스트가 필요합니다. 동작 알림은 네이티브 `onClick`입니다. 값 변경 콜백과 선택 상태는 없습니다.

포인터 클릭, Enter, Space는 네이티브 버튼 활성화를 쓰며 각각 동작 콜백을 한 번 냅니다. 키 핸들러에서 두 번째 click을 합성하지 않습니다. Space는 키를 뗄 때 활성화됩니다. 비활성 버튼은 네이티브로 비활성이며, 순차 초점과 폼의 성공 컨트롤에서 제외되고, 콜백을 실행하지 않습니다. 외부에서 disabled를 설정해도 아무것도 내지 않습니다. 자동 디바운스나 비동기 로딩 상태는 없습니다. 제출 소유자가 대기 중에 동작을 비활성화하고 멱등성을 처리합니다.

`submit`은 네이티브 폼 검증에 참여하며, 제출자일 때 name/value를 포함합니다. 기본 `button`은 아무것도 제출하지 않습니다. `reset`은 취소 가능한 일반 폼 리셋 알고리즘을 한 번 호출합니다. 제어/비제어 상태는 적용되지 않습니다. 폼 검증 실패는 Button의 오류 상태가 아니며 오류는 필드 소유자가 노출합니다. 콘텐츠 순서는 레이블, 그다음 선택적 장식 아이콘입니다. 초점 링이 가려지지 않게 합니다.

### 구조와 인수 기준 {#structure-and-acceptance}

파트: `root`, `label`, `icon`. 상태: root의 `disabled`. 일시적인 초점·눌림은 네이티브 focus/active 의사 클래스가 처리합니다. 지속되는 pressed 상태는 없으며, 토글 버튼 계약은 다른 컴포넌트의 몫입니다.

네이티브 어댑터 인수: 폼 안의 기본 버튼은 제출하지 않습니다. 명시적 submit/reset은 동작합니다. 포인터/Enter/Space 활성화는 각각 한 번만 실행됩니다. 비활성 상태의 활성화는 실행되지 않습니다. 아이콘만 있는 컨트롤은 기능적 이름을 노출합니다. 강제 색상 모드와 확대에서도 초점과 레이블이 읽을 수 있어야 합니다. 이 테스트는 contracts 패키지가 아니라 각 프레임워크의 네이티브 렌더러가 필요합니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `primary`, `secondary`, `tertiary`, `text`, `icon`, `xsmall`, `small`, `medium`, `large`, `xlarge`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-2) · [svelte](/examples/svelte-28) · [vue](/examples/vue-59) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_05_02.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
