import * as Native from '@unofficial-krds/angular';
import { expect, test } from 'vitest';
const names = ['Masthead','Identifier','Header','Footer','SkipLink','MainMenu','Breadcrumb','SideNavigation','InPageNavigation','Pagination','StructuredList','CriticalAlert','Disclosure','Badge','Accordion','Image','Carousel','Table','TextList','Favicon','Link','FAB','RadioGroup','Checkbox','Tag','Switch','StepIndicator','Spinner','HelpPanel','TutorialPanel','ContextualHelp','CoachMark','Tooltip','TTS','Textarea','TextInput','FileUpload','LanguageSwitcher','Resize','AccessibleMedia','VisuallyHidden','RangeSlider','BackButton','BottomSheet','QuantityToggle','Toast','Snackbar','TabBar'];
test('the public Angular package supplies every approved native catalog API', () => {
    const missing = names.filter(name => typeof (Native as Record<string, unknown>)[name] !== 'function');
    expect(missing).toEqual([]);
});
