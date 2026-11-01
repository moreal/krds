# KRDS 컴포넌트로 구성하는 Astro 문서 설계안

상태: **사용자 승인 — Solid 1 변경 반영** · 작성일: 2026-11-01

## 목적과 범위

`apps/docs`를 VitePress에서 Astro 정적 사이트로 전환한다. `/krds/` 아래의 현재 문서 내용, URL·앵커와 근거 자료를 보존하면서 홈뿐 아니라 헤더·탐색·검색·목차·본문의 UI·푸터까지 실제 공개 KRDS 컴포넌트로 구성한다. 독립 비공식 프로젝트라는 안내, 한국어 shell·홈·빠른 시작, 기존 영어 참조 문서의 언어 구분은 유지한다.

이번 설계에서 **“KRDS 컴포넌트만”**은 `@unofficial-krds/solid/<public-subpath>`의 실제 Solid 1 컴포넌트와 해당 공개 styles를 사용한다는 뜻이다. 같은 모양의 HTML에 `data-krds-component`를 붙이거나 문서용 버튼·탐색·표를 CSS로 복제하지 않는다. `main`, `article`, `section`, 제목, 문단, 인라인 강조, `pre`·`code`, 인용 등 카탈로그 대응물이 없는 문서 구조는 의미 있는 HTML을 사용한다. 자체 CSS는 토큰을 이용한 페이지 배치·문서 타이포그래피·코드 영역의 스크롤과 줄바꿈에 한정한다.

보존 대상은 54개 컴포넌트 참조, 609개 source/proof 다운로드의 모든 경로와 접근 가능성, 385개 역사적 declaration 기록, 62개 compiler checkpoint, 법적 안내와 별도 라이선스다. 전환 전 목록과 해시를 기준으로 삼되 **역사적 기록과 현재 입력 snapshot을 구분한다.** 385개 declaration과 62개 checkpoint의 원본·proof bytes/hash는 불변이다. 의존성 교체로 바뀐 현재 입력(예: dependency provenance의 lock/resolution 정보, docs가 소비하는 변경된 package manifest)의 다운로드는 정확한 현재 bytes로 다시 생성하고 distribution hash를 갱신한다. 바뀔 수 있는 현재 기록은 명시적인 path allowlist와 전후 hash·변경 이유 diff로 보고하며, allowlist 밖의 변경과 역사적 기록 변경은 실패시킨다. 기록을 최신 구현의 지원·릴리스 승인으로 바꾸지 않는다. fixture/Storybook은 기존 로컬 안내를 유지한다. 이는 builder check에 대한 컨트롤러 결정이며 추가 사용자 질문이 아니다.

## 접근 방식과 선택 제안

**권장: plain Astro + 한 개의 SSR/hydrated Solid 1 문서 shell.** Astro는 파일 경로·head·정적 출력을 담당한다. 페이지마다 하나의 `DocsShell.tsx`가 공개 KRDS 컴포넌트를 직접 조합하고, 빌드에서 만든 문서 AST를 `DocArticle.tsx`가 렌더링한다. `client:load`로 초기 상호작용을 연결한다. search/index는 처음 검색을 열 때 로컬 정적 JSON에서 읽는다. 페이지 이동은 일반 링크와 전체 페이지 로드로 한다.

이 방식은 검색 trigger와 Modal, 모바일 탐색, 본문 표·목차의 ID 및 focus를 같은 Solid 1 app 안에서 관리한다. Astro에서 callback 함수를 island prop으로 직렬화하지 않는다. Solid `createUniqueId()`를 사용하는 표나 탐색이 각각 별도 app이 되어 동일 ID를 만들 가능성도 피한다. 전체 문서 AST가 hydration 데이터로 전달되는 비용은 인정하며, 체크포인트의 긴 코드가 있는 페이지의 HTML·데이터 크기를 측정하고 보고한다.

**대안: 독립적인 탐색·검색·표 islands.** 본문에 보내는 데이터는 줄일 수 있지만 Header의 검색 callback, Modal focus 복귀, 여러 Solid 1 app의 자동 ID 연결을 위한 별도 조정이 필요하다. 현재 목적에는 단일 shell이 더 명료하다. Starlight와 VitePress 기본 UI는 요구사항에 맞지 않으므로 사용하지 않는다. 사용자가 단일 shell 구성을 승인했고 document UI renderer를 Solid 1로 변경했다.

## 컴포넌트 구성

