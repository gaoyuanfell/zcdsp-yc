import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less'],
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({opacity: 0}),
        animate(150, style({opacity: 1}))
      ]),
      transition('* => void', [
        animate(150, style({opacity: 0}))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent implements OnInit, OnDestroy {

  @Input() state

  @Input() config: any = {};

  open(config = {}) {
    this.config = config;
    this.state = true;
    this.changeDetectorRef.markForCheck();
  }

  close() {
    this.state = false;
    this.changeDetectorRef.markForCheck();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }
}
