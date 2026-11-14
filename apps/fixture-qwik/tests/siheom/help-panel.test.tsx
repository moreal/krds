import { actions, assertions, given, query, runSiheom } from '@siheom/qwik';
import { test } from 'vitest';
import { HelpPanel } from '@unofficial-krds/qwik';
const topics = [{ id: 'a', title: '신청 자격', content: '내용', relatedLinks: [] }];
test('native HelpPanel opener only opens: pressing it again keeps the panel until the close button closes it', async () => { await runSiheom(given.render(<HelpPanel defaultOpen={false} topics={topics} />), actions.click(query.button('도움말 열기')), assertions.visible(query.button('도움말 닫기')), actions.click(query.button('도움말 열기')), assertions.visible(query.button('도움말 닫기')), actions.click(query.button('도움말 닫기'))); });
