# Guidance, provenance and rights

The examples are independently authored local learning flows. They refer to Ministry of the Interior and Safety KRDS guidance, not to an official agency service or an assertion that the repository owns KRDS materials. The confirmed independent-code holder/grant in [`compliance/project-identity.json`](/sources/compliance/project-identity.json.txt) is Lee Dogeon &lt;dev.moreal@gmail.com>, 2026 MIT. That grant does not relicense KRDS text, designs, logos, fonts or other third-party materials. Scope/repository ownership remains unauthenticated and publication is not authorized.

The existing component baseline is `krds-web-2026-10-30-kit-1.1.0-d6bb184c823e`, recorded in `upstream/krds/manifest.json` (checkout reference; [frozen component source records](/sources/catalog/components.json.txt)). T00 did not fetch the basic/service-pattern detail pages. T11 therefore froze eight needed pages in the separate supplemental website snapshot `t11-pattern-guidance-2026-10-30`. This snapshot is not asserted to be the website at kit tag 1.1.0. Each actual source URL, retrieval time, byte length and SHA-256 is recorded in [`evidence/sources.json`](/sources/docs/patterns/evidence/sources.json.txt); raw HTML is preserved alongside it. Failed standard transport attempts are retained there, followed by successful browser-user-agent curl retrievals. No missing page is silently presented as fetched.

The preserved HTML is reference evidence only. Its embedded scripts, remote assets and official identity claims must never be executed/rendered as the native examples or combined with Ark/Zag controlling the same DOM. This task copies no original source JavaScript into adapters and imports no official images/fonts/logos. Keep evidence and original KRDS attribution separate from independently authored code. Existing [attribution](/sources/ATTRIBUTION.md.txt), [third-party notices](/sources/THIRD-PARTY-NOTICES.md.txt) and the frozen source rights records remain applicable; supplementary evidence must pass controller/release provenance review before any public artifact preparation.

## Source-to-contract mapping

