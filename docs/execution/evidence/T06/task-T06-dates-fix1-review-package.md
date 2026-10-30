# T06 dates fix round 1 and approved Calendar adaptation

Original JSX opener naming finding plus controller-approved visible Korean day-unit and private table-only scroll wrapper. Original six-component date spec remains binding. Raw earlier axe finding preserved; no suppression. Final full candidate evidence to be appended by lead.

## apps/fixture-solid/tests/siheom/calendar.test.tsx

```diff
--- before-fix/apps/fixture-solid/tests/siheom/calendar.test.tsx
+++ apps/fixture-solid/tests/siheom/calendar.test.tsx
@@ -85,10 +85,37 @@
   const changes: unknown[] = [];
   const [disabled, setDisabled] = createSignal(true);
   render(() => <Calendar label="날짜" disabled={disabled()} defaultValue="9999-12-31" onValueChange={(v:any) => changes.push(v)} />);
   expect(screen.getByRole('button', { name: '다음 달' })).toBeDisabled();
   expect(screen.getByRole('button', { name: '확인' })).toBeDisabled();
   setDisabled(false);
   fireEvent.click(screen.getByRole('button', { name: '지우기' }));
   fireEvent.click(screen.getByRole('button', { name: '확인' }));
   expect(changes).toEqual([{ value: null }]);
 });
+
+test('Korean visible day units match the intact full date name while English stays numeric', () => {
+  const [locale,setLocale]=createSignal<'ko-KR'|'en-US'>('ko-KR');
+  const [translations,setTranslations]=createSignal<Record<string,string>|undefined>();
+  render(() => <Calendar label="날짜 선택" locale={locale()} translations={translations()} value="2024-02-29" today="2024-02-29" />);
+  const korean=screen.getByRole('button',{name:'2024년 2월 29일 목요일, 오늘, 선택됨'});
+  expect(korean.textContent).toBe('29일');
+  expect(korean).toHaveAttribute('aria-pressed','true');
+  setLocale('en-US');
+  expect(screen.getByRole('button',{name:'Thursday, February 29, 2024, Today, Selected'}).textContent).toBe('29');
+  setTranslations({visibleDayLabel:'day {day}'});
+  expect(screen.getByRole('button',{name:'Thursday, February 29, 2024, Today, Selected'}).textContent).toBe('day 29');
+});
+
+test('month table scroll area is keyboard reachable while heading navigation and actions remain outside', () => {
+  render(() => <Calendar label="날짜 선택" referenceDate="2024-02-15" />);
+  const scroller=screen.getByRole('region',{name:'2024년 2월'});
+  scroller.focus();
+  expect(document.activeElement).toBe(scroller);
+  const table=screen.getByRole('table',{name:'2024년 2월'});
+  expect(scroller.contains(table)).toBe(true);
+  expect(table.querySelectorAll('tbody tr')).toHaveLength(6);
+  expect(table.querySelectorAll('tbody td')).toHaveLength(42);
+  expect(scroller.contains(screen.getByRole('heading',{name:'2024년 2월'}))).toBe(false);
+  expect(scroller.contains(screen.getByRole('button',{name:'이전 달'}))).toBe(false);
+  expect(scroller.contains(screen.getByRole('button',{name:'확인'}))).toBe(false);
+});
```

## apps/fixture-solid/tests/siheom/date-input.test.tsx

