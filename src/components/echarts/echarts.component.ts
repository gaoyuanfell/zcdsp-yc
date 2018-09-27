import {Component, ElementRef, OnInit, ViewChild, Input, AfterViewInit, OnDestroy} from '@angular/core';

@Component({
  selector: 'yc-echarts',
  exportAs: 'echarts',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.less']
})
export class EchartsComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor() { }
  @ViewChild('chartDataRef') chartDataRef: ElementRef;
  @Input('height') height;
  chartInstance;
  _setOptionKey;

  // ngOnchange
  @Input() set setOptionKey(value) {
    this._setOptionKey = value;
  }

  ngOnInit() {
    this.chart();
    this.chartInstance.setOption(
      this._setOptionKey
    )
    // setTimeout( () => {
    //   console.log('孩子ngOnInit11111111111111')
    //   this.chart();
    //   this.chartInstance.setOption(
    //     this._setOptionKey
    //   )
    // },0)

  }

  ngAfterViewInit() {
    // this.chart();
    // this.chartInstance.setOption(
    //   this._setOptionKey
    // )
  }

  ngOnDestroy() {
  }

  chart() {
    // const chartDataRef = this.chartInstance = echarts.init(this.chartDataRef.nativeElement);
    const chartDataRef = this.chartInstance = echarts.init(document.getElementById('one'));

    chartDataRef.setOption(
      {}
    );
    window.addEventListener('resize', () => {
      chartDataRef.resize();
    });
  }

}
