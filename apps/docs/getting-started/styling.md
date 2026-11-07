# CSS, 토큰, 선택형 글꼴 {#css-tokens-and-optional-fonts}

네이티브 어댑터가 마크업, 반응성, 이벤트를 소유합니다. 공유 CSS는 공개 `data-krds-component`, `data-krds-part`, 공백으로 구분된 `data-krds-state` 속성을 대상으로 합니다. 동작은 네이티브 HTML과 ARIA가 결정합니다.

## 스타일 범위 선택 {#choose-your-style-scope}

tokens 패키지는 `tokens.css`, `tokens.json`, `source-map.json`을 export합니다. styles 패키지는 `base.css`, 웹 컴포넌트별 CSS 파일, `all.css`를 export합니다. 각 컴포넌트 CSS에는 필요한 기반이 들어 있습니다. 일부 컴포넌트만 쓰는 화면에는 개별 엔트리를, 전체 카탈로그 화면에는 `all.css`를 씁니다. 둘을 반복해서 겹쳐 쓰지 않습니다.

```css
@import '@unofficial-krds/styles/button.css';
```

이 CSS import는 스타일시트 엔트리일 뿐이며 프레임워크 예시나 동작 인수 주장이 아닙니다. 실제 애플리케이션 번들러의 import는 [네이티브 예시](../compatibility/examples)에서 확인합니다.

`reset.css`는 의도적인 전역 opt-in이며 KRDS 루트 rem 스케일을 포함합니다. 기존 애플리케이션에 가져오기 전에 영향을 검토합니다. 컴포넌트 import는 이 reset을 추가하지 않습니다. **styles** 패키지의 `fonts.css`는 설치된 로컬 글꼴과 시스템 대체 글꼴을 선택하며 글꼴 다운로드를 포함하지 않습니다.

## 애플리케이션 경계에서 토큰 사용자화 {#customize-tokens-at-the-application-boundary}

`@unofficial-krds/tokens/tokens.json`과 `source-map.json`의 토큰 키와 출처를 사용합니다. 애플리케이션 테마 범위에서 해당 `--krds-*` 커스텀 속성을 재정의합니다. 그다음 텍스트 대비, 초점 대비, 강제 색상 모드, 확대, 비활성/잘못된 상태를 확인합니다. 색상을 바꿔도 시맨틱 의미는 유지합니다. 상태에는 눈에 보이는 텍스트 단서가 있어야 합니다.

포털 콘텐츠는 가장 가까운 DOM 테마 조상 밖에 렌더링될 수 있습니다. 설정한 포털 컨테이너에 같은 토큰 테마를 적용하거나 어댑터가 문서화한 네이티브 provider/컨테이너 기능을 사용합니다. 여는 요소 조상의 CSS 선택자가 분리된 포털에 닿는다고 가정하지 않습니다. 테마를 실시간으로 바꾼 뒤 열린 다이얼로그 자체를 확인합니다.

## 글꼴은 필요할 때만 불러오기 {#load-fonts-only-when-wanted}

별도의 `@unofficial-krds/fonts` 패키지에 로컬 글꼴 자산과 자체 font-face 스타일시트가 들어 있습니다. 크기와 글꼴 라이선스 조건이 애플리케이션에 맞을 때만 설치하고 불러옵니다. 재배포하는 글꼴 바이트와 함께 OFL 라이선스, 저작자 표시, 출처 기록을 유지합니다. styles 패키지의 로컬 글꼴 선택과 fonts 패키지의 font-face 로딩은 서로 다른 opt-in입니다.

이 Astro 사이트는 공개 reset과 수정하지 않은 로컬 글꼴 스타일시트를 사용합니다. 원본 Pretendard GOV 400/500/700 WOFF2 파일을 `/krds/` 아래에서 제공하며 CDN 글꼴 요청은 없습니다. root는 62.5%, 본문은 1.6rem이고 기본 medium 버튼은 48px입니다. 지원하는 표시 환경은 밝은 테마와 강제 색상 모드입니다. Pretendard GOV와 기타 서드파티 고지는 [출처와 권리](../legal/)를 참고합니다. 스토리 상태를 준비하려고 외부 글꼴이나 이미지를 가져오지 않습니다.

## Lit Shadow DOM {#lit-shadow-dom}

문서 CSS는 shadow 경계를 넘지 못합니다. 지원되는 Shadow DOM 스타일 경로는 Lit 패키지가 책임집니다. 공유 원시 CSS 문자열 export는 해당 어댑터가 문서화한 방식으로만 사용합니다. light DOM 샘플이 스타일링되어 보여도 Shadow DOM의 레이블, 초점, 폼 연관, 스타일이 동작한다는 증거는 아닙니다. [네이티브 호환성 근거](../compatibility/examples#lit)를 읽습니다.
