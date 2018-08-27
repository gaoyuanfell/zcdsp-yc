import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AutoCookie} from '../../../../decorator/decorator';
import {CreativeService} from '../../../../service/customer/creative.service';
import {Dialog} from '../../../../components/dialog/dialog';
import {Notification} from '../../../../components/notification/notification';
import {Global} from '../../../../service/global';
import {ActivatedRoute, Router} from '@angular/router';
import {TableComponent} from '../../../../components/table/table.component';

@Component({
  selector: 'app-creative',
  templateUrl: './creative.component.html',
  styleUrls: ['./creative.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class CreativeComponent implements OnInit {

  @AutoCookie({
    defaultValue: {
      page_index: 1,
      page_size: 20
    },
    keepValue: {
      begin_date: new Date().calendar(3, -7).formatDate('yyyy-MM-dd'),
      end_date: new Date().formatDate('yyyy-MM-dd')
    },
  })
  query;
  other;
  total_count;
  tableList;

  audit_state_list;
  campaign_list;
  media_list;
  display_type_list;
  show_state_list;
  current_state_list;
  authList;
  authUser;
  batchUpdateMenu;
  @ViewChild('update_priceRef') update_priceRef;

  search() {
    this.query.page_index = 1;
    this.list();
  }

  exportUrl() {
    let url = this._creativeService.creativeUrl({
      ...this.query
    });
    window.open(url);
  }

  list() {
    this._creativeService.list(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
      this.other = res.result.other;
      this.changeDetectorRef.markForCheck();
    });
  }

  @ViewChild('table', {read: TableComponent}) table: TableComponent;

  // 修改状态
  updateOneShowState(data, switchRef) {
    this._creativeService.updateState({
      creative_ids: data.creative_id,
      state: data.show_state
    }).subscribe(res => {
      if (this.query.show_state) {
        this.search();
      } else {
        this.list();
      }
    }, () => {
      setTimeout(() => {
        switchRef.trigger();
        this.changeDetectorRef.markForCheck();
      }, 200);
    });
  }

  // ----------------------------------

  // 创意预览
  @ViewChild('show_creative', {read: TemplateRef}) show_creative_ref: TemplateRef<any>;
  elements;
  elementValue;

  _showCreative(data) {
    this.elements = null;
    this.elementValue = null;
    this._creativeService.creativeDetail({creative_id: data.creative_id}).subscribe(res => {
      this.elements = res.result.creative.material_elements;
      this.elementValue = res.result.creative.elements;
      this._dialog.open(this.show_creative_ref, {flag: false, title: `${data.creative_name}-预览`});
      this.changeDetectorRef.markForCheck();
    });
  }

  // 创意名称修改
  creative_name;

  _updateName(data) {
    this._creativeService.updateName({
      creative_name: this.creative_name,
      creative_id: data.creative_id,
    }).subscribe(res => {
      this.list();
    });
  }

  // 出价修改
  ad_price;

  _updateAdPrice(data) {
    this._creativeService.updatePrice({
      price: this.ad_price,
      creative_ids: data.creative_id,
    }).subscribe(res => {
      this.list();
    });
  }

  @ViewChild('update_state', {read: TemplateRef}) update_state_ref: TemplateRef<any>;
  update_state_data = {
    show_state: 1
  };

  @ViewChild('update_show_hours', {read: TemplateRef}) update_show_hours_ref: TemplateRef<any>;
  update_show_hours_data = {
    show_time_type: 0,
    show_hours: [],
  };

  @ViewChild('update_price', {read: TemplateRef}) update_price_ref: TemplateRef<any>;
  update_price_data = {
    price: 0,
  };
  _valid = false;

  // 批量修改
  batchUpdate(type) {
    let list = this.table.selectData.map(d => d.creative_id);
    if (!list.length) {
      this._notification.warning('批量修改！', '至少选择一项');
      return;
    }
    let creative_ids = list.join(',');
    switch (type) {
      case 'update_state':
        this._dialog.open(this.update_state_ref, {title: '修改状态'}).subscribe(data => {
          if (data) {
            this._creativeService.updateState({
              creative_ids,
              state: this.update_state_data.show_state
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'update_show_hours':
        this.update_show_hours_data = {
          show_time_type: 1,
          show_hours: [],
        };
        this._dialog.open(this.update_show_hours_ref, {title: '修改投放小时', async: true}).subscribe(data => {
          console.log(data);
          if (data) {
            let flag = this.update_show_hours_data.show_hours.some(item => !!item);
            if (!flag) {
              this._notification.error('提示', '投放小时不能为空！');
              return;
            } else {
              data();
            }
            this._creativeService.updateShowHours({
              creative_ids,
              show_time_type: this.update_show_hours_data.show_time_type,
              show_hours: this.update_show_hours_data.show_hours
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'update_price':
        this._valid = false;
        this.update_price_data.price = null;
        this._dialog.open(this.update_price_ref, {title: '修改出价', async: true}).subscribe((data: any) => {
          if (data) {
            if (this.update_priceRef.invalid || this.update_price_data.price > this.bid_max || this.update_price_data.price < this.bid_min) {
              this._valid = true;
              return;
            }
            data();
            this._creativeService.updatePrice({
              creative_ids,
              price: this.update_price_data.price || 0
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'submit_audit':
        this._dialog.open('是否提交审核？', {title: '提交审核'}).subscribe(data => {
          if (data) {
            this._creativeService.submitAudit({
              creative_ids
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'creative_delete':
        this._dialog.open('是否删除创意？', {title: '创意删除'}).subscribe(data => {
          if (data) {
            this._creativeService.creativeDelete({
              creative_ids
            }).subscribe(res => {
              this.search();
            });
          }
        });
        break;
      case 'creative_copy':
        this._dialog.open('是否复制被选创意？', {title: '创意复制'}).subscribe(data => {
          if (data) {
            this._creativeService.creativeCopy({
              creative_ids
            }).subscribe(res => {
              this.search();
            });
          }
        });
        break;
    }
  }

  constructor(private _creativeService: CreativeService,
              private _notification: Notification,
              private _dialog: Dialog,
              private  _global: Global,
              private changeDetectorRef: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute) {
    let params = route.snapshot.params;
    let queryParams = route.snapshot.queryParams;
    let data = route.snapshot.data;
    Object.assign(this.query, queryParams);
  }

  bid_min;
  bid_max;

  ngOnInit() {
    this.bid_min = this._global.bid_min;
    this.bid_max = this._global.bid_max;
    const obj = this.route.snapshot.data['auth'];
    this.authList = Object.keys(obj['jurisdiction_list']);
    this.authUser = obj['user'];
    this.batchUpdateMenu = obj['jurisdiction_list']['ZCMOBI_ADS_SPREAD_CREATIVE_BATCH'] ? obj['jurisdiction_list']['ZCMOBI_ADS_SPREAD_CREATIVE_BATCH']['child'].map(item => {
      return {value: item.route, label: item.name};
    }) : [];
    console.log(this.batchUpdateMenu);
    let queryParams = this.route.snapshot.queryParams;
    if (queryParams.campaign_id) {
      this.query.campaign_id = queryParams.campaign_id;
    }
    this._creativeService.init().subscribe(res => {
      this.campaign_list = res.result.campaign_list;
      this.media_list = res.result.media_list;
      this.audit_state_list = res.result.audit_state_list;
      this.display_type_list = res.result.display_type_list;

      this.current_state_list = res.result.current_state_list;
      this.show_state_list = res.result.show_state_list;
      this.changeDetectorRef.markForCheck();
    });
    this.search();
  }

}
