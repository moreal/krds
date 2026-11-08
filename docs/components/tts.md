---
title: 'TTS'
---

# TTS {#tts}

음성지원 · `TTS`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_08_06.html) · [전체 명세](/sources/specs/components/tts.md.txt) · [프레임워크 지원](../compatibility/README.md)

## 네이티브 지원 현황 {#native-availability}

상태는 기록된 커버리지 기준입니다. [상태의 의미](../compatibility/README.md#what-the-evidence-means)를 참고하세요.

| 프레임워크 | 패키지 버전 | 상태 | 예제 |
| --- | --- | --- | --- |
| react | `0.1.0` | planned | [react 예제](../compatibility/README.mdexamples#react) |
| solid | `0.1.0` | planned | [solid 예제](../compatibility/README.mdexamples#solid) |
| svelte | `0.1.0` | planned | [svelte 예제](../compatibility/README.mdexamples#svelte) |
| vue | `0.1.0` | planned | [vue 예제](../compatibility/README.mdexamples#vue) |
| lit | `0.1.0` | planned | [lit 예제](../compatibility/README.mdexamples#lit) |
| qwik | `0.1.0` | planned | [qwik 예제](../compatibility/README.mdexamples#qwik) |
| angular | `0.1.0` | planned | [angular 예제](../compatibility/README.mdexamples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [solid-next 예제](../compatibility/README.mdexamples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

모든 프레임워크가 공유하는 의미 계약입니다. 콜백 이름과 detail 타입은 그대로 씁니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 선택 속성의 기본값은 자동으로 채워지지 않으므로 아래 안내의 명시적 기본값을 씁니다.

```ts
export interface TTSContract {
    summary: string;
    locale: string;
    state: 'idle' | 'playing' | 'paused' | 'error' | 'unsupported';
    onRequest: (detail: {
        action: 'play' | 'pause' | 'resume' | 'stop';
        summary: string;
        locale: string;
    }) => void;
    label: string;
    size?: 'xsmall' | 'small' | 'medium';
    iconOnly?: boolean;
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `summary` | 예 | `string` | 데이터 / 상태 |
| `locale` | 예 | `string` | 데이터 / 상태 |
| `state` | 예 | `'idle' \| 'playing' \| 'paused' \| 'error' \| 'unsupported'` | 데이터 / 상태 |
| `onRequest` | 예 | `(detail: {action: 'play' \| 'pause' \| 'resume' \| 'stop'; summary: string; locale: string}) => void` | 이벤트 |
| `label` | 예 | `string` | 데이터 / 상태 |
| `size` | 아니요 | `'xsmall' \| 'small' \| 'medium'` | 데이터 / 상태 |
| `iconOnly` | 아니요 | `boolean` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

이름이 있는 음성 시작 버튼을 페이지 제목이나 영역 옆에 두고, 명시적인 일시정지/정지 컨트롤을 함께 둡니다. 페이지 전체 텍스트를 무분별하게 읽거나 스크린 리더와 중복하지 않고, 간결한 목적/흐름 요약을 읽습니다. 마운트/내비게이션 시 자동 재생은 없습니다.

### 의미 API {#plain-semantic-api}

독립 API: summary, locale, state=idle|playing|paused|error, onRequest({action:play|pause|resume|stop,summary,locale}), label, size=small, iconOnly=false. 상태는 호스트가 확인합니다. 컴포넌트는 prop 변경으로 음성 엔진을 호출하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어 값과 기본값을 함께 주거나 mode를 바꾸는 것은 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 요청을 한 번 내보냅니다. disabled, no-op, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI/초점 상태를 유지하고, 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하며 제어 prop이 계속 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

네이티브 버튼은 Enter/Space/click에 한 번 동작합니다. 재생 중에는 일시정지와 정지를 항상 쓸 수 있습니다. 상태는 경쟁하는 자동 음성/라이브 알림 없이 텍스트와 컨트롤 이름으로 노출합니다. 독립 정책: 지원되지 않으면 재생을 비활성화하고 이유를 보여 줍니다. 정리 시에는 호스트 수명 주기를 통해 라우트 이동/언마운트에서 정지 요청을 냅니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

보이는 레이블을 권장합니다. 아이콘 전용은 기능적인 접근 가능한 이름을 가집니다. 좁은 화면에서도 페이지/영역 배치는 올바른 요약에 붙어 있어야 합니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없으며 컨트롤은 type=button입니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

통합 완료에는 네이티브 컨트롤, 문서화된 호스트 드라이버 경계, play/pause/stop/error를 지원하는 명시적 로컬 목(mock)이 포함됩니다. SpeechSynthesis/서비스, 음성, 동의/런타임 지원, 실제 오디오는 호스트가 소유합니다. 스토리에 네트워크나 실제 음성은 필요하지 않습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, play, pause, stop, label, status; idle,playing,paused,error,unsupported.

렌더링되는 모든 소유 파트는 `data-krds-component="tts"`, 하나의 `data-krds-part` 토큰, 공백으로 구분한 `data-krds-state` 집합을 가집니다. 네이티브/ARIA 상태가 기준입니다. 위의 파트/상태 어휘는 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `page`, `region`, `play`, `icon`, `xsmall`, `small`, `medium`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-42) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_08_06.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
