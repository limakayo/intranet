import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'search-box',
  template: `
    <div>
      Pesquisar: <input #search (input)="searchChange.emit(search.value)">
    </div>
  `,
})
export class SearchBox implements OnInit {
  @Output() searchChange = new EventEmitter();

  ngOnInit() {
    this.searchChange.emit('');
  }
}
