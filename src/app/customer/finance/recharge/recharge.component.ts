import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FinanceService} from '../../../../service/customer/finance.service';
import {Dialog} from '../../../../components/dialog/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {PopoverDirective} from '../../../../components/popover/popover.directive';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['../finance.component.less' , './recharge.component.less']
})
export class RechargeComponent implements OnInit {

  constructor(
    private _financeService: FinanceService,
    protected _dialog: Dialog,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  @ViewChild('templateRecharge', {read: TemplateRef}) templateRecharge: TemplateRef<any>;
  _popoverRef;
  @ViewChild('popover', {read: PopoverDirective}) set popoverRef(val) {
    this._popoverRef = val;
  }

  tableList: Array<any> = [];
  total_count;
  userData: any = {};
  recharge_type: Array<any> = [];
  rechargeTypeData;
  chartsData;
  money; // 修改预算
  authList;
  authUser;

  isPermit(type) {
    return this.authList.indexOf(type) > -1
  }

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
    console.log('jajaj')
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

  postBudget() {
    if (this.money) {
      this._financeService.dayMoneyUpdate({money: Number(Number(this.money).toFixed(2))}).subscribe(res => {
        if (res.success === 200) {
          this.init();
        }
      })
    }
  }


  recharge() {
    this._dialog.open(this.templateRecharge, {title: '充值流程', flag: false}).subscribe(data => {
    });
  }

}
