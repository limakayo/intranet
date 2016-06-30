import { RouterConfig }          from '@angular/router';
import { ClienteDetailComponent } from './cliente-detail/cliente-detail.component';
import { ClienteListComponent } from './cliente-list/cliente-list.component';

export const ClientesRoutes: RouterConfig = [
  { path: 'clientes',  component: ClienteListComponent },
  { path: 'cliente/:id', component: ClienteDetailComponent }
];
