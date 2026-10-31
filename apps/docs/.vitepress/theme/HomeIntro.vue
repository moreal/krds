<script setup lang="ts">
import { ref } from 'vue';
import { withBase } from 'vitepress';
import Link from '@unofficial-krds/vue/link';
import Badge from '@unofficial-krds/vue/badge';
import Button from '@unofficial-krds/vue/button';
import Switch from '@unofficial-krds/vue/switch';
import '@unofficial-krds/tokens/tokens.css';
import '@unofficial-krds/styles/link.css';
import '@unofficial-krds/styles/badge.css';
import '@unofficial-krds/styles/button.css';
import '@unofficial-krds/styles/switch.css';

const checked = ref(false);
const count = ref(0);
</script>

<template>
  <main class="krds-home">
    <section class="krds-hero" aria-labelledby="home-title">
      <p class="krds-kicker">비공식 구현 · 프레임워크 고유 렌더링</p>
      <h1 id="home-title"><span>KRDS Native</span>익숙한 디자인을,<br>나의 프레임워크로.</h1>
      <p class="krds-lead">대한민국 정부 디자인 시스템(KRDS)을 각 프레임워크의 컴포넌트로 구현하는 독립 프로젝트입니다. API와 실제 기록을 살펴보고, 로컬 빌드로 시작하세요.</p>
      <div class="krds-actions">
        <a class="krds-action primary" :href="withBase('/getting-started/installation.html')">로컬에서 시작하기 <span aria-hidden="true">→</span></a>
        <a class="krds-action secondary" :href="withBase('/components/')">54개 컴포넌트 살펴보기 <span aria-hidden="true">→</span></a>
      </div>
      <p class="krds-shortcut"><kbd>Ctrl / ⌘</kbd> + <kbd>K</kbd>로 한국어·영어 문서를 검색할 수 있습니다.</p>
    </section>

    <section class="krds-example" aria-labelledby="example-title">
      <div class="krds-example-intro">
        <p class="krds-kicker">직접 눌러보세요</p>
        <h2 id="example-title">문서 안에서 만나는 Vue 컴포넌트</h2>
        <p>공개 Vue 패키지의 Link, Badge, Button, Switch입니다. 이 예시는 페이지 안의 상태만 사용하며, 선택을 저장하거나 전송하지 않습니다.</p>
      </div>
      <div class="krds-demo" aria-label="밝은 테마 Vue 예시">
        <Badge label="Vue 예시" tone="information" appearance="outline" />
        <div class="krds-demo-controls">
          <Switch id="docs-home-notifications" v-model="checked" label="알림 예시 켜기" size="large" />
          <Button @click="count += 1">버튼 눌러보기</Button>
        </div>
        <p class="krds-demo-status" role="status">알림 {{ checked ? '켜짐' : '꺼짐' }} · 버튼 {{ count }}회 누름</p>
        <Link :href="withBase('/components/button.html')" label="Button API와 기록 보기" />
        <p class="krds-demo-caption">예시는 밝은 테마입니다. 문서의 테마 설정과 별도로 표시합니다.</p>
      </div>
    </section>

    <section class="krds-paths" aria-label="문서 탐색">
      <a class="krds-path" :href="withBase('/compatibility/')">
        <span class="krds-path-number" aria-hidden="true">01 / NATIVE</span>
        <h2>각자의 렌더러로</h2>
        <p>React, Solid, Svelte, Vue, Lit, Qwik, Angular가 각자의 방식으로 UI를 렌더링합니다. Solid 2는 별도 프리뷰입니다.</p>
        <span class="krds-path-link">버전과 지원 기록 확인 <span aria-hidden="true">→</span></span>
      </a>
      <a class="krds-path" :href="withBase('/components/')">
        <span class="krds-path-number" aria-hidden="true">02 / CONTRACTS</span>
        <h2>근거를 따라가는 API</h2>
        <p>속성, 이벤트, 기본값과 키보드 동작을 실제 소비자 코드와 보존된 KRDS 출처에 연결합니다.</p>
        <span class="krds-path-link">컴포넌트 참조 문서 읽기 <span aria-hidden="true">→</span></span>
      </a>
      <a class="krds-path" :href="withBase('/legal/')">
        <span class="krds-path-number" aria-hidden="true">03 / SOURCES</span>
        <h2>출처와 권리를 명확하게</h2>
        <p>독립 구현 코드, 공식 KRDS 자료, 글꼴은 각자의 조건을 유지합니다. 원본과 해시, 재배포 조건을 함께 확인하세요.</p>
        <span class="krds-path-link">출처와 라이선스 확인 <span aria-hidden="true">→</span></span>
      </a>
    </section>
    <aside class="catalog-note" aria-label="패키지 이용 안내">
      <p><strong>로컬 개발 후보입니다.</strong> 공개 패키지 소스 버전은 <code>0.1.0</code>, 비공개 문서 워크스페이스 버전은 <code>0.0.0</code>입니다. <code>@unofficial-krds</code> 이름은 npm 게시나 계정 소유권 확인을 뜻하지 않습니다. <a :href="withBase('/getting-started/installation.html')">빠른 시작</a>과 <a :href="withBase('/compatibility/')">지원 기록</a>을 먼저 확인하세요. 공식 KRDS 또는 정부 서비스가 아닙니다.</p>
    </aside>
  </main>
</template>
