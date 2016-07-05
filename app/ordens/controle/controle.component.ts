import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Growl, Message } from 'primeng/primeng';

import { OrdemService } from '../shared/ordem.service';
import { AcessorioService } from '../../acessorios/acessorio.service';
import { AtendimentoService } from '../../atendimentos/atendimento.service';
import { TransporteService } from '../../transportes/transporte.service';
import { AuthService } from '../../shared/auth.service';
import { MenuAdminComponent } from './menu-admin.component';

import { Currency } from '../shared/currency';

import { NgForm } from '@angular/common';

import { tokenNotExpired } from 'angular2-jwt';

@Component({
	moduleId: module.id,
	selector: 'controle',
	templateUrl: 'controle.component.html',
	providers: [
		OrdemService,
		AcessorioService,
		AtendimentoService,
		TransporteService
	],
	directives: [  Currency, Growl, MenuAdminComponent ]
})
export class ControleComponent implements OnInit, OnDestroy {

	ordem: any;

	msgs: Message[] = [];

	user: any;

	numero: number;

	pronto: boolean;
	fechado: boolean;
	entregue: boolean;
	andamento: string;

	aprovacoes: any[] = [
		{id: 1, nome: 'Aprovada'},
		{id: 2, nome: 'Reprovada'},
		{id: 3, nome: 'Aguardando'}
	];

	avaliadas: any[] = [];
	abertas: any[] = [];
	aprovadas: any[] = [];
	reprovadas: any[] = [];
	garantias: any[] = [];

	aprovacaoSelecionada: any = this.aprovacoes[2];

	acessorios: any[];
	acessoriosSelecionados: any[] = [];

	atendimentos: any[];
	atendimentoSelecionado: any;

	transportes: any[];
	transporteSelecionado: any;

	errorMessage: string;
	successMessage: string;

	private sub: any;

	constructor(
		private ordemService: OrdemService,
		private acessorioService: AcessorioService,
		private atendimentoService: AtendimentoService,
		private transporteService: TransporteService,
		private auth: AuthService,
	    private router: Router,
	    private route: ActivatedRoute) { }

