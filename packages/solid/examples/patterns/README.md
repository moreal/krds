# Solid 1 service presentation components

These source examples compose the built public `@unofficial-krds/solid` controls through native Solid JSX. They are shared by the fixture and Storybook apps through their existing library dependency. They are not a public package export or a packed-example support claim.

`FormPresentation`, `SearchPresentation`, `ConsentPresentation` and `LayoutPresentation` accept explicit view props and semantic callbacks. They own native DOM, forms and display lifecycle. They do not import private test contracts, scenarios or a local request driver. The consuming app maps its state into the props and implements completion, URL/history and focus effects. Story inputs are cloned plain snapshots.

The form uses actual TextInput, NativeSelect, Textarea, Button and Spinner. Search uses TextInput, NativeSelect, StructuredList, Pagination, Button and Spinner. Consent uses RadioGroup and the actual Modal portal, plus Button and Spinner. Layout uses actual SkipLink, Header (including its own MainMenu), SideNavigation, Link and Footer. Plain sections, headings, descriptions and the linked error summary are host semantics rather than invented adapter exports.

`independent-mark.svg` is an independently authored text/frame image for the fictional independent service. It copies no KRDS or agency logo, embeds no font and requests no remote resource. The independent project identity and separate KRDS rights notices are supplied by the host. Source guidance and release clearance remain separate from this example asset.
