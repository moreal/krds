import { $, component$, noSerialize, Slot, useSignal, type Component } from '@builder.io/qwik';
import {
  AccessibleMedia, Accordion, BackButton, Badge, BottomSheet, Breadcrumb, Button, Calendar, Carousel, Checkbox, CoachMark, CoachMarkOutlet,
  ContextualHelp, CriticalAlert, DateInput, Disclosure, FAB, Favicon, FileUpload, Footer, Header, HelpPanel, Identifier, Image,
  InPageNavigation, LanguageSwitcher, Link, MainMenu, Masthead, Modal, NativeSelect, Pagination, QuantityToggle, RadioGroup, RangeSlider,
  Resize, SideNavigation, SkipLink, Snackbar, Spinner, StepIndicator, StructuredList, Switch, TabBar, Table, Tabs, Tag, TextInput, TextList,
  Textarea, Toast, Tooltip, TTS, TutorialPanel, VisuallyHidden,
  type FileUploadProps, type SnackbarProps, type ToastProps, type TTSProps,
} from '@unofficial-krds/qwik';
import specimenLogo from '../../public/local-assets/specimen-logo.svg?url';
import specimenIconLight from '../../public/local-assets/specimen-icon-light.svg?url';
import specimenIconDark from '../../public/local-assets/specimen-icon-dark.svg?url';
import exampleLandscape from '../../public/local-assets/example-landscape.svg?url';
import specimenAudio from '../../public/local-assets/specimen-audio.wav?url';

/** Local destinations stay inside this frame: a fragment link reveals deterministic route content without leaving the static document. */
export const route = (path: string) => `#route-${path.replace(/[^a-z0-9]+/g, '-')}`;
export const LocalDestinations = component$<{ paths: readonly string[] }>(({ paths }) => <div class="preview-routes">{paths.map(path => <section key={path} id={route(path).slice(1)} class="preview-route" tabIndex={-1}><h2>로컬 예제 목적지</h2><p><code>/local/{path}</code></p></section>)}</div>);

/**
 * Native form host. The docs iframe sandbox blocks form submission, so a click QRL reads FormData directly and
 * reset calls the allowed form.reset(); every native field returns to its default.
 */
export const FormExample = component$(() => {
  const result = useSignal('');
  return <form preventdefault:submit onReset$={() => { result.value = ''; }}>
    <Slot/>
    <div class="preview-actions">
      <Button type="button" variant="secondary" size="small" onClick$={(_, button) => { const form = button.closest('form'); if (form) result.value = JSON.stringify(Object.fromEntries(new FormData(form))); }}>입력 확인</Button>
    </div>
    <output aria-label="입력 결과">{result.value}</output>
    <div class="preview-actions">
      <Button type="button" variant="tertiary" size="small" onClick$={(_, button) => { button.closest('form')?.reset(); }}>입력 초기화</Button>
    </div>
  </form>;
});

export const ButtonExample = component$(() => {
  const count = useSignal(0);
  return <><Button type="button" onClick$={() => { count.value++; }}>신청하기</Button><p role="status" class="preview-status">신청 버튼을 {count.value}회 눌렀습니다.</p></>;
});

export const TextInputExample = component$(() => <FormExample>
  <TextInput label="신청인 이름" name="applicant" defaultValue="" type="text" size="medium" status="error" autocomplete="name" errorId="name-error"/>
  <p id="name-error" class="preview-error">신청인 이름을 입력하세요</p>
</FormExample>);

export const TextareaExample = component$(() => <FormExample>
  <Textarea label="신청 사유" name="reason" defaultValue="" rows={5} helpId="reason-help"/>
  <p id="reason-help">예제 신청 사유를 입력하세요</p>
</FormExample>);

export const NativeSelectExample = component$(() => <FormExample>
  <NativeSelect label="지역" name="region" defaultValue="seoul" options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]}/>
</FormExample>);

export const CheckboxExample = component$(() => <FormExample><Checkbox label="이용약관 동의" name="consent" defaultChecked={false} indeterminate={false} value="agreed"/></FormExample>);

export const RadioGroupExample = component$(() => <FormExample>
  <RadioGroup label="거주 지역" name="region" defaultValue={null} size="medium" appearance="default" options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'jeju', label: '제주', disabled: true }]}/>
</FormExample>);

