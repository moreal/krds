---
title: 'Toast'
---

# Toast {#toast}

**토스트** — 방금 한 동작의 결과를 잠시 띄워 알립니다.

## 사용법 {#usage}

- 저장 완료, 파일 업로드 실패처럼 사용자 행동의 결과를 한 줄로 잠깐 알릴 때 씁니다.
- 버튼 같은 추가 행동이 필요하거나 두 줄 이상의 설명이 필요하면 스낵바를, 더 긴 설명이 필요하면 모달을 씁니다.
- 중요하거나 긴급한 메시지에는 긴급공지나 모달을 씁니다.
- 개별 입력 항목의 오류·성공·경고는 토스트가 아니라 해당 입력 옆에 인라인 텍스트로 보여 줍니다.
- 화면 하단 중앙, 다른 요소 위에 표시하며 하단 탭 바나 플로팅 버튼과 겹치지 않게 합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `message` **필수** | `ToastMessage \| null` | — | 지금 보여 줄 메시지입니다. `id`, `text`, `tone`(`information` 또는 `warning`)과, 같은 결과를 계속 확인할 수 있는 화면 요소를 가리키는 `persistentResultId`를 담습니다. `null`이면 토스트를 표시하지 않습니다. |
| `durationMs` | `number` | `3000`, `warning`은 `4000` | 메시지를 보여 주는 시간(밀리초)입니다. 사용자가 충분히 읽을 수 있도록 더 길게 지정할 수 있습니다. 0보다 커야 합니다. |
| `onDismiss` **필수** | `(detail: {id: string; reason: 'timeout'; generation: number}) => void` | — | 표시 시간이 끝났을 때 한 번 불립니다. 메시지의 `id`, `reason`(`timeout`), 표시 회차를 구분하는 `generation`을 받습니다. 토스트는 스스로 사라지지 않으므로 여기서 `message`를 `null`이나 다음 메시지로 바꿉니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

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

## 접근성 {#accessibility}

- `role="status"`와 `aria-live="polite"`로 메시지를 화면 낭독기에 알립니다. 초점은 옮기지 않습니다.
- 토스트 안에는 버튼이나 닫기 컨트롤이 없으며 초점을 받지 않고 클릭도 가로채지 않습니다.
- 토스트는 곧 사라지므로, 같은 결과를 나중에도 확인할 수 있는 상태 표시나 이력을 화면에 따로 두고 그 요소의 `id`를 `persistentResultId`로 넘깁니다.

## 알아 둘 점 {#notes}

- 한 번에 메시지 하나만 보여 줍니다. 여러 메시지의 순서와 대기열은 직접 관리하고, 보여 줄 메시지를 `message`로 넘깁니다.
- `message`의 `id`가 바뀌면 보이는 메시지를 즉시 교체합니다. 교체하거나 `null`로 지울 때는 `onDismiss`가 불리지 않습니다.
- 같은 `id`에서 `text`가 바뀌면 바뀐 내용을 다시 알립니다. `text`, `tone`, `durationMs` 중 하나라도 바뀌면 표시 시간을 처음부터 다시 셉니다.
- 탭이 숨겨진 동안에는 남은 표시 시간을 멈췄다가, 다시 보이면 이어서 셉니다.
- 긴 번역문이나 확대된 글자는 자르지 않고 줄을 바꿔 보여 줍니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `information`, `warning`, `open`, `closed` |
| `message` | `information`, `warning`, `open`, `closed` |

```css
[data-krds-component="toast"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_05.html)
- [상세 명세](/sources/specs/components/toast.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
