import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Button } from '@unofficial-krds/angular/button';
const meta: Meta = { title: 'KRDS/Button', decorators: [moduleMetadata({ imports: [Button] })], args: { label: '저장', disabled: false, size: 'medium' }, render: args => ({ props: args, template: '<button krdsButton [disabled]="disabled" [size]="size">{{label}}</button>' }) };
export default meta;
type Story = StoryObj;
export const Disabled: Story = { args: { disabled: true } };
export const Default: Story = {};
export const Sizes: Story = { render: () => ({ template: '<div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap"><button krdsButton size="xsmall">아주 작게</button><button krdsButton size="small">작게</button><button krdsButton size="medium">보통</button><button krdsButton size="large">크게</button><button krdsButton size="xlarge">아주 크게</button></div>' }) };
