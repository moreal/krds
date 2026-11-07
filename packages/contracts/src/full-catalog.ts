/** Independent semantic contracts. Native content, refs and event transport belong to each adapter.
 * These types are not renderers. See the complete source-backed specs/components contracts. */
import type { OpenChangeDetails, SelectOption, ValueChangeDetails } from './types.js';
export interface ControlledValue<T> { value?: T; defaultValue?: T; onValueChange?: (detail: ValueChangeDetails<T>) => void; }
export interface ControlledOpen { open?: boolean; defaultOpen?: boolean; onOpenChange?: (detail: OpenChangeDetails) => void; }
export interface FieldContract { id?: string; name?: string; label: string; disabled?: boolean; required?: boolean; invalid?: boolean; helpId?: string; errorId?: string; }
export interface LinkData { id?: string; label: string; href: string; target?: string; rel?: string; }
export interface LogoData { src: string; alt: string; }
export interface NavigationItem { id: string; label: string; href?: string; description?: string; children?: readonly NavigationItem[]; }
export type Size = 'small' | 'medium' | 'large';
export interface MastheadContract { governmentService: boolean; }
export interface IdentifierContract { institutionName: string; logo: LogoData; relationshipText: string; theme?: 'light' | 'dark'; }
export interface HeaderContract { currentId?: string; mobileOpen?: boolean; defaultMobileOpen?: boolean; onMobileOpenChange?: (detail: OpenChangeDetails) => void; mobileTriggerId?: string; mobileTriggerLabel?: string; navigationLabel?: string; home: LinkData & {logo: LogoData}; utilityItems: readonly (LinkData & {id: string})[]; search?: {label: string; onRequest: () => void}; mainNavigation: readonly NavigationItem[]; actionLayout?: 'vertical' | 'horizontal'; sticky?: boolean; }
export interface FooterContract { serviceLogo: LogoData; contacts: readonly {label: string; href?: string; text: string}[]; utilityLinks: readonly LinkData[]; privacyPolicy: LinkData; policyLinks: readonly LinkData[]; copyrightText: string; institution?: IdentifierContract; }
export interface SkipLinkContract { links: readonly {id: string; label: string; targetId: string}[]; visibility?: 'focus-revealed' | 'visible'; }
export interface MainMenuContract { label?: string; mobileTriggerId?: string; mobileTriggerLabel?: string; items: readonly NavigationItem[]; currentId?: string; expandedId?: string | null; defaultExpandedId?: string | null; onExpandedChange?: (detail: {id: string | null}) => void; mobileOpen?: boolean; defaultMobileOpen?: boolean; onMobileOpenChange?: (detail: OpenChangeDetails) => void; query?: string; onQueryChange?: (detail: ValueChangeDetails<string>) => void; }
export interface BreadcrumbContract { items: readonly {id: string; label: string; href?: string}[]; home: LinkData; currentItem?: {id: string; label: string}; omitCurrent?: boolean; maxVisible?: number; }
export interface SideNavigationContract { items: readonly NavigationItem[]; currentId?: string; expandedIds?: readonly string[]; defaultExpandedIds?: readonly string[]; onExpandedChange?: (detail: {ids: readonly string[]}) => void; title?: string; parentLink?: LinkData; }
export interface InPageSection { id: string; label: string; children?: readonly InPageSection[]; }
export interface InPageNavigationContract { sections: readonly InPageSection[]; title?: string; activeId?: string; onActiveChange?: (detail: {id: string; reason: 'scroll' | 'activation'}) => void; narrowMode?: 'inline' | 'disclosure'; }
export interface PaginationContract { page?: number; defaultPage?: number; pageCount: number; hrefForPage: (page: number) => string; onPageChange?: (detail: {page: number}) => void; variant?: 'number-links' | 'direct-page' | 'load-more'; loadMore?: {shown: number; total: number; pending: boolean; firstNewItemId?: string; onLoadMore: () => void}; }
/** Text is plain data. Rich native content uses adapter-owned slots keyed by item ID. */
export interface StructuredListItem { id: string; title: string; href?: string; metadata: readonly {label: string; value: string | null}[]; image?: LogoData; tags?: readonly string[]; }
export interface StructuredListContract { items: readonly StructuredListItem[]; variant?: 'list' | 'table'; toolbar?: readonly {id: string; label: string; disabled?: boolean}[]; selection?: {ids: readonly string[]; onChange: (detail: {ids: readonly string[]}) => void}; sort?: {key: string; direction: 'ascending' | 'descending'; onChange: (detail: {key: string; direction: 'ascending' | 'descending'}) => void}; }
export interface CriticalAlertContract { urgency: 'high' | 'medium' | 'low'; label: string; message: string; details?: LinkData & {destinationTitle: string}; }
export interface DisclosureContract extends ControlledOpen { label: string; contentId: string; }
export interface BadgeContract { label: string; appearance?: 'outline' | 'filled' | 'pastel'; tone?: 'secondary' | 'gray' | 'point' | 'danger' | 'warning' | 'success' | 'information' | 'disabled'; size?: Size; numeric?: boolean; }
export interface AccordionContract { items: readonly {id: string; title: string; content: string}[]; openIds?: readonly string[]; defaultOpenIds?: readonly string[]; onOpenChange?: (detail: {ids: readonly string[]}) => void; multiple?: boolean; variant?: 'default' | 'line'; }
export interface ImageContract { src: string; alt: string; width?: number; height?: number; srcset?: string; sizes?: string; loading?: 'eager' | 'lazy'; decorative?: boolean; caption?: string; descriptionId?: string; }
export interface CarouselContract { items: readonly {id: string; label: string; content: string}[]; index?: number; defaultIndex?: number; onIndexChange?: (detail: {index: number; reason: 'previous' | 'next' | 'indicator' | 'swipe' | 'timer'}) => void; layout?: 'single' | 'multiple'; autoplay?: boolean; intervalMs?: number; playing?: boolean; defaultPlaying?: boolean; onPlayingChange?: (detail: {playing: boolean; reason: 'play' | 'stop' | 'navigation'}) => void; loop?: boolean; }
export interface TableColumn { id: string; label: string; kind: 'text' | 'number' | 'date'; sortable?: boolean; }
export interface TableContract { rowHeaderColumnId?: string; caption: string; columns: readonly TableColumn[]; rows: readonly {id: string; cells: Readonly<Record<string, string | number | null>>}[]; sort?: {columnId: string; direction: 'ascending' | 'descending'}; onSortChange?: (detail: {columnId: string; direction: 'ascending' | 'descending'}) => void; }
export interface TextListItem { id: string; content: string; children?: readonly TextListItem[]; }
export interface TextListContract { ordered?: boolean; marker?: 'dot' | 'dash' | 'hollow'; items: readonly TextListItem[]; }
export interface IconAsset { href: string; type: string; sizes: string; }
export interface FaviconContract { light: IconAsset; dark?: IconAsset; touchIcon?: IconAsset; }
export interface LinkContract { href: string; label: string; target?: string; rel?: string; disabled?: boolean; appearance?: 'basic' | 'emphasis'; size?: Size; underline?: boolean; }
export interface FABContract { label: string; icon: string; showLabel?: boolean; disabled?: boolean; onAction?: () => void; expanded?: boolean; defaultExpanded?: boolean; onExpandedChange?: (detail: {expanded: boolean}) => void; actions?: readonly {id: string; label: string; onAction: () => void}[]; }
export interface RadioGroupOption extends SelectOption { id?: string; }
export interface RadioGroupContract extends ControlledValue<string | null>, FieldContract { options: readonly RadioGroupOption[]; size?: 'medium' | 'large'; appearance?: 'default' | 'chip'; }
export interface CheckboxContract extends FieldContract { checked?: boolean; defaultChecked?: boolean; indeterminate?: boolean; onCheckedChange?: (detail: {checked: boolean}) => void; value?: string; appearance?: 'default' | 'chip'; size?: 'medium' | 'large'; }
export interface TagContract { items: readonly {id: string; label: string; href?: string; disabled?: boolean}[]; mode?: 'static' | 'toggle' | 'removable' | 'add-filter' | 'link'; selectedIds?: readonly string[]; onSelectionChange?: (detail: {ids: readonly string[]}) => void; onRemove?: (detail: {id: string}) => void; onAdd?: (detail: {id: string}) => void; onClear?: () => void; appliedBarId?: string; }
export interface SwitchContract extends FieldContract { checked?: boolean; defaultChecked?: boolean; onCheckedChange?: (detail: {checked: boolean}) => void; value?: string; size?: 'medium' | 'large'; }
export interface StepIndicatorContract { steps: readonly {id: string; label: string; status: 'pending' | 'current' | 'complete'; href?: string; optional?: boolean}[]; mode?: 'sequential' | 'adaptive'; onStepRequest?: (detail: {id: string}) => void; }
export interface SpinnerContract { pending: boolean; value?: number; label: string; completionMessage: string; size?: Size; }
export interface HelpTopic { id: string; title: string; content: string; relatedLinks: readonly LinkData[]; }
export interface HelpPanelContract extends ControlledOpen { topics: readonly HelpTopic[]; selectedTopicId?: string | null; defaultSelectedTopicId?: string | null; onTopicChange?: (detail: {id: string | null}) => void; mode?: 'help' | 'tutorial'; fallbackFocusId?: string; }
export interface TutorialStopDetails { reason: 'stop' | 'finish' | 'target-removed' | 'route-change'; running: false; returnTo: {panel: 'tutorial'; open: true; startActionId: string}; }
export interface TutorialStep { id: string; title: string; targetId: string; instruction: string; }
export interface TutorialStartDetails { taskId: string; stepId: string; }
export interface TutorialPanelContract extends ControlledOpen { onStart?: (detail: TutorialStartDetails) => void; tasks: readonly {id: string; title: string; steps: readonly TutorialStep[]}[]; activeTaskId: string | null; activeStepId: string | null; running?: boolean; defaultRunning?: boolean; activePanel?: 'help' | 'tutorial'; defaultActivePanel?: 'help' | 'tutorial'; onTaskChange?: (detail: {id: string | null}) => void; onStepChange?: (detail: {id: string | null}) => void; onActivePanelChange?: (detail: ValueChangeDetails<'help' | 'tutorial'>) => void; onStop?: (detail: TutorialStopDetails) => void; startActionId: string; fallbackFocusId?: string; }
export type HelpPlacement = 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end';
export interface ContextualHelpContract extends ControlledOpen { title: string; content: string; variant?: 'information' | 'help'; placement?: HelpPlacement; triggerLabel: string; relatedId?: string; fallbackFocusId?: string; }
export interface CoachMarkStep { id: string; targetId: string; title: string; instruction: string; requiresAction?: boolean; }
/** The host registers a native insertion location immediately after the real target. */
export interface CoachMarkBoundary { targetId: string; insertionBoundaryId: string; }
export interface CoachMarkTargetActionDetails { stepId: string; targetId: string; }
export interface CoachMarkContract extends ControlledOpen { onTargetAction?: (detail: CoachMarkTargetActionDetails) => boolean | Promise<boolean>; steps: readonly CoachMarkStep[]; boundaries: readonly CoachMarkBoundary[]; stepId?: string; defaultStepId?: string; onStepChange?: (detail: {id: string; reason: 'previous' | 'next' | 'target-action'}) => void; onStop?: (detail: TutorialStopDetails) => void; startActionId: string; fallbackFocusId?: string; }
export interface TooltipContract extends ControlledOpen { text: string; relationship?: 'description' | 'label'; triggerLabel?: string; triggerId: string; textId: string; placement?: HelpPlacement; fallbackFocusId?: string; touchToggle?: boolean; }
export interface TTSContract { summary: string; locale: string; state: 'idle' | 'playing' | 'paused' | 'error' | 'unsupported'; onRequest: (detail: {action: 'play' | 'pause' | 'resume' | 'stop'; summary: string; locale: string}) => void; label: string; size?: 'xsmall' | 'small' | 'medium'; iconOnly?: boolean; }
export interface TextareaContract extends ControlledValue<string>, FieldContract { rows?: number; readOnly?: boolean; maxLength?: number; }
export interface TextInputContract extends ControlledValue<string>, FieldContract { type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'search'; autocomplete?: string; inputMode?: string; readOnly?: boolean; minLength?: number; maxLength?: number; pattern?: string; status?: 'default' | 'error' | 'success'; size?: Size; iconAction?: {label: string; onAction: () => void}; }
/** File is browser-native data; no Event, renderer or machine crosses the contract. */
export interface FileRecord { id: string; file: File; status: 'staged' | 'uploading' | 'success' | 'error'; progress?: number; error?: string; }
export interface FileValidationFailure { file: File; code: 'accept' | 'max-files' | 'max-bytes'; message: string; }
export interface FileUploadContract { files: readonly FileRecord[]; name: string; label: string; multiple?: boolean; accept?: string; maxFiles?: number; maxBytes?: number; disabled?: boolean; onFilesChange: (detail: {value: readonly FileRecord[]; reason: 'picker' | 'drop' | 'remove'; addedIds: readonly string[]; removedIds: readonly string[]}) => void; onFilesRejected?: (detail: {rejected: readonly FileValidationFailure[]}) => void; }
export interface LanguageOption { locale: string; nativeLabel: string; translatedLabel: string; href: string; separateService?: boolean; }
export interface LanguageSwitcherContract extends ControlledOpen { currentLocale: string; options: readonly LanguageOption[]; onLocaleRequest?: (detail: {locale: string; href: string}) => void; }
export interface ResizeContract extends ControlledValue<string>, ControlledOpen { levels?: readonly {id: string; label: string; percent: number}[]; }
export interface AccessibleMediaContract { media: {kind: 'audio' | 'silent-video' | 'multimedia'; src: string; type: string; poster?: string}; captionTracks?: readonly {src: string; lang: string; label: string}[]; transcript: {content: string; href?: never} | {href: string; content?: never}; descriptionTrack?: {src: string; lang: string; label: string}; signLanguageSource?: string; title: string; controls?: true; autoplay?: false; }
export interface VisuallyHiddenContract { id?: string; lang?: string; content?: string; variant?: 'text' | 'interactive-overlay' | 'aria-association'; }
export interface RangeSliderContract extends ControlledValue<number>, FieldContract { min?: number; max?: number; step?: number; valueText?: (value: number) => string; }
export interface BackButtonContract { label?: string; canGoBack: boolean; fallbackHref?: string; dirty?: boolean; onBackRequest: (detail: {reason: 'activate' | 'confirmed'}) => void; requestConfirmation?: () => boolean | Promise<boolean>; }
export interface BottomSheetContract { open?: boolean; defaultOpen?: boolean; onOpenChange?: (detail: OpenChangeDetails & {reason: 'close' | 'escape' | 'outside' | 'drag'}) => void; title: string; description?: string; onCancel?: () => void; initialFocusId?: string; returnFocusId?: string; dismissOnOutside?: boolean; }
export interface QuantityToggleContract extends ControlledValue<number>, FieldContract { min?: number; max?: number; step?: number; unit?: string; }
export interface ToastMessage { id: string; text: string; tone: 'information' | 'warning'; persistentResultId: string; }
export interface ToastContract { message: ToastMessage | null; durationMs?: number; onDismiss: (detail: {id: string; reason: 'timeout'; generation: number}) => void; }
export type SnackbarAction = {kind: 'button'; id: string; label: string} | {kind: 'link'; id: string; label: string; href: string; target?: string; rel?: string};
export interface SnackbarMessage { id: string; title: string; text: string; icon?: string; error?: string; actionPending?: boolean; }
export interface SnackbarContract { message: SnackbarMessage | null; action?: SnackbarAction; onAction?: (detail: {id: string; generation: number; actionId: string}) => void; onDismiss: (detail: {id: string; reason: 'close' | 'timeout'; generation: number}) => void; durationMs?: number | null; fallbackFocusId?: string; }
export interface TabBarContract { items: readonly {id: string; label: string; href: string; icon: string; currentIcon?: string; badge?: string | number}[]; currentId: string; menuAction?: {label: string; onRequest: () => void}; }

