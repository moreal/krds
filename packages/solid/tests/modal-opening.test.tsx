import { expect, test } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { Modal } from '../src';
test('pointer opener wins over an unrelated prior focused control in WebKit', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    const [open, setOpen] = createSignal(false);
    const dispose = render(() => <><button id="unrelated">Prior focus</button><button id="opening" onClick={() => setOpen(true)}>Open regression</button><Modal title="Regression" open={open()} onOpenChange={({ open }) => setOpen(open)}><button onClick={() => setOpen(false)}>Done regression</button></Modal></>, host);
    try {
        host.querySelector<HTMLButtonElement>('#unrelated')!.focus();
        await userEvent.click(page.getByRole('button', { name: 'Open regression' }));
        await userEvent.click(page.getByRole('button', { name: 'Done regression' }));
        expect(document.activeElement).toBe(host.querySelector('#opening'));
    }
    finally {
        dispose();
        host.remove();
    }
});