export const SwitchExample = component$(() => <FormExample><Switch label="예제 알림 받기" name="notification" defaultChecked={false} size="medium" helpId="notification-help"/><p id="notification-help">알림은 예제 화면에서만 변경됩니다.</p></FormExample>);

export const RangeSliderExample = component$(() => <FormExample><RangeSlider label="예제 비율" name="ratio" min={0} max={100} step={10} defaultValue={50}/></FormExample>);

export const QuantityToggleExample = component$(() => <FormExample><QuantityToggle label="신청 수량" name="quantity" min={0} max={10} step={1} defaultValue={2} unit="개"/></FormExample>);

export const DateInputExample = component$(() => {
  const value = useSignal<string>('');
  return <><DateInput label="방문일" name="visit" referenceDate="2024-02-15" today="2024-02-15" onValueChange$={detail => { value.value = typeof detail.value === 'string' ? detail.value : ''; }}/><p role="status" class="preview-status">입력한 방문일: {value.value || '없음'}</p></>;
});

export const CalendarExample = component$(() => {
  const value = useSignal('');
  return <><Calendar label="방문일 선택" referenceDate="2024-02-15" today="2024-02-15" onValueChange$={detail => { value.value = typeof detail.value === 'string' ? detail.value : ''; }}/><p role="status" class="preview-status">선택한 날짜: {value.value || '없음'}</p></>;
});

export const ModalExample = component$(() => {
  const open = useSignal(false);
  return <>
    <Button id="preview-modal-opener" type="button" onClick$={() => { open.value = true; }}>열기</Button>
    <Modal id="preview-modal" title="신청 확인" open={open.value} returnFocusId="preview-modal-opener" onOpenChange$={detail => { open.value = detail.open; }}>
      <p>변경 내용을 확인하세요.</p>
      <Button type="button" variant="secondary" onClick$={() => { open.value = false; }}>확인</Button>
    </Modal>
    <p role="status" class="preview-status">대화상자: {open.value ? '열림' : '닫힘'}</p>
  </>;
});

export const TabsExample = component$(() => <Tabs label="안내" defaultValue="overview" items={[{ value: 'overview', label: '개요', content: <p>개요 내용</p> }, { value: 'details', label: '상세', content: <p>상세 내용</p> }]}/>);

export const FileUploadExample = component$(() => {
  const files = useSignal<FileUploadProps['files']>([]);
  const receipt = useSignal('');
  // Submission is blocked in the docs sandbox: the click QRL builds the FormData a submit would send.
  const collect = $((form: HTMLFormElement) => { const data = new FormData(form); data.delete('documents'); for (const record of files.value) data.append('documents', record.file); receipt.value = data.getAll('documents').map(value => typeof value === 'string' ? value : value.name).join(', ') || '첨부 없음'; });
  return <form preventdefault:submit>
    <FileUpload label="첨부 서류" name="documents" files={files.value} accept=".txt,.pdf" maxFiles={3} maxBytes={1048576} onFilesChange$={detail => { files.value = detail.value.map(record => ({ ...record, file: noSerialize(record.file)! })); }}/>
    <p role="status" class="preview-status">선택한 파일: {files.value.map(record => record.file?.name).join(', ') || '없음'}</p>
    <Button type="button" variant="secondary" size="small" onClick$={(_, button) => { const form = button.closest('form'); if (form) return collect(form); }}>제출</Button>
    <output aria-label="제출 결과">{receipt.value}</output>
  </form>;
});

export const MastheadExample = component$(() => <>
  <SkipLink links={[{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }]}/>
  <p role="note">공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.</p>
  <Masthead governmentService={true}/>
  <section id="main-content" tabIndex={-1}><h2>독립 로컬 예제</h2></section>
</>);

const identifier = { institutionName: '독립 예제 운영기관', logo: { src: specimenLogo, alt: '독립 예제 운영기관' }, relationshipText: '독립 예제 운영기관이 운영하는 예제 서비스입니다.', theme: 'light' as const };

export const IdentifierExample = component$(() => <footer aria-label="예제 기관 정보"><p>로컬 예제 서비스 문의 안내</p><Identifier {...identifier}/></footer>);

