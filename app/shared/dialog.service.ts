import { Injectable } from '@angular/core';

export class DialogService {
  confirm (message?:string) {
    return new Promise<boolean>((resolve, reject) =>
      resolve(window.confirm(message || 'Is it OK?')));
  };
}
