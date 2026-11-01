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
   <p>비공식 구현 · 프레임워크 고유 렌더링</p>
   <h1 id="home-title">Unofficial KRDS<br />익숙한 디자인을,<br />나의 프레임워크로.</h1>
   <p class="docs-lead">대한민국 정부 디자인 시스템(KRDS)을 각 프레임워크의 컴포넌트로 구현하는 독립 프로젝트입니다. API와 실제 기록을 살펴보고, 로컬 빌드로 시작하세요.</p>
   <div class="docs-actions"><Link href="/krds/getting-started/installation.html" label="로컬에서 시작하기" appearance="emphasis" /><Link href="/krds/components/" label="54개 컴포넌트 살펴보기" /></div>
   <p><kbd>Ctrl / ⌘</kbd> + <kbd>K</kbd>로 한국어·영어 문서를 검색할 수 있습니다.</p>
  </section>
  <section aria-labelledby="example-title" class="docs-example">
   <p>직접 눌러보세요</p><h2 id="example-title">문서 안에서 만나는 Solid 컴포넌트</h2>
   <p>공개 Solid 1 패키지의 Link, Badge, Button, Switch입니다. 이 예시는 페이지 안의 상태만 사용하며, 선택을 저장하거나 전송하지 않습니다.</p>
   <div class="docs-demo"><Badge label="Solid 예시" tone="information" appearance="outline" /><div class="docs-actions"><Switch id="docs-home-notifications" checked={checked()} onCheckedChange={({checked})=>setChecked(checked)} label="알림 예시 켜기" size="large" disabled={!ready()} /><Button disabled={!ready()} onClick={()=>setCount(count()+1)}>버튼 눌러보기</Button></div><p class="docs-demo-status" role="status">알림 {checked()?'켜짐':'꺼짐'} · 버튼 {count()}회 누름</p><Link href="/krds/components/button.html" label="Button API와 기록 보기" /><p>예시는 지원되는 밝은 테마입니다.</p></div>
  </section>
  <StructuredList items={[
   {id:'native',title:'각자의 렌더러로',href:'/krds/compatibility/',metadata:[{label:'01 / NATIVE',value:'React, Solid, Svelte, Vue, Lit, Qwik, Angular가 각자의 방식으로 UI를 렌더링합니다. Solid 2는 별도 프리뷰입니다.'}]},
   {id:'contracts',title:'근거를 따라가는 API',href:'/krds/components/',metadata:[{label:'02 / CONTRACTS',value:'속성, 이벤트, 기본값과 키보드 동작을 실제 소비자 코드와 보존된 KRDS 출처에 연결합니다.'}]},
   {id:'sources',title:'출처와 권리를 명확하게',href:'/krds/legal/',metadata:[{label:'03 / SOURCES',value:'독립 구현 코드, 공식 KRDS 자료, 글꼴은 각자의 조건을 유지합니다. 원본과 해시, 재배포 조건을 함께 확인하세요.'}]}
  ]} itemActions={item=><Link href={item.href!} label={{native:'버전과 지원 기록 확인',contracts:'컴포넌트 참조 문서 읽기',sources:'출처와 라이선스 확인'}[item.id]??item.title} />} />
  <aside aria-label="패키지 이용 안내"><p><strong>로컬 개발 후보입니다.</strong> 공개 패키지 소스 버전은 <code>0.1.0</code>, 비공개 문서 워크스페이스 버전은 <code>0.0.0</code>입니다. <code>@unofficial-krds</code> 이름은 npm 게시나 계정 소유권 확인을 뜻하지 않습니다. <Link href="/krds/getting-started/installation.html" label="빠른 시작" />과 <Link href="/krds/compatibility/" label="지원 기록" />을 먼저 확인하세요. 공식 KRDS 또는 정부 서비스가 아닙니다.</p></aside>
 </div>;
}
