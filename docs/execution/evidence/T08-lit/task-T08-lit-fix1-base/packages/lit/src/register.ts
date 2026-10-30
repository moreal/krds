import { Button } from './components/button/index.js';
import { NativeSelect } from './components/native-select/index.js';
import { Modal } from './components/modal/index.js';
import { Tabs } from './components/tabs/index.js';
import { Calendar } from './components/calendar/index.js';
import { DateInput } from './components/date-input/index.js';
/** Explicit registration only. Importing either public entry defines no elements. */
export function registerKrdsElements(registry: CustomElementRegistry) {
    const prefix = 'krds';
    const definitions = { 'button': Button, 'native-select': NativeSelect, 'modal': Modal, 'tabs': Tabs, 'calendar': Calendar, 'date-input': DateInput };
    for (const [name, constructor] of Object.entries(definitions)) {
        const tag = `${prefix}-${name}`;
        const existing = registry.get(tag);
        if (existing && existing !== constructor)
            throw new Error(`Custom element collision: ${tag}`);
    }
    for (const [name, constructor] of Object.entries(definitions))
        if (!registry.get(`${prefix}-${name}`))
            registry.define(`${prefix}-${name}`, constructor);
}
