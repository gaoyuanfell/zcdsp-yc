/**
 * 功能模块 导入公共组件
 * 直接在模块引入。
 */
import {NgModule} from '@angular/core';
import {CurrencyFormatPipe} from '../pipe/currency-format-pipe';
import {MathPipe} from '../pipe/math-pipe';
import {KeysPipe} from '../pipe/keys-pipe';
import {CurrentStatePipe} from '../pipe/currentState-pipe';
import {NumberFormatPipe} from '../pipe/number-format-pipe';

@NgModule({
  imports: [],
  declarations: [
    CurrencyFormatPipe,
    CurrentStatePipe,
    KeysPipe,
    MathPipe,
    NumberFormatPipe,
  ],
  exports: [
    CurrencyFormatPipe,
    CurrentStatePipe,
    KeysPipe,
    MathPipe,
    NumberFormatPipe,
  ],
  providers: []
})
export class ModulePipe {

}
