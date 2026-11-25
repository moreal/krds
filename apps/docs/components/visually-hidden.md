---
title: 'Visually hidden'
---

# Visually hidden {#visually-hidden}

**숨긴 콘텐츠** — 화면에는 보이지 않지만 스크린 리더는 읽는 텍스트를 넣습니다.

`VisuallyHidden` · `@unofficial-krds/<프레임워크>/visually-hidden` · CSS `@unofficial-krds/styles/visually-hidden.css`

## 사용법 {#usage}

- 화면에는 보이지 않지만 화면 낭독기 사용자에게 필요한 설명을 전달할 때 씁니다. 텍스트가 아닌 콘텐츠의 복잡한 설명, 조작 방법 안내, 상태 변화 알림이 해당합니다.
- 먼저 주변 정보를 활용하거나 모두가 볼 수 있게 화면에 표시하는 방법을 검토합니다. 표, 목록, 제목처럼 의미에 맞는 태그를 쓰면 숨긴 설명이 필요 없는 경우가 많습니다.
- 간단한 이미지 설명이나 요소의 접근 가능한 이름에는 쓰지 않습니다. 대체 텍스트나 `aria-label` 같은 속성을 씁니다.
- 체크박스처럼 기본 컨트롤을 숨기고 다른 모양으로 대신 보여 줄 때는 `interactive-overlay` 변형을 씁니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `id` | `string` | — | 숨긴 요소의 `id`입니다. 다른 요소가 `aria-describedby`나 `aria-labelledby`로 이 텍스트를 참조할 때 씁니다. |
| `lang` | `string` | — | 숨긴 텍스트의 언어입니다. 주변 콘텐츠와 언어가 다를 때 지정합니다. |
| `content` | `string` | — | 화면 낭독기에 전달할 텍스트입니다. |
| `variant` | `'text' \| 'interactive-overlay' \| 'aria-association'` | `"text"` | 숨기는 방식입니다. `text`는 텍스트를 화면에서만 감추고, `interactive-overlay`는 실제 컨트롤을 눈에 보이는 대체 요소 위에 같은 크기로 투명하게 겹치며, `aria-association`은 다른 요소가 `id`로 참조할 텍스트를 둡니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

## 접근성 {#accessibility}

- 숨긴 텍스트는 `display: none`이나 `visibility: hidden`, 크기 0 없이 감추므로 화면 낭독기가 그대로 읽습니다.
- `interactive-overlay`로 겹친 컨트롤은 원래 키보드 동작을 유지하고, 초점 윤곽선은 눈에 보이는 대체 요소의 위치에 표시됩니다.
- 초점을 받는 컨트롤에는 `text` 변형을 쓰지 않습니다. 1px로 줄어들어 초점 위치를 볼 수 없게 됩니다.
- 서비스 언어를 바꿀 때 숨긴 텍스트도 함께 번역합니다. 화면에 보이지 않아 놓치기 쉽습니다.
- 화면 낭독기와 브라우저가 업데이트되면 동작이 달라질 수 있으므로 VoiceOver, TalkBack 등 여러 조합에서 주기적으로 테스트합니다.

## 알아 둘 점 {#notes}

- `span` 요소로 렌더링합니다.
- `interactive-overlay`로 겹친 입력은 `name`과 `value`, 폼 초기화 동작을 그대로 유지합니다.
- 화면 크기가 바뀌거나 글자를 확대해도 겹친 컨트롤은 대체 요소와 같은 위치와 크기를 유지합니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/visually-hidden.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `text`, `interactive-overlay`, `focus-visible` |
| `overlay-control` | `interactive-overlay`, `focus-visible` |
| `visible-surrogate` | `focus-visible` |

```css
[data-krds-component="visually-hidden"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_11_02.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
