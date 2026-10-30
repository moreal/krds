<script setup lang="ts">
import { computed, ref, watchEffect, nextTick } from 'vue';
import { Button, TextInput, NativeSelect, Textarea, Spinner, StructuredList, Pagination, RadioGroup, Modal, Header, SideNavigation, Footer, SkipLink, Link } from '@unofficial-krds/vue';
import type { Identity, Presentation } from './presentation';
const p = defineProps<{ presentation: Presentation; identity: Identity; hrefForPage: (page: number)=>string }>();
const emit = defineEmits<{
  field: [field:'title'|'category'|'detail', value:string]; errorLink:[field:'title'|'category'|'detail'];
  submit:[]; reset:[]; retry:[]; query:[value:string]; search:[]; filter:[category:string];
  consent:[field:'requiredChoice'|'optionalChoice',value:boolean]; review:[]; confirm:[]; close:[];
  mobile:[open:boolean]; expanded:[ids:readonly string[]]; layoutSearch:[];
}>();
const form = ref<HTMLFormElement>();
const formErrors = computed(()=>p.presentation.kind==='form'?p.presentation.errors:[]);
const errorFor=(field:string)=>formErrors.value.find(error=>error.field===field);
const categoryLabel=computed(()=>p.presentation.kind==='search'?p.presentation.categories.find(x=>x.value=== (p.presentation as import('./presentation').SearchView).category)?.label:'');
watchEffect(()=>{ const errors=formErrors.value; void nextTick(()=>{
  for(const field of ['title','category','detail']) {
    const control=form.value?.elements.namedItem(field) as HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement|null;
    control?.setCustomValidity(errors.find(error=>error.field===field)?.message??'');
  }
}); });
function submit(event:SubmitEvent,search=false) { event.preventDefault(); if(composing.value)return; search?emit('search'):emit('submit'); }
function reset(event:Event) { queueMicrotask(()=>{if(!event.defaultPrevented)emit('reset');}); }
const composing=ref(false);
const choice=(value:boolean|null)=>value===null?null:value?'agree':'decline';
const radioOptions=(required:boolean)=>[{id:`example-consent-${required?'required':'optional'}-agree`,value:'agree',label:'동의함'},{id:`example-consent-${required?'required':'optional'}-decline`,value:'decline',label:'동의하지 않음'}];
</script>
<template>
<div class="pattern-page" :data-pattern-kind="presentation.kind">
  <template v-if="presentation.kind==='layout'">
    <SkipLink :links="[{id:'main',label:'본문 바로가기',targetId:'example-main-heading'}]"/>
    <Header :home="{href:presentation.homeHref,label:identity.name,logo:presentation.logo}" :utility-items="[]" :search="{label:'검색 연습',onRequest:()=>emit('layoutSearch')}" :main-navigation="presentation.navigation" :current-id="presentation.currentId" :mobile-open="presentation.mobileOpen" mobile-trigger-id="example-layout-mobile-open" mobile-trigger-label="전체메뉴" navigation-label="주요 메뉴" @mobile-open-change="emit('mobile',$event.open)"/>
    <div class="pattern-layout">
      <SideNavigation class="pattern-sidebar" title="예제 메뉴" aria-label="예제 메뉴" :items="presentation.navigation" :current-id="presentation.currentId" :expanded-ids="presentation.expandedIds" @expanded-change="emit('expanded',$event.ids)"/>
      <main id="main-content"><h1 id="example-main-heading" tabindex="-1">{{presentation.title}}</h1><p>{{identity.name}} — {{identity.notice}}</p><p>{{presentation.body}}</p><Link :href="presentation.helpHref" label="키보드 이용 안내"/></main>
    </div>
    <Footer :service-logo="presentation.logo" :contacts="[]" :utility-links="[{label:'키보드 이용 안내',href:presentation.helpHref}]" :privacy-policy="{label:'개인정보 처리방침',href:presentation.privacyHref}" :policy-links="[]" :copyright-text="identity.copyrightText"/>
  </template>
  <main v-else>
    <h1>{{presentation.kind==='form'?'예제 입력폼':presentation.kind==='search'?'로컬 자료 검색':'예제 이용 안내 확인'}}</h1>
    <p>{{identity.name}} — {{identity.notice}}</p><p>{{identity.dataNotice}}</p>
    <template v-if="presentation.kind==='form'">
      <section v-if="presentation.errors.length" id="example-form-errors" role="alert" aria-labelledby="example-form-errors-title">
        <h2 id="example-form-errors-title">입력 내용을 확인하세요</h2><ol><li v-for="error in presentation.errors" :key="error.field"><a :href="`#${error.targetId}`" @click.prevent="emit('errorLink',error.field)">{{error.message}}</a></li></ol>
      </section>
      <form ref="form" novalidate :aria-busy="presentation.busy" @submit="submit($event)" @reset="reset" @compositionstart="composing=true" @compositionend="composing=false">
        <TextInput id="example-form-title" name="title" label="예제 제목 (필수)" required :disabled="presentation.busy" :value="presentation.values.title" :invalid="!!errorFor('title')" help-id="example-form-title-help" :error-id="errorFor('title')?.errorId" @value-change="emit('field','title',$event.value)"><template #help><p id="example-form-title-help">4자 이상 60자 이하의 예제 문구를 입력하세요.</p></template><template #error><p v-if="errorFor('title')" :id="errorFor('title')?.errorId">{{errorFor('title')?.message}}</p></template></TextInput>
        <NativeSelect id="example-form-category" name="category" label="연습 유형 (필수)" required :options="presentation.categories" :disabled="presentation.busy" :value="presentation.values.category" :invalid="!!errorFor('category')" :error="errorFor('category')?.message" @value-change="emit('field','category',$event.value)"/>
        <Textarea id="example-form-detail" name="detail" label="추가 설명 (선택)" :disabled="presentation.busy" :value="presentation.values.detail" :invalid="!!errorFor('detail')" :error-id="errorFor('detail')?.errorId" help-id="example-form-detail-help" @value-change="emit('field','detail',$event.value)"><template #help><p id="example-form-detail-help">120자 이하로 입력하세요.</p></template><template #error><p v-if="errorFor('detail')" :id="errorFor('detail')?.errorId">{{errorFor('detail')?.message}}</p></template></Textarea>
        <div class="pattern-actions"><Button id="example-form-submit" type="submit" :disabled="presentation.busy">예제 저장</Button><Button id="example-form-reset" type="reset" variant="secondary">초기화</Button></div>
      </form>
      <Spinner v-if="presentation.busy" pending label="예제를 처리하는 중입니다" completion-message="로컬 예제 완료"/>
      <p v-if="presentation.error" role="alert">{{presentation.error}}</p><Button v-if="presentation.error" id="example-form-retry" @click="emit('retry')">다시 시도</Button>
      <p v-if="presentation.receipt" role="status">로컬 예제 완료: {{presentation.receipt.id}} · {{presentation.receipt.title}}</p>
    </template>
    <template v-else-if="presentation.kind==='search'">
      <p>열두 개의 가상 학습 자료를 검색합니다.</p>
      <form role="search" @submit="submit($event,true)" @compositionstart="composing=true" @compositionend="composing=false"><TextInput id="example-search-query" name="query" type="search" label="검색어" :value="presentation.query" @value-change="emit('query',$event.value)"/><Button id="example-search-submit" type="submit">검색</Button></form>
      <NativeSelect id="example-search-category" label="자료 유형" :options="presentation.categories" :value="presentation.category" @value-change="emit('filter',$event.value)"/>
      <Spinner v-if="presentation.busy" pending label="검색하는 중입니다" completion-message="검색 완료"/>
      <p v-if="presentation.error" role="alert">{{presentation.error}}</p><Button v-if="presentation.error" id="example-search-retry" @click="emit('retry')">다시 시도</Button>
      <template v-if="presentation.ready">
        <h2>검색 결과</h2>
        <p id="example-search-count" aria-live="polite">검색어: {{presentation.appliedQuery||'전체'}} · 자료 유형: {{categoryLabel}} · {{presentation.total}}건</p>
        <p v-if="!presentation.total" role="status">검색 결과가 없습니다. 검색어나 자료 유형을 바꿔 보세요.</p>
        <StructuredList v-else :items="presentation.items.map(item=>({id:item.id,title:item.title,metadata:[{label:'유형',value:presentation.kind==='search'?presentation.categories.find(x=>x.value===item.category)?.label??item.category:item.category},{label:'날짜',value:item.date}]}))">
          <template v-for="item in presentation.items" :key="item.id" #[item.id]><p :id="item.id">{{item.summary}}</p></template>
          <template #pagination><Pagination :page="presentation.page" :page-count="presentation.pageCount" :href-for-page="hrefForPage"/></template>
        </StructuredList>
      </template>
    </template>
    <template v-else-if="presentation.kind==='consent'">
      <section v-for="group in presentation.groups" :key="group.id" class="pattern-consent-section"><h2>{{group.title}}</h2><div :id="`example-consent-${group.id}-description`"><p v-for="paragraph in group.paragraphs" :key="paragraph">{{paragraph}}</p></div>
        <RadioGroup :name="group.id" :label="group.title" :options="radioOptions(group.id==='requiredChoice')" :value="choice(presentation[group.id])" :invalid="group.id==='requiredChoice'&&presentation.invalid" :help-id="`example-consent-${group.id}-description`" :error-id="group.id==='requiredChoice'&&presentation.invalid?'example-consent-error':undefined" @value-change="emit('consent',group.id,$event.value==='agree')"/>
      </section>
      <p v-if="presentation.invalid" id="example-consent-error" role="alert">{{presentation.error}}</p>
      <Button id="example-consent-review" @click="emit('review')">확인하기</Button>
      <p v-if="presentation.receipt" role="status">로컬 예제 완료: {{presentation.receipt.id}} · 선택 안내: {{presentation.receipt.optionalChoice?'동의함':'동의하지 않음'}}</p>
      <Modal :open="presentation.open" id="example-consent-dialog" title-id="example-consent-dialog-title" title="예제 선택 확인" initial-focus-id="example-consent-dialog" @open-change="!$event.open&&emit('close')">
        <template #description>선택 결과는 이 화면에서만 확인되며 실제 신청이나 전송은 이루어지지 않습니다.</template>
        <div :aria-busy="presentation.busy"><dl><dt>필수 안내</dt><dd>{{presentation.requiredChoice?'동의함':'동의하지 않음'}}</dd><dt>선택 안내</dt><dd>{{presentation.optionalChoice?'동의함':'동의하지 않음'}}</dd></dl><Spinner v-if="presentation.busy" pending label="예제를 처리하는 중입니다" completion-message="로컬 예제 완료"/><p v-if="presentation.error&&!presentation.invalid" role="alert">{{presentation.error}}</p></div>
        <template #actions><Button id="example-consent-cancel" variant="secondary" @click="emit('close')">돌아가기</Button><Button :id="presentation.error&&!presentation.invalid?'example-consent-retry':'example-consent-confirm'" :aria-disabled="presentation.busy||undefined" @click="presentation.error&&!presentation.invalid?emit('retry'):emit('confirm')">{{presentation.error&&!presentation.invalid?'다시 시도':'예제 완료'}}</Button></template>
      </Modal>
    </template>
  </main>
</div>
</template>
<style scoped>
.pattern-page { max-width:76rem; margin-inline:auto; padding:1rem; overflow-wrap:anywhere; font-family:var(--krds-typo-font-type),system-ui,sans-serif; line-height:1.6; }
.pattern-page main { min-width:0; }
.pattern-page h1 { margin-block:1rem; }
.pattern-page p { margin-block:.75rem; }
.pattern-page form { display:grid; gap:1rem; }
.pattern-actions { display:flex; flex-wrap:wrap; gap:1.5rem; margin-block:1rem; }
.pattern-layout { display:grid; grid-template-columns:minmax(12rem,1fr) minmax(0,3fr); gap:2rem; margin-block:2rem; }
.pattern-consent-section { margin-block:2rem; }
@media(max-width:48rem) { .pattern-layout { display:block; } .pattern-sidebar { display:none; } }
</style>
