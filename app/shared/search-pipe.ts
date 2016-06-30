import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "search"
})
export class SearchPipe implements PipeTransform {
  transform(value: any, term: any) {
    if (value == null)
      return null;
    return value.filter((item: any) => item.nome.indexOf(term) > -1);
  }
}
