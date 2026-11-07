/**
 * Plan Task 3: on a component page with native demos, the historical `native-availability`
 * section (its h2 and everything up to the next h2) moves to the end of the page, below API,
 * keeping every anchor. Shared by generate-routes and the pipeline test so they cannot drift.
 * `headingOf(item)` returns `{id, level}` for a heading item, otherwise null.
 */
export const NATIVE_AVAILABILITY_ID = 'native-availability';
export function moveNativeAvailabilityLast(items, headingOf) {
 const start = items.findIndex(item => headingOf(item)?.id === NATIVE_AVAILABILITY_ID);
 if (start < 0) return items.slice();
 const end = items.findIndex((item, index) => index > start && headingOf(item)?.level === 2);
 const stop = end < 0 ? items.length : end;
 return [...items.slice(0, start), ...items.slice(stop), ...items.slice(start, stop)];
}
