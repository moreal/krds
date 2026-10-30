import '@angular/compiler';
import '@testing-library/jest-dom/vitest';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import '@testing-library/angular';
import { afterEach } from 'vitest';
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
afterEach(() => TestBed.resetTestingModule());