export interface FullCatalogContractMap {
  'masthead': MastheadContract;
  'identifier': IdentifierContract;
  'header': HeaderContract;
  'footer': FooterContract;
  'skip-link': SkipLinkContract;
  'main-menu': MainMenuContract;
  'breadcrumb': BreadcrumbContract;
  'side-navigation': SideNavigationContract;
  'in-page-navigation': InPageNavigationContract;
  'pagination': PaginationContract;
  'structured-list': StructuredListContract;
  'critical-alert': CriticalAlertContract;
  'disclosure': DisclosureContract;
  'badge': BadgeContract;
  'accordion': AccordionContract;
  'image': ImageContract;
  'carousel': CarouselContract;
  'table': TableContract;
  'text-list': TextListContract;
  'favicon': FaviconContract;
  'link': LinkContract;
  'fab': FABContract;
  'radio-group': RadioGroupContract;
  'checkbox': CheckboxContract;
  'tag': TagContract;
  'switch': SwitchContract;
  'step-indicator': StepIndicatorContract;
  'spinner': SpinnerContract;
  'help-panel': HelpPanelContract;
  'tutorial-panel': TutorialPanelContract;
  'contextual-help': ContextualHelpContract;
  'coach-mark': CoachMarkContract;
  'tooltip': TooltipContract;
  'tts': TTSContract;
  'textarea': TextareaContract;
  'text-input': TextInputContract;
  'file-upload': FileUploadContract;
  'language-switcher': LanguageSwitcherContract;
  'resize': ResizeContract;
  'accessible-media': AccessibleMediaContract;
  'visually-hidden': VisuallyHiddenContract;
  'range-slider': RangeSliderContract;
  'back-button': BackButtonContract;
  'bottom-sheet': BottomSheetContract;
  'quantity-toggle': QuantityToggleContract;
  'toast': ToastContract;
  'snackbar': SnackbarContract;
  'tab-bar': TabBarContract;
}
export type FullCatalogComponentId = keyof FullCatalogContractMap;
/** Supported cases are independent axes, not a claim that KRDS names each as a variant. */
export const fullCatalogDefinitions = {
  "masthead": {
    "exportName": "Masthead",
    "kind": "component",
    "cases": [
      "default"
    ],
    "parts": [
      "root",
      "text"
    ],
    "states": [],
    "specPath": "specs/components/masthead.md"
  },
  "identifier": {
    "exportName": "Identifier",
    "kind": "component",
    "cases": [
      "light",
      "dark"
    ],
    "parts": [
      "root",
      "logo",
      "text"
    ],
    "states": [
      "light",
      "dark"
    ],
    "specPath": "specs/components/identifier.md"
  },
  "header": {
    "exportName": "Header",
    "kind": "composition",
    "cases": [
      "vertical-actions",
      "horizontal-actions",
      "mobile-menu",
      "sticky"
    ],
    "parts": [
      "root",
      "identity",
      "utilities",
      "utility-trigger",
      "actions",
      "search",
      "navigation",
      "mobile-trigger"
    ],
    "states": [
      "expanded",
      "collapsed",
      "sticky"
    ],
    "specPath": "specs/components/header.md"
  },
  "footer": {
    "exportName": "Footer",
    "kind": "composition",
    "cases": [
      "default",
      "narrow"
    ],
    "parts": [
      "root",
      "logo",
      "contacts",
      "utilities",
      "policies",
      "privacy-link",
      "copyright",
      "identifier"
    ],
    "states": [],
    "specPath": "specs/components/footer.md"
  },
  "skip-link": {
    "exportName": "SkipLink",
    "kind": "component",
    "cases": [
      "visible",
      "focus-revealed"
    ],
    "parts": [
      "root",
      "list",
      "item",
      "link"
    ],
    "states": [
      "focus-visible"
    ],
    "specPath": "specs/components/skip-link.md"
  },
  "main-menu": {
    "exportName": "MainMenu",
    "kind": "composition",
    "cases": [
      "desktop-links",
      "desktop-dropdown",
      "desktop-described",
      "mobile-simple",
      "mobile-sections",
      "mobile-drilldown"
    ],
    "parts": [
      "root",
      "list",
      "item",
      "trigger",
      "link",
      "indicator",
      "submenu",
      "submenu-title",
      "description",
      "utilities",
      "mobile-trigger",
      "mobile-content",
      "back",
      "close",
      "search"
    ],
    "states": [
      "expanded",
      "collapsed",
      "current",
      "mobile-open"
    ],
    "specPath": "specs/components/main-menu.md"
  },
  "breadcrumb": {
    "exportName": "Breadcrumb",
    "kind": "component",
    "cases": [
      "default",
      "collapsed",
      "narrow"
    ],
    "parts": [
      "root",
      "list",
      "item",
      "link",
      "home",
      "separator",
      "ellipsis"
    ],
    "states": [
      "current",
      "collapsed"
    ],
    "specPath": "specs/components/breadcrumb.md"
  },
  "side-navigation": {
    "exportName": "SideNavigation",
    "kind": "composition",
    "cases": [
      "simple",
      "with-header",
      "mobile-dropdown"
    ],
    "parts": [
      "root",
      "header",
      "parent-link",
      "list",
      "item",
      "link",
      "trigger",
      "submenu",
      "indicator"
    ],
    "states": [
      "current",
      "expanded",
      "collapsed"
    ],
    "specPath": "specs/components/side-navigation.md"
  },
  "in-page-navigation": {
    "exportName": "InPageNavigation",
    "kind": "composition",
    "cases": [
      "desktop-side",
      "mobile-inline",
      "mobile-disclosure"
    ],
    "parts": [
      "root",
      "header",
      "title",
      "list",
      "item",
      "link",
      "indicator",
      "disclosure-trigger"
    ],
    "states": [
      "active",
      "expanded",
      "collapsed"
    ],
    "specPath": "specs/components/in-page-navigation.md"
  },
  "pagination": {
    "exportName": "Pagination",
    "kind": "component",
    "cases": [
      "number-links",
      "direct-page",
      "load-more"
    ],
    "parts": [
      "root",
      "list",
      "item",
      "link",
      "previous",
      "next",
      "ellipsis",
      "input",
      "total",
      "go",
      "load-more",
      "count"
    ],
    "states": [
      "current",
      "disabled",
      "pending",
      "invalid"
    ],
    "specPath": "specs/components/pagination.md"
  },
  "structured-list": {
    "exportName": "StructuredList",
    "kind": "composition",
    "cases": [
      "list",
      "table"
    ],
    "parts": [
      "root",
      "header",
      "toolbar",
      "list",
      "item",
      "preview",
      "content",
      "metadata",
      "cta",
      "badges",
      "tags",
      "actions",
      "pagination"
    ],
    "states": [
      "selected",
      "pending",
      "empty"
    ],
    "specPath": "specs/components/structured-list.md"
  },
  "critical-alert": {
    "exportName": "CriticalAlert",
    "kind": "component",
    "cases": [
      "high-urgency",
      "medium-urgency",
      "low-urgency"
    ],
    "parts": [
      "root",
      "icon",
      "label",
      "message",
      "link"
    ],
    "states": [
      "high",
      "medium",
      "low"
    ],
    "specPath": "specs/components/critical-alert.md"
  },
  "disclosure": {
    "exportName": "Disclosure",
    "kind": "component",
    "cases": [
      "default"
    ],
    "parts": [
      "root",
      "trigger",
      "icon",
      "content"
    ],
    "states": [
      "open",
      "closed"
    ],
    "specPath": "specs/components/disclosure.md"
  },
  "badge": {
    "exportName": "Badge",
    "kind": "component",
    "cases": [
      "outline",
      "filled",
      "pastel",
      "numeric"
    ],
    "parts": [
      "root",
      "label"
    ],
    "states": [
      "outline",
      "filled",
      "pastel",
      "numeric",
      "secondary",
      "gray",
      "point",
      "danger",
      "warning",
      "success",
      "information",
      "disabled",
      "small",
      "medium",
      "large"
    ],
    "specPath": "specs/components/badge.md"
  },
  "accordion": {
    "exportName": "Accordion",
    "kind": "component",
    "cases": [
      "default",
      "line"
    ],
    "parts": [
      "root",
      "item",
      "heading",
      "trigger",
      "icon",
      "panel"
    ],
    "states": [
      "open",
      "closed"
    ],
    "specPath": "specs/components/accordion.md"
  },
  "image": {
    "exportName": "Image",
    "kind": "component",
    "cases": [
      "informative",
      "decorative",
      "complex-description",
      "responsive"
    ],
    "parts": [
      "root",
      "figure",
      "caption",
      "description"
    ],
    "states": [
      "loaded",
      "error"
    ],
    "specPath": "specs/components/image.md"
  },
  "carousel": {
    "exportName": "Carousel",
    "kind": "component",
    "cases": [
      "single",
      "multiple",
      "autoplay",
      "manual",
      "full-banner",
      "element-banner"
    ],
    "parts": [
      "root",
      "viewport",
      "list",
      "slide",
      "previous",
      "next",
      "indicators",
      "indicator",
      "position",
      "play-pause",
      "stop-intent"
    ],
    "states": [
      "active",
      "hidden",
      "playing",
      "paused",
      "disabled"
    ],
    "specPath": "specs/components/carousel.md"
  },
  "table": {
    "exportName": "Table",
    "kind": "component",
    "cases": [
      "basic",
      "sortable",
      "narrow-scroll",
      "narrow-stacked"
    ],
    "parts": [
      "root",
      "caption",
      "head",
      "body",
      "row",
      "header-cell",
      "cell",
      "sort-trigger",
      "scroll-region",
      "scroll-previous",
      "scroll-next"
    ],
    "states": [
      "ascending",
      "descending",
      "overflow"
    ],
    "specPath": "specs/components/table.md"
  },
  "text-list": {
    "exportName": "TextList",
    "kind": "component",
    "cases": [
      "unordered-dot",
      "unordered-dash",
      "unordered-hollow",
      "ordered"
    ],
    "parts": [
      "root",
      "item",
      "marker",
      "content",
      "nested-list"
    ],
    "states": [
      "ordered",
      "unordered",
      "level-1",
      "level-2",
      "level-3"
    ],
    "specPath": "specs/components/text-list.md"
  },
  "favicon": {
    "exportName": "Favicon",
    "kind": "asset",
    "cases": [
      "standard",
      "extended",
      "light",
      "dark"
    ],
    "parts": [],
    "states": [],
    "specPath": "specs/components/favicon.md"
  },
  "link": {
    "exportName": "Link",
    "kind": "component",
    "cases": [
      "standalone",
      "inline",
      "group",
      "external"
    ],
    "parts": [
      "root",
      "label",
      "icon"
    ],
    "states": [
      "disabled",
      "external"
    ],
    "specPath": "specs/components/link.md"
  },
  "fab": {
    "exportName": "FAB",
    "kind": "component",
    "cases": [
      "single-icon",
      "extended-label",
      "expandable"
    ],
    "parts": [
      "root",
      "trigger",
      "icon",
      "label",
      "overlay",
      "actions",
      "action"
    ],
    "states": [
      "expanded",
      "collapsed",
      "disabled"
    ],
    "specPath": "specs/components/fab.md"
  },
  "radio-group": {
    "exportName": "RadioGroup",
    "kind": "component",
    "cases": [
      "default",
      "chip",
      "medium",
      "large"
    ],
    "parts": [
      "root",
      "legend",
      "item",
      "control",
      "indicator",
      "label",
      "help",
      "error"
    ],
    "states": [
      "checked",
      "unchecked",
      "disabled",
      "invalid"
    ],
    "specPath": "specs/components/radio-group.md"
  },
  "checkbox": {
    "exportName": "Checkbox",
    "kind": "component",
    "cases": [
      "binary",
      "mixed-parent",
      "chip",
      "medium",
      "large"
    ],
    "parts": [
      "root",
      "control",
      "indicator",
      "label",
      "legend",
      "help",
      "error"
    ],
    "states": [
      "checked",
      "unchecked",
      "mixed",
      "disabled",
      "invalid"
    ],
    "specPath": "specs/components/checkbox.md"
  },
  "tag": {
    "exportName": "Tag",
    "kind": "component",
    "cases": [
      "static",
      "toggle",
      "removable",
      "add-filter",
      "link"
    ],
    "parts": [
      "root",
      "list",
      "item",
      "label",
      "icon",
      "remove",
      "clear",
      "more"
    ],
    "states": [
      "selected",
      "disabled",
      "expanded"
    ],
    "specPath": "specs/components/tag.md"
  },
  "switch": {
    "exportName": "Switch",
    "kind": "component",
    "cases": [
      "medium",
      "large",
      "with-help"
    ],
    "parts": [
      "root",
      "control",
      "track",
      "handle",
      "state-icon",
      "label",
      "help"
    ],
    "states": [
      "checked",
      "unchecked",
      "disabled"
    ],
    "specPath": "specs/components/switch.md"
  },
  "step-indicator": {
    "exportName": "StepIndicator",
    "kind": "component",
    "cases": [
      "sequential",
      "adaptive",
      "compact"
    ],
    "parts": [
      "root",
      "list",
      "item",
      "number",
      "label",
      "connector",
      "current-indicator",
      "complete-indicator"
    ],
    "states": [
      "current",
      "complete",
      "pending",
      "blocked"
    ],
    "specPath": "specs/components/step-indicator.md"
  },
  "spinner": {
    "exportName": "Spinner",
    "kind": "component",
    "cases": [
      "determinate",
      "indeterminate",
      "inline",
      "region"
    ],
    "parts": [
      "root",
      "track",
      "indicator",
      "label",
      "status"
    ],
    "states": [
      "pending",
      "complete",
      "determinate",
      "indeterminate"
    ],
    "specPath": "specs/components/spinner.md"
  },
  "help-panel": {
    "exportName": "HelpPanel",
    "kind": "composition",
    "cases": [
      "desktop-open",
      "narrow-modal",
      "initial",
      "context-detail"
    ],
    "parts": [
      "root",
      "opener",
      "topic-trigger",
      "header",
      "tabs",
      "close",
      "title",
      "body",
      "related"
    ],
    "states": [
      "open",
      "closed",
      "active-topic",
      "modal"
    ],
    "specPath": "specs/components/help-panel.md"
  },
  "tutorial-panel": {
    "exportName": "TutorialPanel",
    "kind": "composition",
    "cases": [
      "task-overview",
      "active-step",
      "suspended-panel",
      "narrow-modal"
    ],
    "parts": [
      "root",
      "opener",
      "header",
      "tabs",
      "tab",
      "close",
      "title",
      "back",
      "start",
      "task-list",
      "task",
      "task-toggle",
      "step-list",
      "step",
      "stop"
    ],
    "states": [
      "open",
      "closed",
      "running",
      "idle",
      "active-step",
      "selected",
      "current"
    ],
    "specPath": "specs/components/tutorial-panel.md"
  },
  "contextual-help": {
    "exportName": "ContextualHelp",
    "kind": "component",
    "cases": [
      "information",
      "help",
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right"
    ],
    "parts": [
      "root",
      "trigger",
      "icon",
      "popover",
      "title",
      "body",
      "close"
    ],
    "states": [
      "open",
      "closed",
      "top-start",
      "top",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end"
    ],
    "specPath": "specs/components/contextual-help.md"
  },
  "coach-mark": {
    "exportName": "CoachMark",
    "kind": "composition",
    "cases": [
      "single",
      "multi-step",
      "action-gated"
    ],
    "parts": [
      "root",
      "spotlight",
      "popover",
      "title",
      "instruction",
      "position",
      "actions",
      "stop",
      "previous",
      "next"
    ],
    "states": [
      "open",
      "closed",
      "current-step",
      "waiting",
      "missing-target"
    ],
    "specPath": "specs/components/coach-mark.md"
  },
  "tooltip": {
    "exportName": "Tooltip",
    "kind": "component",
    "cases": [
      "information-icon",
      "icon-button",
      "vertical",
      "box"
    ],
    "parts": [
      "root",
      "trigger",
      "popup",
      "icon",
      "text"
    ],
    "states": [
      "open",
      "closed",
      "suppressed",
      "top-start",
      "top",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end"
    ],
    "specPath": "specs/components/tooltip.md"
  },
  "tts": {
    "exportName": "TTS",
    "kind": "integration",
    "cases": [
      "page",
      "region",
      "play",
      "icon",
      "xsmall",
      "small",
      "medium"
    ],
    "parts": [
      "root",
      "play",
      "pause",
      "stop",
      "label",
      "status"
    ],
    "states": [
      "idle",
      "playing",
      "paused",
      "error",
      "unsupported"
    ],
    "specPath": "specs/components/tts.md"
  },
  "textarea": {
    "exportName": "Textarea",
    "kind": "component",
    "cases": [
      "default",
      "limited",
      "invalid",
      "disabled",
      "readonly"
    ],
    "parts": [
      "root",
      "label",
      "control",
      "help",
      "error",
      "count"
    ],
    "states": [
      "disabled",
      "readonly",
      "invalid",
      "focused"
    ],
    "specPath": "specs/components/textarea.md"
  },
  "text-input": {
    "exportName": "TextInput",
    "kind": "component",
    "cases": [
      "default",
      "error",
      "success",
      "small",
      "medium",
      "large",
      "icon-action"
    ],
    "parts": [
      "root",
      "label",
      "control",
      "help",
      "error",
      "icon-action"
    ],
    "states": [
      "invalid",
      "success",
      "disabled",
      "readonly",
      "focused"
    ],
    "specPath": "specs/components/text-input.md"
  },
  "file-upload": {
    "exportName": "FileUpload",
    "kind": "integration",
    "cases": [
      "single",
      "multiple",
      "button",
      "dropzone",
      "pending",
      "success",
      "error"
    ],
    "parts": [
      "root",
      "label",
      "description",
      "help",
      "picker",
      "file-input",
      "dropzone",
      "count",
      "list",
      "item",
      "filename",
      "size",
      "status",
      "progress",
      "remove",
      "error"
    ],
    "states": [
      "staged",
      "drag-over",
      "uploading",
      "success",
      "error",
      "disabled"
    ],
    "specPath": "specs/components/file-upload.md"
  },
  "language-switcher": {
    "exportName": "LanguageSwitcher",
    "kind": "integration",
    "cases": [
      "two-language-link",
      "dropdown",
      "separate-service"
    ],
    "parts": [
      "root",
      "trigger",
      "globe",
      "current",
      "list",
      "option",
      "external-icon"
    ],
    "states": [
      "open",
      "closed",
      "current"
    ],
    "specPath": "specs/components/language-switcher.md"
  },
  "resize": {
    "exportName": "Resize",
    "kind": "integration",
    "cases": [
      "five-levels",
      "custom-levels",
      "narrow-reflow"
    ],
    "parts": [
      "root",
      "trigger",
      "current",
      "list",
      "option",
      "scale-icon"
    ],
    "states": [
      "open",
      "closed",
      "selected"
    ],
    "specPath": "specs/components/resize.md"
  },
  "accessible-media": {
    "exportName": "AccessibleMedia",
    "kind": "composition",
    "cases": [
      "audio",
      "silent-video",
      "multimedia",
      "captions",
      "description",
      "transcript",
      "sign-language"
    ],
    "parts": [
      "root",
      "media",
      "caption-track",
      "alternatives",
      "transcript",
      "description",
      "sign-language"
    ],
    "states": [
      "playing",
      "paused",
      "ended",
      "error"
    ],
    "specPath": "specs/components/accessible-media.md"
  },
  "visually-hidden": {
    "exportName": "VisuallyHidden",
    "kind": "component",
    "cases": [
      "text",
      "interactive-overlay",
      "aria-association"
    ],
    "parts": [
      "root",
      "overlay-control",
      "visible-surrogate"
    ],
    "states": [
      "text",
      "interactive-overlay",
      "focus-visible"
    ],
    "specPath": "specs/components/visually-hidden.md"
  },
  "range-slider": {
    "exportName": "RangeSlider",
    "kind": "component",
    "cases": [
      "single-value",
      "disabled",
      "discrete"
    ],
    "parts": [
      "root",
      "label",
      "control",
      "track",
      "range",
      "thumb",
      "output",
      "minimum",
      "maximum"
    ],
    "states": [
      "disabled",
      "dragging"
    ],
    "specPath": "specs/components/range-slider.md"
  },
  "back-button": {
    "exportName": "BackButton",
    "kind": "integration",
    "cases": [
      "default",
      "dirty-confirmation",
      "no-history-fallback"
    ],
    "parts": [
      "root",
      "icon",
      "label"
    ],
    "states": [
      "disabled",
      "pending-confirmation"
    ],
    "specPath": "specs/components/back-button.md"
  },
  "bottom-sheet": {
    "exportName": "BottomSheet",
    "kind": "component",
    "cases": [
      "modal",
      "short-content",
      "select-cancel"
    ],
    "parts": [
      "root",
      "backdrop",
      "content",
      "handle",
      "header",
      "title",
      "body",
      "actions",
      "close"
    ],
    "states": [
      "open",
      "closed",
      "dragging"
    ],
    "specPath": "specs/components/bottom-sheet.md"
  },
  "quantity-toggle": {
    "exportName": "QuantityToggle",
    "kind": "component",
    "cases": [
      "default",
      "minimum",
      "maximum",
      "disabled"
    ],
    "parts": [
      "root",
      "label",
      "decrement",
      "output",
      "increment",
      "hidden-input"
    ],
    "states": [
      "at-minimum",
      "at-maximum",
      "disabled"
    ],
    "specPath": "specs/components/quantity-toggle.md"
  },
  "toast": {
    "exportName": "Toast",
    "kind": "component",
    "cases": [
      "information",
      "warning"
    ],
    "parts": [
      "root",
      "message"
    ],
    "states": [
      "information",
      "warning",
      "open",
      "closed"
    ],
    "specPath": "specs/components/toast.md"
  },
  "snackbar": {
    "exportName": "Snackbar",
    "kind": "component",
    "cases": [
      "message",
      "with-action",
      "with-icon"
    ],
    "parts": [
      "root",
      "icon",
      "title",
      "message",
      "action",
      "close"
    ],
    "states": [
      "open",
      "closed",
      "action-pending",
      "error"
    ],
    "specPath": "specs/components/snackbar.md"
  },
  "tab-bar": {
    "exportName": "TabBar",
    "kind": "component",
    "cases": [
      "three-items",
      "five-items",
      "with-badge"
    ],
    "parts": [
      "root",
      "list",
      "item",
      "link",
      "icon",
      "label",
      "indicator",
      "badge",
      "menu-trigger"
    ],
    "states": [
      "current"
    ],
    "specPath": "specs/components/tab-bar.md"
  }
} as const;

