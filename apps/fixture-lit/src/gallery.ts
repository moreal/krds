import { createLitCatalogExamples } from './examples/catalog.js';
import { html } from 'lit';
const examples = createLitCatalogExamples(customElements);
const main = document.getElementById('app')!;
main.innerHTML = '<h1>Native Lit 54 catalog specimens</h1><p>비공식 독립 로컬 예제 · 실제 Shadow DOM 렌더링</p><button id="example-start" type="button">이용 방법 시작</button><label for="example-main">예제 신청인</label><input id="example-main"><div id="example-after"></div><div id="gallery"></div>';
const style = document.createElement('style');
style.textContent = 'body{margin:0;padding:16px;font:16px/1.6 sans-serif;color:var(--krds-color-text-primary,#1e2124)}#gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}.card{min-inline-size:0;padding:16px;border:1px solid #777;border-radius:8px;overflow-wrap:anywhere}.card h2{margin-block:0 12px;font-size:1.25em}.card img{max-inline-size:100%}button,input{font:inherit}@media(max-width:767px){#gallery{grid-template-columns:minmax(0,1fr)}body{padding:8px}}';
document.head.append(style);
for (const [id, element] of Object.entries(examples)) {
    const section = document.createElement('section');
    section.className = 'card';
    section.dataset.component = id;
    const heading = document.createElement('h2');
    heading.textContent = id;
    section.append(heading);
    const form = document.createElement('form');
    form.addEventListener('submit', event => event.preventDefault());
    form.append(element);
    section.append(form);
    document.getElementById('gallery')!.append(section);
}
examples.modal.body = html `<p>토큰을 상속한 확인 화면</p><button type="button">본문 작업</button>`;
const open = document.createElement('button');
open.type = 'button';
open.textContent = '테마 확인 모달 열기';
open.addEventListener('click', () => examples.modal.requestOpen(true));
document.querySelector('[data-component="modal"]')!.prepend(open);
examples.modal.style.setProperty('--krds-light-color-surface-white', 'rgb(235, 245, 255)');
examples['bottom-sheet'].open = false;
examples['bottom-sheet'].addEventListener('open-change', event => { examples['bottom-sheet'].open = (event as CustomEvent<{
    open: boolean;
}>).detail.open; });
const sheet = document.createElement('button');
sheet.type = 'button';
sheet.textContent = '조건 선택 열기';
sheet.addEventListener('click', () => { examples['bottom-sheet'].open = true; });
document.querySelector('[data-component="bottom-sheet"]')!.prepend(sheet);
document.getElementById('example-start')!.addEventListener('click', () => examples['coach-mark'].start());
