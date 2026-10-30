# Native Vue KRDS

54 native Vue SFC exports. The six pilot components retain their reviewed behavior, with separately evidenced trusted-reset and DateInput private-layout corrections awaiting their bound review. The other 48 are T10 implementation candidates; build success does not award native catalog coverage or authorize publication.

Use Vue 3.5.44 with the repository-selected Node/Yarn toolchain. Components expose native slots and plain semantic events such as `@value-change="({ value }) => committed = value"`. Native `v-model` is provided for text, checked and numeric form controls; `value`/`checked` and `modelValue` cannot provide competing controlled sources. A controlled prop and its default together, or switching ownership after mount, is invalid.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TextInput, Checkbox, Accordion, type TextInputContract } from '@unofficial-krds/vue';
const name = ref('');
const agreed = ref(false);
const field: Pick<TextInputContract, 'name' | 'label' | 'autocomplete'> = {
  name: 'name', label: '신청인', autocomplete: 'name',
};
</script>
<template>
  <form>
    <TextInput v-bind="field" v-model="name" />
    <Checkbox label="동의" name="agreed" v-model="agreed" />
    <Accordion :items="[{ id: 'help', title: '도움말', content: '신청 안내' }]">
      <template #help><a href="/help">실제 도움말</a></template>
    </Accordion>
  </form>
