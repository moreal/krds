---
title: 'Favicon'
---

# Favicon {#favicon}

**파비콘** — 브라우저 탭과 즐겨찾기에 표시되는 서비스 아이콘입니다.

`Favicon` · `@unofficial-krds/<프레임워크>/favicon` · CSS `@unofficial-krds/styles/favicon.css`

## 사용법 {#usage}

- 브라우저 탭, 즐겨찾기, 모바일 홈 화면에서 기관이나 서비스를 알아볼 수 있도록 파비콘을 문서 `head`에 등록할 때 씁니다. 화면에 보이는 요소는 렌더링하지 않습니다.
- 정부 상징을 쓰는 기관은 표준형을, 자체 로고를 쓰는 기관과 서비스는 그 로고를 바탕으로 한 확장형을 씁니다.
- 16px에서도 알아볼 수 있도록 세부를 덜어 낸 심볼이나 약칭으로 만듭니다.
- 대표 도메인과 하위 서비스에 같은 파비콘을 적용합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `light` **필수** | `IconAsset` | — | 기본으로 쓰는 밝은 테마용 아이콘입니다. 파일 경로 `href`, MIME 타입 `type`, 크기 `sizes`를 넘깁니다. |
| `dark` | `IconAsset` | — | 어두운 테마에서 쓸 아이콘입니다. 넘기면 브라우저의 색상 테마에 따라 `light`와 바꿔 씁니다. |
| `touchIcon` | `IconAsset` | — | 모바일 홈 화면에 추가할 때 쓰는 아이콘입니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입입니다.

```ts
export interface IconAsset {
    href: string;
    type: string;
    sizes: string;
}
```

## 접근성 {#accessibility}

- 밝은 배경과 어두운 배경 모두에서 또렷하게 보이도록 대비를 확보합니다. 어두운 테마용은 같은 심볼을 유지한 채 명도 반전, 외곽선, 배경판으로 구분합니다.

## 알아 둘 점 {#notes}

- 아이콘 파일은 직접 준비해 서비스와 함께 배포하고 그 경로를 넘깁니다. 기본으로 들어 있는 아이콘은 없습니다.

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_14.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
