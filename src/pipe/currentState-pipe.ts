import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'ycCurrentState', pure: false})
export class CurrentStatePipe implements PipeTransform {
  transform(value): any {
    switch (String(value)) {
      case '1': {
        return '投放中';
      }
      case '2': {
        return '暂停';
      }
      case '3': {
        return '投放结束';
      }
    }
    return value;
  }
}
