import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';

export class CalendarCell {
  constructor(public value: number,
              public displayValue: string,
              public enabled: boolean,
              public thisMonth: boolean = true) {
  }
}

@Component({
  selector: 'datepicker-base',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class DatepickerBaseComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this._selectedValue = [];
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.activeDate = this.selectedDate || new Date();
    this.getWeek();
    this.getMonth();
    this.getYears();
    this.today = new Date();
    this.changeDetectorRef.markForCheck();
  }

  _weekdays = ['一', '二', '三', '四', '五', '六', '日'];
  _week: Array<CalendarCell>;

  private _today;

  get today() {
    return this._today;
  }

  set today(date) {
    date.setMilliseconds(0);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    this._today = date;
  }

  private _activeDate;

  get activeDate() {
    return this._activeDate;
  }

  set activeDate(value) {
    this._activeDate = value;
  }

  private _selectedDate;

  get selectedDate() {
    return this._selectedDate;
  }

  @Input() set selectedDate(value) {
    this._selectedDate = new Date(value);
    this._selectedDate.setMilliseconds(0);
    this._selectedDate.setHours(0);
    this._selectedDate.setMinutes(0);
    this._selectedDate.setSeconds(0);
    this.changeDetectorRef.markForCheck();
  }


  getWeek() {
    const weeks = [];
    const today = new Date();
    today.setMilliseconds(0);
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);

    const date = this.activeDate;
    date.setDate(1);
    date.setMilliseconds(0);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);

    let firstWeek = date.getDay();
    let lastDate = date.calendar(2, 1).calendar(3, -1).getDate();
    for (let i = 1; i <= lastDate; i++) {
      date.setDate(i);
      let enabled = false;
      if (this.disabledTodayBefore) {
        enabled = date.getTime() < today.getTime();
      }
      if (this.disabledTodayAfter) {
        enabled = date.getTime() > today.getTime();
      }
      weeks.push(new CalendarCell(date.getTime(), String(date.getDate()), enabled));
    }
    let lastWeek = date.getDay();

    date.setDate(1);
    if (firstWeek === 0) {
      for (let i = 1; i <= 6; i++) {
        date.calendar(3, -1);
        weeks.unshift(new CalendarCell(date.getTime(), String(date.getDate()), true, false));
      }
    } else {
      for (let i = 1; i < firstWeek; i++) {
        date.calendar(3, -1);
        weeks.unshift(new CalendarCell(date.getTime(), String(date.getDate()), true, false));
      }
    }


    if (weeks.length != lastDate) {
      date.setDate(1);
      date.calendar(2, 1);
    }
    date.setDate(lastDate);
    if (lastWeek === 0) {
      for (let i = 1; i <= 7; i++) {
        date.calendar(3, 1);
        weeks.push(new CalendarCell(date.getTime(), String(date.getDate()), true, false));
      }
    } else {
      for (let i = 1; i <= 7 - lastWeek; i++) {
        date.calendar(3, 1);
        weeks.push(new CalendarCell(date.getTime(), String(date.getDate()), true, false));
      }
    }
    while (weeks.length < 42) {
      for (let i = 1; i <= 7; i++) {
        date.calendar(3, 1);
        weeks.push(new CalendarCell(date.getTime(), String(date.getDate()), true, false));
      }
    }

    date.setDate(1);
    date.calendar(2, -1);
    this._week = weeks;
  }

  _previousClicked() {
    switch (this._currentView) {
      case 'multi-year': {
        this.activeDate.calendar(1, -24);
        this.getYears();
        break;
      }
      case 'month': {
        this.activeDate.calendar(2, -1);
        this.getWeek();
        break;
      }
      case 'year': {
        this.activeDate.calendar(1, -1);
        break;
      }
    }
    this.changeDetectorRef.markForCheck();
  }

  _nextClicked() {
    switch (this._currentView) {
      case 'multi-year': {
        this.activeDate.calendar(1, 24);
        this.getYears();
        break;
      }
      case 'month': {
        this.activeDate.calendar(2, 1);
        this.getWeek();
        break;
      }
      case 'year': {
        this.activeDate.calendar(1, 1);
        break;
      }
    }
    this.changeDetectorRef.markForCheck();
  }

  _selectedValue: number[] = [];

  _dateSelected(data) {
    if (data.enabled) return;   // 是否是当月
    if (this.isRange) {
      if (this.selectedValue.length === 2) this.selectedValue.length = 0;
      this.selectedValue.push(data.value);
      if (this.selectedValue.length != 2) {
        this.changeDetectorRef.markForCheck();
        return;
      }
    } else {
      this.selectedValue.length = 0;
      this.selectedValue.push(data.value);
    }
    this.selectedChange.emit(this.selectedValue.sort((a, b) => a - b));
    this.changeDetectorRef.markForCheck();
  }

  @Input() disabledTodayAfter = false;
  @Input() disabledTodayBefore = false;
  @Input() isRange = false;
  @Input() selectedValue;
  @Output() readonly selectedChange: EventEmitter<any> = new EventEmitter<any>();

  _currentView: 'month' | 'year' | 'multi-year' = 'month';

  get _periodButtonText(): string {
    if (this._currentView == 'month') {
      return this.activeDate.formatDate('MM月yyyy');
    }
    if (this._currentView == 'year') {
      return this.activeDate.getFullYear();
    }
    const activeYear = this.activeDate.getFullYear();
    const firstYearInView = activeYear - activeYear % 24;
    const lastYearInView = activeYear + 24 - 1 - activeYear % 24;
    return `${firstYearInView} \u2013 ${lastYearInView}`;
  }

  _currentPeriodClicked(): void {
    this._currentView = this._currentView == 'month' ? 'multi-year' : 'month';
    this.changeDetectorRef.markForCheck();
  }

  _years;

  getYears() {
    const years = [];
    const date = this.activeDate;
    let year = date.getFullYear();
    let activeOffset = year % 24;
    for (let i = 0; i < 24; i++) {
      let y = year - activeOffset + i;
      years.push(new CalendarCell(y, String(y), false));
    }
    this._years = years;
  }

  _yearSelected(year) {
    this.activeDate.setFullYear(year.value);
    this._currentView = 'year';
    this.changeDetectorRef.markForCheck();
  }

  getMonth() {
    let months: Array<CalendarCell> = [];
    for (let i = 0; i <= 11; i++) {
      months.push(new CalendarCell(i, `${i + 1}月`, false));
    }
    this._months = months;
  }

  _months: Array<CalendarCell>;

  _monthsSelected(month) {
    this.activeDate.setMonth(month.value);
    this._currentView = 'month';
    this.getWeek();
    this.changeDetectorRef.markForCheck();
  }

}

