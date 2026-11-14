---
title: 'Back button'
---

# Back button {#back-button}

**뒤로가기 버튼** — 이전 화면으로 돌아가게 합니다.

## 사용법 {#usage}

- 이전 화면이나 상위 화면으로 돌아가는 버튼이 필요할 때 씁니다. 상단 바 왼쪽, 화면 제목 옆에 둡니다.
- 닫기나 취소 용도로 쓰지 않습니다. 사용자가 눌렀을 때 어디로 갈지 예측할 수 있어야 합니다.
- 작성 중인 내용이 사라질 수 있으면 `dirty`와 `requestConfirmation`으로 이동 전에 반드시 경고합니다.
- 브라우저나 기기의 뒤로가기와 같은 결과가 되도록 맞춥니다. 한쪽은 팝업을 닫고 다른 쪽은 페이지를 떠나는 식으로 달라지면 안 됩니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` | `string` | `"뒤로가기"` | 버튼의 이름입니다. |
| `canGoBack` **필수** | `boolean` | — | 돌아갈 앱 내 이전 화면이 있는지 알려 줍니다. `false`이면 이력을 거슬러 가지 않고 `fallbackHref`를 씁니다. |
| `fallbackHref` | `string` | — | 돌아갈 이전 화면이 없을 때 이동할 상위 화면의 주소입니다. |
| `dirty` | `boolean` | `false` | 저장하지 않은 입력이 있는지 알려 줍니다. `true`이면 이동하기 전에 `requestConfirmation`으로 확인을 받습니다. |
| `onBackRequest` **필수** | `(detail: {reason: 'activate' \| 'confirmed'}) => void` | — | 뒤로 가야 할 때 한 번 불립니다. 여기서 실제 화면 이동을 처리합니다. `reason`은 바로 누른 경우 `activate`, 확인을 거친 경우 `confirmed`입니다. |
| `requestConfirmation` | `() => boolean \| Promise<boolean>` | — | `dirty`일 때 버튼을 누르면 불립니다. 확인 창을 띄운 뒤 계속 진행하려면 `true`, 머물려면 `false`를 돌려줍니다. `Promise`도 돌려줄 수 있습니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface BackButtonContract {
    label?: string;
    canGoBack: boolean;
    fallbackHref?: string;
    dirty?: boolean;
    onBackRequest: (detail: {
        reason: 'activate' | 'confirmed';
    }) => void;
    requestConfirmation?: () => boolean | Promise<boolean>;
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Enter` / `Space` | 뒤로가기를 요청합니다. 저장하지 않은 입력이 있으면 먼저 확인을 받습니다. |

## 접근성 {#accessibility}

- 실제 `button`으로 제공되며 `label`이 접근 가능한 이름이 됩니다.
- 확인을 취소하면 페이지, 입력 값, 초점이 그대로 유지됩니다.
- 이동한 뒤 새 화면의 어디에 초점을 둘지는 화면 이동을 처리하는 쪽에서 정합니다.
- 좁은 화면에서도 누르기 충분한 크기를 유지하고, 기기의 안전 영역과 겹치지 않게 배치합니다.

## 알아 둘 점 {#notes}

- 이 버튼은 화면을 직접 이동시키지 않습니다. 라우터 이동, 브라우저 뒤로가기 처리, 입력 손실 경고는 `onBackRequest`와 `requestConfirmation`에서 구현합니다.
- 폼 안에 두어도 폼을 제출하거나 초기화하지 않습니다.
- `dirty`는 한글처럼 조합 중인 입력까지 반영해서 계산합니다. 조합 중인 글자가 이동 때문에 사라지면 안 됩니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `disabled`, `pending-confirmation` |
| `icon` | 없음 |
| `label` | 없음 |

```css
[data-krds-component="back-button"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_12_02.html)
- [상세 명세](/sources/specs/components/back-button.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
