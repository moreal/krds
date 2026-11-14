---
title: 'Coach mark'
---

# Coach mark {#coach-mark}

**코치마크** — 화면의 특정 요소를 짚어 가며 새 기능이나 사용법을 안내합니다.

## 사용법 {#usage}

- 과업의 단계를 순서대로 따라 하게 안내하거나, 화면에서 쓸 수 있는 기능을 훑어 보여 줄 때 씁니다.
- 사용자가 시작 버튼을 눌렀을 때만 실행합니다. 페이지를 열자마자 자동으로 띄우지 않습니다.
- 한 페이지에 4개 이하가 적당하고 전체는 15단계를 넘기지 않습니다. 제목은 한 줄, 안내문은 세 줄 이내로 씁니다.
- 코치마크가 떠 있는 동안에는 다른 알림이나 배너를 띄우지 않습니다. 안내문에 링크를 넣는다면 새 창으로 엽니다.
- 사용자가 직접 해 봐야 넘어가는 단계는 `requiresAction`과 `onTargetAction`으로 실제 수행 여부를 확인한 뒤 다음 단계로 넘깁니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 코치마크 표시 여부를 직접 제어할 때 넘깁니다. |
| `defaultOpen` | `boolean` | `false` | 직접 제어하지 않을 때의 초기 표시 여부입니다. |
| `onOpenChange` | `(detail: OpenChangeDetails) => void` | — | 사용자가 코치마크를 닫으려 할 때 불리며 `{open}`을 받습니다. |
| `onTargetAction` | `(detail: CoachMarkTargetActionDetails) => boolean \| Promise<boolean>` | — | `requiresAction` 단계의 대상을 사용자가 실제로 조작한 뒤 불리며 `{stepId, targetId}`를 받습니다. `true`(또는 `true`로 끝나는 `Promise`)를 돌려줄 때만 다음 단계로 넘어갑니다. `requiresAction` 단계가 있는데 이 속성이 없으면 `TypeError`가 납니다. |
| `steps` **필수** | `readonly CoachMarkStep[]` | — | 안내 단계 목록입니다. 각 단계는 `id`, 강조할 요소의 `targetId`, `title`, `instruction`을 가지며, `requiresAction`을 `true`로 두면 사용자가 대상을 조작해야 넘어갑니다. |
| `boundaries` **필수** | `readonly CoachMarkBoundary[]` | — | 단계의 대상마다 팝오버를 넣을 자리를 알려 주는 목록입니다. `targetId`와, 그 대상 바로 뒤에 둔 빈 요소의 `id`인 `insertionBoundaryId`를 짝지어 넘깁니다. |
| `stepId` | `string` | — | 현재 단계를 직접 제어할 때 넘기는 단계 `id`입니다. |
| `defaultStepId` | `string` | — | 직접 제어하지 않을 때 처음 보여 줄 단계의 `id`입니다. |
| `onStepChange` | `(detail: {id: string; reason: 'previous' \| 'next' \| 'target-action'}) => void` | — | 단계가 바뀌려 할 때 불리며 `{id, reason}`을 받습니다. `reason`은 `previous`, `next`, `target-action` 가운데 하나입니다. |
| `onStop` | `(detail: TutorialStopDetails) => void` | — | 따라하기 패널과 함께 쓸 때 안내가 중단되거나 끝나면 불립니다. `reason`(`stop`, `finish`, `target-removed`, `route-change`)과, 돌아갈 패널 정보를 담은 `returnTo`를 받습니다. |
| `startActionId` **필수** | `string` | — | 따라하기를 시작하는 버튼의 `id`입니다. 코치마크를 닫으면 이 버튼으로 초점을 돌려줍니다. |
| `fallbackFocusId` | `string` | — | 시작 버튼이 사라졌거나 쓸 수 없을 때 대신 초점을 받을 요소의 `id`입니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface CoachMarkContract extends ControlledOpen {
    onTargetAction?: (detail: CoachMarkTargetActionDetails) => boolean | Promise<boolean>;
    steps: readonly CoachMarkStep[];
    boundaries: readonly CoachMarkBoundary[];
    stepId?: string;
    defaultStepId?: string;
    onStepChange?: (detail: {
        id: string;
        reason: 'previous' | 'next' | 'target-action';
    }) => void;
    onStop?: (detail: TutorialStopDetails) => void;
    startActionId: string;
    fallbackFocusId?: string;
}

export interface ControlledOpen {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails) => void;
}

export interface OpenChangeDetails {
    open: boolean;
}

export interface CoachMarkTargetActionDetails {
    stepId: string;
    targetId: string;
}

export interface CoachMarkStep {
    id: string;
    targetId: string;
    title: string;
    instruction: string;
    requiresAction?: boolean;
}

/** The host registers a native insertion location immediately after the real target. */
export interface CoachMarkBoundary {
    targetId: string;
    insertionBoundaryId: string;
}

export interface TutorialStopDetails {
    reason: 'stop' | 'finish' | 'target-removed' | 'route-change';
    running: false;
    returnTo: {
        panel: 'tutorial';
        open: true;
        startActionId: string;
    };
}
```

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 강조된 대상과 팝오버 안의 버튼을 읽는 순서대로 이동합니다. |
| `Enter` / `Space` | 초점이 있는 그만보기, 이전, 다음 버튼을 실행합니다. |
| `Esc` | 안내를 중단하고 시작 버튼으로 초점을 돌려줍니다. 한글 조합 중에는 동작하지 않습니다. |

## 접근성 {#accessibility}

- 팝오버를 대상 요소 바로 뒤에 넣어, 화면 낭독기가 대상 다음에 안내를 읽습니다. 그러려면 `boundaries`에 넘기는 요소를 실제 대상 바로 뒤에 둬야 합니다.
- 단계가 바뀌면 팝오버 제목으로 초점을 옮깁니다.
- 대상을 둘러싸는 스포트라이트는 장식이며 화면 낭독기가 읽지 않습니다.
- 안내 중에도 대상 요소는 그대로 조작할 수 있습니다. 입력 중인 값과 초점도 유지됩니다.
- 스타일을 바꿀 때는 스포트라이트와 주변 배경의 명도 대비를 3:1 이상으로 유지합니다.

## 알아 둘 점 {#notes}

- 버튼은 왼쪽부터 그만보기, 이전, 다음 순서입니다. 첫 단계에는 이전이 없고, 마지막 단계의 다음은 마치기, 단계가 하나뿐이면 확인으로 바뀝니다.
- 팝오버는 화면 밖으로 나가거나 대상을 가리지 않게 위치를 조정하고, 대상이 스크롤되거나 크기가 바뀌면 따라 움직입니다.
- 대상 요소를 찾지 못하면 팝오버를 띄우지 않고 중단 수단만 보여 줍니다.
- `onTargetAction`의 결과가 도착하기 전에 닫히거나 단계가 바뀌면 그 결과는 무시됩니다.
- 동작 줄이기 설정에서는 스포트라이트 애니메이션과 부드러운 스크롤을 끕니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `open`, `closed`, `current-step`, `waiting`, `missing-target` |
| `spotlight` | `open`, `closed`, `current-step` |
| `popover` | `open`, `closed`, `current-step`, `waiting`, `missing-target` |
| `title` | 없음 |
| `instruction` | 없음 |
| `position` | `current-step` |
| `actions` | 없음 |
| `stop` | 없음 |
| `previous` | `current-step` |
| `next` | `current-step` |

```css
[data-krds-component="coach-mark"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_08_04.html)
- [상세 명세](/sources/specs/components/coach-mark.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
