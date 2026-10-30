# Locale and date-only values

Pass locale and direction through the native provider/context facilities. Providers should not mutate the document language or touch a global document at import time. If the application owns multiple documents or an embedded surface, use that adapter's explicit owner-document path.

## Dates are not timestamps

Calendar and DateInput use strict Gregorian `YYYY-MM-DD` values in years 0001–9999. The shared date helpers parse and calculate date-only parts without a timezone conversion. Do not run a date-only string through `new Date(...)` and local formatting; that can shift the day across timezones. Supply an explicit reference date rather than relying on the current clock.

A date range is `{ start: string | null, end: string | null }`. Keep incomplete drafts separate from committed values. The component specification defines min/max, disabled dates, ordering, confirmation and no-op behavior.

## Localized labels and keyboard use

Korean Calendar cells display the day template `{day}일`; English displays `{day}`. Full accessible date/state names remain distinct from that visible template. The Calendar uses a native six-row, seven-column table, with any narrow/high-zoom scrolling confined to its table region. It is not an ARIA grid substituted from an unrelated example.

Every enabled Calendar date and every enabled Tabs tab remains a sequential Tab stop, following the reviewed KRDS contract. Arrows add navigation rather than replacing sequential access. [Calendar](../components/calendar), [DateInput](../components/date-input) and [Tabs](../components/tabs) contain their exact keyboard contracts.

Native verification must include different timezone contexts, locale updates and controlled rejection. A correct shared helper alone does not verify the framework renderer, hydration or application labels.
