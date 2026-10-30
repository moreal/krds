import {renderToString, generateHydrationScript} from '@solidjs/web';
import App from './App';
export function render(){return {body:renderToString(()=><App/>),head:generateHydrationScript()};}