/** Presentation axes map to data-krds-<axis> on the root (and relevant owned parts).
 * Responsive/layout values describe actual rendering; do not flatten orthogonal axes.
 * For per-item states, apply state tokens to that item/control/panel as well as root summary. */
export const fullCatalogPresentation = {
  "identifier": {
    "theme": [
      "light",
      "dark"
    ]
  },
  "header": {
    "action-layout": [
      "horizontal",
      "vertical"
    ]
  },
  "skip-link": {
    "visibility": [
      "focus-revealed",
      "visible"
    ]
  },
  "main-menu": {
    "layout": [
      "desktop",
      "mobile"
    ]
  },
  "side-navigation": {
    "layout": [
      "desktop",
      "mobile"
    ]
  },
  "in-page-navigation": {
    "layout": [
      "desktop-side",
      "mobile-inline",
      "mobile-disclosure"
    ]
  },
  "pagination": {
    "variant": [
      "number-links",
      "direct-page",
      "load-more"
    ]
  },
  "structured-list": {
    "variant": [
      "list",
      "table"
    ]
  },
  "critical-alert": {
    "urgency": [
      "high",
      "medium",
      "low"
    ]
  },
  "badge": {
    "appearance": [
      "outline",
      "filled",
      "pastel"
    ],
    "tone": [
      "secondary",
      "gray",
      "point",
      "danger",
      "warning",
      "success",
      "information",
      "disabled"
    ],
    "size": [
      "small",
      "medium",
      "large"
    ]
  },
  "accordion": {
    "variant": [
      "default",
      "line"
    ]
  },
  "carousel": {
    "layout": [
      "single",
      "multiple"
    ],
    "indicator": [
      "dots",
      "fraction"
    ]
  },
  "table": {
    "layout": [
      "basic",
      "narrow-scroll",
      "narrow-stacked"
    ]
  },
  "text-list": {
    "marker": [
      "dot",
      "dash",
      "hollow"
    ],
    "ordering": [
      "ordered",
      "unordered"
    ]
  },
  "link": {
    "appearance": [
      "basic",
      "emphasis"
    ],
    "size": [
      "small",
      "medium",
      "large"
    ],
    "underline": [
      "true",
      "false"
    ]
  },
  "fab": {
    "variant": [
      "single-icon",
      "extended-label",
      "expandable"
    ]
  },
  "radio-group": {
    "appearance": [
      "default",
      "chip"
    ],
    "size": [
      "medium",
      "large"
    ]
  },
  "checkbox": {
    "appearance": [
      "default",
      "chip"
    ],
    "size": [
      "medium",
      "large"
    ]
  },
  "tag": {
    "mode": [
      "static",
      "toggle",
      "removable",
      "add-filter",
      "link"
    ]
  },
  "switch": {
    "size": [
      "medium",
      "large"
    ]
  },
  "step-indicator": {
    "mode": [
      "sequential",
      "adaptive"
    ]
  },
  "spinner": {
    "size": [
      "small",
      "medium",
      "large"
    ],
    "layout": [
      "inline",
      "region"
    ]
  },
  "help-panel": {
    "layout": [
      "desktop",
      "narrow-modal"
    ],
    "mode": [
      "help",
      "tutorial"
    ]
  },
  "tutorial-panel": {
    "layout": [
      "desktop",
      "narrow-modal"
    ]
  },
  "contextual-help": {
    "variant": [
      "information",
      "help"
    ],
    "placement": [
      "top-start",
      "top",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end"
    ]
  },
  "tooltip": {
    "relationship": [
      "description",
      "label"
    ],
    "placement": [
      "top-start",
      "top",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end"
    ]
  },
  "tts": {
    "size": [
      "xsmall",
      "small",
      "medium"
    ]
  },
  "text-input": {
    "size": [
      "small",
      "medium",
      "large"
    ],
    "status": [
      "default",
      "error",
      "success"
    ]
  },
  "file-upload": {
    "variant": [
      "button",
      "dropzone"
    ]
  },
  "accessible-media": {
    "kind": [
      "audio",
      "silent-video",
      "multimedia"
    ]
  },
  "visually-hidden": {
    "variant": [
      "text",
      "interactive-overlay",
      "aria-association"
    ]
  },
  "toast": {
    "tone": [
      "information",
      "warning"
    ]
  }
} as const;

