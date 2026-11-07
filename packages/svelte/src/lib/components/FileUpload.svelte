<script lang="ts">
import {tick,untrack} from 'svelte';
import type {FileUploadContract,FileRecord,FileValidationFailure} from '@unofficial-krds/contracts';
import {owned,resetField} from './catalog-state.svelte.js';
import {registerFileField} from './file-form.js';
let p:FileUploadContract&{form?:string;variant?:'button'|'dropzone'}=$props();
const uid=$props.id();let input=$state<HTMLInputElement>(),root=$state<HTMLElement>(),picker=$state<HTMLButtonElement>();
let sequence=0,drag=$state(false),errors=$state<string[]>([]);
let removal:{id:string;previous:string[];next:string[];focused:boolean}|undefined;
$effect(()=>{if(p.maxFiles!==undefined&&(!Number.isInteger(p.maxFiles)||p.maxFiles<1))throw new RangeError('maxFiles must be a positive integer');if(p.maxBytes!==undefined&&(!Number.isFinite(p.maxBytes)||p.maxBytes<0))throw new RangeError('maxBytes must be nonnegative');const ids=p.files.map(record=>record.id);if(ids.some(id=>!id)||new Set(ids).size!==ids.length)throw new TypeError('File record IDs must be unique and nonempty');});
$effect(()=>{p.form;const node=input;if(node)return registerFileField(node,()=>({name:p.name,disabled:p.disabled,files:p.files}));});
resetField(()=>input,()=>{if(input)input.value='';errors=[];drag=false;},()=>p.form);
function isDisabled(){return Boolean(p.disabled||input?.matches(':disabled'));}
function accepts(file:File){return !p.accept||p.accept.split(',').map(rule=>rule.trim().toLowerCase()).some(rule=>rule.startsWith('.')?file.name.toLowerCase().endsWith(rule):rule.endsWith('/*')?file.type.startsWith(rule.slice(0,-1)):file.type===rule);}
function stage(files:File[],reason:'picker'|'drop'){
 if(isDisabled()||!files.length)return;
 const rejected:FileValidationFailure[]=[],added:FileRecord[]=[];
 for(const file of files){
  if(p.files.some(record=>record.file===file)||added.some(record=>record.file===file))continue;
  const code=!p.multiple&&files.length>1?'max-files':!accepts(file)?'accept':p.maxBytes!==undefined&&file.size>p.maxBytes?'max-bytes':p.multiple&&p.maxFiles!==undefined&&p.files.length+added.length>=p.maxFiles?'max-files':undefined;
  if(code)rejected.push({file,code,message:code==='accept'?'허용되지 않은 파일 형식입니다.':code==='max-bytes'?'파일 크기를 초과했습니다.':'파일 개수를 초과했습니다.'});
  else added.push({id:`${uid}-${++sequence}`,file,status:'staged'});
 }
 errors=rejected.map(item=>`${item.file.name}: ${item.message}`);
 if(rejected.length)p.onFilesRejected?.({rejected});
 if(added.length)p.onFilesChange({value:p.multiple?[...p.files,...added]:added,reason,addedIds:added.map(record=>record.id),removedIds:p.multiple?[]:p.files.map(record=>record.id)});
}
function choose(){if(!input)return;stage([...input.files??[]],'picker');input.value='';}
function remove(id:string){if(isDisabled())return;const index=p.files.findIndex(record=>record.id===id);if(index<0)return;removal={id,previous:p.files.slice(0,index).map(record=>record.id).reverse(),next:p.files.slice(index+1).map(record=>record.id),focused:root?.contains(root.ownerDocument.activeElement)??false};p.onFilesChange({value:p.files.filter(record=>record.id!==id),reason:'remove',addedIds:[],removedIds:[id]});}
$effect(()=>{const ids=p.files.map(record=>record.id);if(!removal||ids.includes(removal.id))return;const pending=removal;removal=undefined;void tick().then(()=>{if(!root?.isConnected||!pending.focused)return;const doc=root.ownerDocument,active=doc.activeElement;if(active&&active!==doc.body&&active.isConnected&&!root.contains(active))return;const id=[...pending.previous,...pending.next].find(id=>p.files.some(record=>record.id===id));const target=[...root.querySelectorAll<HTMLButtonElement>('[data-file-id]')].find(node=>node.dataset.fileId===id&&!node.disabled);if(target)target.focus();else if(picker&&!picker.disabled)picker.focus();else{root.tabIndex=-1;root.focus();}});});
</script>
<section bind:this={root} {...owned('file-upload','root',p.disabled&&'disabled',drag&&'drag-over')}>
 <label id={`${uid}-label`} for={uid} {...owned('file-upload','label')}>{p.label}</label>
 <p id={`${uid}-description`} {...owned('file-upload','description')}>{p.accept?`파일 형식: ${p.accept}`:''} {p.maxBytes!==undefined?`최대 ${p.maxBytes} 바이트`:''} {p.maxFiles?`최대 ${p.maxFiles}개`:''}</p>
 <div role="group" aria-label="파일 놓기" {...owned('file-upload','dropzone',drag&&'drag-over',p.disabled&&'disabled')} ondragover={event=>{event.preventDefault();if(!isDisabled())drag=true;}} ondragleave={()=>drag=false} ondrop={event=>{event.preventDefault();drag=false;stage([...event.dataTransfer?.files??[]],'drop');}}>
  <input bind:this={input} id={uid} type="file" form={p.form} multiple={p.multiple} accept={p.accept} disabled={p.disabled} tabindex="-1" aria-hidden="true" {...owned('file-upload','file-input',p.disabled&&'disabled')} onchange={choose}/>
  <button bind:this={picker} type="button" disabled={p.disabled} id={`${uid}-picker`} aria-labelledby={`${uid}-picker ${uid}-label`} aria-describedby={`${uid}-description${errors.length?` ${uid}-errors`:''}`} {...owned('file-upload','picker',p.disabled&&'disabled')} onclick={()=>input?.click()}>파일 선택</button>
 </div>
 <p {...owned('file-upload','count')}>{p.files.length}{p.maxFiles?` / ${p.maxFiles}`:''}개 파일</p>
 <ul {...owned('file-upload','list')}>
 {#each p.files as record(record.id)}
  <li {...owned('file-upload','item',record.status,p.disabled&&'disabled')}>
   <span {...owned('file-upload','filename')}>{record.file.name}</span><span {...owned('file-upload','size')}>{record.file.size} 바이트</span>
   <span {...owned('file-upload','status',record.status)}>{({staged:'선택됨',uploading:'업로드 중',success:'완료',error:'오류'})[record.status]}</span>
   {#if record.progress!==undefined}<progress max="100" value={record.progress} aria-valuenow={record.progress} aria-label={`${record.file.name} 업로드`} {...owned('file-upload','progress',record.status)}></progress>{/if}
   {#if record.error}<p {...owned('file-upload','error','error')}>{record.error}</p>{/if}
   <button type="button" data-file-id={record.id} aria-label={`${record.file.name} 삭제`} disabled={p.disabled} {...owned('file-upload','remove',p.disabled&&'disabled')} onclick={()=>remove(record.id)}>삭제</button>
  </li>
 {/each}
 </ul>
 {#if errors.length}<div id={`${uid}-errors`} role="status" {...owned('file-upload','error','error')}>{errors.join(' ')}</div>{/if}
</section>
