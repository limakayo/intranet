import { bootstrap }    from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

import { AppComponent } from './app.component';

import { APP_ROUTER_PROVIDERS } from './app.routes';
import { HTTP_PROVIDERS } from '@angular/http';
import { FORM_PROVIDERS } from '@angular/common';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

bootstrap(AppComponent, [
	disableDeprecatedForms(),
	provideForms(),
	APP_ROUTER_PROVIDERS,
	HTTP_PROVIDERS,
	AUTH_PROVIDERS,
	FORM_PROVIDERS
]).catch(err => console.error(err));