@Component({
  selector: 'datepicker',
  template: `
    <div class="datepicker-content">
      <datepicker-base [selectedDate]="selectedDateStart" (selectedChange)="selectedChange.emit($event)" [isRange]="isRange" 
                       [disabledTodayAfter]="disabledTodayAfter"
                       [disabledTodayBefore]="disabledTodayBefore"
                       [selectedValue]="selectedValue"></datepicker-base>
      <datepicker-base [selectedDate]="selectedDateEnd" (selectedChange)="selectedChange.emit($event)" [isRange]="isRange"
                       [disabledTodayAfter]="disabledTodayAfter"
                       [disabledTodayBefore]="disabledTodayBefore"
                       [selectedValue]="selectedValue" *ngIf="isRange"></datepicker-base>
      <div class="calendar-footer" *ngIf="(isRange && isShortcutKey)">
        <button class='btn btn-small' (click)="yestoday()">昨天</button>
        <button class='btn btn-small' (click)="today()">今天</button>
        <button class='btn btn-small' (click)="weekRencently()">最近一周</button>
        <button class='btn btn-small' (click)="monthRencently()">最近半个月</button>
        <button class='btn btn-small' (click)="oneMonth()">最近一个月</button>
        <button class='btn btn-small' (click)="threeMonth()">最近三个月</button>
      </div>
    </div>
   
  `,
  styles: [
    `
      .datepicker-content {
        padding: 0 0 20px 0;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
        display: flex;
        border-radius: 2px;
        background-color: #fff;
        color: rgba(0, 0, 0, .87);
        user-select: none;
      }
      .calendar-footer {
        position:absolute;
        bottom: 10px;
        left: 80px;
      }
      button {
        margin-left:10px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class DatepickerComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {

  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  dateCalendar(type = 3, num = 0) {
    let date = new Date().calendar(type, num);
    date.setMilliseconds(0);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date.getTime();
  }

  threeMonth() {
    this.selectedChange.emit([this.dateCalendar(2, -3), this.dateCalendar()]);
  }

  oneMonth() {
    this.selectedChange.emit([this.dateCalendar(2, -1), this.dateCalendar()]);
  }

  monthRencently() {
    this.selectedChange.emit([this.dateCalendar(3, -14), this.dateCalendar()]);
  }

  weekRencently() {
    this.selectedChange.emit([this.dateCalendar(3, -6), this.dateCalendar()]);
  }

  yestoday() {
    this.selectedChange.emit([this.dateCalendar(3, -1), this.dateCalendar(3, -1)]);
  }

  today() {
    this.selectedChange.emit([this.dateCalendar(3, 0), this.dateCalendar(3, 0)]);
  }

  ngOnInit() {
    if (this.isRange) {
      this.selectedDateStart = new Date();
      this.selectedDateEnd = new Date().calendar(2, 1);
      if (this.selectedValue && this.selectedValue.length) {
        let d1 = new Date(this.selectedValue[0]);
        let d2 = new Date(this.selectedValue[1]);
        if (d1.getMonth() === d2.getMonth()) {
          this.selectedDateStart = d1;
          this.selectedDateEnd = d2.calendar(2, 1);
        } else {
          this.selectedDateStart = d1;
          this.selectedDateEnd = d2;
        }
      }
    } else {
      this.selectedDateStart = new Date();
      if (this.selectedValue && this.selectedValue.length) {
        this.selectedDateStart = this.selectedValue[0];
      }
    }

    if (this.selectedValue && this.selectedValue.length === 0) {
      this.selectedDateStart = new Date();
      this.selectedDateEnd = new Date().calendar(2, 1);
    } else if (this.selectedValue && this.selectedValue.length === 1) {

    }

    this.changeDetectorRef.markForCheck();
  }

  selectedDateStart;
  selectedDateEnd;
  selectedValue: number[] = [];

  @Input() isRange = false;
  @Input() isShortcutKey = true;
  @Output() readonly selectedChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() disabledTodayAfter = false;
  @Input() disabledTodayBefore = false;
}
