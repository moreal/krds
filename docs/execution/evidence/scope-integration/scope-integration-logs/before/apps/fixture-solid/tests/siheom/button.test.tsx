import { beforeEach, expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { createSignal, type Component, type JSX } from 'solid-js';
import { render } from '@solidjs/testing-library';
import { assertions, given, query, runSiheom } from '@siheom/solid';
import * as Krds from '@krds-native/solid';
import { FixtureApp } from '../../src/fixture-app';

type TestButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string; icon?: JSX.Element };
const Button = Reflect.get(Krds, 'Button') as Component<TestButtonProps>;
beforeEach(() => expect(Button, 'public native Solid Button').toBeTypeOf('function'));

test('canonical disabled button uses native disabled semantics', async () => {
  await runSiheom(given.render(() => <FixtureApp componentId="button" caseId="disabled" />), assertions.textContent(query.status('Fixture health'), 'ready'));
  expect(window.__KRDS_FIXTURE__?.framework).toBe('solid');
  await runSiheom(assertions.disabled(query.button('저장')));
});

test('default button never submits and pointer, Enter, Space activate exactly once', async () => {
  let actions = 0;
  let submissions = 0;
  const view = render(() => <form onSubmit={e => { e.preventDefault(); submissions++; }}><Button onClick={() => actions++}>실행</Button></form>);
  const button = view.getByRole('button', { name: '실행' }) as HTMLButtonElement;
  expect(button.tagName).toBe('BUTTON');
  expect(button.type).toBe('button');
  await userEvent.click(page.getByRole('button', { name: '실행' }));
  expect(actions).toBe(1);
  await userEvent.keyboard('{Enter}');
  expect(actions).toBe(2);
  await userEvent.keyboard('[Space>]');
  expect(actions).toBe(2);
  await userEvent.keyboard('[/Space]');
  expect(actions).toBe(3);
  expect(submissions).toBe(0);
});

test('explicit submit supplies the submitter and reset uses the cancelable native algorithm', async () => {
  const submissions: FormData[] = [];
  let resets = 0;
  let cancelReset = true;
  const view = render(() => <form onSubmit={e => { e.preventDefault(); submissions.push(new FormData(e.currentTarget, e.submitter)); }} onReset={e => { resets++; if (cancelReset) e.preventDefault(); }}>
    <input name="note" value="initial" />
    <Button type="submit" name="action" value="save">제출</Button>
    <Button type="reset">초기화</Button>
  </form>);
  const field = view.getByRole('textbox') as HTMLInputElement;
  field.defaultValue = 'initial';
  field.value = 'changed';
  await userEvent.click(page.getByRole('button', { name: '제출' }));
  expect(submissions).toHaveLength(1);
  expect(submissions[0]!.get('action')).toBe('save');
  await userEvent.click(page.getByRole('button', { name: '초기화' }));
  expect(resets).toBe(1);
  expect(field.value).toBe('changed');
  cancelReset = false;
  await userEvent.click(page.getByRole('button', { name: '초기화' }));
  expect(resets).toBe(2);
  expect(field.value).toBe('initial');
});

test('reactive disabled suppresses actions and form data while icon names stay accessible', () => {
  let actions = 0;
  const [disabled, setDisabled] = createSignal(false);
  const view = render(() => <form onSubmit={event => event.preventDefault()}><Button type="submit" name="action" value="close" variant="icon" aria-label="닫기" disabled={disabled()} onClick={() => actions++}>×</Button></form>);
  const button = view.getByRole('button', { name: '닫기' }) as HTMLButtonElement;
  button.click();
  expect(actions).toBe(1);
  expect(new FormData(button.form!, button).get('action')).toBe('close');
  setDisabled(true);
  button.click();
  expect(actions).toBe(1);
  expect(button.disabled).toBe(true);
  expect(new FormData(button.form!, button).has('action')).toBe(false);
  expect(button.dataset.krdsState).toBe('disabled');
  setDisabled(false);
  expect(button.disabled).toBe(false);
  expect(button.dataset.krdsState).toBe('');
});

test('invalid presentation options and missing accessible action names are configuration errors', () => {
  expect(() => render(() => <Button variant="unknown">실행</Button>)).toThrow(TypeError);
  expect(() => render(() => <Button size="unknown">실행</Button>)).toThrow(TypeError);
  expect(() => render(() => <Button />)).toThrow(TypeError);
});

// A decorative glyph must never silently become the action's accessible name.
test('decorative icons require an explicit accessible action name', () => {
  expect(() => render(() => <Button icon={<span>×</span>} />)).toThrow(TypeError);
  expect(() => render(() => <Button><span aria-hidden="true">×</span></Button>)).toThrow(TypeError);
  const view = render(() => <Button aria-label="닫기" icon={<span>×</span>} />);
  expect(view.getByRole('button', { name: '닫기' })).toBeVisible();
});

test('accepts a native action name from a local image text alternative', () => {
  const localAsset = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const view = render(() => <Button><img src={localAsset} alt="저장" /></Button>);
  expect(view.getByRole('button', { name: '저장' })).toHaveAccessibleName('저장');
});

test('accepts a native action name from a named image-role child', () => {
  const view = render(() => <Button><span role="img" aria-label="저장" /></Button>);
  expect(view.getByRole('button', { name: '저장' })).toHaveAccessibleName('저장');
});
