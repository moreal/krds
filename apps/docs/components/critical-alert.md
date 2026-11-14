---
title: 'Critical alerts'
---

# Critical alerts {#critical-alerts}

**긴급 공지** — 모든 사용자가 반드시 알아야 하는 긴급한 내용을 화면 상단에 알립니다.

## 사용법 {#usage}

- 재난·재해, 갑작스러운 서비스 장애, 예정된 이용 중단처럼 대부분의 사용자가 지금 알아야 하는 정보를 전할 때 씁니다.
- 홍보, 일반 공지, 폼 검사 결과나 완료 안내 같은 피드백에는 쓰지 않습니다.
- 본문의 첫 요소로, 메인 메뉴와 히어로 영역 사이에 화면 전체 너비로 둡니다.
- 공지가 유효한 기간에만 게시하고, 한 번에 하나만 씁니다.
- 문구는 한 줄로 간결하게 쓰고, 자세한 내용은 상세 링크 하나로 연결합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `urgency` **필수** | `'high' \| 'medium' \| 'low'` | — | 긴급도입니다. `high`는 재난·재해나 예고 없는 장애, `medium`은 이용 중단 사전 예고, `low`는 이용에 큰 영향은 없지만 알아야 하는 상황에 씁니다. 아이콘과 강조 색이 달라집니다. |
| `label` **필수** | `string` | — | 긴급도를 알려 주는 보이는 레이블입니다. 색 없이도 공지의 종류를 구분할 수 있게 합니다. |
| `message` **필수** | `string` | — | 공지 내용입니다. |
| `details` | `LinkData & {destinationTitle: string}` | — | 공지와 직접 관련된 상세 화면으로 가는 링크입니다. `href`, `label`과 함께 목적지 문서 제목인 `destinationTitle`을 넘깁니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface CriticalAlertContract {
    urgency: 'high' | 'medium' | 'low';
    label: string;
    message: string;
    details?: LinkData & {
        destinationTitle: string;
    };
}

export interface LinkData {
    id?: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 상세 링크로 이동합니다. |
| `Enter` | 초점이 있는 상세 링크로 이동합니다. |

## 접근성 {#accessibility}

- 공지 영역에 `banner` 역할을 주고 `label`을 영역 이름으로 써서, 화면 낭독기 사용자가 바로 찾아갈 수 있습니다.
- 긴급도 아이콘은 장식입니다. 레이블이 항상 함께 보이므로 화면 낭독기는 아이콘을 읽지 않습니다.
- 상세 링크에는 `destinationTitle`이 부가 설명으로 붙습니다. '자세히 보기'만으로는 목적지를 알 수 없으므로 목적지 문서 제목을 넘깁니다.
- 공지가 나타나도 초점을 옮기거나 화면 낭독기를 끊고 읽게 하지 않습니다.

## 알아 둘 점 {#notes}

- 닫기나 접기 버튼이 없습니다. 게시를 끝내려면 컴포넌트를 렌더링하지 않습니다.
- 화면이 좁으면 문구가 두 줄까지 늘어납니다. 내용이 잘리지 않도록 짧게 씁니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `high`, `medium`, `low` |
| `icon` | 없음 |
| `label` | `high`, `medium`, `low` |
| `message` | 없음 |
| `link` | 없음 |

```css
[data-krds-component="critical-alert"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_02.html)
- [상세 명세](/sources/specs/components/critical-alert.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
