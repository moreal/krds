# angular · 54 components

This compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.

- Fresh compiler checkpoint after the completed Nx version application; public @unofficial-krds/angular version 0.1.0. The exact source and retained command/log bytes are hash-bound. Compiler success does not award native behavior, SSR/hydration/resume, manual checks or final release acceptance.

Source: [apps/fixture-angular/src/public-catalog-examples.ts](/sources/apps/fixture-angular/src/public-catalog-examples.ts.txt). SHA-256: `d3ab112ccc88d186fdf177e25022d4cc433c5e168d595b751401e5691666d4c1`.

Command: `NG_BUILD_MAX_WORKERS=1 node tools/yarn.mjs workspace @unofficial-krds/fixture-angular build:local`. [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/proof.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/stderr.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-result.json.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stdout.log.txt) · [Original compiler evidence](/sources/apps/docs/compiler-checkpoints/final-versions/angular/package-build-stderr.log.txt).


```ts
import {Component,ChangeDetectionStrategy} from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule} from '@angular/forms';
import {Masthead,Identifier,Header,Footer,SkipLink,MainMenu,Breadcrumb,SideNavigation,InPageNavigation,Pagination,StructuredList,CriticalAlert,Disclosure,Badge,Accordion,Image,Carousel,Table,TextList,Favicon,Link,FAB,RadioGroup,Checkbox,Tag,Switch,StepIndicator,Spinner,HelpPanel,TutorialPanel,ContextualHelp,CoachMark,Tooltip,TTS,Textarea,TextInput,FileUpload,LanguageSwitcher,Resize,AccessibleMedia,VisuallyHidden,RangeSlider,BackButton,BottomSheet,QuantityToggle,Toast,Snackbar,TabBar,Button,NativeSelect,Modal,Tabs,Calendar,DateInput,type FileRecord,type ToastMessage,type SnackbarMessage} from '@unofficial-krds/angular';
/** Strict public declaration consumer: no any, raw source alias, renderer shim or descriptor dispatch. */
@Component({selector:'krds-public-catalog-examples',standalone:true,changeDetection:ChangeDetectionStrategy.OnPush,imports:[ReactiveFormsModule,Masthead,Identifier,Header,Footer,SkipLink,MainMenu,Breadcrumb,SideNavigation,InPageNavigation,Pagination,StructuredList,CriticalAlert,Disclosure,Badge,Accordion,Image,Carousel,Table,TextList,Favicon,Link,FAB,RadioGroup,Checkbox,Tag,Switch,StepIndicator,Spinner,HelpPanel,TutorialPanel,ContextualHelp,CoachMark,Tooltip,TTS,Textarea,TextInput,FileUpload,LanguageSwitcher,Resize,AccessibleMedia,VisuallyHidden,RangeSlider,BackButton,BottomSheet,QuantityToggle,Toast,Snackbar,TabBar,Button,NativeSelect,Modal,Tabs,Calendar,DateInput],template:`
<krds-masthead [governmentService]="false"/>
<krds-identifier institutionName="독립 예제 기관" [logo]="logo" relationshipText="독립 예제 기관이 운영하는 예시입니다."/>
<krds-header [home]="home" [utilityItems]="[]" [mainNavigation]="navigation" currentId="home" mobileTriggerId="public-header-menu"/>
<krds-footer [serviceLogo]="logo" [contacts]="[]" [utilityLinks]="[]" [privacyPolicy]="privacy" [policyLinks]="[]" copyrightText="독립 예제"/>
<krds-skip-link [links]="[{id:'main',label:'본문 바로가기',targetId:'public-main'}]"/>
<krds-main-menu [items]="navigation" label="메인 메뉴" mobileTriggerId="public-menu"/>
<krds-breadcrumb [home]="home" [items]="[{id:'service',label:'서비스',href:'/local/service'}]"/>
<krds-side-navigation [items]="navigation" title="예제 메뉴" currentId="home"/>
<krds-in-page-navigation title="목차" [sections]="[{id:'public-main',label:'본문'}]"/>
<krds-pagination [pageCount]="3" [defaultPage]="1" [hrefForPage]="pageHref"/>
<krds-structured-list [items]="[{id:'one',title:'신청 안내',href:'/local/application',metadata:[{label:'상태',value:'접수 중'}]}]"/>
<krds-critical-alert urgency="low" label="안내" message="예제 서비스입니다."/>
<krds-disclosure label="상세 안내" contentId="public-details"><p>추가 정보입니다.</p></krds-disclosure>
<krds-badge label="진행 중" appearance="outline" tone="information"/>
<krds-accordion [items]="[{id:'public-eligibility',title:'신청 자격',content:'신청 자격 안내입니다.'}]"/>
<krds-image src="/local-assets/specimen-logo.svg" alt="독립 예제 서비스" [width]="64" [height]="64"/>
<krds-carousel [items]="[{id:'one',label:'신청 안내',content:'첫 번째 안내'},{id:'two',label:'서류 안내',content:'두 번째 안내'}]"/>
<krds-table id="public-table" caption="접수 현황" [columns]="[{id:'name',label:'이름',kind:'text'}]" [rows]="[{id:'one',cells:{name:'예제'}}]"/>
<krds-text-list [items]="[{id:'one',content:'첫 번째 정보'}]"/>
<krds-favicon [light]="{href:'/local-assets/specimen-icon-light.svg',type:'image/svg+xml',sizes:'any'}"/>
<krds-link href="/local/application" label="신청 안내"/>
<krds-fab label="새 신청" icon="+" (action)="actions=actions+1"/>
<form [formGroup]="form">
 <krds-radio-group id="public-route" label="신청 방법" name="route" [options]="options" [formControl]="route"/>
 <krds-checkbox id="public-consent" label="동의" name="consent" [formControl]="consent"/>
 <krds-switch id="public-notice" label="알림" name="notice" [formControl]="notice"/>
 <krds-textarea id="public-reason" label="신청 사유" name="reason" [formControl]="reason" [maxLength]="100"/>
 <krds-text-input id="public-person" label="신청인" name="person" [formControl]="person" autocomplete="name"/>
 <krds-range-slider id="public-range" label="범위" name="range" [formControl]="range" [min]="0" [max]="100" [step]="10"/>
 <krds-quantity-toggle id="public-quantity" label="수량" name="quantity" [formControl]="quantity" [min]="0" [max]="10"/>
 <krds-native-select id="public-select" label="지역" name="region" [options]="options" [formControl]="region"/>
 <krds-date-input id="public-date" label="날짜" name="date" [formControl]="date" referenceDate="2024-02-15"/>
 <button krdsButton type="submit">제출</button><button krdsButton type="reset">초기화</button>
