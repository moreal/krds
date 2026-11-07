import {afterEach,expect,test,vi} from 'vitest';
import {mount,unmount,tick} from 'svelte';
import {FileUpload} from '@unofficial-krds/svelte';
import {userEvent} from 'vitest/browser';
import '@unofficial-krds/styles/all.css';
const cleanup:(()=>unknown)[]=[];
afterEach(async()=>{for(const callback of cleanup.splice(0))await callback();});
test('FileUpload: native file input is visually hidden but stays labelled, focusable and form-associated; only the KRDS picker is visible',async()=>{
 const form=document.createElement('form');form.id='upload-form';document.body.append(form);
 const host=document.createElement('div');document.body.append(host);
 const app=mount(FileUpload,{target:host,props:{label:'첨부 파일',name:'attachments',form:'upload-form',files:[],onFilesChange:vi.fn()}});
 cleanup.push(async()=>{await unmount(app);host.remove();form.remove();});await tick();
 const input=host.querySelector<HTMLInputElement>('[data-krds-component="file-upload"][data-krds-part="file-input"]')!;
 const picker=host.querySelector<HTMLButtonElement>('[data-krds-component="file-upload"][data-krds-part="picker"]')!;
 // Exactly one visible file-choosing control: the KRDS picker.
 const inputBox=input.getBoundingClientRect();
 expect(inputBox.width*inputBox.height,'native file input renders no visible control').toBeLessThanOrEqual(1);
 expect(getComputedStyle(input).clipPath).not.toBe('none');
 const pickerBox=picker.getBoundingClientRect();expect(pickerBox.width).toBeGreaterThan(1);expect(pickerBox.height).toBeGreaterThan(1);
 expect(document.elementFromPoint(pickerBox.left+pickerBox.width/2,pickerBox.top+pickerBox.height/2)).toBe(picker);
 // Accessibility and form participation are preserved.
 expect(input.labels?.[0]?.textContent).toBe('첨부 파일');expect(input.form).toBe(form);
 expect(getComputedStyle(input).display).not.toBe('none');expect(getComputedStyle(input).visibility).toBe('visible');
 input.focus();expect(document.activeElement).toBe(input);
});
test('FileUpload: the visible picker is the single keyboard/AT file control and opens the native chooser',async()=>{
 const before=document.createElement('button');before.textContent='before';document.body.append(before);
 const host=document.createElement('div');document.body.append(host);
 const app=mount(FileUpload,{target:host,props:{label:'첨부 파일',files:[],onFilesChange:vi.fn()}});
 cleanup.push(async()=>{await unmount(app);host.remove();before.remove();});await tick();
 const input=host.querySelector<HTMLInputElement>('[data-krds-component="file-upload"][data-krds-part="file-input"]')!;
 const picker=host.querySelector<HTMLButtonElement>('[data-krds-component="file-upload"][data-krds-part="picker"]')!;
 expect(input.tabIndex).toBe(-1);expect(input.getAttribute('aria-hidden')).toBe('true');
 expect(getComputedStyle(picker).outlineStyle).toBe('none');
 before.focus();await userEvent.tab();
 expect(document.activeElement).toBe(picker);expect(picker.matches(':focus-visible')).toBe(true);
 expect(getComputedStyle(picker).outlineStyle).toBe('solid');expect(parseFloat(getComputedStyle(picker).outlineWidth)).toBeGreaterThan(0);
 let opened=0;input.click=()=>{opened++;};
 await userEvent.keyboard('{Enter}');await userEvent.keyboard(' ');
 expect(opened).toBe(2);
});
