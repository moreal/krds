<script setup lang="ts">
import TutorialExample from './TutorialExample.vue';
import { LocalSpeechDriver, type LocalSpeechSnapshot } from './local-speech-driver';
import type * as Contracts from '@unofficial-krds/vue';
import { computed, ref, watch, nextTick, onUnmounted, onMounted, onErrorCaptured } from 'vue';
import { Masthead, Identifier, Header, Footer, SkipLink, MainMenu, Breadcrumb, SideNavigation, InPageNavigation, Pagination, StructuredList, CriticalAlert, Disclosure, Badge, Accordion, Image, Carousel, Table, TextList, Favicon, Link, FAB, RadioGroup, Checkbox, Tag, Switch, StepIndicator, Spinner, HelpPanel, TutorialPanel, ContextualHelp, CoachMark, Tooltip, TTS, Textarea, TextInput, FileUpload, LanguageSwitcher, Resize, AccessibleMedia, VisuallyHidden, RangeSlider, BackButton, BottomSheet, QuantityToggle, Toast, Snackbar, TabBar, Modal, validateQuantityConfiguration, validateBadgeConfiguration } from '@unofficial-krds/vue';
const p = defineProps<{
    componentId: string;
    state: Record<string, any>;
    emit: (name: string, detail: any, next?: Record<string, any>) => void;
    patch: (next: Record<string, any>) => void;
}>();
const s = computed(() => p.state), host = computed(() => s.value.__host ?? {});
const mounted = computed(() => host.value.mounted !== false && (p.componentId === 'favicon' || !s.value.__routeRemoved));
const result = ref(''), query = ref(''), saved = ref<string[]>([]), speech = ref('idle'), summary = ref(''), locale = ref('ko-KR'), confirmation = ref(false), draft = ref(''), submitted = ref<any[]>([]);
const appended = ref(false);
const receipt = ref(''), configurationError = ref('');
const speechDriver = p.componentId === 'tts' ? new LocalSpeechDriver() : undefined;
const speechDriverState = ref<LocalSpeechSnapshot>(speechDriver?.snapshot ?? { active: false, state: 'idle', lifecycle: 'idle', summary: '', locale: '' });
const unsubscribeSpeech = speechDriver?.subscribe(snapshot => {
    speechDriverState.value = snapshot;
    speech.value = snapshot.state;
    summary.value = snapshot.summary;
    p.patch({ state: snapshot.state });
}) ?? (() => {});
watch(mounted, present => { if (!present) speechDriver?.dispose(); }, { flush: 'sync' });
const route = ref(host.value.history?.at(-1) ?? '');
const persistentText = ref(host.value.persistentResult?.text ?? s.value.message?.text ?? '');
watch(() => s.value.message?.text, text => {
    if (text)
        persistentText.value = text;
});
let confirmResolve: ((value: boolean) => void) | undefined;
const children = ref((host.value.children ?? []).map((item: any) => ({ ...item, checked: item.checked ?? item.defaultChecked ?? false })));
const childBaseline = children.value.map((item: any) => ({ ...item, checked: item.checked ?? item.defaultChecked ?? false }));
onErrorCaptured(error => { configurationError.value = error.name + ': ' + error.message; return false; });
const barHeight = ref(0);
let barObserver: ResizeObserver | undefined;
onMounted(async () => {
    await nextTick();
    const bar = document.querySelector<HTMLElement>('[data-krds-component="tab-bar"][data-krds-part="root"]');
    if (bar) {
        const measure = () => barHeight.value = Math.ceil(bar.getBoundingClientRect().height);
        barObserver = new ResizeObserver(measure);
        barObserver.observe(bar);
        measure();
    }
});
onUnmounted(() => barObserver?.disconnect());
const menuOpen = ref(false);
const commonForm = ['radio-group', 'checkbox', 'switch', 'textarea', 'text-input', 'range-slider', 'quantity-toggle', 'file-upload'].includes(p.componentId);
function change(value: any) { p.emit('valueChange', value, { value: value.value }); }
function open(value: any) { p.emit('openChange', value, { open: value.open }); }
function checked(value: {
    checked: boolean;
}) {
    if (children.value.length) {
        const allowed = host.value.acceptChanges !== false;
        if (allowed)
            children.value = children.value.map((item: any) => item.disabled ? item : { ...item, checked: value.checked });
        p.emit('checkedChange', value, allowed ? { checked: eligible().every((x: any) => x.checked), indeterminate: eligible().some((x: any) => x.checked) && !eligible().every((x: any) => x.checked) } : undefined);
    }
    else
        p.emit('checkedChange', value, { checked: value.checked });
}
function eligible() { return children.value.filter((x: any) => !x.disabled); }
function childChanged(id: string, value: boolean) { children.value = children.value.map((item: any) => item.id === id ? { ...item, checked: value } : item); const list = eligible(); p.patch({ checked: list.every((x: any) => x.checked), indeterminate: list.some((x: any) => x.checked) && !list.every((x: any) => x.checked) }); }
const resetTasks = new Set<ReturnType<typeof setTimeout>>();
onUnmounted(() => {
    for (const task of resetTasks)
        clearTimeout(task);
    resetTasks.clear();
});
function reset(e: Event) {
    if (host.value.cancelReset)
        e.preventDefault();
    const task = setTimeout(() => {
        resetTasks.delete(task);
        if (e.defaultPrevented)
            return;
        if (children.value.length) {
            children.value = childBaseline.map((item: any) => ({ ...item, checked: item.checked ?? item.defaultChecked ?? false }));
            const list = eligible();
            p.patch({ checked: list.every((x: any) => x.checked), indeterminate: list.some((x: any) => x.checked) && !list.every((x: any) => x.checked) });
        }
        if (p.componentId === 'file-upload' && host.value.resetClearsFiles)
            p.patch({ files: [] });
    }, 0);
    resetTasks.add(task);
}
function filesChange(detail: any) { p.emit('filesChange', detail, { files: detail.value }); }
async function submit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    submitted.value = await Promise.all(data.getAll(s.value.name).map(async (value) => typeof value === 'string' ? value : { name: value.name, type: value.type, size: value.size, text: await value.text() }));
    receipt.value = JSON.stringify(submitted.value);
    if (p.componentId === 'file-upload') {
        p.patch({ files: s.value.files.map((record: any) => ({ ...record, status: host.value.mockUploadFailure ? 'error' : 'success', progress: 100, ...(host.value.mockUploadFailure ? { error: '예제 업로드 실패' } : {}) })) });
    }
}
function dismiss(detail: any) { p.emit('dismiss', detail, host.value.acceptDismissal === false ? undefined : { message: null }); }
function stop(detail: any) {
    p.emit('stop', detail);
    if (host.value.acceptStop === false || host.value.acceptRunningFalse === false)
        return;
    const next: Record<string, any> = { running: false, open: host.value.acceptOpenTrue === false ? s.value.open : true };
    if (host.value.acceptPanelExposure !== false && host.value.acceptTutorialTab !== false) {
        next.activePanel = 'tutorial';
    }
    p.patch(next);
}
function speechRequest(detail: { action: 'play' | 'pause' | 'resume' | 'stop'; summary: string; locale: string }) {
    p.emit('request', detail);
    if (!speechDriver) return;
    if (detail.action === 'play') speechDriver.play(detail.summary, detail.locale);
    else if (detail.action === 'pause') speechDriver.pause();
    else if (detail.action === 'resume') speechDriver.resume();
    else speechDriver.stop();
}
function localeRequest(detail: any) {
    p.emit('localeRequest', detail);
    if (host.value.samePageLocalization || host.value.applyDocumentLanguage || host.value.driver === 'local-language-mock' || p.componentId === 'language-switcher') {
        document.documentElement.lang = detail.locale;
        locale.value = detail.locale;
        result.value = s.value.options.find((option: any) => option.locale === detail.locale)?.nativeLabel ?? detail.locale;
        p.patch({ currentLocale: detail.locale });
    }
}
const resizeValue = ref(s.value.value ?? s.value.defaultValue ?? '100');
function resized(detail: any) {
    if (s.value.value === undefined)
        resizeValue.value = detail.value;
    change(detail);
}
function back(detail: any) { p.emit('backRequest', detail); route.value = host.value.history?.at(-2) ?? s.value.fallbackHref ?? '/local/parent'; }
function requestConfirmation() {
    confirmation.value = true;
    return new Promise<boolean>(resolve => confirmResolve = resolve);
}
function answer(value: boolean) { confirmation.value = false; confirmResolve?.(value); confirmResolve = undefined; }
onUnmounted(() => { confirmResolve?.(false); confirmResolve = undefined; });
async function browserBack() {
    const allowed = s.value.dirty || draft.value ? await requestConfirmation() : true;
    if (allowed)
        route.value = host.value.history?.at(-2) ?? route.value;
}
function hrefForPage(page: number) { return (s.value.hrefTemplate ?? '/local/list?page={page}').replace('{page}', String(page)); }
function loadMore() {
    if (host.value.loadMoreSucceeds === false)
        return;
    appended.value = true;
    p.emit('loadMore', {});
    if (!s.value.loadMore?.pending)
        p.patch({ loadMore: { ...s.value.loadMore, shown: Math.min(s.value.loadMore.total, s.value.loadMore.shown + (host.value.appendCount ?? 5)), firstNewItemId: 'added-item' } });
}
function onSort(detail: any) { p.emit('sortChange', detail, { sort: detail, rows: [...s.value.rows].sort((a: any, b: any) => String(a.cells[detail.columnId]).localeCompare(String(b.cells[detail.columnId])) * (detail.direction === 'ascending' ? 1 : -1)) }); }
async function targetAction(detail: any) { await nextTick(); return host.value.targetActionVerified === true && result.value === '검증된 대상 작업'; }
const coachOpen = computed(() => s.value.running !== undefined ? Boolean(s.value.running) : Boolean(s.value.open ?? s.value.defaultOpen));
const outlineStyle = computed(() => p.componentId === 'in-page-navigation' ? { float: innerWidth > 767 ? 'right' : undefined, width: '30%' } : {});
const shownItems = computed(() => s.value.items?.filter((item: any) => !query.value || item.title?.includes(query.value)) ?? []);
function persistentFocus() { document.getElementById(host.value.persistentResult.id)?.focus(); }
const resizePercent = computed(() => !mounted.value ? 100 : s.value.levels?.find((level: any) => level.id === (s.value.value ?? resizeValue.value))?.percent ?? Number(s.value.value ?? resizeValue.value));
watch(() => host.value.testConfiguration, configuration => {
    if (!configuration)
        return;
    try {
        if (p.componentId === 'badge')
            validateBadgeConfiguration(configuration);
        else
            validateQuantityConfiguration({ ...s.value, ...configuration });
        configurationError.value = '';
    }
    catch (error) {
        configurationError.value = (error as Error).name + ': ' + (error as Error).message;
    }
}, { deep: true });
onUnmounted(() => { unsubscribeSpeech(); speechDriver?.dispose(); confirmResolve?.(false); });
</script>
<template>
<div style="min-height:100vh;display:flex;flex-direction:column" :dir="s.__environment?.direction??'ltr'" :style="{fontSize:host.textZoomPercent===200?'200%':undefined}">
<template v-if="['masthead','skip-link'].includes(componentId)">
<SkipLink :links="s.links??[{id:'main',label:'본문 바로가기',targetId:'main-content'}]" :visibility="s.visibility"/>
<Masthead v-if="componentId==='masthead'&&mounted" :government-service="Boolean(s.governmentService)"/>
<header>
<p v-if="host.specimenLabel">{{host.specimenLabel}}</p>
<a href="/local/home">독립 예제 서비스</a>
</header>
</template>
<template v-if="componentId==='header'&&mounted">
<SkipLink :links="[{id:'main',label:'본문 바로가기',targetId:'main-content'}]"/>
<Masthead :government-service="Boolean(s.governmentService)"/>
<Header @mobile-open-change="emit('mobileOpenChange',$event,{mobileOpen:$event.open})" v-bind="s as Contracts.HeaderContract" :search="{label:s.search?.label??'검색',onRequest:()=>{result='검색 열림';emit('searchRequest',{})}}"/>
</template>
<CriticalAlert v-if="componentId==='critical-alert'&&mounted" v-bind="s as Contracts.CriticalAlertContract"/>
<main :id="!host.removeTarget&&['masthead','skip-link','header'].includes(componentId)?'main-content':undefined" tabindex="-1" style="padding:1rem">
<h1 v-if="componentId!=='critical-alert'">독립 KRDS Vue 예제</h1>
<h2 v-if="['accordion','structured-list','coach-mark','tutorial-panel','contextual-help'].includes(componentId)">신청 안내</h2>
<template v-if="mounted">
<p v-if="componentId==='identifier'">독립 예제 서비스 정보</p>
<MainMenu v-else-if="componentId==='main-menu'" v-bind="s as Contracts.MainMenuContract" @expanded-change="emit('expandedChange',$event,{expandedId:$event.id})" @mobile-open-change="emit('mobileOpenChange',$event,{mobileOpen:$event.open})" @query-change="emit('queryChange',$event,{query:$event.value})"/>
<Breadcrumb v-else-if="componentId==='breadcrumb'" v-bind="s as Contracts.BreadcrumbContract"/>
<SideNavigation v-else-if="componentId==='side-navigation'" v-bind="s as Contracts.SideNavigationContract" @expanded-change="emit('expandedChange',$event,{expandedIds:$event.ids})"/>
<template v-else-if="componentId==='in-page-navigation'">
<InPageNavigation v-bind="s as Contracts.InPageNavigationContract" :sections="s.sections.filter((x:any)=>x.id!==host.removeSectionId)" :style="outlineStyle" @active-change="emit('activeChange',$event,{activeId:$event.id})"/>
<section v-for="section in s.sections.filter((x:any)=>x.id!==host.removeSectionId)" :key="section.id" style="min-height:55vh">
<div :id="section.id" tabindex="-1">
<h2>{{section.label}}</h2>
<button type="button">{{section.label}} 조회</button>
</div>
<p>이 절의 본문과 예제입니다.</p>
<button type="button">{{section.label}} 작업</button>
</section>
</template>
<Pagination v-else-if="componentId==='pagination'" v-bind="s as Contracts.PaginationContract" :href-for-page="hrefForPage" :load-more="s.loadMore?{...s.loadMore,onLoadMore:loadMore}:undefined" @page-change="emit('pageChange',$event,{page:$event.page})"/>
<template v-else-if="componentId==='structured-list'">
<StructuredList v-bind="s as Contracts.StructuredListContract" :items="shownItems" :sort="s.sort?{...s.sort,onChange:(detail:any)=>emit('sortChange',detail,{sort:{...s.sort,...detail},items:[...s.items].reverse()})}:undefined" :selection="s.selection?{...s.selection,onChange:(e:any)=>emit('selectionChange',e,{selection:{ids:e.ids}})}:undefined">
<template #toolbar>
<label style="min-inline-size:0;max-inline-size:100%">공고 검색<input v-model="query" style="inline-size:100%;min-inline-size:0;max-inline-size:100%;box-sizing:border-box"/>
</label>
<button type="button" @click="query=query?'':'다음'">필터 적용</button>
</template>
<template #actions="{item}">
<button type="button" @click="result=`${item.title} 공유`">공유</button>
<button type="button" @click="saved.includes(item.id)?saved=saved.filter(x=>x!==item.id):saved.push(item.id)">{{saved.includes(item.id)?'저장 취소':'저장'}}</button>
</template>
</StructuredList>
</template>

