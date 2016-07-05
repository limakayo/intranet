import { Injectable } 		from '@angular/core';
import { Http, Response } 	from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { AuthHttp } from 'angular2-jwt';

import { Cliente } 			from './cliente.model';
import { Observable }		from 'rxjs/Observable';

@Injectable()
export class ClienteService {
	private clientesUrl = 'http://192.168.0.109:8000/api/clientes';

	constructor(private http: Http, private authHttp: AuthHttp) {}

	save(cliente: Cliente) {
		return this.put(cliente);
	}

	getClientes() {
		return this.authHttp.get(this.clientesUrl)
						 .map(this.extractData)
						 .catch(this.handleError);
	}

	addCliente (nome: string) {
		let body = JSON.stringify({ nome });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return this.authHttp.post(this.clientesUrl, body, options)
						.map(this.extractData)
						.catch(this.handleError);
	}

	getCliente (id: string): Observable<Cliente> {
		return this.authHttp.get(this.clientesUrl + '/' + id)
						 .map(this.extractData)
						 .catch(this.handleError);
	}

	getClientesDevedores() {
		return this.authHttp.get(this.clientesUrl + '/devedores')
			.map(this.extractData)
			.catch(this.handleError);
	}

	delete(cliente: Cliente) {
		let headers = new Headers({ 'Content-Type': 'application/json' })
		let url = `${this.clientesUrl}/${cliente._id}`;

		return this.authHttp.delete(url, headers)
						.map(this.extractData)
						.catch(this.handleError);
	}

	put(cliente: Cliente) {
		let url = `${this.clientesUrl}/${cliente._id}`;
		let body = JSON.stringify({ cliente });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return this.authHttp.put(url, body, options)
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

	private handleError(error:any) {
		console.log(error.message);
		let errMsg = error.message || 'Server error';
		console.error(errMsg);
		return Observable.throw(errMsg);
	}

}
