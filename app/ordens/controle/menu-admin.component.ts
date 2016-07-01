import { Input, OnInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'menu-admin',
	templateUrl: 'menu-admin.component.html',
})

export class MenuAdminComponent {
	@Input() avaliadas: any[] = [];
	@Input() abertas: any[] = [];
	@Input() aprovadas: any[] = [];
	@Input() reprovadas: any[] = [];
	@Input() garantias: any[] = [];

	constructor(private router: Router) {}

	stringAsDate(dateStr: string) {
		return new Date(dateStr);
	}

	onOrdemChange(ordem: any) {
		this.router.navigate(['/ordens/controle', ordem.numero]);
	}

	formatDate(date: string) {
		let data = new Date(date);
		let dia = data.getDate();
		let mes = data.getMonth();
		let ano = data.getFullYear();
		let hora = data.getHours();
		let min = data.getMinutes();
		let seg = data.getSeconds();

		let formatted = dia + '/' + mes + '/' + ano + ' ' + hora + ':' + min + ':' + seg;
		return formatted;
	}

	showOrdem(ordem:any) {
		let option = ordem.numero + ' | ' + 
					 this.formatDate(ordem.createdAt) + ' | ' + 
					 ordem.modelo + ' | ' + 
					 ordem.cliente.nome;
		return option.toString();
	}
}
