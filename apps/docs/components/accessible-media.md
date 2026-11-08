---
title: 'Accessible multimedia'
---

# Accessible multimedia {#accessible-multimedia}

접근 가능한 미디어 · `AccessibleMedia`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_11_01.html) · [전체 명세](/sources/specs/components/accessible-media.md.txt) · [프레임워크 지원](../compatibility/)

## 네이티브 지원 현황 {#native-availability}

상태는 기록된 커버리지 기준입니다. [상태의 의미](../compatibility/#what-the-evidence-means)를 참고하세요.

| 프레임워크 | 패키지 버전 | 상태 | 예제 |
| --- | --- | --- | --- |
| react | `0.1.0` | planned | [react 예제](../compatibility/examples#react) |
| solid | `0.1.0` | planned | [solid 예제](../compatibility/examples#solid) |
| svelte | `0.1.0` | planned | [svelte 예제](../compatibility/examples#svelte) |
| vue | `0.1.0` | planned | [vue 예제](../compatibility/examples#vue) |
| lit | `0.1.0` | planned | [lit 예제](../compatibility/examples#lit) |
| qwik | `0.1.0` | planned | [qwik 예제](../compatibility/examples#qwik) |
| angular | `0.1.0` | planned | [angular 예제](../compatibility/examples#angular) |
| solid-next (미리보기) | `0.1.0-preview.0` | planned | [solid-next 예제](../compatibility/examples#solid-next) |

## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}

모든 프레임워크가 공유하는 의미 계약입니다. 콜백 이름과 detail 타입은 그대로 씁니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 선택 속성의 기본값은 자동으로 채워지지 않으므로 아래 안내의 명시적 기본값을 씁니다.

```ts
export interface AccessibleMediaContract {
    media: {
        kind: 'audio' | 'silent-video' | 'multimedia';
        src: string;
        type: string;
        poster?: string;
    };
    captionTracks?: readonly {
        src: string;
        lang: string;
        label: string;
    }[];
    transcript: {
        content: string;
        href?: never;
    } | {
        href: string;
        content?: never;
    };
    descriptionTrack?: {
        src: string;
        lang: string;
        label: string;
    };
    signLanguageSource?: string;
    title: string;
    controls?: true;
    autoplay?: false;
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `media` | 예 | `{kind: 'audio' \| 'silent-video' \| 'multimedia'; src: string; type: string; poster?: string}` | 데이터 / 상태 |
| `captionTracks` | 아니요 | `readonly {src: string; lang: string; label: string}[]` | 데이터 / 상태 |
| `transcript` | 예 | `{content: string; href?: never} \| {href: string; content?: never}` | 데이터 / 상태 |
| `descriptionTrack` | 아니요 | `{src: string; lang: string; label: string}` | 데이터 / 상태 |
| `signLanguageSource` | 아니요 | `string` | 데이터 / 상태 |
| `title` | 예 | `string` | 데이터 / 상태 |
| `controls` | 아니요 | `true` | 데이터 / 상태 |
| `autoplay` | 아니요 | `false` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

시맨틱 오디오/비디오와, 인접한 레이블 있는 대체 정보 영역·링크로 구성합니다. 오디오는 캡션 또는 단순 원고가 필요합니다. 소리 없는 시각 비디오는 화면 해설 또는 설명적 원고가 필요합니다. 시청각 콘텐츠는 복잡도에 따라 대체 정보를 복합 제공해야 합니다. 캡션은 의미 있는 발화·소리·화자를 동기화해 표시하며 번역 자막만으로는 부족합니다.

### 의미 API {#plain-semantic-api}

독립 API: media {kind,src,type,poster?}, captionTracks {src,lang,label}[], transcript {content|href}, descriptionTrack?, signLanguageSource?, title. 네이티브 controls=true, autoplay=false를 제안합니다. 원고 슬롯만으로 임의의 미디어가 접근 가능해진다고 주장하지 않습니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 정의된 value/open은 제어 모드이고 undefined는 비제어 모드입니다. 제어 prop과 기본값을 함께 주거나 모드를 바꾸면 잘못된 구성입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 시맨틱 변경 요청을 한 번 내보냅니다. 비활성, 변화 없음, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 모드에서 거부되면 커밋된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드로 렌더러·머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

네이티브 미디어 키보드 컨트롤이 초점을 유지합니다. 대체 원고 링크·버튼은 표준 시맨틱을 씁니다. 접근할 수 없는 사용자 정의 플레이어 단축키를 도입하지 않습니다. 화면 해설 트랙 전환을 제공한다면 상태를 명시하며 자동 재생하지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

캡션은 가려지지 않고 충분한 대비로 읽을 수 있으며 동기화되어야 합니다. 플레이어가 지원하면 캡션 사용자 설정을 허용합니다. 로컬 반응형 비디오는 의미 있는 정보를 자르지 않고 가로세로 비율을 유지합니다. 원고는 선택 가능하고 리플로우됩니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼·리셋·IME 동작은 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

호스트·콘텐츠 제작자가 완전하고 정확하며 동기화된 캡션, 화면 해설, 원고, 수어를 소유하고 미디어와 함께 갱신합니다. 완료에는 로컬에서 재생 가능한 라이선스 샘플, 실제 VTT·대체 콘텐츠, 키보드 컨트롤, 수동 타이밍·내용 검토가 필요합니다. 빈 미디어 래퍼는 완료가 아닙니다. 외부 비디오·텔레메트리 플레이어는 쓰지 않습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

파트: root, media, caption-track, alternatives, transcript, description, sign-language. 상태: playing,paused,ended,error (네이티브 상태에 한함).

렌더링되는 모든 소유 파트는 `data-krds-component="accessible-media"`, 하나의 `data-krds-part` 토큰, 공백으로 구분된 `data-krds-state` 집합을 가집니다. 네이티브·ARIA 상태가 우선합니다. 위 문장의 열거는 파트·상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `audio`, `silent-video`, `multimedia`, `captions`, `description`, `transcript`, `sign-language`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-49) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_11_01.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.
