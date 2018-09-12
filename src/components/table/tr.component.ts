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

  private _stickyStart

  get stickyStart() {
    return this._stickyStart;
  }

  @Input() set stickyStart(value) {
    this._stickyStart = coerceBooleanProperty(value);
  }

  private _stickyEnd

  get stickyEnd() {
    return this._stickyEnd;
  }

  @Input() set stickyEnd(value) {
    this._stickyEnd = coerceBooleanProperty(value);
  }

  ngAfterViewInit(): void {
    if(!this.tableComponent) return;
    if (this.theadComponent) {
      this.thList.forEach(th => {
        th.sticky = true;
        let top = `0px`;
        if(this.tableComponent.queryRef){
          top = `${this.tableComponent.queryRef.nativeElement.clientHeight}px`;
        }
        this.renderer.setStyle(th.ref.nativeElement, 'top', top);
        this.renderer.setStyle(th.ref.nativeElement, 'position', 'sticky');
        this.renderer.setStyle(th.ref.nativeElement, 'z-index', 20);
      })

      let left = 0;
      this.thList.filter(th => th.stickyStart).forEach(th => {
        this.renderer.setStyle(th.ref.nativeElement, 'left', `${left}px`);
        this.renderer.setStyle(th.ref.nativeElement, 'position', 'sticky');
        this.renderer.setStyle(th.ref.nativeElement, 'z-index', 21);
        left += th.ref.nativeElement.offsetWidth
      })
    }

    if (this.tbodyComponent) {
      let left = 0;
      this.tdList.filter(td => td.stickyStart).forEach(td => {
        this.renderer.setStyle(td.ref.nativeElement, 'left', `${left}px`);
        this.renderer.setStyle(td.ref.nativeElement, 'position', 'sticky');
        this.renderer.setStyle(td.ref.nativeElement, 'z-index', 19);
        left += td.ref.nativeElement.offsetWidth
      })
    }

    if (this.tfootComponent) {
      console.info(this.tdList)
    }
  }



  constructor(@Host() @Optional() private theadComponent: TheadComponent,
              @Host() @Optional() private tbodyComponent: TbodyComponent,
              @Host() @Optional() private tfootComponent: TfootComponent,
              @Host() @Optional() private tableComponent: TableComponent,
              @Optional() public ref: ElementRef,
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
