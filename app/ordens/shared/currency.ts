import { Component, Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, CORE_DIRECTIVES } from '@angular/common';

const noop = () => {};

const MASK_VALUE_ACCESSOR = new Provider(
  NG_VALUE_ACCESSOR, {
    useExisting: forwardRef(() => Currency),
    multi: true
  }
);

@Component({
  selector: 'my-mask',
  template: '<input class="form-control" [(ngModel)]="value" (keydown)="onKeyDown($event)" (keyup)="onKeyUp($event)">',
  providers: [ MASK_VALUE_ACCESSOR ],
  directives: [ CORE_DIRECTIVES ]
})
export class Currency implements ControlValueAccessor {

  private _value: string = '';
  selectedValue: string;

  private _onTouchedCallback: (_:any) => void = noop;
  private _onChangeCallback: (_:any) => void = noop;

  writeValue(value: any): void {
    if (value != null) {
      this._value = value;
      this.setMask(true, null);
    } else {
      this._value = '0,00';
    }
  }

  //get accessor
  get value(): any { return this._value; };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this._onChangeCallback(v);
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  onKeyUp(event:any) {
    if (this._value == '' || this._value == null) {
      this._value = '0,00';
    }
  }

  onKeyDown(event:any) {
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105) && event.keyCode != 8) {
      event.preventDefault();
    } else {
      this.setMask(false, event);
    }
  }

  getSelectedText():string {
    let text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.getSelection != "undefined" && document.getSelection().type == "Text") {
        text = document.getSelection().toString();
    }
    return text;
  }

  isSelected() {
    this.selectedValue = this.getSelectedText();
    if (this.selectedValue) {
        return true;
    }
    return false;
  }

  setMask(initial:boolean, event:any) {
    let formatted = '';

    let value = this._value.toString().replace(/\./g,'').replace(/,/g,'').replace(/^0+/, '');
    
    if (event && event.keyCode == 8 && !this.isSelected()) {
      if (value.length == 1)
        this._value = '0,000';
      if (value.length == 3)
        value = '0' + value;
      if (value.length == 2)
        value = '00' + value;
    } else {
      if (value.length == 0)
        value = '00' + value;
      if (value.length == 1)
        value = '0' + value;
    }

    for (let i = 0; i < value.length; i++) {
      let sep = '';
      if (initial) {
        if (i == 2) sep = ',';
        if (i > 4 && (i + 4) % 3 == 0) sep = '.';
      } else if (event && event.keyCode == 8) {
        if (i == 3) sep = ',';
        if (i > 3 && (i + 3) % 3 == 0) sep = '.';
      } else {
        if (i == 1) sep = ',';
        if (i > 3 && (i + 2) % 3 == 0) sep = '.';
      }

      formatted = value.substring(value.length - 1 - i, value.length - i) + sep + formatted;
    }
  
    this._value = formatted;
  }

}
