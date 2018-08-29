import {Inject, Injectable, LOCALE_ID} from '@angular/core';

export interface Pipes {
  transform
  args?
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class Util {
  constructor(@Inject(LOCALE_ID) private _locale: string) {

  }

  /**
   * this.utilService_.pipes(val, [{transform: CurrencyPipe, args: 'CNY'}, {transform: CurrencyFormatPipe}]);
   * @param {string} value
   * @param {Array<Pipes>} ops
   * @returns {string}
   */
  pipes(value: string | number, ops: Array<Pipes>): any {
    ops.forEach(({transform, args}) => {
      value = new transform(this._locale).transform(value, ...args);
    });
    return value;
  }
}
