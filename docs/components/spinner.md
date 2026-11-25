---
title: 'Spinner'
---

# Spinner {#spinner}

**스피너** — 처리가 진행 중임을 알립니다.

`Spinner` · `@unofficial-krds/<프레임워크>/spinner` · CSS `@unofficial-krds/styles/spinner.css`

## 사용법 {#usage}

- 페이지나 영역 전체가 새로 로딩될 때, 또는 버튼이나 검색 필드 같은 일부 요소에서 처리가 진행 중일 때 대기 상태를 알리는 데 씁니다.
- 진행률을 계산할 수 있으면(파일 업로드, 다운로드 등) `value`를 주어 확정형으로, 걸리는 시간을 알 수 없으면 `value` 없이 불확정형으로 씁니다.
- 처리가 진행 중인 영역 가까이에 둡니다. 페이지 전체나 넓은 영역에는 큰 크기를, 버튼이나 입력 필드 안에는 작은 크기를 씁니다.
- 1초 안에 끝나는 작업에는 쓰지 않습니다. 장식용으로도 쓰지 않습니다.
- 개별 항목마다 진행 상태를 보여야 하는 경우가 아니면 화면에 스피너를 하나만 표시합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `pending` **필수** | `boolean` | — | `true`인 동안 스피너와 `label`을 보여 줍니다. `false`로 바꾸면 스피너를 숨기고 `completionMessage`를 알립니다. |
| `value` | `number` | — | 0에서 100 사이의 진행률입니다. 주면 그만큼 시계 방향으로 채워지는 확정형이 되고, 생략하면 계속 회전하는 불확정형이 됩니다. |
| `label` **필수** | `string` | — | 로딩 중에 표시하고 화면 낭독기에 알리는 문구입니다. 무엇을 기다리는지 적습니다. |
| `completionMessage` **필수** | `string` | — | 로딩이 끝났을 때 화면 낭독기에 알리는 문구입니다. |
| `size` | `Size` | `"medium"` | 스피너 크기입니다. `small`, `medium`, `large` 가운데 고릅니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입입니다.

```ts
export type Size = 'small' | 'medium' | 'large';
```

## 접근성 {#accessibility}

- 확정형은 진행률을 `progressbar` 역할의 현재 값으로 전달합니다. 불확정형은 현재 값을 전달하지 않습니다.
- 로딩 시작과 완료를 `aria-live="polite"` 상태 메시지로 각각 한 번 알립니다. 진행 중에 반복해서 읽지 않습니다.
- 스피너는 초점을 받지 않고 초점을 옮기지도 않습니다.
- `label`과 `completionMessage`는 반드시 의미 있는 문구로 채웁니다.
- 스피너의 경로와 배경, 경로와 표시기 사이의 명도 대비를 3:1 이상으로 유지합니다.
- 로딩 중인 콘텐츠 영역에는 직접 `aria-busy`를 붙여 아직 준비되지 않았음을 알립니다.

## 알아 둘 점 {#notes}

- `pending`과 `value`는 실제 작업 상태에 맞춰 직접 갱신합니다. 컴포넌트가 스스로 진행률을 올리거나 완료로 바꾸지 않습니다.
- `value`가 0에서 100 범위를 벗어나거나 유한한 수가 아니면 오류를 냅니다.
- 동작 줄이기 설정이 켜져 있으면 불확정형의 회전을 멈추고 정지된 표시와 문구로 대기 상태를 알립니다. 확정형은 실제 진행률을 그대로 보여 줍니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/spinner.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `pending`, `complete`, `determinate`, `indeterminate` |
| `track` | `pending`, `complete`, `determinate`, `indeterminate` |
| `indicator` | `pending`, `complete`, `determinate`, `indeterminate` |
| `label` | `pending`, `complete` |
| `status` | `pending`, `complete` |

```css
[data-krds-component="spinner"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_07_02.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
