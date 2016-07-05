import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AuthHttp } from 'angular2-jwt';

import { Observable }		from 'rxjs/Observable';

@Injectable()
export class AndamentoService {
  private url = 'http://192.168.0.109:8000/api/andamentos';

  constructor(private authHttp: AuthHttp) { }

  getAndamentos() {
    return this.authHttp.get(this.url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    console.log(error.message);
    let errMsg = error.message || 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
