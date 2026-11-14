---
title: 'Modal'
---

# Modal {#modal}

**모달** — 현재 화면 위에 대화상자를 띄워 확인이나 입력을 받습니다.

## 사용법 {#usage}

- 사용자가 현재 화면에서 벗어나지 않고 반드시 확인하거나 응답해야 하는 내용을 띄울 때 씁니다. 열려 있는 동안 뒤쪽 화면은 조작할 수 없습니다.
- 제목은 필수입니다. 본문은 `children`에, 확인·취소 같은 버튼은 `actions`에 넣습니다.
- 사용자가 항상 닫을 수 있어야 합니다. `showCloseButton`을 `false`로 두면 본문이나 `actions`에 닫기 또는 취소 버튼을 직접 넣습니다.
- 동작이 실패하면 모달을 닫지 말고 안에서 오류를 보여 줍니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `title` | `JSX.Element` | — | 모달의 제목입니다. 화면에 보이며 대화상자의 이름으로 쓰입니다. 비워 둘 수 없습니다. |
| `titleId` | `string` | — | 제목 요소의 `id`입니다. 주지 않으면 자동으로 만듭니다. |
| `description` | `JSX.Element` | — | 제목 아래에 보여 줄 짧은 설명입니다. 있으면 대화상자의 설명으로 연결합니다. |
| `descriptionId` | `string` | — | 설명 요소의 `id`입니다. 주지 않으면 자동으로 만듭니다. |
| `children` | `JSX.Element` | — | 모달의 본문입니다. |
| `actions` | `JSX.Element` | — | 본문 아래에 두는 동작 버튼 영역입니다. |
| `open` | `boolean` | — | 열림 상태를 직접 제어합니다. `onOpenChange`에서 받은 값으로 갱신합니다. `defaultOpen`과 함께 쓸 수 없습니다. |
| `defaultOpen` | `boolean` | `false` | 직접 제어하지 않을 때 처음 열림 상태입니다. |
| `onOpenChange` | `(details: OpenChangeDetails) => void` | — | 닫기 버튼, `Esc`, 바깥 클릭으로 사용자가 닫으려 할 때 `{open: false}`를 받아 불립니다. `open`을 바깥에서 바꾸는 것으로는 불리지 않습니다. |
| `closeOnOutsideClick` | `boolean` | `false` | `true`이면 모달 바깥 배경을 눌렀을 때 닫습니다. 배경에서 누르기 시작해 배경에서 뗀 경우에만 닫으므로, 안에서 시작한 드래그로는 닫히지 않습니다. |
| `showCloseButton` | `boolean` | `true` | 오른쪽 위의 아이콘 닫기 버튼을 표시합니다. `false`로 두려면 모달 안에 닫기 또는 취소 버튼이 있어야 합니다. |
| `initialFocusId` | `string` | — | 열릴 때 초점을 둘 요소의 `id`입니다. 모달 자체이거나 모달 안의 첫 번째 조작 가능한 요소만 지정할 수 있습니다. 주지 않으면 모달 자체에 초점을 둡니다. |
| `returnFocusId` | `string` | — | 닫힐 때 모달을 연 요소로 초점을 돌려줄 수 없으면 대신 초점을 둘 요소의 `id`입니다. |
| `closeLabel` | `string` | — | 아이콘 닫기 버튼의 접근 가능한 이름입니다. 주지 않으면 언어에 따라 `닫기` 또는 `Close`를 씁니다. |
| `locale` | `'ko-KR' \| 'en-US'` | — | 모달의 언어입니다. 닫기 버튼의 기본 이름과 `lang` 속성에 반영됩니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 모달 안의 조작 가능한 요소 사이를 순환합니다. 모달 밖으로 나가지 않습니다. |
| `Esc` | 모달을 닫습니다. 안에 열려 있는 셀렉트나 팝오버가 있으면 그것이 먼저 닫힙니다. 한글 조합 중에는 동작하지 않습니다. |
| `Enter` | 초점이 있는 버튼을 실행합니다. 모달 안에 폼이 있으면 제출 버튼을 통해서만 제출합니다. |

## 접근성 {#accessibility}

- `role="dialog"`와 `aria-modal="true"`를 주고, 보이는 제목을 대화상자의 이름으로 연결합니다.
- 열리면 초점을 모달로 옮기고, 열려 있는 동안 화면 낭독기와 키보드가 모달 밖 콘텐츠에 닿지 않게 합니다.
- 닫히면 모달을 열었던 요소로 초점을 돌려줍니다. 그 요소가 사라졌으면 `returnFocusId`가 가리키는 요소로 갑니다.
- 아이콘 닫기 버튼은 모달 안에서 읽기 순서의 맨 마지막에 옵니다. 제목, 설명, 본문, 동작 버튼 순으로 읽습니다.
- 제목은 모달의 목적을 알 수 있게 씁니다. 본문 전체를 `description`에 넣지 말고 짧은 요약만 넣습니다.

## 알아 둘 점 {#notes}

- `open`을 주면 열림 상태를 직접 관리해야 합니다. `onOpenChange`에서 `open`을 `false`로 바꾸지 않으면 모달은 열린 채로 남습니다.
- 열려 있는 동안 뒤쪽 페이지는 스크롤되지 않습니다. 화면이 작으면 모달 안에서 내용을 스크롤합니다.
- 모달 위에 모달을 열면 맨 위 모달만 `Esc`와 바깥 클릭에 반응합니다.
- 열리고 닫히는 애니메이션은 사용자의 동작 줄이기 설정을 따릅니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `open`, `closed` |
| `trigger` | 없음 |
| `backdrop` | `open`, `closed` |
| `content` | `open`, `closed` |
| `title` | 없음 |
| `description` | 없음 |
| `body` | 없음 |
| `actions` | 없음 |
| `close` | 없음 |

```css
[data-krds-component="modal"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_05.html)
- [상세 명세](/sources/specs/components/modal.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
