import { Component, OnInit } from '@angular/core';
//import { OnActivate, Router, RouteSegment } from '@angular/router';
import { Router, RouteParams } from '@angular/router-deprecated';
import { DialogService } from '../../shared/dialog.service';

import { Cliente } from '../shared/cliente.model';
import { ClienteService } from '../shared/cliente.service';

@Component({
  selector: 'intranet-cliente',
  moduleId: module.id,
  templateUrl: 'cliente-detail.component.html',
  providers: [ClienteService, DialogService]
})
export class ClienteDetailComponent /*implements OnActivate*/ implements OnInit {
  cliente: Cliente;
  editNome: string;
  //private curSegment: RouteSegment;

  errorMessage: string;
  successMessage: string;

  constructor (
    private clienteService: ClienteService,
    private router: Router,
    private dialog: DialogService,
    private routeParams: RouteParams
  ) {}

  ngOnInit() {
    let id = this.routeParams.get('id');
    this.getCliente(id);
  }

  /*routerOnActivate(curr: RouteSegment) {
    this.curSegment = curr;
    let id = curr.getParam('id');
    this.getCliente(id);
  }*/

  /*routerCanDeactivate(): any {
    if (!this.cliente || this.cliente.nome === this.editNome) {
      return true;
    }
    return this.dialog.confirm('Discard changes?');
  }*/

  getCliente(id: string) {
    this.clienteService.getCliente(id).subscribe(
      cliente => {
        if (cliente) {
          this.editNome = cliente.nome
          this.cliente = cliente
        } else {
          this.goToClientes();
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  save() {
    this.cliente.nome = this.editNome;
    this.clienteService.save(this.cliente).subscribe(
      data => {
        if (data.cliente) {
          this.successMessage = data.message
          setTimeout(() => { this.successMessage = null }, 2000)
        } else {
          this.errorMessage = data.message
          setTimeout(() => { this.errorMessage = null }, 2000)
        }
      }
    )
  }

  goToClientes() {
    let clienteId = this.cliente ? this.cliente._id : null;
    //this.router.navigate(['/clientes']);
    window.history.back();
  }
}
