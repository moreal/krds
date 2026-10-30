import {renderToString} from 'solid-js/web';
import {KrdsProvider} from '@unofficial-krds/solid';
import {getPresentation,type PatternId} from '@unofficial-krds/test-contracts/patterns';
import {PatternPresentation} from './presentation';
export function renderPresentationSnapshot(patternId:PatternId,variant:string){return renderToString(()=><KrdsProvider locale="ko-KR"><PatternPresentation state={getPresentation(patternId,variant).state} onAction={()=>{}}/></KrdsProvider>);}
