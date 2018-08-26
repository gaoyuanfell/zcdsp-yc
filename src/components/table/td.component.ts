import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  Input,
  OnChanges,
  Optional,
  SimpleChanges
} from '@angular/core';
import {TableComponent} from './table.component';
import {TrComponent} from './tr.component';

@Component({
  selector: 'td',
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <yc-checkbox *ngIf="showCheckbox" [(ngModel)]="checked" [checkState]="_checkState" (changeEvent)="_change()"></yc-checkbox>
    <ng-content></ng-content>
  `,
})
export class TdComponent implements OnChanges {
  private _checked = false;
  _checkState = 0;

  @Input() showCheckbox;

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

  constructor(@Host() @Optional() private trComponent: TrComponent,
              @Optional() public ref: ElementRef,
              @Host() @Optional() private tableComponent: TableComponent,
              private changeDetectorRef: ChangeDetectorRef) {
    trComponent.tdList.push(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }
}
