import { noChange, type ElementPart } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { directive, PartType, type PartInfo } from 'lit/directive.js';
export type MachineProps = Record<string, unknown>;
/** Element-position spread with reversible attrs/properties/styles/listeners. */
class MachinePropsDirective extends AsyncDirective {
    private element?: HTMLElement;
    private previous: MachineProps = {};
    private listeners = new Map<string, EventListener>();
    constructor(info: PartInfo) {
        super(info);
        if (info.type !== PartType.ELEMENT)
            throw new Error('machineProps requires element position');
    }
    render(_props: MachineProps) { return noChange; }
    override update(part: ElementPart, [props]: [
        MachineProps
    ]) { this.element = part.element as HTMLElement; this.apply(props); return noChange; }
    private apply(props: MachineProps) {
        const el = this.element!;
        for (const key of new Set([...Object.keys(this.previous), ...Object.keys(props)])) {
            const value = props[key];
            if (/^on[a-z]/i.test(key)) {
                const event = key.slice(2).toLowerCase();
                const old = this.listeners.get(event);
                if (old)
                    el.removeEventListener(event, old);
                this.listeners.delete(event);
                if (typeof value === 'function' && this.isConnected) {
                    el.addEventListener(event, value as EventListener);
                    this.listeners.set(event, value as EventListener);
                }
            }
            else if (key === 'style') {
                if (typeof value === 'string')
                    el.style.cssText = value;
                else {
                    el.removeAttribute('style');
                    for (const [name, entry] of Object.entries((value ?? {}) as Record<string, unknown>))
                        if (entry != null) {
                            if (name.startsWith('--') || name.includes('-'))
                                el.style.setProperty(name, String(entry));
                            else
                                (el.style as unknown as Record<string, unknown>)[name] = entry;
                        }
                }
            }
            else if (key.startsWith('.'))
                (el as unknown as Record<string, unknown>)[key.slice(1)] = value;
            else if (['value', 'checked', 'disabled', 'selected', 'tabIndex', 'hidden', 'inert'].includes(key)) {
                (el as unknown as Record<string, unknown>)[key] = value ?? (['value'].includes(key) ? '' : ['tabIndex'].includes(key) ? 0 : false);
            }
            else if (value == null || value === false)
                el.removeAttribute(key);
            else
                el.setAttribute(key === 'className' ? 'class' : key, value === true ? '' : String(value));
        }
        this.previous = { ...props };
    }
    override disconnected() {
        for (const [event, listener] of this.listeners)
            this.element?.removeEventListener(event, listener);
        this.listeners.clear();
    }
    override reconnected() { this.apply(this.previous); }
}
export const machineProps = directive(MachinePropsDirective);
