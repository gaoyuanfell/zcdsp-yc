import {Pipe, PipeTransform} from '@angular/core';

// 有可能有问题
@Pipe({name: 'math'})
export class MathPipe implements PipeTransform {
  transform(value, ...args: any[]): any {
    if (args && args.length) {
      let m = args[0];
      return Math[m](value);
    }
    return NaN;
  }
}
