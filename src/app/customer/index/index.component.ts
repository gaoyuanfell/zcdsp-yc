import {ChangeDetectionStrategy, ChangeDetectorRef , Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Subject} from 'rxjs';
import {IndexService} from '../../../service/customer/index.service';
import {BaseIndexComponent} from '../../common/common.component';
import {PublicService} from '../../../service/public.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,  // 数据手动刷新
  preserveWhitespaces: false,
})
export class IndexComponent extends BaseIndexComponent  implements OnInit {  // BaseIndexComponent直接一个类
  // 今日在投创意
  @ViewChild('todayCreative') todayCreativeRef: ElementRef;
  todayCreativeEcharts;
  creativeListData;
  creativeChartData;
  creativeCode = 'pv';
 // 今日在投活動
  @ViewChild('todayActivity') todayActivityRef: ElementRef;
  todayActivityEcharts;
  campaignListData;
  campaignChartData;
  campaignCode = 'pv';

  // 近期数据趋势
  dayTotalListData;
  dayTotalChartData;
  dayTotalCode = 'pv';


  constructor(
    private _indexService: IndexService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected _publicService: PublicService,
  ) {
    super(changeDetectorRef, _publicService);  // 父亲也有constructor
  }
  ngOnInit(): void {
    this.todayCreative();
    this.todayActivity();
    this.todayReportChart();
    this.todayAllDataChart();
    this.todayAllSpendChart();
    this.socialDataChart();
    this._init();
    this.initData();
  }

  _init() {
    // const countSubscribe = new Subject(); // 计数器
    // 今日在投创意
    this._indexService.creativeList().subscribe(res => {
      console.log(res)
      this.creativeListData = res.result.creatives;
      this.creativeChartData = res.result.charts;
      this.changeDetectorRef.markForCheck();
      this.changeCampaignAndCreativeChart(this.todayCreativeEcharts, this.creativeChartData, this.creativeCode);
      // countSubscribe.next();
    }, () => {
      // countSubscribe.next();
    });

    // 今日在投活動
    this._indexService.campaignList().subscribe(res => {
      this.campaignListData = res.result.campaigns;
      this.campaignChartData = res.result.charts;
      this.changeDetectorRef.markForCheck();
      this.changeCampaignAndCreativeChart(this.todayActivityEcharts, this.campaignChartData, this.campaignCode);
      // countSubscribe.next()
    }, () => {
      // countSubscribe.next()
    });

    // 近期数据趋势
    this._indexService.dayTotal().subscribe(res => {
      this.dayTotalListData = res.result.list.items;
      this.dayTotalChartData = res.result.chart;
      this.changeDetectorRef.markForCheck();
      this.changeDayTotalChart(this.todayReportEcharts, this.dayTotalChartData, this.dayTotalCode)
      // countSubscribe.next()
    }, () => {
      // countSubscribe.next()
    });
  }

  /**
   * 今日在投创意
   */
  todayCreative() {
    const todayCreativeRef = this.todayCreativeEcharts = echarts.init(this.todayCreativeRef.nativeElement);
    todayCreativeRef.setOption({
      legend: {   // 失效了
        // orient: 'horizontal', // 'vertical'
        // x: 'center', // 'center' | 'left' | {number},
        // y: 'top', // 'center' | 'bottom' | {number}
        itemWidth: 48, // 图例的宽度
        data: ['今日数据', '昨日数据'],
        // align: 'right',
        right: 0,  // 位置
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
        formatter: function (params, ticket, callback) {
          let str = '';
          str = str + params[0].axisValue + '<div style="margin-bottom:8px"></div>';  // title
          if (params.length > 1) {
            params.forEach( item => {
              // 模板字符串
              str = str + `
                <div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: ${item.color}"></div>
                ${item.seriesName}<span style="margin-right:20px"></span>${item.data}<div style="margin-top:5px"></div>
              `;
              /*str = str + '<div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: "' + params.color + ' ></div>' +
                item.seriesName + '<span style="margin-right:20px"></span>' + item.data + '<div style="margin-top:5px"></div>';*/
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
      grid: {  // 图表的
        left: 0,
        right: 10,
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,  // x轴铺满
        axisLine: {
          show: false,
          lineStyle: {
            color: '#979899'
          }
        },
        axisTick: { //  x,y轴显示线条
          show: false,
        },
        splitLine:{
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
        axisTick: { // x,y轴显示线条 线是否大于有颜色的线条
          show: false,
        },
        splitLine:{
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
    });
    // 解决浏览器伸缩造成的echarts不重复渲染
    window.addEventListener('resize', () => {
      todayCreativeRef.resize();
    });
  }


  /**
   * 今日在投活动
   */
  todayActivity() {
    const todayActivityRef = this.todayActivityEcharts = echarts.init(this.todayActivityRef.nativeElement);
    todayActivityRef.setOption({
      legend: {   // 失效了
        itemWidth: 48, // 图例的宽度
        data: ['今日数据', '昨日数据'],
        right: 0,  // 位置
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
    });
    window.addEventListener('resize', () => {
      todayActivityRef.resize();
    });
  }
}
