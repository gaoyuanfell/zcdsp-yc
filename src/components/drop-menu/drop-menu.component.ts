import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface Props {
  value?: string
  label?: string
  desc?: string
  disabled?: string
  checked?: string
}

@Component({
  selector: 'drop-menu',
  templateUrl: './drop-menu.component.html',
  styleUrls: ['./drop-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class DropMenuComponent implements OnInit {

  _props: Props = {
    value: 'value',
    label: 'label',
    desc: 'desc',
    disabled: 'disabled',
    checked: 'checked',
  };

  @Input('props') set props(val: Props) {
    if (val) {
      Object.assign(this._props, val);
      Object.assign(val, this._props);
      this._props = val;
    }
  }

  @Input() list;
  @Output() selectedEvent = new EventEmitter<any>();

  select(data) {
    this.selectedEvent.emit(data)
  }

  constructor() {
  }

  ngOnInit() {
  }

}
