import { createSignal, onMount } from 'solid-js';
import { Link } from '@unofficial-krds/solid/link';
import { Badge } from '@unofficial-krds/solid/badge';
import { Button } from '@unofficial-krds/solid/button';
import { Switch } from '@unofficial-krds/solid/switch';
import { StructuredList } from '@unofficial-krds/solid/structured-list';
export function HomeIntro() {
 const [ready,setReady]=createSignal(false),[checked,setChecked]=createSignal(false),[count,setCount]=createSignal(0);
 onMount(()=>setReady(true));
 return <div class="docs-home">
  <section aria-labelledby="home-title" class="docs-hero">
   <p>비공식 KRDS 컴포넌트</p>
   <h1 id="home-title">Unofficial KRDS<br />익숙한 디자인을,<br />나의 프레임워크로.</h1>
   <p class="docs-lead">대한민국 정부 디자인 시스템(KRDS)을 React, Solid, Svelte, Vue, Lit, Qwik, Angular 컴포넌트로 구현한 비공식 프로젝트입니다. 쓰던 프레임워크 그대로 KRDS 화면을 만들 수 있습니다.</p>
   <div class="docs-actions"><Link href="/krds/getting-started/installation.html" label="로컬에서 시작하기" appearance="emphasis" /><Link href="/krds/components/" label="54개 컴포넌트 살펴보기" /></div>
   <p><kbd>Ctrl / ⌘</kbd> + <kbd>K</kbd>로 한국어·영어 문서를 검색할 수 있습니다.</p>
  </section>
  <section aria-labelledby="example-title" class="docs-example">
   <p>직접 눌러보세요</p><h2 id="example-title">문서 안에서 만나는 Solid 컴포넌트</h2>
   <p>이 사이트도 Solid 컴포넌트로 만들었습니다. 아래 스위치와 버튼을 직접 눌러 보세요.</p>
   <div class="docs-demo"><Badge label="Solid 예시" tone="information" appearance="outline" /><div class="docs-actions"><Switch id="docs-home-notifications" checked={checked()} onCheckedChange={({checked})=>setChecked(checked)} label="알림 예시 켜기" size="large" disabled={!ready()} /><Button disabled={!ready()} onClick={()=>setCount(count()+1)}>버튼 눌러보기</Button></div><p class="docs-demo-status" role="status">알림 {checked()?'켜짐':'꺼짐'} · 버튼 {count()}회 누름</p><Link href="/krds/components/button.html" label="Button 문서 보기" /></div>
  </section>
  <StructuredList items={[
   {id:'native',title:'쓰던 프레임워크 그대로',href:'/krds/compatibility/',metadata:[{label:'프레임워크',value:'React, Solid, Svelte, Vue, Lit, Qwik, Angular용 패키지가 따로 있어 래퍼 없이 씁니다. Solid 2는 미리보기로 제공합니다.'}]},
   {id:'contracts',title:'같은 API, 같은 동작',href:'/krds/components/',metadata:[{label:'컴포넌트',value:'어느 프레임워크에서든 속성 이름과 키보드 동작이 같습니다. 컴포넌트마다 미리보기와 예제 코드를 함께 봅니다.'}]},
   {id:'sources',title:'KRDS 지침 그대로',href:'/krds/legal/',metadata:[{label:'라이선스',value:'마크업, 접근성, 키보드 조작은 공식 KRDS 안내를 따릅니다. 코드는 MIT이고, KRDS 자료와 글꼴은 원래 조건을 따릅니다.'}]}
  ]} itemActions={item=><Link href={item.href!} label={{native:'지원 버전 확인',contracts:'컴포넌트 문서 읽기',sources:'출처와 라이선스 확인'}[item.id]??item.title} />} />
  <aside aria-label="패키지 이용 안내"><p><strong>아직 npm에 게시하지 않았습니다.</strong> 저장소를 내려받아 빌드해서 씁니다. 순서는 <Link href="/krds/getting-started/installation.html" label="빠른 시작" />에 있습니다. 공식 KRDS 또는 정부 서비스가 아닙니다.</p></aside>
 </div>;
}
