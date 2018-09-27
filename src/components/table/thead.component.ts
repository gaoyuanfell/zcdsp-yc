import {ChangeDetectionStrategy, Component, ElementRef, Host, Optional, ViewEncapsulation} from '@angular/core';
import {TableComponent} from './table.component';
import {TrComponent} from './tr.component';

@Component({
  selector: 'thead',
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content></ng-content>
  `,
})
export class TheadComponent {
  trList: Array<TrComponent> = [];

  constructor(@Host() @Optional() private tableComponent: TableComponent, @Optional() public ref: ElementRef) {
    if (tableComponent) {
      tableComponent.theadList.push(this);
    }
  }
}
