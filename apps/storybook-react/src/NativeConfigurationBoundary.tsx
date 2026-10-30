import {Component,type ReactNode} from 'react';
/** The fixture records an actual native configuration error, never an expected-name shortcut. */
export class NativeConfigurationBoundary extends Component<{children:ReactNode},{errorName?:string}> {
    state:{errorName?:string}={};
    static getDerivedStateFromError(error:unknown) {
        return {errorName:error instanceof Error?error.name:'Error'};
    }
    render() {
        return this.state.errorName?<p data-krds-host="configuration-error">{this.state.errorName}</p>:this.props.children;
    }
}
