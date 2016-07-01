"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
//import { disableDeprecatedForms, provideForms } from '@angular/forms';
var app_component_1 = require('./app.component');
var app_routes_1 = require('./app.routes');
var http_1 = require('@angular/http');
var common_1 = require('@angular/common');
var angular2_jwt_1 = require('angular2-jwt');
require('rxjs/add/observable/throw');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [
    app_routes_1.APP_ROUTER_PROVIDERS,
    http_1.HTTP_PROVIDERS,
    angular2_jwt_1.AUTH_PROVIDERS,
    common_1.FORM_PROVIDERS
]).catch(function (err) { return console.error(err); });
//# sourceMappingURL=main.js.map