<script setup lang="ts">
import { computed, ref } from 'vue';
import { Button, TutorialPanel } from '@unofficial-krds/vue';
const running=ref(false);
const step=ref<string|null>(null);
const task=ref<string|null>('apply');
const labels:Record<string,string>={one:'신청인 이름',two:'신청 저장'};
const targets:Record<string,string>={one:'applicant-name',two:'save-application'};
const current=computed(()=>step.value?labels[step.value]:'없음');
function focusStep(id:string|null){if(id)document.getElementById(targets[id])?.focus();}
function start(detail:{stepId:string}){running.value=true;step.value=detail.stepId;focusStep(detail.stepId);}
function change(detail:{id:string|null}){step.value=detail.id;focusStep(detail.id);}
function stop(){running.value=false;step.value=null;}
function taskChange(detail:{id:string|null}){task.value=detail.id;if(!detail.id)step.value=null;}
</script>
<template><div><label for="applicant-name">신청인 이름</label><input id="applicant-name" :data-active-target="step==='one'"/><div id="applicant-name-after"/><Button id="save-application" variant="secondary" size="small" :data-active-target="step==='two'">신청 저장</Button><div id="save-application-after"/><p role="status">현재 대상: {{current}}</p><TutorialPanel :default-open="true" :running="running" default-active-panel="tutorial" :tasks="[{id:'apply',title:'예제 신청하기',steps:[{id:'one',title:'이름 입력',targetId:'applicant-name',instruction:'신청인 이름을 입력하세요'},{id:'two',title:'신청 저장',targetId:'save-application',instruction:'저장을 눌러 완료하세요'}]}]" :active-task-id="task" :active-step-id="step" start-action-id="tutorial-start" fallback-focus-id="tutorial-fallback" @start="start" @task-change="taskChange" @step-change="change" @stop="stop"/><Button id="tutorial-fallback" variant="tertiary" size="small">도움말로 돌아가기</Button></div></template>
