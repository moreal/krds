---
title: 'Language switcher'
---

# Language switcher {#language-switcher}

언어 변경 · `LanguageSwitcher`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_10_01.html) · [전체 명세](/sources/specs/components/language-switcher.md.txt) · [프레임워크 지원](../compatibility/README.md)

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
export interface LanguageSwitcherContract extends ControlledOpen {
    currentLocale: string;
    options: readonly LanguageOption[];
    onLocaleRequest?: (detail: {
        locale: string;
        href: string;
    }) => void;
}

export interface ControlledOpen {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (detail: OpenChangeDetails) => void;
}

export interface OpenChangeDetails {
    open: boolean;
}

export interface LanguageOption {
    locale: string;
    nativeLabel: string;
    translatedLabel: string;
    href: string;
    separateService?: boolean;
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `open` | 아니요 | `boolean` | 데이터 / 상태 |
| `defaultOpen` | 아니요 | `boolean` | 데이터 / 상태 |
| `onOpenChange` | 아니요 | `(detail: OpenChangeDetails) => void` | 이벤트 |
| `currentLocale` | 예 | `string` | 데이터 / 상태 |
| `options` | 예 | `readonly LanguageOption[]` | 데이터 / 상태 |
| `onLocaleRequest` | 아니요 | `(detail: {locale: string; href: string}) => void` | 이벤트 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

두 언어 서비스는 실제 다른 언어 링크를 노출합니다. 세 언어 이상이면 현재 언어와 선택지를 가진 이름 있는 드롭다운을 씁니다. 선택지는 해당 언어의 고유 이름을 보이고, 필요하면 현재 언어로의 번역도 함께 보입니다. 보이는 레이블로 국기나 낯선 언어 코드를 쓰지 않습니다. 각 링크의 lang은 발음되는 레이블과 일치하게 설정합니다.

### 의미 API {#plain-semantic-api}

독립 API입니다. currentLocale, options {locale,nativeLabel,translatedLabel,href,separateService?}[], open/defaultOpen=false, onOpenChange, 호스트의 같은 페이지 현지화용 선택 onLocaleRequest({locale,href})를 씁니다. 별도 서비스 링크는 새 창으로 열리며 그 동작을 표시합니다. 일반 번역 라우트는 계속 실제 링크입니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

클릭/Enter/Space로 드롭다운을 토글합니다. Tab/Shift+Tab으로 선택지를 순회합니다. 바깥 클릭은 닫습니다. Escape는 닫고 트리거로 초점을 되돌립니다. 선택지를 고르면 네이티브 href를 따르거나 명시적으로 처리되는 호스트 현지화를 실행하며, 호스트를 통해 문서 언어와 콘텐츠를 갱신합니다. 컨트롤만으로 가짜 번역 페이지를 만들지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

좁은 화면에서는 보통 햄버거 메뉴나 푸터로 옮깁니다. 언어를 자주 바꾸는 서비스는 푸터에서 바로 찾을 수 있게 둘 수 있습니다. 위치를 옮겨도 현재 로케일을 유지합니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

폼/리셋/IME 동작은 없습니다. 번역 선택기는 폼 값을 직렬화하지 않습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

번역, 라우트 대응, 문서 lang, 별도 서비스 목적지는 호스트가 책임집니다. 완료에는 네이티브 레이블과 트리거 초점을 갖춘 로컬 라우트/번역 모의가 포함됩니다. 외부 번역 API는 쓰지 않습니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, trigger, globe, current, list, option, external-icon; open,closed,current.

렌더링된 모든 소유 파트는 `data-krds-component="language-switcher"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `two-language-link`, `dropdown`, `separate-service`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-47) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_10_01.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
