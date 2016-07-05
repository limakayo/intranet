import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

import { Observable }    from 'rxjs/Observable';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
  	private auth: AuthService,
  	private router: Router) {}

  canActivate(next:  ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.userIsAdmin;
  }
}
