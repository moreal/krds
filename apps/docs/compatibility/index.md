# 프레임워크 호환성 {#framework-compatibility}

프레임워크마다 패키지가 따로 있습니다. 앱에는 피어 의존성 범위 안의 프레임워크가 있어야 합니다. 패키지는 아직 npm에 게시하지 않았으므로 [설치하기](../getting-started/installation)를 따라 설치합니다.

| 프레임워크 | 패키지 | 피어 의존성 | 테스트한 버전 |
| --- | --- | --- | --- |
| React | `@unofficial-krds/react@0.1.0` | `react@^19.3.1`<br>`react-dom@^19.3.1` | `react@19.3.1`<br>`react-dom@19.3.1` |
| Solid 1 | `@unofficial-krds/solid@0.1.0` | `solid-js@^1.9.18` | `solid-js@1.9.18` |
| Svelte | `@unofficial-krds/svelte@0.1.0` | `svelte@^5.57.3` | `svelte@5.57.3` |
| Vue | `@unofficial-krds/vue@0.1.0` | `vue@^3.5.44` | `vue@3.5.44` |
| Lit | `@unofficial-krds/lit@0.1.0` | `lit@^3.3.3` | `lit@3.3.3` |
| Qwik | `@unofficial-krds/qwik@0.1.0` | `@builder.io/qwik@^1.20.3` | `@builder.io/qwik@1.20.3` |
| Angular | `@unofficial-krds/angular@0.1.0` | `@angular/common@^22.2.4`<br>`@angular/core@^22.2.4`<br>`@angular/forms@^22.2.4` | `@angular/common@22.2.4`<br>`@angular/core@22.2.4`<br>`@angular/forms@22.2.4` |
| Solid 2 · **미리보기** | `@unofficial-krds/solid-next@0.1.0-preview.0` | `@solidjs/web@2.0.0-rc.19`<br>`solid-js@2.0.0-rc.19` | `@solidjs/web@2.0.0-rc.19`<br>`solid-js@2.0.0-rc.19` |

Solid 2는 미리보기 단계입니다. `@unofficial-krds/solid-next`는 `Button`, `NativeSelect`, `Modal`, `Tabs`, `Calendar`, `DateInput`만 제공합니다.

## 프레임워크별 콘텐츠와 이벤트 {#native-content-and-event-transport}

속성 이름은 모든 프레임워크가 같습니다. 컴포넌트를 가져오는 형태, 콘텐츠를 넣는 방법, 콜백을 받는 방법은 프레임워크를 따릅니다. 아래 표는 [Modal](../components/modal)을 예로 듭니다.

| 프레임워크 | 가져오기 | 본문 | 동작 버튼 | 열림 변경 |
| --- | --- | --- | --- | --- |
| React | `import { Modal } from '@unofficial-krds/react/modal'` | `children` | `actions` 속성. `(close) => …` 함수도 받습니다 | `onOpenChange` |
| Solid 1 | `import { Modal } from '@unofficial-krds/solid/modal'` | `children` | `actions` 속성 | `onOpenChange` |
| Solid 2 | `import { Modal } from '@unofficial-krds/solid-next/modal'` | `children` | `actions` 속성 | `onOpenChange` |
| Vue | `import Modal from '@unofficial-krds/vue/modal'` | 기본 슬롯 | `#actions="{ close }"` 슬롯 | `@open-change` 또는 `v-model` |
| Svelte | `import Modal from '@unofficial-krds/svelte/modal'` | `children` snippet | `actions` snippet. 인자로 `{ close }`를 받습니다 | `onOpenChange` |
| Angular | `import { Modal } from '@unofficial-krds/angular/modal'`, 템플릿에서 `<krds-modal>` | 콘텐츠 투영 | `krdsModalActions` 속성을 붙인 요소 | `(openChange)` |
| Lit | `@unofficial-krds/lit/register`의 `registerKrdsElements(customElements)`를 호출한 뒤 `<krds-modal>` | 기본 슬롯 | `slot="actions"` 요소 | `open-change` 이벤트 |
| Qwik | `import { Modal } from '@unofficial-krds/qwik/modal'` | 자식 요소 | `actions` 속성 | `onOpenChange$` |

Vue와 Svelte는 컴포넌트 경로에서 default export로 가져옵니다. 패키지 루트에서는 모든 프레임워크가 이름으로 가져옵니다. 예: `import { Modal } from '@unofficial-krds/vue'`.

속성 표의 콜백 이름은 프레임워크마다 이렇게 바뀝니다.

- React, Solid, Svelte: 이름을 그대로 씁니다. 예: `onValueChange`.
- Qwik: 이름 끝에 `$`를 붙입니다. 예: `onValueChange$`.
- Vue: `on`을 떼고 kebab-case로 바꾼 이벤트입니다. 예: `@value-change`. `Checkbox`, `Switch`, `RadioGroup`, `NativeSelect`, `TextInput`, `Textarea`, `DateInput`, `RangeSlider`, `QuantityToggle`, `Calendar`, `Tabs`, `Disclosure`, `Modal`은 `v-model`도 받습니다.
- Angular: `on`을 떼고 첫 글자를 소문자로 바꾼 output입니다. 예: `(valueChange)`. Calendar의 확인과 취소만 `(confirmed)`, `(canceled)`입니다.
- Lit: `on`을 떼고 kebab-case로 바꾼 DOM 이벤트입니다. 예: `value-change`. 콜백 인자는 `event.detail`에 있고, 이벤트는 Shadow DOM 밖으로 버블링됩니다.

설정 객체 안의 콜백은 모든 프레임워크에서 객체의 함수로 넘깁니다. 예를 들어 [Pagination](../components/pagination)의 `loadMore.onLoadMore`가 그렇습니다. Qwik에서는 이 함수도 `$()`로 감쌉니다. 결과 값을 돌려줘야 하는 [Coach mark](../components/coach-mark)의 `onTargetAction`은 Lit에서도 프로퍼티로 넘깁니다.

Angular의 입력 컨트롤 9개(`NativeSelect`, `DateInput`, `TextInput`, `Textarea`, `Checkbox`, `Switch`, `RadioGroup`, `RangeSlider`, `QuantityToggle`)는 `ControlValueAccessor`를 구현합니다. `formControl`이나 `ngModel`로 연결합니다. 9개 모두 `@unofficial-krds/angular/forms`에서 한꺼번에 가져올 수 있습니다.

## 버전을 고를 때 {#package-and-browser-boundaries}

- Svelte는 5 버전만 지원합니다.
- Solid 1과 Solid 2는 패키지가 다릅니다. 한 앱에서 섞어 쓰지 않습니다.
- 피어 의존성 범위 안의 모든 버전을 테스트하지는 않았습니다. 표의 테스트한 버전이 가장 확실합니다.

[Solid 1 → 2](./solid-migration)
