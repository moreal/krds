import type { DemoRegistryEntry } from '../../../tools/docs-previews/contract';
export function resolveDemoSelection<T extends Pick<DemoRegistryEntry,'framework'|'exampleId'>>({query='',sessionFramework,records}:{query?:string;sessionFramework?:string|null;records:T[]}):T {
 const params=new URLSearchParams(query);
 const valid=(value:string|null|undefined)=>records.some(record=>record.framework===value);
 const framework=valid(params.get('framework'))?params.get('framework'):valid(sessionFramework)?sessionFramework:'solid';
 const choices=records.filter(record=>record.framework===framework);
 return choices.find(record=>record.exampleId===params.get('example'))??choices.find(record=>record.exampleId==='default')??choices[0]??records.find(record=>record.exampleId==='default')??records[0]!;
}
