import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {CustomerUserService} from '../../../../service/customer/customer-user.service';
import {Notification} from '../../../../components/notification/notification';
import {ActivatedRoute} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {Global} from '../../../../service/global';
import {ScrollService} from '../../../../components/back-top/scroll.service';


@Component({
  selector: 'app-remind',
  templateUrl: './remind.component.html',
  styleUrls: ['./remind.component.less']
})
export class RemindComponent implements OnInit {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _customerUserService: CustomerUserService,
    private _notification: Notification,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private _global: Global,
    private _scrollService: ScrollService,
  ) {
  }

  tableList: Array<any>;
  listTitle;
  flag;
  is_all;
  num: any;
  userData: any;
  authList;
  authUser;

  ngOnInit() {
    const obj = this.route.snapshot.data['auth'];
    this.authList = Object.keys(obj['jurisdiction_list']);
    this.authUser = obj['user'];
    this.list();
  }



  list() {
    this._customerUserService.remindList().subscribe(res => {
      this.userData = res.result;
      this.tableList = res.result.list;
      this.tableList.forEach((item) => {
        if (item.remind_key === 'BALANCE_ALERT') {  // 账户余额特殊处理
          item.check_alert = item.remind_scope.replace(/{{remind_balance}}/gi, res.result.remind_balance)
        }
      })
      let index = 0;
      this.tableList.forEach((item) => {
        if (item.is_active === 'Y') {
          index++;
          item.is_active = true;
        } else {
          item.is_active = false;
        }
      })
      this.is_all = index === this.tableList.length;
      this.num = index === this.tableList.length ? 1 : index === 0 ? 0 : 2;
    })
  }
  // 总开关开着：下面的可以自己打开或者关闭
  // 总开关关闭：下面的不能打开

  changeCheckbox() {
    this.tableList.forEach((item) => {
      item.is_active = this.is_all;
    })
    this.num =  this.is_all ? 1 : 0;
  }

  onlyChange(event) {
    let index = 0;
    for (let i = 0; i < this.tableList.length; i++) {
      if (!this.tableList[i].is_active) {
        this.is_all = false;
      } else {
        index++;
      }
    }
    this.is_all = index === this.tableList.length ? true : false;
    this.num = index === this.tableList.length ? 1 : index === 0 ? 0 : 2;
  }

  asd(target, value) {
    let offsetTop = target.offsetTop;
    target = target.offsetParent;
    while (target != value) {
      offsetTop += target.offsetTop;
      target = target.offsetParent;
    }
    return offsetTop;
  }

  save(infoForm) {

    for (let item in  infoForm.controls) {
      if (item) {
        const el = <Element>this.document.getElementsByName(item)[0] ? this.document.getElementsByName(item)[0] : this.document.getElementById(item);
        if (infoForm.controls[item].invalid) {
          let top = this.asd(el, this._global.containerFullRef)
          this._scrollService.scrollTo(this._global.containerFullRef, {top: top - el.clientHeight})
          break;
        }
      }
    }
    if (!infoForm.valid) {
      this._notification.error('信息填写错误', ' ')
      return;
    }

    const obj = JSON.parse(JSON.stringify(this.tableList));
    obj.forEach((item) => {
      item.is_active = item.is_active === true ? 'Y' : 'N';
    })
    this._customerUserService.remindUpdate(obj).subscribe(res => {
      if (res.success === 200) {
        this._notification.success('保存成功', '修改用户预警成功')
        this.list();
      }
    })
  }

  setInvalidClass(form, formControl) {
    let cl;
    if (formControl && formControl.invalid && (formControl.dirty || formControl.touched || form.submitted)) {
      cl = 'has-error';
    }
    return cl;
  }


}

