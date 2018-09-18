import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {IndexService} from '../../../service/agent/index.service';

@Component({
  selector: 'yc-index-expand',
  template: `
    <div class="expand-content">
      <div class="chart-box">
        <yc-button-group class="tool" [(ngModel)]="chartCode"
                         (changeEvent)="changeCampaignAndCreativeChart(chartDataEcharts,chartData,chartCode)"
                         [list]="[{value:'pv',label:'曝光量'},{value:'click',label:'点击量'},{value:'ctr',label:'点击率'},{value:'cpc',label:'点击成本'},{value:'cpm',label:'曝光成本'},{value:'admoney',label:'花费'}]"></yc-button-group>
        <div class="index-expand-chart" #chartDataRef></div>
      </div>
    </div>

  `,
  styles: [
    `
      .index-expand-chart {
        width: 100%;
        height: 320px;
      }

      .expand-content {
        padding: 30px;
        border-radius: 2px;
        cursor: default;
      }
      .chart-box {
        position:relative;
      }
      .tool {
        position:absolute;
        right:0px;
        top:-10px;
      }
    `
  ]
})
export class IndexExpandComponent implements OnInit {

  _id
  chartData
  chartDataEcharts
  chartCode = 'pv';

  private _chartDataRef: ElementRef;


  get chartDataRef(): ElementRef {
    return this._chartDataRef;
  }

  @ViewChild('chartDataRef') set chartDataRef(value: ElementRef) {
    this._chartDataRef = value;
    setTimeout(() => {
      this.chart();
      this.init()
    }, 0)
  }

  @Input() set id(id) {
    this._id = id;
  };

  get id() {
    return this._id;
  }

  init() {
    this._indexService.childListChart({user_id: this._id}).subscribe(res => {
      this.chartData = res.result;
      this.changeCampaignAndCreativeChart(this.chartDataEcharts, res.result, this.chartCode)
    })
  }

  chart() {
    const chartDataRef = this.chartDataEcharts = echarts.init(this._chartDataRef.nativeElement);
    chartDataRef.setOption(
      {
        legend: {   // 失效了
          itemWidth: 48, // 图例的宽度
          data: ['今日数据', '昨日数据'],
          right: 520,  // 位置
          textStyle: {
            color: '#ccc'
          }
        },
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
            if (params.length > 1) {
              params.forEach( item => {
                str = str + `
                <div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: ${item.color}"></div>
                ${item.seriesName}<span style="margin-right:20px"></span>${item.data}<div style="margin-top:5px"></div>
              `;
              });
            } else {
              str = str +  `
              <div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: ${params[0].color}"></div>
              ${params[0].seriesName}<span style="margin-right:20px"></span>${params[0].data}
              `
            }
            return str;
          }
        },
        grid: {
          left: 0,
          right: 10,
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
            name: '今日数据',
            type: 'line',
            color: ['#2e90ff'],
            symbol: 'none'
          },
          {
            name: '昨日数据',
            type: 'line',
            color: ['#31c38f'],
            symbol: 'none'
          },
        ]
      }
    );
    window.addEventListener('resize', () => {
      chartDataRef.resize();
    });
  }

  changeCampaignAndCreativeChart(echartsInstance, data, type) {
    let suffix;
    let today = data.y[type].today;
    let yesterday = data.y[type].yesterday;
    let max
    switch (type) {
      case 'pv':
      case 'click':
        suffix = '次';
        // max = (value) => {
        //   return value.max <= 5000 ? 5000 : Math.round(value.max);
        // }
        break;
      case 'ctr': // 100
        today = today.map(td => (td * 100).toFixed(2));
        yesterday = yesterday.map(yd => (yd * 100 || 0).toFixed(2));
        suffix = '%';
        break;
      case 'cpm': // 1000
        today = today.map(td => (td * 1000).toFixed(2));
        yesterday = yesterday.map(yd => (yd * 1000 || 0).toFixed(2));
        suffix = '元';
        break;
      case 'cpc':
      case 'admoney':
        today = today.map(td => (td * 1).toFixed(2));
        yesterday = yesterday.map(yd => (yd * 1 || 0).toFixed(2));
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
        {data: today},
        {data: yesterday},
      ]
    };
    if (max) {
      option.yAxis.max = max
    } else {
      option.yAxis.max = null;
    }
    echartsInstance.setOption(option);
  }

  ngOnInit(): void {

  }

  constructor(private _indexService: IndexService) {

  }
}
