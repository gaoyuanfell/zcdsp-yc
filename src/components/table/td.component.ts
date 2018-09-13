import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  Input,
  OnChanges, OnDestroy, OnInit,
  Optional, Renderer2,
  SimpleChanges, ViewEncapsulation
} from '@angular/core';
import {TableComponent} from './table.component';
import {TrComponent} from './tr.component';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'td',
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <yc-checkbox *ngIf="showCheckbox" [(ngModel)]="checked" [checkState]="_checkState" (changeEvent)="_change()"></yc-checkbox>
    <span [ngStyle]="{'width.px': width}" class="nowrap"><ng-content></ng-content></span>
  `,
})
export class TdComponent implements OnChanges{
  private _checked = false;
  _checkState = 0;

  @Input() fixed: 'left' | 'right'; // 是否固定列
  @Input() showCheckbox;
  @Input() width

  @Input() set checked(val) {
    this._checked = val;
    this.changeDetectorRef.markForCheck();
  }

  get checked(): boolean {
    return this._checked;
  }

  _change() {
    this.tableComponent.changeCheckObservable.next({
      data: this.showCheckbox,
      checked: this._checked
    });
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

  set Left(val){
    this.renderer.setStyle(this.ref.nativeElement, 'left', `${val}px`)
    this.renderer.setStyle(this.ref.nativeElement, 'z-index', 16)
  }

  set BorderRight(val: boolean){
    if(val){
      this.renderer.setStyle(this.ref.nativeElement, 'border-right', `1px solid #e2e6eb`)
    }else {
      this.renderer.setStyle(this.ref.nativeElement, 'border-right', `none`)
    }
  }

  constructor(@Host() @Optional() private trComponent: TrComponent,
              @Optional() public ref: ElementRef,
              private renderer: Renderer2,
              @Host() @Optional() private tableComponent: TableComponent,
              private changeDetectorRef: ChangeDetectorRef) {
    if(trComponent){
      trComponent.tdList.push(this);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }
}
