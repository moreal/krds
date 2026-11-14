---
title: 'Language switcher'
---

# Language switcher {#language-switcher}

**언어 변경** — 서비스를 다른 언어로 바꿔 보게 합니다.

## 사용법 {#usage}

- 서비스를 여러 언어로 제공할 때 표시 언어를 바꾸게 하려고 씁니다.
- 지원 언어가 두 개면 다른 언어로 가는 링크 하나로, 세 개 이상이면 드롭다운으로 제공합니다.
- 언어 이름은 그 언어로 적습니다. 한국어 화면에서는 'English', 영어 화면에서는 '한국어'처럼 표시합니다.
- 국기나 `EN` 같은 언어 코드를 레이블로 쓰지 않습니다. 국가명은 국가에 따라 서비스가 달라질 때만 보조 정보로 덧붙입니다.
- 전체 번역이 아닌 별도의 외국어 서비스로 연결할 때는 새 창으로 열고 새 창 아이콘을 표시합니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | 드롭다운이 열려 있는지를 직접 제어합니다. `onOpenChange`와 함께 씁니다. |
| `defaultOpen` | `boolean` | `false` | 직접 제어하지 않을 때 드롭다운의 처음 열림 상태입니다. |
| `onOpenChange` | `(detail: OpenChangeDetails) => void` | — | 사용자가 드롭다운을 열거나 닫으려 할 때 불립니다. 바뀔 상태를 `{open}`으로 받습니다. |
| `currentLocale` **필수** | `string` | — | 현재 표시 중인 언어의 로케일입니다. `options`에서 같은 `locale`을 가진 항목을 현재 언어로 표시합니다. |
| `options` **필수** | `readonly LanguageOption[]` | — | 선택할 수 있는 언어 목록입니다. 항목마다 `locale`, 그 언어로 적은 이름 `nativeLabel`, 현재 언어로 옮긴 이름 `translatedLabel`, 이동할 `href`를 넘깁니다. `separateService`가 `true`인 항목은 새 창으로 엽니다. |
| `onLocaleRequest` | `(detail: {locale: string; href: string}) => void` | — | 사용자가 언어를 고를 때 불리며 `{locale, href}`를 받습니다. 페이지 이동 없이 앱에서 언어를 바꿀 때 씁니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

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

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Enter` / `Space` | 드롭다운 버튼에서 누르면 언어 목록을 열거나 닫습니다. |
| `Tab` / `Shift+Tab` | 언어 선택지 사이를 차례로 이동합니다. |
| `Enter` | 초점이 있는 언어로 이동합니다. |
| `Escape` | 언어 목록을 닫고 초점을 드롭다운 버튼으로 돌려놓습니다. |

## 접근성 {#accessibility}

- 각 선택지에 그 언어의 `lang`을 지정해 화면 낭독기가 알맞은 발음으로 읽습니다.
- 드롭다운 버튼 왼쪽에 지구본 아이콘을 표시해 글을 읽기 어려운 사용자도 용도를 알 수 있습니다.
- 새 창으로 열리는 선택지에는 새 창 아이콘을 표시해 이동 방식을 미리 알립니다.
- `nativeLabel`에는 언어 코드가 아닌 언어 이름을 그대로 적습니다.

## 알아 둘 점 {#notes}

- 언어 목록 바깥을 누르면 목록이 닫힙니다.
- 선택지는 실제 링크이므로 고르면 `href`로 이동합니다. 문서의 `lang`과 번역된 콘텐츠로 바꾸는 일은 앱에서 처리합니다.
- 화면이 좁으면 햄버거 메뉴 안이나 푸터에 둡니다. 언어 변경이 중요한 서비스는 푸터에 두어 바로 찾을 수 있게 합니다.
- `open`을 넘기면 제어 방식으로 동작하므로 `onOpenChange`에서 값을 갱신해야 합니다. `open`과 `defaultOpen`은 함께 쓰지 않습니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `open`, `closed`, `current` |
| `trigger` | `open`, `closed` |
| `globe` | 없음 |
| `current` | 없음 |
| `list` | `open`, `closed` |
| `option` | `current` |
| `external-icon` | 없음 |

```css
[data-krds-component="language-switcher"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_10_01.html)
- [상세 명세](/sources/specs/components/language-switcher.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.
