# CSS, 토큰, 선택형 글꼴 {#css-tokens-and-optional-fonts}

마크업, 반응성, 이벤트는 각 프레임워크의 컴포넌트가 담당합니다. CSS는 모든 프레임워크가 함께 씁니다. 공유 CSS는 `data-krds-component`, `data-krds-part`, 공백으로 구분된 `data-krds-state` 속성을 선택자로 씁니다. 동작은 CSS가 아니라 네이티브 HTML과 ARIA가 결정합니다.

## 스타일 범위 선택 {#choose-your-style-scope}

패키지는 두 가지입니다.

- `@unofficial-krds/tokens`: `tokens.css`, `tokens.json`, `source-map.json`
- `@unofficial-krds/styles`: `base.css`, 컴포넌트별 CSS 파일, `all.css`

컴포넌트별 CSS에는 필요한 기반 스타일이 들어 있습니다. 일부 컴포넌트만 쓰면 개별 파일을, 전체를 쓰면 `all.css`를 가져옵니다. 둘을 겹쳐 쓰지 않습니다.

```css
@import '@unofficial-krds/styles/button.css';
```

컴포넌트별 CSS 파일 이름은 각 [컴포넌트 페이지](../components/) 맨 위에 있습니다.

`reset.css`는 직접 가져올 때만 적용되는 전역 스타일입니다. KRDS의 루트 rem 스케일을 포함하므로 기존 앱에 넣기 전에 영향을 확인합니다. 컴포넌트 CSS는 reset을 포함하지 않습니다.

`@unofficial-krds/styles/fonts.css`는 설치된 로컬 글꼴과 시스템 대체 글꼴을 지정합니다. 글꼴 파일을 내려받지는 않습니다.

## 토큰 값 바꾸기 {#customize-tokens-at-the-application-boundary}

1. `@unofficial-krds/tokens/tokens.json`과 `source-map.json`에서 토큰 키와 출처를 찾습니다.
2. 앱의 테마 범위에서 해당 `--krds-*` 커스텀 속성을 재정의합니다.
3. 텍스트 대비, 초점 대비, 강제 색상 모드, 확대, 비활성 상태와 오류 상태를 확인합니다.

색상을 바꿔도 색의 의미는 유지합니다. 상태는 색 말고도 눈에 보이는 텍스트로 알립니다.

포털 콘텐츠는 테마를 지정한 DOM 조상 밖에 렌더링될 수 있습니다. 여는 요소 조상에 건 CSS 선택자는 포털에 닿지 않을 수 있습니다. 포털 컨테이너에도 같은 토큰 테마를 적용합니다. 테마를 바꾼 뒤에는 열려 있는 다이얼로그도 확인합니다.

## 글꼴은 필요할 때만 불러오기 {#load-fonts-only-when-wanted}

글꼴 파일은 별도의 `@unofficial-krds/fonts` 패키지에 있습니다. 이 패키지에 Pretendard GOV 글꼴 파일과 font-face 스타일시트 `fonts.css`가 들어 있습니다.

- 파일 크기와 글꼴 라이선스 조건이 앱에 맞을 때만 설치합니다.
- 글꼴 파일을 재배포할 때는 OFL 라이선스, 저작자 표시, 출처 기록을 함께 둡니다. 자세한 조건은 [출처와 권리](../legal/)에 있습니다.
- `@unofficial-krds/styles/fonts.css`와 `@unofficial-krds/fonts/fonts.css`는 따로 선택합니다. 하나를 가져와도 다른 하나는 적용되지 않습니다.

## Lit Shadow DOM {#lit-shadow-dom}

문서의 CSS는 Shadow DOM 경계를 넘지 못합니다. 그래서 Lit 요소는 `@unofficial-krds/styles/lit`의 `shadowStyles.all`을 자기 Shadow DOM에 직접 넣습니다.

- 앱은 문서에 `@unofficial-krds/tokens/tokens.css`만 한 번 가져옵니다. 토큰 값을 바꾸면 Shadow DOM 안에도 적용됩니다.
- 직접 만든 Lit 요소에 KRDS 스타일이 필요하면 `shadowStyles`에서 필요한 문자열을 골라 Lit의 `unsafeCSS`로 감쌉니다.
- light DOM에서 스타일이 잘 보여도 Shadow DOM에서 같다고 가정하지 않습니다. 레이블, 초점, 폼 연관, 스타일을 Shadow DOM에서 직접 확인합니다.

Lit 패키지의 버전과 피어 의존성은 [프레임워크 호환성](../compatibility/)에 있습니다.
