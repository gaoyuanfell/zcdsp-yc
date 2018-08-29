import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ReportService} from '../../../../service/agent/report.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.less']
})
export class LogsComponent implements OnInit {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _reportService: ReportService
  ) {
  }

  total_count;
  tableList: Array<any>;
  user: any = {};
  userInfo: any = {};
  query: any = {
    page_index: 1,
    page_size: 10,
    begin_date: new Date().calendar(2, -1).formatDate('yyyy-MM-dd'),
    end_date: new Date().formatDate('yyyy-MM-dd'),
  };

  ngOnInit() {
    this.init();
    this.list();
  }

  list() {
    this._reportService.logsList(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
    })
  }

  init() {
    this._reportService.init().subscribe(res => {
      this.user = res.result;
    })
    this._reportService.listinit().subscribe(res => {
      this.userInfo = res.result.user;
    })
  }

  search() {
    this.query.page_index = 1;
    this.list();
  }


}