```diff
--- before-fix/apps/fixture-solid/tests/siheom/date-input.test.tsx
+++ apps/fixture-solid/tests/siheom/date-input.test.tsx
@@ -160,10 +160,19 @@
   render(() => <Modal title="바깥 대화상자" defaultOpen><DateInput label="날짜" /></Modal>);
   fireEvent.click(screen.getByRole('button',{name:'달력 열기'}));
   const popup=await screen.findByRole('dialog',{name:'날짜 선택'});
   fireEvent.keyDown(popup,{key:'Escape',isComposing:true});
   expect(popup).toBeVisible();
   fireEvent.keyDown(popup,{key:'Escape'});
   await Promise.resolve();
   expect(screen.queryByRole('dialog',{name:'날짜 선택'})).toBeNull();
   expect(screen.getByRole('dialog',{name:'바깥 대화상자'})).toBeVisible();
 });
+
+test('two range calendar openers include their distinct JSX task labels', () => {
+  render(() => <>
+    <DateInput mode="range" label={<strong>방문 기간</strong>} />
+    <DateInput mode="range" label={<strong>접수 기간</strong>} />
+  </>);
+  expect(screen.getByRole('button',{name:'방문 기간 달력 열기'})).toBeVisible();
+  expect(screen.getByRole('button',{name:'접수 기간 달력 열기'})).toBeVisible();
+});
```

## apps/storybook-solid/src/stories/date-input.stories.tsx

```diff
--- before-fix/apps/storybook-solid/src/stories/date-input.stories.tsx
+++ apps/storybook-solid/src/stories/date-input.stories.tsx
@@ -1,14 +1,14 @@
 import type { Meta, StoryObj } from 'storybook-solidjs-vite';
 import { createSignal } from 'solid-js';
 import { DateInput } from '@krds-native/solid';
 
 const meta={id:'krds-date-input',title:'KRDS/DateInput',component:DateInput,args:{label:'날짜',referenceDate:'2024-02-15'}} satisfies Meta<typeof DateInput>;
 export default meta;
 type Story=StoryObj<typeof meta>;
 export const Default:Story={args:{}};
 export const Disabled:Story={args:{disabled:true,value:'2024-02-15'}};
-export const Invalid:Story={args:{value:null,invalid:true,errorMessage:'날짜를 확인하세요'}};
+export const Invalid:Story={args:{value:null,invalid:true,errorMessage:'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요'}};
 export const Selected:Story={args:{value:'2024-02-29'}};
 export const Range:Story={args:{mode:'range',label:'방문 기간',defaultValue:{start:'2024-02-12',end:'2024-02-18'}}};
 export const WithoutCalendar:Story={args:{withCalendar:false}};
 export const Controlled:Story={render:() => {const [value,setValue]=createSignal<string|null>('2024-02-15');return <DateInput label="방문일" value={value()} referenceDate="2024-02-15" onValueChange={({value})=>setValue(value)} />;}};
```

## packages/solid/src/components/calendar/index.tsx

