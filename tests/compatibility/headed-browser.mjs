import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../../package.json',import.meta.url));
const {chromium}=require('playwright');
/** A fresh selected browser, never the user's profile. The public noDefaults
 * attachment leaves actual page visibility/focus under the native browser.
 * New browser contexts would re-enable Playwright focus emulation: use context.
 */
export async function launchSelectedHeadedChromium({backgroundingDefaults=true}={}){
 const profile=await mkdtemp(join(tmpdir(),'krds-native-visibility-'));
 const backgroundArgs=['--disable-background-timer-throttling','--disable-backgrounding-occluded-windows','--disable-renderer-backgrounding'];
 const args=['--remote-debugging-port=0','--remote-debugging-address=127.0.0.1',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-default-apps','--disable-extensions','--use-mock-keychain','--password-store=basic',...(backgroundingDefaults?backgroundArgs:[]),'about:blank'];
 const executable=chromium.executablePath(),child=spawn(executable,args,{stdio:['ignore','pipe','pipe']});const logs=[];let closed=false;child.once('close',()=>{closed=true;});let browser;
 try{
  const endpoint=await new Promise((resolve,reject)=>{let timer;const done=(error,value)=>{clearTimeout(timer);error?reject(error):resolve(value);};timer=setTimeout(()=>done(new Error('Selected headed browser emitted no CDP endpoint in 15 seconds')),15000);child.once('error',error=>done(error));child.once('close',(code,signal)=>done(new Error(`Selected headed browser exited ${code}/${signal}`)));for(const stream of[child.stdout,child.stderr])stream.on('data',chunk=>{logs.push(String(chunk));const match=logs.join('').match(/DevTools listening on (ws:\/\/[^\s]+)/);if(match)done(null,match[1]);});});
  browser=await chromium.connectOverCDP(endpoint,{noDefaults:true,isLocal:true,timeout:15000});const context=browser.contexts()[0];if(!context)throw new Error('Native default browser context is unavailable');
  return {browser,context,executable,args,logs,async cleanup(){try{if(browser.isConnected()){const session=await browser.newBrowserCDPSession();await session.send('Browser.close').catch(()=>{});}}finally{await browser.close().catch(()=>{});if(!closed)child.kill('SIGTERM');if(!closed)await new Promise(resolve=>{const timer=setTimeout(resolve,2000);child.once('close',()=>{clearTimeout(timer);resolve();});});await rm(profile,{recursive:true,force:true});}}};
 }catch(error){await browser?.close().catch(()=>{});if(!closed)child.kill('SIGTERM');await rm(profile,{recursive:true,force:true});throw error;}
}
