import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';
import {TheadComponent} from './thead.component';
import {TbodyComponent} from './tbody.component';
import {TdComponent} from './td.component';
import {ThComponent} from './th.component';
import {collapseState} from '../../app/animations/collapseState';
import {TableComponent} from './table.component';

@Component({
  selector: 'tr',
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[@collapseState]': 'state',
  },
  animations: [
    collapseState
  ],
  template: `
    <ng-content></ng-content>
  `,
})
export class TrComponent{

  tdList: Array<TdComponent> = [];
  thList: Array<ThComponent> = [];

  _expand;

  @Input() set expand(value) {
    if (value) {
      value.state = 'inactive';
      value.show = false;
    }
    this._expand = value;
  }

  get expand() {
    return this._expand;
  }

  active;
  show;
  state;

  trigger() {
    if (!this.expand) return;
    this.expand.active = !this.expand.active;
    this.expand.state = this.expand.active ? 'active' : 'inactive';
    if (this.expand.active) {
      this.expand.show = true;
      if(this.tableComponent.fixed){
        setTimeout(()=> {
          this.tableComponent.changeExpandObservable.next(true);
        })
      }
      this.changeDetectorRef.markForCheck();
    } else {
      setTimeout(() => {
        this.expand.show = false;
        if(this.tableComponent.fixed){
          setTimeout(()=> {
            this.tableComponent.changeExpandObservable.next(false);
          })
        }
        this.changeDetectorRef.markForCheck();
      }, 150);
    }
  }

  constructor(@Host() @Optional() private theadComponent: TheadComponent,
              @Host() @Optional() private tbodyComponent: TbodyComponent,
              @Host() @Optional() private tableComponent: TableComponent,
              @Optional() public ref: ElementRef,
              private changeDetectorRef: ChangeDetectorRef) {
    if (theadComponent) {
      theadComponent.trList.push(this);
    }
    if (tbodyComponent) {
      tbodyComponent.trList.push(this);
    }
  }
}
