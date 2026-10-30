/** Evidence failure must never replace an already observed native failure. */
export async function attachComponentEventEvidence(info,evidence,{behaviorFailed=false,extraArtifacts=[]}={}){
  try{
    const result=await evidence.finalize();
    await info.attach('actual-component-events.json',{body:JSON.stringify(result.events),contentType:'application/json'});
    await info.attach('component-event-ledger.json',{body:JSON.stringify(result),contentType:'application/json'});
    for(const artifact of extraArtifacts)await info.attach(artifact.name,{body:JSON.stringify(artifact.value),contentType:'application/json'});
    return {complete:true,evidence:result};
  }catch(error){
    const incomplete={complete:false,error:String(error),observedSnapshots:null,extraArtifacts};
    try{incomplete.observedSnapshots=evidence.observedSnapshots();}
    catch(snapshotError){incomplete.snapshotError=String(snapshotError);}
    try{await info.attach('component-event-ledger-error.json',{body:JSON.stringify(incomplete),contentType:'application/json'});}
    catch(attachmentError){
      incomplete.attachmentError=String(attachmentError);
      process.stderr.write('KRDS incomplete event evidence: '+JSON.stringify(incomplete)+'\n');
    }
    if(!behaviorFailed)throw error;
    return incomplete;
  }
}
