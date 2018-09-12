import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ReportService} from '../../../../service/agent/report.service';
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
    private _reportService: ReportService,
    private _publicService: PublicService,
    private route: ActivatedRoute,
    private _router: Router
  ) {
  }

  total_count;
  tableList: Array<any>;
  listTitle;
  user_list: Array<any>;
  authList;
  authUser;
  query: any = {
    page_index: 1,
    page_size: 10,
    begin_date: new Date().calendar(2, -1).formatDate('yyyy-MM-dd'),
    end_date: new Date().formatDate('yyyy-MM-dd'),
  };

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
    this._reportService.childList(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
      this.listTitle = res.result.other;
    })
  }

  init() {
    this._reportService.childInit().subscribe(res => {
      this.user_list = res.result.user_list;
      this.user_list.forEach( item => item.all_name = item.user_name + item.nick_name)
    })
  }

  exportUrl() {
    let url = this._reportService.childExport({
      ...this.query
    });
    window.open(url);
  }

  sublogin(user_id, type) {
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
