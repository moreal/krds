# KRDS Native README · VitePress · GitHub Pages 설계안

상태: **권장안 승인 — 구현·로컬 검증 완료, 독립 리뷰·배포 확인 대기** · 작성일: 2026-10-31 · 승인일: 2026-11-01

## 목적과 범위

개발자가 저장소의 목적을 이해하고, 자기 프레임워크의 실제 기록을 확인한 뒤 로컬에서 시작할 수 있도록 README와 문서 진입 화면을 정리한다. 기존 `apps/docs`의 VitePress **1.6.4**를 확장하고, 검증 후 GitHub Pages 배포가 가능하도록 구현한다. 저장소는 public, 기본 브랜치는 `main`이며 Pages는 외부에서 GitHub Actions 배포 방식으로 활성화되었다. 기본 배포 주소는 `https://moreal.github.io/krds/`이다.

한국어 README·홈·빠른 시작을 우선한다. 기존 54개 컴포넌트 reference, 지원 상태, compiler checkpoint와 권리 자료는 생성 체계와 근거를 보존한다. 전체 생성 문서 번역, Storybook/fixture 호스팅, 패키지 npm 게시, 태그 생성은 이번 범위에 포함하지 않는다. 공개 패키지 소스 버전 `0.1.0`과 private docs workspace 버전 `0.0.0`을 구분하며 npm 설치 가능성을 주장하지 않는다.

## 접근 방식

**권장안: VitePress 기본 shell + 실제 KRDS Vue 컴포넌트.** 검색, 상단 탐색, 사이드바, 목차와 키보드 이동은 유지한다. 홈의 소개·문서 링크·작은 예시 영역을 한국어로 정리하고, public Vue `Link`, `Badge`, `Button`, `Switch`를 직접 사용한다. 이미 있는 문서 탐색을 활용하면서 사용자가 실제 컴포넌트를 볼 수 있다. 사용자가 이 권장안을 승인했다.

**대안: 전체 KRDS shell.** 헤더·탐색·문서 레이아웃까지 KRDS 컴포넌트로 교체하면 시각적 일관성은 커지지만 VitePress 검색·모바일 탐색·접근성 연결을 다시 구현하고 검증해야 한다. 이번 문서 공개 목적에는 작업 범위가 크므로 권장하지 않는다.

## 화면과 구현

- 홈은 프로젝트 소개, 시작/컴포넌트 CTA, 프레임워크·근거·권리 안내, 로컬 상태만 사용하는 작은 Vue 예시로 구성한다. 비공식 구현임을 분명히 하고 정부 서비스나 전체 지원 완료를 암시하지 않는다.
- docs workspace가 `@unofficial-krds/vue`, `styles`, 필요한 `tokens`를 `workspace:^`로 직접 선언하고 Nx 의존성에 반영한다. public subpath import를 우선하며 다른 프레임워크를 감싸지 않는다.
- 기존 styles/tokens와 필요한 개별 CSS만 사용한다. 전역 reset, 폰트, 원본 KRDS JavaScript, 외부 자산·API·텔레메트리를 추가하지 않는다. VitePress 전역 스타일을 덮는 방식의 shell 교체와 장식 애니메이션은 필요하지 않다.
- 소개·링크·배지는 SSR 결과에도 보인다. 예시는 결정적인 초기 상태와 고유 ID를 사용하고 DOM 접근은 mounted 이후로 제한한다. `.vue`를 포함한 실제 검사 범위를 확보하며, 필요한 경우 docs가 정확한 `vue-tsc` 개발 의존성을 직접 선언한다.
- 좁은 화면, 터치 영역, 키보드 focus, 기본 테마의 dark mode와 reduced-motion 설정을 유지한다. 밝은 색 KRDS 예시가 필요하면 예시 패널 범위에서 명확히 표현한다.

## Pages와 링크

공개 빌드의 `base`는 `/krds/`, `cleanUrls`는 `false`로 한다. `.html`을 포함한 문서 링크와 디렉터리 index 링크를 사용하여 Pages에서 직접 접근·새로고침이 가능하게 한다. Vue/raw HTML 링크에는 VitePress base 처리를 적용하고, public source/legal 다운로드도 같은 prefix 아래에서 연결한다. 로컬 서버와 링크·브라우저 검사는 prefix를 이해하도록 함께 수정한다.

