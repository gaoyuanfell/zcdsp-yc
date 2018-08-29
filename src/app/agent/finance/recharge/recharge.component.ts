import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FinanceService} from '../../../../service/agent/finance.service';
import {Dialog} from '../../../../components/dialog/dialog';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.less']
})
export class RechargeComponent implements OnInit {
  @ViewChild('templateRecharge', {read: TemplateRef}) templateRecharge: TemplateRef<any>;

  constructor(
    protected _dialog: Dialog,
    private _financeService: FinanceService,
    private route: ActivatedRoute
  ) {
  }

  tableList: Array<any> = [];
  total_count;
  userData;
  recharge_type;
  rechargeTypeData;
  chartsData;
  authList;
  authUser;

  ngOnInit() {
    const obj = this.route.snapshot.data['auth'];
    this.authList = Object.keys(obj['jurisdiction_list']);
    this.authUser = obj['user'];
    this.init();
    this.list();
  }

  query: any = {
    page_index: 1,
    page_size: 10,
    begin_date: new Date().calendar(2, -1).formatDate('yyyy-MM-dd'),
    end_date: new Date().formatDate('yyyy-MM-dd'),
  };

  search() {
    if (this.recharge_type) {
      this.query.recharge_type = this.recharge_type.join(',');
    } else {
      delete  this.query.recharge_type;
    }
    this.query.page_index = 1;
    this.list();
  }

  list() {
    this._financeService.rechargeList(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
    })
  }

  init() {
    this._financeService.rechargeInit().subscribe(res => {
      this.userData = res.result.user;
      this.rechargeTypeData = res.result.recharge_type_list;
      this.chartsData = res.result.charts;
    })
  }

  exportUrl() {
    let url = this._financeService.rechargeExport({
      ...this.query
    });
    window.open(url);
  }

  recharge() {
    this._dialog.open(this.templateRecharge, {title: '充值流程', flag: false}).subscribe(data => {
      if (data) {

      }
    });
  }

}
