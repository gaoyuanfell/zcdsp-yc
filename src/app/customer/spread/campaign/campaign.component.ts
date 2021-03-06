import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AutoCookie} from '../../../../decorator/decorator';
import {ActivatedRoute, Router} from '@angular/router';
import {Global} from '../../../../service/global';
import {Dialog} from '../../../../components/dialog/dialog';
import {Notification} from '../../../../components/notification/notification';
import {CampaignService} from '../../../../service/customer/campaign.service';
import {TableComponent} from '../../../../components/table/table.component';
import {Sidebar, YC_SIDEBAR_DATA} from '../../../../components/sidebar/sidebar';
import {hoursFormat} from '../../../../service/util';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class CampaignComponent implements OnInit {

  @AutoCookie({
    defaultValue: {
      page_index: 1,
      page_size: 20
    },
    keepValue: {
      begin_date: new Date().formatDate('yyyy-MM-dd'),
      end_date: new Date().formatDate('yyyy-MM-dd')
    }
  })
  query;
  other;
  total_count;
  datepicker;

  current_state_list;
  show_state_list;
  tableList;
  authList;
  authUser;
  batchUpdateMenu;

  search() {
    this.query.page_index = 1;
    this.list();
  }

  exportUrl() {
    let url = this._campaignService.campaignUrl({
      ...this.query
    });
    window.open(url);
  }

  list() {
    this._campaignService.list(this.query).subscribe(res => {
      this.other = res.result.other;
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
      this.changeDetectorRef.markForCheck();
    });
  }

  triggerlist() {
   // 增加的那一条  是在第一页的
    this.search();
  }

  refresh() {
    Object.keys(this.query).forEach(key => {
      let list = ['page_index', 'page_size', 'begin_date', 'end_date'];
      if (!!~list.indexOf(key)) return;
      Reflect.deleteProperty(this.query, key);
    });

    let [begin_date, end_date] = this.datepicker = [
      new Date().formatDate('yyyy-MM-dd'),
      new Date().formatDate('yyyy-MM-dd')
    ];
    this.query.begin_date = begin_date;
    this.query.end_date = end_date;

    this.search();
  }

  get containerFullRef() {
    return this._global.containerFullRef;
  }

  ////*******************************///

  @ViewChild('ycTable', {read: TableComponent}) table: TableComponent;

  @ViewChild('batch_update_show_hours', {read: TemplateRef}) batch_update_show_hours_ref: TemplateRef<any>;
  batch_show_hours_data = {
    show_time_type: 0,
    show_hours: []
  };

  @ViewChild('batch_update_begin_end_date', {read: TemplateRef}) batch_update_begin_end_date_ref: TemplateRef<any>;
  batch_begin_end_data = {
    begin_date: new Date(),
    end_date: new Date()
  };

  @ViewChild('batch_update_speed', {read: TemplateRef}) batch_update_speed_ref: TemplateRef<any>;
  batch_speed_data = {
    new_speed: 1
  };

  @ViewChild('batch_update_price', {read: TemplateRef}) batch_update_price_ref: TemplateRef<any>;
  batch_price_data = {
    new_price: null
  };

  @ViewChild('batch_update_show_state', {read: TemplateRef}) batch_update_show_state_ref: TemplateRef<any>;
  batch_price_state = {
    new_show_state: 1
  };

  @ViewChild('batch_update_budget', {read: TemplateRef}) batch_update_budget_ref: TemplateRef<any>;
  batch_budget_state = {
    new_budget: null
  };

  private _new_priceRef;
  @ViewChild('new_priceRef') set new_priceRef(val) {
    this._new_priceRef = val;
  };

  get new_priceRef() {
    return this._new_priceRef;
  }

  private _batch_moneyRef;
  @ViewChild('batch_moneyRef') set batch_moneyRef(val) {
    this._batch_moneyRef = val;
  };

  get batch_moneyRef() {
    return this._batch_moneyRef;
  }

  updateOneShowState(data, switchRef) {
    this._campaignService.batchUpdateState({
      campaign_ids: data.campaign_id,
      new_show_state: data.show_state
    }).subscribe(res => {
      // if (this.query.show_state) {
      //   this.search();
      // } else {
      //   this.list();
      // }
    }, () => {
      setTimeout(() => {
        switchRef.trigger();
        this.changeDetectorRef.markForCheck();
      }, 200);
    });
  }

  // 修改活动名称
  campaign_name;

  _updateName(data, ref) {
    if (!this.campaign_name) {
      this._notification.warning('修改活动名称', '请填写活动名称！');
      return;
    }
    ref.close();
    this._campaignService.updateName({
      campaign_name: this.campaign_name,
      campaign_id: data.campaign_id,
    }).subscribe(res => {
      this.list();
    });
  }

  // 修改每日预算
  day_budget;

  _updateDayBudget(data, ref) {
    ref.close();
    this._campaignService.batchUpdateBudget({
      campaign_ids: data.campaign_id,
      new_budget: this.day_budget
    }).subscribe(res => {
      this.list();
    });
  }

  // 修改出价
  ad_price;

  _updateAdPrice(data, ref) {
    ref.close();
    this._campaignService.batchUpdatePrice({
      campaign_ids: data.campaign_id,
      new_price: this.ad_price,
    }).subscribe(res => {
      this.list();
    });
  }

  _valid;
  admoneyTotal; // 所选活动总共的花费
  batchUpdate(type) {
    let list = this.table.selectData.map(d => d.campaign_id);
    if (!list.length) {
      this._notification.warning('批量修改！', '请至少选择一条活动');
      return;
    }
    let campaign_ids = list.join(',');
    switch (type) {
      case 'batch_update_show_hours':
        this.batch_show_hours_data = {
          show_time_type: 0,
          show_hours: []
        };
        this._dialog.open(this.batch_update_show_hours_ref, {title: '修改投放小时', async: true}).subscribe((data: any) => {
          if (data) {
            if (this.batch_show_hours_data.show_time_type === 1) {
              let flag = this.batch_show_hours_data.show_hours.some(item => !!item);
              if (!flag) {
                this._notification.error('提示', '投放小时不能为空！');
                return;
              } else {
                data();
              }
            } else {
              data();
            }
            this._campaignService.batchUpdateHours({
              campaign_ids: campaign_ids,
              show_time_type: this.batch_show_hours_data.show_time_type,
              show_hours: this.batch_show_hours_data.show_time_type == 1 ? this.batch_show_hours_data.show_hours : null
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'batch_update_begin_end_date':
        this.batch_begin_end_data = {
          begin_date: new Date(),
          end_date: new Date()
        };
        this._dialog.open(this.batch_update_begin_end_date_ref, {title: '修改投放日期'}).subscribe(data => {
          if (data) {
            this._campaignService.batchUpdateBeginEndDate({
              campaign_ids: campaign_ids,
              ...this.batch_begin_end_data
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'batch_update_speed':
        this.batch_speed_data.new_speed = 1;
        this._dialog.open(this.batch_update_speed_ref, {title: '修改投放速度'}).subscribe(data => {
          if (data) {
            this._campaignService.batchUpdateSpeed({
              new_speed: this.batch_speed_data.new_speed,
              campaign_ids: campaign_ids
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'batch_delete':
        this._dialog.open('是否删除被选活动？', {title: '活动删除'}).subscribe(data => {
          if (data) {
            this._campaignService.batchDelete({
              campaign_ids
            }).subscribe(res => {
              this.search();
            });
          }
        });
        break;
      case 'batch_update_price':
        this._valid = false;
        this.batch_price_data.new_price = null;
        this._dialog.open(this.batch_update_price_ref, {title: '修改出价', async: true}).subscribe((data: any) => {
          if (data) {
            if (this.new_priceRef.invalid || this.batch_price_data.new_price > this.bid_max || this.batch_price_data.new_price < this.bid_min) {
              this._valid = true;
              return;
            }
            data();
            this._campaignService.batchUpdatePrice({
              campaign_ids,
              new_price: this.batch_price_data.new_price || 0,
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'batch_update_show_state':
        this.batch_price_state.new_show_state = 1;
        this._dialog.open(this.batch_update_show_state_ref, {title: '修改状态'}).subscribe(data => {
          if (data) {
            this._campaignService.batchUpdateState({
              campaign_ids,
              new_show_state: this.batch_price_state.new_show_state
            }).subscribe(res => {
              this.search();
            });
          }
        });
        break;
      case 'batch_update_budget':
        this._valid = false;
        this.batch_budget_state.new_budget = null;
        this.admoneyTotal = 0;
        this._campaignService.get_day_consume({campaign_ids: list.join(',')}).subscribe(res => {
          this.admoneyTotal = res.result;
          this.changeDetectorRef.markForCheck();  // 强制行刷新 input框中使用了admoneyTotal这个变量，可能导致input这个dom有问题，导致_batch_moneyRef有问题
          this._dialog.open(this.batch_update_budget_ref, {title: '修改预算', async: true}).subscribe((data: any) => {
            if (data) {
              console.dir(this._batch_moneyRef);
              if (this.batch_moneyRef.invalid || this.batch_budget_state.new_budget < (100 + this.admoneyTotal)) {
                this._valid = true;
                return;
              }
              data();
              this._campaignService.batchUpdateBudget({
                campaign_ids,
                new_budget: this.batch_budget_state.new_budget
              }).subscribe(res => {
                this.list();
              });
            }
          });
        });
        break;
      case 'batch_copy':
        this._dialog.open('是否复制被选活动？', {title: '活动复制'}).subscribe(data => {
          if (data) {
            this._campaignService.batchCopy({
              campaign_ids
            }).subscribe(res => {
              this.search();
            });
          }
        });
        break;
    }
  }

  // 拿到数据后再弹框
  admoney;

  popoverOpen(ref, data) {
    this._campaignService.get_day_consume({campaign_ids: data.campaign_id}).subscribe(res => {
      this.admoney = res.result;
      ref.open();
    });
  }

  ///////// *********************************** 显示活动详情  ****************************************** /////////
  openCampaignDetail(data) {
    forkJoin([
      this._campaignService.campaignDetail({campaign_id: data.campaign_id}),
      this._campaignService.charData({campaign_id: data.campaign_id}),
    ]).subscribe(([campaignRes, campaignChartRes]) => {
      this._sidebar.open(CampaignDetailComponent, {
        data: {
          campaignData: campaignRes.result,
          chartData: campaignChartRes.result
        }
      });
    });
  }

  jurisdiction
  user

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute,
              private _notification: Notification,
              private _global: Global,
              private _dialog: Dialog,
              private _sidebar: Sidebar,
              private _campaignService: CampaignService) {
    let params = route.snapshot.params;
    let queryParams = route.snapshot.queryParams;
    let data = route.snapshot.data
    this.jurisdiction = route.snapshot.data.auth.jurisdiction_list;
    this.user = route.snapshot.data.auth.user;
    if(this.jurisdiction.ZCMOBI_ADS_SPREAD_CAMPAIGN_BATCH){
      this.batchUpdateMenu = this.jurisdiction.ZCMOBI_ADS_SPREAD_CAMPAIGN_BATCH.child.map(item => {
        return {value: item.route, label: item.name};
      })
    }
  }

  bid_min;
  bid_max;

  ngOnInit() {
    this.bid_min = this._global.bid_min;
    this.bid_max = this._global.bid_max;

    this._campaignService.init().subscribe(res => {
      this.current_state_list = res.result.current_state_list;
      this.show_state_list = res.result.show_state_list;
    });
    this.list();
  }

}


@Component({
  selector: 'campaign-detail',
  styles: [
      `
      .chart-box {
        position: relative;
        width: 100%;
        height: 300px;
      }

      .chart-box .tool {
        position: absolute;
        right: 10px;
        top: 0;
        z-index: 1;
      }

      .chart-box .chart-data {
        width: 100%;
        height: 100%;
      }

      .mini-input {
        border: 1px solid #ccc;
      }
    `
  ],
  templateUrl: 'campaign-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class CampaignDetailComponent implements OnInit, OnDestroy {

  edit = false;

  ngOnDestroy(): void {

  }


  ngOnInit(): void {
    this.chartData();
    this._changeCampaignAndCreativeChart(this.chartDataInstance, this.creativeChartData, this.campaignCode);
  }

  constructor(@Inject(YC_SIDEBAR_DATA) public data: any, private _campaignService: CampaignService, private changeDetectorRef: ChangeDetectorRef) {

    this.campaignData = data.campaignData;
    this.campaign = data.campaignData.campaign;
    this.creativeChartData = data.chartData;

    this.creativeList = this.campaignData.creatives;
    this.show_hours_today = this.campaignData.show_hours_today;
    if (this.show_hours_today) {
      this.show_hour_today_format = hoursFormat(this.show_hours_today).join(' ');
    } else {
      this.show_hour_today_format = undefined;
    }
    this.show_time_type = this.campaignData.show_time_type;
    this.orientationValue = this.campaignData.orientation_name_values;

    this.campaignChartDataList = this.changeDayTotalList(this.creativeChartData);
  }

  // 显示活动详情
  @ViewChild('campaignDetail', {read: TemplateRef}) campaignDetailRef: TemplateRef<any>;

  show_hours_today;
  show_hour_today_format;
  orientationValue;
  creativeList;
  campaignData: any = {};
  campaign: any = {};
  show_time_type;

  campaignCode = 'pv';
  chartDataInstance;
  creativeChartData;
  @ViewChild('chartData') chartDataRef: ElementRef;

  isChart = true;
  campaignChartDataList;

  ///------------------------------ 详情修改

  startList: Array<any> = Array.from({length: 24}).map((a, b) => ({label: b, value: b}));
  endList: Array<any> = Array.from({length: 24}).map((a, b) => ({label: b, value: b}));

  startData;
  endData;

  startListChange() {
    this.endList = Array.from({length: 24}).map((a, b) => {
      let data = {label: b, value: b, disabled: false};
      if (this.startData > b) {
        data.disabled = true;
      }
      return data;
    });
  }

  cancel() {
    this.edit = false;
  }

  save() {
    let campaign = {
      campaign_id: this.campaign.campaign_id,
      campaign_name: this.campaign.campaign_name,
      ad_price: this.campaign.ad_price,
      day_budget: this.campaign.day_budget,
      begin_date: this.campaign.begin_date,
      end_date: this.campaign.end_date,
    };

    let body: any = {
      campaign: campaign,
    };

    if (!isNaN(+this.startData) && !isNaN(+this.endData)) {
      let today_show_hours = Array.from({length: 24}).map((a, b) => {
        if (this.startData <= b && this.endData >= b) {
          return 1;
        }
        return 0;
      });
      body.today_show_hours = today_show_hours;
    }

    this._campaignService.campaignDetailUpdate(body).subscribe(res => {
      this.edit = false;
      this.changeDetectorRef.markForCheck();
    });
  }

  changeDayTotalList(chartDatas) {
    let x = chartDatas.x;
    let y = chartDatas.y;
    let list = [];
    x.forEach((item, index) => {
      list.push({
        'time': x[index],
        'admoney': y.admoney[index],
        'click': y.click[index],
        'cpc': y.cpc[index],
        'cpm': y.cpm[index],
        'ctr': y.ctr[index],
        'pv': y.pv[index]
      });
    });
    return list;
  }

  /**
   * 今日在投创意 今日在投活动 类型切换
   * @param echartsInstance
   * @param data
   * @param type
   */
  _changeCampaignAndCreativeChart(echartsInstance, data, type) {  // echarts 表单数组
    if (!data) return;
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
    };

    if (max) {
      option.yAxis.max = max;
    } else {
      option.yAxis.max = null;
    }

    echartsInstance.setOption(option);
  }

  chartData() {
    const chartDataRef = this.chartDataInstance = echarts.init(this.chartDataRef.nativeElement);
    chartDataRef.setOption({
      title: {
        text: '实时数据',
        textStyle: {
          fontWeight: 700,
          fontSize: 16,
          color: '#616366',
          align: 'left'
        },
        padding: 0
      },
      color: ['#2e90ff', '#ffa542'],
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
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
          formatter: '{value} 次'
        }
      },
      series: [
        {
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210],
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
