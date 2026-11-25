---
title: 'Link'
---

# Link {#link}

**링크** — 다른 페이지나 위치로 이동하게 합니다.

`Link` · `@unofficial-krds/<프레임워크>/link` · CSS `@unofficial-krds/styles/link.css`

## 사용법 {#usage}

- 다른 서비스, 같은 서비스의 다른 화면, 같은 화면의 다른 섹션으로 이동할 때 씁니다.
- 폼 제출, 대화창 열기, 취소 같은 동작에는 링크 대신 `Button`을 씁니다.
- 레이블은 목적지의 내용을 예측할 수 있게 구체적으로 씁니다. '여기를 클릭하세요', '더 읽기' 같은 말은 피하고, 여러 줄로 넘어갈 만큼 길게 쓰지 않습니다.
- 가장 중요한 링크에만 `emphasis`를 쓰고, 중요도가 같은 링크가 여럿이면 `basic`을 씁니다.
- 이메일 주소와 전화번호는 `mailto:`와 `tel:` 주소로 링크를 걸어 바로 연결되게 합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `href` **필수** | `string` | — | 이동할 주소입니다. |
| `label` **필수** | `string` | — | 링크에 표시할 텍스트입니다. 목적지를 설명하는 내용으로 씁니다. |
| `target` | `string` | — | 링크를 열 위치입니다. `_blank`를 주면 새 창으로 열리고 레이블 뒤에 '(새 창)'을 표시합니다. |
| `rel` | `string` | — | 현재 문서와 목적지의 관계입니다. `a` 요소의 `rel`과 같습니다. `target`이 `_blank`면 `noopener noreferrer`를 자동으로 더합니다. |
| `disabled` | `boolean` | `false` | `true`면 사용할 수 없는 링크로 표시합니다. 이동하지 않고 키보드 초점도 받지 않습니다. |
| `appearance` | `'basic' \| 'emphasis'` | `"basic"` | 강조 수준입니다. `basic`은 일반 링크, `emphasis`는 가장 중요한 링크에 씁니다. |
| `size` | `Size` | `"medium"` | 글자 크기입니다. `small`, `medium`, `large` 가운데 고릅니다. 문장 안에 넣는 링크는 주변 글자와 같은 크기로 맞춥니다. |
| `underline` | `boolean` | `true` | 밑줄 표시 여부입니다. 메뉴처럼 링크임이 분명한 곳에서만 `false`로 둡니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입입니다.

```ts
export type Size = 'small' | 'medium' | 'large';
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 링크로 초점을 옮깁니다. 사용할 수 없는 링크는 건너뜁니다. |
| `Enter` | 초점이 있는 링크로 이동합니다. |

## 접근성 {#accessibility}

- 실제 `<a href>` 요소로 표시하므로 화면 낭독기가 링크로 읽고, 새 탭에서 열기 같은 브라우저 기능도 그대로 동작합니다.
- 링크를 색만으로 구분하지 않도록 밑줄을 유지합니다.
- 같은 목적지로 가는 링크는 같은 레이블로, 다른 목적지로 가는 링크는 다른 레이블로 씁니다.
- 외부 서비스로 나가는 링크는 아이콘이나 '외부' 같은 텍스트로 구분해 서비스를 벗어난다는 것을 미리 알립니다.
- 누를 수 있는 영역은 마우스 기준 17×17px, 터치 기준 44×44px 이상을 권장합니다.

## 알아 둘 점 {#notes}

- 문장 안에 넣은 링크는 글의 흐름을 따라 줄바꿈됩니다.
- `disabled`인 링크는 `href` 없이 표시됩니다. 일시적으로 쓸 수 없는 목적지를 보여 줄 때만 씁니다.
- `Space`로는 실행되지 않습니다. 버튼처럼 동작해야 하면 `Button`을 씁니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/link.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `disabled`, `external` |
| `label` | 없음 |
| `icon` | 없음 |

```css
[data-krds-component="link"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_05_01.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
