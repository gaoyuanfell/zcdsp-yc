import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AgentUserService} from '../../../../service/agent/agent-user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PublicService} from '../../../../service/public.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.less']
})
export class CustomerComponent implements OnInit {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _agentUserService: AgentUserService,
    private _publicService: PublicService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  total_count;
  tableList: Array<any>;
  listTitle;

  audit_status_list; // 审核状态
  audit_total = 0;
  userData: any = {};
  query: any = {
    page_index: 1,
    page_size: 10
  };

  authList;
  authUser;
  ngOnInit() {
    const obj = this.route.snapshot.data['auth'];
    this.authList = Object.keys(obj['jurisdiction_list']);
    this.authUser = obj['user'];
    this.init();
    this.list();
  }
  isPermit(type) {
    return this.authList.indexOf(type) > -1
  }
  zc_audit_status

  auditStatusChange() {
    if (this.zc_audit_status) {
      this.query.zc_audit_status = this.zc_audit_status.join(',');
    } else {
      delete this.query.zc_audit_status
    }
    this.search();
  }

  search() {
    this.query.page_index = 1;
    this.list();
  }

  list() {
    this._agentUserService.childList(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
    })
  }

  init() {
    this._agentUserService.listInit().subscribe(res => {
      this.audit_status_list = res.result.user_state_count;
      // this.audit_total = this.audit_status_list.reduce((total, item) => {
      //       return total +  Number(item.entry_sequence)
      // }, 0)
      this.userData = res.result.user;
    })
  }

  exportUrl() {
    let url = this._agentUserService.listExport({
      ...this.query
    });
    window.open(url);
  }

  addCustomer() {
    this.router.navigate(['/us/user/info', 0])
    // this.router.navigate(['/us/user/info'], {
    //   queryParams: {
    //     user_id: '',
    //     type: 'add'audit_status_list
    //   }
    // });
  }

  editCustomer(id) {
    this.router.navigate(['/us/user/info', id]);
  }

  sublogin(user_id) {
    // 浏览器出现拦截 先在异步外面打开页面
    const tem = window.open(); // 先打开页面
    this._publicService.sublogin({user_id: user_id}).subscribe(res => {
        if (res.success === 200) {
          tem.location.href = this._publicService.goHome({token: res.result})
        }
      },
      () => {
        tem.close()
      }
    )
  }

}
