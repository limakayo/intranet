import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AuthHttp } from 'angular2-jwt';

import { Observable }		from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { tokenNotExpired } from 'angular2-jwt';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  private usersUrl = 'http://192.168.0.109:8000/api/users';

  lock = new Auth0Lock('MxDo1msOA6oBtY7IYmQTMHnQ6YsU3x2a', 'limakayo.auth0.com');

  user: Object;
  zoneImpl: NgZone;
  userRole: string;
  userIsAdmin: boolean = false;
  userIsTecnico: boolean = false;

  constructor(zone: NgZone, private router: Router, private authHttp: AuthHttp) {
    this.zoneImpl = zone;
    this.user = JSON.parse(localStorage.getItem('profile'));
  }

  public addUser(user:any) {
    let body = JSON.stringify({ user });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return this.authHttp.post(this.usersUrl, body, options)
						.map(this.extractData)
						.catch(this.handleError);
  }

  public getUser() {
    return this.authHttp.get(this.usersUrl)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public isAdmin() {
    return this.userIsAdmin;
  }

  public isTecnico() {
    return this.userIsTecnico;
  }

  public login() {
    this.lock.show({
      authParams: {
        scope: 'openid app_metadata email name nickname'
      }
    }, (err: string, profile: Object, token: string) => {
      if (err) {
        console.log(err);
        return;
      }

      localStorage.setItem('profile', JSON.stringify(profile));
      localStorage.setItem('id_token', token);

      this.zoneImpl.run(() => this.user = profile);

      this.addUser(this.user).subscribe(
        data => {
          if (data.localeCompare('admin') == 0)
            this.userIsAdmin = true
        }
      );

      this.router.navigate(['']);
    })
  }

  public logout() {
    localStorage.removeItem('profile');
    localStorage.removeItem('id_token');
    this.zoneImpl.run(() => this.user = null);
    this.userIsAdmin = false;
    this.userIsTecnico = false;
    this.router.navigate(['']);
  }

  public loggedIn() {
    return tokenNotExpired();
  }
  
  private extractData(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Bad response status: ' + res.status);
		}
		let body = res.json();
		return body || {};
	}

	private handleError(error:any) {
		console.log(error.message);
		let errMsg = error.message || 'Server error';
		console.error(errMsg);
		return Observable.throw(errMsg);
	}
}
