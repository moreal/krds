---
title: 'Accessible multimedia'
---

# Accessible multimedia {#accessible-multimedia}

**접근 가능한 미디어** — 자막, 원고, 조작 버튼을 갖춘 영상·음성 재생기입니다.

## 사용법 {#usage}

- 오디오나 비디오를 캡션, 원고, 화면 해설, 수어 같은 대체 정보와 함께 제공할 때 씁니다.
- 미디어 종류에 맞는 대체 정보를 준비합니다. 오디오에는 캡션 또는 원고, 소리 없는 비디오에는 화면 해설 또는 설명적 원고, 소리와 화면이 함께 있는 멀티미디어에는 여러 대체 정보를 함께 제공합니다.
- 여러 형식을 모두 준비하기 어렵다면 가장 많은 사용자가 쓸 수 있는 설명적 원고를 우선 제공합니다.
- 대체 정보는 미디어가 전달하는 정보를 빠짐없이 담아야 하며, 미디어를 고치면 대체 정보도 함께 고칩니다.

## 속성 {#props}

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `media` **필수** | `{kind: 'audio' \| 'silent-video' \| 'multimedia'; src: string; type: string; poster?: string}` | — | 재생할 미디어입니다. `kind`로 오디오(`audio`), 소리 없는 비디오(`silent-video`), 멀티미디어(`multimedia`)를 구분하고 `src`와 `type`으로 파일을 지정합니다. `poster`는 비디오의 대표 이미지입니다. |
| `captionTracks` | `readonly {src: string; lang: string; label: string}[]` | — | 캡션 트랙 목록입니다. 항목마다 파일 주소 `src`, 언어 `lang`, 플레이어 메뉴에 보일 이름 `label`을 넣습니다. |
| `transcript` **필수** | `{content: string; href?: never} \| {href: string; content?: never}` | — | 미디어 아래에 함께 제공하는 원고입니다. `content`를 주면 본문을 그대로 보여 주고, `href`를 주면 원고 페이지로 가는 '대본 읽기' 링크를 보여 줍니다. 둘 중 하나만 씁니다. |
| `descriptionTrack` | `{src: string; lang: string; label: string}` | — | 화면 해설 트랙입니다. 시각 정보를 설명하는 트랙의 `src`, `lang`, `label`을 넣습니다. |
| `signLanguageSource` | `string` | — | 수어 영상의 주소입니다. 넣으면 대체 정보 영역에 '수어 영상' 링크를 표시합니다. |
| `title` **필수** | `string` | — | 미디어의 제목입니다. 대체 정보 영역의 이름('{title} 대체 정보')에도 쓰이므로, 한 페이지에 미디어가 여럿이면 서로 다르게 짓습니다. |
| `controls` | `true` | `true` | 브라우저 기본 재생 컨트롤은 항상 표시됩니다. `true` 말고 다른 값은 줄 수 없습니다. |
| `autoplay` | `false` | `false` | 미디어는 자동으로 재생되지 않습니다. `false` 말고 다른 값은 줄 수 없습니다. |

모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/README.md#native-content-and-event-transport).

표에 나온 타입의 정의입니다.

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

## 키보드 조작 {#keyboard}

| 키 | 동작 |
| --- | --- |
| `Tab` / `Shift+Tab` | 재생 컨트롤, 원고 링크, 수어 영상 링크 사이를 차례로 이동합니다. |
| `Enter` / `Space` | 초점이 있는 재생 컨트롤을 실행합니다. 링크는 `Enter`로 엽니다. |

## 접근성 {#accessibility}

- 브라우저 기본 `audio`·`video` 요소와 컨트롤을 쓰므로 재생과 일시정지를 키보드로 조작할 수 있습니다.
- 미디어에는 `title`이 이름으로, 원고가 설명으로 연결됩니다. 대체 정보 영역에도 제목을 넣은 이름이 붙어 어느 미디어의 대체 정보인지 화면 낭독기로 구분할 수 있습니다.
- 캡션에는 번역 자막과 달리 누가 말하는지와 의미 있는 효과음을 포함하고, 소리가 나는 시점에 맞춰 동기화합니다.
- 캡션이 화면의 중요한 요소를 가리지 않게 하고, 배경과 충분한 대비를 확보합니다.
- 영상 안에서 정보를 전달하는 시각 요소는 배경과 4.5:1 이상의 명도 대비를 갖추게 제작합니다.
- 모든 사용자가 꼭 확인해야 하는 정보를 미디어로 제공한다면 수어 제공을 검토합니다.

## 알아 둘 점 {#notes}

- 비디오는 화면 너비에 맞춰 줄어들며 가로세로 비율을 유지합니다.
- 원고는 선택할 수 있는 텍스트이며 화면 너비에 맞춰 줄바꿈됩니다.
- 미디어를 재생할 수 없으면 대본을 확인하라는 안내 문구를 표시합니다.

## 스타일링 {#styling}

각 부분에는 `data-krds-part` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 `data-krds-state`에 공백으로 구분해 담깁니다.

| 파트 | 상태 값 |
| --- | --- |
| `root` | `playing`, `paused`, `ended`, `error` |
| `media` | `playing`, `paused`, `ended`, `error` |
| `caption-track` | 없음 |
| `alternatives` | 없음 |
| `transcript` | 없음 |
| `description` | 없음 |
| `sign-language` | 없음 |

```css
[data-krds-component="accessible-media"][data-krds-part="root"] { /* ... */ }
```

## 참고 {#references}

- [KRDS 공식 안내](https://www.krds.go.kr/html/site/component/component_11_01.html)
- [상세 명세](/sources/specs/components/accessible-media.md.txt)
- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/index.md)를 따릅니다.