```diff
--- before-fix/packages/solid/src/components/calendar/index.tsx
+++ packages/solid/src/components/calendar/index.tsx
@@ -1,27 +1,27 @@
 import { For, Show, createEffect, createMemo, createSignal, createUniqueId, on, splitProps } from 'solid-js';
 import type { JSX } from 'solid-js';
 import { addDays, addMonths, calendarMonthGrid, parseIsoDate, weekday } from '@krds-native/contracts';
 import type { DateRangeValue, ValueChangeDetails } from '@krds-native/contracts';
 import { useKrdsEnvironment } from '../../providers';
 import { copyValue, dateConfig, emptyValue, endpoints, interpolate, nonemptyDictionary, notifyValue, sameValue, validateValue } from './model';
 import type { DateModeProps, DateValue } from './model';
 
 export interface CalendarTranslations {
   previousMonth: string; nextMonth: string; today: string; clear: string; cancel: string; confirm: string;
-  selected: string; unavailable: string; adjacentMonth: string; dateLabel: string; monthLabel: string;
+  selected: string; unavailable: string; adjacentMonth: string; dateLabel: string; monthLabel: string; visibleDayLabel: string;
   startLabel: string; endLabel: string; weekdays: readonly string[]; weekdayShort: readonly string[]; months: readonly string[];
 }
 const englishMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
 const dictionaries: Record<'ko-KR'|'en-US', CalendarTranslations> = {
-  'ko-KR': { previousMonth:'이전 달', nextMonth:'다음 달', today:'오늘', clear:'지우기', cancel:'취소', confirm:'확인', selected:'선택됨', unavailable:'선택할 수 없음', adjacentMonth:'다른 달', dateLabel:'{year}년 {month}월 {day}일 {weekday}', monthLabel:'{year}년 {month}월', startLabel:'시작일', endLabel:'종료일', weekdays:['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], weekdayShort:['일','월','화','수','목','금','토'], months:englishMonths },
-  'en-US': { previousMonth:'Previous month', nextMonth:'Next month', today:'Today', clear:'Clear', cancel:'Cancel', confirm:'Confirm', selected:'Selected', unavailable:'Unavailable', adjacentMonth:'Outside displayed month', dateLabel:'{weekday}, {monthName} {day}, {year}', monthLabel:'{monthName} {year}', startLabel:'Start date', endLabel:'End date', weekdays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], weekdayShort:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], months:englishMonths },
+  'ko-KR': { previousMonth:'이전 달', nextMonth:'다음 달', today:'오늘', clear:'지우기', cancel:'취소', confirm:'확인', selected:'선택됨', unavailable:'선택할 수 없음', adjacentMonth:'다른 달', dateLabel:'{year}년 {month}월 {day}일 {weekday}', monthLabel:'{year}년 {month}월', visibleDayLabel:'{day}일', startLabel:'시작일', endLabel:'종료일', weekdays:['일요일','월요일','화요일','수요일','목요일','금요일','토요일'], weekdayShort:['일','월','화','수','목','금','토'], months:englishMonths },
+  'en-US': { previousMonth:'Previous month', nextMonth:'Next month', today:'Today', clear:'Clear', cancel:'Cancel', confirm:'Confirm', selected:'Selected', unavailable:'Unavailable', adjacentMonth:'Outside displayed month', dateLabel:'{weekday}, {monthName} {day}, {year}', monthLabel:'{monthName} {year}', visibleDayLabel:'{day}', startLabel:'Start date', endLabel:'End date', weekdays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], weekdayShort:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], months:englishMonths },
 };
 interface CalendarBaseProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'|'onChange'|'onInput'|'onSelect'> {
   label?: JSX.Element; min?: string; max?: string; disabled?: boolean; required?: boolean;
   locale?: 'ko-KR'|'en-US'; translations?: Partial<CalendarTranslations>; referenceDate?: string; today?: string;
   onCancel?: () => void;
 }
 export type CalendarProps = CalendarBaseProps & (DateModeProps extends infer P ? P extends { mode?: 'single' } ? P & { onConfirm?: (details:ValueChangeDetails<string|null>) => void } : P & { onConfirm?: (details:ValueChangeDetails<DateRangeValue>) => void } : never);
 
 /** A native Solid date selector. Selection remains tentative until Confirm. */
 export function Calendar(props: CalendarProps): JSX.Element {
@@ -133,14 +133,16 @@
       if (!controlled) setInternal(copyValue(value));
       notifyValue(props,value);
     }
     (props.onConfirm as ((detail:ValueChangeDetails<DateValue>)=>void)|undefined)?.({ value:copyValue(value) });
     if (controlled) { setDraft(copyValue(committed())); setMonth(initialMonth(committed())); }
   }
   const attr = (part:string, state='') => ({ 'data-krds-component':'calendar', 'data-krds-part':part, 'data-krds-state':state });
   return <div {...native} ref={element => { root=element; if (typeof props.ref==='function') props.ref(element); }} id={id} class={props.class} style={props.style} dir={props.dir ?? environment.direction()} role="group" aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby'] ?? (props.label ? `${id}-label` : undefined)} {...attr('root',props.disabled ? 'disabled' : '')}>
     <Show when={props.label}><div id={`${id}-label`}>{props.label}</div></Show>
     <div {...attr('header')}><button type="button" {...attr('previous',props.disabled || !navigationMonth(-1) ? 'disabled' : '')} aria-label={translations().previousMonth} disabled={props.disabled || !navigationMonth(-1)} onClick={() => { const target=navigationMonth(-1); if (!props.disabled && target) setMonth(target); }}>‹</button><h2 id={`${id}-heading`} aria-live="polite" aria-atomic="true" {...attr('heading')}>{heading()}</h2><button type="button" {...attr('next',props.disabled || !navigationMonth(1) ? 'disabled' : '')} aria-label={translations().nextMonth} disabled={props.disabled || !navigationMonth(1)} onClick={() => { const target=navigationMonth(1); if (!props.disabled && target) setMonth(target); }}>›</button></div>
-    <table aria-labelledby={`${id}-heading`} {...attr('table')}><thead><tr><For each={translations().weekdays}>{(name,index) => <th scope="col" aria-label={name} {...attr('weekday')}>{translations().weekdayShort[index()]}</th>}</For></tr></thead><tbody><For each={[0,1,2,3,4,5]}>{row => <tr><For each={grid().slice(row*7,row*7+7)}>{date => <td {...attr('cell')}><Show when={date}>{date => <button type="button" data-date={date()} {...attr('day',states(date()))} aria-label={dateName(date())} aria-current={date() === props.today ? 'date' : undefined} aria-pressed={selected(date())} disabled={!selectable(date())} onKeyDown={event => keydown(event,date())} onClick={() => activate(date())}>{parseIsoDate(date())!.day}</button>}</Show></td>}</For></tr>}</For></tbody></table>
+    <div data-krds-component="calendar" data-krds-internal="table-scroll" role="region" aria-labelledby={`${id}-heading`} tabIndex={0}>
+    <table aria-labelledby={`${id}-heading`} {...attr('table')}><thead><tr><For each={translations().weekdays}>{(name,index) => <th scope="col" aria-label={name} {...attr('weekday')}>{translations().weekdayShort[index()]}</th>}</For></tr></thead><tbody><For each={[0,1,2,3,4,5]}>{row => <tr><For each={grid().slice(row*7,row*7+7)}>{date => <td {...attr('cell')}><Show when={date}>{date => <button type="button" data-date={date()} {...attr('day',states(date()))} aria-label={dateName(date())} aria-current={date() === props.today ? 'date' : undefined} aria-pressed={selected(date())} disabled={!selectable(date())} onKeyDown={event => keydown(event,date())} onClick={() => activate(date())}>{interpolate(translations().visibleDayLabel,{...parseIsoDate(date())!})}</button>}</Show></td>}</For></tr>}</For></tbody></table>
+    </div>
     <div {...attr('footer')}><Show when={props.today}><button type="button" {...attr('today',!selectable(props.today!) ? 'disabled' : '')} disabled={!selectable(props.today!)} onClick={() => { if (props.today && selectable(props.today)) focusDate(props.today); }}>{translations().today}</button></Show><Show when={!props.required}><button type="button" {...attr('clear',props.disabled ? 'disabled' : '')} disabled={props.disabled} onClick={() => { if (!props.disabled) setDraft(emptyValue(range)); }}>{translations().clear}</button></Show><button type="button" {...attr('cancel',props.disabled ? 'disabled' : '')} disabled={props.disabled} onClick={() => { if (!props.disabled) { setDraft(copyValue(committed())); setMonth(initialMonth(committed())); props.onCancel?.(); } }}>{translations().cancel}</button><button type="button" {...attr('confirm',!canConfirm() ? 'disabled' : '')} disabled={!canConfirm()} onClick={confirm}>{translations().confirm}</button></div>
   </div>;
 }
```

