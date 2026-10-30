# Tabs

Semantic ID `tabs`; export `Tabs`; source `component_04_10`: [KRDS Tabs](https://www.krds.go.kr/html/site/component/component_04_10.html). Read [common conventions](README.md).

## Official requirements

KRDS requires keyboard access and visible focus, a non-color selected-state cue, exposed selection state, and programmatic tablist/tab/tabpanel relationships. Its interaction table says all tabs are reachable with Tab/Shift+Tab and Click/Enter selects the focused tab. Preserve that sequential keyboard access; do not silently inherit a roving-tabindex backend default.

## Project API and defaults

Options: ordered `items` with unique nonempty string `value`, visible label, panel content and optional disabled flag; `value?: string`, `defaultValue?: string`, `activationMode: 'manual' | 'automatic'` (manual), `orientation: 'horizontal' | 'vertical'` (horizontal), `onValueChange(ValueChangeDetails<string>)`, required visible tablist label or aria-label/aria-labelledby, and stable instance/item IDs. Content is local; adapters use their native slots/children. No navigation URL or asynchronous load contract is implied. All panels stay mounted so local state survives selection changes; inactive panels have hidden and are absent from the tab and accessibility trees.

Default selection is defaultValue, otherwise the first enabled item; an empty/all-disabled list has no selection (`''`) and no active panel. A selected value must identify an enabled item, except `''` is valid for the no-enabled-items case. At least one enabled item therefore always has one selected panel. Prop updates containing an invalid selection are configuration errors; no automatic recovery silently selects a different item.

## Focus and activation policy

Every enabled tab has tabindex=0 (disabled tabs are natively disabled/tabindex=-1). Sequential Tab/Shift+Tab can visit all enabled tabs in DOM order; focus does not imply selection in manual mode. Panel follows tablist in reading order. The active panel has tabindex=0 only when it lacks a focusable first child; otherwise normal focus reaches its first focusable content. Hidden panels never receive focus.

Click or Enter/Space on a different enabled tab selects it exactly once. Native button click dispatch handles Enter/Space; do not dispatch another selection from keydown. Manual mode: arrows/Home/End move focus only; Enter/Space commits. Automatic mode is explicit opt-in for immediately available local panels: any focus movement onto a different enabled tab, including Tab and programmatic focus, requests selection exactly once. A subsequent click for that same focus/selection must not emit twice. Controlled parent rejection keeps the original selected panel while focus can remain on the requested tab; suppress paired focus/click duplicates for the same activation gesture, not future deliberate gestures.

Horizontal mode Left/Right moves to previous/next enabled tab; vertical mode Up/Down does so. Wrap at ends and skip disabled items. Home/End focus first/last enabled tab. Consume only the handled navigation keys; perpendicular arrows retain normal scrolling. Arrows are additive to KRDS sequential access, not a replacement. Neither selection nor keyboard navigation changes the URL, submits a form or moves focus into the panel. External selection changes render the correct panel without stealing focus or emitting a callback.

## Relationships, structure and acceptance

Use a named role=tablist, type=button role=tab controls, aria-selected=true/false, aria-controls pointing to stable panel IDs, and role=tabpanel with aria-labelledby pointing to its tab. Mark orientation on the tablist. Exactly one selected tab/visible panel exists when enabled items exist. No form name/value or reset behavior. Content errors belong inside the appropriate panel; tab selection does not clear them.

Parts: `root`, `list`, `trigger`, `panel`, optional decorative `indicator`. Trigger states: `selected`, `disabled`; panels: `active` or `inactive`. Selection cue and focus ring remain distinct. Acceptance: all enabled tabs sequentially reachable; manual focus does not switch panels; automatic opt-in handles one request per gesture; controlled rejection; disabled skipping/wrap; stable IDs, hidden content exclusion and state preservation; prop changes emit zero and never move focus.