</form>
<krds-tag mode="static" [items]="[{id:'one',label:'예제'}]"/>
<krds-step-indicator [steps]="[{id:'one',label:'안내',status:'complete'},{id:'two',label:'신청',status:'current'},{id:'three',label:'완료',status:'pending'}]"/>
<krds-spinner [pending]="false" label="불러오는 중" completionMessage="완료"/>
<krds-help-panel id="public-help" [defaultOpen]="false" [topics]="[{id:'eligibility',title:'신청 자격',content:'예제 도움말',relatedLinks:[]}]"/>
<krds-tutorial-panel id="public-tutorial" [defaultOpen]="false" [tasks]="[{id:'task',title:'신청하기',steps:[{id:'step',title:'이름 입력',targetId:'public-person',instruction:'이름을 입력하세요.'}]}]" [activeTaskId]="null" [activeStepId]="null" startActionId="public-start"/>
<krds-contextual-help id="public-context" title="신청 도움말" content="예제 안내입니다." triggerLabel="신청 도움말"/>
<krds-coach-mark [open]="false" [steps]="[{id:'name',title:'이름 입력',targetId:'public-person',instruction:'이름을 입력하세요.'}]" [boundaries]="[{targetId:'public-person',insertionBoundaryId:'public-person-after'}]" startActionId="public-start"/>
<krds-tooltip triggerId="public-tooltip-trigger" textId="public-tooltip-text" triggerLabel="저장 도움말" text="작성한 내용을 저장합니다."/>
<krds-tts label="요약 듣기" summary="예제 서비스 신청 절차 안내입니다." locale="ko-KR" state="idle" (request)="actions=actions+1"/>
<krds-file-upload id="public-upload" name="attachments" label="첨부 파일" [files]="files" (filesChange)="files=$event.value"/>
<krds-language-switcher currentLocale="ko" [options]="[{locale:'ko',nativeLabel:'한국어',translatedLabel:'Korean',href:'/local/ko'},{locale:'en',nativeLabel:'English',translatedLabel:'영어',href:'/local/en'}]"/>
<krds-resize [defaultValue]="'100'"/>
<krds-accessible-media title="독립 로컬 예제 음성" [media]="{kind:'audio',src:'/local-assets/specimen-audio.wav',type:'audio/wav'}" [transcript]="{content:'독립 로컬 예제 음성입니다.'}"/>
<krds-visually-hidden id="public-extra" content="추가 안내"/>
<krds-back-button [canGoBack]="false" fallbackHref="/local/parent" (backRequest)="actions=actions+1"/>
<krds-bottom-sheet id="public-sheet" title="변경 확인" [open]="false"><p>변경할 내용을 확인하세요.</p></krds-bottom-sheet>
<krds-toast [message]="toast" (dismiss)="toast=null"/>
<krds-snackbar [message]="snackbar" (dismiss)="snackbar=null"/>
<krds-tab-bar currentId="home" [items]="[{id:'home',label:'홈',href:'/local/home',icon:'⌂'}]"/>
<krds-modal id="public-modal" title="확인" [open]="false"><p>안내 내용을 확인하세요.</p></krds-modal>
<krds-tabs id="public-tabs" label="주제" [items]="[{value:'one',label:'첫 번째',panel:'첫 번째 내용'},{value:'two',label:'두 번째',panel:'두 번째 내용'}]"/>
<krds-calendar id="public-calendar" label="날짜 선택" referenceDate="2024-02-15"/>
<output aria-label="Public form value">{{person.value}}</output><main id="public-main" tabindex="-1"><h1>예제 서비스</h1></main>
`})
export class PublicCatalogExamples {
 readonly logo={src:'/local-assets/specimen-logo.svg',alt:'독립 예제 서비스'};readonly home={id:'home',href:'/local/home',label:'홈',logo:this.logo};readonly privacy={href:'/local/policy',label:'개인정보처리방침'};readonly navigation=[{id:'home',label:'홈',href:'/local/home'}];readonly options=[{value:'one',label:'첫 번째'},{value:'two',label:'두 번째'}];readonly pageHref=(page:number)=>'/local/results?page='+page;
 readonly person=new FormControl('',{nonNullable:true});readonly reason=new FormControl('',{nonNullable:true});readonly consent=new FormControl(false,{nonNullable:true});readonly notice=new FormControl(false,{nonNullable:true});readonly route=new FormControl<string|null>(null);readonly range=new FormControl(0,{nonNullable:true});readonly quantity=new FormControl(1,{nonNullable:true});readonly region=new FormControl('one',{nonNullable:true});readonly date=new FormControl<string|null>(null);
 readonly form=new FormGroup({person:this.person,reason:this.reason,consent:this.consent,notice:this.notice,route:this.route,range:this.range,quantity:this.quantity,region:this.region,date:this.date});
 files:readonly FileRecord[]=[];toast:ToastMessage|null=null;snackbar:SnackbarMessage|null=null;actions=0;
}
```

