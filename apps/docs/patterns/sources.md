# 가이드, 출처 기록, 권리 {#guidance-provenance-and-rights}

패턴 예시는 이 프로젝트가 독립적으로 작성한 학습용 흐름입니다. 행정안전부 KRDS 가이드를 참조했지만 공식 기관 서비스가 아닙니다.

이 프로젝트가 직접 작성한 코드는 MIT 라이선스입니다. 라이선스 정보는 [`compliance/project-identity.json`](/sources/compliance/project-identity.json.txt)에 있습니다. MIT 라이선스는 KRDS의 텍스트, 디자인, 로고, 글꼴과 그 밖의 서드파티 자료에는 적용되지 않습니다. 이 자료들의 권리 표시는 [저작자 표시](/sources/ATTRIBUTION.md.txt)와 [서드파티 고지](/sources/THIRD-PARTY-NOTICES.md.txt)에 있습니다.

참조한 원본은 두 가지입니다.

- 컴포넌트 기준선은 `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`입니다. `upstream/krds/manifest.json` (checkout reference; [frozen component source records](/sources/catalog/components.json.txt))에 기록되어 있습니다.
- 패턴 가이드 페이지 8개는 컴포넌트 기준선과 별도로 받아 보존했습니다. 그래서 키트 1.1.0 시점의 웹사이트와 내용이 다를 수 있습니다. 원본 URL, 받은 시각, 크기, SHA-256은 [`evidence/sources.json`](/sources/docs/patterns/evidence/sources.json.txt)에 있습니다.

보존한 HTML은 참고 자료입니다. 그 안의 스크립트나 원격 자산을 예시에서 실행하거나 렌더링하지 않습니다. 예시는 원본 KRDS JavaScript를 복사하지 않았고 공식 이미지, 글꼴, 로고도 쓰지 않습니다.

## 소스-계약 매핑 {#source-to-contract-mapping}

아래 표는 예시의 어느 부분이 공식 가이드를 따랐고 어느 부분을 이 프로젝트가 정했는지 보여 줍니다.

| 공식 1차 소스 | 보존된 핵심 구간 | 이 프로젝트의 활용 |
| --- | --- | --- |
| [입력폼 / Input form](https://www.krds.go.kr/html/site/global/global_08.html) | [HTML](https://www.krds.go.kr/html/site/global/global_08.html): L919–1027 사용성, L1192–1246 접근성, L1252–1330 상호작용 | 레이블이 있는 구조화된 필드, 오류가 나도 입력값 유지, 필수 정보 표시, 오류가 난 필드로 이동해 수정. 링크가 달린 오류 요약, 구체적인 스키마, 로컬 접수증은 이 프로젝트가 정했습니다. |
| [오류 / Errors](https://www.krds.go.kr/html/site/global/global_07.html) | [HTML](https://www.krds.go.kr/html/site/global/global_07.html): L879–895, L1018–1030 | 눈에 보이는 설명과 수정 방법, 입력값 유지. 오류 문구와 재시도 시드는 이 프로젝트가 정했습니다. |
| [신청서 작성 / Application form](https://www.krds.go.kr/html/site/service/service_04_05.html) | [HTML](https://www.krds.go.kr/html/site/service/service_04_05.html): L890–957, L1047–1060 | 명확한 폼 섹션과 도움말, 다른 동작과 구분되는 리셋. 예시는 실제 기관 신청을 하지 않습니다. |
| [목록 탐색 / List browsing](https://www.krds.go.kr/html/site/global/global_04.html) | [HTML](https://www.krds.go.kr/html/site/global/global_04.html): L878–903, L1089–1109 | 검색, 필터, 페이지 이동을 갖춘 안정적인 목록 구조. 가상 행 12개와 페이지당 3개는 이 프로젝트가 정했습니다. |
| [필터링·정렬 / Filtering and sorting](https://www.krds.go.kr/html/site/global/global_10.html) | [HTML](https://www.krds.go.kr/html/site/global/global_10.html): L935–942, L983–1063, L1277–1289 | 즉시 적용과 일괄 적용의 구분, 레이블이 있는 옵션, 개수 안내, 초점 유지. 필터를 바꾸면 1페이지로 돌아가는 규칙은 이 프로젝트가 정했습니다. 예시에 정렬 기능은 없습니다. |
| [검색 결과 확인 / Search results](https://www.krds.go.kr/html/site/service/service_02_04.html) | [HTML](https://www.krds.go.kr/html/site/service/service_02_04.html): L881–963 | 로딩 표시, 검색어 유지, 결과 개수, 다음 행동을 안내하는 빈 상태. 검색은 단순한 부분 문자열 일치이며 실제 서비스의 관련도 검색이 아닙니다. |
| [동의 / Consent](https://www.krds.go.kr/html/site/global/global_03.html) | [HTML](https://www.krds.go.kr/html/site/global/global_03.html): L889–901, L1044–1065 | 구조화된 약관, 명시적 거부, 필수와 선택 항목의 구분, 키보드로 읽을 수 있는 내용. 약관은 가상이며 법적 동의나 개인정보를 수집하지 않습니다. |
| [확인·확정 / Confirmation and finalization](https://www.krds.go.kr/html/site/service/service_04_06.html) | [HTML](https://www.krds.go.kr/html/site/service/service_04_06.html): L870–910 | 확인과 취소 동작이 있는 간결한 확인 요약. 예시의 작업은 로컬에서 되돌릴 수 있으며 실제 기관 신청이 아닙니다. |

서비스 레이아웃 예시는 다음 컴포넌트 명세를 따릅니다. 각 명세에 원본 URL, 날짜, 해시가 있습니다.

- [헤더(Header)](/sources/specs/components/header.md.txt)
- [사이드 메뉴(SideNavigation)](/sources/specs/components/side-navigation.md.txt)
- [푸터(Footer)](/sources/specs/components/footer.md.txt)
- [건너뛰기 링크(SkipLink)](/sources/specs/components/skip-link.md.txt)
- [메인 메뉴(MainMenu)](/sources/specs/components/main-menu.md.txt)
- [공식 배너(Masthead)](/sources/specs/components/masthead.md.txt)
- [운영기관 식별자(Identifier)](/sources/specs/components/identifier.md.txt)

예시는 정부 서비스가 아닙니다. 그래서 공식 기관임을 나타내는 문구를 이 프로젝트의 것처럼 표시하지 않습니다.

폼, 검색, 확인 예시는 다음 컴포넌트 명세도 따릅니다.

- [버튼(Button)](/sources/specs/components/button.md.txt)
- [셀렉트(NativeSelect)](/sources/specs/components/native-select.md.txt)
- [텍스트 입력 필드(TextInput)](/sources/specs/components/text-input.md.txt)
- [텍스트 영역(Textarea)](/sources/specs/components/textarea.md.txt)
- [라디오 버튼(RadioGroup)](/sources/specs/components/radio-group.md.txt)
- [모달(Modal)](/sources/specs/components/modal.md.txt)
- [구조화 목록(StructuredList)](/sources/specs/components/structured-list.md.txt)
- [페이지네이션(Pagination)](/sources/specs/components/pagination.md.txt)
- [스피너(Spinner)](/sources/specs/components/spinner.md.txt)

## 보충 소스 해시 {#supplemental-source-hashes}

보존한 가이드 페이지의 크기와 해시입니다. 받은 시각은 `evidence/sources.json`에 있습니다.

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


> 보존된 공식 원본 HTML은 이 사이트로 배포하지 않습니다. 위 공식 링크가 1차 출처입니다.
