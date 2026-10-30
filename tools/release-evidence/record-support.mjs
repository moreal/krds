export {recipe,inventory,sourceRoots,ref} from './producers.mjs';
export const identicalSnapshot=(before,after)=>JSON.stringify(before)===JSON.stringify(after);
