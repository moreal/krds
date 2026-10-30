# Source typecheck evidence

Command: `node tools/yarn.mjs workspace @krds-native/solid typecheck`.
Observed tool return: exit_code 0, output empty (twice after contracts build, latest after hidden-only panel focusability fix).

An initial invocation before shared helper public build returned exit_code 2 with four Calendar-only missing exported members: addDays, addMonths, calendarMonthGrid, weekday. No owned Modal/Tabs diagnostics occurred. This dependency readiness failure was reported to lead; fresh later invocations passed.
