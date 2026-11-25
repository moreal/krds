---
title: 'Identifier'
---

# Identifier {#identifier}

**운영기관 식별자** — 화면 맨 아래에서 서비스를 운영하는 기관을 밝힙니다.

`Identifier` · `@unofficial-krds/<프레임워크>/identifier` · CSS `@unofficial-krds/styles/identifier.css`

## 사용법 {#usage}

- 서비스 운영을 최종적으로 책임지는 기관을 푸터 맨 아래에서 알릴 때 씁니다.
- 공식 디지털 정부 서비스가 아닌 사이트에서는 쓰지 않습니다. 사용자가 정부 서비스로 오해할 수 있습니다.
- 로고 자리에는 서비스 로고가 아니라 운영기관의 로고를 넣습니다. 서비스 로고는 푸터에 둡니다.
- 로고 다음에 안내 문구가 오는 배치와 문구 형식을 바꾸지 않습니다. 문구는 '이 누리집은 [운영기관명]에서 운영하는 누리집입니다.' 형식으로 씁니다.
- 푸터의 정보와 링크보다 눈에 띄지 않도록 서비스 디자인에 어울리는 배경 테마를 고릅니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `institutionName` **필수** | `string` | — | 운영기관의 이름입니다. 화면에는 보이지 않고, 화면 낭독기가 이 구획을 읽을 때 이름으로 씁니다. |
| `logo` **필수** | `LogoData` | — | 운영기관 로고 이미지입니다. `src`와 함께 기관 이름을 가리키는 대체 텍스트 `alt`를 넘깁니다. |
| `relationshipText` **필수** | `string` | — | 이 기관이 서비스를 운영한다는 안내 문구입니다. 기본 문구가 없으므로 직접 넘깁니다. |
| `theme` | `'light' \| 'dark'` | `"light"` | 배경 테마입니다. 밝은 배경은 `light`, 어두운 배경은 `dark`를 씁니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입입니다.

```ts
export interface LogoData {
    src: string;
    alt: string;
}
```

## 접근성 {#accessibility}

- `institutionName`을 이름으로 가진 `<section>` 요소로 표시합니다. `<footer>` 안의 가장 끝에 둡니다.
- `logo.alt`에는 실제 운영기관의 이름을 넣습니다.
- `light`와 `dark` 테마 모두에서 문구와 배경의 대비가 유지됩니다.

## 알아 둘 점 {#notes}

- 화면이 좁아도 로고가 먼저, 안내 문구가 다음에 오는 순서는 바뀌지 않습니다.
- `Footer`에 `institution`을 넘기면 푸터가 이 컴포넌트를 마지막 영역에 표시합니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/identifier.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `light`, `dark` |
| `logo` | 없음 |
| `text` | 없음 |

```css
[data-krds-component="identifier"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_02_02.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
