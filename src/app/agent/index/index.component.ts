import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2, TemplateRef} from '@angular/core';
import {Subject} from 'rxjs';
import {IndexService} from '../../../service/agent/index.service';
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

  constructor(
    private _indexService: IndexService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected _publicService: PublicService,
    protected  render: Renderer2,
    protected route: ActivatedRoute,
    private _dialog: Dialog, // alt + enter
  ) {
    super(changeDetectorRef, _publicService, render, route);  // 父亲也有constructor
  }
  // 近期数据趋势
  dayTotalListData;
  dayTotalChartData;
  dayTotalCode = 'pv';

  ngOnInit(): void {
    if (this.new_user) {
      this.notData()  // 当true 不显示首页上面数据 直接显示引导语和相同部分
    } else {
      this.hasData()  // 当false 显示首页上方数据和相同部分
    }

    // 在性别那块的小方格上 窗口变化的
   this.resizeFun();
  }

  notData() {
    this._showData();
  }
  hasData(){
    // 上面数据的解析
    setTimeout( () => {
      // this.todayReportChart();
      this.todayAllSpendChartSmall();
      this.todayAllSpendChartLine();
      this._init();
      this._showData();
    },500); // 当你的echarts的宽高是百分比的时候，会出现显示不完全，延时即可
  }


  stateCount;
  // 上面4个小方块的数据
  user;
  charts;
  totalCodeList;
  user_list: Array<any> = []; // 客户名称下拉框;
  user_state_count: any = {}; // 总计客户这块
  creative_state_count: any = {}; // 在投创意这块
  dayTotalTitle;
  _init() {
    const countSubscribe = new Subject(); // 计数器

    // 上面几个的初始化
    this._indexService.homeInit().subscribe((res) => {
      this.user = res.result.user;
      this.user_list = res.result.user_list;
      this.user_list.forEach(item => {
        item.nick_user = item.nick_name + item.user_name
      })
      this.totalCodeList = res.result.total_code;
      this.creative_state_count = res.result.creative_state_count;
      this.charts = res.result.charts;
      this.user_state_count = res.result.user_state_count;
      countSubscribe.next()
    },() => {
      countSubscribe.next()
    })

    // 客户列表
    this.customerList('all');

    // 近期数据趋势 首页中上方的4个小格子中的曝光总量 点击总量也是根据数据趋势来的
    this._indexService.dayTotal().subscribe(res => {
      this.dayTotalListData = res.result.list.items; // 列表
      this.dayTotalChartData = res.result.chart;
      this.dayTotalTitle = res.result.title;
      setTimeout( ()=> {
        this.todayReportChart();
        // 对于处理的上面的 曝光总量 点击总量 2个小块块
        this.dayTotalUp(res)
        this.changeDayTotalChart(this.todayReportEcharts, this.dayTotalChartData, this.dayTotalCode, this.dayTotalTitle)
        this.changeDayTotalList(this.dayTotalChartData)
      },500)
      countSubscribe.next()
    }, () => {
      countSubscribe.next()
    });

    countSubscribe.pipe(
      bufferCount(2)
    ).subscribe(() => {
      this.changeDetectorRef.markForCheck();
    })
  }

  /**
   * 代理-首页代理子客户状态查询列表
   */
  childList;
  childListTotal_count;
  query: any = {
    page_index: 1,
    page_size: 20,
  };
  search() {
    this.query.page_index = 1;
    this.customerList();
  }
  childTotal;
  customerList(all?) {
      this._indexService.childList(this.query).subscribe((res) => {
        this.changeDetectorRef.markForCheck();
        if (all) {
          this.childTotal = res.result.items;
        }
        this.childList = res.result.items;
        this.childListTotal_count = res.result.total_count;
      })
  }

  /**
   * 日期列表点击行，小时图表接口  调的接口不同
   */
  _dayTotal = null;
  dayTotal_change = 'line';
  _dayTotalClick(date?) {
    if (!date) {
      this._indexService.dayTotal().subscribe(res => {
        this.dayTotalChartData = res.result.chart;
        this.changeDayTotalChart(this.todayReportEcharts, this.dayTotalChartData, this.dayTotalCode, this.dayTotalTitle);
        this.changeDetectorRef.markForCheck();
      });
    } else {
      this._indexService.hourChart({date: date}).subscribe((res) => {
        this.dayTotalChartData = res.result;
        this.changeDayTotalChart(this.todayReportEcharts, this.dayTotalChartData, this.dayTotalCode, date);
        this.changeDetectorRef.markForCheck();
      })
    }

  }
  // 充值流程
  @ViewChild('templateRecharge', {read: TemplateRef}) templateRecharge: TemplateRef<any>;
  recharge() {
    this._dialog.open(this.templateRecharge, {title: '充值流程', flag: false}).subscribe(data => {
    });
  }


  sublogin(user_id, type = '') {
    // 浏览器出现拦截 先在异步外面打开页面
    const tem = window.open(); // 先打开页面
    this._publicService.sublogin({user_id: user_id}).subscribe(res => {
        if (res.success === 200) {
          tem.location.href = type ? this._publicService.goAct({token: res.result}) : this._publicService.goHome({token: res.result})
        }
      },
      () => {
        tem.close()
      }
    )
  }


}
