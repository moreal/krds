# CSS, 토큰, 선택형 글꼴 {#css-tokens-and-optional-fonts}

마크업, 반응성, 이벤트는 각 프레임워크의 컴포넌트가 담당합니다. CSS는 모든 프레임워크가 함께 씁니다. 공유 CSS는 `data-krds-component`, `data-krds-part`, 공백으로 구분된 `data-krds-state` 속성을 선택자로 씁니다. 동작은 CSS가 아니라 네이티브 HTML과 ARIA가 결정합니다.

## 스타일 범위 선택 {#choose-your-style-scope}

패키지는 두 가지입니다.

- tokens 패키지: `tokens.css`, `tokens.json`, `source-map.json`
- styles 패키지: `base.css`, 컴포넌트별 CSS 파일, `all.css`

컴포넌트별 CSS에는 필요한 기반 스타일이 들어 있습니다. 일부 컴포넌트만 쓰면 개별 파일을, 전체를 쓰면 `all.css`를 가져옵니다. 둘을 겹쳐 쓰지 않습니다.

```css
@import '@unofficial-krds/styles/button.css';
```

프레임워크별 import 코드는 각 [컴포넌트 페이지](../components/)의 코드 탭에 있습니다.

`reset.css`는 직접 가져올 때만 적용되는 전역 스타일입니다. KRDS의 루트 rem 스케일을 포함하므로 기존 앱에 넣기 전에 영향을 확인합니다. 컴포넌트 CSS는 reset을 포함하지 않습니다.

**styles** 패키지의 `fonts.css`는 설치된 로컬 글꼴과 시스템 대체 글꼴을 지정합니다. 글꼴 파일을 내려받지는 않습니다.

## 애플리케이션 경계에서 토큰 사용자화 {#customize-tokens-at-the-application-boundary}

1. `@unofficial-krds/tokens/tokens.json`과 `source-map.json`에서 토큰 키와 출처를 찾습니다.
2. 앱의 테마 범위에서 해당 `--krds-*` 커스텀 속성을 재정의합니다.
3. 텍스트 대비, 초점 대비, 강제 색상 모드, 확대, 비활성 상태와 오류 상태를 확인합니다.

색상을 바꿔도 색의 의미는 유지합니다. 상태는 색 말고도 눈에 보이는 텍스트로 알립니다.

포털 콘텐츠는 테마를 지정한 DOM 조상 밖에 렌더링될 수 있습니다. 여는 요소 조상에 건 CSS 선택자는 포털에 닿지 않을 수 있습니다. 포털 컨테이너에 같은 토큰 테마를 적용하거나, 어댑터가 문서화한 provider/컨테이너 기능을 씁니다. 테마를 바꾼 뒤에는 열려 있는 다이얼로그도 확인합니다.

## 글꼴은 필요할 때만 불러오기 {#load-fonts-only-when-wanted}

글꼴 파일은 별도의 `@unofficial-krds/fonts` 패키지에 있습니다. 이 패키지에 로컬 글꼴 파일과 font-face 스타일시트가 들어 있습니다.

- 파일 크기와 글꼴 라이선스 조건이 앱에 맞을 때만 설치합니다.
- 글꼴 파일을 재배포할 때는 OFL 라이선스, 저작자 표시, 출처 기록을 함께 둡니다.
- styles 패키지의 `fonts.css`와 fonts 패키지의 font-face는 따로 선택합니다. 하나를 가져와도 다른 하나는 적용되지 않습니다.

이 문서 사이트는 reset과 로컬 글꼴 스타일시트를 수정 없이 씁니다. Pretendard GOV 400/500/700 WOFF2 파일을 `/krds/` 아래에서 직접 제공하고 CDN 글꼴 요청은 없습니다. root는 62.5%, 본문은 1.6rem이고 medium 버튼은 48px입니다. 밝은 테마와 강제 색상 모드를 지원합니다. Pretendard GOV와 서드파티 고지는 [출처와 권리](../legal/)에 있습니다.

## Lit Shadow DOM {#lit-shadow-dom}

문서의 CSS는 shadow 경계를 넘지 못합니다. Shadow DOM 안의 스타일은 Lit 패키지가 처리합니다.

- 원시 CSS 문자열 export는 Lit 어댑터가 문서화한 방식으로만 씁니다.
- light DOM에서 스타일이 잘 보여도 Shadow DOM에서 같다고 가정하지 않습니다. 레이블, 초점, 폼 연관, 스타일을 Shadow DOM에서 직접 확인합니다.

Lit 패키지의 버전과 피어 의존성은 [프레임워크 호환성](../compatibility/)에 있습니다.
