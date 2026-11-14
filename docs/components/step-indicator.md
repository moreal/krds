---
title: 'Step indicator'
---

# Step indicator {#step-indicator}

**단계 표시기** — 여러 단계로 이루어진 절차에서 현재 위치와 남은 단계를 보여 줍니다.

## 사용법 {#usage}

- 여러 단계로 된 절차에서 사용자가 지나온 단계, 지금 단계, 남은 단계를 보여 줄 때 씁니다.
- 단계는 3개 이상 7개 이하로 구성합니다. 한 단계에서 처리할 수 있는 일은 합쳐서 단계 수를 줄입니다.
- 단계 레이블은 그 단계에서 할 일을 짧은 단어나 문구로 적어, 잘리거나 줄바꿈되지 않게 합니다. 설명이 더 필요하면 가까운 곳에 보조 텍스트를 따로 둡니다.
- 정해진 순서대로만 진행해야 하면 `sequential`을, 단계를 건너뛰거나 자유로운 순서로 오갈 수 있으면 `adaptive`를 씁니다.
- 선택 단계는 가능하면 필수 단계 뒤에 두고, '건너뛰기'처럼 분명한 레이블의 건너뛰기 수단을 함께 제공합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `steps` **필수** | `readonly {id: string; label: string; status: 'pending' \| 'current' \| 'complete'; href?: string; optional?: boolean}[]` | — | 단계 목록입니다. 각 단계의 `status`로 `pending`, `current`, `complete` 중 하나를 지정합니다. `href`를 주면 이동할 수 있는 단계가 되고, `optional`은 건너뛸 수 있는 선택 단계임을 나타냅니다. |
| `mode` | `'sequential' \| 'adaptive'` | — | `sequential`은 순서대로 진행하는 절차로, 아직 도달하지 않은 단계로는 이동할 수 없습니다. `adaptive`는 `href`가 있는 단계라면 순서와 관계없이 이동할 수 있습니다. |
| `onStepRequest` | `(detail: {id: string}) => void` | — | 사용자가 이동할 수 있는 단계를 누르면 불리고, 그 단계의 `id`를 받습니다. 단계 이동을 직접 처리할 때만 넘깁니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface StepIndicatorContract {
    steps: readonly {
        id: string;
        label: string;
        status: 'pending' | 'current' | 'complete';
        href?: string;
        optional?: boolean;
    }[];
    mode?: 'sequential' | 'adaptive';
    onStepRequest?: (detail: {
        id: string;
    }) => void;
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 이동할 수 있는 단계 사이를 차례로 이동합니다. 이동할 수 없는 단계 레이블에는 초점이 가지 않습니다. |
| `Enter` | 초점이 있는 단계로 이동합니다. |

## 접근성 {#accessibility}

- 단계를 순서 있는 목록으로 표시하므로 화면 낭독기가 전체 단계 수와 순서를 전달합니다.
- 현재 단계에는 `aria-current`를 붙여 화면 낭독기에 알립니다.
- 현재 단계와 완료 단계를 색만이 아니라 표시기 모양으로도 구분합니다.
- 단계 흐름은 왼쪽에서 오른쪽 또는 위에서 아래로, 한 서비스 안에서 일관되게 표현합니다.

## 알아 둘 점 {#notes}

- 각 단계의 `status`와 다음 단계로 넘어갈 수 있는지는 쓰는 쪽에서 정해 `steps`로 넘깁니다. 단계를 누르는 것만으로 그 단계의 입력이 끝난 것으로 처리되지는 않습니다.
- 화면이 좁으면 '4단계 중 1단계'처럼 현재 단계와 전체 단계 수만 줄여 보여 줄 수 있습니다. 이때도 전체 단계 정보는 화면 낭독기에 전달됩니다.
- 단계가 3개보다 적거나 7개보다 많으면 오류를 냅니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `current`, `complete`, `pending`, `blocked` |
| `list` | 없음 |
| `item` | `current`, `complete`, `pending`, `blocked` |
| `number` | `current`, `complete`, `pending`, `blocked` |
| `label` | `current`, `complete`, `pending`, `blocked` |
| `connector` | `current`, `complete`, `pending`, `blocked` |
| `current-indicator` | `current` |
| `complete-indicator` | `complete` |

```css
[data-krds-component="step-indicator"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_07_01.html)
- [상세 명세](/sources/specs/components/step-indicator.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
