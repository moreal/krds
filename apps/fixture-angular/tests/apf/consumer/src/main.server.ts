import { bootstrapApplication, provideClientHydration, type BootstrapContext } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideServerRendering, RenderMode, withRoutes } from '@angular/ssr';
import { ConsumerApplication } from './app';
export default (context: BootstrapContext) => bootstrapApplication(ConsumerApplication, { providers: [provideZonelessChangeDetection(), provideClientHydration(), provideServerRendering(withRoutes([{ path: '**', renderMode: RenderMode.Prerender }]))] }, context);
