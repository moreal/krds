export type * from './elements.js';
import { Carousel } from './components/carousel/index.js';
import { FAB } from './components/fab/index.js';
import { Tag } from './components/tag/index.js';
import { BackButton } from './components/back-button/index.js';
import { TTS } from './components/tts/index.js';
import { Resize } from './components/resize/index.js';
import { AccessibleMedia } from './components/accessible-media/index.js';
import { Toast } from './components/toast/index.js';
import { Snackbar } from './components/snackbar/index.js';
import { BottomSheet } from './components/bottom-sheet/index.js';
import { ContextualHelp } from './components/contextual-help/index.js';
import { Tooltip } from './components/tooltip/index.js';
import { HelpPanel } from './components/help-panel/index.js';
import { TutorialPanel } from './components/tutorial-panel/index.js';
import { CoachMark } from './components/coach-mark/index.js';
import { Header } from './components/header/index.js';
import { Footer } from './components/footer/index.js';
import { SkipLink } from './components/skip-link/index.js';
import { MainMenu } from './components/main-menu/index.js';
import { Breadcrumb } from './components/breadcrumb/index.js';
import { SideNavigation } from './components/side-navigation/index.js';
import { InPageNavigation } from './components/in-page-navigation/index.js';
import { Pagination } from './components/pagination/index.js';
import { StructuredList } from './components/structured-list/index.js';
import { LanguageSwitcher } from './components/language-switcher/index.js';
import { TabBar } from './components/tab-bar/index.js';
import { Masthead } from './components/masthead/index.js';
import { Identifier } from './components/identifier/index.js';
import { CriticalAlert } from './components/critical-alert/index.js';
import { Badge } from './components/badge/index.js';
import { Image } from './components/image/index.js';
import { Link } from './components/link/index.js';
import { VisuallyHidden } from './components/visually-hidden/index.js';
import { Spinner } from './components/spinner/index.js';
import { Disclosure } from './components/disclosure/index.js';
import { Accordion } from './components/accordion/index.js';
import { TextList } from './components/text-list/index.js';
import { Table } from './components/table/index.js';
import { StepIndicator } from './components/step-indicator/index.js';
import { Favicon } from './components/favicon/index.js';
import { TextInput } from './components/text-input/index.js';
import { Textarea } from './components/textarea/index.js';
import { Checkbox } from './components/checkbox/index.js';
import { Switch } from './components/switch/index.js';
import { RadioGroup } from './components/radio-group/index.js';
import { RangeSlider } from './components/range-slider/index.js';
import { QuantityToggle } from './components/quantity-toggle/index.js';
import { FileUpload } from './components/file-upload/index.js';
import { Button } from './components/button/index.js';
import { NativeSelect } from './components/native-select/index.js';
import { Modal } from './components/modal/index.js';
import { Tabs } from './components/tabs/index.js';
import { Calendar } from './components/calendar/index.js';
import { DateInput } from './components/date-input/index.js';
/** Explicit registration only. Importing either public entry defines no elements. */
export function registerKrdsElements(registry: CustomElementRegistry) {
    const prefix = 'krds';
    const definitions = { 'button': Button, 'native-select': NativeSelect, 'modal': Modal, 'tabs': Tabs, 'calendar': Calendar, 'date-input': DateInput, 'text-input': TextInput, 'textarea': Textarea, 'checkbox': Checkbox, 'switch': Switch, 'radio-group': RadioGroup, 'range-slider': RangeSlider, 'quantity-toggle': QuantityToggle, 'file-upload': FileUpload, 'masthead': Masthead, 'identifier': Identifier, 'critical-alert': CriticalAlert, 'badge': Badge, 'image': Image, 'link': Link, 'visually-hidden': VisuallyHidden, 'spinner': Spinner, 'disclosure': Disclosure, 'accordion': Accordion, 'text-list': TextList, 'table': Table, 'step-indicator': StepIndicator, 'favicon': Favicon, 'header': Header, 'footer': Footer, 'skip-link': SkipLink, 'main-menu': MainMenu, 'breadcrumb': Breadcrumb, 'side-navigation': SideNavigation, 'in-page-navigation': InPageNavigation, 'pagination': Pagination, 'structured-list': StructuredList, 'language-switcher': LanguageSwitcher, 'tab-bar': TabBar, 'carousel': Carousel, 'fab': FAB, 'tag': Tag, 'back-button': BackButton, 'tts': TTS, 'resize': Resize, 'accessible-media': AccessibleMedia, 'toast': Toast, 'snackbar': Snackbar, 'bottom-sheet': BottomSheet, 'contextual-help': ContextualHelp, 'tooltip': Tooltip, 'help-panel': HelpPanel, 'tutorial-panel': TutorialPanel, 'coach-mark': CoachMark };
    for (const [name, constructor] of Object.entries(definitions)) {
        const tag = `${prefix}-${name}`;
        const existing = registry.get(tag);
        if (existing && existing !== constructor)
            throw new Error(`Custom element collision: ${tag}`);
    }
    for (const [name, constructor] of Object.entries(definitions))
        if (!registry.get(`${prefix}-${name}`))
            registry.define(`${prefix}-${name}`, constructor);
}
