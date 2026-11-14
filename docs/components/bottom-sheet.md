---
title: 'Bottom sheet'
---

# Bottom sheet {#bottom-sheet}

**바텀시트** — 화면 아래에서 올라오는 패널에 보조 내용이나 선택지를 담습니다.

## 사용법 {#usage}

- 현재 화면을 유지한 채 부가 정보나 세부 옵션을 잠깐 보여 주고 선택을 받을 때 씁니다.
- 항상 보여야 하는 정보나 도구, 오래 읽어야 하는 정책 문서, 여러 단계로 이어지는 절차에는 쓰지 않습니다.
- 한 번에 하나만 엽니다. 시트 위에 시트를 겹쳐 쌓지 않습니다.
- 닫기는 취소와 같습니다. 시트를 닫으면 확정하지 않은 선택은 버려져야 합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 시트가 열려 있는지를 직접 제어합니다. 넘기면 `onOpenChange`에서 받은 값으로 갱신해야 합니다. |
| `defaultOpen` | `boolean` | `false` | 처음에 열어 둘지 정합니다. 상태를 직접 제어하지 않을 때 씁니다. |
| `onOpenChange` | `(detail: OpenChangeDetails & {reason: 'close' \| 'escape' \| 'outside' \| 'drag'}) => void` | — | 사용자가 시트를 닫으려 할 때 불립니다. 바뀔 `open` 값과 `reason`을 받습니다. `reason`은 닫기 버튼이나 핸들을 누르면 `close`, `Escape`는 `escape`, 바깥을 누르면 `outside`, 아래로 끌면 `drag`입니다. |
| `title` **필수** | `string` | — | 시트의 제목입니다. 대화상자의 접근 가능한 이름으로도 쓰입니다. |
| `description` | `string` | — | 제목 아래에 표시하는 짧은 설명입니다. |
| `onCancel` | `() => void` | — | 사용자가 닫기 버튼, 핸들, `Escape`, 바깥 누르기, 끌기로 시트를 닫을 때 불립니다. 여기서 고르던 값을 원래대로 되돌립니다. |
| `initialFocusId` | `string` | — | 시트가 열릴 때 처음 초점을 둘 요소의 `id`입니다. 시트 안의 첫 번째 조작 요소만 지정할 수 있으며, 지정하지 않으면 시트 자체가 초점을 받습니다. |
| `returnFocusId` | `string` | — | 시트가 닫힌 뒤 시트를 연 요소로 초점을 돌려보낼 수 없을 때 대신 초점을 받을 요소의 `id`입니다. |
| `dismissOnOutside` | `boolean` | `false` | `true`로 두면 시트 바깥을 눌러도 닫힙니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface BottomSheetContract {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails & {
        reason: 'close' | 'escape' | 'outside' | 'drag';
    }) => void;
    title: string;
    description?: string;
    onCancel?: () => void;
    initialFocusId?: string;
    returnFocusId?: string;
    dismissOnOutside?: boolean;
}

export interface OpenChangeDetails {
    open: boolean;
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 시트 안의 요소 사이를 이동합니다. 열려 있는 동안 초점은 시트 밖으로 나가지 않습니다. |
| `Escape` | 선택을 취소하고 시트를 닫습니다. |
| `Enter` / `Space` | 초점이 있는 닫기 버튼이나 핸들을 눌러 시트를 닫습니다. |

## 접근성 {#accessibility}

- 제목을 이름으로 갖는 대화상자로 열리며, 열려 있는 동안 뒤쪽 화면은 조작하거나 읽을 수 없습니다.
- 열리면 초점이 시트로 들어가고, 닫히면 시트를 연 요소로 돌아갑니다.
- 상단에 닫기 버튼이 항상 있습니다. 끌어서 닫는 동작을 모르거나 쓸 수 없는 사용자도 시트를 닫을 수 있습니다.
- 핸들은 '시트 닫기'라는 이름의 버튼으로, 누르면 시트가 닫힙니다.
- 동작 줄이기 설정을 켠 사용자에게는 슬라이드 애니메이션 없이 표시합니다.

## 알아 둘 점 {#notes}

- `open`과 `defaultOpen`을 함께 넘기면 오류가 납니다.
- 시트 높이는 화면 안으로 제한되며 기기 하단의 안전 영역과 가상 키보드를 피합니다. 내용이 길면 시트 안에서 스크롤합니다.
- 시트 안에 폼을 넣으면 `Enter`는 폼의 기본 동작을 따릅니다. 한글 조합 중에 누른 `Escape`로는 닫히지 않습니다.
- 시트를 닫아도 시트 바깥의 페이지 폼은 영향을 받지 않습니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `open`, `closed`, `dragging` |
| `backdrop` | `open`, `closed` |
| `content` | `open`, `closed`, `dragging` |
| `handle` | `dragging` |
| `header` | 없음 |
| `title` | 없음 |
| `body` | 없음 |
| `actions` | 없음 |
| `close` | 없음 |

```css
[data-krds-component="bottom-sheet"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_03.html)
- [상세 명세](/sources/specs/components/bottom-sheet.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
