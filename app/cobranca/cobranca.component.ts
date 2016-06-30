import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

import { ClienteService } from '../clientes/shared/cliente.service';
import { OrdemService } from '../ordens/shared/ordem.service';

import { AutoComplete } from '../shared/autocomplete';

@Component({
	moduleId: module.id,
	selector: 'intranet-cobranca',
	templateUrl: 'cobranca.component.html',
	providers: [ClienteService, OrdemService],
	directives: [AutoComplete, ROUTER_DIRECTIVES],
})
export class CobrancaComponent implements OnInit {

	ordens: any[];
	clientes: any[];
	selectedCliente: any;
	ordem:any;
	total:any = 0;
	totalCobranca:any = 0;
	cobrancas: any[];

	constructor(
		private clienteService: ClienteService,
		private ordemService: OrdemService,
		private router: Router) {}

	ngOnInit() {
		this.clienteService.getClientesDevedores().subscribe(
			clientes => this.clientes = clientes
		)
		this.ordemService.getTotalCobrancas().subscribe(
			cobrancas => {
				this.cobrancas = cobrancas
				for (let cobranca of cobrancas) {
					if (cobranca.valor_total) {
						let valor = parseFloat(cobranca.valor_total.replace(/\./g,'').replace(/,/g,'.'));
						this.totalCobranca += valor;
					}
				}
				this.totalCobranca = this.format(this.totalCobranca, 2, 3, '.', ',');
			}
		)
	}

	onSelectedCliente(selectedCliente:any) {
		this.selectedCliente = selectedCliente;
		if (this.selectedCliente) {
			this.getCobrancas(this.selectedCliente);
		}
	}

	getCobrancas(selectedCliente:any) {
		this.ordemService.getCobrancas(selectedCliente._id).subscribe(
			ordens => {
				this.ordens = ordens;
				this.updateDebito();
			}
		)
	}

	updateDebito() {
		this.total = 0;
		for (let ordem of this.ordens) {
			if ((ordem.forma_pagamento == undefined || ordem.forma_pagamento == "") ||
					(ordem.data_pagamento == undefined || ordem.data_pagamento == "")) {
				if (ordem.valor_total) {
						let valor = parseFloat(ordem.valor_total.replace(/\./g,'').replace(/,/g,'.'));
						this.total += valor;
				}
			}
		}
		this.total = this.format(this.total, 2, 3, '.', ',');
	}

	format(value:any, n:any, x:any, s:any, c:any) {
	    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
	    num = value.toFixed(Math.max(0, ~~n));

	    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
	};


	updateOrdem(ordem:any) {
		this.ordemService.editOrdem(ordem).subscribe(
			ordem => {
				this.ordem = ordem;

				this.ordens = this.ordens.map((o) => {
					if (o._id == ordem._id) {
						o.data_pagamento = ordem.data_pagamento;
						o.forma_pagamento = ordem.forma_pagamento;
					}
					return o;
				});

				this.updateDebito();
			}
		)
	}
}
