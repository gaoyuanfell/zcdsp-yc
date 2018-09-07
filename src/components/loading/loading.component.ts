import {Component, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less'],
})
export class LoadingComponent implements OnInit, OnDestroy {

  @Input() state;

  @Input() config: any = {};

  open(config = {}) {
    this.config = config;
    this.state = true;
  }

  close() {
    this.state = false;
  }

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }
}
