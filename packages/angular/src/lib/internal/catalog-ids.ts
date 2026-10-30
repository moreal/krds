import {APP_ID,Injectable,inject} from '@angular/core';
/** Per-application ordering is deterministic for SSR and hydration; callers can supply explicit IDs. */
@Injectable({providedIn:'root'})
export class CatalogIds {
 private readonly application=inject(APP_ID);private sequence=0;
 allocate(kind:string):string{return `${this.application}-krds-${kind}-${++this.sequence}`;}
}
