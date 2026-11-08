---
title: 'Snackbar'
---

# Snackbar {#snackbar}

스낵바 · `Snackbar`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_06.html) · [전체 명세](/sources/specs/components/snackbar.md.txt) · [프레임워크 지원](../compatibility/)

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
export interface SnackbarContract {
    message: SnackbarMessage | null;
    action?: SnackbarAction;
    onAction?: (detail: {
        id: string;
        generation: number;
        actionId: string;
    }) => void;
    onDismiss: (detail: {
        id: string;
        reason: 'close' | 'timeout';
        generation: number;
    }) => void;
    durationMs?: number | null;
    fallbackFocusId?: string;
}

export interface SnackbarMessage {
    id: string;
    title: string;
    text: string;
    icon?: string;
    error?: string;
    actionPending?: boolean;
}

export type SnackbarAction = {
    kind: 'button';
    id: string;
    label: string;
} | {
    kind: 'link';
    id: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
};
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `message` | 예 | `SnackbarMessage \| null` | 데이터 / 상태 |
| `action` | 아니요 | `SnackbarAction` | 데이터 / 상태 |
| `onAction` | 아니요 | `(detail: {id: string; generation: number; actionId: string}) => void` | 이벤트 |
| `onDismiss` | 예 | `(detail: {id: string; reason: 'close' \| 'timeout'; generation: number}) => void` | 이벤트 |
| `durationMs` | 아니요 | `number \| null` | 데이터 / 상태 |
| `fallbackFocusId` | 아니요 | `string` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

알림은 화면 하단 중앙에 하나만 둡니다. 구성은 왼쪽의 선택적 은은한 아이콘, 제목, 간결한 본문, 직접 관련된 선택적 텍스트 동작(최대 하나, 오른쪽), 보이는 닫기 버튼입니다. 동시에 여러 스낵바를 쌓지 않고, TabBar나 FAB를 가리지 않습니다. 필드 오류는 인라인으로 유지합니다.

### 의미 API {#plain-semantic-api}

**호스트가 현재 메시지와 큐를 소유**하도록 합니다. 필수 `message:{id,title,text,icon?,error?,actionPending?}|null`(초기값 null)을 둡니다. 선택 동작은 구별된 유니온 하나입니다: `action:{kind:"button",id,label}|{kind:"link",id,label,href,target?,rel?}`. 버튼 동작은 `onAction({id,generation,actionId})`, 닫기 요청은 `onDismiss({id,reason:close|timeout,generation})`입니다. durationMs=null(지속이 기본값)과 선택적 `fallbackFocusId`도 있습니다. 호스트가 메시지 존재, 큐·순서, 실제 결과를 제어합니다. 내부 enqueue/store/defaultMessage는 없습니다. 동작은 암묵적으로 닫지 않습니다. 호스트가 결과에 따라 필요하면 메시지를 명시적으로 교체하거나 제거합니다.

실행 취소/재시도는 이름 있는 네이티브 type=button이며 onAction을 한 번 호출합니다. 이동은 href가 있는 실제 앵커이며 네이티브 Enter/클릭, 수정 키 클릭, 컨텍스트 메뉴, 새 탭 열기 동작을 그대로 유지합니다. 명령형 버튼 이동으로 대체하거나 브라우저 의미를 취소하지 않습니다. 해당하면 외부·새 창 의미를 전달합니다. 둘 다 오른쪽의 텍스트 동작 슬롯 하나를 차지합니다. 동작을 둘 노출하거나 중첩된 상호작용 링크·버튼을 두지 않습니다. role=status는 메시지 텍스트에 적용하며, 컨트롤은 라이브 텍스트 밖에 둡니다. 지속 기본값, 선택적 타이머, 아래 호스트 수명주기 정책은 독립 선택입니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

초점을 빼앗지 않습니다. 닫기는 이름 있는 네이티브 type=button이고, 선택 동작은 구별된 네이티브 버튼·링크 역할을 씁니다. 닫기를 명시적으로 활성화할 때마다 제거를 한 번 요청합니다. 초점 복원이나 큐 진행 전에 호스트가 실제로 제거할 때까지 기다립니다. 요청이 거부되면 메시지, 접근 가능한 동작·닫기, 현재 초점을 유지합니다. 사용자가 다시 명시적으로 활성화하면 동작마다 새 요청을 하나 낼 수 있습니다. 버튼 활성화는 onAction만 내고 합성 닫기를 내지 않습니다. 네이티브 링크 이동은 네이티브로 남습니다. 이동 중에는 이전 페이지의 시작 요소로 초점을 복원하지 않고, 경로 소유자가 도착지 초점을 처리합니다.

