import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { AuthService } from './shared/auth.service';

import { tokenNotExpired } from 'angular2-jwt';

@Component({
    selector: 'my-app',
    moduleId: module.id,
    templateUrl: 'app.component.html',
    directives: [ ROUTER_DIRECTIVES ],
    providers: [ AuthService ]
})

export class AppComponent implements OnInit {
	constructor(private auth: AuthService) {}

	ngOnInit() {
		if (tokenNotExpired()) this.getUser();
	}

	getUser() {
    this.auth.getUser().subscribe(
      data => {
        if (data.app_metadata.roles[0] == "admin")
            this.auth.userIsAdmin = true
        }
    );
  }
}
