import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Pipe({name: 'currencyFormat'})
export class CurrencyFormatPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string) {

  }

  transform(value, ...args: any[]): any {
    if (!value) {
      value = '0';
    }
    return new CurrencyPipe(this._locale).transform(value, 'CNY').replace(/CN/ig, '');
  }
}
