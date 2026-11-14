---
title: 'Disclosure'
---

# Disclosure {#disclosure}

**디스클로저** — 덜 중요한 보충 내용을 접어 두었다가 필요할 때 펼쳐 보여 줍니다.

## 사용법 {#usage}

- 여러 섹션으로 이루어진 화면에서 부가 안내나 이미지 설명 같은 보충 정보를 접어 둘 때 씁니다.
- 오류 메시지나 꼭 봐야 하는 정보는 넣지 않습니다. 접혀 있으면 사용자가 발견하지 못할 수 있습니다.
- 섹션이 하나뿐인 화면이나 표의 셀 안에서는 쓰지 않습니다.
- 보충하려는 정보나 컨트롤 바로 아래에 두고, 처음에는 접힌 상태로 제공합니다.
- 한 섹션에는 하나만 씁니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 펼침 상태를 직접 제어할 때 넘깁니다. 넘기면 `onOpenChange`에서 받은 값을 반영해야 펼쳐지거나 접힙니다. |
| `defaultOpen` | `boolean` | `false` | 직접 제어하지 않을 때의 초기 펼침 상태입니다. |
| `onOpenChange` | `(detail: OpenChangeDetails) => void` | — | 사용자가 버튼을 눌러 펼치거나 접으려 할 때 한 번 불리며 `{open}`을 받습니다. |
| `label` **필수** | `string` | — | 버튼에 보이는 텍스트입니다. 펼쳤을 때 나올 내용을 짐작할 수 있게 씁니다. |
| `contentId` **필수** | `string` | — | 펼쳐지는 콘텐츠 영역의 `id`입니다. 버튼과 콘텐츠를 연결하는 데 씁니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface DisclosureContract extends ControlledOpen {
    label: string;
    contentId: string;
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

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 디스클로저 버튼으로 초점을 옮깁니다. |
| `Enter` / `Space` | 콘텐츠를 펼치거나 접습니다. 초점은 버튼에 남습니다. |

## 접근성 {#accessibility}

- 여닫는 컨트롤은 `button`이며 펼침 상태를 `aria-expanded`로, 연결된 콘텐츠를 `aria-controls`로 알립니다.
- 접힌 콘텐츠는 화면 낭독기가 읽지 않고, 그 안의 링크나 버튼도 `Tab`으로 닿지 않습니다.
- 초점이 콘텐츠 안에 있을 때 `open`을 `false`로 바꾸면 초점이 버튼으로 돌아갑니다.

## 알아 둘 점 {#notes}

- `open`과 `defaultOpen`은 함께 넘기지 않습니다.
- 접어도 콘텐츠 안의 입력값은 사라지지 않습니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `open`, `closed` |
| `trigger` | `open`, `closed` |
| `icon` | 없음 |
| `content` | `open`, `closed` |

```css
[data-krds-component="disclosure"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_04.html)
- [상세 명세](/sources/specs/components/disclosure.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