export const HeaderExample = component$(() => <>
  <SkipLink links={[{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }]}/>
  <Header actionLayout="horizontal" sticky={false} home={{ href: route('home'), label: '예제 서비스 홈', logo: { src: specimenLogo, alt: '예제 서비스 홈' } }} utilityItems={[{ id: 'policy', label: '이용약관', href: route('policy') }]} mainNavigation={[{ id: 'home', label: '홈', href: route('home') }, { id: 'apply', label: '신청', children: [{ id: 'apply-new', label: '신규 신청', href: route('apply') }, { id: 'history', label: '신청 내역', href: route('history') }] }, { id: 'support', label: '지원', href: route('support') }]}/>
  <section id="main-content" tabIndex={-1} class="preview-long"><h1>예제 신청 서비스</h1><p>지역별 신청 정보를 확인하세요.</p></section>
  <LocalDestinations paths={['home', 'policy', 'apply', 'history', 'support']}/>
</>);

/** Footer renders each LinkData.id as a DOM id, so the utility and policy copies of 이용약관 need distinct ids. */
export const FooterExample = component$(() => <>
  <Footer serviceLogo={{ src: specimenLogo, alt: '예제 서비스' }} contacts={[{ label: '예제 문의', text: '로컬 예제 연락처' }]} utilityLinks={[{ id: 'utility-policy', label: '이용약관', href: route('policy') }]} privacyPolicy={{ href: route('privacy'), label: '개인정보처리방침' }} policyLinks={[{ id: 'policy', label: '이용약관', href: route('policy') }]} copyrightText="Independent local specimen" institution={{ ...identifier, relationshipText: '독립 운영기관이 운영하는 예제 서비스입니다.' }}/>
  <LocalDestinations paths={['policy', 'privacy']}/>
</>);

export const SkipLinkExample = component$(() => <>
  <SkipLink links={[{ id: 'main', label: '본문 바로가기', targetId: 'main-content' }]} visibility="focus-revealed"/>
  <header class="preview-banner"><p>예제 서비스 배너</p></header>
  <section id="main-content" tabIndex={-1}><h2>신청 본문</h2><Button type="button" variant="secondary" size="small">신청서 작성</Button></section>
</>);

export const MainMenuExample = component$(() => <>
  <MainMenu items={[{ id: 'home', label: '홈', href: route('home') }, { id: 'support', label: '지원', href: route('support') }]} currentId="apply-new" defaultExpandedId={null} defaultMobileOpen={false}/>
  <LocalDestinations paths={['home', 'support']}/>
</>);

export const BreadcrumbExample = component$(() => <>
  <Breadcrumb home={{ href: route('home'), label: '홈' }} items={[{ id: 'apply', label: '신청', href: route('apply') }]} omitCurrent={true} maxVisible={4} currentItem={{ id: 'detail', label: '신청 상세' }}/>
  <LocalDestinations paths={['home', 'apply']}/>
</>);

export const SideNavigationExample = component$(() => {
  const visited = useSignal('없음');
  return <>
    <div onClick$={event => { const link = (event.target as Element).closest('a'); if (link) visited.value = link.textContent?.trim() ?? ''; }}>
      <SideNavigation items={[{ id: 'home', label: '홈', href: route('home') }, { id: 'apply', label: '신청', children: [{ id: 'apply-new', label: '신규 신청', href: route('apply') }, { id: 'history', label: '신청 내역', href: route('history') }] }, { id: 'support', label: '지원', href: route('support') }]} currentId="apply-new" defaultExpandedIds={['apply']}/>
    </div>
    <p role="status" class="preview-status">이동한 메뉴: {visited.value}</p>
    <LocalDestinations paths={['home', 'apply', 'history', 'support']}/>
  </>;
});

export const InPageNavigationExample = component$(() => {
  const active = useSignal('overview');
  return <div class="preview-outline">
    <InPageNavigation sections={[{ id: 'overview', label: '신청 개요' }, { id: 'requirements', label: '신청 조건' }]} title="이 페이지의 구성" activeId={active.value} narrowMode="inline" onActiveChange$={detail => { active.value = detail.id; }}/>
    <article>
      <section id="overview" class="preview-section" tabIndex={-1}><h2>신청 개요</h2><p>예제 신청 서비스의 개요입니다.</p></section>
      <section id="requirements" class="preview-section" tabIndex={-1}><h2>신청 조건</h2><p>거주 지역과 제출 서류를 확인하세요.</p></section>
    </article>
  </div>;
});

export const PaginationExample = component$(() => {
  const page = useSignal(1);
  return <><Pagination page={page.value} pageCount={12} variant="number-links" hrefTemplate={route('results') + '-page-{page}'} hrefForPage$={$((next: number) => `${route('results')}-page-${next}`)} onPageChange$={detail => { page.value = detail.page; }}/><p role="status" class="preview-status">현재 페이지: {page.value}</p></>;
});

