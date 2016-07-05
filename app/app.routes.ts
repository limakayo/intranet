import { provideRouter, RouterConfig }  from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { CobrancaComponent } from './cobranca/cobranca.component';

import { ClientesRoutes } from './clientes/clientes.routes';
import { OrdensRoutes } from './ordens/ordens.routes';

import { AuthGuard } from './shared/auth.guard';
import { AuthService } from './shared/auth.service';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [ AuthGuard ] },
  { path: 'cobranca', component: CobrancaComponent },
  ...ClientesRoutes,
  ...OrdensRoutes,
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
  AuthGuard,
  AuthService
];
