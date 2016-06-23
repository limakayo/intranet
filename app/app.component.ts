import { Component } from '@angular/core';
import { AutoComplete } from './autocomplete';

@Component({
    selector: 'my-app',
    template: `
    <h1>Angular 2 AutoComplete</h1>
    <hr>
    <div class="row">
      <div class="col-md-6">
          <autocomplete></autocomplete>
      </div>
    </div>
    `,
    directives: [ AutoComplete ]
})

export class AppComponent {}
