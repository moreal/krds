---
title: 'Tutorial panel'
---

# Tutorial panel {#tutorial-panel}

**따라하기 패널** — 작업을 단계별로 따라 할 수 있게 옆 패널에서 안내합니다.

## 사용법 {#usage}

- 여러 세부 단계를 거치거나 복잡한 입력이 필요한 과업을, 화면을 따라가며 단계별로 안내할 때 씁니다.
- 안내할 내용이 간단하면 맥락적 도움말을 씁니다.
- 열기 버튼과 패널은 본문 바로 다음에 둡니다.
- 사용자가 스크롤하지 않고 훑어볼 수 있도록 내용을 간결하게 씁니다. 패널 안의 링크는 새 창으로 엽니다.
- 사용자가 중단하기 버튼을 누르기 전에는 따라하기를 끝내거나 내용을 바꾸지 않습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 패널이 열려 있는지 여부입니다. 지정하면 열림 상태를 직접 관리하는 제어 방식이 되며 `defaultOpen`과 함께 쓰지 않습니다. |
| `defaultOpen` | `boolean` | `true` | 처음에 패널을 열어 둘지 정합니다. 처음 한 번만 읽습니다. |
| `onOpenChange` | `(detail: OpenChangeDetails) => void` | — | 사용자가 패널을 열거나 닫으려 할 때 불리며 새 상태를 `open`으로 받습니다. |
| `onStart` | `(detail: TutorialStartDetails) => void` | — | 사용자가 시작 버튼을 누를 때 한 번 불립니다. 시작할 과업과 단계를 `taskId`, `stepId`로 받습니다. 이미 진행 중이거나 시작할 수 있는 과업이 없으면 불리지 않습니다. |
| `tasks` **필수** | `readonly {id: string; title: string; steps: readonly TutorialStep[]}[]` | — | 안내할 과업 목록입니다. 과업마다 `id`, `title`, `steps`를 주고, 각 단계에는 `id`, `title`, 안내 대상 요소를 가리키는 `targetId`, 안내 문구인 `instruction`을 담습니다. |
| `activeTaskId` **필수** | `string \| null` | — | 현재 선택된 과업의 `id`입니다. `activeStepId`와 함께 주면 패널이 그 과업만 보여 주고 개요로 돌아가는 버튼을 표시합니다. `null`이면 모든 과업을 나열한 개요를 보여 줍니다. |
| `activeStepId` **필수** | `string \| null` | — | 현재 진행 중인 단계의 `id`입니다. 없으면 `null`을 줍니다. |
| `running` | `boolean` | — | 따라하기가 진행 중인지 여부입니다. 지정하면 직접 관리하는 제어 방식이 되며 `defaultRunning`과 함께 쓰지 않습니다. |
| `defaultRunning` | `boolean` | `false` | 처음부터 따라하기를 진행 중인 상태로 둘지 정합니다. 처음 한 번만 읽습니다. |
| `activePanel` | `'help' \| 'tutorial'` | — | 도움(`help`)과 따라하기(`tutorial`) 탭 중 선택된 탭입니다. 지정하면 직접 관리하는 제어 방식이 됩니다. |
| `defaultActivePanel` | `'help' \| 'tutorial'` | — | 처음 선택할 탭입니다. `help` 또는 `tutorial`이며 처음 한 번만 읽습니다. |
| `onTaskChange` | `(detail: {id: string \| null}) => void` | — | 사용자가 과업을 고르거나 개요로 돌아가려 할 때 불립니다. 선택할 과업의 `id`를 받으며, 개요로 돌아갈 때는 `null`을 받습니다. |
| `onStepChange` | `(detail: {id: string \| null}) => void` | — | 사용자가 단계를 고를 때 불리며 선택할 단계의 `id`를 받습니다. |
| `onActivePanelChange` | `(detail: ValueChangeDetails<'help' \| 'tutorial'>) => void` | — | 사용자가 도움·따라하기 탭을 전환하려 할 때 불리며 새 탭을 `value`로 받습니다. |
| `onStop` | `(detail: TutorialStopDetails) => void` | — | 사용자가 중단하기 버튼을 누를 때 한 번 불립니다. 중단 이유인 `reason`, `running: false`, 그리고 돌아갈 위치를 담은 `returnTo`(따라하기 탭, 패널 열림, `startActionId`)를 받습니다. |
| `startActionId` **필수** | `string` | — | 시작 버튼의 `id`입니다. 따라하기를 중단하면 초점이 이 버튼으로 돌아갑니다. |
| `fallbackFocusId` | `string` | — | 중단한 뒤 시작 버튼이 화면에 없거나 쓸 수 없을 때 대신 초점을 받을 요소의 `id`입니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

