import assert from 'node:assert/strict';
export function validateVisibilityObservations(observations){
 const phases=[['first-foreground',false],['first-behind-second-real-tab',true],['first-restored-real-tab',false],['first-native-window-minimized',true],['first-native-window-restored',false]];
 assert.equal(observations.length,phases.length+1,'Incomplete native visibility observations');
 assert.equal(new Set(observations.map(row=>row.label)).size,observations.length,'Duplicate visibility observations');
 let previousEvents=0;
 for(const [index,[label,hidden]]of phases.entries()){
  const row=observations.find(row=>row.label===label);assert.ok(row,`Missing visibility phase: ${label}`);assert.equal(row.hidden,hidden,`Wrong hidden state: ${label}`);assert.equal(row.visibilityState,hidden?'hidden':'visible',`Wrong visibility state: ${label}`);assert.equal(row.focused,!hidden,`Wrong native focus: ${label}`);assert.ok(Array.isArray(row.events),`Missing natural events: ${label}`);
  if(index>0){const added=row.events.slice(previousEvents);assert.ok(added.some(event=>event.hidden===hidden&&event.state===(hidden?'hidden':'visible')),`Missing natural visibility transition: ${label}`);}
  for(const event of row.events)assert.equal(event.state,event.hidden?'hidden':'visible','Contradictory natural visibility event');previousEvents=row.events.length;
 }
 const bounds=observations.find(row=>row.label==='actual-window-bounds-minimized');assert.equal(bounds?.bounds?.windowState,'minimized','Native window did not reach minimized bounds');
}
export function validateVisibilityResults(results){
 assert.equal(results.length,2,'Both backgrounding configurations must execute');assert.deepEqual(results.map(row=>row.backgroundingDefaults).sort(),[false,true]);
 for(const row of results){assert.equal(row.status,'real-hidden-state-observed','Visibility capability unavailable or failed');validateVisibilityObservations(row.observations);}
}
