---
title: 'Footer'
---

# Footer {#footer}

**푸터** — 기관 연락처, 관련 링크, 저작권 고지를 담는 페이지 하단 영역입니다.

## 사용법 {#usage}

- 서비스 운영 주체, 연락처, 정책 링크, 저작권 정보를 페이지 맨 아래에 모아 보여 줄 때 씁니다. 모든 페이지에서 같은 위치에 둡니다.
- 정보는 서비스 로고, 연락처, 유틸리티 링크, 정책 링크, 저작권 정보 순서로 표시합니다. 분명한 이유 없이 이 순서를 바꾸지 않습니다.
- 개인정보 처리방침 링크는 반드시 넣고, 레이블은 '개인정보 처리방침'으로 씁니다. 다른 정책 링크와 구분되도록 강조해서 표시합니다.
- 전자상거래가 포함된 서비스는 이용약관과 사업자 정보를 정책 링크에 함께 넣습니다.
- 사이트맵처럼 사용자가 자주 찾는 링크를 유틸리티 링크에 두면 긴 페이지에서 위로 돌아가지 않고도 접근할 수 있습니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `serviceLogo` **필수** | `LogoData` | — | 서비스 로고 이미지입니다. `src`와 대체 텍스트 `alt`를 함께 넘깁니다. |
| `contacts` **필수** | `readonly {label: string; href?: string; text: string}[]` | — | 주소, 전화번호, 이메일 같은 연락처 목록입니다. 항목마다 `label`과 표시할 `text`를 넘기고, `href`에 `tel:`이나 `mailto:` 주소를 주면 바로 연결되는 링크가 됩니다. |
| `utilityLinks` **필수** | `readonly LinkData[]` | — | 오시는 길, 관련 기관, 소셜 채널처럼 자주 찾는 링크 목록입니다. `target`이 `_blank`인 링크에는 레이블 뒤에 '(새 창)'을 붙입니다. |
| `privacyPolicy` **필수** | `LinkData` | — | 개인정보 처리방침 링크입니다. 다른 정책 링크보다 눈에 띄게 표시합니다. |
| `policyLinks` **필수** | `readonly LinkData[]` | — | 웹 접근성 정책, 이용약관 같은 그 밖의 정책 링크 목록입니다. |
| `copyrightText` **필수** | `string` | — | 저작권 문구입니다. 기본 문구가 없으므로 서비스에 맞는 문구를 직접 넘깁니다. |
| `institution` | `IdentifierContract` | — | 운영기관 정보입니다. 넘기면 푸터의 마지막 영역에 운영기관 식별자(`Identifier`)를 표시합니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

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

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 푸터 안의 링크 사이를 차례로 이동합니다. |
| `Enter` | 초점이 있는 링크로 이동합니다. |

## 접근성 {#accessibility}

- 모든 내용을 `<footer>` 요소 안에 담아 화면 낭독기가 푸터 영역으로 바로 이동할 수 있습니다. 유틸리티 링크와 정책 링크는 각각 '서비스 관련 링크', '정책'이라는 이름의 `nav` 영역이 됩니다.
- 로고가 이미지라면 `serviceLogo.alt`에 서비스나 기관 이름을 대체 텍스트로 넣습니다.
- 새 창으로 열리는 링크에는 '(새 창)'을 자동으로 붙입니다. 외부 사이트로 나가는 링크는 레이블에서 그 사실을 알 수 있게 씁니다.
- 연락처와 링크가 없는 페이지나 다른 목적지로 연결되지 않도록 항상 최신 상태로 유지합니다.

## 알아 둘 점 {#notes}

- 화면이 좁아 세로로 쌓이더라도 서비스 로고, 연락처, 유틸리티 링크, 정책 링크, 저작권 정보의 순서는 그대로입니다.
- 본문이 화면 높이보다 짧을 때 푸터가 화면 맨 아래에 붙도록 하는 것은 페이지 레이아웃에서 처리합니다. 이때 푸터가 본문을 가리지 않게 합니다.
- 푸터에 서비스 메뉴를 함께 넣는다면 메인 메뉴의 최상위 항목을 모두 포함하고, 구조와 레이블을 메인 메뉴와 같게 맞춥니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | 없음 |
| `logo` | 없음 |
| `contacts` | 없음 |
| `utilities` | 없음 |
| `policies` | 없음 |
| `privacy-link` | 없음 |
| `copyright` | 없음 |
| `identifier` | 없음 |

```css
[data-krds-component="footer"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_02_04.html)
- [상세 명세](/sources/specs/components/footer.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
