import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/base.css';
import '@unofficial-krds/styles/button.css';
import './preview.css';
import {createPreviewHost} from '../../../../tools/docs-previews/host';
import {mountLitExample} from './examples';
const root=document.getElementById('preview-root')!;
const host=createPreviewHost({framework:'lit',root});
const params=new URLSearchParams(location.search);
/** Local in-frame destination for example links (`/local/<name>`): visible deterministic route content. */
function showRoute(route:string){
 const view=document.createElement('section');view.dataset.routeView=route;
 const heading=document.createElement('h1');heading.textContent='로컬 예제 목적지';
 const name=document.createElement('p');name.textContent='이동한 화면: '+route;
 const back=document.createElement('a');const home=new URLSearchParams(location.search);home.delete('route');back.href=`${location.pathname}?${home}`;back.textContent='예제로 돌아가기';
 view.append(heading,name,back);root.append(view);
}
try {
 if(params.get('example')!=='default')throw Error('Unknown example');
 const component=params.get('component')??'';
 const route=params.get('route');
 if(route){showRoute(route);host.ready();}
 else{
  const mounted=mountLitExample(root,component);
  await mounted.element.updateComplete;
  host.ready();
  window.addEventListener('pagehide',()=>{mounted.dispose();host.dispose();},{once:true});
 }
} catch(error){root.textContent='지원하지 않는 예제입니다. '+String(error);host.error(String(error));}
