# 설치하기 {#로컬에서-시작하기}

Unofficial KRDS는 KRDS를 React, Vue, Svelte, Angular, Lit, Qwik, Solid 컴포넌트로 구현한 비공식 프로젝트입니다. 공식 KRDS가 아닙니다.

패키지는 아직 npm에 게시하지 않았습니다. 저장소에서 패키지를 빌드하고 tarball로 묶어 앱에 설치합니다.

## 패키지 빌드하기 {#도구와-의존성-설치}

Node 24.18.0이 필요합니다. Yarn 4.14.1은 저장소에 들어 있으므로 따로 설치하지 않습니다.

[저장소](https://github.com/moreal/krds)를 내려받고 루트에서 다음 명령을 실행합니다. 이 예시는 React 패키지를 빌드합니다.

```sh
node tools/yarn.mjs install --immutable
node tools/yarn.mjs nx run krds-react:build
```

`react` 자리에 `vue`, `svelte`, `angular`, `lit`, `qwik`, `solid`, `solid-next` 중 하나를 넣습니다. 공유 패키지 `contracts`, `tokens`, `styles`도 함께 빌드됩니다.

## 앱에 설치하기 {#로컬-패키지-파일-검사}

프레임워크 패키지와 공유 패키지 세 개를 tarball로 묶습니다. 저장소 루트에서 실행합니다.

```sh
mkdir -p /tmp/krds
for name in contracts tokens styles react; do
	node tools/yarn.mjs workspace @unofficial-krds/$name pack --out /tmp/krds/$name.tgz
done
```

앱 디렉터리에서 네 파일을 한 번에 설치합니다. npm 예시입니다.

```sh
npm install /tmp/krds/contracts.tgz /tmp/krds/tokens.tgz /tmp/krds/styles.tgz /tmp/krds/react.tgz
```

앱에는 프레임워크 런타임도 있어야 합니다. 필요한 버전은 [프레임워크 호환성](../compatibility/)의 피어 의존성 열에 있습니다.

## CSS 가져오기 {#import-css}

쓰는 컴포넌트마다 CSS 파일을 가져옵니다. 파일 이름은 컴포넌트 페이지 맨 위에 있습니다.

```ts
import '@unofficial-krds/styles/button.css';
import '@unofficial-krds/styles/switch.css';
```

컴포넌트를 많이 쓰면 `@unofficial-krds/styles/all.css` 하나만 가져옵니다. 개별 파일과 `all.css`를 함께 가져오지 않습니다.

`@unofficial-krds/styles/reset.css`는 KRDS가 전제하는 루트 글자 크기(62.5%)를 포함한 전역 스타일입니다. 새 앱이면 함께 가져옵니다. 기존 앱이면 [CSS, 토큰, 선택형 글꼴](./styling)을 먼저 읽습니다.

Lit은 컴포넌트 CSS가 각 요소의 Shadow DOM에 이미 들어 있습니다. 문서에 `@unofficial-krds/tokens/tokens.css`만 한 번 가져옵니다.

## 첫 컴포넌트 렌더링하기 {#vue-컴포넌트로-첫-화면-만들기}

[Toggle switch](../components/switch)를 켜야 [Button](../components/button)을 누를 수 있는 예시입니다. 컴포넌트는 `@unofficial-krds/<프레임워크>/<컴포넌트 id>` 경로에서 가져옵니다.

**React**

```tsx
import { useState } from 'react';
import { Button } from '@unofficial-krds/react/button';
import { Switch } from '@unofficial-krds/react/switch';
import '@unofficial-krds/styles/button.css';
import '@unofficial-krds/styles/switch.css';

export function Notifications() {
	const [enabled, setEnabled] = useState(false);
	return (
		<>
			<Switch label="알림 받기" checked={enabled} onCheckedChange={({ checked }) => setEnabled(checked)} />
			<Button disabled={!enabled}>계속하기</Button>
		</>
	);
}
```

**Vue**. Vue와 Svelte는 컴포넌트 경로에서 default export로 가져옵니다.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import Button from '@unofficial-krds/vue/button';
import Switch from '@unofficial-krds/vue/switch';
import '@unofficial-krds/styles/button.css';
import '@unofficial-krds/styles/switch.css';

const enabled = ref(false);
</script>

<template>
	<Switch label="알림 받기" v-model="enabled" />
	<Button :disabled="!enabled">계속하기</Button>
</template>
```

**Svelte**

```svelte
<script lang="ts">
	import Button from '@unofficial-krds/svelte/button';
	import Switch from '@unofficial-krds/svelte/switch';
	import '@unofficial-krds/styles/button.css';
	import '@unofficial-krds/styles/switch.css';

	let enabled = $state(false);
</script>

<Switch label="알림 받기" checked={enabled} onCheckedChange={({ checked }) => (enabled = checked)} />
<Button disabled={!enabled}>계속하기</Button>
```

**Angular**. Button은 네이티브 `<button>`에 붙이는 `krdsButton` 속성입니다. CSS는 앱의 `styles.css`에서 `@import`로 가져옵니다.

```ts
import { Component, signal } from '@angular/core';
import { Button } from '@unofficial-krds/angular/button';
import { Switch } from '@unofficial-krds/angular/switch';

@Component({
	selector: 'app-notifications',
	imports: [Button, Switch],
	template: `
		<krds-switch label="알림 받기" [checked]="enabled()" (checkedChange)="enabled.set($event.checked)" />
		<button krdsButton type="button" [disabled]="!enabled()">계속하기</button>
	`,
})
export class Notifications {
	readonly enabled = signal(false);
}
```

**Lit**. 요소를 쓰기 전에 `registerKrdsElements`로 한 번 등록합니다. 이벤트 값은 `event.detail`에 있습니다.

```ts
import '@unofficial-krds/tokens/tokens.css';
import { registerKrdsElements } from '@unofficial-krds/lit/register';

registerKrdsElements(customElements);

const toggle = document.querySelector('krds-switch')!;
const button = document.querySelector('krds-button')!;
toggle.addEventListener('checked-change', event => {
	button.disabled = !(event as CustomEvent<{ checked: boolean }>).detail.checked;
});
```

```html
<krds-switch label="알림 받기"></krds-switch>
<krds-button disabled>계속하기</krds-button>
```

**Qwik**. 콜백 이름 끝에 `$`가 붙습니다.

```tsx
import { component$, useSignal } from '@builder.io/qwik';
import { Button } from '@unofficial-krds/qwik/button';
import { Switch } from '@unofficial-krds/qwik/switch';
import '@unofficial-krds/styles/button.css';
import '@unofficial-krds/styles/switch.css';

export const Notifications = component$(() => {
	const enabled = useSignal(false);
	return (
		<>
			<Switch label="알림 받기" checked={enabled.value} onCheckedChange$={({ checked }) => { enabled.value = checked; }} />
			<Button disabled={!enabled.value}>계속하기</Button>
		</>
	);
});
```

**Solid**

```tsx
import { createSignal } from 'solid-js';
import { Button } from '@unofficial-krds/solid/button';
import { Switch } from '@unofficial-krds/solid/switch';
import '@unofficial-krds/styles/button.css';
import '@unofficial-krds/styles/switch.css';

export function Notifications() {
	const [enabled, setEnabled] = createSignal(false);
	return (
		<>
			<Switch label="알림 받기" checked={enabled()} onCheckedChange={({ checked }) => setEnabled(checked)} />
			<Button disabled={!enabled()}>계속하기</Button>
		</>
	);
}
```

Solid 2 미리보기 패키지 `@unofficial-krds/solid-next`에는 Toggle switch가 없습니다. 제공하는 컴포넌트는 [프레임워크 호환성](../compatibility/)에 있습니다.

프레임워크마다 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크별 콘텐츠와 이벤트](../compatibility/#native-content-and-event-transport)에 정리되어 있습니다.

## 로케일 바꾸기 {#set-the-locale}

기본 로케일은 `ko-KR`, 글 방향은 `ltr`입니다. 영어(`en-US`)나 오른쪽에서 왼쪽(`rtl`)이 필요하면 다음과 같이 지정합니다.

| 프레임워크 | 지정 방법 |
| --- | --- |
| React, Vue, Svelte, Qwik, Solid | 앱을 `<KrdsProvider locale="en-US">`로 감쌉니다. `KrdsProvider`는 패키지 루트에서 가져옵니다. |
| Angular | `providers`에 `provideKrds({ locale: 'en-US' })`를 넣습니다. |
| Lit | 요소마다 `locale="en-US"`와 `dir="rtl"` 속성을 씁니다. |

```tsx
import { KrdsProvider } from '@unofficial-krds/react';

<KrdsProvider locale="en-US" direction="ltr">
	<App />
</KrdsProvider>;
```

날짜 값과 문서 지정은 [로케일과 날짜 값](./locale-dates)에 있습니다. 컴포넌트별 속성과 키보드 동작은 [컴포넌트 목록](../components/)에서 찾습니다.
