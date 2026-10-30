import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { VanillaMachine, normalizeProps } from '@zag-js/vanilla';
import type { Machine, MachineSchema, Service } from '@zag-js/core';
export interface MachineBridge<P, A> {
    start(): void;
    update(props: P): void;
    getApi(): A;
    subscribe(listener: () => void): () => void;
    stop(): void;
}
/** The official Vanilla interpreter owns service effects; Lit owns rendering. */
export class ZagController<T extends MachineSchema, A> implements ReactiveController, MachineBridge<Partial<T['props']>, A> {
    private service?: VanillaMachine<T>;
    private unsubscribe?: () => void;
    private listeners = new Set<() => void>();
    private props: Partial<T['props']>;
    constructor(private host: ReactiveControllerHost, private machine: Machine<T>, props: Partial<T['props']>, private connect: (service: Service<T>, normalize: typeof normalizeProps) => A) {
        this.props = props;
        host.addController(this);
    }
    hostConnected() { this.host.requestUpdate(); }
    hostUpdated() { if ((this.host as ReactiveControllerHost & {
        isConnected?: boolean;
    }).isConnected !== false && !this.service)
        this.start(); }
    hostDisconnected() { this.stop(); }
    start() {
        if (this.service)
            return;
        this.service = new VanillaMachine(this.machine, this.props);
        this.unsubscribe = this.service.subscribe(() => { this.host.requestUpdate(); for (const listener of this.listeners)
            listener(); });
        this.service.start();
        this.host.requestUpdate();
    }
    update(props: Partial<T['props']>) { this.props = props; this.service?.updateProps(props); }
    getApi(): A { if (!this.service)
        throw new Error('Machine has not started'); return this.connect(this.service.service, normalizeProps); }
    get active() { return !!this.service; }
    subscribe(listener: () => void) { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; }
    stop() { this.unsubscribe?.(); this.unsubscribe = undefined; this.service?.stop(); this.service = undefined; }
}
