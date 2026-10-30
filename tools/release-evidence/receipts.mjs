/** Lossless, source-bound selected-Node command receipts. */
import {node} from '../../tests/consumers/lib.mjs';
import {captureStep as capture,validateStep} from '../../tests/consumers/evidence.mjs';
import {patternEnvironment} from './patterns.mjs';
export {validateStep};
export function producerEnvironment(root,kind,framework){return kind==='patterns'?patternEnvironment(root,framework):{};}
export const nodeCommand=(root,args,environment={})=>({executable:node,args,cwd:root,...(Object.keys(environment).length?{environment}:{})});
export async function captureStep(name,command,options){
 const saved={};for(const [key,value]of Object.entries(command.environment??{})){saved[key]=process.env[key];process.env[key]=value;}
 try{return await capture(name,command,options);}finally{for(const [key,value]of Object.entries(saved)){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
}
