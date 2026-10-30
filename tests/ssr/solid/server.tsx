import {renderToString, generateHydrationScript} from 'solid-js/web';
import App from './App';
export function render(){return {body:renderToString(()=><App/>),head:generateHydrationScript()};}