| Official primary source | Preserved substantive section | How this project uses it |
| --- | --- | --- |
| [입력폼 / Input form](https://www.krds.go.kr/html/site/global/global_08.html) | [HTML](https://www.krds.go.kr/html/site/global/global_08.html): L919–1027 usability, L1192–1246 accessibility, L1252–1330 interaction | Labeled/structured fields, retained erroneous values, explicit required information and field-targeted error correction. The linked summary, exact schema and local receipt are independent sample policy. |
| [오류 / Errors](https://www.krds.go.kr/html/site/global/global_07.html) | [HTML](https://www.krds.go.kr/html/site/global/global_07.html): L879–895, L1018–1030 | Visible explanations and correction paths, input retention. The shared model's error text and retry seed are independent. |
| [신청서 작성 / Application form](https://www.krds.go.kr/html/site/service/service_04_05.html) | [HTML](https://www.krds.go.kr/html/site/service/service_04_05.html): L890–957, L1047–1060 | Clear form sections/help and a distinct reset action. The sample does not perform the institutional application described in the source. |
| [목록 탐색 / List browsing](https://www.krds.go.kr/html/site/global/global_04.html) | [HTML](https://www.krds.go.kr/html/site/global/global_04.html): L878–903, L1089–1109 | Stable, meaningful list structure with search/filter/page access. Twelve fictional rows and three-per-page are independent sample choices. |
| [필터링·정렬 / Filtering and sorting](https://www.krds.go.kr/html/site/global/global_10.html) | [HTML](https://www.krds.go.kr/html/site/global/global_10.html): L935–942, L983–1063, L1277–1289 | Explicit immediate/batch distinction, labeled options, count announcement and focus retention. Resetting page after a filter is the host integration rule fixed by T11. No sort feature is claimed by this sample. |
| [검색 결과 확인 / Search results](https://www.krds.go.kr/html/site/service/service_02_04.html) | [HTML](https://www.krds.go.kr/html/site/service/service_02_04.html): L881–963 | Loading feedback, retained query, result counts and an actionable empty state. The transparent substring matcher is not a production relevance engine. |
| [동의 / Consent](https://www.krds.go.kr/html/site/global/global_03.html) | [HTML](https://www.krds.go.kr/html/site/global/global_03.html): L889–901, L1044–1065 | Structured terms, explicit refusal, distinguishable required/optional choices and keyboard-readable content. These fictional terms collect no legal consent or personal information. |
| [확인·확정 / Confirmation and finalization](https://www.krds.go.kr/html/site/service/service_04_06.html) | [HTML](https://www.krds.go.kr/html/site/service/service_04_06.html): L870–910 | Compact confirmation summary with confirm/cancel actions. The actual local operation is reversible and is not falsely described as an irreversible agency application. |

The layout composition uses the already frozen component evidence in the approved [Header](/sources/specs/components/header.md.txt), [SideNavigation](/sources/specs/components/side-navigation.md.txt), [Footer](/sources/specs/components/footer.md.txt), [SkipLink](/sources/specs/components/skip-link.md.txt), [MainMenu](/sources/specs/components/main-menu.md.txt), [Masthead](/sources/specs/components/masthead.md.txt) and [Identifier](/sources/specs/components/identifier.md.txt) specs. Those files contain their exact URLs, dates, hashes and source mappings. `governmentService=false` and the absence of an agency relationship are intentional independent identity facts; do not display official eligibility text as the repository's service claim.

The form, search and confirmation compositions also consume already approved [Button](/sources/specs/components/button.md.txt), [NativeSelect](/sources/specs/components/native-select.md.txt), [TextInput](/sources/specs/components/text-input.md.txt), [Textarea](/sources/specs/components/textarea.md.txt), [RadioGroup](/sources/specs/components/radio-group.md.txt), [Modal](/sources/specs/components/modal.md.txt), [StructuredList](/sources/specs/components/structured-list.md.txt), [Pagination](/sources/specs/components/pagination.md.txt) and [Spinner](/sources/specs/components/spinner.md.txt) contracts. This is semantic reuse of those contracts, not a claim of implementation acceptance for every component/framework.

## Supplemental source hashes

The following table is generated from the actual frozen-byte manifest. Full retrieval timestamps are in `evidence/sources.json`.

| Preserved source | Bytes | SHA-256 |
| --- | ---: | --- |
| [global_03.html](https://www.krds.go.kr/html/site/global/global_03.html) | 69170 | `e65c933813ba7204feb8fe4baf0447a530533a6781888ceefca14cde1a4c3fd1` |
| [global_04.html](https://www.krds.go.kr/html/site/global/global_04.html) | 67936 | `3448f7bbc670a2314e8b21cd9bf50cdf807e3f71471d717745ecb9a0383390d2` |
| [global_07.html](https://www.krds.go.kr/html/site/global/global_07.html) | 60767 | `2e3226613b577aa2c393a4e88c61f48f5be342076df97d40fae18fa97f2f7a7c` |
| [global_08.html](https://www.krds.go.kr/html/site/global/global_08.html) | 86512 | `0c14715d58c29e6266bbc5e024f88073ae3531a0ef3fa15f8d1be4fdc946d607` |
| [global_10.html](https://www.krds.go.kr/html/site/global/global_10.html) | 88485 | `c9fffec80a3f3049341b5f60ad1d2b10c7a84c0df95fcc90c022bda7f66abae9` |
| [service_04_05.html](https://www.krds.go.kr/html/site/service/service_04_05.html) | 68976 | `f79037668f57aeeae205fc0f09928d17a3c1630ed28c6186e69d0808406a5d76` |
| [service_04_06.html](https://www.krds.go.kr/html/site/service/service_04_06.html) | 56817 | `14388b752aa7a838b6e29e26e19290ddf65c08e4b98fb18ced7190e6c477abff` |
| [service_02_04.html](https://www.krds.go.kr/html/site/service/service_02_04.html) | 63411 | `f61eee2af5275549fd80ad631c61ac536ad15d69b7ecfee0058b183a954d8e8c` |



> Repository reference note: preserved raw official HTML stays in the checkout evidence tree and is not distributed as site content. Official links above identify the primary source; frozen source records retain its retrieval time and hash.
