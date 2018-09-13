import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional, Renderer2, ViewEncapsulation
} from '@angular/core';
import {TheadComponent} from './thead.component';
import {TbodyComponent} from './tbody.component';
import {TdComponent} from './td.component';
import {ThComponent} from './th.component';
import {collapseState} from '../../app/animations/collapseState';
import {TableComponent} from './table.component';
import {TfootComponent} from './tfoot.component';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Global} from '../../service/global';

@Component({
  selector: 'tr',
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
export class TrComponent implements AfterViewInit{

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
      this.changeDetectorRef.markForCheck();
    } else {
      setTimeout(() => {
        this.expand.show = false;
        this.changeDetectorRef.markForCheck();
      }, 150);
    }
  }

  private _sticky

  get sticky() {
    return this._sticky;
  }

  @Input() set sticky(value) {
    this._sticky = coerceBooleanProperty(value);
  }

  private _stickyStart;

  get stickyStart() {
    return this._stickyStart;
  }

  @Input() set stickyStart(value) {
    this._stickyStart = coerceBooleanProperty(value);
  }

  private _stickyEnd;

  get stickyEnd() {
    return this._stickyEnd;
  }

  @Input() set stickyEnd(value) {
    this._stickyEnd = coerceBooleanProperty(value);
  }

  ngAfterViewInit(): void {
    if(!this.tableComponent) return;
    if (this.theadComponent) {
      let bcrt1 = this._global.containerFullRef.getBoundingClientRect();
      let bcrt2 = this.tableComponent.tableWrapRef.nativeElement.getBoundingClientRect();
      let offsetTop = bcrt2.top - bcrt1.top;
      this.sticky && this._global.overflowSubject.subscribe(({top}) => {
        this.thList.forEach(th => {
          if (offsetTop < top) {
            th.ref.nativeElement.style.top = `${top - offsetTop}px`;
          } else {
            th.ref.nativeElement.style.top = `0px`;
          }
        })
      })
    }

    if (this.tbodyComponent) {

    }

    if (this.tfootComponent) {

    }
  }



  constructor(@Host() @Optional() private theadComponent: TheadComponent,
              @Host() @Optional() private tbodyComponent: TbodyComponent,
              @Host() @Optional() private tfootComponent: TfootComponent,
              @Host() @Optional() private tableComponent: TableComponent,
              @Optional() public ref: ElementRef,
              private _global: Global,
              private renderer:Renderer2,
              private changeDetectorRef: ChangeDetectorRef) {
    if (theadComponent) {
      theadComponent.trList.push(this);
    }
    if (tbodyComponent) {
      tbodyComponent.trList.push(this);
    }
    if (tfootComponent) {
      tfootComponent.trList.push(this);
    }
  }
}