`/native/` fixture·Storybook 경로는 현재 로컬 서버 전용이다. 공개 사이트에는 실행 가능한 링크 대신 로컬 빌드/실행 안내를 표시한다. 로컬 모드에서만 기존 preview 링크를 제공하고, Qwik SSR/resume을 정적 preview로 대체하지 않는다.

새로운 별도 Pages workflow는 `main` push와 수동 실행을 지원한다. 정확한 Node **24.18.0**, vendored Yarn **4.14.1**, immutable install과 `node tools/yarn.mjs`를 사용한다. 검증된 `apps/docs/dist`만 `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4`, `actions/deploy-pages@v4`로 배포한다. build는 `contents: read`, deploy는 필요한 `pages: write`·`id-token: write`를 사용하며 `github-pages` 환경과 배포 동시성 제어를 둔다. PR에서는 배포하지 않는다. 승인 후 구현·검증한 결과를 배포하며 npm 공개 권한으로 확대하지 않는다.

## 재현 가능한 빌드와 권리

현재 generator는 optional package 선언/Storybook `dist` 존재 여부로 다운로드와 메타데이터를 바꾼다. 공개 빌드는 명시적인 입력 집합을 사용하여 깨끗한 Linux checkout과 개발자 환경이 동일한 문서·다운로드 목록을 만들도록 해야 한다. 기존 tracked checkpoint/snapshot과 현재 생성된 선언을 구분하고, checkpoint를 새 빌드 증거로 바꾸어 표현하지 않는다. 원본 source/proof 해시 확인과 모든 필요한 Git 입력의 추적 여부 확인은 유지한다. 다른 담당자의 CI portability·snapshot 수정은 이 설계의 구현과 별도로 통합한다.

Vue 예시가 소비하는 public package 및 shared CSS/token 출력은 깨끗한 checkout에서 실제로 빌드한다. 기존 Nx prerequisite를 우회하여 없는 출력을 사용하는 절차를 추가하지 않는다. generator가 바꾼 문서 메타데이터·배포 파일은 `compliance/distribution-provenance.json`의 목록·해시와 일치하도록 검토하여 갱신하고, `_legal` 산출물과 권리 검증까지 완료한다. 기존 권리 분류와 공식 KRDS·폰트의 별도 조건은 유지한다. 새 source/assets를 들여올 때만 추가 provenance를 기록한다.

## 완료 조건

깨끗한 Linux checkout에서 정확한 도구로 immutable install, prerequisite build, 문서 생성·빌드, 타입 검사, 문서/링크 검사와 권리 검증이 성공해야 한다. 같은 명시적 입력으로 두 번 빌드하여 배포 파일 목록과 바이트가 재현되는지 확인한다.

Chromium/WebKit에서 `/krds/` 홈과 `.html` 하위 문서 직접 진입·새로고침, 한국어 로컬 검색, source/legal 다운로드, 실제 Vue 예시의 클릭·키보드 상태 변경을 확인한다. 좁은 화면·확대 글자·dark mode·axe 결과와 hydration/runtime 오류·외부 요청도 확인한다. 이번 검사는 docs UI에 관한 새 증거이며 프레임워크 전체 지원이나 release acceptance를 부여하지 않는다.

배포 후 실제 Pages 주소의 홈·하위 문서·자산·다운로드를 확인한다. 기존 CI의 상태와 docs 배포 결과를 구분해 보고한다.

## 승인 기록과 배포 경계

2026-11-01 사용자가 기본 VitePress 탐색을 유지하는 권장안의 구현·검증을 승인했다. Pages 설정은 외부에서 GitHub Actions 방식으로 활성화되었다. 구현자는 추가 설계 승인 없이 진행하며, 최종 서명 커밋·push와 실제 배포 확인은 컨트롤러가 별도 승인 범위를 확인한 뒤 수행한다. npm 게시와 태그 생성은 포함하지 않는다.

참고: [VitePress 1.6.4 배포](https://vuejs.github.io/vitepress/v1/guide/deploy), [SSR 호환성](https://vuejs.github.io/vitepress/v1/guide/ssr-compat), [GitHub Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
