import { RouterConfig } from '@angular/router';

import { OrdensComponent } from './ordens.component';
import { EntradaComponent } from './entrada/entrada.component';
import { SaidaComponent } from './saida/saida.component';
import { FechadasComponent } from './fechadas/fechadas.component';
import { AbertasComponent } from './abertas/abertas.component';
import { ControleComponent } from './controle/controle.component';

export const OrdensRoutes: RouterConfig = [
	{
		path: 'ordens',
		component: OrdensComponent,
		children: [
			{
				path: 'entrada',
				component: EntradaComponent,
			},
			{
				path: 'saida',
				component: SaidaComponent,
			},
			{
				path: 'fechadas',
				component: FechadasComponent,
			},
			{
				path: 'abertas',
				component: AbertasComponent,
			},
			{
				path: 'controle',
				component: ControleComponent
			},
			{
				path: 'controle/:id',
				component: ControleComponent
			}
		]
	}
];
