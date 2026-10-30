import type { Component, Snippet } from 'svelte';
import type { FileUploadContract } from '@unofficial-krds/contracts';
export type FileUploadProps = FileUploadContract & { form?:string; variant?:"button"|"dropzone" };
declare const component: Component<FileUploadProps>;
export default component;
