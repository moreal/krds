---
title: 'TTS'
---

# TTS {#tts}

**음성지원** — 화면의 글을 음성으로 들을 수 있게 합니다.

`TTS` · `@unofficial-krds/<프레임워크>/tts` · CSS `@unofficial-krds/styles/tts.css`

## 사용법 {#usage}

- 페이지 전체의 목적과 이용 순서를 요약해 들려주거나, 신청 안내·약관 같은 특정 영역의 내용을 음성으로 설명할 때 씁니다.
- 고령자, 외국인 등 텍스트만으로는 이해가 어려운 사용자를 돕거나, 도움말 흐름에서 단계별 사용법을 읽어 줄 때 적합합니다.
- 페이지 전체를 그대로 읽거나 화면 낭독기가 읽는 내용을 똑같이 반복하지 않습니다. 무엇을 할 수 있는지, 어떤 순서로 진행하는지처럼 꼭 필요한 내용만 요약합니다.
- 페이지 단위는 페이지 제목 근처에, 영역 단위는 해당 카드나 소제목 옆에 둡니다.
- 화면이 바뀔 때 자동으로 재생하지 않습니다. 사용자가 언제든 일시정지하고 정지할 수 있어야 합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `summary` **필수** | `string` | — | 음성으로 읽을 요약 텍스트입니다. |
| `locale` **필수** | `string` | — | 요약 텍스트의 언어입니다. 재생 요청에 함께 전달됩니다. |
| `state` **필수** | `'idle' \| 'playing' \| 'paused' \| 'error' \| 'unsupported'` | — | 현재 재생 상태입니다. `idle`, `playing`, `paused`, `error`, `unsupported` 중 하나이며 이에 따라 보이는 버튼과 상태 문구가 바뀝니다. `playing`과 `paused`에서는 일시정지·중지 버튼이 나타나고, `unsupported`이면 재생 버튼을 비활성화하고 이유를 보여 줍니다. |
| `onRequest` **필수** | `(detail: {action: 'play' \| 'pause' \| 'resume' \| 'stop'; summary: string; locale: string}) => void` | — | 사용자가 재생, 일시정지, 중지 버튼을 누를 때 불립니다. 일시정지 상태에서 재생 버튼을 누르면 `resume`을 받습니다. `action`(`play`, `pause`, `resume`, `stop`)과 `summary`, `locale`을 받습니다. |
| `label` **필수** | `string` | — | 버튼 이름의 앞부분입니다. 버튼은 '[레이블] 재생', '[레이블] 일시정지', '[레이블] 중지'로 표시되므로 무엇을 읽어 주는지 드러나게 씁니다. |
| `size` | `'xsmall' \| 'small' \| 'medium'` | `"small"` | 버튼 크기입니다. `xsmall`, `small`, `medium` 중 하나입니다. |
| `iconOnly` | `boolean` | `false` | `true`로 두면 레이블을 숨기고 아이콘만 보여 줍니다. `label`은 버튼의 접근 가능한 이름으로 계속 쓰입니다. |

속성 이름은 프레임워크 공통입니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 재생, 일시정지, 중지 버튼 사이로 초점을 옮깁니다. 비활성화된 버튼은 건너뜁니다. |
| `Enter` / `Space` | 초점이 있는 버튼을 실행합니다. |

## 접근성 {#accessibility}

- 재생 상태를 버튼 이름과 `role="status"` 문구('읽는 중', '일시정지' 등)로 전달합니다.
- 재생 중에는 일시정지와 중지 버튼을 항상 쓸 수 있습니다.
- `label`에는 동작과 목적이 드러나는 이름을 줍니다. 가능하면 레이블을 보이게 두고, `iconOnly`는 공간이 부족할 때만 씁니다.

## 알아 둘 점 {#notes}

- 이 컴포넌트는 소리를 직접 내지 않습니다. `onRequest`를 받아 `SpeechSynthesis`나 음성 서비스로 재생하고, 그 결과를 `state`로 다시 넘깁니다.
- `state`만 바꾼다고 재생이 시작되거나 멈추지 않습니다.
- 브라우저가 음성 재생을 지원하지 않으면 `state`를 `unsupported`로 넘깁니다.
- 페이지를 이동하거나 컴포넌트를 화면에서 제거할 때는 재생 중인 음성을 직접 정지합니다.

## 스타일링 {#styling}

`@unofficial-krds/styles/tts.css`를 가져옵니다. 각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `idle`, `playing`, `paused`, `error`, `unsupported` |
| `play` | `idle`, `playing`, `paused`, `error`, `unsupported` |
| `pause` | `playing`, `paused`, `unsupported` |
| `stop` | `idle`, `playing`, `paused`, `unsupported` |
| `label` | 없음 |
| `status` | `idle`, `playing`, `paused`, `error`, `unsupported` |

```css
[data-krds-component="tts"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_08_06.html)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
