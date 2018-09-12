import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host, HostListener,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges, ViewEncapsulation
} from '@angular/core';
import {TableComponent} from './table.component';
import {TrComponent} from './tr.component';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'th',
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <yc-checkbox *ngIf="showCheckbox" [(ngModel)]="_checked" [checkState]="_checkState" (changeEvent)="_change($event)"></yc-checkbox>
    <ng-content></ng-content>
    <div class="ant-table-column-sorter" *ngIf="showSort">
      <span
        class="ant-table-column-sorter-up"
        [ngClass]="{'active': status == '0'}"
        title="↑"
        #asc
      >
      </span>
      <span
        class="ant-table-column-sorter-down"
        [ngClass]="{'active': status == '1'}"
        title="↓"
        #desc
      >
      </span>
    </div>
  `
})
export class ThComponent implements OnChanges, OnInit {

  _checked = false;
  _checkState = 0;

  // 默认没有排序
  @Input() showSort;
  @Input() sortKey: string;  // 排序字段
  @Input() showCheckbox;
  @Input() fixed: 'left' | 'right'; // 是否固定列

  @Input() set checked(val) {
    this._checked = val;
  }

  _change(data) {
    this._checkState = 0;
    this.tableComponent.checkAllObservable.next(data);
  }

  private _status: '0' | '1' | '2' | string = '2';

  get status() {  // 让th拿到status
    return this._status;
  }

  set status(value) {
    this._status = value;
    this.changeDetectorRef.markForCheck();  // 手动改变渲染 每个都有status set get方法
  }

  // @HostBinding()和@HostListener()[处理变量]在自定义指令时非常有用。@HostBinding()可以为指令的宿主元素添加类、样式、属性等，而@HostListener()可以监听宿主元素上的事件。
  // HostBinding[常量绑定]
  // 一般找dom 天机class  用[ngClass]
  @HostListener('click', ['$event'])
  goToClick(e: Event): void {
    if (this.showSort) {
      e.preventDefault();
      e.stopPropagation();
      let status = '0';
      if (this._status === '2' || this._status === '1') {
        status = '0';
      } else {
        status = '1';
      }
      this.tableComponent.changeSortObservable.next({
        sort_expression:this.sortKey,
        sort_direction: status
      })
      this.status = status;   // 赋值的时候 调用set
    }
  }

  @Input() private _sticky

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

  constructor(@Host() @Optional() private trComponent: TrComponent,
              @Optional() public ref: ElementRef,
              @Host() @Optional() private tableComponent: TableComponent,
              private changeDetectorRef: ChangeDetectorRef) {
    if(trComponent){
      trComponent.thList.push(this);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  ngOnInit(): void {
    if (this.showCheckbox) {
      this.tableComponent.changeTdStateObservable.subscribe((data) => {
        this._checked = data.checked;
        this._checkState = data.checkState;
        this.changeDetectorRef.markForCheck();
      });
    }
  }
}
