import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ReportService} from '../../../service/customer/report.service';

@Component({
  selector: 'yc-report-expand',
  template: `
   
    <div class="chart-box">
        <div class="btn tool-left" (click)="exportUrl()" *ngIf="btnShow">
          导出
          <i class="btn-icon-export"></i>
        </div>
      <yc-button-group class="tool" (changeEvent)="changeDayTotalChart(chartDataRefThis, chartData, chartType)" [(ngModel)]="chartType" [list]="[{value:'pv',label:'曝光量'},{value:'click',label:'点击量'},{value:'ctr',label:'点击率'},{value:'cpc',label:'点击成本'},{value:'cpm',label:'曝光成本'},{value:'admoney',label:'花费'}]"></yc-button-group>

      <!--<yc-button-group class="tool" (changeEvent)="changeDayTotalChart(chartDataRefThis, chartData, chartType)" [(ngModel)]="chartType" [list]="[{value:'pv',label:'曝光量', unit:'次'},{value:'click',label:'点击量', unit:'次'},{value:'ctr',label:'点击率', unit:'%'},{value:'cpc',label:'点击成本', unit:'元'},{value:'cpm',label:'曝光成本', unit:'元'},{value:'admoney',label:'花费', unit:'元'}]"></yc-button-group>-->
      <div class="chart-data chart-self" #chartDataRef></div>
    </div>
  `,
  styles: [
    `
      .chart-box {
        background-color: rgba(48, 148, 255, 0.08);
        padding: 30px;
        border-radius: 2px;
        position: relative;
      }

      .chart-box > .tool {
        top: 20px;
        right: 10px;
        position:absolute;
      }
      .chart-box > .tool-left {
        position:absolute;
        top: 28px;
        right: 500px;
        z-index: 200;
      }
      .chart-self {
        width: 100%;
        height: 250px;
      }
    `
  ]
})
export class ReportExpandComponent implements OnInit {

  private _chartDataRef: ElementRef;
  // 通用组件 父亲传递过来url参数 这个组件是用来处理调用哪一个url的逻辑 不要把这部分逻辑放在serverce中
  // @Input() type: 'area-report' | 'customer-report' | 'creative-report' | 'datetime-report';
  @Input() searchText;
  @Input() campainActive;
  @Input() type;
  @Input() btnShow = false;
  @Input() begin_date = new Date().formatDate('yyyy-MM-dd');
  @Input() end_date = new Date().formatDate('yyyy-MM-dd');
  private _id;
  x: Array<any> = [];
  y: Array<any> = [];
  chartType = 'pv';
  chartData;
  chartDataRefThis;


  get chartDataRef(): ElementRef {
    return this._chartDataRef;
  }

  @ViewChild('chartDataRef') set chartDataRef(value: ElementRef) {
    this._chartDataRef = value;
    setTimeout(() => {
      this.chart();  // width用百分比 chart渲染不出来 所以延迟
      this.init()
    }, 0)
  }

  get id() {
    return this._id;
  }

  @Input() set id(value) {
    this._id = value;
  }

  constructor(
    private _reportService: ReportService,
  ) {
  }

  ngOnInit(): void {
  }

  init() {
    let obj: any = {
      begin_date: this.begin_date,
      end_date: this.end_date,
    };
    switch (this.type) {
      case 'creative-report': {
        // obj['creative_id'] = this._id;
        obj = {
          begin_date: this.begin_date,
          end_date: this.end_date,
          creative_id: this._id,
          search_text: this.searchText,
          campaign_id: this.campainActive,
        };
        this._reportService.creativeChart(obj).subscribe(res => {
          this.chartData = res.result;
          this.changeDayTotalChart(this.chartDataRefThis, this.chartData, this.chartType)
        })
        break;
      }
      case 'datetime-report': {
        obj = {
          // creative_name: this.searchText,
          search_text: this.searchText,
          campaign_id: this.campainActive,
          date: this.begin_date,
        };
        this._reportService.datetimeChart(obj).subscribe(res => {
          this.chartData = res.result;
          this.changeDayTotalChart(this.chartDataRefThis, this.chartData, this.chartType)
        })
        break;
      }
      case 'campaign-report': {
        obj['campaign_id'] = this._id;
        this._reportService.campaignChart(obj).subscribe(res => {
          this.chartData = res.result;
          this.changeDayTotalChart(this.chartDataRefThis, this.chartData, this.chartType)
        })
        break;
      }
    }

  }

  /*getData(name) {
    this.chartDataRefThis.setOption({
      xAxis: {
        data: this.x,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}' + name.unit,
        },
        max: (value) => {
          return (this.chartType === 'pv' || this.chartType === 'click' || this.chartType === 'admoney') ? value.max <= 5000 ? 5000 : value.max : value.max;
        }
      },
      series: [
        {
          name: name.label,
          data: this.y[this.chartType],
        }
      ]
    })
  }*/

  changeDayTotalChart(echartsInstance, data, type) {  // echarts 表单数组
    if (!data) return
    let suffix;
    let d = data.y[type];
    let max;
    switch (type) {
      case 'pv':
      case 'click':
        suffix = '次';
        // max = (value) => {
        //   return value.max <= 5000 ? 5000 : Math.round(value.max);
        // };
        break;
      case 'ctr':
        suffix = '%';
        d = d.map(td => (td * 100).toFixed(2));
        break;
      case 'cpm':
        suffix = '元';
        d = d.map(td => (td * 1000).toFixed(2));
        break;
      case 'cpc':
      case 'admoney':
        d = d.map(td => (td * 1).toFixed(2));
        suffix = '元';
        break;
    }

    let option: any = {
      xAxis: {
        data: data.x
      },
      yAxis: {
        axisLabel: {
          formatter: `{value} ${suffix}`
        }
      },
      series: [
        {data: d},
      ]
    }

    if (max) {
      option.yAxis.max = max
    } else {
      option.yAxis.max = null;
    }

    echartsInstance.setOption(option);
  }

  exportUrl() {
    const obj = {
      creative_name: this.searchText,
      campaign_id: this.campainActive,
      date: this.begin_date,
    };
    let url = this._reportService.hourExport(obj);
    window.open(url);
  }

  chart() {
    const chartDataRef = this.chartDataRefThis = echarts.init(this._chartDataRef.nativeElement);
    chartDataRef.setOption(
      {
        title: {
          text: '数据趋势',
          textStyle: {
            fontWeight: 400,
            fontSize: 14,
            color: '#616366',
            align: 'left'
          },
          padding: 0
        },
        color: ['#2e90ff', '#ffa542'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: [10, 8],
          textStyle: {
            color: 'black',
            fontSize: 10,
            fontFamily: '微软雅黑 Regular'
          },
          formatter: function (params) {
            let str = '';
            str = str + params[0].axisValue + '<div style="margin-bottom:8px"></div>';  // title
            str = str +  `
              <div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: ${params[0].color}"></div>
              ${params[0].seriesName}<span style="margin-right:20px"></span>${params[0].data}
              `
            return str;
          }
        },
        grid: {
          left: 0,
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
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
            lineStyle:{
              color:['#f7f8fa'],
              width: 2,
              type: 'dashed'
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
            lineStyle:{
              color:['#f7f8fa'],
              width: 2,
              type: 'dashed'
            }
          },
          axisLabel: {
            formatter: '{value} 次'
          }
        },
        series: [
          {
            name: '数据趋势',
            type: 'line',
            color: ['#2e90ff'],
            symbol: 'emptyCircle',
            symbolSize: 2,//拐点大小
          }
        ]
      }
      );
    window.addEventListener('resize', () => {
      chartDataRef.resize();
    });
  }

}