export const StructuredListExample = component$(() => {
  const result = useSignal('없음');
  // Share/save are local item actions placed after each item's readable content.
  const actions = (title: string) => <><Button type="button" variant="text" size="small" onClick$={() => { result.value = `${title} 공유 링크를 준비했습니다.`; }}>{`${title} 공유`}</Button><Button type="button" variant="text" size="small" onClick$={() => { result.value = `${title}을(를) 저장했습니다.`; }}>{`${title} 저장`}</Button></>;
  return <>
    <StructuredList variant="list" items={[{ id: 'a', title: '예제 신청 공고', href: route('notice/a'), metadata: [{ label: '마감일', value: '2026-11-30' }, { label: '담당 부서', value: '예제 부서' }] }, { id: 'b', title: '다음 신청 공고', href: route('notice/b'), metadata: [{ label: '마감일', value: '2026-12-31' }] }]} itemActionsById={{ a: actions('예제 신청 공고'), b: actions('다음 신청 공고') }}/>
    <p role="status" class="preview-status">항목 작업: {result.value}</p>
    <LocalDestinations paths={['notice/a', 'notice/b']}/>
  </>;
});

export const CriticalAlertExample = component$(() => <>
  <CriticalAlert urgency="high" label="긴급 안내" message="예제 점검으로 신청이 잠시 중단됩니다." details={{ href: route('maintenance'), label: '점검 상세 안내', destinationTitle: '점검 상세 안내' }}/>
  <LocalDestinations paths={['maintenance']}/>
</>);

export const DisclosureExample = component$(() => <Disclosure label="신청 도움말" contentId="application-help" defaultOpen={false}><p>신청서를 작성하는 방법입니다.</p></Disclosure>);

export const BadgeExample = component$(() => <p>처리 상태: <Badge label="진행 중" appearance="outline" tone="information" size="medium" numeric={false}/></p>);

export const AccordionExample = component$(() => <Accordion items={[{ id: 'eligibility', title: '신청 자격', content: '예제 신청 자격 안내' }, { id: 'documents', title: '제출 서류', content: '예제 제출 서류 안내' }]} defaultOpenIds={[]} multiple={true} variant="default"/>);

/** Acceptance: the local src is intentionally absent (never emitted), so the informative alternative must survive a real 404. */
export const missingImageSrc = '/krds/previews/qwik/local-assets/intentional-missing-image.svg';
export const ImageExample = component$(() => <>
  <Image src={exampleLandscape} alt="산과 강이 있는 독립 예제 그림" width={640} height={360} loading="eager"/>
  <Image src={missingImageSrc} alt="불러올 수 없는 예제 그림" width={640} height={360} loading="eager"/>
</>);

export const CarouselExample = component$(() => {
  const requests = useSignal(0);
  return <><Carousel items={[{ id: 'a', label: '신청 안내', content: '첫 번째 신청 안내' }, { id: 'b', label: '서류 안내', content: '두 번째 서류 안내' }, { id: 'c', label: '문의 안내', content: '세 번째 문의 안내' }]} defaultIndex={0} layout="single" autoplay={true} intervalMs={6000} loop={false} onPlayingChange$={() => { requests.value++; }}/><p role="status" class="preview-status">자동 재생 요청 {requests.value}회</p></>;
});

export const TableExample = component$(() => <Table caption="예제 신청 내역" rowHeaderColumnId="name" columns={[{ id: 'name', label: '신청명', kind: 'text' }, { id: 'count', label: '수량', kind: 'number' }]} rows={[{ id: 'a', cells: { name: '신청 가', count: 2 } }, { id: 'b', cells: { name: '신청 나', count: 1 } }]}/>);

export const TextListExample = component$(() => <TextList ordered={true} marker="dot" items={[{ id: 'one', content: '신청 조건 확인' }, { id: 'two', content: '제출 서류 준비' }]}/>);

export const FaviconExample = component$(() => <>
  <Favicon light={{ href: specimenIconLight, type: 'image/svg+xml', sizes: 'any' }} dark={{ href: specimenIconDark, type: 'image/svg+xml', sizes: 'any' }}/>
  <p>이 예제 문서의 탭 아이콘을 로컬 이미지로 설정했습니다.</p>
  <img src={specimenIconLight} width={48} height={48} alt="로컬 예제 탭 아이콘 미리보기"/>
</>);

