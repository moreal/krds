/** Structural example inputs. No model, local driver, router or fixture protocol dependency. */
export type Destination = 'overview'|'form'|'search'|'consent'|'accessibility'|'privacy';
export type Field = 'title'|'category'|'detail';
export type Category = 'all'|'guide'|'example'|'reference';
interface Common {phase:string;error:string|null}
export interface FormView extends Common {patternId:'form-errors';values:Record<Field,string>;errors:{field:Field;targetId:string;errorId:string;message:string}[];receipt:({id:string}&Record<Field,string>)|null}
export interface SearchView extends Common {patternId:'search-results';query:string;appliedQuery:string;category:Category;page:number;pageCount:number;total:number;items:{id:string;title:string;category:string;summary:string;date:string}[]}
export interface ConsentView extends Common {patternId:'consent-confirmation';requiredChoice:boolean|null;optionalChoice:boolean;modalOpen:boolean;receipt:{id:string;requiredChoice:boolean|null;optionalChoice:boolean}|null}
export interface LayoutView extends Common {patternId:'service-layout';currentId:Destination;expandedIds:string[];mobileOpen:boolean}
export type PatternView = FormView|SearchView|ConsentView|LayoutView;
export type Interaction = {type:'field';field:Field;value:string}|{type:'error-link';field:Field}|{type:'submit'|'retry'|'reset'|'search'|'review'|'confirm'|'close'}|{type:'query';value:string}|{type:'filter';category:Category}|{type:'page';page:number}|{type:'consent';field:'requiredChoice'|'optionalChoice';value:boolean}|{type:'expand';id:'examples'|'help';expanded:boolean}|{type:'mobile';open:boolean}|{type:'navigate';id:Destination};
export interface NavigationEntry {id:string;label:string;href?:string;children?:readonly NavigationEntry[]}
export interface PatternContent {
 identity:{name:string;notice:string;dataNotice:string;copyrightText:string};
 formCategories:readonly {value:string;label:string}[];
 resourceCategories:readonly {value:Category;label:string}[];
 consent:readonly {id:'requiredChoice'|'optionalChoice';title:string;required:boolean;paragraphs:readonly string[]}[];
 navigation:readonly NavigationEntry[];
 sections:Readonly<Record<Destination,{title:string;body:string}>>;
}
