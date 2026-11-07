# 가이드, 출처 기록, 권리 {#guidance-provenance-and-rights}

예시는 독립적으로 작성한 로컬 학습 흐름입니다. 행정안전부 KRDS 가이드를 참조하며 공식 기관 서비스도, 저장소가 KRDS 자료를 소유한다는 주장도 아닙니다. [`compliance/project-identity.json`](/sources/compliance/project-identity.json.txt)에서 확인된 독립 코드 보유자/허가는 Lee Dogeon &lt;dev.moreal@gmail.com>의 2026 MIT입니다. 이 허가는 KRDS 텍스트, 디자인, 로고, 글꼴, 기타 서드파티 자료를 재라이선스하지 않습니다. 패키지 범위/저장소 소유권은 인증되지 않았고 게시는 승인되지 않았습니다.

기존 컴포넌트 기준선은 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`이며 `upstream/krds/manifest.json` (checkout reference; [frozen component source records](/sources/catalog/components.json.txt))에 기록되어 있습니다. T00은 기본/서비스 패턴 상세 페이지를 가져오지 않았습니다. 그래서 T11은 필요한 페이지 8개를 별도의 보충 웹사이트 스냅샷 `t11-pattern-guidance-2026-10-30`으로 고정했습니다. 이 스냅샷이 키트 태그 1.1.0 시점의 웹사이트라고 주장하지 않습니다. 실제 소스 URL, 가져온 시각, 바이트 길이, SHA-256은 [`evidence/sources.json`](/sources/docs/patterns/evidence/sources.json.txt)에 기록되어 있고 원본 HTML이 함께 보존되어 있습니다. 실패한 표준 전송 시도도 여기에 남아 있으며, 이어서 브라우저 user-agent curl 가져오기가 성공했습니다. 가져오지 못한 페이지를 가져온 것처럼 조용히 표시하지 않습니다.

보존된 HTML은 참조 근거일 뿐입니다. 내장 스크립트, 원격 자산, 공식 신원 주장을 네이티브 예시로 실행/렌더링하거나, 같은 DOM을 제어하는 Ark/Zag와 결합하면 안 됩니다. 이 작업은 원본 소스 JavaScript를 어댑터에 복사하지 않으며 공식 이미지/글꼴/로고도 import하지 않습니다. 근거와 원본 KRDS 저작자 표시를 독립적으로 작성한 코드와 분리해 둡니다. 기존 [저작자 표시](/sources/ATTRIBUTION.md.txt), [서드파티 고지](/sources/THIRD-PARTY-NOTICES.md.txt), 고정된 소스 권리 기록은 계속 적용됩니다. 보충 근거는 공개 아티팩트를 준비하기 전에 컨트롤러/릴리스 출처 검토를 통과해야 합니다.

## 소스-계약 매핑 {#source-to-contract-mapping}

| 공식 1차 소스 | 보존된 핵심 구간 | 이 프로젝트의 활용 |
| --- | --- | --- |
| [입력폼 / Input form](https://www.krds.go.kr/html/site/global/global_08.html) | [HTML](https://www.krds.go.kr/html/site/global/global_08.html): L919–1027 사용성, L1192–1246 접근성, L1252–1330 상호작용 | 레이블 있는 구조화된 필드, 오류 값 유지, 필수 정보 명시, 필드 대상 오류 수정. 연결된 요약, 정확한 스키마, 로컬 접수증은 독립 샘플 정책입니다. |
| [오류 / Errors](https://www.krds.go.kr/html/site/global/global_07.html) | [HTML](https://www.krds.go.kr/html/site/global/global_07.html): L879–895, L1018–1030 | 눈에 보이는 설명과 수정 경로, 입력 유지. 공유 모델의 오류 문구와 재시도 시드는 독립적입니다. |
| [신청서 작성 / Application form](https://www.krds.go.kr/html/site/service/service_04_05.html) | [HTML](https://www.krds.go.kr/html/site/service/service_04_05.html): L890–957, L1047–1060 | 명확한 폼 섹션/도움말과 구분되는 리셋 동작. 샘플은 소스가 설명하는 기관 신청을 수행하지 않습니다. |
| [목록 탐색 / List browsing](https://www.krds.go.kr/html/site/global/global_04.html) | [HTML](https://www.krds.go.kr/html/site/global/global_04.html): L878–903, L1089–1109 | 검색/필터/페이지 접근이 있는 안정적이고 의미 있는 목록 구조. 가상 행 12개와 페이지당 3개는 독립 샘플 선택입니다. |
| [필터링·정렬 / Filtering and sorting](https://www.krds.go.kr/html/site/global/global_10.html) | [HTML](https://www.krds.go.kr/html/site/global/global_10.html): L935–942, L983–1063, L1277–1289 | 즉시/일괄 구분 명시, 레이블 있는 옵션, 개수 안내, 초점 유지. 필터 뒤 페이지 리셋은 T11이 정한 호스트 통합 규칙입니다. 이 샘플은 정렬 기능을 주장하지 않습니다. |
| [검색 결과 확인 / Search results](https://www.krds.go.kr/html/site/service/service_02_04.html) | [HTML](https://www.krds.go.kr/html/site/service/service_02_04.html): L881–963 | 로딩 피드백, 유지된 검색어, 결과 개수, 실행 가능한 빈 상태. 투명한 부분 문자열 매처는 프로덕션 관련도 엔진이 아닙니다. |
| [동의 / Consent](https://www.krds.go.kr/html/site/global/global_03.html) | [HTML](https://www.krds.go.kr/html/site/global/global_03.html): L889–901, L1044–1065 | 구조화된 약관, 명시적 거부, 구분되는 필수/선택 항목, 키보드로 읽을 수 있는 콘텐츠. 이 가상 약관은 법적 동의나 개인정보를 수집하지 않습니다. |
| [확인·확정 / Confirmation and finalization](https://www.krds.go.kr/html/site/service/service_04_06.html) | [HTML](https://www.krds.go.kr/html/site/service/service_04_06.html): L870–910 | 확인/취소 동작이 있는 간결한 확인 요약. 실제 로컬 작업은 되돌릴 수 있으며 되돌릴 수 없는 기관 신청으로 잘못 설명하지 않습니다. |

레이아웃 구성은 이미 고정된 컴포넌트 근거를 사용합니다. 승인된 [헤더(Header)](/sources/specs/components/header.md.txt), [사이드 메뉴(SideNavigation)](/sources/specs/components/side-navigation.md.txt), [푸터(Footer)](/sources/specs/components/footer.md.txt), [건너뛰기 링크(SkipLink)](/sources/specs/components/skip-link.md.txt), [메인 메뉴(MainMenu)](/sources/specs/components/main-menu.md.txt), [공식 배너(Masthead)](/sources/specs/components/masthead.md.txt), [운영기관 식별자(Identifier)](/sources/specs/components/identifier.md.txt) 명세입니다. 이 파일들에 정확한 URL, 날짜, 해시, 소스 매핑이 있습니다. `governmentService=false`와 기관 관계 부재는 의도된 독립 신원 사실입니다. 공식 자격 문구를 저장소의 서비스 주장으로 표시하지 않습니다.

폼, 검색, 확인 구성은 이미 승인된 [버튼(Button)](/sources/specs/components/button.md.txt), [셀렉트(NativeSelect)](/sources/specs/components/native-select.md.txt), [텍스트 입력 필드(TextInput)](/sources/specs/components/text-input.md.txt), [텍스트 영역(Textarea)](/sources/specs/components/textarea.md.txt), [라디오 버튼(RadioGroup)](/sources/specs/components/radio-group.md.txt), [모달(Modal)](/sources/specs/components/modal.md.txt), [구조화 목록(StructuredList)](/sources/specs/components/structured-list.md.txt), [페이지네이션(Pagination)](/sources/specs/components/pagination.md.txt), [스피너(Spinner)](/sources/specs/components/spinner.md.txt) 계약도 사용합니다. 이는 계약의 시맨틱 재사용이며 모든 컴포넌트/프레임워크의 구현이 인수되었다는 주장이 아닙니다.

## 보충 소스 해시 {#supplemental-source-hashes}

아래 표는 실제 고정 바이트 manifest에서 생성했습니다. 전체 가져온 시각은 `evidence/sources.json`에 있습니다.

| 보존된 소스 | 바이트 | SHA-256 |
| --- | ---: | --- |
| [global_03.html](https://www.krds.go.kr/html/site/global/global_03.html) | 69170 | `e65c933813ba7204feb8fe4baf0447a530533a6781888ceefca14cde1a4c3fd1` |
| [global_04.html](https://www.krds.go.kr/html/site/global/global_04.html) | 67936 | `3448f7bbc670a2314e8b21cd9bf50cdf807e3f71471d717745ecb9a0383390d2` |
| [global_07.html](https://www.krds.go.kr/html/site/global/global_07.html) | 60767 | `2e3226613b577aa2c393a4e88c61f48f5be342076df97d40fae18fa97f2f7a7c` |
| [global_08.html](https://www.krds.go.kr/html/site/global/global_08.html) | 86512 | `0c14715d58c29e6266bbc5e024f88073ae3531a0ef3fa15f8d1be4fdc946d607` |
| [global_10.html](https://www.krds.go.kr/html/site/global/global_10.html) | 88485 | `c9fffec80a3f3049341b5f60ad1d2b10c7a84c0df95fcc90c022bda7f66abae9` |
| [service_04_05.html](https://www.krds.go.kr/html/site/service/service_04_05.html) | 68976 | `f79037668f57aeeae205fc0f09928d17a3c1630ed28c6186e69d0808406a5d76` |
| [service_04_06.html](https://www.krds.go.kr/html/site/service/service_04_06.html) | 56817 | `14388b752aa7a838b6e29e26e19290ddf65c08e4b98fb18ced7190e6c477abff` |
| [service_02_04.html](https://www.krds.go.kr/html/site/service/service_02_04.html) | 63411 | `f61eee2af5275549fd80ad631c61ac536ad15d69b7ecfee0058b183a954d8e8c` |



> 저장소 참고: 보존된 공식 원본 HTML은 체크아웃의 근거 트리에만 둡니다. 사이트 콘텐츠로 배포하지 않습니다. 위 공식 링크가 1차 출처입니다. 고정된 출처 기록에 수집 시각과 해시가 남아 있습니다.
