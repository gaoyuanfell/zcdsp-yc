import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {TableComponent} from './table.component';
import {TrComponent} from './tr.component';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'th',
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <yc-checkbox *ngIf="showCheckbox" [(ngModel)]="_checked" [checkState]="_checkState" (changeEvent)="_change($event)"></yc-checkbox>
    <ng-content></ng-content>
  `
})
export class ThComponent implements OnChanges, OnInit {

  _checked = false;
  _checkState = 0;

  // 默认没有排序
  @Input() showSort;
  @Input() sortKey: string;  // 排序字段
  @Input() showCheckbox;

  @Input() set checked(val) {
    this._checked = val;
  }

  _change(data) {
    this._checkState = 0;
    this.tableComponent.checkAllObservable.next(data);
  }

  constructor(@Host() @Optional() private trComponent: TrComponent,
              @Optional() public ref: ElementRef,
              @Host() @Optional() private tableComponent: TableComponent,
              private changeDetectorRef: ChangeDetectorRef) {
    trComponent.thList.push(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  ngOnInit(): void {
    if (this.showCheckbox) {
      this.tableComponent.changeTdStateObservable.subscribe((data) => {
        console.info(data);
        this._checked = data.checked;
        this._checkState = data.checkState;
        this.changeDetectorRef.markForCheck();
      });
    }
  }
}
