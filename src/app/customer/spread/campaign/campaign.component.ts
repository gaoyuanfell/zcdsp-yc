import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AutoCookie} from '../../../../decorator/decorator';
import {ActivatedRoute, Router} from '@angular/router';
import {Global} from '../../../../service/global';
import {Dialog} from '../../../../components/dialog/dialog';
import {Notification} from '../../../../components/notification/notification';
import {CampaignService} from '../../../../service/customer/campaign.service';
import {TableComponent} from '../../../../components/table/table.component';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.less']
})
export class CampaignComponent implements OnInit {

  @AutoCookie({
    defaultValue: {
      page_index: 1,
      page_size: 30
    },
    keepValue: {
      begin_date: new Date().calendar(2, -1).formatDate('yyyy-MM-dd'),
      end_date: new Date().formatDate('yyyy-MM-dd')
    }
  })
  query;
  other;
  total_count;

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
    })
  }

  ////*******************************///

  @ViewChild('table', {read: TableComponent}) table: TableComponent

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

  private _batch_moneyRef
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
        switchRef.trigger()
        this.changeDetectorRef.markForCheck()
      }, 200)
    })
  }

  // 修改活动名称
  campaign_name

  _updateName(data, ref) {
    if (!this.campaign_name) {
      this._notification.warning('修改活动名称', '请填写活动名称！');
      return
    }
    ref.close();
    this._campaignService.updateName({
      campaign_name: this.campaign_name,
      campaign_id: data.campaign_id,
    }).subscribe(res => {
      this.list();
    })
  }

  // 修改每日预算
  day_budget

  _updateDayBudget(data, ref) {
    ref.close();
    this._campaignService.batchUpdateBudget({
      campaign_ids: data.campaign_id,
      new_budget: this.day_budget
    }).subscribe(res => {
      this.list();
    })
  }

  // 修改出价
  ad_price

  _updateAdPrice(data, ref) {
    ref.close();
    this._campaignService.batchUpdatePrice({
      campaign_ids: data.campaign_id,
      new_price: this.ad_price,
    }).subscribe(res => {
      this.list();
    })
  }

  _valid;
  admoneyTotal; // 所选活动总共的花费
  batchUpdate(type) {
    let list = this.table.selectData.map(d => d.campaign_id);
    if (!list.length) {
      this._notification.warning('批量修改！', '至少选择一项')
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
                return
              } else {
                data()
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
            })
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
            })
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
            })
          }
        })
        break;
      case 'batch_delete':
        this._dialog.open('是否删除被选活动？', {title: '活动删除'}).subscribe(data => {
          if (data) {
            this._campaignService.batchDelete({
              campaign_ids
            }).subscribe(res => {
              this.search()
            })
          }
        })
        break;
      case 'batch_update_price':
        this._valid = false;
        this.batch_price_data.new_price = null
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
            })
          }
        });
        break;
      case 'batch_update_show_state':
        this.batch_price_state.new_show_state = 1
        this._dialog.open(this.batch_update_show_state_ref, {title: '修改状态'}).subscribe(data => {
          if (data) {
            this._campaignService.batchUpdateState({
              campaign_ids,
              new_show_state: this.batch_price_state.new_show_state
            }).subscribe(res => {
              this.search();
            })
          }
        })
        break;
      case 'batch_update_budget':
        this._valid = false;
        this.batch_budget_state.new_budget = null;
        this.admoneyTotal = 0;
        this._campaignService.get_day_consume({campaign_ids: list.join(',')}).subscribe(res => {
          this.admoneyTotal = res.result;
          this.changeDetectorRef.markForCheck()  // 强制行刷新 input框中使用了admoneyTotal这个变量，可能导致input这个dom有问题，导致_batch_moneyRef有问题
          this._dialog.open(this.batch_update_budget_ref, {title: '修改预算', async: true}).subscribe((data: any) => {
            if (data) {
              console.dir(this._batch_moneyRef)
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
              })
            }
          });
        })
        break;
      case 'batch_copy':
        this._dialog.open('是否复制被选活动？', {title: '活动复制'}).subscribe(data => {
          if (data) {
            this._campaignService.batchCopy({
              campaign_ids
            }).subscribe(res => {
              this.search()
            })
          }
        })
        break;
    }
  }

  // 拿到数据后再弹框
  admoney

  popoverOpen(ref, data) {
    this._campaignService.get_day_consume({campaign_ids: data.campaign_id}).subscribe(res => {
      this.admoney = res.result;
      ref.open()
    })
  }

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute,
              private _notification: Notification,
              private  _global: Global,
              private _dialog: Dialog,
              private _campaignService: CampaignService) {
    let params = route.snapshot.params;
    let queryParams = route.snapshot.queryParams;
    let data = route.snapshot.data;
  }

  bid_min;
  bid_max;

  ngOnInit() {
    this.bid_min = this._global.bid_min;
    this.bid_max = this._global.bid_max;

    const obj = this.route.snapshot.data['auth'];
    this.authList = Object.keys(obj['jurisdiction_list']);
    this.authUser = obj['user'];

    // 批量修改所拥有的权限
    this.batchUpdateMenu = obj['jurisdiction_list']['ZCMOBI_ADS_SPREAD_CAMPAIGN_BATCH'] ? obj['jurisdiction_list']['ZCMOBI_ADS_SPREAD_CAMPAIGN_BATCH']['child'].map(item => {
      return {value: item.route, label: item.name}
    }) : [];

    this._campaignService.init().subscribe(res => {
      this.current_state_list = res.result.current_state_list;
      this.show_state_list = res.result.show_state_list;
    });
    this.list()
  }

}
