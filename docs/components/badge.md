---
title: 'Badge'
---

# Badge {#badge}

**배지** — 항목의 상태나 개수를 작은 표시로 알립니다.

## 사용법 {#usage}

- 새 콘텐츠나 읽지 않은 알림을 알리거나, '접수 중', '마감됨'처럼 항목의 상태를 짧게 표시할 때 씁니다.
- 누를 수 있는 요소로 쓰지 않습니다. 선택하거나 지울 수 있어야 하면 `Tag`를 씁니다.
- 한 항목에는 가장 중요한 특성을 나타내는 배지 하나만 붙입니다.
- 레이블은 줄바꿈이 생기지 않게 핵심만 짧게 씁니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` **필수** | `string` | — | 배지에 표시할 텍스트입니다. 항상 보입니다. |
| `appearance` | `'outline' \| 'filled' \| 'pastel'` | `outline` | 컨테이너 모양입니다. `outline`은 윤곽선, `filled`는 채운 배경, `pastel`은 옅은 배경입니다. |
| `tone` | `'secondary' \| 'gray' \| 'point' \| 'danger' \| 'warning' \| 'success' \| 'information' \| 'disabled'` | — | 색으로 전달할 의미입니다. 위험에는 `danger`, 경고에는 `warning`처럼 일반적인 색 의미에 맞춰 고릅니다. `disabled`는 표시용 색일 뿐 무언가를 비활성화하지 않습니다. |
| `size` | `Size` | `medium` | 크기입니다. `small`, `medium`, `large` 중에서 고릅니다. |
| `numeric` | `boolean` | `false` | 레이블이 개수 같은 숫자일 때 켭니다. 숫자도 텍스트로 표시될 뿐 자동으로 세지 않습니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface BadgeContract {
    label: string;
    appearance?: 'outline' | 'filled' | 'pastel';
    tone?: 'secondary' | 'gray' | 'point' | 'danger' | 'warning' | 'success' | 'information' | 'disabled';
    size?: Size;
    numeric?: boolean;
}

export type Size = 'small' | 'medium' | 'large';
```

## 접근성 {#accessibility}

- 배지는 초점을 받지 않고 버튼이나 링크 역할도 갖지 않습니다.
- 상태는 색만이 아니라 텍스트 레이블로 전달됩니다. 레이블 없이 색만으로 의미를 나타내지 않습니다.
- 레이블과 배경의 명도 대비는 4.5:1 이상을 유지합니다.
- 서비스의 주조색 배경은 버튼으로 오인될 수 있어 제공하지 않습니다.

## 알아 둘 점 {#notes}

- 레이블은 줄바꿈되거나 잘리지 않으므로, 좁은 화면에서도 들어갈 만큼 짧은 문구를 넘깁니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `outline`, `filled`, `pastel`, `numeric`, `secondary`, `gray`, `point`, `danger`, `warning`, `success`, `information`, `disabled`, `small`, `medium`, `large` |
| `label` | 없음 |

```css
[data-krds-component="badge"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_06.html)
- [상세 명세](/sources/specs/components/badge.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
