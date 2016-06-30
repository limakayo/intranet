import { Component, OnInit } from '@angular/core';
import { AutoComplete } from 'primeng/primeng';
import { ClienteService } from '../../clientes/shared/cliente.service';
import { OrdemService } from '../shared/ordem.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
      
@Component({
	moduleId: module.id,
	selector: 'saida',
	templateUrl: 'saida.component.html',
	providers: [ ClienteService, OrdemService ],
	directives: [ AutoComplete, ROUTER_DIRECTIVES ]
})
export class SaidaComponent implements OnInit {
	cliente: any;
	clientes: any[];
	filteredClientes: any[];

	ordens: any[];

	constructor(
		private clienteService: ClienteService,
		private ordemService: OrdemService) { }

	ngOnInit() { }

	changeCliente(cliente:any) {
		this.cliente = cliente;
		this.ordemService.getSaidasCliente(cliente._id).subscribe(
			ordens => this.ordens = ordens
		);
	}

	search(event: any) {
		let query = event.query;
		this.clienteService.getClientes().subscribe(
			clientes => this.filteredClientes = this.filterCliente(query, clientes)
		);
	}

	filterCliente(query: any, clientes: any[]): any[] {
		let filtered: any[] = [];
		if (clientes) {
			for (let cliente of clientes) {
				if (cliente.nome.toLowerCase().indexOf(query.toLowerCase()) > -1) {
					filtered.push(cliente);
				}
			}
		}
		return filtered;
	}
	
	onEntregueChange(ordem: any) {
		if (ordem.entregue) {
			ordem.data_hora_entregue = new Date;
			ordem.andamento = 'Entregue';
		} else {
			ordem.data_hora_entregue = null;
			ordem.andamento = 'Fechada';
		}
		this.ordemService.editOrdem(ordem).subscribe(
			ordem => {
				console.log(ordem);
			}
		)
	}

}