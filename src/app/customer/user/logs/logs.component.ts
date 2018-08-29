import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CustomerUserService} from '../../../../service/customer/customer-user.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.less']
})
export class LogsComponent implements OnInit {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _customerUserService: CustomerUserService,
    private route: ActivatedRoute
  ) {
  }

  total_count;
  tableList: Array<any>;
  listTitle;
  authList;
  authUser;
  user;
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

  list() {
    this._customerUserService.logsList(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
    })
  }

  init() {
    this._customerUserService.init().subscribe(res => {
      this.user = res.result;
    })
  }

  search() {
    this.query.page_index = 1;
    this.list();
  }

}