export const LinkExample = component$(() => <><Link href={route('application')} label="신청 안내" appearance="basic" size="medium" underline={true}/><LocalDestinations paths={['application']}/></>);

export const FABExample = component$(() => {
  const count = useSignal(0);
  return <><FAB label="새 신청" icon="plus" defaultExpanded={false} onAction$={() => { count.value++; }}/><p role="status" class="preview-status">새 신청 {count.value}건</p></>;
});

export const TagExample = component$(() => {
  const ids = useSignal<readonly string[]>([]);
  return <><Tag mode="toggle" items={[{ id: 'a', label: '서울', href: route('seoul') }, { id: 'b', label: '부산', href: route('busan') }]} selectedIds={ids.value} onSelectionChange$={detail => { ids.value = detail.ids; }}/><p role="status" class="preview-status">선택 지역: {ids.value.map(id => id === 'a' ? '서울' : '부산').join(', ') || '없음'}</p></>;
});

export const StepIndicatorExample = component$(() => <StepIndicator mode="sequential" steps={[{ id: 'a', label: '약관 확인', status: 'complete' }, { id: 'b', label: '정보 입력', status: 'current' }, { id: 'c', label: '신청 완료', status: 'pending' }]}/>);

export const SpinnerExample = component$(() => {
  const done = useSignal(false);
  return <section id="results"><Spinner pending={!done.value} label="신청 내역 불러오는 중" completionMessage="신청 내역을 불러왔습니다." size="medium" value={done.value ? 100 : 40}/><Button type="button" variant="secondary" size="small" disabled={done.value} onClick$={() => { done.value = true; }}>작업 완료</Button></section>;
});

export const HelpPanelExample = component$(() => <>
  <HelpPanel defaultOpen={true} defaultSelectedTopicId={null} mode="help" fallbackFocusId="panel-fallback" openerId="help-panel-opener" topics={[{ id: 'eligibility', title: '신청 자격', content: '예제 신청 자격 도움말', relatedLinks: [{ id: 'policy', label: '이용약관', href: route('policy') }] }, { id: 'documents', title: '제출 서류', content: '예제 제출 서류 도움말', relatedLinks: [] }]}/>
  <Button id="panel-fallback" type="button" variant="text" size="small">도움말 다음 작업</Button>
  <LocalDestinations paths={['policy']}/>
</>);

export const TutorialPanelExample = component$(() => {
  const running = useSignal(false);
  const task = useSignal<string | null>('apply');
  const step = useSignal<string | null>(null);
  return <>
    <label for="applicant-name">신청인 이름</label><input id="applicant-name" data-active-target={step.value === 'one' ? 'true' : undefined}/><div id="applicant-name-after"/>
    <Button id="save-application" type="button" variant="secondary" size="small" data-active-target={step.value === 'two' ? 'true' : undefined}>신청 저장</Button><div id="save-application-after"/>
    <p role="status" class="preview-status">현재 대상: {step.value === 'one' ? '신청인 이름' : step.value === 'two' ? '신청 저장' : '없음'}</p>
    <TutorialPanel defaultOpen={true} defaultActivePanel="tutorial" startActionId="tutorial-start" fallbackFocusId="tutorial-fallback" activeTaskId={task.value} activeStepId={step.value} running={running.value}
      tasks={[{ id: 'apply', title: '예제 신청하기', steps: [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '신청인 이름을 입력하세요' }, { id: 'two', title: '신청 저장', targetId: 'save-application', instruction: '저장을 눌러 완료하세요' }] }, { id: 'review', title: '제출 내용 확인하기', steps: [{ id: 'review-save', title: '저장 확인', targetId: 'save-application', instruction: '저장된 신청을 확인하세요' }] }]}
      onTaskChange$={detail => { task.value = detail.id; if (detail.id === null) step.value = null; }}
      onStart$={detail => { running.value = true; task.value = detail.taskId; step.value = detail.stepId; document.getElementById('applicant-name')?.focus(); }}
      onStepChange$={detail => { step.value = detail.id; document.getElementById(detail.id === 'one' ? 'applicant-name' : 'save-application')?.focus(); }}
      onStop$={() => { running.value = false; step.value = null; }}/>
    <Button id="tutorial-fallback" type="button" variant="text" size="small">도움말로 돌아가기</Button>
  </>;
});