| 영역 | 실제 공개 Solid 1 컴포넌트와 host 책임 |
| --- | --- |
| 바로가기·상단 | `SkipLink`, `Header`와 Header 내부 `MainMenu`; 동일한 navigation 데이터와 현재 항목 ID 사용 |
| 검색 진입 | Header의 실제 `search` 버튼과 `search.onRequest`; 선택적 `searchTriggerId="docs-search-trigger"`로 focus 복귀 지점을 확정 |
| 검색 | `Modal`, `TextInput`, `Button`, `StructuredList`, `Link`; query·결과·상태 문구는 로컬 순수 상태 |
| 좌측 탐색 | `SideNavigation`; 해당 섹션의 전체 문서 목록과 활성 경로를 제공 |
| 모바일 문서 탐색 | `Button` + 별도 `Modal` 안의 `SideNavigation`; Header의 주 탐색과 용도를 구분 |
| 경로·목차 | `Breadcrumb`, `InPageNavigation` (`narrowMode="disclosure"`); 빌드 시 생성한 h2/h3 ID 사용 |
| 본문 | 링크는 `Link`, 목록은 `TextList`, 표는 `Table`; rich cell/item content는 실제 JSX render prop으로 전달 |
| 코드 작업 | 의미 있는 `pre/code`와 `Button` 복사 동작; 결정적인 상태 문구·키보드 동작 |
| 홈 | `Link`, `Badge`, `Button`, `Switch`, `StructuredList`; 기존의 로컬 상태 예시·지원/권리 안내 유지 |
| 푸터 | `Footer`; 기존 mark.svg, 실제 안내·저장소·권리 링크와 독립 저작권 사용 |

공개 `Footer`의 필수 `privacyPolicy` 데이터에는 기존 `/legal/` 링크와 정확한 라벨 **“출처와 권리”**를 제공한다. 존재하지 않는 개인정보 처리방침이나 기관 연락처를 만들어내지 않는다. 정부 전용 masthead·Identifier는 표시하지 않는다.

검색 결과는 query를 텍스트로 렌더링한다. 제목·한국어/영어 이름·heading·API·키보드 안내를 포함하는 결정적 로컬 index를 만들고, 한국어 `배지`가 Badge로 연결되는 현재 동작과 Ctrl/Cmd+K를 유지한다. 검색 상태와 결과 수는 live region으로 안내한다. Modal의 자체 Escape·Tab trap·scroll/inert·복귀 동작을 사용한다. 검색 결과는 표준 링크이므로 링크 자체의 키보드 사용을 유지한다. 별도 combobox/listbox 패턴을 흉내 내지 않는다.

## 문서 변환과 URL 계약

기존 `scripts/generate.mjs`의 출처·해시·checkpoint 검증을 유지하고, 출력 Markdown을 빌드 전 읽어 명시적인 `DocPage` 데이터로 변환한다. build-only Markdown parser는 consuming docs workspace가 정확한 버전으로 직접 선언한다. fenced code는 실행하지 않으며 현재 raw anchor와 `<br>` 같은 허용된 문서 HTML도 AST의 `Link`/line break로 변환한다. 예상하지 못한 실행 HTML·unsupported node는 build를 실패시켜 누락을 드러낸다.

`TextList`의 선택적 `renderItem`과 `Table`의 선택적 `renderCell`에 재귀 inline/block renderer를 넣어 코드·링크·줄바꿈·중첩 목록을 보존한다. `TextList`가 자동으로 제한하는 중첩 경로에만 의존하지 않는다. 표 헤더의 표시 텍스트, 본문 cell의 inline 의미와 caption을 보존하고 모든 표를 overflow-safe KRDS `Table`로 렌더링한다. 단순한 class 장식이나 `innerHTML`로 전체 문서를 우회하지 않는다.

**확인된 Solid 1 API와 최소 공개 확장:** `Header`는 `HeaderContract`를 받으며 `search={{label,onRequest}}`의 자체 검색 버튼을 렌더링한다. actions render prop은 없다. Task 3에서 `HeaderProps = HeaderContract & { searchTriggerId?: string }`의 선택적 ID를 공개 owning TSX에 추가해 실제 버튼에 적용한다. 기존 호출과 동작을 보존하고 `docs-search-trigger`를 Modal `returnFocusId`에 연결한다. `mobileTriggerId`와 controlled `mobileOpen`/`onMobileOpenChange`는 이미 있다. `ModalProps`는 JSX `title`, `description`, `children`, `actions`, `initialFocusId`, `returnFocusId`를 제공한다. initial focus는 dialog 또는 첫 interactive element만 허용한다.

