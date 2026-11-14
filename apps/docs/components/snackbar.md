---
title: 'Snackbar'
---

# Snackbar {#snackbar}

**스낵바** — 동작 결과를 알리면서 되돌리기 같은 후속 동작을 함께 제공합니다.

## 사용법 {#usage}

- 사용자 행동의 결과를 짧게 알리면서 되돌리기, 재시도, 목록으로 이동처럼 바로 할 수 있는 조치를 함께 줄 때 씁니다.
- 화면 하단 중앙에 한 번에 하나만 표시합니다. 여러 개를 겹치거나 쌓지 않고, 탭바나 플로팅 버튼을 가리지 않게 합니다.
- 메시지는 한 문장 이내로 씁니다. 더 긴 설명이나 중요하고 긴급한 내용은 모달이나 긴급 공지를 씁니다.
- 개별 입력 필드의 오류, 성공, 경고는 스낵바가 아니라 해당 필드 옆에 인라인 텍스트로 보여 줍니다.
- 동작은 메시지와 직접 관련된 것 하나만 둡니다. 아이콘은 꼭 필요할 때만 씁니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `message` **필수** | `SnackbarMessage \| null` | — | 지금 보여 줄 메시지입니다. `id`, `title`, `text`가 필요하고 `icon`, `error`, `actionPending`을 더할 수 있습니다. `actionPending`이 `true`인 동안에는 버튼 동작을 누를 수 없습니다. `null`이면 스낵바를 표시하지 않습니다. |
| `action` | `SnackbarAction` | — | 메시지 뒤에 두는 텍스트 동작 하나입니다. `kind`가 `button`이면 버튼으로, `link`이면 `href`를 가진 실제 링크로 표시합니다. |
| `onAction` | `(detail: {id: string; generation: number; actionId: string}) => void` | — | 버튼 동작을 누를 때마다 한 번 불립니다. 메시지 `id`, `generation`, 동작의 `actionId`를 받습니다. 동작을 눌러도 스낵바는 저절로 닫히지 않습니다. |
| `onDismiss` **필수** | `(detail: {id: string; reason: 'close' \| 'timeout'; generation: number}) => void` | — | 사용자가 닫기 버튼을 누르거나 표시 시간이 끝나면 불립니다. 메시지 `id`, `generation`, 그리고 `reason`으로 `close` 또는 `timeout`을 받습니다. 여기서 `message`를 `null`이나 다음 메시지로 바꿔야 실제로 닫힙니다. |
| `durationMs` | `number \| null` | `null` | 자동으로 닫기를 요청할 때까지의 시간(밀리초)입니다. `null`이면 타이머 없이 사용자가 닫을 때까지 남습니다. |
| `fallbackFocusId` | `string` | — | 스낵바 안에 초점이 있는 채로 닫혔는데 원래 초점이 있던 요소를 쓸 수 없을 때, 대신 초점을 받을 요소의 `id`입니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

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

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 동작과 닫기 버튼 사이를 이동합니다. |
| `Enter` / `Space` | 초점이 있는 버튼 동작이나 닫기 버튼을 실행합니다. |
| `Enter` | 링크 동작에 초점이 있으면 링크 목적지로 이동합니다. |

## 접근성 {#accessibility}

- 메시지 텍스트는 `role="status"`로 전달되어 화면 낭독기가 하던 일을 끊지 않고 읽어 줍니다. 같은 텍스트를 반복해서 알리지 않습니다.
- 스낵바가 나타나도 초점을 가져가지 않습니다. 닫힐 때 초점이 스낵바 안에 있었다면 원래 요소, `fallbackFocusId` 순으로 초점을 돌려줍니다.
- 닫기 버튼에는 '알림 닫기'라는 이름이 붙고 키보드로 닿을 수 있습니다.
- 링크 동작은 실제 링크이므로 새 탭으로 열기, 컨텍스트 메뉴 같은 브라우저 기본 동작이 그대로 됩니다. `target`이 `_blank`이면 레이블 뒤에 '(새 창)'을 붙여 알립니다.
- 아이콘과 색만으로 의미를 전하지 말고 `title`과 `text`에 결과를 분명히 적습니다.

## 알아 둘 점 {#notes}

- 보여 줄 메시지와 대기열은 쓰는 쪽에서 관리합니다. 컴포넌트는 닫기를 요청만 하고, `message`가 바뀌기 전에는 메시지를 그대로 보여 줍니다.
- 같은 `id`로 `text`, `title`, `error`나 동작이 바뀌면 지금 표시 중인 스낵바를 그 내용으로 갱신합니다. `id`가 바뀌면 즉시 새 메시지로 교체합니다.
- `durationMs`를 주면 포인터를 올려 둔 동안, 스낵바 안에 초점이 있는 동안, `actionPending`인 동안, 문서가 보이지 않는 동안에는 남은 시간이 멈춥니다. 내용이 바뀌면 시간을 처음부터 다시 셉니다.
- 하단 safe-area와 하단 내비게이션만큼 여백을 두고 표시합니다. 좁은 화면이나 확대 상태에서는 줄바꿈됩니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `open`, `closed`, `action-pending`, `error` |
| `icon` | 없음 |
| `title` | 없음 |
| `message` | `error` |
| `action` | `action-pending`, `error` |
| `close` | 없음 |

```css
[data-krds-component="snackbar"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_06.html)
- [상세 명세](/sources/specs/components/snackbar.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
