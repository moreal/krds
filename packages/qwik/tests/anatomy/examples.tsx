import { component$, useSignal } from '@builder.io/qwik';
import { FileUpload } from '../../src/components/file-upload';
import { TutorialPanel } from '../../src/components/tutorial-panel';
import { BottomSheet } from '../../src/components/bottom-sheet';
import { Modal } from '../../src/components/modal';

/** Local-only anatomy fixtures: no API, CDN or external assets. */
const tasks = [{ id: 'apply', title: '예제 신청하기', steps: [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '이름을 입력하세요' }, { id: 'two', title: '신청 저장', targetId: 'save-application', instruction: '저장하세요' }] }];
export const FileUploadAnatomy = component$(() => <FileUpload label="첨부 서류" name="documents" files={[]} accept=".txt" onFilesChange$={() => {}}/>);
export const TutorialPanelAnatomy = component$(() => <TutorialPanel tasks={tasks} activeTaskId="apply" activeStepId="two" defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="tutorial-start"/>);
const multiTasks = [...tasks, { id: 'review', title: '신청 내역 확인', steps: [{ id: 'open', title: '내역 열기', targetId: 'history', instruction: '내역을 여세요' }] }];
export const TutorialOverviewAnatomy = component$(() => <TutorialPanel tasks={multiTasks} activeTaskId={null} activeStepId={null} defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="overview-start"/>);
export const TutorialNoStepAnatomy = component$(() => <TutorialPanel tasks={multiTasks} activeTaskId="apply" activeStepId={null} defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="task-start"/>);
/** Host-controlled task view: the host records each task-change request and commits it (clearing the step). */
export const TutorialTaskViewAnatomy = component$(() => {
  const task = useSignal<string | null>('apply'), step = useSignal<string | null>('two'), log = useSignal<string[]>([]);
  return <><output id="task-changes">{log.value.join(',')}</output><TutorialPanel tasks={multiTasks} activeTaskId={task.value} activeStepId={step.value} defaultRunning={false} defaultOpen={true} defaultActivePanel="tutorial" startActionId="task-start" onTaskChange$={detail => { log.value = [...log.value, String(detail.id)]; step.value = null; task.value = detail.id; }}/></>;
});

/** BottomSheet composed in the public Modal with more choices than the viewport holds. */
export const BottomSheetStackingAnatomy = component$(() => <BottomSheet title="지역 선택" description="한 곳을 고르세요" defaultOpen={true} actions={<button type="button">적용</button>}><fieldset><legend>지역</legend>{['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종'].map(region => <label key={region} style={{ display: 'block' }}><input type="radio" name="region" value={region}/>{region}</label>)}</fieldset></BottomSheet>);
export const BottomSheetNestedModalAnatomy = component$(() => <BottomSheet title="지역 선택" defaultOpen={true}><Modal title="정말 닫을까요?" titleId="inner-title" description="선택이 사라집니다" descriptionId="inner-description" defaultOpen={true}><p>내부</p></Modal></BottomSheet>);
/** Records the sheet's own requests so a nested Modal's dismissal can be shown not to reach it. */
export const BottomSheetNestedDismissAnatomy = component$(() => {
  const log = useSignal<string[]>([]), cancels = useSignal(0);
  return <><output id="sheet-requests">{log.value.join(',')}|{cancels.value}</output><BottomSheet title="지역 선택" defaultOpen={true} dismissOnOutside={true} onOpenChange$={detail => { log.value = [...log.value, detail.reason]; }} onCancel$={() => { cancels.value++; }}><Modal title="정말 닫을까요?" titleId="inner-title" defaultOpen={true} closeOnOutsideClick={true}><button type="button">내부 동작</button></Modal></BottomSheet></>;
});
