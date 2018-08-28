import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import {Subject} from 'rxjs';
import {IndexService} from '../../../service/agent/index.service';
import {BaseIndexComponent} from '../../common/common.component';
import {PublicService} from '../../../service/public.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush,  // 数据手动刷新
  preserveWhitespaces: true,
})
export class IndexComponent extends BaseIndexComponent  implements OnInit {  // BaseIndexComponent直接一个类


  // 近期数据趋势
  dayTotalListData;
  dayTotalChartData;
  dayTotalCode = 'pv';




  constructor(
    private _indexService: IndexService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected _publicService: PublicService,
    protected  render: Renderer2
  ) {
    super(changeDetectorRef, _publicService, render);  // 父亲也有constructor
  }
  ngOnInit(): void {
    this.render.listen('window', 'resize', (res) => {
      // res.target.innerWidth
      if (res.target.innerWidth > 1666 && res.target.innerWidth < 1920) {
        this.sexCount = 150;
      } else if (res.target.innerWidth === 1920) {
        this.sexCount = 180;
      } else if (res.target.innerWidth <= 1666) {
        this.sexCount = 123;
      }
    })

    // 上面数据的解析
    setTimeout( () => {
      this.todayReportChart();
      this._init();
      this.initData();
    },500); // 当你的echarts的宽高是百分比的时候，会出现显示不完全，延时即可
    this.todayAllDataChart();
    this.todayAllSpendChart();
    this.socialDataChart();
    this.hobbyDataChart();
    this.chinaDataChart();
    this.todayAllSpendChartSmall();
    this.todayAllSpendChartLine();

  }

  todayReportTop; //  今日曝光成本(天，小时)  今日点击成本 今日点击率
  stateCount;




  // 上面4个小方块的数据
  user;
  charts;
  totalCodeList;
  user_list: Array<any> = []; // 客户名称下拉框;
  user_state_count: any = {}; // 总计客户这块
  creative_state_count: any = {}; // 在投创意这块
  _init() {
    // const countSubscribe = new Subject(); // 计数器

    // 上面几个的初始化
    this._indexService.homeInit().subscribe((res) => {
      this.changeDetectorRef.markForCheck()
      this.user = res.result.user;
      this.user_list = res.result.user_list;
      this.totalCodeList = res.result.total_code;
      this.creative_state_count = res.result.creative_state_count;
      this.charts = res.result.charts;
      this.user_state_count = res.result.user_state_count;
    })

    // 客户列表
    this.customerList();

    // 近期数据趋势 首页中上方的4个小格子中的曝光总量 点击总量也是根据数据趋势来的
    this._indexService.dayTotal().subscribe(res => {
      this.changeDetectorRef.markForCheck();
      this.dayTotalListData = res.result.list.items; // 列表
      this.dayTotalChartData = res.result.chart;

      //  this.dayTotalChartData 这个值会变，不能用， 因为在下面数据趋势中，你点击每一天,他就是每个时间段，你点击全部他就是每一天
      //  曝光总量
      this.todayAllSpendChartSmalls.setOption(   // 这边的曝光总量是每一天的
        {
          xAxis : [
            {
              data : res.result.chart.x,
            }
          ],
          series : [
            {
              data: res.result.chart.y.pv
            }
          ]
        }
      )

      // 点击总量
      this.todayAllSpendChartLines.setOption(  // 这边的点击总量是每一天的
        {
          xAxis : [
            {
              data : res.result.chart.x,
            }
          ],
          series : [
            {
              data: res.result.chart.y.click
            }
          ]
        }
      )

      // 这边因为当只有一天的时候，可能久显示小时了，但是不管是小时还是天，都显示最后一个数字
      this.todayReportTop = {
        todayCpm : res.result.chart.y.cpm[res.result.chart.y.cpm.length - 1],
        yesCpm:  res.result.chart.y.cpm[res.result.chart.y.cpm.length - 2],
        todayCpc:  res.result.chart.y.cpc[res.result.chart.y.cpc.length - 1],
        yesCpc:  res.result.chart.y.cpc[res.result.chart.y.cpc.length - 2],
        todayCtr:  res.result.chart.y.ctr[res.result.chart.y.ctr.length - 1],
        yesCtr:  res.result.chart.y.ctr[res.result.chart.y.ctr.length - 2],
      }
      this.changeDayTotalChart(this.todayReportEcharts, this.dayTotalChartData, this.dayTotalCode)
      this.changeDayTotalList(this.dayTotalChartData)
      // countSubscribe.next()
    }, () => {
      // countSubscribe.next()
    });
  }

  /**
   * 代理-首页代理子客户状态查询列表
   */
  childList;
  childListTotal_count;
  query: any = {
    page_index: 1,
    page_size: 10,
  };
  search() {
    this.query.page_index = 1;
    this.customerList();
  }
  customerList() {
    this._indexService.childList(this.query).subscribe((res) => {
      this.childList = res.result.items;
      this.childListTotal_count = res.result.total_count;
    })
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



}
