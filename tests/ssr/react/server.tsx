import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import App from './App';
export function render(){return {body:renderToString(createElement(App)),head:''};}
