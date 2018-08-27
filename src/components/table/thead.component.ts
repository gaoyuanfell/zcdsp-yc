import {ChangeDetectionStrategy, Component, ElementRef, Host, Optional} from '@angular/core';
import {TableComponent} from './table.component';
import {TrComponent} from './tr.component';

@Component({
  selector: 'thead',
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `,
})
export class TheadComponent {
  trList:Array<TrComponent> = []
  constructor(@Host() @Optional() private tableComponent: TableComponent, @Optional() public ref: ElementRef){
    tableComponent.theadList.push(this)
  }
}
