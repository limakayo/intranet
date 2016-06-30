import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
//import { Router } from '@angular/router-deprecated';

import { Cliente } from '../shared/cliente.model';
import { ClienteService } from '../shared/cliente.service';
import { SearchPipe } from '../../shared/search-pipe';
import { SearchBox } from '../../shared/search-box';

import { ClienteDetailComponent } from '../cliente-detail/cliente-detail.component';

import { Observer } from 'rxjs/Observer';

@Component({
	selector: 'intranet-cliente-list',
	moduleId: module.id,
	templateUrl: 'cliente-list.component.html',
	pipes: [SearchPipe],
	providers: [
		ClienteService
	],
	directives: [ClienteDetailComponent, SearchBox]
})

export class ClienteListComponent implements OnInit {

	clientes: Cliente[];
	selectedCliente: Cliente = null;
	errorMessage: string;
	successMessage: string;
	term: string;

	constructor(
		private clienteService: ClienteService,
		private router: Router) { }

	ngOnInit() {
		this.getClientes();
	}

	myValueChange(event: any) {
		this.term = event;
	}

	goToDetail(cliente: Cliente) {
		this.selectedCliente = cliente;
		//this.router.navigate(['/cliente', cliente._id]);
		this.router.navigate(['cliente', { id: cliente._id }]);
	}

	getClientes() {
		this.clienteService.getClientes()
			.subscribe(
				clientes => this.clientes = clientes,
				error => this.errorMessage = <any>error
			);
	}

	addCliente (nome: string) {
		if (!nome) { return; }
		this.clienteService.addCliente(nome)
			.subscribe(
				data => {
					if (data.cliente) {
							this.clientes = [...this.clientes, data.cliente]
							this.errorMessage = null
					} else {
							this.errorMessage = data.message
							setTimeout(() => {
								this.errorMessage = null
							}, 2000)
					}
				},
				error => this.errorMessage = <any>error
			);
	}

	delete(cliente: Cliente, event: any) {
		event.stopPropagation();
		this.clienteService.delete(cliente).subscribe(
			data => {
				this.successMessage = data.message
				setTimeout(() => {
					this.successMessage = null
				}, 2000)
				this.clientes = this.clientes.filter(c => c._id !== cliente._id)
			},
			error => this.errorMessage = <any>error
		);
	}

}
