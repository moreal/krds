# vue · 컴포넌트 48개 {#vue-·-48-components}

공개 `@unofficial-krds/vue` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. [소스 파일 내려받기](/sources/apps/fixture-vue/src/PublicCatalogExamples.vue.txt).


```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Masthead, Identifier, Header, Footer, SkipLink, MainMenu, Breadcrumb, SideNavigation, InPageNavigation, Pagination, StructuredList, CriticalAlert, Disclosure, Badge, Accordion, Image, Carousel, Table, TextList, Favicon, Link, FAB, RadioGroup, Checkbox, Tag, Switch, StepIndicator, Spinner, HelpPanel, TutorialPanel, ContextualHelp, CoachMark, Tooltip, TTS, Textarea, TextInput, FileUpload, LanguageSwitcher, Resize, AccessibleMedia, VisuallyHidden, RangeSlider, BackButton, BottomSheet, QuantityToggle, Toast, Snackbar, TabBar, type FileRecord, type NavigationItem, type ToastMessage, type SnackbarMessage, type CoachMarkTargetActionDetails, type TTSContract, type TutorialStopDetails } from '@unofficial-krds/vue';
import BadgeSubpath from '@unofficial-krds/vue/badge';
const navigation: readonly NavigationItem[] = [{id:'home',label:'홈',href:'/local/home'},{id:'apply',label:'신청',children:[{id:'new',label:'신규 신청',href:'/local/apply'}]}];
const logo = {src:'/local-assets/specimen-logo.svg',alt:'독립 예제 운영기관'};
const identity = {institutionName:'독립 예제 운영기관',logo,relationshipText:'독립 예제 운영기관이 운영하는 예제 서비스입니다.'};
const name=ref(''),reason=ref(''),choice=ref<string|null>(null),agreed=ref(false),enabled=ref(false),volume=ref(20),quantity=ref(1),open=ref(false),speech=ref<TTSContract['state']>('idle'),scale=ref('100'),files=ref<readonly FileRecord[]>([]),toast=ref<ToastMessage|null>(null),snackbar=ref<SnackbarMessage|null>(null),running=ref(false),step=ref('name');
const panel=ref<'help'|'tutorial'>('tutorial');
function verifyTarget(detail:CoachMarkTargetActionDetails){return detail.targetId==='example-target'&&name.value.trim().length>0;}
function stopTutorial(_detail:TutorialStopDetails){running.value=false;panel.value='tutorial';open.value=true;}
function speechRequest(detail:Parameters<NonNullable<TTSContract['onRequest']>>[0]){speech.value=detail.action==='stop'?'idle':detail.action==='pause'?'paused':'playing';}
function notifySaved(){toast.value={id:'saved',text:'신청이 저장되었습니다.',tone:'information',persistentResultId:'example-result'};snackbar.value={id:'saved-action',title:'저장 완료',text:'예제 신청을 저장했습니다.'};}
</script>
<template>
<div>
<SkipLink :links="[{id:'main',label:'본문 바로가기',targetId:'example-main'}]"/>
<Masthead :government-service="false"/>
<Header :home="{href:'/local/home',label:'독립 예제 홈',logo}" :utility-items="[{id:'policy',label:'이용약관',href:'/local/policy'}]" :main-navigation="navigation" :search="{label:'검색',onRequest:()=>name='검색 요청'}"/>
<main id="example-main" tabindex="-1">
<h1>Native Vue public package examples</h1>
<Identifier v-bind="identity"/>
<MainMenu :items="navigation" current-id="home"/>
<Breadcrumb :home="{label:'홈',href:'/local/home'}" :items="[{id:'apply',label:'신청',href:'/local/apply'}]"/>
<SideNavigation :items="navigation" current-id="new" title="신청 안내"/>
<InPageNavigation :sections="[{id:'example-details',label:'신청 내용'}]" title="이 페이지의 구성"/>
<section id="example-details" tabindex="-1"><h2>신청 내용</h2><p>실제 페이지의 목적지입니다.</p></section>
<Pagination :page-count="3" :href-for-page="page=>`/local/results?page=${page}`"/>
<StructuredList :items="[{id:'notice',title:'신청 공고',href:'/local/notice',metadata:[{label:'담당 부서',value:'예제 부서'}]}]"><template #actions><button type="button" @click="notifySaved">저장</button></template></StructuredList>
<CriticalAlert urgency="low" label="서비스 안내" message="이 페이지는 독립 로컬 예제입니다." :details="{label:'상세 안내',href:'/local/details',destinationTitle:'상세 안내'}"/>
<Disclosure label="신청 도움말" content-id="example-disclosure"><p>제출 전에 내용을 확인하세요.</p></Disclosure>
<Badge label="접수 중" tone="information"/><BadgeSubpath label="하위 경로"/>
<Accordion :items="[{id:'requirements',title:'신청 요건',content:'예제 신청 요건입니다.'}]"><template #requirements><a href="/local/requirements">신청 요건 보기</a></template></Accordion>
<Image src="/local-assets/specimen-landscape.svg" alt="독립 예제의 기하학적 풍경" caption="직접 작성한 로컬 예제"/>
<Carousel :items="[{id:'one',label:'첫 안내',content:'첫 번째 안내'},{id:'two',label:'다음 안내',content:'다음 안내'}]"><template #one><a href="/local/first">첫 안내 읽기</a></template></Carousel>
<Table caption="예제 신청 목록" :columns="[{id:'name',label:'신청인',kind:'text'},{id:'count',label:'건수',kind:'number'}]" :rows="[{id:'one',cells:{name:'홍길동',count:1}}]" row-header-column-id="name"/>
<TextList :items="[{id:'one',content:'신청서를 작성합니다.',children:[{id:'one-child',content:'필수 항목을 확인합니다.'}]},{id:'two',content:'제출합니다.'}]" ordered/>
<Favicon :light="{href:'/local-assets/specimen-icon-light.svg',type:'image/svg+xml',sizes:'any'}" :dark="{href:'/local-assets/specimen-icon-dark.svg',type:'image/svg+xml',sizes:'any'}"/>
<Link href="/local/help" label="도움말"/>
<FAB label="신청 저장" icon="+" @action="notifySaved"/>
<form @submit.prevent="notifySaved">
<RadioGroup v-model="choice" label="지역" name="region" :options="[{label:'서울',value:'seoul'},{label:'부산',value:'busan'}]"/>
<Checkbox v-model="agreed" label="이용약관 동의" name="consent"/>
<Switch v-model="enabled" label="알림 사용" name="notifications"/>
<Textarea v-model="reason" label="신청 사유" name="reason" :max-length="500"/>
<TextInput v-model="name" label="신청인" name="applicant" autocomplete="name"/>
<FileUpload :files="files" label="첨부 서류" name="documents" accept=".txt,.pdf" multiple @files-change="files=$event.value"/>
<RangeSlider v-model="volume" label="알림 음량" name="volume" :min="0" :max="100" :step="10"/>
<QuantityToggle v-model="quantity" label="수량" name="quantity" :min="0" :max="10" :step="1" unit="개"/>
<button type="reset">초기화</button><button type="submit">신청 저장</button>
</form>
<Tag :items="[{id:'all',label:'전체'},{id:'recent',label:'최근'}]" mode="toggle" :selected-ids="[]"/>
<StepIndicator :steps="[{id:'write',label:'작성',status:'complete'},{id:'review',label:'확인',status:'current'},{id:'submit',label:'제출',status:'pending'}]"/>
<Spinner :pending="false" label="저장 중" completion-message="저장이 끝났습니다." :value="100"/>
<HelpPanel :topics="[{id:'eligibility',title:'신청 자격',content:'예제 신청 자격을 확인하세요.',relatedLinks:[{label:'상세 요건',href:'/local/eligibility'}]}]" :default-open="false"/>
<TutorialPanel :open="open" :running="running" :active-panel="panel" :tasks="[{id:'apply',title:'신청하기',steps:[{id:'name',title:'이름 입력',targetId:'example-target',instruction:'이름을 입력하세요.'}]}]" active-task-id="apply" :active-step-id="step" start-action-id="example-start" @start="running=true" @open-change="open=$event.open" @active-panel-change="panel=$event.value" @stop="stopTutorial"/>
<ContextualHelp title="이름 입력 안내" content="신청인 이름을 입력하세요." trigger-label="이름 입력 도움말"><a href="/local/name-help">상세 도움말</a></ContextualHelp>
<button id="example-run" type="button" @click="running=true">튜토리얼 시작</button><label for="example-target">연습 이름</label><input id="example-target" v-model="name"/><span id="example-target-after"/>
<CoachMark :open="running" :steps="[{id:'name',targetId:'example-target',title:'이름 입력',instruction:'연습 이름을 입력하세요.',requiresAction:true}]" :boundaries="[{targetId:'example-target',insertionBoundaryId:'example-target-after'}]" :step-id="step" start-action-id="example-start" :on-target-action="verifyTarget" @step-change="step=$event.id" @stop="stopTutorial"/>
<Tooltip text="입력한 내용을 저장합니다." trigger-label="저장 도움말" trigger-id="example-tooltip" text-id="example-tooltip-text"/>
<TTS summary="신청 내용을 작성하고 확인한 뒤 저장합니다." locale="ko-KR" :state="speech" label="신청 절차 안내" @request="speechRequest"/>
<LanguageSwitcher current-locale="ko" :options="[{locale:'ko',nativeLabel:'한국어',translatedLabel:'한국어',href:'/local/ko'},{locale:'en',nativeLabel:'English',translatedLabel:'영어',href:'/local/en'}]"/>
<Resize :value="scale" @value-change="scale=$event.value"/><p :style="{fontSize:`${scale}%`}">크기 설정을 적용한 본문입니다.</p>
<AccessibleMedia :media="{kind:'audio',src:'/local-assets/specimen-audio.wav',type:'audio/wav'}" title="독립 예제 신호음" :transcript="{content:'약 1초 동안 일정한 높이의 신호음이 들립니다.'}"/>
<VisuallyHidden id="example-description" content="신청서 작성 후 저장하세요."/><button type="button" aria-describedby="example-description" @click="notifySaved">저장</button>
<BackButton label="이전 화면" :can-go-back="true" :on-back-request="()=>name='이전 화면 요청'"/>
<BottomSheet title="지역 선택" :default-open="false"><template #trigger="{open:show}"><button type="button" @click="show">지역 선택 열기</button></template><p>지역을 선택하세요.</p></BottomSheet>
<p id="example-result">신청이 저장되었습니다.</p><Toast :message="toast" @dismiss="toast=null"/>
<Snackbar :message="snackbar" :action="{kind:'link',id:'result',label:'신청 내역',href:'/local/history'}" @dismiss="snackbar=null"/>
</main>
<Footer :service-logo="logo" :contacts="[{label:'예제 문의',text:'example@example.test',href:'mailto:example@example.test'}]" :utility-links="[]" :privacy-policy="{label:'개인정보 처리방침',href:'/local/privacy'}" :policy-links="[]" copyright-text="독립 로컬 예제 콘텐츠" :institution="identity"/>
<TabBar :items="[{id:'home',label:'홈',href:'/local/home',icon:'home'},{id:'apply',label:'신청',href:'/local/apply',icon:'document'}]" current-id="home"/>
</div>
</template>
```

