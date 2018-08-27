import {ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export class Coordinate {
  week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  active: boolean = false;
  title;

  constructor(public x: number, public y: number, public grain: number) {
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    d.calendar(5, x * grain * 60);
    let start = d.formatDate('HH:mm');
    d.calendar(5, grain * 60);
    let end = d.formatDate('HH:mm');
    if (d.getHours() == 0 && d.getMinutes() == 0) {
      end = '24:00';
    }
    this.title = `${this.week[y]} ${start} ~ ${end}`;
  }
}

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ScheduleComponent),
  multi: true
};

@Component({
  selector: 'yc-time-schedule',
  exportAs: 'timeSchedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class ScheduleComponent implements OnInit, ControlValueAccessor, OnChanges {

  _week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
  @Input() grain: 1 | 0.5 = 0.5;
  timeGrain: Coordinate[] = [];
  status: 0 | 1 = 0;

  _timeMouseover(time: Coordinate, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.status !== 1) {
      return;
    }
    this.nowTime = time;
    this.move();
    this.onChange(this.timeGrain.map(t => t.active ? 1 : 0));
  }

  active;
  firstTime: Coordinate;
  nowTime: Coordinate;

  _timeClick(time: Coordinate, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    time.active = !time.active;
    this.onChange(this.timeGrain.map(t => t.active ? 1 : 0));
  }

  _timeMousedown(time: Coordinate, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.status = 1;
    this.firstTime = time;
    this.active = time.active;
  }

  _timeMouseup(time: Coordinate, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.status = 0;
  }

  _timeMouseleave(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.status = 0;
  }

  _clear() {
    this.timeGrain.forEach(a => a.active = false);
    this.onChange(this.timeGrain.map(t => t.active ? 1 : 0));
  }

  move() {
    let fx = this.firstTime.x;
    let fy = this.firstTime.y;
    let nx = this.nowTime.x;
    let ny = this.nowTime.y;
    if (fx > nx) {
      fx ^= nx;
      nx ^= fx;
      fx ^= nx;
    }
    if (fy > ny) {
      fy ^= ny;
      ny ^= fy;
      fy ^= ny;
    }
    this.timeGrain.forEach(t => {
      if (t.x >= fx && t.x <= nx && t.y >= fy && t.y <= ny) {
        t.active = !this.active;
      }
    });
  }

   _quickSetting(type) {
    switch (type) {
      case 1:
        this.timeGrain.forEach((t, i) => {
          t.active = true
        });
        break;
      case 2:
        this.timeGrain.forEach((t, i) => {
          t.active = t.y < 5;
        });
        break;
      case 3:
        this.timeGrain.forEach((t, i) => {
          t.active = t.y >= 5;
        });
        break;
    }
    this.onChange(this.timeGrain.map(t => t.active ? 1 : 0));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  onChange = (value) => value;
  writeValue(obj: any): void {
    // 打印2次 第一次undefined
    if (!obj) return;
    // if (!obj) return;
    // if (obj instanceof Array) {
    //   this.timeGrain.forEach((t, i) => {
    //     t.active = !!obj[i];
    //   });
    //     // 当obj空数组的时候
    //     let flag = obj.some( item => !!item);
    //     if (flag) {
    //       this.timeGrain.forEach((t, i) => {
    //         t.active = !!obj[i];
    //       });
    //     } else {
    //       this.timeGrain.forEach((t, i) => {
    //         t.active = true
    //       });
    //     }
    //   obj.push(...this.timeGrain.map(t => t.active ? 1 : 0))
    //   // if (obj.length === 0) {
    //   //   obj.push(...this.timeGrain.map(t => t.active ? 1 : 0))
    //   // }
    // }
    // this.changeDetectorRef.markForCheck();

    // 当obj是数组的时候

    if (obj instanceof Array) {
      // 当obj空数组的时候
      let flag = obj.some( item => !!item);
      if (flag) {
        this.timeGrain.forEach((t, i) => {
          t.active = !!obj[i];
        });
      } else {
        this.timeGrain.forEach((t, i) => {
          t.active = true
        });
      }
      // 引用呀
      // obj.push(...this.timeGrain.map(t => t.active ? 1 : 0))
    this.onChange(this.timeGrain.map(t => t.active ? 1 : 0));   // 这里最好不要加这句
    }
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 24 / this.grain; x++) {
        this.timeGrain.push(new Coordinate(x, y, this.grain));
      }
    }
  }
}
