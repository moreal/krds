<script setup lang="ts">
import { ref, useId, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useFileFormContribution } from '../form-contributions';
import type { FileUploadContract, FileRecord, FileValidationFailure } from '@unofficial-krds/contracts';
const p = defineProps<FileUploadContract & {
    form?: string;
    variant?: 'button' | 'dropzone';
    description?: string;
}>();
const emit = defineEmits<{
    filesChange: [
        detail: {
            value: readonly FileRecord[];
            reason: 'picker' | 'drop' | 'remove';
            addedIds: readonly string[];
            removedIds: readonly string[];
        }
    ];
    filesRejected: [
        detail: {
            rejected: readonly FileValidationFailure[];
        }
    ];
}>();
const input = ref<HTMLInputElement>(), root = ref<HTMLElement>(), drag = ref(false), errors = ref<string[]>([]);
const id = useId();
let sequence = 0;
let pendingRemove: string | null = null;
let resetTimer: ReturnType<typeof setTimeout> | undefined;
const retainedUrls = new Map<string, string>();
function accepts(file: File) {
    if (!p.accept)
        return true;
    return p.accept.split(',').map(x => x.trim().toLowerCase()).some(rule => rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule) : rule.endsWith('/*') ? file.type.startsWith(rule.slice(0, -1)) : file.type === rule);
}
function stage(candidates: readonly File[], reason: 'picker' | 'drop') {
    if (p.disabled || !candidates.length)
        return;
    const rejected: FileValidationFailure[] = [], added: FileRecord[] = [];
    if (!p.multiple && candidates.length > 1) {
        for (const file of candidates)
            rejected.push({ file, code: 'max-files', message: '파일을 한 개만 선택하세요.' });
    }
    else
        for (const file of candidates) {
            if (p.files.some(x => x.file === file))
                continue;
            if (!accepts(file))
                rejected.push({ file, code: 'accept', message: '허용되지 않은 파일 형식입니다.' });
            else if (p.maxBytes !== undefined && file.size > p.maxBytes)
                rejected.push({ file, code: 'max-bytes', message: '파일 크기를 초과했습니다.' });
            else if (p.multiple && p.maxFiles !== undefined && p.files.length + added.length >= p.maxFiles)
                rejected.push({ file, code: 'max-files', message: '파일 개수를 초과했습니다.' });
            else
                added.push({ id: `${id}-file-${++sequence}`, file, status: 'staged' });
        }
    errors.value = rejected.map(x => `${x.file.name}: ${x.message}`);
    if (rejected.length)
        emit('filesRejected', { rejected });
    if (added.length)
        emit('filesChange', { value: p.multiple ? [...p.files, ...added] : added, reason, addedIds: added.map(x => x.id), removedIds: p.multiple ? [] : p.files.map(x => x.id) });
}
function choose() {
    const files = Array.from(input.value?.files ?? []);
    stage(files, 'picker');
    if (input.value)
        input.value.value = '';
}
function remove(id: string) {
    if (p.disabled)
        return;
    pendingRemove = id;
    emit('filesChange', { value: p.files.filter(x => x.id !== id), reason: 'remove', addedIds: [], removedIds: [id] });
}
function drop(e: DragEvent) { e.preventDefault(); drag.value = false; stage(Array.from(e.dataTransfer?.files ?? []), 'drop'); }
useFileFormContribution(input, () => p.disabled ? [] : p.files.map(record => record.file));
function reset(e: Event) {
    if (e.target !== input.value?.form)
        return;
    if (resetTimer !== undefined)
        clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        resetTimer = undefined;
        if (e.defaultPrevented || e.target !== input.value?.form)
            return;
        errors.value = [];
        drag.value = false;
        if (input.value)
            input.value.value = '';
    }, 0);
}
watch(() => p.files, async (files, old) => {
    for (const [key, url] of retainedUrls)
        if (!files.some(x => x.id === key)) {
            URL.revokeObjectURL(url);
            retainedUrls.delete(key);
        }
    if (!pendingRemove || files.some(x => x.id === pendingRemove))
        return;
    const previous = old.findIndex(x => x.id === pendingRemove);
    pendingRemove = null;
    await nextTick();
    const target = files[Math.max(0, previous - 1)] ?? files[0];
    if (target)
        root.value?.querySelector<HTMLButtonElement>(`[data-file-id="${target.id}"]`)?.focus();
    else
        root.value?.querySelector<HTMLButtonElement>('[data-krds-part="picker"]')?.focus();
});
onMounted(() => { document.addEventListener('reset', reset, true); });
onUnmounted(() => {
    if (resetTimer !== undefined)
        clearTimeout(resetTimer);
    document.removeEventListener('reset', reset, true);
    for (const url of retainedUrls.values())
        URL.revokeObjectURL(url);
});
</script>
<template>
<div ref="root" role="group" :aria-labelledby="`${id}-label`" data-krds-part="root" :data-krds-state="disabled?'disabled':drag?'drag-over':''" :data-krds-variant="variant??'dropzone'" data-krds-component="file-upload">
<p :id="`${id}-label`" data-krds-part="label" data-krds-component="file-upload" data-krds-state="">{{label}}</p>
<p v-if="description" :id="`${id}-description`" data-krds-part="description" data-krds-component="file-upload" data-krds-state="">{{description}}</p>
<p :id="`${id}-help`" data-krds-part="help" data-krds-component="file-upload" data-krds-state="">{{accept??'모든 형식'}}{{maxBytes?` / 최대 ${maxBytes}바이트`:''}}{{maxFiles?` / 최대 ${maxFiles}개`:''}}</p>
<input ref="input" :id="id" type="file" data-krds-part="file-input" :name="name" :form="form" :multiple="multiple" :accept="accept" :disabled="disabled" tabindex="-1" aria-hidden="true" @change="choose" data-krds-component="file-upload" data-krds-state=""/>
<button type="button" data-krds-component="file-upload" data-krds-part="picker" data-krds-state="" :disabled="disabled" :id="`${id}-picker`" :aria-describedby="`${description?`${id}-description `:''}${id}-help${errors.length?` ${id}-errors`:''}`" @click="input?.click()">파일 선택</button>
<div v-if="variant!=='button'" data-krds-part="dropzone" data-krds-state="" @dragover.prevent="!disabled&&(drag=true)" @dragleave="drag=false" @drop="drop" data-krds-component="file-upload">파일을 끌어 놓거나 파일 선택을 이용하세요.</div>
<p data-krds-part="count" data-krds-component="file-upload" data-krds-state="">{{files.length}}{{maxFiles?` / ${maxFiles}`:''}}개</p>
<ul data-krds-part="list" data-krds-component="file-upload" data-krds-state="">
<li v-for="record in files" :key="record.id" data-krds-part="item" :data-krds-state="record.status" data-krds-component="file-upload">
<span :id="`${id}-${record.id}`" data-krds-part="filename" data-krds-component="file-upload" data-krds-state="">{{record.file.name}}</span>
<span data-krds-part="size" data-krds-component="file-upload" data-krds-state="">{{record.file.size}} 바이트</span>
<span data-krds-part="status" data-krds-state="" data-krds-component="file-upload">{{record.status==='uploading'?'업로드 중':record.status==='success'?'완료':record.status==='error'?'오류':'선택됨'}}</span>
<progress v-if="record.status==='uploading'" data-krds-part="progress" max="100" :value="record.progress" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="record.progress" :aria-label="`${record.file.name} 진행률`" data-krds-component="file-upload" data-krds-state=""/>
<p v-if="record.error" data-krds-part="error" data-krds-component="file-upload" data-krds-state="">{{record.error}}</p>
<button type="button" data-krds-part="remove" :data-file-id="record.id" :disabled="disabled" :aria-label="`${record.file.name} 삭제`" :aria-describedby="`${id}-${record.id}`" @click="remove(record.id)" data-krds-component="file-upload" data-krds-state="">삭제</button>
</li>
</ul>
<div v-if="errors.length" :id="`${id}-errors`">
<p v-for="error in errors" :key="error" role="alert" data-krds-part="error" data-krds-component="file-upload" data-krds-state="">{{error}}</p>
</div>
</div>
</template>
