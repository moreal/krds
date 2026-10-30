import type { Category, LayoutId, Resource } from './types.js';
/** Independent fictional data. No agency identity, account or personal record. */
export const demoIdentity = Object.freeze({
  name: '독립 KRDS 조합 예제',
  notice: '개인 독립 프로젝트의 연습 화면입니다. 정부·공공기관의 공식 서비스가 아닙니다.',
  dataNotice: '예제 문구만 입력하세요. 입력값은 이 화면의 메모리에만 있으며 전송·저장되지 않습니다.',
  governmentService: false,
  copyrightText: '독립 예제 코드 © 2026 Lee Dogeon. MIT. KRDS 원본 자료의 권리는 별도입니다.',
});

export const formCategories = Object.freeze([
  { value: '', label: '유형을 선택하세요' },
  { value: 'practice', label: '화면 조합 연습' },
  { value: 'feedback', label: '예제 개선 연습' },
]);

export const resources: readonly Readonly<Resource>[] = Object.freeze([
  { id: 'resource-01', title: '접근성 점검 가이드', category: 'guide', summary: '레이블과 키보드 탐색을 연습하는 가상 자료입니다.', date: '2024-02-12' },
  { id: 'resource-02', title: '접근성 입력폼 예제', category: 'example', summary: '오류 안내와 필드 이동을 연습합니다.', date: '2024-02-13' },
  { id: 'resource-03', title: '접근성 용어 참고', category: 'reference', summary: '학습용 용어를 정리한 가상 자료입니다.', date: '2024-02-14' },
  { id: 'resource-04', title: '검색 화면 가이드', category: 'guide', summary: '검색어와 결과 수를 유지하는 연습 자료입니다.', date: '2024-02-15' },
  { id: 'resource-05', title: '검색 목록 예제', category: 'example', summary: '필터 변경과 페이지 초기화를 연습합니다.', date: '2024-02-16' },
  { id: 'resource-06', title: '페이지네이션 참고', category: 'reference', summary: '현재 페이지와 경계 동작을 비교합니다.', date: '2024-02-17' },
  { id: 'resource-07', title: '동의 화면 가이드', category: 'guide', summary: '필수와 선택 항목을 구분하는 연습 자료입니다.', date: '2024-02-18' },
  { id: 'resource-08', title: '동의 확인 예제', category: 'example', summary: '선택과 확인 대화상자를 연습합니다.', date: '2024-02-19' },
  { id: 'resource-09', title: '대화상자 참고', category: 'reference', summary: '닫은 후 시작 위치로 돌아가는 연습 자료입니다.', date: '2024-02-20' },
  { id: 'resource-10', title: '화면 구조 가이드', category: 'guide', summary: '헤더와 본문 및 푸터의 순서를 연습합니다.', date: '2024-02-21' },
  { id: 'resource-11', title: '화면 탐색 예제', category: 'example', summary: '좁은 화면에서도 같은 경로를 찾아봅니다.', date: '2024-02-22' },
  { id: 'resource-12', title: '접근성 탐색 참고', category: 'reference', summary: '현재 경로와 펼침 상태의 차이를 확인합니다.', date: '2024-02-23' },
].map(item => Object.freeze({ ...item, category: item.category as Exclude<Category, 'all'> })));

export const resourceCategories: readonly { value: Category; label: string }[] = Object.freeze([
  { value: 'all', label: '전체' }, { value: 'guide', label: '가이드' },
  { value: 'example', label: '예제' }, { value: 'reference', label: '참고' },
]);

export const consentContent: readonly { id: 'requiredChoice' | 'optionalChoice'; title: string; required: boolean; paragraphs: readonly string[] }[] = Object.freeze([
  { id: 'requiredChoice', title: '예제 이용 안내 확인 (필수)', required: true,
    paragraphs: ['이 화면은 독립 프로젝트의 연습 예제입니다.', '실제 신청, 인증 또는 기관 업무를 처리하지 않습니다. 확인 결과는 새로고침하면 사라집니다.'] },
  { id: 'optionalChoice', title: '추가 예제 안내 표시 (선택)', required: false,
    paragraphs: ['완료 화면에서 추가 연습 안내를 표시합니다.', '동의하지 않아도 예제를 완료할 수 있습니다. 연락처 수집이나 메시지 발송은 없습니다.'] },
]);

export interface LayoutNavigationItem { id: string; label: string; href?: string; children?: readonly LayoutNavigationItem[] }
export const layoutNavigation: readonly LayoutNavigationItem[] = Object.freeze([
  { id: 'examples', label: '예제 둘러보기', children: [
    { id: 'overview', label: '예제 소개', href: '?section=overview' },
    { id: 'form', label: '입력폼 연습', href: '?section=form' },
    { id: 'search', label: '검색 연습', href: '?section=search' },
    { id: 'consent', label: '동의 연습', href: '?section=consent' },
  ] },
  { id: 'help', label: '도움말', children: [
    { id: 'accessibility', label: '키보드 이용 안내', href: '?section=accessibility' },
    { id: 'privacy', label: '개인정보 처리방침', href: '?section=privacy' },
  ] },
]);

export const layoutSections: Readonly<Record<LayoutId, { title: string; body: string }>> = Object.freeze({
  overview: { title: '예제 소개', body: '네 가지 조합을 로컬 데이터로 연습합니다.' },
  form: { title: '입력폼 연습', body: '오류 요약의 링크를 통해 입력 필드로 이동할 수 있습니다.' },
  search: { title: '검색 연습', body: '필터를 바꾸면 첫 페이지의 결과를 확인합니다.' },
  consent: { title: '동의 연습', body: '필수 안내와 선택 안내를 구분하여 확인합니다.' },
  accessibility: { title: '키보드 이용 안내', body: 'Tab과 Shift+Tab으로 이동하고 링크는 Enter로 실행합니다.' },
  privacy: { title: '개인정보 처리방침', body: '이 예제는 입력값을 전송하거나 영구 저장하지 않습니다. 새로고침하면 메모리의 예제 값이 사라집니다.' },
});
