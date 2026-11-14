---
title: 'Button'
---

# Button {#button}

**버튼** — 제출, 저장, 취소 같은 동작을 실행합니다.

## 사용법 {#usage}

- 제출, 저장, 열기처럼 사용자가 동작을 실행하게 할 때 씁니다.
- 다른 페이지로 이동하는 용도에는 `Link`를 씁니다.
- 아이콘만 있는 버튼에는 `aria-label`로 기능을 설명하는 이름을 붙입니다.
- 데이터를 제출하는 버튼은 요청이 진행되는 동안 `disabled`로 바꿔 여러 번 눌리지 않게 합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'text' \| 'icon'` | `primary` | 버튼의 모양과 강조 수준입니다. `icon`은 아이콘만 보이는 모양이며 접근 가능한 이름이 따로 필요합니다. |
| `size` | `'xsmall' \| 'small' \| 'medium' \| 'large' \| 'xlarge'` | `medium` | 버튼의 크기입니다. |
| `type` | `'button' \| 'submit' \| 'reset'` | `button` | 폼 안에서의 동작입니다. `submit`은 폼을 제출하고 `reset`은 폼을 초기화합니다. 기본값인 `button`은 폼에 아무 영향도 주지 않습니다. |
| `disabled` | `boolean` | `false` | 버튼을 비활성화합니다. 비활성 버튼은 초점을 받지 않고 `onClick`도 불리지 않습니다. |
| `icon` | `JSX.Element` | — | 레이블 뒤에 표시하는 장식 아이콘입니다. 화면 낭독기는 읽지 않습니다. |
| `children` | `JSX.Element` | — | 버튼의 레이블입니다. 이 내용이 버튼의 접근 가능한 이름이 됩니다. |
| `onClick` | `JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>` | — | 버튼을 클릭하거나 `Enter`, `Space`로 실행할 때 한 번 불립니다. 브라우저의 클릭 이벤트를 받습니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Enter` | 버튼을 실행합니다. |
| `Space` | 키를 뗄 때 버튼을 실행합니다. |

## 접근성 {#accessibility}

- 실제 `button` 요소로 제공되어 키보드 조작과 초점 표시를 브라우저 기본 동작 그대로 씁니다.
- 레이블 텍스트, `aria-label`, `aria-labelledby` 중 하나로 접근 가능한 이름을 반드시 줍니다. 이름이 없으면 오류가 납니다.
- `icon`에 넣은 아이콘은 이름에 포함되지 않으므로, 레이블과 같은 뜻을 되풀이하는 장식으로만 씁니다.
- 초점 표시가 주변 요소에 가려지지 않게 배치합니다.

## 알아 둘 점 {#notes}

- `name`, `value`, `form`, `aria-label` 등 `button` 요소의 기본 속성을 그대로 넘길 수 있습니다.
- `type`이 `submit`이면 폼의 입력 값 확인을 거쳐 제출하며, `name`과 `value`가 있으면 제출 값에 포함됩니다.
- 로딩 상태나 중복 클릭 방지는 들어 있지 않습니다. 요청 중에는 직접 `disabled`를 켭니다.
- 눌린 상태가 유지되는 토글 버튼으로는 쓸 수 없습니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `disabled` |
| `label` | 없음 |
| `icon` | 없음 |

```css
[data-krds-component="button"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_05_02.html)
- [상세 명세](/sources/specs/components/button.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
