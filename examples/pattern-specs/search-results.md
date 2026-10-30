# Search, filter, list and pagination

Route `/examples/search-results`; case IDs `filter-resets-page`, `empty-results`, `retry-success`, `query-during-loading`. Title `로컬 자료 검색`. Display independent identity and explain that all twelve resources are fictional learning records.

Compose native `TextInput` (`type=search`), `NativeSelect`, `Button`, `StructuredList`, `Pagination`, `Spinner`. A real search form contains one query control `example-search-query`, visible label `검색어`, name `query`, and submit `example-search-submit` (`검색`). The category select `example-search-category` has label `자료 유형`, with options 전체/가이드/예제/참고 from `resourceCategories`. Filter changes apply immediately, while query editing applies only on explicit search submission. Prevent composing Enter from being treated as an extra submit.

Use the twelve literal resources in `content.ts`, in their stable supplied order. Match every whitespace-separated lowercased query token against title plus summary, then intersect the selected category. This transparent local algorithm is a sample policy, not a production search engine or KRDS relevance ranking implementation. Empty query matches the category. Page size is always three; viewport changes never change it. Total and page count derive from the matched dataset. An empty result has `total=0`, `pageCount=0`, internal `page=1`, with no numbered pagination rendered.

`query` is editable text; `appliedQuery` describes the displayed successful result. Each request captures an immutable payload. If the user edits text during loading, completion still describes the submitted query. Filter/page actions operate on the last applied query; pressing `검색` commits the current draft. Error retry repeats the failed payload, even if the draft has changed. While loading or error, keep the query/filter UI and announce status, but do not label stale items or counts as successful results for the new criteria. Stored previous items may stay in memory; the presentation hides them until successful completion.

| Event | State and expected native outcome |
| --- | --- |
| `query` | Edit draft only, without a request or focus movement. |
| `search` | Request current draft/category at page 1. Keep submit focus. |
| `filter` to a different category | Request applied query/new category at page 1. Keep focus on the changed category select. |
| `page` within range | Request current applied query/category at that page; current/out-of-range values do not start a request. |
| Successful completion | Show the returned slice and a polite result-count announcement. Preserve the activating control's context. |
| Failure | Show explicit error plus `example-search-retry` (`다시 시도`); retain draft and filter selection. |
| `retry` | Repeat the exact failed payload, then announce actual completion. |
| Late reply for a replaced request | Ignore it; never replace newer category/results. |

Result-count region ID `example-search-count`, `aria-live=polite`, displays the applied query, category and total. Results are a semantic list of native StructuredList items with consistent title, category/date metadata and summary. Titles are plain readable headings; this flow has no fake detail/share/download links. Resource IDs are stable row IDs, not invented external destinations. Configured list behavior here is search/filter/pagination; this example does not prove every optional StructuredList feature.

Place named Pagination after the list. Page links have real same-origin URLs generated with `URLSearchParams`, preserving `case`, `query` and `category` and setting `page`. Current page has no href and announces current state according to the accepted Pagination contract. A normal primary same-document click may update host state and URL; modified clicks and native link behavior must remain available. On a fresh URL, validate its query/category/page and initialize the same successful local slice. Native owners handle URL hydration; the pure model does not read `location`. Empty results instead show `검색 결과가 없습니다. 검색어나 자료 유형을 바꿔 보세요.` with editable controls retained.

`filter-resets-page` starts at unfiltered page 3. Selecting 예제 must show page 1 and then resource-02/05/08, 4 matches and 2 pages. Page 2 shows resource-11. This must work by keyboard and at 360px/200% text zoom. `query-during-loading` searches 접근성, edits the draft to 대화상자, and must still show four results labeled 접근성 after settling.

Story snapshots: `krds-pattern-search-results--success/loading/error/empty`. All are local props/data, with no automatic search requests. Integration tests drive real search/filter/page actions and explicit local completion separately.

Guidance basis: [KRDS list browsing](https://www.krds.go.kr/html/site/global/global_04.html), [filtering/sorting](https://www.krds.go.kr/html/site/global/global_10.html), [search results](https://www.krds.go.kr/html/site/service/service_02_04.html), and accepted [Pagination](../../specs/components/pagination.md)/[StructuredList](../../specs/components/structured-list.md) contracts. The fixed page size, matching algorithm, route shape and request IDs are independent sample policy; see [evidence](../../docs/patterns/sources.md).