<Disclosure v-else-if="componentId==='disclosure'" v-bind="s as Contracts.DisclosureContract" @open-change="open">
<p>{{s.content}}</p>
<a v-if="host.contentLink" :href="host.contentLink.href">{{host.contentLink.label}}</a>
</Disclosure>
<template v-else-if="componentId==='badge'"><Badge v-bind="s as Contracts.BadgeContract"/><Badge v-for="(sample,index) in host.samples??[]" :key="index" v-bind="{...s,...sample} as Contracts.BadgeContract"/></template>
<Accordion v-else-if="componentId==='accordion'" v-bind="s as Contracts.AccordionContract" @open-change="emit('openChange',$event,{openIds:$event.ids})">
<template v-for="item in s.items" #[item.id]>
<p>{{item.content}}</p>
<input v-if="host.interactivePanel" :aria-label="`${item.title} 입력`"/>
<a v-if="host.interactivePanel" href="/local/help">상세 도움말</a>
</template>
</Accordion>
<template v-else-if="componentId==='image'">
<a v-if="host.imageLink" :href="host.imageLink.href" :aria-label="host.imageLink.label">
<Image v-bind="s as Contracts.ImageContract"/>
</a>
<Image v-else v-bind="s as Contracts.ImageContract"/>
</template>
<Carousel v-else-if="componentId==='carousel'" v-bind="s as Contracts.CarouselContract" @index-change="emit('indexChange',$event,{index:$event.index})" @playing-change="emit('playingChange',$event,{playing:$event.playing})">
<template v-for="item in s.items" #[item.id]>
<p>{{item.content}}</p>
<a :href="`/local/slide/${item.id}`">{{item.label}} 상세</a>
</template>
</Carousel>
<Table v-else-if="componentId==='table'" v-bind="s as Contracts.TableContract" @sort-change="onSort">
<template v-for="column in s.columns" #[column.id]="{row}">
<span :style="{whiteSpace:host.layout==='narrow-scroll'?'nowrap':undefined}">{{row.cells[column.id]??'—'}}</span>
</template>
</Table>
<TextList v-else-if="componentId==='text-list'" v-bind="s as Contracts.TextListContract"/>
<template v-else-if="componentId==='favicon'"><h2>로컬 파비콘 미리보기</h2><p>독립 예제 아이콘이 문서 탭에 표시됩니다.</p><Favicon v-bind="s as Contracts.FaviconContract"/></template>
<Link v-else-if="componentId==='link'" v-bind="s as Contracts.LinkContract"/>
<FAB :style="{bottom:`${barHeight+16}px`}" v-else-if="componentId==='fab'" v-bind="s as Contracts.FABContract" :actions="s.actions?.map((a:any)=>({...a,onAction:()=>{result=a.label;emit('action',{id:a.id})}}))" @action="emit('action',{});result='주요 작업 완료'" @expanded-change="emit('expandedChange',$event,{expanded:$event.expanded})"/>
<form v-else-if="commonForm" @submit="submit" @reset="reset">
<RadioGroup v-if="componentId==='radio-group'" v-bind="s as Contracts.RadioGroupContract" @value-change="change"/>
<template v-else-if="componentId==='checkbox'">
<Checkbox v-bind="s as Contracts.CheckboxContract" @checked-change="checked"/>
<label v-for="child in children" :key="child.id">
<input :id="child.id" type="checkbox" :checked="child.checked" :disabled="child.disabled" @change="childChanged(child.id,($event.target as HTMLInputElement).checked)"/>{{child.label??`선택 ${child.id}`}}</label>
</template>
<Switch :help-id="s.helpId??(host.helpText?'switch-help':undefined)" v-else-if="componentId==='switch'" v-bind="s as Contracts.SwitchContract" @checked-change="checked"/>
<Textarea v-else-if="componentId==='textarea'" v-bind="s as Contracts.TextareaContract" @value-change="change"/>
<TextInput v-else-if="componentId==='text-input'" v-bind="s as Contracts.TextInputContract" :icon-action="s.iconAction?{...s.iconAction,onAction:()=>emit('iconAction',{})}:undefined" @value-change="change"/>
<FileUpload v-else-if="componentId==='file-upload'" v-bind="s as Contracts.FileUploadContract" @files-change="filesChange" @files-rejected="emit('filesRejected',$event)"/>
<RangeSlider v-else-if="componentId==='range-slider'" v-bind="s as Contracts.RangeSliderContract" @value-change="change"/>
<QuantityToggle v-else-if="componentId==='quantity-toggle'" v-bind="s as Contracts.QuantityToggleContract" @value-change="change"/>
<p v-if="s.helpId||host.helpText" :id="s.helpId??'switch-help'">{{host.helpText??'도움말'}}</p>
<p v-if="s.errorId" :id="s.errorId">{{host.errorText??'입력을 확인하세요.'}}</p>
<button type="reset">초기화</button>
<button type="submit">{{componentId==='file-upload'?'제출':'제출'}}</button>
</form>
<template v-else-if="componentId==='tag'">
<Tag :applied-bar-id="host.appliedBarId" v-bind="s as Contracts.TagContract" @selection-change="emit('selectionChange',$event,{selectedIds:$event.ids})" @remove="emit('remove',$event,{items:s.items.filter((x:any)=>x.id!==$event.id)})" @add="emit('add',$event);result=s.items.find((item:any)=>item.id===$event.id)?.label??$event.id" @clear="emit('clear',{} ,{items:[]})"/>
<div :id="s.appliedBarId??host.appliedBarId" tabindex="-1">적용된 필터 {{result}}</div>
<p data-krds-host="filtered-results">{{s.items.filter((x:any)=>s.selectedIds?.includes(x.id)).map((x:any)=>x.label).join(', ')}}</p>
</template>
<template v-else-if="componentId==='step-indicator'">
<StepIndicator v-bind="s as Contracts.StepIndicatorContract" @step-request="emit('stepRequest',$event)"/>
<button v-if="host.skipAction" type="button" data-krds-host="skip-action" @click="emit('stepRequest',{id:s.steps.at(-1).id});route=host.skipDestination">{{host.skipAction}}</button>
</template>
<Spinner v-else-if="componentId==='spinner'" v-bind="s as Contracts.SpinnerContract"/>
<HelpPanel :opener-id="host.panelOpenerId" :hide-opener="host.removePanelOpener" :hide-topic-triggers="host.removeTopicTrigger" v-else-if="componentId==='help-panel'" v-bind="s as Contracts.HelpPanelContract" @open-change="open" @topic-change="emit('topicChange',$event,{selectedTopicId:$event.id})"/>
<TutorialExample v-else-if="componentId==='tutorial-panel'" component-id="tutorial-panel" :state="s" :emit="emit" :patch="patch"/>
<ContextualHelp v-else-if="componentId==='contextual-help'&&!host.removeTrigger" v-bind="s as Contracts.ContextualHelpContract" @open-change="open">
<p>{{s.content}}</p>
<a v-if="host.contentLink||host.relatedLink||host.link" :href="(host.contentLink??host.relatedLink??host.link).href">{{(host.contentLink??host.relatedLink??host.link).label}}</a>
</ContextualHelp>
<TutorialExample v-else-if="componentId==='coach-mark'" component-id="coach-mark" :state="s" :emit="emit" :patch="patch"/>
<Tooltip v-else-if="componentId==='tooltip'&&!host.removeTrigger" v-bind="s as Contracts.TooltipContract" @open-change="open"/>
<TTS v-else-if="componentId==='tts'" v-bind="s as Contracts.TTSContract" @request="speechRequest"/>
<LanguageSwitcher v-else-if="componentId==='language-switcher'" v-bind="s as Contracts.LanguageSwitcherContract" @open-change="open" @locale-request="localeRequest"/>
<template v-else-if="componentId==='resize'">
<Resize v-bind="s as Contracts.ResizeContract" @value-change="resized" @open-change="open"/>

