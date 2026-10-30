import {readFile} from 'node:fs/promises';

export async function readNavigationLedger(path){
  const text=await readFile(path,'utf8');
  // A reader can race one append. Only complete newline-terminated records
  // count; a malformed completed record still fails rather than being ignored.
  return text.split('\n').slice(0,-1).filter(Boolean).map(line=>JSON.parse(line));
}
export function requireNavigationReceipt(records,{afterSequence,actionStartedAt,expectedUrl,snapshot}){
  const url=new URL(expectedUrl);
  if(!url.pathname.startsWith('/local/'))throw new Error('Navigation evidence must be an explicit local document');
  const candidates=records.filter(row=>row.sequence>afterSequence&&row.startedAt>=actionStartedAt&&row.url===expectedUrl&&row.method==='GET'&&
    (row.destination==='document'||(row.destination===null&&row.accept?.includes('text/html'))));
  const receipt=candidates.sort((a,b)=>a.sequence-b.sequence)[0];
  if(!receipt)throw new Error('No actual local document response after this native action');
  if(receipt.status!==200)throw new Error(`Native local navigation returned ${receipt.status}, not 200`);
  if(!receipt.contentType?.startsWith('text/html'))throw new Error('Native local navigation did not serve HTML');
  const asset=snapshot.files.find(file=>file.path===receipt.asset);
  if(!receipt.asset?.startsWith('/local/')||!asset||receipt.bodySha256!==asset.sha256||receipt.artifactSha256!==snapshot.sha256)throw new Error('Native navigation served-byte hash does not match the immutable selected artifact');
  return receipt;
}

export async function navigationLedgerState(env=process.env){
  if(!env.KRDS_NAVIGATION_LEDGER&&!env.KRDS_NAVIGATION_SNAPSHOT)return null;
  if(!env.KRDS_NAVIGATION_LEDGER||!env.KRDS_NAVIGATION_SNAPSHOT)throw new Error('Complete native navigation ledger/snapshot binding required');
  const records=await readNavigationLedger(env.KRDS_NAVIGATION_LEDGER);
  return {path:env.KRDS_NAVIGATION_LEDGER,afterSequence:Math.max(0,...records.map(row=>row.sequence)),snapshot:JSON.parse(await readFile(env.KRDS_NAVIGATION_SNAPSHOT,'utf8'))};
}