`TextList`는 현재 string-only `TextListContract`와 3단계 children 제한을 사용하며 item render prop이 없다. Task 2에서 Solid 공개 타입만 `TextListProps = TextListContract & { renderItem?: (item: TextListItem) => JSX.Element }`로 확장하고 기본 `item.content`를 fallback으로 보존한다. rich 중첩 목록은 renderItem의 JSX 안에서 별도 공개 TextList를 구성한다. 현재 `<ol>`에 CSS decimal selector의 `data-krds-ordering`이 없으므로 root/list에 ordered/unordered attribute를 추가한다. `Table`도 string-only cells이므로 `TableProps = TableContract & { renderCell?: (row: TableContract['rows'][number], column: TableColumn) => JSX.Element }`를 선택적으로 추가하고 기존 cell fallback을 보존한다. 추가로 실제 Markdown 의미를 보존하기 위해 Solid 공개 `TextListProps.start?: number`를 ordered `<ol>`에 전달하고, `TableProps.renderHeader?: (column: TableColumn) => JSX.Element`로 rich header를 유지한다. `LinkProps`의 label은 기존 string을 포함하는 `JSX.Element`로 확장하며 native `title?: string`을 보존한다. shared LinkContract와 다른 adapter는 변경하지 않는다. 각 확장은 공개 subpath SSR/TSX와 기존 string 동작, 실제 CSS marker를 targeted tests로 검증한다. owning source는 `packages/solid/src/components/{text-list,table,link,header}/index.tsx`; release version bump나 다른 adapter 변경은 없다.

`DocPage`는 `{ sourcePath, route, title, lang, blocks, headings, breadcrumbs, currentId, previous?, next? }`를 제공한다. 동일한 parsed 문서가 SSR·hydration·검색 색인·목차의 입력이다. 기존 VitePress slug 결과와 전환 전 HTML의 모든 heading ID를 비교하여 duplicate·한글·코드 heading의 앵커도 유지한다. URL helper는 내부 page·source/legal 주소에 `/krds/`를 정확히 한 번 붙이고 fragment·query·외부 주소를 보존한다.

정적 출력은 기존 `components/index.html`, `legal/index.html`과 `components/button.html` 등 실제 경로를 유지해야 한다. Astro `build.format: 'preserve'`와 각 Markdown 원래 위치에 대응하는 생성 route를 사용한다. 모든 경로를 하나의 catch-all의 `file` 출력으로 평탄화하지 않는다. `site: 'https://moreal.github.io'`, `base: '/krds/'`, `outDir: './dist'`를 설정하고, 현재 정적 서버의 디렉터리·`.html` 직접 접근 및 reload를 검증한다. Astro는 링크의 base를 자동으로 모두 고쳐주지 않으므로 helper를 본문에도 적용한다.

## ID·focus·SSR 계약

한 페이지에 focus 가능한 `<main id="docs-main" tabindex="-1">` 하나를 둔다. SkipLink는 이 ID를 가리킨다. heading ID는 문서의 기존 anchor를 그대로 사용한다. 공용 host ID는 `docs-search-trigger`, `docs-search-dialog`, `docs-search-input`, `docs-section-trigger`, `docs-section-dialog`, `docs-header-mobile-trigger`로 고정한다. Modal initial focus는 첫 interactive element 또는 dialog 자신만 허용하는 현재 public API를 따른다. search는 첫 interactive element인 검색 input을 지정하거나 dialog focus를 사용한다.

모바일 주 메뉴·문서 메뉴·검색은 host의 단일 상태 조정으로 동시에 열지 않는다. breakpoint 변경·Escape·닫기·결과 링크 이동에서 잃어버린 focus, inert 또는 body scroll lock이 남지 않아야 한다. Header 내부 MainMenu가 제공하는 mobile trigger ID를 설정한다. 모바일 문서 목록과 desktop 목록은 동시에 노출되지 않도록 layout을 전환하고 각 navigation에 명확한 label을 준다.

JS 없이도 SSR 본문·전체 문서 링크·목차·source/legal 다운로드가 읽히고 일반 링크가 동작한다. SSR에서 문서 메뉴를 숨긴 상태로만 제공하지 않는다. 좁은 화면의 no-JS fallback은 SSR KRDS `SideNavigation`을 문서 흐름에 노출한다. JS가 필요한 검색·복사·데모 동작은 hydration 준비 전 비활성 상태 또는 명확한 안내를 갖는다. VitePress SPA router와 원본 KRDS JavaScript는 사용하지 않는다.

## 원본 글꼴·스케일·테마

`@unofficial-krds/fonts/fonts.css`를 직접 import하여 이미 provenance가 기록된 수정 없는 Pretendard GOV 400·500·700 WOFF2를 로컬에서 제공한다. fonts workspace를 docs dependencies와 Nx `implicitDependencies`에 추가한다. 원격 font provider·CDN을 사용하지 않으며 기존 OFL/RFN·KRDS·독립 MIT 조건을 유지한다.

