const presentations=new WeakMap<Document,Map<object,{startId:string;root:HTMLElement}>>();
export function registerCoach(document:Document,key:object,startId:string,root:HTMLElement):void{let map=presentations.get(document);if(!map){map=new Map();presentations.set(document,map);}map.set(key,{startId,root});}
export function unregisterCoach(document:Document,key:object):void{presentations.get(document)?.delete(key);}
export function hasActiveCoach(document:Document,startId:string):boolean{return [...presentations.get(document)?.values()??[]].some(item=>item.startId===startId&&item.root.isConnected);}
