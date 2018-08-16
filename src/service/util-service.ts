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
   *
   * @param {string} url
   * @returns {Promise<any>}
   */
  image(url: string) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = url;
    });
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