공개 `@unofficial-krds/styles/reset.css`를 수정 없이 사용한다. 이 파일의 `html { font-size: 62.5%; }`는 기본 브라우저 설정에서 10px이며 사용자 기본 글자 크기 설정도 따른다. docs body는 `1.6rem`으로 16px를 사용한다. KRDS 토큰의 4.8rem medium Button은 기본 설정에서 실제 48px여야 한다. 16px root에서 76.8px가 되는 현재 문제를 shell 전역에서 해결한다. 200% 글자 확대를 pixel 고정 root로 차단하지 않는다.

현재 token graph에는 light·high-contrast가 있고 public component CSS가 `--krds-light-*`를 직접 사용한다. 지원되는 자동 dark token switch는 없다. 따라서 이번 전환은 일관된 light와 기존 forced-colors를 제공하며, dark를 임의 색상·반전 CSS로 만들어 지원한다고 주장하지 않는다. 추후 dark 지원은 shared token/component 작업으로 분리한다. reduced motion과 focus-visible은 공개 foundation과 필요한 문서 layout 처리를 유지한다.

## 버전·빌드·권리와 완료 조건

선택 버전은 Astro **7.4.4**, `@astrojs/solid-js` **7.1.2**, 기존 Solid 1 **1.9.18**, Vite **8.3.5**, TypeScript **6.0.2**다. 동결한 registry metadata에서 Astro의 Node `>=22.23.4`·Vite `^8.3.5`, integration의 Node `>=22.23.4`·Solid `^1.9.13`을 확인했다. integration은 별도 Astro peer를 선언하지 않는다. checker **0.9.12**의 TypeScript peer는 `^5.0.0 || ^6.0.0`이며 build-only parser는 marked **18.1.2**다. 실제 설치에서 Astro와 integration 모두 Vite 8.3.5를 해석하고 Solid 1.9.18·TS 6.0.2 및 `.astro` diagnostics를 검증했다. checker의 transitive `@astrojs/astro2tsx@0.1.3`가 runtime peer를 dev-only로 선언한 upstream 누락은 정확한 버전의 Yarn packageExtension으로 보완한다. Node **24.18.0**, Yarn **4.14.1**, `nodeLinker: pnpm`, 단일 lockfile을 유지한다. root resolutions나 다른 framework adapter 변경은 없다.

기존 docs tests 중 “fonts 금지”, “KRDS CSS는 예시 안에서만”, VitePress selector assertions는 새 요구사항에 맞게 대체한다. 출처·hash·54개 reference·7개 stable compiler mapping·다운로드 검사를 약화시키지 않는다. release docs producer는 Node test count **7**, browser assertion 이름, source redirect literal과 실제 served response binding을 사용하므로 tests와 검증기를 함께 갱신한다. historical producer 기록을 수정하지 않는다. workspace scanner가 `.astro`와 `.astro` cache 경계를 이해하도록 검사도 보완한다.

Pages workflow와 release recipe는 같은 docs workspace `build:local`·typecheck·test·browser 명령과 `dist` 산출물을 사용한다. 승인된 현재 입력 변경을 반영한 뒤 generation은 optional adapter/Storybook dist를 숨겨도 같은 metadata와 동일한 609개 다운로드 경로·bytes를 만들어야 한다. 연속 두 clean build의 파일명·바이트가 같아야 한다. 이 재현성 비교는 같은 최신 입력 두 빌드 사이의 비교이며 전환 전 current-input snapshot bytes의 무조건 보존을 뜻하지 않는다. 현재 snapshot 변경은 위 allowlist/diff로 검토한다. 새 로컬 font 배포 위치·해시는 기존 distribution provenance/notice 생성기에 기록하고 license verification을 통과시킨다.

Chromium와 WebKit에서 전체 KRDS shell, 검색/모바일 탐색/TOC/복사/홈 예시의 키보드와 focus, 320px·데스크톱·200% 글자, 실제 48px Button과 폰트 세 weight 로드, axe, hydration/runtime 오류·외부 요청 0, SSR/no-JS 링크, `.html` 직접 접근·새로고침, 609개 download·법적 text/plain을 확인한다. 결과는 docs UI 검증이며 전체 native coverage나 release acceptance로 확대하지 않는다. 커밋·push·태그·게시·배포 실행 권한을 이 문서가 부여하지 않는다.

근거: [Astro Solid integration](https://docs.astro.build/en/guides/integrations-guide/solid-js/), [Astro 정적 출력 설정](https://docs.astro.build/en/reference/configuration-reference/#buildformat), [Astro 7.4.4 npm metadata](https://registry.npmjs.org/astro/7.4.4), [공식 Solid 1 integration package](https://github.com/withastro/astro/blob/main/packages/integrations/solid/package.json). 로컬 코드 근거는 `packages/solid/src/components/`, `packages/styles/src/reset.css`, `packages/fonts/provenance.json`, `apps/docs/tests/`, `tools/release-evidence/producers.mjs`다.
