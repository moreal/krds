---
title: 'Image'
---

# Image {#image}

**이미지** — 이미지를 대체 텍스트, 캡션과 함께 보여 줍니다.

`Image` · `@unofficial-krds/<프레임워크>/image` · CSS `@unofficial-krds/styles/image.css`

## 사용법 {#usage}

- 의료 정보, 서비스 이용 방법, 시설 위치처럼 글보다 그림이 정보를 더 잘 전달할 때 씁니다. 브랜드 인상을 주기 위한 장식 용도로도 쓸 수 있습니다.
- 인접한 글과 내용이 맞지 않거나 뜻이 분명하지 않은 이미지는 쓰지 않습니다. 이미지를 지나치게 많이 쓰면 정보 탐색을 방해합니다.
- 글자는 이미지에 합성하지 말고 실제 텍스트로 제공합니다. 화면 크기가 바뀌어도 읽을 수 있고 사용자가 크기와 색을 조정할 수 있습니다.
- 누를 수 있는 이미지가 필요하면 `Link`나 `Button` 안에 넣어 씁니다. 이때 이미지는 링크나 버튼의 목적과 맞아야 합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `src` **필수** | `string` | — | 이미지 주소입니다. |
| `alt` **필수** | `string` | — | 이미지가 전달하는 정보를 간결하게 적은 대체 텍스트입니다. 화면 낭독기가 읽고, 이미지를 불러오지 못했을 때 이미지 자리에 표시됩니다. 장식 이미지가 아니면 비워 둘 수 없습니다. |
| `width` | `number` | — | 이미지의 원래 너비(픽셀)입니다. `height`와 함께 주면 불러오기 전에 자리를 미리 잡습니다. |
| `height` | `number` | — | 이미지의 원래 높이(픽셀)입니다. |
| `srcset` | `string` | — | 화면 크기와 해상도에 따라 고를 이미지 후보 목록입니다. `img`의 `srcset`과 같습니다. |
| `sizes` | `string` | — | 레이아웃에서 이미지가 차지할 너비를 알려 `srcset`에서 알맞은 후보를 고르게 합니다. |
| `loading` | `'eager' \| 'lazy'` | `"lazy"` | 이미지를 불러오는 시점입니다. `eager`는 바로, `lazy`는 화면에 가까워질 때 불러옵니다. |
| `decorative` | `boolean` | `false` | `true`면 장식 이미지로 다뤄 대체 텍스트를 비우고 화면 낭독기가 읽지 않게 합니다. |
| `caption` | `string` | — | 이미지 아래에 표시할 캡션입니다. 넘기면 `figcaption`으로 표시합니다. |
| `descriptionId` | `string` | — | 이미지를 자세히 설명하는 요소의 `id`입니다. 도표처럼 복잡한 이미지의 긴 설명을 이미지와 연결합니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

## 접근성 {#accessibility}

- 장식 이미지를 뺀 모든 이미지에 `alt`를 넣습니다. 장식 이미지는 `decorative`를 켜고 `alt`를 빈 문자열로 둡니다.
- `alt`에는 만든 사람 정보, '이미지'나 '그래픽' 같은 말, 바로 옆 글과 같은 설명, 이미지에 없는 내용을 넣지 않습니다.
- 복잡한 이미지는 `caption`이나 `descriptionId`로 연결한 글에서 자세히 설명합니다.
- 링크 안에 넣은 이미지의 `alt`는 이미지 모습이 아니라 링크의 목적지를 설명하게 씁니다.
- 이미지 자체는 `Tab` 이동 순서에 들어가지 않습니다.

## 알아 둘 점 {#notes}

- 좁은 화면에서는 `srcset`과 `sizes`로 알맞은 크기나 잘라 낸 이미지를 제공하되, 핵심 정보가 잘려 나가지 않게 합니다.
- 좁은 화면에서 장식 이미지는 빼도 됩니다. 정보를 담은 이미지를 뺀다면 같은 내용을 글로 제공합니다.
- 이미지를 불러오지 못하면 대체 텍스트가 이미지 자리에 남고, 그 아래에 '이미지를 불러올 수 없습니다.'라는 안내를 표시합니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/image.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `loaded`, `error` |
| `figure` | `loaded`, `error` |
| `caption` | 없음 |
| `description` | 없음 |

```css
[data-krds-component="image"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_08.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
