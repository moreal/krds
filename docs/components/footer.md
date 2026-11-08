---
title: 'Footer'
---

# Footer {#footer}

푸터 · `Footer`

[KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_02_04.html) · [전체 명세](/sources/specs/components/footer.md.txt) · [프레임워크 지원](../compatibility/README.md)

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
export interface FooterContract {
    serviceLogo: LogoData;
    contacts: readonly {
        label: string;
        href?: string;
        text: string;
    }[];
    utilityLinks: readonly LinkData[];
    privacyPolicy: LinkData;
    policyLinks: readonly LinkData[];
    copyrightText: string;
    institution?: IdentifierContract;
}

export interface LogoData {
    src: string;
    alt: string;
}

export interface LinkData {
    id?: string;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}

export interface IdentifierContract {
    institutionName: string;
    logo: LogoData;
    relationshipText: string;
    theme?: 'light' | 'dark';
}
```

| 속성 / 콜백 | 필수 | 타입 | 역할 |
| --- | --- | --- | --- |
| `serviceLogo` | 예 | `LogoData` | 데이터 / 상태 |
| `contacts` | 예 | `readonly {label: string; href?: string; text: string}[]` | 데이터 / 상태 |
| `utilityLinks` | 예 | `readonly LinkData[]` | 데이터 / 상태 |
| `privacyPolicy` | 예 | `LinkData` | 데이터 / 상태 |
| `policyLinks` | 예 | `readonly LinkData[]` | 데이터 / 상태 |
| `copyrightText` | 예 | `string` | 데이터 / 상태 |
| `institution` | 아니요 | `IdentifierContract` | 데이터 / 상태 |

### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}

React와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.

### 네이티브 구조와 필수 순서 {#native-structure-and-mandatory-ordering}

실제 &lt;footer>가 페이지의 마지막 랜드마크입니다. 서비스 로고/연락처/유틸리티 링크를 묶고, 이어서 정책 링크, 저작권 정보, 마지막 하위 영역으로 운영기관 식별자(Identifier)를 둡니다. 눈에 띄게 구분되는 “개인정보 처리방침”을 포함합니다. 전자상거래 서비스는 이용약관과 사업자 신원을 추가로 제공합니다. 선택 서비스 내비게이션은 메인 내비게이션의 레이블과 계층을 그대로 따라야 합니다.

### 의미 API {#plain-semantic-api}

독립 API입니다. Footer는 serviceLogo {src,alt}, contacts {label,href,text}[], utilityLinks[], privacyPolicy {href,label}, policyLinks[], 명시적으로 전달되는 copyrightText, 선택 기관 식별 정보를 받습니다. 지어낸 원시 주소 대신 의미 Link 데이터를 보존합니다.

공통 상태 정책은 [현재 파일럿 규약](/sources/specs/components/README.md.txt)을 따릅니다. 값/open이 정의되면 제어, 없으면 비제어입니다. 제어와 기본값을 함께 주거나 모드를 바꾸면 잘못된 사용입니다. 기본값은 한 번만 읽습니다. 사용자 동작은 일반 의미 변경 요청 하나를 냅니다. 비활성, 무동작, 마운트, 하이드레이션, prop 갱신, 폼 리셋은 사용자 변경 콜백을 내지 않습니다. 제어 거부는 확정된 UI·초점 상태를 유지합니다. 취소된 리셋은 아무것도 하지 않습니다. 취소되지 않은 리셋은 비제어 기준선을 복원하고 제어 prop을 우선합니다. 추가 필드는 렌더러/머신 객체를 노출하지 않습니다.

### 키보드·초점·상태 전이 {#keyboard-focus-and-state-transitions}

실제 링크를 통해 자연스러운 Tab 순서를 따릅니다. 동작 가능한 연락처 값에는 tel:/mailto:를 씁니다. 외부/새 창 링크는 이동 동작을 알려야 합니다. 푸터 자체는 초점을 가두거나 돌리지 않습니다.

### 반응형·모바일 요구 {#responsive-mobile-requirements}

작은 화면에서도 열을 같은 순서로 쌓습니다. 짧은 페이지에서는 호스트 페이지 레이아웃이 콘텐츠를 덮지 않고 푸터를 뷰포트 하단에 둡니다.

### 폼·리셋·조합 {#forms-reset-and-composition}

집계된 폼/리셋/IME 상태는 없습니다.

### 자산·통합·조합 완료 조건 {#asset-integration-and-composition-completion}

정확하고 최신인 연락처, 정책, 저작권, 자산 권리는 호스트가 책임집니다. 저작권 기본값을 저장소 소유자나 KRDS 권리자로 두지 않습니다. 완료에는 실제 로컬 연락처·정책 링크, 운영기관 식별자(Identifier) 조합, 페이지 레이아웃 데모가 포함됩니다.

### 고정 파트와 상태 {#stable-parts-and-states}

root, logo, contacts, utilities, policies, privacy-link, copyright, identifier; 값 상태 없음.

렌더링된 모든 소유 파트는 `data-krds-component="footer"`, `data-krds-part` 토큰 하나, 공백으로 구분한 `data-krds-state` 집합을 씁니다. 네이티브/ARIA 상태가 우선합니다. 위 나열은 파트/상태 어휘이며 `packages/contracts/src/full-catalog.ts`에 고정되어 있습니다. 자산 전용 Favicon에는 런타임 파트가 없습니다.

## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}

케이스: `default`, `narrow`. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.

### 로컬 네이티브 스토리 {#local-native-stories}

이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.

프레임워크별 예제 코드: [react](/examples/react-1) · [solid](/examples/solid-3) · [svelte](/examples/svelte-7) · [vue](/examples/vue-58) · [lit](/examples/lit-60) · [qwik](/examples/qwik-61) · [angular](/examples/angular-62).

## 출처와 권리 {#source-identity-and-rights}

이 안내는 [공식 KRDS 문서](https://www.krds.go.kr/html/site/component/component_02_04.html)를 바탕으로 합니다. 수집 시각과 원본 해시는 [출처 기록](/sources/catalog/components.json.txt)에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.

KRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/index.md)를 읽어야 합니다.
