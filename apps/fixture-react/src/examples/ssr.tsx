import {renderToString} from 'react-dom/server';
import {getPresentation,presentationCases} from '@unofficial-krds/test-contracts/patterns';
import {PatternPresentation} from '../../../../packages/react/examples/patterns/PatternPresentation';
import {patternContent} from './content';
export function renderPatternSnapshots() {return presentationCases.map(item=>({id:item.id,html:renderToString(<PatternPresentation state={getPresentation(item.patternId,item.variant).state} content={patternContent}/>)}));}
