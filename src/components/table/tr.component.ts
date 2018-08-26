import {ChangeDetectionStrategy, Component, ElementRef, Host, Optional} from '@angular/core';
import {TheadComponent} from './thead.component';
import {TbodyComponent} from './tbody.component';
import {TdComponent} from './td.component';
import {ThComponent} from './th.component';

@Component({
  selector: 'tr',
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `,
})
export class TrComponent {

  tdList: Array<TdComponent> = []
  thList: Array<ThComponent> = []

  constructor(@Host() @Optional() private theadComponent: TheadComponent, @Host() @Optional() private tbodyComponent: TbodyComponent, @Optional() public ref: ElementRef){
    if(theadComponent){
      theadComponent.trList.push(this)
    }
    if(tbodyComponent){
      tbodyComponent.trList.push(this)
    }
  }
}
