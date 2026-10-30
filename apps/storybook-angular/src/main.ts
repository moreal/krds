import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
@Component({ selector: 'krds-storybook-app', standalone: true, template: '<h1>Angular native Storybook</h1>' })
class StorybookApplication {}
void bootstrapApplication(StorybookApplication);
