import { Component, Injector, OnInit } from '@angular/core';
//import { Router, CanActivate } from '@angular/router-deprecated';
import { tokenNotExpired } from 'angular2-jwt';

import { AuthService } from '../shared/auth.service';
import { appInjector } from '../shared/injector';

@Component({
  moduleId: module.id,
  selector: 'intranet-admin',
  template: `
    <h2>Admin</h2>
    <p>This is an admin area.</p>
    <h3>User details:</h3>
    <label>Role:</label> <span *ngIf="user">{{ user.app_metadata.roles[0] }}</span>
  `,
})

export class AdminComponent implements OnInit {
  constructor(private auth:AuthService){}

  user: Object;

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.auth.getUser().subscribe(
      user => this.user = user
    )
  }
}