</template>
```

Named item slots retain genuine Vue children: Accordion, Carousel, TextList and Table use item/column IDs; StructuredList has `toolbar`, item-ID, `actions` and `pagination` slots. BottomSheet has a trigger slot and native body content. All own state/lifecycle stays in the Vue renderer.

| Export | Subpath | Specification |
| --- | --- | --- |
| `AccessibleMedia` | `@unofficial-krds/vue/accessible-media` | [Contract](../../specs/components/accessible-media.md) |
| `Accordion` | `@unofficial-krds/vue/accordion` | [Contract](../../specs/components/accordion.md) |
| `BackButton` | `@unofficial-krds/vue/back-button` | [Contract](../../specs/components/back-button.md) |
| `Badge` | `@unofficial-krds/vue/badge` | [Contract](../../specs/components/badge.md) |
| `BottomSheet` | `@unofficial-krds/vue/bottom-sheet` | [Contract](../../specs/components/bottom-sheet.md) |
| `Breadcrumb` | `@unofficial-krds/vue/breadcrumb` | [Contract](../../specs/components/breadcrumb.md) |
| `Button` | `@unofficial-krds/vue/button` | [Contract](../../specs/components/button.md) |
| `Calendar` | `@unofficial-krds/vue/calendar` | [Contract](../../specs/components/calendar.md) |
| `Carousel` | `@unofficial-krds/vue/carousel` | [Contract](../../specs/components/carousel.md) |
| `Checkbox` | `@unofficial-krds/vue/checkbox` | [Contract](../../specs/components/checkbox.md) |
| `CoachMark` | `@unofficial-krds/vue/coach-mark` | [Contract](../../specs/components/coach-mark.md) |
| `ContextualHelp` | `@unofficial-krds/vue/contextual-help` | [Contract](../../specs/components/contextual-help.md) |
| `CriticalAlert` | `@unofficial-krds/vue/critical-alert` | [Contract](../../specs/components/critical-alert.md) |
| `DateInput` | `@unofficial-krds/vue/date-input` | [Contract](../../specs/components/date-input.md) |
| `Disclosure` | `@unofficial-krds/vue/disclosure` | [Contract](../../specs/components/disclosure.md) |
| `FAB` | `@unofficial-krds/vue/fab` | [Contract](../../specs/components/fab.md) |
| `Favicon` | `@unofficial-krds/vue/favicon` | [Contract](../../specs/components/favicon.md) |
| `FileUpload` | `@unofficial-krds/vue/file-upload` | [Contract](../../specs/components/file-upload.md) |
| `Footer` | `@unofficial-krds/vue/footer` | [Contract](../../specs/components/footer.md) |
| `Header` | `@unofficial-krds/vue/header` | [Contract](../../specs/components/header.md) |
| `HelpPanel` | `@unofficial-krds/vue/help-panel` | [Contract](../../specs/components/help-panel.md) |
| `Identifier` | `@unofficial-krds/vue/identifier` | [Contract](../../specs/components/identifier.md) |
| `Image` | `@unofficial-krds/vue/image` | [Contract](../../specs/components/image.md) |
| `InPageNavigation` | `@unofficial-krds/vue/in-page-navigation` | [Contract](../../specs/components/in-page-navigation.md) |
| `LanguageSwitcher` | `@unofficial-krds/vue/language-switcher` | [Contract](../../specs/components/language-switcher.md) |
| `Link` | `@unofficial-krds/vue/link` | [Contract](../../specs/components/link.md) |
| `MainMenu` | `@unofficial-krds/vue/main-menu` | [Contract](../../specs/components/main-menu.md) |
| `Masthead` | `@unofficial-krds/vue/masthead` | [Contract](../../specs/components/masthead.md) |
| `Modal` | `@unofficial-krds/vue/modal` | [Contract](../../specs/components/modal.md) |
| `NativeSelect` | `@unofficial-krds/vue/native-select` | [Contract](../../specs/components/native-select.md) |
| `Pagination` | `@unofficial-krds/vue/pagination` | [Contract](../../specs/components/pagination.md) |
| `QuantityToggle` | `@unofficial-krds/vue/quantity-toggle` | [Contract](../../specs/components/quantity-toggle.md) |
| `RadioGroup` | `@unofficial-krds/vue/radio-group` | [Contract](../../specs/components/radio-group.md) |
| `RangeSlider` | `@unofficial-krds/vue/range-slider` | [Contract](../../specs/components/range-slider.md) |
| `Resize` | `@unofficial-krds/vue/resize` | [Contract](../../specs/components/resize.md) |
| `SideNavigation` | `@unofficial-krds/vue/side-navigation` | [Contract](../../specs/components/side-navigation.md) |
| `SkipLink` | `@unofficial-krds/vue/skip-link` | [Contract](../../specs/components/skip-link.md) |
| `Snackbar` | `@unofficial-krds/vue/snackbar` | [Contract](../../specs/components/snackbar.md) |
| `Spinner` | `@unofficial-krds/vue/spinner` | [Contract](../../specs/components/spinner.md) |
| `StepIndicator` | `@unofficial-krds/vue/step-indicator` | [Contract](../../specs/components/step-indicator.md) |
| `StructuredList` | `@unofficial-krds/vue/structured-list` | [Contract](../../specs/components/structured-list.md) |
| `Switch` | `@unofficial-krds/vue/switch` | [Contract](../../specs/components/switch.md) |
| `TabBar` | `@unofficial-krds/vue/tab-bar` | [Contract](../../specs/components/tab-bar.md) |
| `Table` | `@unofficial-krds/vue/table` | [Contract](../../specs/components/table.md) |
| `Tabs` | `@unofficial-krds/vue/tabs` | [Contract](../../specs/components/tabs.md) |
| `Tag` | `@unofficial-krds/vue/tag` | [Contract](../../specs/components/tag.md) |
| `TextInput` | `@unofficial-krds/vue/text-input` | [Contract](../../specs/components/text-input.md) |
| `TextList` | `@unofficial-krds/vue/text-list` | [Contract](../../specs/components/text-list.md) |
| `Textarea` | `@unofficial-krds/vue/textarea` | [Contract](../../specs/components/textarea.md) |
| `Toast` | `@unofficial-krds/vue/toast` | [Contract](../../specs/components/toast.md) |
| `Tooltip` | `@unofficial-krds/vue/tooltip` | [Contract](../../specs/components/tooltip.md) |
| `TTS` | `@unofficial-krds/vue/tts` | [Contract](../../specs/components/tts.md) |
| `TutorialPanel` | `@unofficial-krds/vue/tutorial-panel` | [Contract](../../specs/components/tutorial-panel.md) |
| `VisuallyHidden` | `@unofficial-krds/vue/visually-hidden` | [Contract](../../specs/components/visually-hidden.md) |

Header has named `skip-link`, `masthead`, `actions` and primary mobile-trigger composition boundaries. Supply the page's actual SkipLink destination and truthful Masthead eligibility through the named slots or adjacent page composition; Header does not invent a second `main-content` target. Its current/mobile/trigger-ID/label inputs control the same native MainMenu. MainMenu owns the responsive menu layer and one recursive native branch component; SideNavigation exposes deep context progressively. Radio option IDs label the actual native inputs.

Pagination windows stay bounded while the dataset page count remains unchanged. Direct input Enter prevents enclosing-form submission; reset restores its draft to the actual page. FileUpload and Quantity form contributions replace their own successful-control positions, preserving same-named siblings and form entry order. Range values must be finite and aligned to the declared step. Tag Enter/Space activate once at keyup and roving skips disabled native controls.

Styles remain opt-in: `@unofficial-krds/styles/reset.css`, `fonts.css`, and `all.css`. Components use stable contract part/state attributes. Global styles and fonts do not grant rights to official assets.

Host integrations are explicit. FileUpload retains controlled actual `File` handles and stages without transfer; its current committed files populate a native FormData event and the local Submit driver demonstrates inspection. TTS requests play/pause/resume/stop from an explicit host driver and stops on teardown. LanguageSwitcher keeps real destination anchors; the host owns language/content changes. Resize requests a level ID and the host applies that authoritative percentage to its content scope. BackButton requires a known route boundary and explicit dirty confirmation.

Toast/Snackbar messages remain host owned. Timeouts request dismissal once per generation; rejection leaves the current message visible. Toast requires an external persistent result/history with matching text. Snackbar renders a real anchor for link actions and a native button for action requests. Hosts own queue advancement and results.

CoachMark requires a real target immediately followed by a same-root insertion boundary, for Vue Teleport into that exact location. `requiresAction` needs an actual state verifier; async stale results never advance. Tutorial/Coach Stop restoration resolves the actual remaining modal before any outside candidate. Panels own their restoration policy through shared native isolation primitives.

Favicon installs actual head link nodes on mount and cleans only those nodes; SSR hosts should emit the same descriptors in their document head. AccessibleMedia uses real local audio/video/VTT alternatives and native controls. The bundled fixtures use independently authored geometric video and a synthetic tone. Content/timing equivalence, sign-language production samples and manual AT checks remain review gates.

No adapter coverage/status is self-promoted. See `docs/compatibility/vue.md` and the T10 execution report for actual evidence and limits.
