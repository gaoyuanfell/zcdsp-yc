import {ChangeDetectionStrategy, Component, Host, Input, OnInit, Optional, ViewEncapsulation} from '@angular/core';
import {TableComponent} from './table.component';

@Component({
  selector: 'yc-table-overflow',
  template: `
    <div class="overflow" #overflowRef><div class="overflow-tool" [ngStyle]="{'width.px':_width}"></div></div>
  `,
  styles:[
    `
      .overflow{
        z-index: 30;
        height: 10px;
        overflow-x: scroll;
        position: absolute;
        right: 0;
        left: 0;
      }
      .overflow-tool{
        height: 10px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class TableOverflowComponent implements OnInit{
  _width
  constructor(@Host() @Optional() private tableComponent: TableComponent){

  }

  ngOnInit(): void {
    this._width = this.tableComponent.tableWrapRef.nativeElement.clientWidth
  }


}