## packages/solid/src/components/date-input/index.tsx

```diff
--- before-fix/packages/solid/src/components/date-input/index.tsx
+++ packages/solid/src/components/date-input/index.tsx
@@ -159,22 +159,22 @@
       event.preventDefault();
       if (!composing() && !event.isComposing && event.keyCode!==229) closePopup();
     }} onClose={() => { if (open()) { setOpen(false); queueMicrotask(restoreFocus); } }}>
     <h2 id={`${id}-popup-title`}>{translations().calendarTitle}</h2>
     <Calendar {...({ mode:range ? 'range':'single', value:committed(), label:translations().calendarTitle, min:props.min, max:props.max, disabled:props.disabled, required:props.required, locale:props.locale, referenceDate:props.referenceDate, today:props.today, translations:{startLabel:translations().startLabel,endLabel:translations().endLabel,...props.calendarTranslations}, onConfirm:({value}:{value:DateValue}) => { commitValue(value); closePopup(); }, onCancel:closePopup } as CalendarProps)} />
     <button type="button" onClick={closePopup}>{(props.locale ?? environment.locale())==='ko-KR' ? '닫기':'Close'}</button>
   </dialog></Show>;
   const contents=() => <>
     <Show when={range}><label for={id} {...attr('label')}>{translations().startLabel}</label></Show>{input(0)}
     <Show when={range}><label for={`${id}-end`} {...attr('label')}>{translations().endLabel}</label>{input(1)}</Show>
-    <Show when={props.withCalendar !== false}><button ref={trigger} type="button" aria-label={range && typeof props.label==='string' ? `${props.label} ${translations().openCalendar}` : translations().openCalendar} aria-haspopup="dialog" aria-expanded={open()} aria-controls={`${id}-popup`} disabled={props.disabled} {...attr('trigger',open() ? 'open':'closed')} onClick={openPopup}>{translations().openCalendar}</button></Show>
+    <Show when={props.withCalendar !== false}><button ref={trigger} type="button" aria-label={range ? undefined : translations().openCalendar} aria-labelledby={range ? `${id}-label ${id}-trigger-label` : undefined} aria-haspopup="dialog" aria-expanded={open()} aria-controls={`${id}-popup`} disabled={props.disabled} {...attr('trigger',open() ? 'open':'closed')} onClick={openPopup}><span id={`${id}-trigger-label`}>{translations().openCalendar}</span></button></Show>
     <span id={`${id}-hint`} {...attr('hint')}>{props.hint ?? translations().formatHint}</span>
     <span id={`${id}-error`} role="status" aria-live="polite" aria-atomic="true" {...attr('error',invalid() ? 'invalid':'')}>{error()?.message || externalError()}</span>
     <input type="hidden" name={props.name ? range ? `${props.name}.start` : props.name : undefined} value={endpoints(committed())[0] ?? ''} disabled={props.disabled} form={props.form}/>
     <Show when={range}><input type="hidden" name={props.name ? `${props.name}.end` : undefined} value={endpoints(committed())[1] ?? ''} disabled={props.disabled} form={props.form}/></Show>
     {popup()}
   </>;
   const focusout:JSX.EventHandler<HTMLElement,FocusEvent> = event => {
     if (!composing() && !open() && !(event.relatedTarget instanceof Node && root.contains(event.relatedTarget))) commit();
   };
-  return range ? <fieldset ref={element => root=element} class={props.class} style={props.style} dir={environment.direction()} {...attr('root',[props.disabled && 'disabled',invalid() && 'invalid'].filter(Boolean).join(' '))} onFocusOut={focusout}><legend {...attr('label')}>{props.label}</legend>{contents()}</fieldset> : <div ref={element => root=element} class={props.class} style={props.style} dir={environment.direction()} {...attr('root',[props.disabled && 'disabled',invalid() && 'invalid'].filter(Boolean).join(' '))} onFocusOut={focusout}><label for={id} {...attr('label')}>{props.label}</label>{contents()}</div>;
+  return range ? <fieldset ref={element => root=element} class={props.class} style={props.style} dir={environment.direction()} {...attr('root',[props.disabled && 'disabled',invalid() && 'invalid'].filter(Boolean).join(' '))} onFocusOut={focusout}><legend id={`${id}-label`} {...attr('label')}>{props.label}</legend>{contents()}</fieldset> : <div ref={element => root=element} class={props.class} style={props.style} dir={environment.direction()} {...attr('root',[props.disabled && 'disabled',invalid() && 'invalid'].filter(Boolean).join(' '))} onFocusOut={focusout}><label for={id} {...attr('label')}>{props.label}</label>{contents()}</div>;
 }
```

