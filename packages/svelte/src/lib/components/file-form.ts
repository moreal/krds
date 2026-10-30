import type { FileRecord } from '@unofficial-krds/contracts';
interface Entry { input: HTMLInputElement; read: () => {name:string;disabled?:boolean;files:readonly FileRecord[]}; }
const owners = new WeakMap<HTMLFormElement, {entries:Set<Entry>; listener:(event:FormDataEvent)=>void}>();
/** One native submission owner per form. Pickers are unnamed; committed records append without deleting other controls. */
export function registerFileField(input:HTMLInputElement,read:Entry['read']) {
    const form=input.form;if(!form)return()=>{};
    let owner=owners.get(form);
    if(!owner){
        const entries=new Set<Entry>();
        const listener=(event:FormDataEvent)=>{
            const ordered=[...entries].sort((a,b)=>a.input===b.input?0:a.input.compareDocumentPosition(b.input)&4?-1:1);
            for(const entry of ordered){const state=entry.read();if(!entry.input.isConnected||entry.input.form!==form||state.disabled||entry.input.matches(':disabled'))continue;for(const record of state.files)event.formData.append(state.name,record.file,record.file.name);}
        };
        owner={entries,listener};owners.set(form,owner);form.addEventListener('formdata',listener);
    }
    const entry={input,read};owner.entries.add(entry);
    return()=>{owner!.entries.delete(entry);if(!owner!.entries.size){form.removeEventListener('formdata',owner!.listener);owners.delete(form);}};
}
