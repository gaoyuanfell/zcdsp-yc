import {Pipe, PipeTransform} from '@angular/core';

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'remindKey'})
export class RemindPipe implements PipeTransform {
  transform(value: string): any {
    switch (value) {
      case 'BALANCE_ALERT':
        return '账户余额';
      case 'BUDGET_ALERT':
        return '预算余额';
      case 'AD_PROJECT_SHOW_DATE_ALERT':
        return '投放到期';
      case 'AD_CREATIVE_CHECK_ALERT':
        return '创意审核失败';
      case 'AD_CREATIVE_RTB_STATE_ALERT':
        return '投放异常';

    }
  }
}