	ngOnInit() {
		this.getAcessorios();
		this.getAtendimentos();
		this.getTransportes();

		this.updateMenu();

		this.getUser();

		this.sub = this.route.params.subscribe(params => {
			let id = params['id'];
			if (id) {
				this.getOrdem(id);
			}
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	getUser() {
		this.auth.getUser().subscribe(
			user => this.user = user
		)
	}

	showInfo() {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'Ordem de serviço', detail: 'Atualizada com sucesso' });
    }

	goToControle(numero: string) {
		this.router.navigate(['/ordens/controle', numero ]);
	}

	getOrdem(numero: string) {
		this.ordemService.getOrdem(numero).subscribe(
			data => {
				if (data.ordem) {
					this.setAcessorios(data.ordem.acessorios);
					this.ordem = data.ordem;
					this.numero = data.ordem.numero;
					this.errorMessage = null;
					this.atendimentoSelecionado = data.ordem.atendimento;
					this.transporteSelecionado = data.ordem.transporte;
					if (data.ordem.aprovacao)
						this.aprovacaoSelecionada = this.aprovacoes.filter(a => a.id == data.ordem.aprovacao)[0];
					if (data.ordem.data_hora_pronto) {
						this.pronto = true;
					}
					if (data.ordem.data_hora_fechado) {
						this.fechado = true;
					}
					if (data.ordem.data_hora_entregue) {
						this.entregue = true;
					}
				} else {
					this.ordem = null;
					this.errorMessage = data.error;
				}
			},
			error => this.errorMessage = <any>error
		)
	}

	getAprovacao() {
		return this.aprovacoes.filter(a => a.id == this.ordem.aprovacao)[0].nome;
	}

	isAvaliada(form:any) {
		if (form.solucao_tecnica && form.solucao_tecnica != '') {
			return true;
		}
		return false;
	}

	onSubmit(form:any) {
		console.log(form);
	}

	updateOrdem(form:any) {

		// Aberta
		this.andamento = 'Aberta';
		form.tecnico = null;

		// Garantia
		if (this.atendimentoSelecionado.nome == 'Garantia') {
			this.andamento = 'Garantia';
		}

		// Avaliacao Técnica
		if (this.isAvaliada(form)) {
			if (!this.ordem.tecnico && this.auth.isTecnico()) {
				form.tecnico = this.user.nickname;
			} else {
				form.tecnico = this.ordem.tecnico;
			}
			this.andamento = 'Avaliada';
		}

		// Orçamento
		if (this.ordem.data_hora_orcamento) {
			// Aprovação
			if (!this.ordem.data_hora_aprovacao) {
				form.data_hora_aprovacao = new Date;
				this.andamento = this.aprovacaoSelecionada.nome;
			} else {
				if (this.aprovacaoSelecionada.id != this.ordem.aprovacao) {
					form.data_hora_aprovacao = new Date;
				}
				this.andamento = this.aprovacaoSelecionada.nome;
			}

			if (!form.solucao || form.solucao == '') {
				form.data_hora_orcamento = null;
				form.data_hora_aprovacao = null;
				this.aprovacaoSelecionada = this.aprovacoes[2];

				if (this.isAvaliada(form)) {
					this.andamento = 'Avaliada';
				} else {
					this.andamento = 'Aberta';
					form.tecnico = null;
				}
			}
		} else {
			if (form.solucao && form.solucao != '') {
				form.data_hora_orcamento = new Date;
				this.andamento = 'Aguardando';
			}
		}

		// Pronto
		if (!this.pronto) {
			form.data_hora_pronto = null;
		} else if (!this.ordem.data_hora_pronto) {
			form.data_hora_pronto = new Date;
		}

		// Fechado
		if (!this.fechado) {
			form.data_hora_fechado = null;
			form.data_hora_entregue = null;
			this.entregue = false;
		} else if (!this.ordem.data_hora_fechado) {
			form.data_hora_fechado = new Date;
			this.andamento = 'Fechada';
		} else {
			this.andamento = 'Fechada';
		}

		// Entregue
		if (!this.entregue) {
			form.data_hora_entregue = null;
		} else if (!this.ordem.data_hora_entregue) {
			form.data_hora_entregue = new Date;
			this.andamento = 'Entregue';
		} else {
			this.andamento = 'Entregue';
		}

		form.acessorios = this.acessoriosSelecionados;
		form.atendimento = this.atendimentoSelecionado;
		form.transporte = this.transporteSelecionado;
		form.aprovacao = this.aprovacaoSelecionada.id;
		form.andamento = this.andamento;

		console.log(form);

		this.ordemService.editOrdem(form).subscribe(
			ordem => {
				this.ordem = ordem;
				this.updateMenu();
				this.showInfo();
			}
		)
	}

	updateMenu() {
		this.getAvaliadas();
		this.getAbertas();
		this.getAprovadas();
		this.getReprovadas();
		this.getGarantias();
	}

	setAcessorios(acessoriosSelecionados: any[]) {
		if (acessoriosSelecionados) {
			this.acessoriosSelecionados = acessoriosSelecionados;

			this.acessorios.map((acessorio) => {
				acessorio.selected = false;
				for (let acessorioSelecionado of this.acessoriosSelecionados) {
					if (acessorio._id === acessorioSelecionado._id)
						acessorio.selected = true;
				}
			})
		}
	}

	onFechadoChange(fechado:any) {
		this.andamento = 'Fechada';
	}

	onEntregueChange(entregue:any) {
		console.log(entregue);
	}

	onProntoChange(pronto:any) {
		console.log(pronto);
	}

	onAcessorioChange(acessorio: any) {
		if (acessorio.selected == true) {
			this.acessoriosSelecionados = [...this.acessoriosSelecionados, acessorio];
		} else {
			this.acessoriosSelecionados = this.acessoriosSelecionados.filter(a => a._id !== acessorio._id)
		}
    }

    onAtendimentoChange(atendimento: any) {
		this.atendimentoSelecionado = atendimento;
    }

    onTransporteChange(transporte: any) {
		this.transporteSelecionado = transporte;
    }

    onAprovacaoChange(aprovacao: any) {
		this.aprovacaoSelecionada = aprovacao;
    }

    getAbertas() {
		this.ordemService.getAbertas().subscribe(
			abertas => this.abertas = abertas
		);
	}

	getAprovadas() {
		this.ordemService.getAprovadas().subscribe(
			aprovadas => this.aprovadas = aprovadas
		);
	}

	getReprovadas() {
		this.ordemService.getReprovadas().subscribe(
			reprovadas => this.reprovadas = reprovadas
		);
	}

	getGarantias() {
		this.ordemService.getGarantias().subscribe(
			garantias => this.garantias = garantias
		);
	}

	getAvaliadas() {
		this.ordemService.getAvaliadas().subscribe(
			avaliadas => this.avaliadas = avaliadas
		);
	}

	getAcessorios() {
		this.acessorioService.getAcessorios().subscribe(
			acessorios => this.acessorios = acessorios
		);
	}

	getAtendimentos() {
		this.atendimentoService.getAtendimentos().subscribe(
			atendimentos => this.atendimentos = atendimentos
		);
	}

	getTransportes() {
		this.transporteService.getTransportes().subscribe(
			transportes => this.transportes = transportes
		);
	}

}
