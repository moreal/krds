---
title: 'Toast'
---

# Toast {#toast}

토스트 · `Toast`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_05.html) · [전체 명세](/sources/specs/components/toast.md.txt) · [프레임워크 지원](../compatibility/)

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
export interface ToastContract {
    message: ToastMessage | null;
    durationMs?: number;
    onDismiss: (detail: {
        id: string;
        reason: 'timeout';
        generation: number;
    }) => void;
}

export interface ToastMessage {
    id: string;
    text: string;
    tone: 'information' | 'warning';
    persistentResultId: string;
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `message` | 예 | `ToastMessage \| null` | 데이터 / 상태 |
| `durationMs` | 아니요 | `number` | 데이터 / 상태 |
| `onDismiss` | 예 | `(detail: {id: string; reason: 'timeout'; generation: number}) => void` | 이벤트 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

간결한 한 문장을 담은 일시적 비대화형 컨테이너입니다. 페이지 위 하단 중앙에 두고 TabBar/FAB와 겹치지 않게 합니다. 액션 버튼은 없으며, 조치가 필요한 콘텐츠는 Snackbar를 씁니다. 긴급/치명적 알림이나 개별 필드 오류에는 쓰지 않습니다.

### 의미 API {#plain-semantic-api}

**호스트가 소유하는 현재 메시지와 큐** API를 택합니다. 필수 `message:{id:string,text:string,tone:information|warning,persistentResultId:string}|null`이며 초기값은 null입니다. durationMs 기본값은 information 3000, warning 4000입니다. `onDismiss({id,reason:"timeout",generation})`은 호스트 콘텐츠가 제거되었다는 알림이 아니라 해제 **요청**입니다. defaultMessage, 내부 큐, enqueue/store 객체는 없습니다. 결과의 정확성, 현재 메시지, 순서, 큐 진행은 호스트가 소유하며, 호스트는 더 긴 양수 duration을 설정할 수 있습니다. role=status/aria-live=polite는 독립 네이티브 정책입니다. 토스트는 비대화형으로 남으며 초점 목적지가 되지 않습니다.

**충분한 노출/재조회는 필수 완료 조건**이며, 짧은 기본 타이머를 맞추는 것만으로는 부족합니다([공식 L946–949](https://www.krds.go.kr/html/site/component/component_12_05.html)). 이 프로젝트의 구체적 대응은 persistentResultId가, 일시적 토스트 바깥의 찾을 수 있는 접근 가능한 **지속 결과/상태 또는 이력**에서 같은 결과 텍스트를 가리키도록 하는 것입니다. 이는 일반 읽기/탐색 순서에 있어야 하며, 호스트/사용자가 의도적으로 지우거나 해당 화면을 떠날 때까지 남아 있습니다. 느리게 읽는 사용자나 알림이 지연된 사용자가 토스트가 사라진 뒤에도 결과를 다시 얻을 수 있도록, 픽스처에 이 실제 로컬 지속 결과가 있어야 합니다. 이력/로그 방식은 독립 프로젝트 정책이며 KRDS가 정확히 그 UI를 규정한다는 주장이 아닙니다. 충분한 노출/재조회가 없으면 완료를 통과할 수 없습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

초점을 빼앗지 않으며 액션/닫기 컨트롤을 추가하지 않습니다. 호스트가 선택했으므로 메시지 ID가 바뀌면 보이는 메시지를 즉시 교체합니다. 컴포넌트는 이전/현재 스냅샷을 큐에 넣지 않습니다. message=null이면 제거합니다. 교체나 prop 제거는 onDismiss를 내지 않고 내부적으로 큐를 진행하지 않습니다.

새 ID마다, 그리고 같은 ID의 의미 있는 text/tone/유효 duration 수정마다 단조 증가하는 내부 generation을 유지합니다. 같은 ID에서 text가 바뀌면 현재 토스트를 갱신하고, 바뀐 텍스트를 한 번 알리며, 처음부터 전체 노출을 다시 시작합니다. 같은 ID에서 tone/duration만 바뀌면 외형/수명만 갱신하고 같은 텍스트를 다시 알리지 않습니다. 같은 ID의 동일한 내용이나 콜백/객체 동일성 변화만으로는 다시 알리거나 재시작하지 않습니다. message=null 뒤에 같은 ID를 다시 쓰면 새로운 가시 generation입니다. 요청은 해당 ID와 generation을 담으며, 콜백에 렌더러 객체는 없습니다.

전체 카운트다운은 해당 generation이 실제로 렌더링된 뒤에 시작합니다. 문서가 숨겨진 동안은 남은 시간을 멈추고, 보이면 남은 시간을 이어 갑니다. 교체, 제거, 의미 있는 수정, 언마운트는 이전 generation의 타이머/리스너를 취소합니다. 오래된 콜백은 무언가를 요청하기 전에 현재 generation을 확인해야 합니다. 타임아웃은 해당 generation에 대해 해제 요청을 정확히 한 번 내보낸 뒤 그 타이머를 소비합니다. 제어 호스트가 메시지를 유지하면 계속 보입니다. 로컬 숨김, 큐 진행, 타임아웃 반복 루프, 거짓 “실제 해제” 콜백은 없습니다. 의미 있는 새 generation은 새 타이머를 시작할 수 있습니다. 초점, prop 갱신, 마운트, 리셋은 사용자 변경/해제 이벤트를 만들어 내지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

하단 안전 영역/내비게이션/FAB와 겹치지 않게 합니다. 번역 텍스트나 확대 텍스트에 필요할 때만 줄 바꿈하고, 잘림보다 읽을 수 있는 메시지를 우선합니다. 움직임은 필수가 아니며 동작 줄이기에서는 슬라이드 없이 나타나고 사라집니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

큐/현재 메시지 prop, 지속 결과/이력 대상, 결과의 진실성/복구는 호스트가 소유합니다. 완료 조건은 다음과 같습니다.

- 실제 지속 결과와 일시적 메시지를 모두 만드는 로컬 동작.
- 느리게 읽거나 알림이 지연된 경우의 재조회.
- 결정적인 타임아웃, 갱신, 교체, 거부된 해제, 정리 동작.

공식 information 2–3초/warning 3–4초 값은 충분한 노출 지침 안의 기본값이며 모든 사용자가 결과를 읽거나 들었다는 증거가 아닙니다. 시간은 맞지만 다시 얻을 수 없는 결과는 관문을 통과하지 못합니다. Toast를 Snackbar로 바꾸는 액션이나 닫기 버튼은 추가하지 않습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, message; information,warning,open,closed.

렌더링되는 모든 소유 파트는 `data-krds-component="toast"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `information`, `warning`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-55) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_12_05.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
