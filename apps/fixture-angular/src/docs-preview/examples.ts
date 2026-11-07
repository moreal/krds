import type { Type } from '@angular/core';
import { AccessibleMediaExample } from './AccessibleMediaExample';
import { AccordionExample } from './AccordionExample';
import { BackButtonExample } from './BackButtonExample';
import { BadgeExample } from './BadgeExample';
import { BottomSheetExample } from './BottomSheetExample';
import { BreadcrumbExample } from './BreadcrumbExample';
import { ButtonExample } from './ButtonExample';
import { CalendarExample } from './CalendarExample';
import { CarouselExample } from './CarouselExample';
import { CheckboxExample } from './CheckboxExample';
import { CoachMarkExample } from './CoachMarkExample';
import { ContextualHelpExample } from './ContextualHelpExample';
import { CriticalAlertExample } from './CriticalAlertExample';
import { DateInputExample } from './DateInputExample';
import { DisclosureExample } from './DisclosureExample';
import { FabExample } from './FabExample';
import { FaviconExample } from './FaviconExample';
import { FileUploadExample } from './FileUploadExample';
import { FooterExample } from './FooterExample';
import { HeaderExample } from './HeaderExample';
import { HelpPanelExample } from './HelpPanelExample';
import { IdentifierExample } from './IdentifierExample';
import { ImageExample } from './ImageExample';
import { InPageNavigationExample } from './InPageNavigationExample';
import { LanguageSwitcherExample } from './LanguageSwitcherExample';
import { LinkExample } from './LinkExample';
import { MainMenuExample } from './MainMenuExample';
import { MastheadExample } from './MastheadExample';
import { ModalExample } from './ModalExample';
import { NativeSelectExample } from './NativeSelectExample';
import { PaginationExample } from './PaginationExample';
import { QuantityToggleExample } from './QuantityToggleExample';
import { RadioGroupExample } from './RadioGroupExample';
import { RangeSliderExample } from './RangeSliderExample';
import { ResizeExample } from './ResizeExample';
import { SideNavigationExample } from './SideNavigationExample';
import { SkipLinkExample } from './SkipLinkExample';
import { SnackbarExample } from './SnackbarExample';
import { SpinnerExample } from './SpinnerExample';
import { StepIndicatorExample } from './StepIndicatorExample';
import { StructuredListExample } from './StructuredListExample';
import { SwitchExample } from './SwitchExample';
import { TabBarExample } from './TabBarExample';
import { TableExample } from './TableExample';
import { TabsExample } from './TabsExample';
import { TagExample } from './TagExample';
import { TextInputExample } from './TextInputExample';
import { TextListExample } from './TextListExample';
import { TextareaExample } from './TextareaExample';
import { ToastExample } from './ToastExample';
import { TooltipExample } from './TooltipExample';
import { TtsExample } from './TtsExample';
import { TutorialPanelExample } from './TutorialPanelExample';
import { VisuallyHiddenExample } from './VisuallyHiddenExample';

/** Explicit allowlist: one actual standalone Angular example per catalog component (default example only). */
export const examples: Readonly<Record<string, Type<unknown>>> = {
  'accessible-media': AccessibleMediaExample,
  'accordion': AccordionExample,
  'back-button': BackButtonExample,
  'badge': BadgeExample,
  'bottom-sheet': BottomSheetExample,
  'breadcrumb': BreadcrumbExample,
  'button': ButtonExample,
  'calendar': CalendarExample,
  'carousel': CarouselExample,
  'checkbox': CheckboxExample,
  'coach-mark': CoachMarkExample,
  'contextual-help': ContextualHelpExample,
  'critical-alert': CriticalAlertExample,
  'date-input': DateInputExample,
  'disclosure': DisclosureExample,
  'fab': FabExample,
  'favicon': FaviconExample,
  'file-upload': FileUploadExample,
  'footer': FooterExample,
  'header': HeaderExample,
  'help-panel': HelpPanelExample,
  'identifier': IdentifierExample,
  'image': ImageExample,
  'in-page-navigation': InPageNavigationExample,
  'language-switcher': LanguageSwitcherExample,
  'link': LinkExample,
  'main-menu': MainMenuExample,
  'masthead': MastheadExample,
  'modal': ModalExample,
  'native-select': NativeSelectExample,
  'pagination': PaginationExample,
  'quantity-toggle': QuantityToggleExample,
  'radio-group': RadioGroupExample,
  'range-slider': RangeSliderExample,
  'resize': ResizeExample,
  'side-navigation': SideNavigationExample,
  'skip-link': SkipLinkExample,
  'snackbar': SnackbarExample,
  'spinner': SpinnerExample,
  'step-indicator': StepIndicatorExample,
  'structured-list': StructuredListExample,
  'switch': SwitchExample,
  'tab-bar': TabBarExample,
  'table': TableExample,
  'tabs': TabsExample,
  'tag': TagExample,
  'text-input': TextInputExample,
  'text-list': TextListExample,
  'textarea': TextareaExample,
  'toast': ToastExample,
  'tooltip': TooltipExample,
  'tts': TtsExample,
  'tutorial-panel': TutorialPanelExample,
  'visually-hidden': VisuallyHiddenExample,
};
