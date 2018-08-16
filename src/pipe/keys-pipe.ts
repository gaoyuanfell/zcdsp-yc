import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'keys', pure: false})
export class KeysPipe implements PipeTransform {
  transform(value, ...args: any[]): any {
    let keys = [];
    if (!value) return keys;
    Object.keys(value).every((key) => {
      keys.push({[args[0] || 'key']: key, [args[1] || 'value']: value[key]});
      return true;
    });
    return keys;
  }
}
