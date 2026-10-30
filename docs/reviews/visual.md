# Visual review status

A final full-catalog visual acceptance has not been completed on frozen sources. Renderer-owned story/catalog reports retain normal, narrow, forced-colors and reduced-motion screenshots where actually executed. Screenshots or media emulation alone are not a human acceptance result.

Required review includes desktop and small-screen layouts; keyboard focus and selected/disabled/invalid states; overflowing long content; modal, popover and bottom-sheet layering; date range errors; required actions in help/tutorial; visible notification outcomes; and high-contrast/reduced-motion behavior. Real 200%/400% browser zoom is an external gate in [manual-gates.json](manual-gates.json). Do not treat CSS zoom or a smaller viewport as that check.

T13's browser launch probes validate the selected Chromium 156.0.8078.4, Firefox 157.0 and WebKit 27.2 on this macOS host. They establish browser availability and time-zone contexts, not visual or catalog acceptance. The Firefox application-data isolation is documented in [testing-matrix.md](testing-matrix.md).
