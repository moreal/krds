# Header, SideNavigation and Footer layout

Route `/examples/service-layout`; case IDs `skip-main`, `navigate-current`, `narrow-navigation`, `footer-policy`. Compose the actual native `SkipLink`, `Header`, `MainMenu`, `SideNavigation`, `Link` and `Footer` around one real `<main>` with a heading. A wrapper containing three placeholders is not this composition.

Use `demoIdentity.name` for the service and visibly show its independent-project notice. `governmentService=false`: this page makes no official government-service claim and displays no official Masthead as its own identity. Do not fabricate an agency, institutional relationship, contact, approval mark or copyright holder. Native owners may reuse an already cleared local independent service mark from their own fixture assets; record the exact asset/provenance in their native evidence. The common contract supplies no unverified remote image or font. Omit optional institutional Identifier here because there is no genuine agency relationship; component specimens remain separate from this independent service page.

Order: document-first SkipLink, Header identity/utilities/search/navigation, page body containing named SideNavigation plus main content, Footer last. SkipLink `본문 바로가기` targets real heading `example-main-heading` with `tabindex=-1`. Named landmarks distinguish main navigation `주요 메뉴` from sidebar `예제 메뉴`. The heading text/body come from `layoutSections`; the sidebar and MainMenu both use `layoutNavigation`. Current destination is a page identity, separate from branch expansion.

| Section ID | Visible title |
| --- | --- |
| `overview` | 예제 소개 |
| `form` | 입력폼 연습 |
| `search` | 검색 연습 |
| `consent` | 동의 연습 |
| `accessibility` | 키보드 이용 안내 |
| `privacy` | 개인정보 처리방침 |

The initial page is `overview`; initial expanded IDs are `['examples']`. Expanding `help` leaves `examples` open and does not change the current page. Selecting a destination also expands its containing branch without collapsing other branches, so Footer navigation to privacy exposes the newly current sidebar link. Collapsing a branch hides its descendants from focus/a11y; if focus was inside, use the native SideNavigation trigger-return behavior. Native anchors have real same-origin `?case=<case>&section=<id>` URLs generated through URLSearchParams. Read/validate `section` on first URL load, handle back/forward, and keep `aria-current=page`, heading and URL synchronized. Modified clicks retain normal navigation behavior. A same-document accepted `navigate` closes mobile navigation and focuses the newly rendered main heading; this is a host effect after the section commits.

On a narrow viewport, Header MainMenu must expose every sidebar destination before the sidebar is hidden. Opener ID `example-layout-mobile-open`, text `전체메뉴`. Use real MainMenu focus and close semantics; after navigating, the new main heading is the destination. Closing without navigating restores the actual opener. Do not hide the only available route or trap focus in the desktop sidebar.

Activating the current destination still closes an open mobile layer or reopens a collapsed containing branch and focuses the main heading; the route identity stays unchanged and no route-change notification is invented. Only a current destination whose branch is already visible with no open mobile layer is a genuine no-op, with no focus effect.

Footer includes the local independent service identity, a visibly distinguished `개인정보 처리방침` link to `section=privacy`, a local `키보드 이용 안내` link to `section=accessibility`, and the explicit independent-code/KRDS rights text from `demoIdentity`. Contact collection is empty because no support service is offered; do not invent tel/mail values to fill a slot. The privacy section states that this demo does not transmit or permanently store input. Use a min-height page layout to place Footer below short content without overlaying it; stack the same logical content order at 360px and 200% text zoom.

Success means keyboard entry reaches SkipLink before repeated navigation, both branch disclosures can remain open, current route is accurate, narrow navigation reaches the same six local destinations, Footer links expose real local content, and no focused control is hidden behind sticky regions. This layout has no request lifecycle: injecting a fake loading/error response would misrepresent its behavior. Its presentation snapshot is `krds-pattern-service-layout--default`; native story args may vary viewport/text length without starting requests.

Guidance basis is the accepted source-backed [Header](../../specs/components/header.md), [SideNavigation](../../specs/components/side-navigation.md), [Footer](../../specs/components/footer.md), [SkipLink](../../specs/components/skip-link.md), [MainMenu](../../specs/components/main-menu.md) and identity eligibility contracts. It also supplies the page context for the three basic/service flows. No new official layout-pattern requirement is invented; see [source mapping](../../docs/patterns/sources.md).
