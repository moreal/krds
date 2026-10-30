/** One consumed timeout per meaningful, actually rendered notification generation. */
export class Exposure {
 generation=0;private key='';private timer:ReturnType<typeof setTimeout>|undefined;private remaining:number|null=null;private started=0;private paused=false;private consumed=false;
 update(key:string,duration:number|null):boolean{if(key===this.key)return false;this.cancel();this.key=key;this.generation++;this.remaining=duration;this.consumed=false;return true;}
 reconcile(paused:boolean,request:(generation:number)=>void):void{if(paused){if(this.timer!==undefined){clearTimeout(this.timer);this.timer=undefined;this.remaining=Math.max(0,(this.remaining??0)-(Date.now()-this.started));}this.paused=true;return;}this.paused=false;if(this.timer!==undefined||this.remaining===null||this.consumed||!this.key)return;this.started=Date.now();const generation=this.generation;this.timer=setTimeout(()=>{this.timer=undefined;if(generation!==this.generation||this.paused||this.consumed)return;this.consumed=true;request(generation);},this.remaining);}
 cancel():void{if(this.timer!==undefined)clearTimeout(this.timer);this.timer=undefined;}
 dispose():void{this.cancel();this.generation++;this.key='';}
}
