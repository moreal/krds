---
title: 'Tab'
---

# Tab {#tab}

**탭** — 관련된 콘텐츠를 탭으로 나누어 한 번에 하나씩 보여 줍니다.

## 사용법 {#usage}

- 한 페이지 안에서 관련된 콘텐츠를 여러 패널로 나누고, 한 번에 하나씩 전환해 보여 줄 때 씁니다.
- 탭을 바꿔도 URL이 바뀌거나 페이지가 이동하지 않습니다. 다른 페이지로 이동하는 메뉴에는 쓰지 않습니다.
- 탭 목록에는 반드시 이름을 붙입니다. 보이는 `label`을 주거나 `aria-label` 또는 `aria-labelledby`를 넘깁니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` | `readonly TabItem[]` | — | 탭 목록입니다. 항목마다 서로 다른 `value`, 탭에 보일 `label`, 패널에 넣을 `content`가 필요합니다. `disabled`인 탭은 선택할 수 없고, `id`를 주면 탭의 `id`로 쓰며 패널은 그 뒤에 `-panel`을 붙인 `id`를 가집니다. |
| `label` | `JSX.Element` | — | 탭 목록 위에 보이는 이름입니다. 탭 목록의 접근 가능한 이름으로도 쓰입니다. |
| `value` | `string` | — | 선택된 탭의 `value`를 직접 제어할 때 넘깁니다. 선택할 수 있는 항목의 `value`여야 합니다. |
| `defaultValue` | `string` | — | 직접 제어하지 않을 때 처음 선택할 탭입니다. 생략하면 선택할 수 있는 첫 번째 탭을 선택합니다. |
| `onValueChange` | `(details: ValueChangeDetails<string>) => void` | — | 사용자가 다른 탭을 선택할 때 한 번 불리고, 선택하려는 탭의 `value`를 받습니다. |
| `activationMode` | `'manual' \| 'automatic'` | `manual` | `manual`은 탭에 초점이 가도 선택되지 않고 `Enter`, `Space`, 클릭으로 선택합니다. `automatic`은 탭에 초점이 가면 바로 선택합니다. |
| `orientation` | `'horizontal' \| 'vertical'` | `horizontal` | 탭을 놓는 방향입니다. 방향키 이동도 이 방향을 따릅니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 선택할 수 있는 모든 탭을 순서대로 지나간 뒤 선택된 패널로 이동합니다. |
| `Enter` / `Space` | 초점이 있는 탭을 선택합니다. |
| `←` / `→` | 가로 방향일 때 이전 또는 다음 탭으로 초점을 옮깁니다. 끝에서는 반대쪽 끝으로 넘어가고, 비활성 탭은 건너뜁니다. |
| `↑` / `↓` | 세로 방향일 때 이전 또는 다음 탭으로 초점을 옮깁니다. |
| `Home` / `End` | 선택할 수 있는 첫 번째 또는 마지막 탭으로 초점을 옮깁니다. |

## 접근성 {#accessibility}

- `tablist`, `tab`, `tabpanel` 역할과 서로의 연결 관계를 전달하고, 선택된 탭을 `aria-selected`로 알립니다.
- 탭 목록의 이름은 직접 넣습니다. `label`, `aria-label`, `aria-labelledby` 중 하나를 사용합니다.
- 선택되지 않은 패널은 숨겨져 `Tab` 순서와 화면 낭독기에서 빠집니다.
- 선택된 패널 안에 초점을 받을 요소가 없으면 패널 자체가 초점을 받아, 키보드 사용자가 내용에 닿을 수 있습니다.
- 선택 상태는 색만이 아닌 표시로 구분하며, 초점 표시와도 구별됩니다.

## 알아 둘 점 {#notes}

- `value`와 `defaultValue`는 함께 쓰지 않습니다. `value`를 넘기면 제어 방식이 되어, `onValueChange`에서 값을 바꾸지 않으면 원래 패널이 그대로 남습니다.
- 모든 패널은 숨겨져 있어도 계속 유지되므로, 탭을 오가도 패널 안의 입력 내용 같은 상태가 사라지지 않습니다.
- 탭을 선택해도 초점은 패널로 옮겨 가지 않고 탭에 남습니다.
- 항목이 없거나 모든 탭이 `disabled`이면 선택된 탭과 표시되는 패널이 없습니다.
- `automatic`은 패널 내용을 바로 보여 줄 수 있을 때만 씁니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | 없음 |
| `list` | 없음 |
| `trigger` | `selected`, `disabled` |
| `panel` | `active`, `inactive` |
| `indicator` | 없음 |

```css
[data-krds-component="tabs"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_04_10.html)
- [상세 명세](/sources/specs/components/tabs.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
