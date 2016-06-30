import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class OrdemService {

	private url = 'http://localhost:8000/api/ordens';

	constructor(private http: Http, private authHttp: AuthHttp) { }

	getCobrancas(id: any) {
		return this.authHttp.get(this.url + '/cobrancas/' + id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getTotalCobrancas() {
		return this.authHttp.get(this.url + '/cobrancas')
			.map(this.extractData)
			.catch(this.handleError);
	}

	getSaidasCliente(id: any) {
		return this.authHttp.get(this.url + '/saidas/' + id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getFechadasCliente(id: any) {
		return this.authHttp.get(this.url + '/fechadas/' + id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getAbertasCliente(id: any) {
		return this.authHttp.get(this.url + '/abertas/' + id)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getOrdens() {
		return this.http.get(this.url)
			.map(this.extractData)
			.catch(this.handleError);
	}

	getAbertas() {
		return this.authHttp.get(this.url + '/abertas')
			.map(this.extractData)
			.catch(this.handleError);
	}

	getAprovadas() {
		return this.authHttp.get(this.url + '/aprovadas')
			.map(this.extractData)
			.catch(this.handleError);
	}

	getReprovadas() {
		return this.authHttp.get(this.url + '/reprovadas')
			.map(this.extractData)
			.catch(this.handleError);
	}

	getGarantias() {
		return this.authHttp.get(this.url + '/garantias')
			.map(this.extractData)
			.catch(this.handleError);
	}

	getAvaliadas() {
		return this.authHttp.get(this.url + '/avaliadas')
			.map(this.extractData)
			.catch(this.handleError);
	}

	getOrdem(numero: string) {
		return this.authHttp.get(this.url + '/' + numero)
			.map(this.extractData)
			.catch(this.handleError);
	}

	addOrdem(form: any) {
		let body = JSON.stringify({ form });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return this.authHttp.post(this.url, body, options)
						.map(this.extractData)
						.catch(this.handleError);
	}

	editOrdem(form: any) {
		let url = `${this.url}/${form._id}`;
		let body = JSON.stringify({ form });
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return this.authHttp.put(url, body, options)
						.map(this.extractData)
						.catch(this.handleError);
	}

	getNextId() {
		let url = this.url + '/next';
		return this.authHttp.get(url)
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
