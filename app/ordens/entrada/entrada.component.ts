import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OrdemService } from '../shared/ordem.service';
import { ClienteService } from '../../clientes/shared/cliente.service';
import { EquipamentoService } from '../../equipamentos/shared/equipamento.service';
import { AcessorioService } from '../../acessorios/acessorio.service';
import { AtendimentoService } from '../../atendimentos/atendimento.service';
import { TransporteService } from '../../transportes/transporte.service';

import { Ordem } from '../shared/ordem.model';

import { AutoComplete } from 'primeng/primeng';

@Component({
	moduleId: module.id,
	selector: 'entrada',
	templateUrl: 'entrada.component.html',
	providers: [
		OrdemService,
		ClienteService,
		EquipamentoService,
		AcessorioService,
		AtendimentoService,
		TransporteService
	],
	directives: [ AutoComplete ]
})
export class EntradaComponent implements OnInit {

	andamentos: any[];

	acessorios: any[];
	acessoriosSelecionados: any[] = [];

	atendimentos: any[];
	atendimentoSelecionado: any;

	transportes: any[];
	transporteSelecionado: any;

	cliente: any;
	equipamentos: any[];

	numero: number;
	mensagem: string;
	ordemCadastrada: any;

	clientes: any[];
	filteredClientes: any[];

  	constructor(
		private router: Router,
		private ordemService: OrdemService,
		private clienteService: ClienteService,
	  	private equipamentoService: EquipamentoService,
	  	private acessorioService: AcessorioService,
	  	private atendimentoService: AtendimentoService,
	  	private transporteService: TransporteService){}

    onCheckboxChange(acessorio:any) {
		if (acessorio.selected == true) {
			this.acessoriosSelecionados.push(acessorio);
		} else {
			let i = this.acessoriosSelecionados.indexOf(acessorio);
			if (i != -1) {
				this.acessoriosSelecionados.splice(i, 1);
			}
		}
    }

    onAtendimentoChange(atendimento:any) {
		this.atendimentoSelecionado = atendimento;
    }

    onTransporteChange(transporte:any) {
		this.transporteSelecionado = transporte;
    }

	ngOnInit() {
		this.acessorioService.getAcessorios().subscribe(
			acessorios => this.acessorios = acessorios
		);
		this.atendimentoService.getAtendimentos().subscribe(
			atendimentos => this.atendimentos = atendimentos
		);
		this.transporteService.getTransportes().subscribe(
			transportes => this.transportes = transportes
		);

		this.getEquipamentos();
		this.ordemService.getNextId().subscribe(
			numero => this.numero = numero
		)
	}

	getEquipamentos() {
		this.equipamentoService.getEquipamentos().subscribe(
			equipamentos => this.equipamentos = equipamentos
		)
	}

	search(event:any) {
		let query = event.query;
		this.clienteService.getClientes().subscribe(
			clientes => this.filteredClientes = this.filterCliente(query, clientes)
		);
	}

	filterCliente(query:any, clientes: any[]):any[] {
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

  	add(form: any) {

		if (typeof form.cliente !== 'object')
			return console.log('Não é um cliente');
		else {

			form.acessorios = this.acessoriosSelecionados;
			form.atendimento = this.atendimentoSelecionado;
			form.transporte = this.transporteSelecionado;
			form.andamento = 'Aberta';
			if (this.atendimentoSelecionado.nome == 'Garantia') {
				form.andamento = 'Garantia';
			}

		    this.ordemService.addOrdem(form).subscribe(
		      data => {
						console.log(data)
						this.ordemCadastrada = data
						this.numero = data.numero + 1
						this.mensagem = "Ordem cadastrada com sucesso!"
						setTimeout(() => {
							this.mensagem = null
						}, 10000);
					}
		    );

		}
	}

	goToControle(ordem: Ordem) {
		this.router.navigate(['/controle', { id: ordem.numero }]);
	}


}
