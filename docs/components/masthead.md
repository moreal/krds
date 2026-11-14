---
title: 'Masthead'
---

# Masthead {#masthead}

**공식 배너** — 이 사이트가 대한민국 공식 전자정부 누리집임을 화면 맨 위에서 알립니다.

## 사용법 {#usage}

- 대한민국 정부의 공식 누리집임을 알리는 배너입니다. 실제 공식 정부 서비스에서만 씁니다.
- 모든 화면의 최상단, 건너뛰기 링크(`SkipLink`) 뒤와 헤더(`Header`) 앞에 둡니다. 일부 화면에만 넣거나 위치를 바꾸면 사용자에게 혼동을 줍니다.
- 문구와 스타일은 바꾸지 않습니다. 헤더의 내비게이션보다 눈에 띄지 않도록 배경색은 서비스 디자인에 맞는 차분한 색을 씁니다.
- 정부의 공식 서비스가 아닌 사이트에서는 쓰지 않습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `governmentService` **필수** | `boolean` | — | 공식 정부 서비스인지 여부입니다. `true`일 때만 “이 누리집은 대한민국 공식 전자정부 누리집입니다.” 문구를 표시하고, `false`이면 배너를 표시하지 않습니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface MastheadContract {
    governmentService: boolean;
}
```

## 접근성 {#accessibility}

- 배너 안에는 초점을 받는 요소가 없습니다.
- 모든 페이지에서 반복되는 영역이므로, 건너뛰기 링크를 배너보다 먼저 페이지의 첫 요소로 제공합니다.
- 주의를 끄는 애니메이션을 넣지 않습니다.

## 알아 둘 점 {#notes}

- 좁은 화면이나 확대한 화면에서도 문구 전체를 읽을 수 있습니다.
- 문구는 한국어로 고정되어 있습니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | 없음 |
| `text` | 없음 |

```css
[data-krds-component="masthead"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_02_01.html)
- [상세 명세](/sources/specs/components/masthead.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
