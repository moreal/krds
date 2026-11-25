---
title: 'Resize'
---

# Resize {#resize}

**화면 크기 조정** — 화면의 글자와 요소 크기를 사용자가 조절하게 합니다.

`Resize` · `@unofficial-krds/<프레임워크>/resize` · CSS `@unofficial-krds/styles/resize.css`

## 사용법 {#usage}

- 사용자가 읽기 편한 배율로 화면 크기를 바꿀 수 있게 할 때 씁니다. 버튼을 누르면 배율 목록이 펼쳐지고 현재 선택한 배율을 함께 보여 줍니다.
- 배율 옵션은 5개 이내로 제공하고, 숫자나 아이콘만이 아니라 “작게”, “보통”, “크게” 같은 설명을 레이블에 함께 씁니다.
- 이 컴포넌트는 선택한 값만 알려 줍니다. 실제로 화면에 배율을 적용하고 선택을 저장하는 일은 `onValueChange`에서 직접 합니다.
- 모바일 앱에서는 이 컴포넌트 대신 익숙한 설정 화면에서 같은 기능을 제공할 수 있습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `string` | — | 선택된 단계의 `id`를 직접 제어합니다. `defaultValue`와 함께 쓸 수 없습니다. |
| `defaultValue` | `string` | `"100"` | 직접 제어하지 않을 때 처음 선택된 단계의 `id`입니다. |
| `onValueChange` | `(detail: ValueChangeDetails<string>) => void` | — | 사용자가 다른 단계를 고르면 `{value}`를 받아 불립니다. `value`는 단계의 `id`이므로 배율은 `levels`에서 같은 `id`의 `percent`를 찾아 씁니다. |
| `open` | `boolean` | — | 옵션 목록의 열림 상태를 직접 제어합니다. `defaultOpen`과 함께 쓸 수 없습니다. |
| `defaultOpen` | `boolean` | `false` | 직접 제어하지 않을 때 처음 열림 상태입니다. |
| `onOpenChange` | `(detail: OpenChangeDetails) => void` | — | 사용자가 목록을 열거나 닫으려 할 때 `{open}`을 받아 불립니다. |
| `levels` | `readonly {id: string; label: string; percent: number}[]` | 작게 90%, 보통 100%, 조금 크게 110%, 크게 130%, 가장 크게 150%의 5단계 | 선택할 수 있는 단계 목록입니다. 각 항목은 `id`, 화면에 보일 `label`, 배율 `percent`를 가집니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입입니다.

```ts
export interface ValueChangeDetails<T> {
    value: T;
}

export interface OpenChangeDetails {
    open: boolean;
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Enter` / `Space` | 버튼에 초점이 있으면 옵션 목록을 펼치거나 접습니다. 옵션에 초점이 있으면 그 옵션을 선택하고 목록을 접습니다. |
| `Tab` / `Shift+Tab` | 버튼과 펼쳐진 옵션 사이를 차례로 이동합니다. |
| `Esc` | 옵션 목록을 접고 버튼으로 초점을 돌려줍니다. |
| `↑` / `↓` | 목록이 접힌 상태에서 이전 또는 다음 단계를 바로 선택합니다. 처음과 끝에서 순환하지 않습니다. |

## 접근성 {#accessibility}

- 버튼은 `aria-expanded`로 목록이 펼쳐져 있는지 알리고, 현재 선택된 단계를 버튼 안에 함께 보여 줍니다.
- 목록 바깥을 누르면 목록이 접힙니다.
- 배율을 키웠을 때 콘텐츠가 가려지거나 기능을 쓸 수 없게 되면 안 됩니다. 배치는 달라져도 내용은 같아야 합니다.
- 확대했을 때 스크롤은 한 방향으로만 생기게 합니다. 이미지, 동영상, 표처럼 본래 가로로 넓은 콘텐츠는 예외입니다.
- 배율은 CSS `transform`으로 화면만 키우지 말고, 콘텐츠가 다시 배치되는 반응형 레이아웃으로 적용합니다.

## 알아 둘 점 {#notes}

- `value`로 직접 제어할 때 `onValueChange`에서 값을 갱신하지 않으면 선택과 표시는 원래 단계로 남습니다.
- 브라우저나 기기의 확대 설정은 바꾸지 않습니다. 브라우저에서 200%, 400%로 확대했을 때도 화면이 문제없이 보이는지 함께 살핍니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/resize.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `open`, `closed`, `selected` |
| `trigger` | `open`, `closed` |
| `current` | 없음 |
| `list` | `open`, `closed` |
| `option` | `selected` |
| `scale-icon` | 없음 |

```css
[data-krds-component="resize"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_10_02.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
