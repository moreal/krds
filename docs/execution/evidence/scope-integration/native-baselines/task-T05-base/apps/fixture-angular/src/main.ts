/** T01 toolchain probe only; no component coverage. */
import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { WorkspaceProbe } from '@krds-native/angular';
void bootstrapApplication(WorkspaceProbe);
