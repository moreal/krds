/** Browser-only native behavior harness, separate from public library code and stories. */
import '@unofficial-krds/tokens/tokens.css';
import { LitElement, html } from 'lit';
import { registerKrdsElements, machineProps } from '@unofficial-krds/lit';
registerKrdsElements(customElements);
class DirectiveHarness extends LitElement {
    static override properties = { props: { attribute: false } };
    declare props: Record<string, unknown>;
    constructor() { super(); this.props = {}; }
    override render() { return html `<button ${machineProps(this.props)}>Directive action</button>`; }
}
customElements.define('krds-directive-harness', DirectiveHarness);