export const ContextualHelpExample = component$(() => <ContextualHelp title="신청 자격 도움말" content="신청 자격에 관한 예제 설명입니다." triggerLabel="신청 자격 도움말" defaultOpen={false} variant="information" placement="bottom-start"/>);

export const CoachMarkExample = component$(() => {
  const open = useSignal(false);
  return <>
    <Button id="tutorial-start" type="button" variant="secondary" size="small" onClick$={() => { open.value = true; }}>따라하기 시작</Button>
    <CoachMark open={open.value} defaultStepId="one" startActionId="tutorial-start" fallbackFocusId="coach-fallback" onOpenChange$={detail => { open.value = detail.open; }}
      steps={[{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '신청인 이름을 입력하세요' }]}
      boundaries={[{ targetId: 'applicant-name', insertionBoundaryId: 'applicant-name-after' }]}>
      <div class="preview-target"><label for="applicant-name">신청인 이름</label><input id="applicant-name"/><div id="applicant-name-after"><CoachMarkOutlet targetId="applicant-name"/></div></div>
    </CoachMark>
    <Button id="coach-fallback" type="button" variant="text" size="small">안내 다음 작업</Button>
  </>;
});

export const TooltipExample = component$(() => <Tooltip text="신청 도움말을 엽니다" relationship="description" triggerLabel="신청 도움말" triggerId="help-trigger" textId="help-tooltip" defaultOpen={false} placement="bottom-start"/>);

export const TTSExample = component$(() => {
  const state = useSignal<TTSProps['state']>('idle');
  return <section id="main-content">
    <p role="note">로컬 음성 안내 시뮬레이션입니다. 실제 음성이나 외부 음성 서비스를 사용하지 않습니다.</p>
    <TTS summary="이 페이지는 예제 신청 방법을 안내합니다." locale="ko-KR" label="음성 안내" size="small" iconOnly={false} state={state.value} onRequest$={detail => { state.value = detail.action === 'pause' ? 'paused' : detail.action === 'stop' ? 'idle' : 'playing'; }}/>
  </section>;
});

export const LanguageSwitcherExample = component$(() => {
  const locale = useSignal('ko');
  return <>
    <LanguageSwitcher currentLocale={locale.value} defaultOpen={false} options={[{ locale: 'ko', nativeLabel: '한국어', translatedLabel: '한국어', href: route('ko') }, { locale: 'en', nativeLabel: 'English', translatedLabel: '영어', href: route('en') }]} onLocaleRequest$={detail => { locale.value = detail.locale; }}/>
    <p lang={locale.value}>{locale.value === 'ko' ? '한국어 예제' : 'English example'}</p>
  </>;
});

export const ResizeExample = component$(() => {
  const value = useSignal('100');
  return <><Resize value={value.value} defaultOpen={false} onValueChange$={detail => { value.value = detail.value; }}/><section class="preview-scaled" style={{ 'font-size': `${value.value}%` }}>확대된 예제 내용과 <Button type="button" variant="secondary" size="small">작업</Button></section></>;
});

export const AccessibleMediaExample = component$(() => <AccessibleMedia media={{ kind: 'audio', src: specimenAudio, type: 'audio/wav' }} captionTracks={[]} transcript={{ content: '약 2초 동안 일정한 높이의 예제 신호음이 들립니다.' }} title="로컬 예제 미디어" controls={true} autoplay={false}/>);

export const VisuallyHiddenExample = component$(() => <><Button type="button" aria-describedby="hidden-help">신청 확인</Button><VisuallyHidden id="hidden-help" content="신청 내용을 확인하세요" variant="text" lang="ko"/></>);

export const BackButtonExample = component$(() => {
  const path = useSignal('/local/current');
  return <><BackButton label="뒤로가기" canGoBack={true} dirty={false} fallbackHref={route('parent')} onBackRequest$={() => { path.value = '/local/parent'; }}/><p role="status" class="preview-status">현재 경로: {path.value}</p></>;
});

export const BottomSheetExample = component$(() => {
  const open = useSignal(true);
  const region = useSignal('seoul');
  return <>
    <Button id="sheet-opener" type="button" variant="secondary" onClick$={() => { open.value = true; }}>지역 선택 열기</Button>
    <BottomSheet title="지역 선택" description="예제 지역을 선택하세요" open={open.value} dismissOnOutside={false} returnFocusId="sheet-opener" onOpenChange$={detail => { open.value = detail.open; }}>
      <RadioGroup label="거주 지역" name="region" value={region.value} options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} onValueChange$={detail => { region.value = detail.value ?? 'seoul'; }}/>
    </BottomSheet>
    <p role="status" class="preview-status">선택 지역: {region.value === 'seoul' ? '서울' : '부산'}</p>
  </>;
});

