import { html } from 'lit';
import { KrdsElement } from '../base.js';
export class Masthead extends KrdsElement {
    static override properties = { governmentService: { type: Boolean, attribute: 'government-service' } };
    declare governmentService: boolean;
    constructor() { super(); this.governmentService = false; }
    override render() { return html `<div data-krds-component="masthead" data-krds-part="root" data-krds-state="" part="root">${this.governmentService ? html`<p data-krds-component="masthead" data-krds-part="text" data-krds-state="" part="text">이 누리집은 대한민국 공식 전자정부 누리집입니다.</p>` : ''}</div>`; }
}
