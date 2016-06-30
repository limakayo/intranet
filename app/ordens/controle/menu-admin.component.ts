import { Input, OnInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { OrdemService } from '../shared/ordem.service';

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
	selectedOrdem: any;

	constructor(
		private ordemService: OrdemService,
		private router: Router) {}

	stringAsDate(dateStr: string) {
		return new Date(dateStr);
	}

	onOrdemChange(ordem: any) {
		this.selectedOrdem = ordem;
		this.router.navigate(['/ordens/controle', this.selectedOrdem.numero]);
	}
}