```ts
export interface TutorialPanelContract extends ControlledOpen {
    onStart?: (detail: TutorialStartDetails) => void;
    tasks: readonly {
        id: string;
        title: string;
        steps: readonly TutorialStep[];
    }[];
    activeTaskId: string | null;
    activeStepId: string | null;
    running?: boolean;
    defaultRunning?: boolean;
    activePanel?: 'help' | 'tutorial';
    defaultActivePanel?: 'help' | 'tutorial';
    onTaskChange?: (detail: {
        id: string | null;
    }) => void;
    onStepChange?: (detail: {
        id: string | null;
    }) => void;
    onActivePanelChange?: (detail: ValueChangeDetails<'help' | 'tutorial'>) => void;
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

export interface TutorialStartDetails {
    taskId: string;
    stepId: string;
}

export interface TutorialStep {
    id: string;
    title: string;
    targetId: string;
    instruction: string;
}

export interface ValueChangeDetails<T> {
    value: T;
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
| `Enter` / `Space` | 열기 버튼에서는 패널을 열고 초점을 패널로 옮깁니다. 닫기 버튼에서는 패널을 닫고 초점을 열기 버튼으로 돌려보냅니다. |
| `Enter` / `Space` | 과업 제목 버튼에서는 세부 단계 목록을 펼치거나 접습니다. 초점은 그 버튼에 남습니다. |
| `Tab` / `Shift+Tab` | 패널 안의 버튼과 링크를 차례로 이동합니다. 넓은 화면에서는 초점이 패널 밖으로 자유롭게 나갑니다. |

## 접근성 {#accessibility}

- 패널이 열리면 초점이 패널 자체로 이동하고, 닫으면 열기 버튼으로 돌아갑니다.
- 따라하기를 중단하면 초점이 시작 버튼(`startActionId`)으로 돌아갑니다. 시작 버튼을 쓸 수 없으면 `fallbackFocusId`, 그다음 패널 열기 버튼 순으로 대신합니다.
- 좁은 화면에서 모달로 열렸을 때는 초점이 모달 안에 머뭅니다. 중단한 뒤에도 모달이 열려 있으면 초점은 모달 밖으로 나가지 않습니다.
- 세부 단계의 제목은 화면에 표시되는 코치마크의 제목과 같게 씁니다.
- 한글 조합 중에 누른 `Enter`는 과업 완료로 처리하지 않습니다.

## 알아 둘 점 {#notes}

- 화면이 좁으면 패널은 열기 버튼으로 줄어들고, 버튼을 누르면 모달로 열립니다. 화면 크기가 바뀌어도 진행 상태는 유지됩니다.
- 패널을 닫거나 접거나 도움 탭으로 전환해도 진행 중인 과업과 단계는 유지됩니다. 따라하기는 중단하기 버튼으로만 끝납니다.
- `open`, `running`, `activePanel`은 각각 따로 제어하거나 기본값에 맡길 수 있습니다. 같은 항목에 제어 값과 기본값을 함께 주지 않습니다.
- `activeTaskId`와 `activeStepId`는 항상 직접 관리합니다. `onStart`, `onTaskChange`, `onStepChange`에서 받은 값을 반영해 다시 넘깁니다.
- `running`을 제어하는 경우, `onStart`나 `onStop`을 받고도 값을 바꾸지 않으면 화면과 초점은 그대로 유지됩니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `open`, `closed`, `running`, `idle`, `active-step` |
| `opener` | `open`, `closed` |
| `header` | 없음 |
| `tabs` | `running`, `idle` |
| `tab` | `selected` |
| `close` | 없음 |
| `title` | 없음 |
| `back` | 없음 |
| `start` | 없음 |
| `task-list` | 없음 |
| `task` | `active-step` |
| `task-toggle` | 없음 |
| `step-list` | `active-step` |
| `step` | `current` |
| `stop` | `running`, `idle` |

```css
[data-krds-component="tutorial-panel"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_08_02.html)
- [상세 명세](/sources/specs/components/tutorial-panel.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