export const ToastExample = component$(() => {
  const message = useSignal<ToastProps['message']>(null);
  const saved = useSignal(false);
  return <>
    <Button type="button" onClick$={() => { saved.value = true; message.value = { id: 'saved', text: '신청이 저장되었습니다.', tone: 'information', persistentResultId: 'saved-result' }; }}>신청 저장</Button>
    <p id="saved-result" aria-label="처리 결과 확인">{saved.value ? '신청이 저장되었습니다.' : '저장 전입니다.'}</p>
    <Toast message={message.value} durationMs={3000} onDismiss$={() => { message.value = null; }}/>
  </>;
});

export const SnackbarExample = component$(() => {
  const message = useSignal<SnackbarProps['message']>({ id: 'saved', title: '저장 완료', text: '예제 신청을 저장했습니다.' });
  const result = useSignal('저장된 신청');
  return <>
    <Button id="after-notification" type="button" variant="secondary" size="small" onClick$={() => { message.value = { id: 'saved', title: '저장 완료', text: '예제 신청을 저장했습니다.' }; result.value = '저장된 신청'; }}>신청 저장</Button>
    <p role="status" class="preview-status">{result.value}</p>
    <Snackbar message={message.value} durationMs={null} fallbackFocusId="after-notification" action={{ kind: 'button', id: 'undo', label: '실행 취소' }} onAction$={() => { result.value = '저장을 취소했습니다.'; message.value = null; }} onDismiss$={() => { message.value = null; }}/>
  </>;
});

export const TabBarExample = component$(() => <>
  <section class="preview-long"><h2>예제 화면</h2><p>하단 탭 바로 주요 화면으로 이동합니다.</p></section>
  <TabBar currentId="home" items={[{ id: 'home', label: '홈', href: route('home'), icon: 'home' }, { id: 'apply', label: '신청', href: route('apply'), icon: 'document' }, { id: 'profile', label: '내 정보', href: route('profile'), icon: 'person' }]}/>
  <LocalDestinations paths={['home', 'apply', 'profile']}/>
</>);

/** Each catalog ID selects its native component$ before build-time renderToString. */
export const examples: Record<string, Component<object>> = {
  'accessible-media': AccessibleMediaExample, accordion: AccordionExample, 'back-button': BackButtonExample, badge: BadgeExample,
  'bottom-sheet': BottomSheetExample, breadcrumb: BreadcrumbExample, button: ButtonExample, calendar: CalendarExample, carousel: CarouselExample,
  checkbox: CheckboxExample, 'coach-mark': CoachMarkExample, 'contextual-help': ContextualHelpExample, 'critical-alert': CriticalAlertExample,
  'date-input': DateInputExample, disclosure: DisclosureExample, fab: FABExample, favicon: FaviconExample, 'file-upload': FileUploadExample,
  footer: FooterExample, header: HeaderExample, 'help-panel': HelpPanelExample, identifier: IdentifierExample, image: ImageExample,
  'in-page-navigation': InPageNavigationExample, 'language-switcher': LanguageSwitcherExample, link: LinkExample, 'main-menu': MainMenuExample,
  masthead: MastheadExample, modal: ModalExample, 'native-select': NativeSelectExample, pagination: PaginationExample,
  'quantity-toggle': QuantityToggleExample, 'radio-group': RadioGroupExample, 'range-slider': RangeSliderExample, resize: ResizeExample,
  'side-navigation': SideNavigationExample, 'skip-link': SkipLinkExample, snackbar: SnackbarExample, spinner: SpinnerExample,
  'step-indicator': StepIndicatorExample, 'structured-list': StructuredListExample, switch: SwitchExample, 'tab-bar': TabBarExample,
  table: TableExample, tabs: TabsExample, tag: TagExample, 'text-input': TextInputExample, 'text-list': TextListExample, textarea: TextareaExample,
  toast: ToastExample, tooltip: TooltipExample, tts: TTSExample, 'tutorial-panel': TutorialPanelExample, 'visually-hidden': VisuallyHiddenExample,
};