## specs/components/calendar.md

```diff
--- before-fix/specs/components/calendar.md
+++ specs/components/calendar.md
@@ -35,19 +35,22 @@
 | previousMonth | 이전 달 | Previous month |
 | nextMonth | 다음 달 | Next month |
 | today | 오늘 | Today |
 | clear | 지우기 | Clear |
 | cancel | 취소 | Cancel |
 | confirm | 확인 | Confirm |
 | selected | 선택됨 | Selected |
 | unavailable | 선택할 수 없음 | Unavailable |
 | adjacentMonth | 다른 달 | Outside displayed month |
 | dateLabel | {year}년 {month}월 {day}일 {weekday} | {weekday}, {monthName} {day}, {year} |
+| visibleDayLabel | {day}일 | {day} |
 | monthLabel | {year}년 {month}월 | {monthName} {year} |
+
+`visibleDayLabel` controls actual visible day-button text separately from the full accessible `dateLabel`; it is a nonempty plain-text template with `{year}`, `{month}` and `{day}` substitutions. Korean defaults therefore show `29일`, while English defaults show `29`. This project presentation adaptation differs from the frozen upstream numeric-only day-span example. It preserves the exact required full Korean accessible date/state name and makes the visible date-unit token match that name under the installed axe 4.14 whole-word comparison; it is not a claim that KRDS prescribes a visible day suffix or that an automated rule establishes voice-control/screen-reader acceptance. The adaptation follows the controller's implementation ruling; the original raw failure and supporting research remain retained in `.superpowers/sdd/PLAN/task-T06-calendar-axe-research.md` and its evidence logs.
 
 Weekday names Sunday→Saturday: Korean `일요일, 월요일, 화요일, 수요일, 목요일, 금요일, 토요일` (visible `일, 월, 화, 수, 목, 금, 토`); English `Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday` (visible `Sun, Mon, Tue, Wed, Thu, Fri, Sat`). English month names are January through December. Locale determines these lists using Gregorian data; explicit weekday/month-name overrides must provide complete arrays of 7/12 nonempty names. Base day name for 2024-02-29 is `2024년 2월 29일 목요일` or `Thursday, February 29, 2024`. Append translated today, selected and unavailable/adjacent descriptions in that order when applicable, separated by commas. A numeric day alone is insufficient. Range endpoints additionally have translated `시작일`/`종료일` (`Start date`/`End date`) descriptions; a one-day range has both. These endpoint terms reuse DateInputTranslations or explicit standalone overrides `startLabel`/`endLabel` with the same defaults.
 
 ## Structure and acceptance
 
 Order: heading with previous/next month controls, weekday/date table, optional Today, Clear when allowed, Cancel and Confirm. Parts: `root`, `header`, `heading`, `previous`, `next`, `table`, `weekday`, `cell`, `day`, `footer`, `today`, `clear`, `cancel`, `confirm`. Day states: `today`, `selected`, `range-start`, `range-end`, `in-range`, `outside-month`, `disabled`. Distinguish focus from selected/today. `selected` reflects tentative selection while editing; a canceled popup never updates committed DateInput display. Controls expose `disabled` as applicable.
 
 Acceptance: leap years and century rules; month/year boundaries; inclusive limits and unavailable dates; same-day/reversed-click range; partial range disables Confirm; Clear/Cancel/Confirm and controlled request counts; no value events during navigation; explicit today/referenceDate; all enabled buttons sequentially reachable plus additive arrows; Korean full date/weekday/state names; popup focus return versus standalone no trap; forced-colors non-color state cues. Source records, specs and tests do not count as renderer coverage.
```