</template>
<template v-else-if="componentId==='accessible-media'">
<AccessibleMedia v-bind="s as Contracts.AccessibleMediaContract" :sign-language-source="undefined"/>
<p v-if="s.signLanguageSource" data-krds-host="media-content-blocked">수어 영상은 권리와 내용 검토가 끝나지 않아 이 독립 예제에서 제공하지 않습니다.</p>
</template>
<VisuallyHidden v-else-if="componentId==='visually-hidden'" v-bind="s as Contracts.VisuallyHiddenContract">
<template v-if="s.variant==='interactive-overlay'" #surrogate>예제 옵션</template>
<input v-if="s.variant==='interactive-overlay'" type="checkbox" aria-label="예제 옵션"/>
</VisuallyHidden>
<BackButton v-else-if="componentId==='back-button'" v-bind="s as Contracts.BackButtonContract" :dirty="s.dirty||Boolean(draft)" :request-confirmation="requestConfirmation" @back-request="back"/>
<template v-else-if="componentId==='bottom-sheet'">
<button :id="host.openerId" type="button" @click="open({open:true})">바텀시트 열기</button>
<BottomSheet :return-focus-id="host.openerId" v-bind="s as Contracts.BottomSheetContract" @open-change="open" @cancel="emit('cancel',{});draft=''">
<label>
<input v-model="draft" type="radio" name="sheet-region" value="seoul"/>서울</label>
<label>
<input v-model="draft" type="radio" name="sheet-region" value="busan"/>부산</label>
<button type="button" @click="result=draft;open({open:false})">적용</button>
</BottomSheet>
</template>
<template v-else-if="componentId==='toast'">
<button v-if="host.actionMessage" type="button" @click="persistentText=host.actionMessage.text;patch({message:host.actionMessage})">신청 저장</button>
<button v-if="host.persistentResult" type="button" @click="persistentFocus">{{host.persistentResult.discoverableLabel??'처리 결과 보기'}}</button>
<p v-if="host.persistentResult" :id="host.persistentResult.id" tabindex="-1">{{persistentText}}</p>
<Toast :style="{bottom:`${barHeight+16}px`}" v-bind="s as Contracts.ToastContract" @dismiss="dismiss"/>
</template>
<Snackbar :style="{bottom:`${barHeight+16}px`}" :fallback-focus-id="host.fallbackFocusId" v-else-if="componentId==='snackbar'" v-bind="s as Contracts.SnackbarContract" @dismiss="dismiss" @action="emit('action',$event);result='취소 완료'"/>
<TabBar v-else-if="componentId==='tab-bar'" v-bind="s as Contracts.TabBarContract" :menu-action="s.menuAction?{...s.menuAction,onRequest:()=>{menuOpen=true;emit('menuRequest',{})}}:undefined"/>
</template>
<input v-if="componentId==='back-button'" data-krds-host="dirty-input" aria-label="저장되지 않은 내용" v-model="draft"/>
<button v-if="componentId==='back-button'" type="button" @click="browserBack">브라우저 뒤로가기 모의</button>
<template v-if="componentId==='resize'">
<article data-krds-host="resize-content" :style="{fontSize:`${resizePercent}%`}">
<h2>확대되는 예제 본문</h2>
<p>화면 크기 설정에 따라 본문이 줄바꿈됩니다.</p>
</article>
</template>
<button data-krds-host="last-content-action" v-if="componentId==='tab-bar'" type="button" style="margin-top:1600px">마지막 본문 작업</button>
<button :id="s.fallbackFocusId??host.fallbackFocusId??'outside-action'" type="button" data-krds-host="outside-action" @click="result='외부 작업'">{{host.fallbackLabel??'다음 작업'}}</button>
<span v-if="s.loadMore" data-krds-host="shown-count">{{s.loadMore.shown}}</span>
<p v-if="componentId==='bottom-sheet'" data-krds-host="committed-selection">{{host.selection}}</p>
<p data-krds-host="result">{{result}}</p>
<p data-krds-host="route">{{route}}</p>
<p data-krds-host="configuration-error">{{configurationError}}</p>
<pre data-krds-host="upload-receipt">{{receipt}}</pre>
<p data-krds-host="speech-state">{{speech}}</p>
<p v-if="componentId==='tts'" data-krds-host="speech-driver-active">{{String(speechDriverState.active)}}</p>
<p v-if="componentId==='tts'" data-krds-host="speech-driver-lifecycle">{{speechDriverState.lifecycle}}</p>
<p data-krds-host="speech-summary">{{summary}}</p>
<p data-krds-host="locale-content">{{result|| (locale.startsWith('ko')?'한국어 본문':'English local content')}}</p>
<button v-if="componentId==='visually-hidden'&&host.visibleControlLabel" type="button" :aria-describedby="s.id">{{host.visibleControlLabel}}</button>
<div v-if="s.descriptionId" :id="s.descriptionId">{{host.descriptionText??host.description??'복잡한 이미지의 상세 설명'}}</div>
<section data-krds-host="first-added-result" v-if="appended&&s.loadMore?.firstNewItemId" :id="s.loadMore.firstNewItemId" tabindex="-1">새로운 항목</section>
<Modal :open="menuOpen" title="전체 메뉴" @open-change="menuOpen=$event.open">
<MainMenu :items="[{id:'home',label:'홈',href:'/local/home'},{id:'apply',label:'신청',href:'/local/apply'}]"/>
</Modal>
<Modal :open="confirmation" :title="host.confirmationDialog?.title??'작성 중인 내용이 있습니다'" :description="host.confirmationDialog?.description??'이전 화면으로 이동하면 입력 내용이 사라질 수 있습니다.'" @open-change="answer(false)">
<p>입력한 내용을 저장하지 않고 이동합니다.</p>
<button type="button" @click="answer(false)">{{host.confirmationDialog?.cancelLabel??'취소'}}</button>
<button type="button" @click="answer(true)">{{host.confirmationDialog?.confirmLabel??'확인'}}</button>
</Modal>
</main>
<footer v-if="componentId==='identifier'&&mounted" data-krds-component="footer" data-krds-part="root" data-krds-state="">
<img data-krds-component="footer" data-krds-part="logo" data-krds-state="" src="/local-assets/service-logo.svg" alt="독립 예제 서비스"/>
<Identifier v-bind="s as Contracts.IdentifierContract"/>
</footer>
<Footer v-if="componentId==='footer'&&mounted" v-bind="s as Contracts.FooterContract"/>
<TabBar v-if="host.tabBar||host.tabBarPresent||host.tabBarClearance||['fab','toast','snackbar'].includes(componentId)" :items="host.tabBar?.items??[{id:'home',label:'홈',href:'/local/home',icon:'home'}]" :current-id="host.tabBar?.currentId??'home'"/>
</div>
</template>

<style scoped>
main{min-width:0;padding-bottom:8rem!important;}
main input:not([data-krds-component]){max-inline-size:100%;min-inline-size:0;box-sizing:border-box;}
footer{margin-top:auto;}
[data-krds-component="image"]{max-width:100%;height:auto;}
</style>