/** Exact allowed state membership by owned part; omitted parts have no state tokens. Native/ARIA states remain authoritative. */
export const fullCatalogPartStates = {
  "masthead": {},
  "identifier": {
    "root": [
      "light",
      "dark"
    ]
  },
  "header": {
    "root": [
      "expanded",
      "collapsed",
      "sticky"
    ],
    "utility-trigger": [
      "expanded",
      "collapsed"
    ],
    "mobile-trigger": [
      "expanded",
      "collapsed"
    ]
  },
  "footer": {},
  "skip-link": {
    "root": [
      "focus-visible"
    ],
    "link": [
      "focus-visible"
    ]
  },
  "main-menu": {
    "root": [
      "expanded",
      "collapsed",
      "current",
      "mobile-open"
    ],
    "item": [
      "current",
      "expanded",
      "collapsed"
    ],
    "trigger": [
      "expanded",
      "collapsed",
      "current"
    ],
    "link": [
      "current"
    ],
    "submenu": [
      "expanded",
      "collapsed"
    ],
    "mobile-trigger": [
      "expanded",
      "collapsed"
    ],
    "mobile-content": [
      "mobile-open"
    ]
  },
  "breadcrumb": {
    "root": [
      "current",
      "collapsed"
    ],
    "item": [
      "current",
      "collapsed"
    ],
    "link": [
      "current"
    ],
    "ellipsis": [
      "collapsed"
    ]
  },
  "side-navigation": {
    "root": [
      "current",
      "expanded",
      "collapsed"
    ],
    "item": [
      "current",
      "expanded",
      "collapsed"
    ],
    "link": [
      "current"
    ],
    "trigger": [
      "expanded",
      "collapsed"
    ],
    "submenu": [
      "expanded",
      "collapsed"
    ]
  },
  "in-page-navigation": {
    "root": [
      "active",
      "expanded",
      "collapsed"
    ],
    "item": [
      "active"
    ],
    "link": [
      "active"
    ],
    "indicator": [
      "active"
    ],
    "disclosure-trigger": [
      "expanded",
      "collapsed"
    ],
    "list": [
      "expanded",
      "collapsed"
    ]
  },
  "pagination": {
    "root": [
      "current",
      "disabled",
      "pending",
      "invalid"
    ],
    "item": [
      "current"
    ],
    "link": [
      "current",
      "disabled"
    ],
    "previous": [
      "disabled"
    ],
    "next": [
      "disabled"
    ],
    "input": [
      "invalid"
    ],
    "go": [
      "disabled"
    ],
    "load-more": [
      "pending",
      "disabled"
    ],
    "count": [
      "pending"
    ]
  },
  "structured-list": {
    "root": [
      "selected",
      "pending",
      "empty"
    ],
    "list": [
      "pending",
      "empty"
    ],
    "item": [
      "selected"
    ],
    "toolbar": [
      "pending"
    ],
    "pagination": [
      "pending"
    ]
  },
  "critical-alert": {
    "root": [
      "high",
      "medium",
      "low"
    ],
    "label": [
      "high",
      "medium",
      "low"
    ]
  },
  "disclosure": {
    "root": [
      "open",
      "closed"
    ],
    "trigger": [
      "open",
      "closed"
    ],
    "content": [
      "open",
      "closed"
    ]
  },
  "badge": {
    "root": [
      "outline",
      "filled",
      "pastel",
      "numeric",
      "secondary",
      "gray",
      "point",
      "danger",
      "warning",
      "success",
      "information",
      "disabled",
      "small",
      "medium",
      "large"
    ]
  },
  "accordion": {
    "root": [
      "open",
      "closed"
    ],
    "item": [
      "open",
      "closed"
    ],
    "trigger": [
      "open",
      "closed"
    ],
    "panel": [
      "open",
      "closed"
    ]
  },
  "image": {
    "root": [
      "loaded",
      "error"
    ],
    "figure": [
      "loaded",
      "error"
    ]
  },
  "carousel": {
    "root": [
      "active",
      "hidden",
      "playing",
      "paused",
      "disabled"
    ],
    "slide": [
      "active",
      "hidden"
    ],
    "indicator": [
      "active"
    ],
    "previous": [
      "disabled"
    ],
    "next": [
      "disabled"
    ],
    "play-pause": [
      "playing",
      "paused",
      "disabled"
    ],
    "viewport": [
      "playing",
      "paused"
    ],
    "stop-intent": [
      "paused",
      "disabled"
    ]
  },
  "table": {
    "root": [
      "ascending",
      "descending",
      "overflow"
    ],
    "header-cell": [
      "ascending",
      "descending"
    ],
    "sort-trigger": [
      "ascending",
      "descending"
    ],
    "scroll-region": [
      "overflow"
    ],
    "scroll-previous": [
      "overflow"
    ],
    "scroll-next": [
      "overflow"
    ]
  },
  "text-list": {
    "root": [
      "ordered",
      "unordered",
      "level-1",
      "level-2",
      "level-3"
    ],
    "nested-list": [
      "ordered",
      "unordered",
      "level-1",
      "level-2",
      "level-3"
    ],
    "item": [
      "level-1",
      "level-2",
      "level-3"
    ]
  },
  "favicon": {},
  "link": {
    "root": [
      "disabled",
      "external"
    ]
  },
  "fab": {
    "root": [
      "expanded",
      "collapsed",
      "disabled"
    ],
    "trigger": [
      "expanded",
      "collapsed",
      "disabled"
    ],
    "actions": [
      "expanded",
      "collapsed"
    ],
    "action": [
      "disabled"
    ],
    "overlay": [
      "expanded",
      "collapsed"
    ]
  },
  "radio-group": {
    "root": [
      "checked",
      "unchecked",
      "disabled",
      "invalid"
    ],
    "item": [
      "checked",
      "unchecked",
      "disabled",
      "invalid"
    ],
    "control": [
      "checked",
      "unchecked",
      "disabled",
      "invalid"
    ],
    "indicator": [
      "checked",
      "unchecked",
      "disabled",
      "invalid"
    ]
  },
  "checkbox": {
    "root": [
      "checked",
      "unchecked",
      "mixed",
      "disabled",
      "invalid"
    ],
    "control": [
      "checked",
      "unchecked",
      "mixed",
      "disabled",
      "invalid"
    ],
    "indicator": [
      "checked",
      "unchecked",
      "mixed",
      "disabled",
      "invalid"
    ]
  },
  "tag": {
    "root": [
      "selected",
      "disabled",
      "expanded"
    ],
    "item": [
      "selected",
      "disabled"
    ],
    "remove": [
      "disabled"
    ],
    "clear": [
      "disabled"
    ],
    "more": [
      "expanded",
      "disabled"
    ],
    "list": [
      "expanded"
    ]
  },
  "switch": {
    "root": [
      "checked",
      "unchecked",
      "disabled"
    ],
    "control": [
      "checked",
      "unchecked",
      "disabled"
    ],
    "track": [
      "checked",
      "unchecked",
      "disabled"
    ],
    "handle": [
      "checked",
      "unchecked",
      "disabled"
    ],
    "state-icon": [
      "checked",
      "unchecked",
      "disabled"
    ]
  },
  "step-indicator": {
    "root": [
      "current",
      "complete",
      "pending",
      "blocked"
    ],
    "item": [
      "current",
      "complete",
      "pending",
      "blocked"
    ],
    "number": [
      "current",
      "complete",
      "pending",
      "blocked"
    ],
    "label": [
      "current",
      "complete",
      "pending",
      "blocked"
    ],
    "connector": [
      "current",
      "complete",
      "pending",
      "blocked"
    ],
    "current-indicator": [
      "current"
    ],
    "complete-indicator": [
      "complete"
    ]
  },
  "spinner": {
    "root": [
      "pending",
      "complete",
      "determinate",
      "indeterminate"
    ],
    "track": [
      "pending",
      "complete",
      "determinate",
      "indeterminate"
    ],
    "indicator": [
      "pending",
      "complete",
      "determinate",
      "indeterminate"
    ],
    "status": [
      "pending",
      "complete"
    ],
    "label": [
      "pending",
      "complete"
    ]
  },
  "help-panel": {
    "root": [
      "open",
      "closed",
      "active-topic",
      "modal"
    ],
    "opener": [
      "open",
      "closed"
    ],
    "topic-trigger": [
      "active-topic"
    ],
    "tabs": [
      "active-topic"
    ],
    "body": [
      "active-topic"
    ],
    "related": [
      "active-topic"
    ]
  },
  "tutorial-panel": {
    "root": [
      "open",
      "closed",
      "running",
      "idle",
      "active-step"
    ],
    "opener": [
      "open",
      "closed"
    ],
    "tabs": [
      "running",
      "idle"
    ],
    "tab": [
      "selected"
    ],
    "task": [
      "active-step"
    ],
    "step-list": [
      "active-step"
    ],
    "step": [
      "current"
    ],
    "stop": [
      "running",
      "idle"
    ]
  },
  "contextual-help": {
    "root": [
      "open",
      "closed",
      "top-start",
      "top",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end"
    ],
    "trigger": [
      "open",
      "closed"
    ],
    "popover": [
      "open",
      "closed",
      "top-start",
      "top",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end"
    ]
  },
  "coach-mark": {
    "root": [
      "open",
      "closed",
      "current-step",
      "waiting",
      "missing-target"
    ],
    "spotlight": [
      "open",
      "closed",
      "current-step"
    ],
    "popover": [
      "open",
      "closed",
      "current-step",
      "waiting",
      "missing-target"
    ],
    "position": [
      "current-step"
    ],
    "previous": [
      "current-step"
    ],
    "next": [
      "current-step"
    ]
  },
  "tooltip": {
    "root": [
      "open",
      "closed",
      "suppressed",
      "top-start",
      "top",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end"
    ],
    "trigger": [
      "open",
      "closed",
      "suppressed"
    ],
    "popup": [
      "open",
      "closed",
      "suppressed",
      "top-start",
      "top",
      "top-end",
      "bottom-start",
      "bottom",
      "bottom-end"
    ]
  },
  "tts": {
    "root": [
      "idle",
      "playing",
      "paused",
      "error",
      "unsupported"
    ],
    "play": [
      "idle",
      "playing",
      "paused",
      "error",
      "unsupported"
    ],
    "pause": [
      "playing",
      "paused",
      "unsupported"
    ],
    "stop": [
      "idle",
      "playing",
      "paused",
      "unsupported"
    ],
    "status": [
      "idle",
      "playing",
      "paused",
      "error",
      "unsupported"
    ]
  },
  "textarea": {
    "root": [
      "disabled",
      "readonly",
      "invalid",
      "focused"
    ],
    "control": [
      "disabled",
      "readonly",
      "invalid",
      "focused"
    ],
    "count": [
      "invalid"
    ]
  },
  "text-input": {
    "root": [
      "invalid",
      "success",
      "disabled",
      "readonly",
      "focused"
    ],
    "control": [
      "invalid",
      "success",
      "disabled",
      "readonly",
      "focused"
    ],
    "icon-action": [
      "disabled"
    ]
  },
  "file-upload": {
    "root": [
      "staged",
      "drag-over",
      "uploading",
      "success",
      "error",
      "disabled"
    ],
    "picker": [
      "disabled"
    ],
    "file-input": [
      "disabled"
    ],
    "dropzone": [
      "drag-over",
      "disabled"
    ],
    "list": [
      "disabled"
    ],
    "item": [
      "staged",
      "uploading",
      "success",
      "error",
      "disabled"
    ],
    "status": [
      "staged",
      "uploading",
      "success",
      "error"
    ],
    "progress": [
      "uploading",
      "success",
      "error"
    ],
    "remove": [
      "disabled"
    ],
    "error": [
      "error"
    ]
  },
  "language-switcher": {
    "root": [
      "open",
      "closed",
      "current"
    ],
    "trigger": [
      "open",
      "closed"
    ],
    "list": [
      "open",
      "closed"
    ],
    "option": [
      "current"
    ]
  },
  "resize": {
    "root": [
      "open",
      "closed",
      "selected"
    ],
    "trigger": [
      "open",
      "closed"
    ],
    "list": [
      "open",
      "closed"
    ],
    "option": [
      "selected"
    ]
  },
  "accessible-media": {
    "root": [
      "playing",
      "paused",
      "ended",
      "error"
    ],
    "media": [
      "playing",
      "paused",
      "ended",
      "error"
    ]
  },
  "visually-hidden": {
    "root": [
      "text",
      "interactive-overlay",
      "focus-visible"
    ],
    "overlay-control": [
      "interactive-overlay",
      "focus-visible"
    ],
    "visible-surrogate": [
      "focus-visible"
    ]
  },
  "range-slider": {
    "root": [
      "disabled",
      "dragging"
    ],
    "control": [
      "disabled",
      "dragging"
    ],
    "track": [
      "disabled",
      "dragging"
    ],
    "range": [
      "disabled"
    ],
    "thumb": [
      "disabled",
      "dragging"
    ]
  },
  "back-button": {
    "root": [
      "disabled",
      "pending-confirmation"
    ]
  },
  "bottom-sheet": {
    "root": [
      "open",
      "closed",
      "dragging"
    ],
    "backdrop": [
      "open",
      "closed"
    ],
    "content": [
      "open",
      "closed",
      "dragging"
    ],
    "handle": [
      "dragging"
    ]
  },
  "quantity-toggle": {
    "root": [
      "at-minimum",
      "at-maximum",
      "disabled"
    ],
    "decrement": [
      "at-minimum",
      "disabled"
    ],
    "increment": [
      "at-maximum",
      "disabled"
    ],
    "output": [
      "at-minimum",
      "at-maximum",
      "disabled"
    ],
    "hidden-input": [
      "disabled"
    ]
  },
  "toast": {
    "root": [
      "information",
      "warning",
      "open",
      "closed"
    ],
    "message": [
      "information",
      "warning",
      "open",
      "closed"
    ]
  },
  "snackbar": {
    "root": [
      "open",
      "closed",
      "action-pending",
      "error"
    ],
    "action": [
      "action-pending",
      "error"
    ],
    "message": [
      "error"
    ]
  },
  "tab-bar": {
    "root": [
      "current"
    ],
    "item": [
      "current"
    ],
    "link": [
      "current"
    ],
    "indicator": [
      "current"
    ]
  }
} as const;
