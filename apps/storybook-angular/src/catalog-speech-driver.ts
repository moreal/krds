/** Deliberate local mock: one abortable request lifetime; this never invokes a speech engine. */
export class LocalSpeechDriver{
 private session:AbortController|null=null;private status:'idle'|'playing'|'paused'|'disposed'='idle';
 get state(){return this.status;}get active(){return this.session!==null&&!this.session.signal.aborted;}
 request(action:'play'|'pause'|'resume'|'stop'):void{if(action==='play'){this.session?.abort();this.session=new AbortController();this.status='playing';}else if(action==='pause'&&this.active)this.status='paused';else if(action==='resume'&&this.active)this.status='playing';else if(action==='stop'){this.session?.abort();this.session=null;this.status='idle';}}
 dispose():void{this.session?.abort();this.session=null;this.status='disposed';}
}
