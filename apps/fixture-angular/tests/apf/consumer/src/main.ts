import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { ConsumerApplication } from './app';
void bootstrapApplication(ConsumerApplication, { providers: [provideZonelessChangeDetection(), provideClientHydration()] }).then(application => {
    (globalThis as typeof globalThis & {
        __CONSUMER_APPLICATION__?: unknown;
    }).__CONSUMER_APPLICATION__ = application;
});
