import { bootstrapApplication } from '@angular/platform-browser';
import { FixtureApplication } from './fixture-app';
import {PatternFixtureHost} from './examples/pattern-fixture-host';
void bootstrapApplication(/^\/examples\/(form-errors|search-results|consent-confirmation|service-layout)$/.test(location.pathname)?PatternFixtureHost:FixtureApplication).catch(error => { console.error(error); });
