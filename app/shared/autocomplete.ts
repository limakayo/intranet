import { Component, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ClienteService } from '../clientes/shared/cliente.service';
import { Cliente } from '../clientes/shared/cliente.model';

@Component({
  selector: 'autocomplete',
  template: `
    <input #input type="text" class="form-control input-list" [(ngModel)]="query" (keyup)="filter($event)">
    <button class="button-list" (click)="showAll(input)">
      <i class="fa fa-sort-desc" aria-hidden="true"></i>
    </button>

    <ul id="list-group" class="list-group group-list" *ngIf="filteredList.length > 0">
        <li *ngFor="let item of filteredList" [class.active]="item.selected" [id]="item.selected" class="list-group-item item-list" (click)="select(item)">
          {{ item.nome }}
        </li>
    </ul>
  `,
  host: {
    '(document:click)': 'handleClick($event)',
    '(keydown)': 'handleKeyDown($event)'
  },
  providers: [ ClienteService ]
})
export class AutoComplete {

  query: string = '';
  filteredList: any[] = [];

  selectedItem: any;
  @Output() onSelectedItem = new EventEmitter<any>(); 

  item: any;
  @Input() items: any[];

  elementRef: ElementRef;
  pos: number = -1;
  opened: boolean = false;

  constructor(private el: ElementRef, private clienteService: ClienteService) {
    this.elementRef = el;
  }

  filterQuery() {
    this.filteredList = this.items.filter((el: any) => {
      return el.nome.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
    });
  }

  filter(event:any) {

    if (this.query !== '') {
      if (this.opened) {

        if ((event.keyCode >= 48 && event.keyCode <= 57) || 
            (event.keyCode >= 65 && event.keyCode <= 90) || 
            (event.keyCode == 8)) {

          this.pos = 0;
          this.filterQuery();

        } else if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
          this.filteredList = this.items;
        }
      } else {
         this.filterQuery();
      }
    } else {
      if (this.opened) {
        this.filteredList = this.items;
      } else {
        this.filteredList = [];
      }
    }

    for (let i = 0; i < this.filteredList.length; i++) {
      this.filteredList[i].selected = false;
    }

    if (this.selectedItem) {
        this.filteredList.map((i) => {
        if (i._id == this.selectedItem._id) {
          this.pos = this.filteredList.indexOf(i);
        }
      })
      this.selectedItem = null;
    }

    // Arrow-key Down
    if (event.keyCode == 40) {
      if (this.pos + 1 != this.filteredList.length)
        this.pos++;
    }

    // Arrow-key Up
    if (event.keyCode == 38) {
      if (this.pos > 0)
        this.pos--;
    }

    if (this.filteredList[this.pos] !== undefined)
      this.filteredList[this.pos].selected = true;

    //enter
    if (event.keyCode == 13) {
      if (this.filteredList[this.pos] !== undefined) {
        this.select(this.filteredList[this.pos]);
      }
    }

    // Handle scroll position of item
    let listGroup = document.getElementById('list-group');
    let listItem = document.getElementById('true');
    if (listItem) {
      listGroup.scrollTop = (listItem.offsetTop - 100);
    }

  }

  select(item: any) {
    this.selectedItem = item;
    this.onSelectedItem.emit(item);

    this.selectedItem.selected = true;
    this.query = item.nome;
    this.filteredList = [];
    //this.opened = false;
  }

  showAll(input:any) {
    input.select();

    if (this.filteredList.length > 0) {
      this.opened = false;
      this.filteredList = [];
    } else {
      this.opened = true;
      this.filteredList = this.items;
    }
    if (this.query === '') {
      this.clearAll();
    }

    this.clearSelects();
  }

  handleKeyDown(event: any) {
    // Prevent default actions of arrows
    if (event.keyCode == 40 || event.keyCode == 38) {
      event.preventDefault();
    }
  }

  clearAll() {
    if (this.filteredList) {
      for (let i = 0; i < this.filteredList.length; i++)
        this.filteredList[i].selected = false;
    }
  }

  /** Remove selected from all items of the list **/
  clearSelects() {
    if (this.selectedItem) {
      for (let i = 0; i < this.filteredList.length; i++) {
        if (this.filteredList[i]._id != this.selectedItem._id)
          this.filteredList[i].selected = false;
      }
    }
  }

  /** Handle outside click to close suggestions**/
  handleClick(event: any) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.filteredList = [];
      this.opened = false;
    }
  }

}
