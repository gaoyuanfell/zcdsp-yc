import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FinanceService} from '../../../../service/agent/finance.service';
import {Dialog} from '../../../../components/dialog/dialog';
import {ActivatedRoute} from '@angular/router';
import {Notification} from '../../../../components/notification/notification';

@Component({
  selector: 'app-usercharge',
  templateUrl: './usercharge.component.html',
  styleUrls: ['./usercharge.component.less']
})

export class UserchargeComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    window['test'] = this
  }

  constructor(
    private _financeService: FinanceService,
    private _dialog: Dialog,
    private route: ActivatedRoute,
    private _notification: Notification,
  ) {
  }

  tableList: Array<any> = [];
  total_count;
  userData;
  userList: Array<any> = [];
  current_money;
  // 这边直接使用any属性
  form: any = {
    user_id: '',
    user_name: '',
    money: '',
    transfer_type: 0,
    description: ''
  };
  listMoney;  // 列表客户  的余额
  loginMoney;   // 登入客户  的余额
  authList;
  authUser;
  query: any = {
    page_index: 1,
    page_size: 10
  }
  @ViewChild('transferIn_template', {read: TemplateRef}) transferIn_template_ref: TemplateRef<any>;
  @ViewChild('transForm') transFormRef;

  ngOnInit() {
    const obj = this.route.snapshot.data['auth'];
    this.authList = Object.keys(obj['jurisdiction_list']);
    this.authUser = obj['user'];
    this.init();
    this.list();
  }

  search() {
    this.query.page_index = 1;
    this.list();
  }

  list() {
    this._financeService.consumeList(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
    })
  }

  init() {
    this._financeService.consumeInit().subscribe(res => {
      this.userData = res.result.user;
      this.userList = res.result.user_list
    })
  }

  exportUrl() {
    let url = this._financeService.consumeExport({
      ...this.query
    });
    window.open(url);
  }

  /**
   // 转入转出的业务逻辑
   // 登录用户=》A
   // 列表
   // a1   -> 转入  A 减去操作金额，a1 加上操作金额   init: user_id = a1,   {a1:余额},A：余额} =>A:余额
   // a1   -> 转出  a1 减去操作金额，A 加上操作金额   init: user_id = a1,   {a1:余额,A：余额} =>a1:余额
   */
  valid = false;
  transfer(id, name, type) {
    this.form = {};
    this.valid = false;
    this.form.user_id = id;
    this.form.user_name = name;
    this.form.transfer_type = type;
    this._financeService.transferInit({
      user_id: id,
    }).subscribe(res => {
      for (let item in res.result) {
        if (item) {
          if (Number(item) === id) { // 列表id
            this.listMoney = res.result[item];
          } else {   // 登入 id
            this.loginMoney = res.result[item];
          }
        }
      }
      if (type === 5) {   // 转入
        this.current_money = this.loginMoney;
      } else {   // 转出
        this.current_money = this.listMoney;
      }
    })
    this._dialog.open(this.transferIn_template_ref, {title: type === 5 ? '金额转入' : '金额转出', flag: true, async: true}).subscribe((data: any) => {
      if (data) {
        if (!this.transFormRef['valid'] || (this.form.money > this.current_money)) {
          this.valid = true;
          return
        }
        data();
        this._financeService.transferPost(
          this.form
        ).subscribe(res => {
          if (res.success === 200) {
            this._notification.success(type === 5 ? '金额转入成功' : '金额转出成功', ' ');
            this.init();
            this.search();
          }
        }, (error) => {})
      } else {
        this.valid = false;
      }
    });
  }

}
