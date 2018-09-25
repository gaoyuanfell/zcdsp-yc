import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Pipe({name: 'numberFormat'})
export class NumberFormatPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string) {

  }

  transform(value, ...args: any[]): any {
    if (!value) {
      value = '0';
    }
    value = String(value);
    let a = ['万', '亿', '兆'];
    let b = ['', '', '百', '千'];
    let suffix = '';
    let length = value.length;
    switch (length) {
      case 5: {
      }
      case 6: {
        // suffix = b[1] + a[0];
        // value = value / 10000;
        // break;
      }
      case 7: {
        // suffix = b[2] + a[0];
        // value = value / 1000000;
        // break;
      }
      case 8: {
        suffix = a[0];
        value = value / 10000;
        break;
      }
      case 9: {
      }
      case 10: {
        // suffix = b[1] + a[1];
        // value = value / 100000000;
        // break;
      }
      case 11: {
        // suffix = b[2] + a[1];
        // value = value / 10000000000;
        // break;
      }
      case 12: {
        suffix = a[1];
        value = value / 100000000;
        break;
      }
      case 13: {
      }
      case 14: {
        suffix = b[1] + a[2];
        value = value / 1000000000000;
        break;
      }
      case 15: {
        suffix = b[2] + a[2];
        value = value / 100000000000000;
        break;
      }
      case 16: {
        suffix = b[3] + a[2];
        value = value / 1000000000000000;
        break;
      }
    }
    return new DecimalPipe(this._locale).transform(value, ...args) + suffix;
  }
}
