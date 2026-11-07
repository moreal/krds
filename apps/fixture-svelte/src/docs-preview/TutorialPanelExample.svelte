<script lang="ts">
import Button from '@unofficial-krds/svelte/button';
import TutorialPanel from '@unofficial-krds/svelte/tutorial-panel';
import { tick } from 'svelte';
import type { TutorialPanelProps } from '@unofficial-krds/svelte';
const props: TutorialPanelProps = { tasks: [{ id: 'apply', title: '예제 신청하기', steps: [{ id: 'one', title: '이름 입력', targetId: 'applicant-name', instruction: '신청인 이름을 입력하세요' }, { id: 'two', title: '신청 저장', targetId: 'save-application', instruction: '저장을 눌러 완료하세요' }] }], activeTaskId: 'apply', activeStepId: null, defaultOpen: true, defaultActivePanel: 'tutorial', startActionId: 'tutorial-start', fallbackFocusId: 'tutorial-fallback' };
let running = $state(false);
let step = $state<string | null>(null);
const focusTarget = (id: string | null) => document.getElementById(id === 'one' ? 'applicant-name' : 'save-application')?.focus();
</script>
<label for="applicant-name">신청인 이름</label><input id="applicant-name" data-active-target={step === 'one'} /><div id="applicant-name-after"></div>
<Button id="save-application" variant="secondary" size="small" data-active-target={step === 'two'}>신청 저장</Button><div id="save-application-after"></div>
<p role="status">현재 대상: {step === 'one' ? '신청인 이름' : step === 'two' ? '신청 저장' : '없음'}</p>
<TutorialPanel {...props} {running} activeStepId={step}
  onStart={(d) => { running = true; step = d.stepId; focusTarget(d.stepId); }}
  onStepChange={(d) => { step = d.id; focusTarget(d.id); }}
  onStop={async (d) => { running = false; step = null; await tick(); document.getElementById(d.returnTo.startActionId)?.focus(); }} />
<Button id="tutorial-fallback" variant="tertiary" size="small">도움말로 돌아가기</Button>
