import {test} from 'vitest';
import {actions,assertions,given,query,runSiheom} from '@siheom/qwik';
import {PatternRoute} from './pattern-route';
test('native supported Qwik siheom: actual form summary',async()=>{await runSiheom(given.render(<PatternRoute patternId="form-errors" caseId="error-summary-focus"/>),actions.click(query.button('예제 저장')),assertions.visible(query.alert('입력 내용을 확인하세요')));});
test('native supported Qwik siheom: local resource search',async()=>{await runSiheom(given.render(<PatternRoute patternId="search-results" caseId="empty-results"/>),actions.fill(query.searchbox('검색어'),'존재하지않는예제'),actions.click(query.button('검색')),actions.click(query.button('로컬 성공 완료')),assertions.textContent(query.main(''),'검색 결과가 없습니다. 검색어나 자료 유형을 바꿔 보세요.'));});
test('native supported Qwik siheom: actual confirmation dialog',async()=>{await runSiheom(given.render(<PatternRoute patternId="consent-confirmation" caseId="optional-refusal-success"/>),actions.click(query.button('확인하기')),assertions.visible(query.dialog('예제 선택 확인')),actions.click(query.button('돌아가기')));});
test('native supported Qwik siheom: real service main',async()=>{await runSiheom(given.render(<PatternRoute patternId="service-layout" caseId="skip-main"/>),assertions.textContent(query.main(''),'예제 소개'));});
