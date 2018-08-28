import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2, TemplateRef} from '@angular/core';
import {Subject} from 'rxjs';
import {IndexService} from '../../../service/customer/index.service';
import {BaseIndexComponent} from '../../common/common.component';
import {PublicService} from '../../../service/public.service';
import {ActivatedRoute} from '@angular/router';
import {Dialog} from '../../../components/dialog/dialog';
import {bufferCount} from 'rxjs/operators';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,  // 数据手动刷新
  preserveWhitespaces: true,
})
export class IndexComponent extends BaseIndexComponent  implements OnInit {  // BaseIndexComponent直接一个类
  // 今日在投创意
  @ViewChild('todayCreative') todayCreativeRef: ElementRef;
  todayCreativeEcharts;
  creativeListData;
  creativeChartData;

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

  // 上面4个小方块的数据
  userData;
  chartsData;


  constructor(
    private _indexService: IndexService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected _publicService: PublicService,
    protected  render: Renderer2,
    protected route: ActivatedRoute,
    protected _dialog: Dialog,
  ) {
    super(changeDetectorRef, _publicService, render, route);  // 父亲也有constructor
  }
  ngOnInit(): void {

    if (this.new_user) {
      this._indexService.init().subscribe(res => {
        this.userData = res.result.user;
      });
      this.notData()  // 当true 不显示首页上面数据 直接显示引导语和相同部分
    } else {
      this.hasData()  // 当false 显示首页上方数据和相同部分
    }

    this.resizeFun();
  }
  notData() {
    this._showData();
  }
  hasData(){
    // 上面数据的解析
    setTimeout( () => {
      this.todayCreative();
      this.todayActivity();
      this.todayReportChart();
      this.todayAllSpendChartSmall();
      this.todayAllSpendChartLine();
      this._init();
      this._showData();
    },500); // 当你的echarts的宽高是百分比的时候，会出现显示不完全，延时即可
  }


  totalCodeList;
  stateCount;
  _init() {
    const countSubscribe = new Subject(); // 计数器

    // 上面几个的初始化
    this._indexService.init().subscribe(res => {
      this.totalCodeList = res.result.total_code;
      this.chartsData = res.result.charts;
      this.stateCount = res.result.creative_state_count;
      countSubscribe.next();
    }, () => {
      countSubscribe.next();
    });

    // 今日在投创意
    this._indexService.creativeList().subscribe(res => {
      this.creativeListData = res.result.creatives;
      this.creativeChartData = res.result.charts;
      this.changeCampaignAndCreativeChart(this.todayCreativeEcharts, this.creativeChartData, this.creativeCode);
      // 数据处理 为了匹配表格
      this.changeCampaignAndCreativeList(this.creativeChartData, this.creativeCode, 'creative');
      countSubscribe.next();
    }, () => {
      countSubscribe.next();
    });

    // 今日在投活動
    this._indexService.campaignList().subscribe(res => {
      this.campaignListData = res.result.campaigns;
      this.campaignChartData = res.result.charts;
      this.changeCampaignAndCreativeChart(this.todayActivityEcharts, this.campaignChartData, this.campaignCode);
      this.changeCampaignAndCreativeList(this.campaignChartData, this.campaignCode, 'campaign');
      countSubscribe.next()
    }, () => {
      countSubscribe.next()
    });

    // 近期数据趋势 首页中上方的4个小格子中的曝光总量 点击总量也是根据数据趋势来的
    this._indexService.dayTotal().subscribe(res => {
      this.dayTotalListData = res.result.list.items; // 列表
      this.dayTotalChartData = res.result.chart;
      // 对于处理的上面的 曝光总量 点击总量 2个小块块
      this.dayTotalUp(res);
      this.changeDayTotalChart(this.todayReportEcharts, this.dayTotalChartData, this.dayTotalCode)
      this.changeDayTotalList(this.dayTotalChartData)
      countSubscribe.next()
    }, () => {
      countSubscribe.next()
    });

    countSubscribe.pipe(
      bufferCount(4)
    ).subscribe(() => {
      this.changeDetectorRef.markForCheck();
    })
  }


  /**
   *   创意点击事件
   */
  _creativeData;
  creative_change = 'line'; // 类型切
  _creativeListClick(id?) {
    this._indexService.creativeChart({creative_id: id}).subscribe(res => {
      this.creativeChartData = res.result;
      this.changeCampaignAndCreativeChart(this.todayCreativeEcharts, this.creativeChartData, this.creativeCode);
      this.changeCampaignAndCreativeList(this.creativeChartData, this.creativeCode, 'creative');
      this.changeDetectorRef.markForCheck();
    });
  }


  /**
   *  活动点击事件
   */
  _campaignData;
  campaign_change = 'line'
  _campaignListClick(id?) {
    this._indexService.campaignChart({campaign_id: id}).subscribe(res => {
      this.campaignChartData = res.result;
      this.changeCampaignAndCreativeChart(this.todayActivityEcharts, this.campaignChartData, this.campaignCode);
      this.changeCampaignAndCreativeList(this.campaignChartData, this.campaignCode, 'campaign');
      this.changeDetectorRef.markForCheck();
    });
  }

  /**
   * 日期列表点击行，小时图表接口
   */
  _dayTotal;
  dayTotal_change = 'line';
  _dayTotalClick(date?) {
    if (!date) {
      this._indexService.dayTotal().subscribe(res => {
        this.dayTotalChartData = res.result.chart;
        this.changeDayTotalChart(this.todayReportEcharts, this.dayTotalChartData, this.dayTotalCode);
        this.changeDetectorRef.markForCheck();
      });
    } else {
      this._indexService.hourChart({date: date}).subscribe((res) => {
        this.dayTotalChartData = res.result;
        this.changeDayTotalChart(this.todayReportEcharts, this.dayTotalChartData, this.dayTotalCode);
        this.changeDetectorRef.markForCheck();
      })
    }

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
    todayActivityRef.setOption(
      {
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

  @ViewChild('templateRecharge', {read: TemplateRef}) templateRecharge: TemplateRef<any>;
  recharge() {
    this._dialog.open(this.templateRecharge, {title: '充值流程', flag: false})
  }




}
