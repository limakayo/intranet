import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'ordens',
	template: '<router-outlet></router-outlet>',
	directives: [ ROUTER_DIRECTIVES ]
})

export class OrdensComponent {}