호스트가 ID를 바꾸면 즉시 현재 콘텐츠를 교체하고, null이면 제거합니다. 어느 쪽도 합성 닫기를 내거나 큐를 내부에서 진행하지 않습니다. 같은 ID에서 text/title/error/action kind/label/href가 바뀌면 중복으로 버리지 않고 현재 렌더링된 알림을 갱신합니다. 접근 가능한 메시지 텍스트가 바뀌면 한 번만 알립니다. 콜백 객체가 바뀌었다는 이유로 같은 텍스트를 다시 알리지 않습니다. 초점 받은 컨트롤이 제거·교체되면 실제로 수용된 렌더링 뒤에만 복원합니다. 순서는 사용할 수 있는 저장된 시작 컨트롤, 사용할 수 있는 fallbackFocusId, 사용할 수 있는 가장 가까운 저장된 조상, 마지막으로 임시 tabindex=-1을 둔 라이브 문서 body이며 이 tabindex는 나중에 원복합니다. 제거됨, 숨김, 비활성, inert, 이전 경로의 컨트롤에는 초점을 주지 않습니다. 사용자의 네이티브 이동으로 다른 사용 가능한 컨트롤이 이미 초점을 받았다면 빼앗지 않습니다.

ID와 의미 있는 접근 가능한 콘텐츠·동작·유효 지속시간 개정에 묶인 generation을 씁니다. 동일한 중복 콘텐츠나 콜백 정체성만으로는 재시작하지 않습니다. 의미 있는 generation마다 이전 타이머를 취소하고, 실제 렌더링 뒤 선택적 전체 수명을 새로 시작할 수 있습니다. 기본 duration null에는 타이머가 없습니다. 양수 타임아웃을 설정하면 호버 중, 스낵바 안에 초점이 있는 동안, actionPending일 때, 문서가 숨겨진 동안 남은 시간을 일시 정지합니다. 모든 조건이 풀릴 때만 재개합니다. 설정 duration을 늘리면 명시적 연장 수단으로서 새 전체 수명이 생깁니다. 타임아웃은 generation당 요청 하나를 냅니다. 호스트가 거부하면 계속 보이게 두고 타임아웃을 반복하지 않습니다. 이전 generation의 오래된 콜백은 교체 메시지나 같은 ID의 개정본을 닫을 수 없습니다. 실제 제거·언마운트 때 타이머와 리스너를 정리합니다. prop 갱신, 초점 이동, 리셋은 조작된 사용자·닫기 알림을 내지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

하단 safe-area와 내비게이션 여백을 확보합니다. 아이콘·메시지·동작은 구별되어야 하며 좁은 화면과 확대에서 읽기 좋게 줄바꿈됩니다. 동작 줄이기에서는 슬라이드 애니메이션을 없앱니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼·리셋·IME 상태는 없습니다. 버튼은 type=button입니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트가 큐·현재 메시지 존재, 실행 취소/재시도 결과, 실제 이동 도착지, 선택적 타이머 설정을 소유합니다. 필수 로컬 예시는 다음을 포함합니다. 각각 유일한 동작인 작동하는 실행 취소/재시도 **버튼**과 실제 href **이동 링크**, 같은 ID에서 바뀐 오류·동작 콘텐츠, 거부된 닫기·타임아웃, 초점이 안전한 수용된 제거, generation에 안전한 교체·정리. 지속 기본값은 동작을 계속 쓸 수 있게 둡니다. 설정된 만료는 호버·초점·숨김·대기 중 상호작용 동안 보호되어야 합니다. 네트워크나 upstream 토스트 매니저는 필요 없습니다. 앵커 없이 이동 콜백만 기록하는 것은 완료로 인정하지 않습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, icon, title, message, action, close; open,closed,action-pending,error.

렌더링되는 모든 소유 파트는 `data-krds-component="snackbar"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 기준입니다. 위 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `message`, `with-action`, `with-icon`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-56) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_12_06.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
