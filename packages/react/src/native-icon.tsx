/** Independently drawn geometric UI icons; decorative names remain on their controls. */
export function NativeIcon({name}:{name:string}) {
  switch(name){
    case 'information': case 'info': return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 10v7M12 6v2" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
    case 'plus': case '+': return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
    case 'home': case '⌂': return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
    case 'document': case '▤': return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M5 2h9l5 5v15H5ZM14 2v6h5M8 12h8M8 16h8" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
    case 'person': case '○': return <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M4 22v-3a8 8 0 0 1 16 0v3" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
    default:return <span aria-hidden="true">{name}</span>;
  }
}
