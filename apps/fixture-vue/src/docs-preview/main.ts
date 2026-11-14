import { createApp, onMounted, onUnmounted, h, ref } from 'vue';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';
import './preview.css';
import { createPreviewHost } from '../../../../tools/docs-previews/host';
import AccessibleMediaExample from './AccessibleMediaExample.vue';
import AccordionExample from './AccordionExample.vue';
import BackButtonExample from './BackButtonExample.vue';
import BadgeExample from './BadgeExample.vue';
import BottomSheetExample from './BottomSheetExample.vue';
import BreadcrumbExample from './BreadcrumbExample.vue';
import ButtonExample from './ButtonExample.vue';
import CalendarExample from './CalendarExample.vue';
import CarouselExample from './CarouselExample.vue';
import CheckboxExample from './CheckboxExample.vue';
import CoachMarkExample from './CoachMarkExample.vue';
import ContextualHelpExample from './ContextualHelpExample.vue';
import CriticalAlertExample from './CriticalAlertExample.vue';
import DateInputExample from './DateInputExample.vue';
import DisclosureExample from './DisclosureExample.vue';
import FabExample from './FabExample.vue';
import FaviconExample from './FaviconExample.vue';
import FileUploadExample from './FileUploadExample.vue';
import FooterExample from './FooterExample.vue';
import HeaderExample from './HeaderExample.vue';
import HelpPanelExample from './HelpPanelExample.vue';
import IdentifierExample from './IdentifierExample.vue';
import ImageExample from './ImageExample.vue';
import InPageNavigationExample from './InPageNavigationExample.vue';
import LanguageSwitcherExample from './LanguageSwitcherExample.vue';
import LinkExample from './LinkExample.vue';
import MainMenuExample from './MainMenuExample.vue';
import MastheadExample from './MastheadExample.vue';
import ModalExample from './ModalExample.vue';
import NativeSelectExample from './NativeSelectExample.vue';
import PaginationExample from './PaginationExample.vue';
import QuantityToggleExample from './QuantityToggleExample.vue';
import RadioGroupExample from './RadioGroupExample.vue';
import RangeSliderExample from './RangeSliderExample.vue';
import ResizeExample from './ResizeExample.vue';
import SideNavigationExample from './SideNavigationExample.vue';
import SkipLinkExample from './SkipLinkExample.vue';
import SnackbarExample from './SnackbarExample.vue';
import SpinnerExample from './SpinnerExample.vue';
import StepIndicatorExample from './StepIndicatorExample.vue';
import StructuredListExample from './StructuredListExample.vue';
import SwitchExample from './SwitchExample.vue';
import TabBarExample from './TabBarExample.vue';
import TableExample from './TableExample.vue';
import TabsExample from './TabsExample.vue';
import TagExample from './TagExample.vue';
import TextInputExample from './TextInputExample.vue';
import TextListExample from './TextListExample.vue';
import TextareaExample from './TextareaExample.vue';
import ToastExample from './ToastExample.vue';
import TooltipExample from './TooltipExample.vue';
import TtsExample from './TtsExample.vue';
import TutorialPanelExample from './TutorialPanelExample.vue';
import VisuallyHiddenExample from './VisuallyHiddenExample.vue';
const examples={'accessible-media':AccessibleMediaExample,
'accordion':AccordionExample,
'back-button':BackButtonExample,
'badge':BadgeExample,
'bottom-sheet':BottomSheetExample,
'breadcrumb':BreadcrumbExample,
'button':ButtonExample,
'calendar':CalendarExample,
'carousel':CarouselExample,
'checkbox':CheckboxExample,
'coach-mark':CoachMarkExample,
'contextual-help':ContextualHelpExample,
'critical-alert':CriticalAlertExample,
'date-input':DateInputExample,
'disclosure':DisclosureExample,
'fab':FabExample,
'favicon':FaviconExample,
'file-upload':FileUploadExample,
'footer':FooterExample,
'header':HeaderExample,
'help-panel':HelpPanelExample,
'identifier':IdentifierExample,
'image':ImageExample,
'in-page-navigation':InPageNavigationExample,
'language-switcher':LanguageSwitcherExample,
'link':LinkExample,
'main-menu':MainMenuExample,
'masthead':MastheadExample,
'modal':ModalExample,
'native-select':NativeSelectExample,
'pagination':PaginationExample,
'quantity-toggle':QuantityToggleExample,
'radio-group':RadioGroupExample,
'range-slider':RangeSliderExample,
'resize':ResizeExample,
'side-navigation':SideNavigationExample,
'skip-link':SkipLinkExample,
'snackbar':SnackbarExample,
'spinner':SpinnerExample,
'step-indicator':StepIndicatorExample,
'structured-list':StructuredListExample,
'switch':SwitchExample,
'tab-bar':TabBarExample,
'table':TableExample,
'tabs':TabsExample,
'tag':TagExample,
'text-input':TextInputExample,
'text-list':TextListExample,
'textarea':TextareaExample,
'toast':ToastExample,
'tooltip':TooltipExample,
'tts':TtsExample,
'tutorial-panel':TutorialPanelExample,
'visually-hidden':VisuallyHiddenExample};
const root=document.getElementById('preview-root')!; const params=new URLSearchParams(location.search);const id=params.get('component');const host=createPreviewHost({framework:'vue',root});const Example=examples[id as keyof typeof examples];
if(!Example||params.get('example')!=='default'){root.textContent='지원하지 않는 예제입니다.';host.error('Unknown Vue example');}else{const app=createApp({setup(){const destination=ref(location.hash);const navigate=()=>destination.value=location.hash;addEventListener('hashchange',navigate);onMounted(()=>host.ready());onUnmounted(()=>{removeEventListener('hashchange',navigate);host.dispose();});return()=>h('div',[h(Example),destination.value.startsWith('#local-') ? h('section',{id:destination.value.slice(1),tabindex:-1,'aria-label':'로컬 목적지'},[h('h2','로컬 목적지'),h('p',destination.value.slice(7))]):null]);}});app.mount(root);addEventListener('pagehide',()=>app.unmount(),{once:true});}
