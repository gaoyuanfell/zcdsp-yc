import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FinanceService} from '../../../../service/customer/finance.service';

@Component({
  selector: 'yc-consume-expand',
  template: `

    <div class="chart-box">
      <div class="chart-data chart-self" #chartData></div>
    </div>
  `,
  styles: [
    `
      .chart-box {
        padding: 30px;
        border-radius: 2px;
        background-color: rgba(48, 148, 255, 0.08);
        display: flex;
      }

      .chart-box > .tool {
        top: 20px;
      }

      .chart-self {
        width: 100%;
        height: 250px;
        margin: 20px auto 10px auto;
      }
    `
  ]
})
export class ConsumeExpandComponent implements OnInit, AfterViewInit {
  @ViewChild('chartData') chartDataRef: ElementRef;
  @Input() date = new Date().formatDate('yyyy-MM-dd');
  x: Array<any> = [];
  y: Array<any> = [];
  chartDataRefThis;

  constructor(
    private _financeService: FinanceService,
  ) {
  }

  ngOnInit(): void {

  }

  init() {
    const obj = {
      date: this.date
    };
    this._financeService.consumeChart(obj).subscribe(res => {
      this.x = res.result.x;
      this.y = res.result.y;
      this.getData();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.chartData();
      this.init();
    }, 100);
  }

  getData() {
    // 后端没有这个字段 或者是null  undefined
    // var a = 0; a.toFixed(2) === '0.00';   0.toFixed(2):error  内部转化  +item变量
    this.y = this.y.map(item => (+item || 0).toFixed(2));
    this.chartDataRefThis.setOption({
      xAxis: {
        data: this.x,
      },
      series: [
        {
          name: '',
          data: this.y,
        }
      ]
    });
  }

  chartData() {
    const chartDataRef = this.chartDataRefThis = echarts.init(this.chartDataRef.nativeElement);
    chartDataRef.setOption({
      title: {
        text: '实时数据',
        textStyle: {
          fontWeight: 700,
          fontSize: 18,
          fontFamily: '',
          color: '#616366',
          align: 'left'
        },
        padding: 0
      },
      color: ['#2e90ff', '#ffa542'],
      tooltip: {
        trigger: 'axis'
      },
      // 图标位置
      grid: {
        top: 37,
        left: 0,
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisLine: {
          show: false,
          lineStyle: {
            color: '#979899'
          }
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#e7ecf3'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
          lineStyle: {
            color: '#979899'
          }
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#e7ecf3'
          }
        },
        axisLabel: {
          formatter: '{value} 元'
        }
      },
      // 数组里面对象
      series: [
        {
          name: '',
          type: 'line',
          stack: '总量',
          data: [],
          areaStyle: {
            color: 'rgba(46, 144, 255, 0.3)'
          }
        }
      ]
    });
    window.addEventListener('resize', () => {
      chartDataRef.resize();
    });
  }

}
